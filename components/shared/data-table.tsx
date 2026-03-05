import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ReactNode } from "react"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent } from "@/components/ui/context-menu"

export interface Column<T> {
    header: string;
    headerCell?: () => ReactNode;
    accessorKey?: keyof T;
    cell?: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string;
    onRowClick?: (item: T) => void;
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    dense?: boolean;
    contextMenuItems?: (item: T) => ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    onRowClick,
    page,
    totalPages,
    onPageChange,
    dense = false,
    contextMenuItems,
}: DataTableProps<T>) {
    const cellPadding = dense ? "px-2 py-1.5" : "px-3 py-2";
    const textSize = dense ? "text-sm" : "text-base";
    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col, i) => (
                                <TableHead key={i} className={`${col.className} ${dense ? 'px-2 py-2 text-sm' : ''}`}>
                                    {col.headerCell ? col.headerCell() : col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => {
                                const key = keyExtractor(item);
                                const row = (
                                    <TableRow
                                        key={contextMenuItems ? undefined : key}
                                        onClick={() => onRowClick?.(item)}
                                        className={`group ${onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
                                    >
                                        {columns.map((col, i) => (
                                            <TableCell key={i} className={`${col.className} ${cellPadding} ${textSize}`}>
                                                {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? '') : null}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );

                                if (contextMenuItems) {
                                    return (
                                        <ContextMenu key={key}>
                                            <ContextMenuTrigger asChild>
                                                {row}
                                            </ContextMenuTrigger>
                                            <ContextMenuContent className="w-48">
                                                {contextMenuItems(item)}
                                            </ContextMenuContent>
                                        </ContextMenu>
                                    );
                                }

                                return row;
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages !== undefined && totalPages > 1 && (
                <div className={`flex items-center justify-between ${dense ? 'py-1' : 'py-2'}`}>
                    <div className={`text-muted-foreground ${dense ? 'text-xs' : 'text-sm'}`}>
                        Page <span className="font-medium text-foreground">{page || 1}</span> of <span className="font-medium text-foreground">{totalPages}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.((page || 1) - 1)}
                            disabled={!page || page <= 1}
                            className="bg-card"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange?.((page || 1) + 1)}
                            disabled={!page || page >= totalPages}
                            className="bg-card"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
