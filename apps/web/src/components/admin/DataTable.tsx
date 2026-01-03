import { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface Column<T> {
    key: string
    label: string
    sortable?: boolean
    render?: (item: T) => React.ReactNode
    className?: string
    hideOnMobile?: boolean // Hide this column on mobile card view
    primary?: boolean // Show as main title on mobile card
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    searchKeys?: string[]
    searchPlaceholder?: string
    pageSize?: number
    onRowClick?: (item: T) => void
    emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    searchKeys = [],
    searchPlaceholder = 'Search...',
    pageSize = 10,
    onRowClick,
    emptyMessage = 'No data found',
}: DataTableProps<T>) {
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [sortKey, setSortKey] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

    // Filter data based on search
    const filteredData = useMemo(() => {
        if (!search || searchKeys.length === 0) return data

        const searchLower = search.toLowerCase()
        return data.filter((item) =>
            searchKeys.some((key) => {
                const value = getNestedValue(item, key)
                return value?.toString().toLowerCase().includes(searchLower)
            })
        )
    }, [data, search, searchKeys])

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData

        return [...filteredData].sort((a, b) => {
            const aVal = getNestedValue(a, sortKey)
            const bVal = getNestedValue(b, sortKey)

            if (aVal === bVal) return 0
            if (aVal === null || aVal === undefined) return 1
            if (bVal === null || bVal === undefined) return -1

            const comparison = aVal < bVal ? -1 : 1
            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [filteredData, sortKey, sortDirection])

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / pageSize)
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return sortedData.slice(start, start + pageSize)
    }, [sortedData, currentPage, pageSize])

    // Reset to page 1 when search changes
    useMemo(() => {
        setCurrentPage(1)
    }, [search])

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortKey(key)
            setSortDirection('asc')
        }
    }

    const getSortIcon = (key: string) => {
        if (sortKey !== key) return <ArrowUpDown size={14} className="opacity-40" />
        return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
    }

    // Get columns for mobile view
    const mobileColumns = columns.filter(col => !col.hideOnMobile && col.key !== 'actions')
    const actionsColumn = columns.find(col => col.key === 'actions')
    const primaryColumn = columns.find(col => col.primary) || columns[0]

    return (
        <div className="space-y-4">
            {/* Search */}
            {searchKeys.length > 0 && (
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            )}

            {/* Desktop Table - hidden on small screens */}
            <div className="hidden sm:block bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-border bg-secondary/50">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={`text-left py-3 px-4 text-xs lg:text-sm font-medium text-muted-foreground whitespace-nowrap ${col.className || ''}`}
                                    >
                                        {col.sortable ? (
                                            <button
                                                onClick={() => handleSort(col.key)}
                                                className="flex items-center gap-1 hover:text-foreground transition-colors"
                                            >
                                                {col.label}
                                                {getSortIcon(col.key)}
                                            </button>
                                        ) : (
                                            col.label
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className={`py-3 px-4 text-sm ${col.className || ''}`}>
                                                {col.render ? col.render(item) : getNestedValue(item, col.key)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View - visible only on small screens */}
            <div className="sm:hidden space-y-3">
                {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                        <div
                            key={item.id || index}
                            className={`bg-card rounded-lg border border-border p-4 ${onRowClick ? 'cursor-pointer active:bg-secondary/50' : ''}`}
                            onClick={() => onRowClick?.(item)}
                        >
                            {/* Primary/Title row */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    {primaryColumn.render ? primaryColumn.render(item) : getNestedValue(item, primaryColumn.key)}
                                </div>
                                {actionsColumn && (
                                    <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                                        {actionsColumn.render?.(item)}
                                    </div>
                                )}
                            </div>

                            {/* Other columns as label: value pairs */}
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                {mobileColumns.filter(col => col.key !== primaryColumn.key).map((col) => (
                                    <div key={col.key}>
                                        <span className="text-muted-foreground text-xs">{col.label}</span>
                                        <div className="text-foreground">
                                            {col.render ? col.render(item) : getNestedValue(item, col.key) || '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                        Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </p>
                    <div className="flex items-center gap-1">
                        <PaginationButton
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            aria-label="First page"
                        >
                            <ChevronsLeft size={16} />
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} />
                        </PaginationButton>
                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm">
                            {currentPage} / {totalPages}
                        </span>
                        <PaginationButton
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} />
                        </PaginationButton>
                        <PaginationButton
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Last page"
                        >
                            <ChevronsRight size={16} />
                        </PaginationButton>
                    </div>
                </div>
            )}
        </div>
    )
}

function PaginationButton({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
}: {
    children: React.ReactNode
    onClick: () => void
    disabled: boolean
    'aria-label': string
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            className="p-2 rounded-md border border-border hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
            {children}
        </button>
    )
}

// Helper to get nested object values like "user.name"
function getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}
