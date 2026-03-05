// Chromabase API Client - connects to Express API at localhost:3010
// Originally Firebase, now uses custom API

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

if (!API_BASE && typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.warn('[ChromaBase] NEXT_PUBLIC_API_URL is not set. API calls will likely fail.');
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${endpoint}`);

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result && result.status === 'error') {
        console.error(`[API Error] ${endpoint}:`, result.message);
        throw new Error(result.message || `API returned error status`);
    }

    return result.data !== undefined ? result.data : result;
}

// Map collection names to API endpoints
const ENDPOINT_MAP: Record<string, string> = {
    clients: '/api/clients',
    leads: '/api/leads',
    deals: '/api/deals',
    tasks: '/api/tasks',
    proposals: '/api/proposals',
    quotes: '/api/quotes',
    campaigns: '/api/campaigns',
    activities: '/api/activities',
    team: '/api/team',
    accounts: '/api/accounts',
};

function getEndpoint(collectionName: string): string {
    return ENDPOINT_MAP[collectionName] || `/api/${collectionName}`;
}

export const getDocument = async <T = unknown>(collectionName: string, id: string): Promise<T | null> => {
    return apiRequest<T>(`${getEndpoint(collectionName)}/${id}`);
};

export const getDocuments = async <T = unknown>(collectionName: string): Promise<T[]> => {
    try {
        const data = await apiRequest<T[]>(getEndpoint(collectionName));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.warn(`[Firestore] Failed to fetch collection ${collectionName}, falling back to empty array:`, error);
        return [];
    }
};

export const addDocument = async <T = unknown>(collectionName: string, data: Partial<T>): Promise<string> => {
    const result = await apiRequest<{ id: string }>(getEndpoint(collectionName), {
        method: 'POST',
        body: JSON.stringify(data),
    });
    return result.id;
};

export const updateDocument = async <T = unknown>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
    await apiRequest(`${getEndpoint(collectionName)}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
    await apiRequest(`${getEndpoint(collectionName)}/${id}`, {
        method: 'DELETE',
    });
};

export const bulkDeleteDocuments = async (collectionName: string, ids: string[]): Promise<void> => {
    await apiRequest(`${getEndpoint(collectionName)}/bulk-delete`, {
        method: 'POST',
        body: JSON.stringify({ ids }),
    });
};

export const bulkUpdateDocuments = async <T = unknown>(collectionName: string, ids: string[], data: Partial<T>): Promise<void> => {
    const endpoint = `${getEndpoint(collectionName)}/bulk-update`;
    const payload = JSON.stringify({ ids, data });

    try {
        await apiRequest(endpoint, {
            method: 'PUT',
            body: payload,
        });
        return;
    } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : '';
        if (!message.includes('not found')) {
            throw error;
        }
    }

    try {
        await apiRequest(endpoint, {
            method: 'POST',
            body: payload,
        });
        return;
    } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : '';
        if (!message.includes('not found')) {
            throw error;
        }
    }

    await Promise.all(ids.map((id) => updateDocument<T>(collectionName, id, data)));
};
