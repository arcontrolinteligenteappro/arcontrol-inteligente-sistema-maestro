
import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import Table from './common/Table';
import { 
    mockSales, mockExpenses, mockIncome, mockProducts, mockWastage, 
    mockCustomers, mockSuppliers, mockEmployees, mockLoans, mockManufacturingOrders 
} from '../data/mockData';
import type { Sale, Expense, Income, Product, Customer, Employee } from '../types';

// --- CATEGORÍAS DE REPORTES ---
const REPORT_CATEGORIES = {
    FINANCIERO: [
        { id: 'transacciones_dia', label: 'Transacciones por Día' },
        { id: 'resumen_transacciones', label: 'Resumen de Transacciones' },
        { id: 'ingresos_extra_cat', label: 'Categoría Ingreso Extra' },
        { id: 'gastos_extra_cat', label: 'Categoría Gasto Extra' },
        { id: 'formas_pago', label: 'Formas de Pago' },
    ],
    CREDITOS: [
        { id: 'ventas_credito', label: 'Ventas a Crédito' },
        { id: 'compras_credito', label: 'Compras a Crédito' },
        { id: 'ingresos_extra_credito', label: 'Ingresos Extra (Pendientes)' },
        { id: 'gastos_extra_credito', label: 'Gastos Extra (Pendientes)' },
        { id: 'prestamos_activos', label: 'Préstamos Activos' },
        { id: 'rentas_activas', label: 'Rentas Activas' }, // Simulado
    ],
    OPERATIVO: [
        { id: 'productos_ventas', label: 'Ventas de Productos' },
        { id: 'servicios_ventas', label: 'Ventas de Servicios' },
        { id: 'manufactura_ventas', label: 'Ventas Manufactura' },
        { id: 'cotizaciones', label: 'Reporte de Cotizaciones' },
        { id: 'productos_compras', label: 'Compras de Productos' }, // Simulado con entradas
        { id: 'materia_prima_compras', label: 'Compras Materia Prima' },
        { id: 'ordenes_compra', label: 'Reporte Órdenes Compra' },
    ],
    ANALISIS: [
        { id: 'producto_analisis', label: 'Análisis por Producto' },
        { id: 'servicio_analisis', label: 'Análisis por Servicio' },
        { id: 'materia_prima_analisis', label: 'Análisis Materia Prima' },
        { id: 'manufactura_analisis', label: 'Análisis Manufactura' },
        { id: 'cat_productos_venta', label: 'Ventas por Cat. Producto' },
        { id: 'cat_productos_compra', label: 'Compras por Cat. Producto' },
    ],
    INVENTARIO: [
        { id: 'producto_inventario', label: 'Resumen Inv. Productos' },
        { id: 'materia_prima_inventario', label: 'Resumen Inv. Materia Prima' },
        { id: 'manufactura_produccion', label: 'Producción Manufactura' },
        { id: 'merma_productos', label: 'Merma de Productos' },
        { id: 'merma_materia_prima', label: 'Merma Materia Prima' },
        { id: 'modificacion_inventario', label: 'Modificaciones Inventario' },
    ],
    ENTIDADES: [
        { id: 'clientes_listado', label: 'Listado de Clientes' },
        { id: 'clientes_historial', label: 'Historial Clientes' },
        { id: 'proveedores_listado', label: 'Listado Proveedores' },
        { id: 'proveedores_historial', label: 'Historial Proveedores' },
        { id: 'empleados_listado', label: 'Listado Empleados' },
        { id: 'empleados_historial', label: 'Historial Empleados' },
    ],
    ETIQUETAS: [
        { id: 'etiqueta_venta', label: 'Etiquetas de Venta' },
        { id: 'etiqueta_compra', label: 'Etiquetas de Compra' },
    ]
};

