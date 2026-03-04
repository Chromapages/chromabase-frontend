import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, addDocument, updateDocument, deleteDocument, getDocument, bulkDeleteDocuments, bulkUpdateDocuments } from '@/lib/firestore';

export function useEntity<T extends { id: string }>(collectionName: string, mockData: T[] = []) {
    const queryClient = useQueryClient();
    const queryKey = [collectionName];

    const useList = () => useQuery({
        queryKey,
        queryFn: async (): Promise<T[]> => {
            console.log(`[useEntity] Fetching list for ${collectionName}`);
            try {
                const data = await getDocuments<T>(collectionName);
                console.log(`[useEntity] Fetched ${data.length} items from ${collectionName}`);
                return data;
            } catch (err) {
                console.error(`[useEntity] Error fetching ${collectionName}:`, err);
                throw err;
            }
        },
    });

    const useGet = (id: string, options?: { enabled?: boolean }) => useQuery({
        queryKey: [...queryKey, id],
        queryFn: async (): Promise<T | null> => {
            return getDocument<T>(collectionName, id);
        },
        enabled: options?.enabled !== undefined ? options.enabled : !!id,
    });

    const useCreate = () => useMutation({
        mutationFn: async (data: Partial<Omit<T, 'id'>>) => {
            const id = await addDocument<T>(collectionName, data as Partial<T>);
            return { id, ...data } as unknown as T;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const useUpdate = () => useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
            await updateDocument<T>(collectionName, id, data);
            return { id, ...data } as T;
        },
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey });
            await queryClient.cancelQueries({ queryKey: [...queryKey, id] });

            const previousItems = queryClient.getQueryData<T[]>(queryKey);
            const previousItem = queryClient.getQueryData<T>([...queryKey, id]);

            queryClient.setQueryData<T[]>(queryKey, (old) => {
                if (!old) return old;
                return old.map(item => item.id === id ? { ...item, ...data } : item);
            });

            queryClient.setQueryData<T>([...queryKey, id], (old) => {
                if (!old) return old;
                return { ...old, ...data };
            });

            return { previousItems, previousItem };
        },
        onError: (err, variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(queryKey, context.previousItems);
            }
            if (context?.previousItem) {
                queryClient.setQueryData([...queryKey, (variables as { id: string }).id], context.previousItem);
            }
            console.error(`[useEntity] Error updating ${collectionName}:`, err);
        },
        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: [...queryKey, (variables as { id: string }).id] });
        },
    });

    const useDelete = () => useMutation({
        mutationFn: async (id: string) => {
            await deleteDocument(collectionName, id);
            return id;
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey });
            const previousItems = queryClient.getQueryData<T[]>(queryKey);
            queryClient.setQueryData<T[]>(queryKey, (old) => {
                if (!old) return old;
                return old.filter(item => item.id !== id);
            });
            return { previousItems };
        },
        onError: (err, id, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(queryKey, context.previousItems);
            }
            console.error(`[useEntity] Error deleting from ${collectionName}:`, err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const useBulkDelete = () => useMutation({
        mutationFn: async (ids: string[]) => {
            await bulkDeleteDocuments(collectionName, ids);
            return ids;
        },
        onMutate: async (ids: string[]) => {
            await queryClient.cancelQueries({ queryKey });
            const previousItems = queryClient.getQueryData<T[]>(queryKey);
            queryClient.setQueryData<T[]>(queryKey, (old) => {
                if (!old) return old;
                return old.filter(item => !ids.includes(item.id));
            });
            return { previousItems };
        },
        onError: (err, ids, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(queryKey, context.previousItems);
            }
            console.error(`[useEntity] Error bulk deleting from ${collectionName}:`, err);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const useBulkUpdate = () => useMutation({
        mutationFn: async ({ ids, data }: { ids: string[]; data: Partial<T> }) => {
            await bulkUpdateDocuments<T>(collectionName, ids, data);
            return { ids, data };
        },
        onSuccess: ({ ids }) => {
            queryClient.invalidateQueries({ queryKey });
            ids.forEach(id => queryClient.invalidateQueries({ queryKey: [...queryKey, id] }));
        },
    });

    return { useList, useGet, useCreate, useUpdate, useDelete, useBulkDelete, useBulkUpdate };
}
