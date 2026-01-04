
import React, { useState, useEffect, useMemo } from 'react';
import Header from './Header';
import type { Sale, Product, SaleProduct, CompanyInfo, Customer, Employee, Promotion } from '../types';
import Table from './common/Table';
import { mockSales, mockCompanyInfo, mockCustomers, mockSuppliers, mockEmployees, mockPromotions, mockProducts } from '../data/mockData';
import Modal from './common/Modal';
import ProductForm from './ProductForm';
import Ticket from './Ticket';
import BarcodeScanner from './common/BarcodeScanner';

const Sales: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>(mockSales);
    const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false); 
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    
    // Lists for selection
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [suppliers, setSuppliers] = useState<Customer[]>(mockSuppliers);
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [promotions] = useState<Promotion[]>(mockPromotions);

    const [currentSaleProducts, setCurrentSaleProducts] = useState<SaleProduct[]>([]);
    const [saleToPrint, setSaleToPrint] = useState<Sale | null>(null);
    const [companyInfo] = useState<CompanyInfo>(() => {
        const savedInfo = localStorage.getItem('companyInfo');
        return savedInfo ? JSON.parse(savedInfo) : mockCompanyInfo;
    });
    
    // Updated Form State
    const [newSaleData, setNewSaleData] = useState<{
        type: Sale['type'];
        customerId: string;
        customerName: string;
        notes: string;
        amountTenderedInput: string;
        paymentMethod: Sale['paymentMethod'];
        globalDiscountInput: string;
        couponCodeInput: string;
    }>({
        type: 'Venta',
        customerId: '',
        customerName: '',
        notes: '',
        amountTenderedInput: '',
        paymentMethod: 'Efectivo',
        globalDiscountInput: '',
        couponCodeInput: ''
    });

    const [appliedCoupon, setAppliedCoupon] = useState<Promotion | null>(null);

    // Quick Add Entity State
    const [quickEntityData, setQuickEntityData] = useState({ name: '', alias: '', phone: '', email: '', address: '', type: 'Cliente' });

    const getStatusBadge = (status: 'Completed' | 'Pending' | 'Cancelled', paymentStatus: Sale['paymentStatus']) => {
        if (status === 'Cancelled') return <span className="px-2 py-1 text-xs font-semibold text-red-300 bg-red-900/50 rounded-full border border-red-500/30">Cancelado</span>;
        
        switch (paymentStatus) {
            case 'Pagado':
                return <span className="px-2 py-1 text-xs font-semibold text-green-300 bg-green-900/50 rounded-full border border-green-500/30">Pagado</span>;
            case 'Parcial':
                return <span className="px-2 py-1 text-xs font-semibold text-orange-300 bg-orange-900/50 rounded-full border border-orange-500/30">Crédito (Parcial)</span>;
            case 'Pendiente':
                return <span className="px-2 py-1 text-xs font-semibold text-red-300 bg-red-900/50 rounded-full border border-red-500/30">Crédito (Pendiente)</span>;
            default:
                return <span className="px-2 py-1 text-xs font-semibold text-gray-300 bg-gray-700 rounded-full">Desconocido</span>;
        }
    };
    
    const columns = [
        { header: 'ID', accessor: 'id' as keyof Sale },
        { header: 'Cliente', accessor: 'customerName' as keyof Sale },
        { header: 'Fecha', accessor: 'date' as keyof Sale },
        { header: 'Tipo', accessor: 'type' as keyof Sale },
        { header: 'Total', accessor: 'total' as keyof Sale, isCurrency: true },
        { header: 'Pagado', accessor: 'amountPaid' as keyof Sale, isCurrency: true },
        { header: 'Estado', accessor: 'paymentStatus' as keyof Sale, render: (row: Sale) => getStatusBadge(row.status, row.paymentStatus) },
    ];
    
    const handleSaveNewProduct = (newProduct: Product) => {
        const saleProduct: SaleProduct = {
            productId: newProduct.id,
            name: newProduct.name,
            quantity: 1,
            price: newProduct.price, // Default selling price
            originalPrice: newProduct.price,
            discountApplied: 0,
            discountType: 'amount'
        };
        setCurrentSaleProducts([...currentSaleProducts, saleProduct]);
        setIsProductFormOpen(false);
    };

    const handleBarcodeScan = (code: string) => {
        const product = mockProducts.find(p => p.sku.toLowerCase() === code.toLowerCase() || p.id.toLowerCase() === code.toLowerCase());
        if (product) {
            // Check if product already in list to increment quantity
            const existingIndex = currentSaleProducts.findIndex(p => p.productId === product.id);
            if (existingIndex >= 0) {
                const updated = [...currentSaleProducts];
                updated[existingIndex].quantity += 1;
                setCurrentSaleProducts(updated);
            } else {
                handleSaveNewProduct(product);
            }
            setIsScannerOpen(false);
        } else {
            alert(`Producto con SKU "${code}" no encontrado en el sistema.`);
        }
    };

    // Calculation Logic
    const calculateTotals = () => {
        const subtotal = currentSaleProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        
        let globalDiscount = parseFloat(newSaleData.globalDiscountInput) || 0;
        let couponDiscount = 0;

        if (appliedCoupon) {
            if (appliedCoupon.type === 'percent') {
                couponDiscount = subtotal * (appliedCoupon.value / 100);
            } else {
                couponDiscount = appliedCoupon.value;
            }
        }

        const total = Math.max(0, subtotal - globalDiscount - couponDiscount);
        return { subtotal, globalDiscount, couponDiscount, total };
    };

    const handleApplyCoupon = () => {
        const code = newSaleData.couponCodeInput.toUpperCase();
        const promo = promotions.find(p => p.code === code && p.active);
        
        if (!promo) {
            alert("Cupón no válido o expirado.");
            setAppliedCoupon(null);
            return;
        }

        // Check date validity
        const today = new Date().toISOString().split('T')[0];
        if (today < promo.startDate || (promo.endDate && today > promo.endDate)) {
            alert("El cupón no está vigente en esta fecha.");
            setAppliedCoupon(null);
            return;
        }

        setAppliedCoupon(promo);
        alert(`Cupón ${promo.name} aplicado.`);
    };

    const handleSaveSale = () => {
        if (!newSaleData.customerName || currentSaleProducts.length === 0) {
            alert("Por favor, seleccione un cliente/proveedor y agregue al menos un producto.");
            return;
        }

        const { subtotal, globalDiscount, total } = calculateTotals();
        const tendered = parseFloat(newSaleData.amountTenderedInput);
        
        // Logic for Payment Status and Amount Paid
        let amountPaid = 0;
        let paymentStatus: Sale['paymentStatus'] = 'Pendiente';

        if (!newSaleData.amountTenderedInput || isNaN(tendered)) {
            amountPaid = 0;
            paymentStatus = 'Pendiente';
        } else {
            if (tendered >= total) {
                amountPaid = total;
                paymentStatus = 'Pagado';
            } else if (tendered > 0) {
                amountPaid = tendered;
                paymentStatus = 'Parcial';
            } else {
                amountPaid = 0;
                paymentStatus = 'Pendiente';
            }
        }

        const saleRecord: Sale = {
            id: newSaleData.type === 'Venta' ? `S${Date.now()}`.slice(-6) : (newSaleData.type === 'Compra' ? `PUR${Date.now()}`.slice(-6) : `Q${Date.now()}`.slice(-6)),
            customerId: newSaleData.customerId,
            customerName: newSaleData.customerName,
            date: new Date().toISOString().split('T')[0],
            products: currentSaleProducts,
            subtotal: subtotal,
            total: total,
            globalDiscount: globalDiscount > 0 ? globalDiscount : undefined,
            couponCode: appliedCoupon ? appliedCoupon.code : undefined,
            amountPaid: amountPaid,
            type: newSaleData.type,
            status: newSaleData.type === 'Cotización' ? 'Pending' : 'Completed',
            paymentStatus: newSaleData.type === 'Cotización' ? 'Pendiente' : paymentStatus,
            paymentMethod: newSaleData.paymentMethod,
            notes: `${newSaleData.notes}${appliedCoupon ? ` [Cupón: ${appliedCoupon.code}]` : ''}`
        };

        setSales([saleRecord, ...sales]);
        setIsSaleFormOpen(false);
        if(newSaleData.type === 'Venta') {
            setSaleToPrint(saleRecord);
        }
    };

    const handleUpdateProductLine = (index: number, field: keyof SaleProduct, value: string) => {
        const updatedProducts = [...currentSaleProducts];
        const product = updatedProducts[index];
        const numVal = parseFloat(value);

        if (field === 'price') {
            product.price = isNaN(numVal) ? 0 : numVal;
            // Reset discounts if manual price override
            product.discountApplied = 0;
        } else if (field === 'quantity') {
            product.quantity = isNaN(numVal) ? 1 : numVal;
        } else if (field === 'discountApplied') {
            const discountVal = isNaN(numVal) ? 0 : numVal;
            product.discountApplied = discountVal;
            // Recalculate price based on original
            if (product.discountType === 'percent') {
                product.price = product.originalPrice * (1 - discountVal / 100);
            } else {
                product.price = Math.max(0, product.originalPrice - discountVal);
            }
        } 

        setCurrentSaleProducts(updatedProducts);
    };

    const handleQuickAddEntity = () => {
        if(!quickEntityData.name) return alert("Nombre obligatorio");
        
        const id = `NEW${Date.now()}`;
        const newEntity = { 
            id, 
            name: quickEntityData.name,
            alias: quickEntityData.alias,
            email: quickEntityData.email, 
            phone: quickEntityData.phone,
            address: quickEntityData.address,
            totalSpent: 0, 
            lastPurchase: 'N/A',
            purchasedLicenses: 0,
            clientTypes: [quickEntityData.type as any]
        };

        if(quickEntityData.type === 'Cliente') {
            setCustomers([...customers, newEntity]);
            setNewSaleData({...newSaleData, customerId: id, customerName: newEntity.name, type: 'Venta'});
        } else if (quickEntityData.type === 'Proveedor') {
            setSuppliers([...suppliers, newEntity]);
            setNewSaleData({...newSaleData, customerId: id, customerName: newEntity.name, type: 'Compra'});
        } else if (quickEntityData.type === 'Empleado') {
            const newEmp = { ...newEntity, position: 'N/A', hireDate: new Date().toISOString().split('T')[0], paymentType: 'Nomina' as const, baseSalary: 0 };
            setEmployees([...employees, newEmp]);
            setNewSaleData({...newSaleData, customerId: id, customerName: newEntity.name});
        }

        setIsQuickAddOpen(false);
        setQuickEntityData({ name: '', alias: '', phone: '', email: '', address: '', type: 'Cliente' });
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setNewSaleData({ ...newSaleData, [e.target.name]: e.target.value });
    };

    const { subtotal, globalDiscount, couponDiscount, total } = calculateTotals();
    const tenderedVal = parseFloat(newSaleData.amountTenderedInput) || 0;
    const changeVal = tenderedVal > total ? tenderedVal - total : 0;

    const SaleFormModal = () => (
        <Modal isOpen={isSaleFormOpen} onClose={() => setIsSaleFormOpen(false)} title={`Nueva Operación: ${newSaleData.type}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Tipo de Operación</label>
                        <select name="type" value={newSaleData.type} onChange={handleFormChange} className="input-style">
                            <option value="Venta">Venta</option>
                            <option value="Cotización">Cotización</option>
                            <option value="Servicio">Servicio</option>
                            <option value="Compra">Compra (Proveedor)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Seleccionar {newSaleData.type === 'Compra' ? 'Proveedor' : 'Cliente'}</label>
                        <div className="flex space-x-2">
                            <select 
                                className="input-style flex-1"
                                value={newSaleData.customerId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    let name = '';
                                    if(newSaleData.type === 'Compra') {
                                        name = suppliers.find(s => s.id === id)?.name || '';
                                    } else {
                                        name = customers.find(c => c.id === id)?.name || employees.find(emp => emp.id === id)?.name || '';
                                    }
                                    setNewSaleData({...newSaleData, customerId: id, customerName: name});
                                }}
                            >
                                <option value="">-- Seleccione --</option>
                                {newSaleData.type === 'Compra' ? (
                                    suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                                ) : (
                                    <>
                                        <optgroup label="Clientes">
                                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </optgroup>
                                        <optgroup label="Empleados">
                                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                        </optgroup>
                                    </>
                                )}
                            </select>
                            <button 
                                onClick={() => setIsQuickAddOpen(true)}
                                className="px-3 bg-green-700 text-white rounded hover:bg-green-600"
                                title="Agregar Nuevo"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                 
                <div className="border-t border-green-500/20 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-green-300">Productos / Servicios</h4>
                        <button 
                            onClick={() => setIsScannerOpen(true)}
                            className="flex items-center text-[10px] bg-blue-900/30 text-blue-300 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-800/50"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
                            ESCANEAR BARCODE
                        </button>
                    </div>
                     <div className="space-y-2 mb-4 max-h-48 overflow-y-auto p-1 border border-green-500/10 rounded">
                        {currentSaleProducts.map((p, index) => (
                            <div key={`${p.productId}-${index}`} className="flex flex-col md:flex-row justify-between items-center text-sm p-2 bg-green-900/20 rounded border border-green-500/10 gap-2">
                                <div className="flex-1">
                                    <span className="font-bold block">{p.name}</span>
                                    <span className="text-xs text-gray-500">Precio Lista: ${p.originalPrice}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex flex-col w-16">
                                        <label className="text-[9px] text-gray-500">Cant.</label>
                                        <input 
                                            type="number" 
                                            value={p.quantity} 
                                            onChange={(e) => handleUpdateProductLine(index, 'quantity', e.target.value)} 
                                            className="bg-black/50 border border-gray-600 rounded px-1 text-center text-white w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col w-20">
                                        <label className="text-[9px] text-gray-500">Precio Unit.</label>
                                        <input 
                                            type="number" 
                                            value={p.price} 
                                            onChange={(e) => handleUpdateProductLine(index, 'price', e.target.value)}
                                            className="bg-black/50 border border-gray-600 rounded px-1 text-right text-white w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col w-20">
                                        <label className="text-[9px] text-gray-500">Desc ($)</label>
                                        <input 
                                            type="number" 
                                            value={p.discountApplied || 0} 
                                            onChange={(e) => handleUpdateProductLine(index, 'discountApplied', e.target.value)}
                                            className="bg-black/50 border border-gray-600 rounded px-1 text-right text-yellow-400 w-full"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setCurrentSaleProducts(currentSaleProducts.filter((_, i) => i !== index))}
                                        className="text-red-500 hover:text-white px-2"
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        ))}
                         {currentSaleProducts.length === 0 && <p className="text-center text-sm text-gray-500 p-2">Aún no hay items.</p>}
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsProductFormOpen(true)} className="flex-1 py-2 px-4 bg-green-600/50 text-white rounded-md text-sm hover:bg-green-600/80">
                            + Seleccionar del Inventario
                        </button>
                    </div>
                </div>

                <div className="border-t border-green-500/20 pt-4 bg-black/20 p-3 rounded space-y-2">
                    {/* Calculation Summary */}
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Descuento Global ($):</span>
                        <input 
                            type="number" 
                            name="globalDiscountInput"
                            value={newSaleData.globalDiscountInput} 
                            onChange={handleFormChange}
                            placeholder="0.00"
                            className="bg-black/50 border border-gray-600 rounded w-24 text-right text-white px-1"
                        />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Cupón / Promo:</span>
                        <div className="flex">
                            <input 
                                type="text" 
                                name="couponCodeInput"
                                value={newSaleData.couponCodeInput}
                                onChange={handleFormChange}
                                placeholder="CÓDIGO"
                                className="bg-black/50 border border-gray-600 rounded-l w-24 text-center text-white px-1 uppercase"
                            />
                            <button onClick={handleApplyCoupon} className="bg-blue-600 px-2 rounded-r text-xs text-white hover:bg-blue-500">Aplicar</button>
                        </div>
                    </div>
                    {appliedCoupon && <div className="text-right text-xs text-green-400">Descuento Cupón: -${couponDiscount.toFixed(2)}</div>}

                    <div className="flex justify-between items-center mt-2 border-t border-gray-700 pt-2">
                        <span className="text-xl font-bold text-white">Total a Pagar:</span>
                        <span className="text-2xl font-bold text-green-400">${total.toFixed(2)}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Forma de Pago</label>
                            <select name="paymentMethod" value={newSaleData.paymentMethod} onChange={handleFormChange} className="input-style">
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
                                <option value="Tarjeta Débito">Tarjeta Débito</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Monto Recibido</label>
                            <input 
                                type="number" 
                                name="amountTenderedInput" 
                                value={newSaleData.amountTenderedInput} 
                                onChange={handleFormChange} 
                                placeholder="0.00" 
                                className="input-style text-right text-lg font-bold text-white" 
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-600">
                        <div className="text-sm">
                            <p className="text-gray-400">Estado:</p>
                            <p className={`font-bold ${tenderedVal >= total ? 'text-green-400' : 'text-red-400'}`}>
                                {tenderedVal >= total ? 'PAGADO' : 'PENDIENTE / CRÉDITO'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Cambio / Vuelto:</p>
                            <p className="text-xl font-bold text-yellow-400">${changeVal.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                         <label className="block text-sm font-medium text-gray-400">Notas</label>
                         <textarea name="notes" value={newSaleData.notes} onChange={handleFormChange} rows={1} placeholder="Notas adicionales..." className="input-style"></textarea>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button onClick={handleSaveSale} className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 shadow-lg w-full md:w-auto">
                        CONFIRMAR OPERACIÓN
                    </button>
                </div>
            </div>
        </Modal>
    );

    const QuickAddModal = () => (
        <Modal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} title="Registro Rápido">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400">Tipo de Entidad</label>
                    <select 
                        className="input-style" 
                        value={quickEntityData.type} 
                        onChange={e => setQuickEntityData({...quickEntityData, type: e.target.value})}
                    >
                        <option value="Cliente">Cliente</option>
                        <option value="Proveedor">Proveedor</option>
                        <option value="Empleado">Empleado</option>
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400">Nombre Completo</label>
                        <input 
                            type="text" 
                            className="input-style" 
                            value={quickEntityData.name} 
                            onChange={e => setQuickEntityData({...quickEntityData, name: e.target.value})} 
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400">Alias / Apodo</label>
                        <input 
                            type="text" 
                            className="input-style" 
                            value={quickEntityData.alias} 
                            onChange={e => setQuickEntityData({...quickEntityData, alias: e.target.value})} 
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400">Teléfono</label>
                        <input type="text" className="input-style" value={quickEntityData.phone} onChange={e => setQuickEntityData({...quickEntityData, phone: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400">Email (Opcional)</label>
                        <input type="email" className="input-style" value={quickEntityData.email} onChange={e => setQuickEntityData({...quickEntityData, email: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-gray-400">Dirección</label>
                    <input type="text" className="input-style" value={quickEntityData.address} onChange={e => setQuickEntityData({...quickEntityData, address: e.target.value})} />
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleQuickAddEntity} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Guardar y Usar</button>
                </div>
            </div>
        </Modal>
    );

    const openNewSaleForm = () => {
        setNewSaleData({ 
            type: 'Venta', 
            customerId: '', 
            customerName: '', 
            notes: '', 
            amountTenderedInput: '', 
            paymentMethod: 'Efectivo',
            globalDiscountInput: '',
            couponCodeInput: ''
        });
        setCurrentSaleProducts([]);
        setAppliedCoupon(null);
        setIsSaleFormOpen(true);
    };

    return (
        <div>
            <Header title="Ventas, Compras y Cotizaciones" />
            <div className="flex justify-between items-center mb-4">
                 <div>
                    <button onClick={openNewSaleForm} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75">
                        Nueva Operación
                    </button>
                </div>
            </div>
            <Table columns={columns} data={sales} />
            <SaleFormModal />
            <QuickAddModal />
            <ProductForm 
                isOpen={isProductFormOpen}
                onClose={() => setIsProductFormOpen(false)}
                onSave={handleSaveNewProduct}
                product={null}
            />
            <Ticket
                isOpen={!!saleToPrint}
                onClose={() => setSaleToPrint(null)}
                sale={saleToPrint}
                companyInfo={companyInfo}
            />
            <BarcodeScanner 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScan={handleBarcodeScan} 
            />
        </div>
    );
};

export default Sales;
