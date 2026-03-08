import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
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
    const cellPadding = dense ? "px-3 py-3" : "px-4 py-4";
    const textSize = dense ? "text-[13px]" : "text-[14px]";

    return (
        <div className="space-y-4">
            <div className="glass-md border border-white/10 rounded-sm overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-white/5 border-b border-white/5">
                        <TableRow className="hover:bg-transparent border-b-0">
                            {columns.map((col, i) => (
                                <TableHead
                                    key={i}
                                    className={cn(
                                        "h-10 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40 font-sans whitespace-nowrap",
                                        col.className,
                                        dense ? 'px-3' : 'px-4'
                                    )}
                                >
                                    {col.headerCell ? col.headerCell() : col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <span className="text-[11px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">
                                        No results found.
                                    </span>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => {
                                const key = keyExtractor(item);
                                const row = (
                                    <TableRow
                                        key={contextMenuItems ? undefined : key}
                                        onClick={() => onRowClick?.(item)}
                                        className={cn(
                                            "group border-b border-white/5 last:border-0 transition-all duration-200",
                                            onRowClick ? "cursor-pointer hover:bg-white/5" : ""
                                        )}
                                    >
                                        {columns.map((col, i) => (
                                            <TableCell
                                                key={i}
                                                className={cn(
                                                    "font-medium text-foreground/80 tracking-tight transition-colors group-hover:text-foreground",
                                                    col.className,
                                                    cellPadding,
                                                    textSize
                                                )}
                                            >
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
                                            <ContextMenuContent className="glass-md border-white/10 shadow-2xl w-56 p-1">
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
                <div className={cn(
                    "flex items-center justify-between",
                    dense ? 'py-1' : 'py-2'
                )}>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40">
                        Page <span className="text-foreground/60">{page || 1}</span> <span className="mx-1">/</span> <span className="text-foreground/60">{totalPages}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="glass"
                            size="sm"
                            onClick={() => onPageChange?.((page || 1) - 1)}
                            disabled={!page || page <= 1}
                            className="h-8 px-3 rounded-sm text-[10px] font-bold uppercase tracking-widest border-white/5"
                        >
                            <ChevronLeft className="h-3 w-3 mr-1" />
                            Prev
                        </Button>
                        <Button
                            variant="glass"
                            size="sm"
                            onClick={() => onPageChange?.((page || 1) + 1)}
                            disabled={!page || page >= totalPages}
                            className="h-8 px-3 rounded-sm text-[10px] font-bold uppercase tracking-widest border-white/5"
                        >
                            Next
                            <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
