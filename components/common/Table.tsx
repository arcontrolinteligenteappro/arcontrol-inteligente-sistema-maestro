
import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T;
    isCurrency?: boolean;
    render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    renderActions?: (row: T) => React.ReactNode;
}

const Table = <T extends { id: string }>(
    { columns, data, renderActions }: TableProps<T>
): React.ReactElement => {

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    };

    return (
        <div className="overflow-x-auto bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg">
            <table className="min-w-full divide-y divide-green-500/20">
                <thead className="bg-green-900/30">
                    <tr>
                        {columns.map((col) => (
                            <th 
                                key={String(col.accessor)}
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-green-300 uppercase tracking-wider"
                            >
                                {col.header}
                            </th>
                        ))}
                        {renderActions && (
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-green-500/20">
                    {data.length > 0 ? data.map((row, index) => (
                        <tr 
                            key={row.id} 
                            className="hover:bg-green-900/20 transition-colors duration-150 table-row-enter"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {columns.map((col) => (
                                <td key={String(col.accessor)} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                    {col.render ? col.render(row) : (
                                        col.isCurrency && typeof row[col.accessor] === 'number'
                                        ? formatCurrency(row[col.accessor] as number)
                                        : String(row[col.accessor] ?? '')
                                    )}
                                </td>
                            ))}
                            {renderActions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {renderActions(row)}
                                </td>
                            )}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={columns.length + (renderActions ? 1 : 0)} className="text-center py-10 text-gray-500">
                                :: No data found ::
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
