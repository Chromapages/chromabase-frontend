import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus } from "lucide-react"

interface FilterBarProps {
    searchQuery?: string;
    onSearchChange?: (val: string) => void;
    searchPlaceholder?: string;
    onFilterClick?: () => void;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ElementType;
    };
    className?: string;
}

export function FilterBar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    onFilterClick,
    actionButton,
    className
}: FilterBarProps) {
    const ActionIcon = actionButton?.icon || Plus;

    return (
        <div className={cn("flex flex-col sm:flex-row gap-4 items-center justify-between mb-6", className)}>
            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={searchPlaceholder}
                        className="pl-9 bg-card border-border/50 h-10 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                    />
                </div>
                {onFilterClick && (
                    <Button variant="outline" size="icon" onClick={onFilterClick} className="shrink-0 bg-card h-10 w-10 border-border/50 shadow-sm">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </Button>
                )}
            </div>

            {actionButton && (
                <Button onClick={actionButton.onClick} className="w-full sm:w-auto h-10 shadow-sm">
                    <ActionIcon className="h-4 w-4 mr-2" />
                    {actionButton.label}
                </Button>
            )}
        </div>
    )
}