const Reports: React.FC = () => {
    // --- STATE ---
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedReportId, setSelectedReportId] = useState<string>('transacciones_dia');
    const [reportData, setReportData] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0, count: 0 });

    // --- HELPERS ---
    const isWithinDate = (dateStr: string) => dateStr >= startDate && dateStr <= endDate;

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

    // --- REPORT GENERATOR ENGINE ---
    useEffect(() => {
        let data: any[] = [];
        let cols: any[] = [];
        let totalIncome = 0;
        let totalExpense = 0;

        switch (selectedReportId) {
            // --- FINANCIERO ---
            case 'transacciones_dia':
                cols = [ { header: 'Fecha', accessor: 'date' }, { header: 'Tipo', accessor: 'type' }, { header: 'Descripción/Cliente', accessor: 'desc' }, { header: 'Monto', accessor: 'amount', isCurrency: true } ];
                // Combine Sales, Income, Expenses
                const salesTrans = mockSales.filter(s => isWithinDate(s.date) && s.status === 'Completed').map(s => ({ date: s.date, type: s.type, desc: s.customerName, amount: s.total, flow: 'in' }));
                const incTrans = mockIncome.filter(i => isWithinDate(i.date)).map(i => ({ date: i.date, type: 'Ingreso Extra', desc: i.description, amount: i.amount, flow: 'in' }));
                const expTrans = mockExpenses.filter(e => isWithinDate(e.date)).map(e => ({ date: e.date, type: 'Gasto', desc: e.description, amount: e.amount, flow: 'out' }));
                
                data = [...salesTrans, ...incTrans, ...expTrans].sort((a,b) => a.date.localeCompare(b.date));
                totalIncome = data.filter(d => d.flow === 'in').reduce((acc, curr) => acc + curr.amount, 0);
                totalExpense = data.filter(d => d.flow === 'out').reduce((acc, curr) => acc + curr.amount, 0);
                break;

            case 'resumen_transacciones':
                // Group by type
                cols = [ { header: 'Concepto', accessor: 'concept' }, { header: 'Cantidad Op.', accessor: 'count' }, { header: 'Total', accessor: 'total', isCurrency: true } ];
                const summaryMap: Record<string, {count:number, total:number, flow: 'in'|'out'}> = {};
                
                const processTrans = (items: any[], typeLabel: string, flow: 'in'|'out', amountKey = 'amount') => {
                    items.forEach(i => {
                        if(!isWithinDate(i.date)) return;
                        if(!summaryMap[typeLabel]) summaryMap[typeLabel] = { count: 0, total: 0, flow };
                        summaryMap[typeLabel].count++;
                        summaryMap[typeLabel].total += (i[amountKey] || i.total || 0);
                    });
                };

                processTrans(mockSales.filter(s => s.type === 'Venta'), 'Ventas Mostrador', 'in', 'total');
                processTrans(mockSales.filter(s => s.type === 'Servicio'), 'Servicios', 'in', 'total');
                processTrans(mockIncome, 'Ingresos Extra', 'in');
                processTrans(mockExpenses, 'Gastos Operativos', 'out');
                
                data = Object.entries(summaryMap).map(([k, v]) => ({ id: k, concept: k, ...v }));
                totalIncome = data.filter(d => d.flow === 'in').reduce((acc, curr) => acc + curr.total, 0);
                totalExpense = data.filter(d => d.flow === 'out').reduce((acc, curr) => acc + curr.total, 0);
                break;

            case 'formas_pago':
                cols = [{ header: 'Método', accessor: 'method' }, { header: 'Total', accessor: 'total', isCurrency: true }];
                const methodMap: Record<string, number> = {};
                mockSales.filter(s => isWithinDate(s.date) && s.status === 'Completed').forEach(s => {
                    const m = s.paymentMethod || 'No especificado';
                    methodMap[m] = (methodMap[m] || 0) + s.amountPaid;
                });
                data = Object.entries(methodMap).map(([k, v]) => ({ id: k, method: k, total: v }));
                totalIncome = data.reduce((acc, curr) => acc + curr.total, 0);
                break;

            // --- CREDITOS ---
            case 'ventas_credito':
                cols = [{ header: 'Fecha', accessor: 'date' }, { header: 'Cliente', accessor: 'customerName' }, { header: 'Total Venta', accessor: 'total', isCurrency: true }, { header: 'Pagado', accessor: 'paid', isCurrency: true }, { header: 'Deuda', accessor: 'debt', isCurrency: true }];
                data = mockSales.filter(s => isWithinDate(s.date) && s.paymentStatus !== 'Pagado' && s.type !== 'Compra' && s.type !== 'Cotización').map(s => ({
                    id: s.id, date: s.date, customerName: s.customerName, total: s.total, paid: s.amountPaid, debt: s.total - s.amountPaid
                }));
                totalIncome = data.reduce((acc, curr) => acc + curr.debt, 0); // En este caso "Balance" muestra la deuda total
                break;

            case 'compras_credito':
                cols = [{ header: 'Fecha', accessor: 'date' }, { header: 'Proveedor', accessor: 'customerName' }, { header: 'Total Compra', accessor: 'total', isCurrency: true }, { header: 'Deuda', accessor: 'debt', isCurrency: true }];
                data = mockSales.filter(s => isWithinDate(s.date) && s.paymentStatus !== 'Pagado' && s.type === 'Compra').map(s => ({
                    id: s.id, date: s.date, customerName: s.customerName, total: s.total, debt: s.total - s.amountPaid
                }));
                totalExpense = data.reduce((acc, curr) => acc + curr.debt, 0);
                break;

            case 'prestamos_activos':
                cols = [{ header: 'Fecha', accessor: 'date' }, { header: 'Empleado', accessor: 'employee' }, { header: 'Monto Original', accessor: 'amount', isCurrency: true }, { header: 'Estado', accessor: 'status' }];
                data = mockLoans.filter(l => isWithinDate(l.date) && l.status === 'Pendiente').map(l => {
                    const emp = mockEmployees.find(e => e.id === l.employeeId);
                    return { id: l.id, date: l.date, employee: emp?.name || l.employeeId, amount: l.amount, status: l.status };
                });
                totalExpense = data.reduce((acc, curr) => acc + curr.amount, 0);
                break;

            // --- OPERATIVO ---
            case 'productos_ventas':
                cols = [{ header: 'Producto', accessor: 'name' }, { header: 'Cant. Vendida', accessor: 'qty' }, { header: 'Ingreso Generado', accessor: 'revenue', isCurrency: true }];
                const prodSalesMap: Record<string, {qty: number, rev: number}> = {};
                mockSales.filter(s => isWithinDate(s.date) && s.status === 'Completed' && s.type === 'Venta').forEach(s => {
                    s.products.forEach(p => {
                        if(!prodSalesMap[p.name]) prodSalesMap[p.name] = { qty: 0, rev: 0 };
                        prodSalesMap[p.name].qty += p.quantity;
                        prodSalesMap[p.name].rev += (p.price * p.quantity);
                    });
                });
                data = Object.entries(prodSalesMap).map(([k, v]) => ({ id: k, name: k, qty: v.qty, revenue: v.rev }));
                totalIncome = data.reduce((acc, curr) => acc + curr.revenue, 0);
                break;

            case 'cotizaciones':
                cols = [{ header: 'Folio', accessor: 'id' }, { header: 'Cliente', accessor: 'customerName' }, { header: 'Fecha', accessor: 'date' }, { header: 'Total', accessor: 'total', isCurrency: true }];
                data = mockSales.filter(s => isWithinDate(s.date) && s.type === 'Cotización');
                totalIncome = data.reduce((acc, curr) => acc + curr.total, 0); // Potencial venta
                break;

            // --- INVENTARIO ---
            case 'producto_inventario':
                cols = [{ header: 'SKU', accessor: 'sku' }, { header: 'Nombre', accessor: 'name' }, { header: 'Stock Actual', accessor: 'stock' }, { header: 'Costo Unit.', accessor: 'cost', isCurrency: true }, { header: 'Valor Inventario', accessor: 'val', isCurrency: true }];
                data = mockProducts.filter(p => p.productType === 'Producto').map(p => ({
                    id: p.id, sku: p.sku, name: p.name, stock: p.stock, cost: p.cost, val: (p.stock || 0) * p.cost
                }));
                totalIncome = data.reduce((acc, curr) => acc + curr.val, 0); // Valor total
                break;

            case 'merma_productos':
                cols = [{ header: 'Fecha', accessor: 'date' }, { header: 'Producto', accessor: 'productName' }, { header: 'Cantidad', accessor: 'quantity' }, { header: 'Razón', accessor: 'reason' }];
                data = mockWastage.filter(w => isWithinDate(w.date));
                break;

            // --- ANALISIS ---
            case 'cat_productos_venta':
                cols = [{ header: 'Categoría', accessor: 'category' }, { header: 'Items Vendidos', accessor: 'qty' }, { header: 'Total Ventas', accessor: 'total', isCurrency: true }];
                const catMap: Record<string, {qty: number, total: number}> = {};
                mockSales.filter(s => isWithinDate(s.date) && s.status === 'Completed').forEach(s => {
                    s.products.forEach(p => {
                        const prodRef = mockProducts.find(mp => mp.id === p.productId);
                        const cat = prodRef?.category || 'Sin Categoría';
                        if(!catMap[cat]) catMap[cat] = { qty: 0, total: 0 };
                        catMap[cat].qty += p.quantity;
                        catMap[cat].total += (p.price * p.quantity);
                    });
                });
                data = Object.entries(catMap).map(([k,v]) => ({ id: k, category: k, ...v }));
                totalIncome = data.reduce((acc, curr) => acc + curr.total, 0);
                break;

            // --- ENTIDADES ---
            case 'clientes_historial':
                cols = [{ header: 'Cliente', accessor: 'name' }, { header: 'Total Comprado', accessor: 'bought', isCurrency: true }, { header: 'Ultima Compra', accessor: 'last' }];
                data = mockCustomers.map(c => {
                    // Calc total specific to date range if needed, or global
                    const totalInRange = mockSales.filter(s => s.customerId === c.id && isWithinDate(s.date) && s.type !== 'Compra').reduce((acc, s) => acc + s.total, 0);
                    return { id: c.id, name: c.name, bought: totalInRange, last: c.lastPurchase };
                }).filter(r => r.bought > 0);
                totalIncome = data.reduce((acc, curr) => acc + curr.bought, 0);
                break;

            case 'etiqueta_venta':
                // Simula una lista para imprimir etiquetas
                cols = [{ header: 'SKU', accessor: 'sku' }, { header: 'Producto', accessor: 'name' }, { header: 'Precio', accessor: 'price', isCurrency: true }, { header: 'Imprimir', accessor: 'print' }];
                data = mockProducts.filter(p => p.productType === 'Producto').map(p => ({
                    id: p.id, sku: p.sku, name: p.name, price: p.price, print: '🖨️'
                }));
                break;

            default:
                cols = [{ header: 'Info', accessor: 'info' }];
                data = [{ id: '1', info: 'Seleccione un reporte válido o en desarrollo.' }];
        }

        setColumns(cols);
        setReportData(data);
        setSummary({
            income: totalIncome,
            expense: totalExpense,
            balance: totalIncome - totalExpense,
            count: data.length
        });

    }, [selectedReportId, startDate, endDate]);

    return (
        <div className="flex flex-col h-full">
            <Header title="Generador de Reportes Avanzado" />

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* --- SIDEBAR MENU --- */}
                <div className="w-full lg:w-64 flex-shrink-0 bg-black/40 border border-green-500/20 rounded-lg overflow-y-auto custom-scrollbar p-2 h-auto max-h-[300px] lg:max-h-full lg:h-full">
                    <h3 className="text-green-400 font-bold mb-3 px-2 text-sm uppercase tracking-wider">Tipos de Reporte</h3>
                    <div className="space-y-4">
                        {Object.entries(REPORT_CATEGORIES).map(([catName, reports]) => (
                            <div key={catName}>
                                <h4 className="text-xs font-bold text-gray-500 px-2 mb-1">{catName}</h4>
                                <div className="space-y-1">
                                    {reports.map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => setSelectedReportId(r.id)}
                                            className={`w-full text-left px-3 py-2 rounded text-xs lg:text-sm transition-colors ${
                                                selectedReportId === r.id 
                                                ? 'bg-green-900/60 text-white border-l-2 border-green-400' 
                                                : 'text-gray-400 hover:bg-gray-800 hover:text-green-300'
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    
                    {/* CONTROLS */}
                    <div className="bg-black/50 border border-green-500/20 p-4 rounded-lg mb-4 flex flex-wrap items-end gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Fecha Inicial</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-style py-1 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Fecha Final</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-style py-1 text-sm" />
                        </div>
                        <div className="flex-1 text-right">
                            <button onClick={() => window.print()} className="px-4 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 rounded hover:bg-blue-800/50 text-sm">
                                🖨️ Imprimir / PDF
                            </button>
                        </div>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                            <p className="text-xs text-gray-500">Registros</p>
                            <p className="text-xl font-bold text-white">{summary.count}</p>
                        </div>
                        {(summary.income > 0 || summary.expense > 0) && (
                            <>
                                <div className="bg-green-900/20 p-3 rounded border border-green-500/20">
                                    <p className="text-xs text-green-400">Total Ingresos/Valor</p>
                                    <p className="text-xl font-bold text-green-300">{formatCurrency(summary.income)}</p>
                                </div>
                                <div className="bg-red-900/20 p-3 rounded border border-red-500/20">
                                    <p className="text-xs text-red-400">Total Egresos/Deuda</p>
                                    <p className="text-xl font-bold text-red-300">{formatCurrency(summary.expense)}</p>
                                </div>
                                <div className="bg-blue-900/20 p-3 rounded border border-blue-500/20">
                                    <p className="text-xs text-blue-400">Balance / Neto</p>
                                    <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-blue-300' : 'text-red-400'}`}>{formatCurrency(summary.balance)}</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-auto bg-black/30 border border-green-500/10 rounded-lg">
                        <Table columns={columns} data={reportData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
