
import React, { useState, useMemo } from 'react';
import Header from './Header';
import type { Customer, Sale, CommunicationEvent, ClientCategory } from '../types';
import Table from './common/Table';
import { mockCustomers, mockSuppliers, mockSales, mockCommunicationEvents, mockMemberships, mockManufacturingOrders } from '../data/mockData';
import Modal from './common/Modal';
import ReminderModal from './ReminderModal';

const Customers: React.FC = () => {
    const [view, setView] = useState<'customers' | 'suppliers'>('customers');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<Customer | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [historyTab, setHistoryTab] = useState<'general' | 'memberships' | 'manufacture'>('general');
    
    // Lists
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [suppliers, setSuppliers] = useState<Customer[]>(mockSuppliers);
    const [events, setEvents] = useState<CommunicationEvent[]>(mockCommunicationEvents);
    
    // State for Payment Modal
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentNotes, setPaymentNotes] = useState('');
    const [selectedSaleId, setSelectedSaleId] = useState('');
    
    // State for Reminder Modal
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    // State for Event Scheduling
    const [isEventFormOpen, setIsEventFormOpen] = useState(false);
    const [newEventData, setNewEventData] = useState<Partial<CommunicationEvent>>({ type: 'Llamada', date: '', time: '', notes: '' });

    // Dynamic Data
    const [salesList, setSalesList] = useState<Sale[]>(mockSales);

    const data = view === 'customers' ? customers : suppliers;

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return data;
        }
        return data.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.alias && c.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    // Calculate Total Debt for List View
    const getDebt = (id: string, type: 'Customer' | 'Supplier') => {
        if (type === 'Customer') {
            return salesList
                .filter(s => s.customerId === id && s.type !== 'Compra' && s.type !== 'Cotización')
                .reduce((acc, s) => acc + (s.total - s.amountPaid), 0);
        } else {
            return salesList
                .filter(s => s.customerId === id && s.type === 'Compra')
                .reduce((acc, s) => acc + (s.total - s.amountPaid), 0);
        }
    };

    const getTypeBadge = (types: ClientCategory[]) => {
        if(!types || types.length === 0) return null;
        return (
            <div className="flex flex-wrap gap-1">
                {types.map(t => {
                    let style = 'bg-gray-700 text-gray-300';
                    if (t === 'Suscripción') style = 'bg-purple-900/50 text-purple-300 border border-purple-500/30';
                    if (t === 'Manufactura') style = 'bg-orange-900/50 text-orange-300 border border-orange-500/30';
                    if (t === 'Comercial') style = 'bg-blue-900/50 text-blue-300 border border-blue-500/30';
                    if (t === 'Servicios') style = 'bg-green-900/50 text-green-300 border border-green-500/30';
                    if (t === 'Proveedor') style = 'bg-red-900/50 text-red-300 border border-red-500/30';
                    return <span key={t} className={`text-[10px] px-1.5 rounded ${style}`}>{t}</span>
                })}
            </div>
        )
    }

    const columns = [
        { header: 'Nombre', accessor: 'name' as keyof Customer, render: (row: Customer) => (
            <div>
                <div className="font-medium text-white">{row.name}</div>
                {getTypeBadge(row.clientTypes)}
            </div>
        ) },
        { header: 'Alias', accessor: 'alias' as keyof Customer },
        { header: 'Teléfono', accessor: 'phone' as keyof Customer },
        { header: view === 'customers' ? 'Por Cobrar' : 'Por Pagar', accessor: 'id' as keyof Customer, render: (row: Customer) => {
            const debt = getDebt(row.id, view === 'customers' ? 'Customer' : 'Supplier');
            return <span className={debt > 0 ? "text-red-400 font-bold" : "text-gray-400"}>${debt.toFixed(2)}</span>
        }},
        ...(view === 'customers' ? [{ 
            header: 'Licencias', 
            accessor: 'purchasedLicenses' as keyof Customer,
            render: (row: Customer) => (
                <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                    {row.purchasedLicenses || 0}
                </span>
            )
        }] : []),
    ];
    
    const renderActions = (item: Customer) => (
        <div className="flex space-x-2 justify-end">
            <button
                onClick={() => { setEditingCustomer(item); setIsFormOpen(true); }}
                className="text-blue-400 hover:text-blue-300 hover:underline"
            >
                Editar
            </button>
            <button
                onClick={() => setSelectedItem(item)}
                className="text-green-400 hover:text-green-300 hover:underline"
            >
                Ver Perfil
            </button>
        </div>
    );

    const handleSaveCustomer = (formData: Customer) => {
        if(view === 'customers') {
            if(editingCustomer) {
                setCustomers(customers.map(c => c.id === formData.id ? formData : c));
            } else {
                setCustomers([...customers, formData]);
            }
        } else {
            if(editingCustomer) {
                setSuppliers(suppliers.map(s => s.id === formData.id ? formData : s));
            } else {
                setSuppliers([...suppliers, formData]);
            }
        }
        setIsFormOpen(false);
        setEditingCustomer(null);
    };

    const handleRegisterPayment = () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            alert("Ingrese un monto válido.");
            return;
        }
        
        const amount = parseFloat(paymentAmount);
        
        if (selectedSaleId) {
            setSalesList(prev => prev.map(s => {
                if (s.id === selectedSaleId) {
                    const newPaid = s.amountPaid + amount;
                    const isPaid = newPaid >= s.total;
                    const noteEntry = paymentNotes ? `\n[Pago ${new Date().toLocaleDateString()}: $${amount} - ${paymentNotes}]` : '';
                    return { 
                        ...s, 
                        amountPaid: newPaid, 
                        paymentStatus: isPaid ? 'Pagado' : 'Parcial',
                        notes: (s.notes || '') + noteEntry
                    };
                }
                return s;
            }));
            alert("Abono registrado exitosamente.");
            setIsPaymentModalOpen(false);
            setPaymentAmount('');
            setPaymentNotes('');
            setSelectedSaleId('');
        } else {
            alert("Seleccione una nota/factura para abonar.");
        }
    };

    const handleScheduleEvent = () => {
        if(!selectedItem) return;
        const newEvent: CommunicationEvent = {
            id: `EVT${Date.now()}`,
            customerId: selectedItem.id,
            type: newEventData.type || 'Llamada',
            date: newEventData.date || new Date().toISOString().split('T')[0],
            time: newEventData.time || '12:00',
            status: 'Pendiente',
            notes: newEventData.notes || ''
        };
        setEvents([...events, newEvent]);
        setIsEventFormOpen(false);
        setNewEventData({ type: 'Llamada', date: '', time: '', notes: '' });
    };

    const openWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const openPhone = (phone: string) => {
        window.open(`tel:${phone}`);
    };

    const renderModalContent = () => {
        if (!selectedItem) return null;

        // Filter transactions based on active tab
        const isSupplier = view === 'suppliers';
        
        // 1. General Sales / Purchases
        const salesHistory = salesList.filter(sale => 
            sale.customerId === selectedItem.id && 
            (isSupplier ? sale.type === 'Compra' : (sale.type === 'Venta' || sale.type === 'Servicio' || sale.type === 'Cotización'))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // 2. Memberships
        const membershipsHistory = mockMemberships.filter(m => m.customerId === selectedItem.id);

        // 3. Manufacturing (Find orders where product is linked, or mock logic for now since orders don't link customer directly in previous types)
        // Note: In a real app, manufacturing orders would link to a client. For now, we simulate.
        const manufacturingHistory = mockManufacturingOrders; // Filter logic would go here

        const pendingSales = salesHistory.filter(s => s.paymentStatus !== 'Pagado' && s.type !== 'Cotización');
        const totalDebt = pendingSales.reduce((acc, sale) => acc + (sale.total - sale.amountPaid), 0);
        
        const customerEvents = events.filter(e => e.customerId === selectedItem.id).sort((a,b) => b.date.localeCompare(a.date));

        return (
            <div>
                {/* Header Profile */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 bg-gray-900/50 p-4 rounded-lg border border-green-500/10">
                    <div>
                        <h3 className="text-xl font-bold text-green-300 flex items-center">
                            {selectedItem.name} 
                            <span className="text-sm font-normal text-gray-400 ml-2">({selectedItem.alias || 'Sin Alias'})</span>
                        </h3>
                        <div className="mt-1 mb-2">
                            {getTypeBadge(selectedItem.clientTypes)}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 flex items-center">
                            {selectedItem.email}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center">
                            {selectedItem.phone}
                            <div className="ml-3 flex space-x-2">
                                <button onClick={() => openWhatsApp(selectedItem.phone)} className="text-green-500 hover:text-green-400" title="WhatsApp">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                                </button>
                                <button onClick={() => openPhone(selectedItem.phone)} className="text-blue-500 hover:text-blue-400" title="Llamar">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </button>
                            </div>
                        </p>
                        <p className="text-sm text-gray-400">{selectedItem.address}</p>
                        {selectedItem.notes && <p className="text-xs text-gray-500 italic mt-1 bg-black/20 p-1 rounded inline-block">{selectedItem.notes}</p>}
                    </div>
                    
                    <div className="text-right mt-4 md:mt-0 flex flex-col items-end">
                        <div className="mb-2">
                            <span className="text-xs font-medium text-gray-400 block">{isSupplier ? 'Deuda Total' : 'Cuentas por Cobrar'}</span>
                            <p className={`font-bold text-2xl ${totalDebt > 0 ? 'text-red-500' : 'text-green-500'}`}>${totalDebt.toFixed(2)}</p>
                        </div>
                        {!isSupplier && (
                            <div className="bg-blue-900/20 px-3 py-1 rounded border border-blue-500/20">
                                <span className="text-xs text-blue-300 block">Licencias Pre-Pagadas</span>
                                <p className="font-bold text-white">{selectedItem.purchasedLicenses || 0}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex space-x-2 mb-6">
                    <button 
                        onClick={() => setIsPaymentModalOpen(true)}
                        disabled={totalDebt <= 0}
                        className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-sm font-bold"
                    >
                        $ Registrar {isSupplier ? 'Pago' : 'Abono'}
                    </button>
                    <button 
                        onClick={() => setIsEventFormOpen(true)}
                        className="flex-1 py-2 bg-purple-700 text-white rounded hover:bg-purple-600 border border-purple-500 text-sm font-bold"
                    >
                        📅 Agendar Cita/Llamada
                    </button>
                </div>

                {/* Tabs / Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
                    
                    {/* Left: Financial History with Tabs */}
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="flex border-b border-green-500/20 mb-2">
                            <button onClick={() => setHistoryTab('general')} className={`px-4 py-2 text-sm font-medium ${historyTab === 'general' ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-500 hover:text-green-300'}`}>
                                Historial General
                            </button>
                            <button onClick={() => setHistoryTab('memberships')} className={`px-4 py-2 text-sm font-medium ${historyTab === 'memberships' ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-500 hover:text-green-300'}`}>
                                Membresías
                            </button>
                            {/* Only show manufacturing tab if relevant */}
                            {selectedItem.clientTypes.includes('Manufactura') && (
                                <button onClick={() => setHistoryTab('manufacture')} className={`px-4 py-2 text-sm font-medium ${historyTab === 'manufacture' ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-500 hover:text-green-300'}`}>
                                    Manufactura
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto border border-gray-700 rounded bg-black/30">
                            {historyTab === 'general' && (
                                <table className="w-full text-xs text-left text-gray-400">
                                    <thead className="bg-gray-800 text-gray-300 sticky top-0">
                                        <tr>
                                            <th className="px-2 py-1">Fecha</th>
                                            <th className="px-2 py-1">Tipo</th>
                                            <th className="px-2 py-1 text-right">Total</th>
                                            <th className="px-2 py-1 text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {salesHistory.map(item => (
                                            <tr key={item.id} className="hover:bg-gray-900/50">
                                                <td className="px-2 py-1">{item.date}</td>
                                                <td className="px-2 py-1">{item.type}</td>
                                                <td className="px-2 py-1 text-right">${item.total.toFixed(2)}</td>
                                                <td className="px-2 py-1 text-center">
                                                    <span className={`px-1 rounded ${item.paymentStatus === 'Pagado' ? 'text-green-400' : 'text-red-400'}`}>{item.paymentStatus}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {salesHistory.length === 0 && <tr><td colSpan={4} className="text-center py-2">Sin historial.</td></tr>}
                                    </tbody>
                                </table>
                            )}

                            {historyTab === 'memberships' && (
                                <div className="p-2 space-y-2">
                                    {membershipsHistory.map(mem => (
                                        <div key={mem.id} className="bg-gray-800/50 p-2 rounded border border-gray-700 flex justify-between items-center">
                                            <div>
                                                <div className="text-sm text-white font-bold">{mem.serviceName}</div>
                                                <div className="text-xs text-gray-400">{mem.startDate} - {mem.endDate}</div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded ${mem.status === 'Activa' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                                {mem.status}
                                            </span>
                                        </div>
                                    ))}
                                    {membershipsHistory.length === 0 && <p className="text-center text-xs p-4">No hay membresías registradas.</p>}
                                </div>
                            )}

                            {historyTab === 'manufacture' && (
                                <div className="p-4 text-center text-xs text-gray-500">
                                    Funcionalidad de historial de manufactura detallada en desarrollo.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Communication Agenda */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold mb-2 text-purple-300 border-b border-purple-500/20 pb-1">Agenda & Comunicación</h4>
                        <div className="overflow-y-auto flex-1 space-y-2 pr-2">
                            {customerEvents.map(evt => (
                                <div key={evt.id} className="p-2 bg-gray-800/50 border-l-2 border-purple-500 rounded flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-gray-200">{evt.type} - {evt.date} {evt.time}</p>
                                        <p className="text-xs text-gray-400">{evt.notes}</p>
                                    </div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${evt.status === 'Pendiente' ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'}`}>
                                        {evt.status}
                                    </span>
                                </div>
                            ))}
                            {customerEvents.length === 0 && <p className="text-xs text-gray-500 italic text-center py-4">No hay eventos programados.</p>}
                        </div>
                    </div>
                </div>

                {/* Internal Payment Modal */}
                <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title={`Registrar ${isSupplier ? 'Pago' : 'Abono'}`}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Seleccionar Nota/Factura</label>
                            <select 
                                className="input-style" 
                                value={selectedSaleId} 
                                onChange={e => setSelectedSaleId(e.target.value)}
                            >
                                <option value="">-- Seleccione --</option>
                                {pendingSales.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.date} - {s.id} (Resta: ${(s.total - s.amountPaid).toFixed(2)})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Monto a Abonar</label>
                            <input 
                                type="number" 
                                className="input-style" 
                                value={paymentAmount} 
                                onChange={e => setPaymentAmount(e.target.value)} 
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Notas / Referencia</label>
                            <textarea 
                                className="input-style" 
                                value={paymentNotes} 
                                onChange={e => setPaymentNotes(e.target.value)} 
                                placeholder="Ej: Transferencia SPEI #1234, Abono en efectivo..."
                                rows={2}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={handleRegisterPayment} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500">Confirmar</button>
                        </div>
                    </div>
                </Modal>

                {/* Internal Event Modal */}
                <Modal isOpen={isEventFormOpen} onClose={() => setIsEventFormOpen(false)} title="Agendar Interacción">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400">Tipo</label>
                                <select 
                                    className="input-style" 
                                    value={newEventData.type}
                                    onChange={e => setNewEventData({...newEventData, type: e.target.value as any})}
                                >
                                    <option>Llamada</option>
                                    <option>Visita</option>
                                    <option>Mensaje</option>
                                    <option>Soporte</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400">Fecha</label>
                                <input 
                                    type="date" 
                                    className="input-style"
                                    value={newEventData.date}
                                    onChange={e => setNewEventData({...newEventData, date: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400">Hora</label>
                            <input 
                                type="time" 
                                className="input-style"
                                value={newEventData.time}
                                onChange={e => setNewEventData({...newEventData, time: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400">Notas / Motivo</label>
                            <textarea 
                                className="input-style" 
                                rows={3}
                                value={newEventData.notes}
                                onChange={e => setNewEventData({...newEventData, notes: e.target.value})}
                                placeholder="Ej: Verificar instalación, Cobranza..."
                            />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={handleScheduleEvent} className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-600">Agendar</button>
                        </div>
                    </div>
                </Modal>

                <ReminderModal 
                    isOpen={isReminderModalOpen} 
                    onClose={() => setIsReminderModalOpen(false)} 
                    onSave={() => setIsReminderModalOpen(false)}
                />
            </div>
        );
    };

    return (
        <div>
            <Header title={view === 'customers' ? 'Clientes y Cuentas por Cobrar' : 'Proveedores y Cuentas por Pagar'} />
            
            <div className="flex border-b border-green-500/20 mb-4">
                <button 
                    onClick={() => { setView('customers'); setSearchTerm(''); }}
                    className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200 ${view === 'customers' ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-500 hover:text-green-400'}`}
                >
                    Clientes (Cobrar)
                </button>
                <button 
                    onClick={() => { setView('suppliers'); setSearchTerm(''); }}
                    className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200 ${view === 'suppliers' ? 'border-b-2 border-green-400 text-green-300' : 'text-gray-500 hover:text-green-400'}`}
                >
                    Proveedores (Pagar)
                </button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                    <input
                        type="text"
                        placeholder="Buscar por nombre, alias o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-style w-full pl-10"
                    />
                     <div className="absolute top-0 left-0 inline-flex items-center p-2 mt-1 ml-1 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>
                <button 
                    onClick={() => { setEditingCustomer(null); setIsFormOpen(true); }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 flex items-center shrink-0 ml-4"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                   Nuevo {view === 'customers' ? 'Cliente' : 'Proveedor'}
                </button>
            </div>
            
            <Table columns={columns} data={filteredData} renderActions={renderActions}/>
            
            {/* View/Pay Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={view === 'customers' ? 'Perfil del Cliente' : 'Detalles del Proveedor'}
            >
                {renderModalContent()}
            </Modal>

            {/* Create/Edit Modal */}
            <CustomerForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSave={handleSaveCustomer} 
                initialData={editingCustomer}
                type={view === 'customers' ? 'Cliente' : 'Proveedor'}
            />
        </div>
    );
};

// Subcomponent for Add/Edit Form
const CustomerForm: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: Customer) => void, initialData: Customer | null, type: string }> = ({ isOpen, onClose, onSave, initialData, type }) => {
    const [formData, setFormData] = useState<Partial<Customer>>({});

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', alias: '', email: '', phone: '', address: '', notes: '', purchasedLicenses: 0, clientTypes: ['Comercial'] });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'clientTypes') {
            const types = Array.from((e.target as HTMLSelectElement).selectedOptions, option => option.value) as ClientCategory[];
            setFormData({ ...formData, clientTypes: types });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = () => {
        if (!formData.name) return alert("Nombre es obligatorio");
        const customer: Customer = {
            id: initialData?.id || (type === 'Cliente' ? `C${Date.now()}` : `SUP${Date.now()}`),
            name: formData.name!,
            alias: formData.alias || '',
            email: formData.email || '',
            phone: formData.phone || '',
            address: formData.address || '',
            notes: formData.notes || '',
            clientTypes: formData.clientTypes || ['Comercial'],
            totalSpent: initialData?.totalSpent || 0,
            lastPurchase: initialData?.lastPurchase || 'N/A',
            purchasedLicenses: initialData?.purchasedLicenses || 0
        };
        onSave(customer);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? `Editar ${type}` : `Nuevo ${type}`}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Nombre Completo</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className="input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Alias / Apodo</label>
                        <input name="alias" value={formData.alias || ''} onChange={handleChange} className="input-style" />
                    </div>
                </div>
                {type === 'Cliente' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Categoría del Cliente</label>
                        <select 
                            name="clientTypes" 
                            multiple 
                            value={formData.clientTypes?.map(String) || []} 
                            onChange={handleChange}
                            className="input-style h-24"
                        >
                            <option value="Comercial">Comercial / Tienda</option>
                            <option value="Suscripción">Suscripción / Licencias</option>
                            <option value="Manufactura">Manufactura</option>
                            <option value="Servicios">Servicios Técnicos</option>
                        </select>
                        <p className="text-[10px] text-gray-500 mt-1">* Mantén presionado Ctrl (o Cmd) para seleccionar múltiples.</p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Teléfono</label>
                        <input name="phone" value={formData.phone || ''} onChange={handleChange} className="input-style" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Email</label>
                        <input name="email" value={formData.email || ''} onChange={handleChange} className="input-style" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Dirección</label>
                    <input name="address" value={formData.address || ''} onChange={handleChange} className="input-style" placeholder="Calle, Número, Colonia, Ciudad" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Notas</label>
                    <textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="input-style" rows={3} />
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">Guardar</button>
                </div>
            </div>
        </Modal>
    );
};

export default Customers;
