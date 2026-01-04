
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './Header';
import Modal from './common/Modal';
import Table from './common/Table';
import type { Membership, Customer, LicenseCategory } from '../types';
import { mockMemberships, mockCustomers } from '../data/mockData';

const Memberships: React.FC = () => {
    const [memberships, setMemberships] = useState<Membership[]>(mockMemberships);
    const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Customer Selection State
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Membership>>({
        customerId: '',
        customerName: '',
        serviceName: 'Streaming',
        category: 'Mobile Only',
        startDate: new Date().toISOString().split('T')[0],
        cost: 50,
        discount: 0,
        finalPrice: 50,
        paymentMethod: 'Efectivo',
        status: 'Activa',
        autoRenewal: true,
        notes: ''
    });

    // Quick Add Customer State
    const [newCustomerData, setNewCustomerData] = useState({ name: '', phone: '', email: '' });

    // Computed Stats
    const [totalPurchased, setTotalPurchased] = useState(0);
    const [installedCount, setInstalledCount] = useState(0);
    const [availableCredits, setAvailableCredits] = useState(0);

    // Dashboard Stats
    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const active = memberships.filter(m => m.status === 'Activa' && m.endDate >= today).length;
        const expiring = memberships.filter(m => m.status === 'Activa' && m.endDate >= today && m.endDate <= nextWeekStr).length;
        const expired = memberships.filter(m => m.endDate < today).length;

        return { active, expiring, expired, total: memberships.length };
    }, [memberships]);

    // Filter Logic
    const filteredData = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        let data = memberships;

        if (filterStatus === 'active') data = data.filter(m => m.status === 'Activa' && m.endDate >= today);
        if (filterStatus === 'expiring') data = data.filter(m => m.status === 'Activa' && m.endDate >= today && m.endDate <= nextWeekStr);
        if (filterStatus === 'expired') data = data.filter(m => m.endDate < today);

        if (!searchTerm) return data;
        
        return data.filter(m => 
            m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [memberships, searchTerm, filterStatus]);

    // Customer Search Logic
    const filteredCustomers = useMemo(() => {
        if (!customerSearchQuery) return customers;
        const q = customerSearchQuery.toLowerCase();
        return customers.filter(c => 
            c.name.toLowerCase().includes(q) ||
            (c.alias && c.alias.toLowerCase().includes(q)) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        ).slice(0, 10);
    }, [customers, customerSearchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!editingId) {
            const prices: Record<LicenseCategory, number> = {
                'Mobile Only': 50,
                'TV/Box (Pantalla)': 90,
                'Combo (Mobile+TV)': 120
            };
            if (formData.category) {
                const basePrice = prices[formData.category as LicenseCategory] || 0;
                setFormData(prev => ({ 
                    ...prev, 
                    cost: basePrice,
                    finalPrice: Math.max(0, basePrice - (prev.discount || 0))
                }));
            }
        }
    }, [formData.category, editingId]);

    useEffect(() => {
        const c = Number(formData.cost) || 0;
        const d = Number(formData.discount) || 0;
        setFormData(prev => ({ ...prev, finalPrice: Math.max(0, c - d) }));
    }, [formData.cost, formData.discount]);

    const calculateEndDate = (start: string) => {
        const date = new Date(start);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    };

    const updatePoolStats = (customerId: string) => {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
            const bought = customer.purchasedLicenses || 0;
            const active = memberships.filter(m => m.customerId === customerId && m.status === 'Activa').length;
            setTotalPurchased(bought);
            setInstalledCount(active);
            setAvailableCredits(bought - active);
        }
    };

    const handleSelectCustomer = (customer: Customer) => {
        setFormData({ 
            ...formData, 
            customerId: customer.id, 
            customerName: customer.name 
        });
        setCustomerSearchQuery(customer.name);
        setShowCustomerDropdown(false);
        updatePoolStats(customer.id);
    };

    const handleSaveQuickCustomer = () => {
        if(!newCustomerData.name || !newCustomerData.phone) {
            alert("Nombre y Teléfono son requeridos.");
            return;
        }
        const newC: Customer = {
            id: `C${Date.now()}`,
            name: newCustomerData.name,
            phone: newCustomerData.phone,
            email: newCustomerData.email,
            alias: '',
            address: '',
            clientTypes: ['Suscripción'],
            totalSpent: 0,
            lastPurchase: 'N/A',
            purchasedLicenses: 0,
            notes: 'Registrado desde Nueva Licencia'
        };
        setCustomers([...customers, newC]);
        handleSelectCustomer(newC);
        setIsQuickAddOpen(false);
        setNewCustomerData({ name: '', phone: '', email: '' });
    };

    const handleSave = () => {
        if (!formData.customerId || !formData.serviceName || !formData.startDate) {
            alert('Complete los campos obligatorios');
            return;
        }

        const endDate = formData.endDate || calculateEndDate(formData.startDate!);
        
        const newMembership: Membership = {
            id: editingId || `MEM${Date.now()}`,
            customerId: formData.customerId!,
            customerName: formData.customerName!,
            serviceName: formData.serviceName!,
            category: formData.category as LicenseCategory,
            startDate: formData.startDate!,
            endDate: endDate,
            cost: Number(formData.cost),
            discount: Number(formData.discount),
            finalPrice: Number(formData.finalPrice),
            paymentMethod: formData.paymentMethod as any,
            status: formData.status as any || 'Activa',
            autoRenewal: formData.autoRenewal || false,
            notes: formData.notes
        };

        if (editingId) {
            setMemberships(memberships.map(m => m.id === editingId ? newMembership : m));
        } else {
            setMemberships([newMembership, ...memberships]);
        }
        
        setIsFormOpen(false);
        setEditingId(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ 
            startDate: new Date().toISOString().split('T')[0], 
            status: 'Activa', 
            serviceName: 'Streaming',
            category: 'Mobile Only',
            paymentMethod: 'Efectivo',
            cost: 50,
            discount: 0,
            finalPrice: 50
        });
        setCustomerSearchQuery('');
        setTotalPurchased(0);
        setInstalledCount(0);
        setAvailableCredits(0);
    };

    const handleAddCredits = (customerId: string, amount: number) => {
        if (amount === 0) return;
        setCustomers(customers.map(c => 
            c.id === customerId ? { ...c, purchasedLicenses: (c.purchasedLicenses || 0) + amount } : c
        ));
        setTotalPurchased(prev => prev + amount);
        setAvailableCredits(prev => prev + amount);
    };

    const handleRenew = (membership: Membership) => {
        const currentEnd = new Date(membership.endDate);
        currentEnd.setMonth(currentEnd.getMonth() + 1);
        const newEndDate = currentEnd.toISOString().split('T')[0];
        setMemberships(memberships.map(m => m.id === membership.id ? { ...m, endDate: newEndDate, status: 'Activa' } : m));
        alert('Licencia renovada por 1 mes.');
    };

    const openEdit = (m: Membership) => {
        setFormData(m);
        setEditingId(m.id);
        setCustomerSearchQuery(m.customerName);
        updatePoolStats(m.customerId);
        setIsFormOpen(true);
    };

    const columns = [
        { header: 'Cliente', accessor: 'customerName' as keyof Membership, render: (row: Membership) => (
            <div>
                <div className="font-bold">{row.customerName}</div>
                {row.autoRenewal ? (
                    <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1 rounded border border-blue-500/30">CLIENTE FULL (Renovable)</span>
                ) : (
                    <span className="text-[10px] bg-gray-700 text-gray-300 px-1 rounded">TIEMPO DEFINIDO</span>
                )}
            </div>
        )},
        { header: 'Servicio', accessor: 'serviceName' as keyof Membership },
        { header: 'Vence', accessor: 'endDate' as keyof Membership, render: (row: Membership) => {
            const today = new Date().toISOString().split('T')[0];
            const isExpired = row.endDate < today;
            const isExpiring = !isExpired && row.endDate <= new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
            return <span className={isExpired ? 'text-red-500 font-bold' : isExpiring ? 'text-yellow-400 font-bold' : 'text-gray-300'}>{row.endDate}</span>
        }},
        { header: 'Precio', accessor: 'finalPrice' as keyof Membership, render: (row: Membership) => <div>${(row.finalPrice || 0).toFixed(2)}</div> },
        { header: 'Estado', accessor: 'status' as keyof Membership, render: (row: Membership) => (
            <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Activa' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {row.status}
            </span>
        )},
    ];

    const renderActions = (row: Membership) => (
        <div className="flex space-x-2 justify-end">
            <button onClick={() => handleRenew(row)} title="Renovar" className="p-1 hover:text-green-400 border border-green-500/30 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38"/></svg>
            </button>
            <button onClick={() => openEdit(row)} title="Editar" className="p-1 hover:text-blue-400 border border-blue-500/30 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </button>
        </div>
    );

    return (
        <div>
            <Header title="Control de Licencias y Streaming" />
            
            {/* Status Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div onClick={() => setFilterStatus('all')} className={`cursor-pointer p-4 rounded-lg border bg-black/40 ${filterStatus === 'all' ? 'border-white' : 'border-green-500/20'}`}>
                    <p className="text-xs text-gray-400 uppercase">Total Licencias</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div onClick={() => setFilterStatus('active')} className={`cursor-pointer p-4 rounded-lg border bg-black/40 ${filterStatus === 'active' ? 'border-green-500' : 'border-green-500/20'}`}>
                    <p className="text-xs text-green-400 uppercase">Activas</p>
                    <p className="text-2xl font-bold text-green-300">{stats.active}</p>
                </div>
                <div onClick={() => setFilterStatus('expiring')} className={`cursor-pointer p-4 rounded-lg border bg-black/40 ${filterStatus === 'expiring' ? 'border-yellow-500' : 'border-green-500/20'}`}>
                    <p className="text-xs text-yellow-400 uppercase">Por Vencer (7 días)</p>
                    <p className="text-2xl font-bold text-yellow-300">{stats.expiring}</p>
                </div>
                <div onClick={() => setFilterStatus('expired')} className={`cursor-pointer p-4 rounded-lg border bg-black/40 ${filterStatus === 'expired' ? 'border-red-500' : 'border-green-500/20'}`}>
                    <p className="text-xs text-red-400 uppercase">Vencidas</p>
                    <p className="text-2xl font-bold text-red-300">{stats.expired}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Buscar licencia o cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-style w-64"
                />
                <button onClick={() => { setEditingId(null); resetForm(); setIsFormOpen(true); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Nueva Licencia
                </button>
            </div>

            <Table columns={columns} data={filteredData} renderActions={renderActions} />

            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Editar Licencia" : "Nueva Licencia"}>
                <div className="space-y-4">
                    
                    {/* Advanced Customer Selector */}
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Buscar Cliente</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type="text" 
                                    className="input-style w-full pl-8"
                                    placeholder="Nombre, Alias, Teléfono o Email..."
                                    value={customerSearchQuery}
                                    onChange={(e) => { setCustomerSearchQuery(e.target.value); setShowCustomerDropdown(true); }}
                                    onFocus={() => setShowCustomerDropdown(true)}
                                    disabled={!!editingId}
                                />
                                <div className="absolute top-3 left-2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </div>
                            </div>
                            {!editingId && (
                                <button onClick={() => setIsQuickAddOpen(true)} className="px-3 bg-green-700 text-white rounded hover:bg-green-600" title="Nuevo Cliente Rápido">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </button>
                            )}
                        </div>

                        {showCustomerDropdown && !editingId && (
                            <div className="absolute z-10 w-full bg-gray-900 border border-green-500/30 mt-1 rounded max-h-48 overflow-y-auto shadow-xl">
                                {filteredCustomers.map(c => (
                                    <div 
                                        key={c.id} 
                                        className="p-2 hover:bg-green-900/30 cursor-pointer border-b border-gray-800 last:border-0"
                                        onClick={() => handleSelectCustomer(c)}
                                    >
                                        <div className="font-bold text-white text-sm">{c.name} {c.alias ? `(${c.alias})` : ''}</div>
                                        <div className="text-xs text-gray-400 flex justify-between">
                                            <span>{c.phone}</span>
                                            <span>{c.email}</span>
                                        </div>
                                    </div>
                                ))}
                                {filteredCustomers.length === 0 && (
                                    <div className="p-2 text-gray-500 text-xs text-center">No se encontraron clientes.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* License Pool / Stats Panel */}
                    {formData.customerId && (
                        <div className="bg-black/30 p-3 rounded border border-blue-500/30 flex justify-between items-center text-xs">
                            <div className="flex flex-col items-center flex-1 border-r border-gray-700">
                                <span className="text-gray-400 uppercase tracking-wider">Adquiridas</span>
                                <span className="text-xl font-bold text-white">{totalPurchased}</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 border-r border-gray-700">
                                <span className="text-gray-400 uppercase tracking-wider">Activas</span>
                                <span className="text-xl font-bold text-yellow-400">{installedCount}</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <span className="text-gray-400 uppercase tracking-wider">Disponibles</span>
                                <span className={`text-xl font-bold ${availableCredits > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {availableCredits}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleAddCredits(formData.customerId!, 1)}
                                className="ml-4 bg-blue-900/50 text-blue-300 px-3 py-2 rounded hover:bg-blue-800 border border-blue-600/30"
                            >
                                + Agregar al Pool
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Servicio</label>
                            <input 
                                type="text" 
                                className="input-style" 
                                value={formData.serviceName} 
                                onChange={e => setFormData({...formData, serviceName: e.target.value})}
                                list="services-list"
                            />
                            <datalist id="services-list">
                                <option value="Streaming Premium" />
                                <option value="Xupero Backup" />
                                <option value="Licencia Antivirus" />
                                <option value="Soporte Remoto" />
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Categoría Dispositivo</label>
                            <select 
                                className="input-style" 
                                value={formData.category} 
                                onChange={e => setFormData({...formData, category: e.target.value as LicenseCategory})} 
                            >
                                <option value="Mobile Only">Solo Móvil</option>
                                <option value="TV/Box (Pantalla)">TV Box / SmartTV</option>
                                <option value="Combo (Mobile+TV)">Combo (Pantalla + Móvil)</option>
                            </select>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-gray-900/50 p-3 rounded border border-gray-700">
                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Configuración de Precio</label>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="block text-[10px] text-gray-400">Precio Base ($)</label>
                                <input 
                                    type="number" 
                                    className="input-style text-right" 
                                    value={formData.cost} 
                                    onChange={e => setFormData({...formData, cost: Number(e.target.value)})} 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400">Descuento ($)</label>
                                <input 
                                    type="number" 
                                    className="input-style text-right text-yellow-400" 
                                    value={formData.discount} 
                                    onChange={e => setFormData({...formData, discount: Number(e.target.value)})} 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-400">Total Final ($)</label>
                                <div className="input-style bg-black text-right font-bold text-green-400 border-green-500/50">
                                    {formData.finalPrice?.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Método de Pago</label>
                            <select 
                                className="input-style" 
                                value={formData.paymentMethod} 
                                onChange={e => setFormData({...formData, paymentMethod: e.target.value as any})} 
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                                <option value="Saldo a Favor">Saldo a Favor</option>
                                <option value="Cortesia">Cortesía</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Fecha Inicio</label>
                            <input 
                                type="date" 
                                className="input-style" 
                                value={formData.startDate} 
                                onChange={e => setFormData({...formData, startDate: e.target.value})} 
                            />
                        </div>
                    </div>
                    
                    <div>
                         <label className="block text-sm font-medium text-gray-400">Notas</label>
                         <textarea 
                            className="input-style" 
                            rows={2} 
                            value={formData.notes || ''} 
                            onChange={e => setFormData({...formData, notes: e.target.value})} 
                        />
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
                        <input 
                            type="checkbox" 
                            id="autorenew" 
                            checked={formData.autoRenewal} 
                            onChange={e => setFormData({...formData, autoRenewal: e.target.checked})}
                            className="w-4 h-4 text-green-600 rounded bg-gray-700 border-gray-600"
                        />
                        <label htmlFor="autorenew" className="text-sm text-gray-300 cursor-pointer">
                            Cliente Full (Renovación Automática / Periodo Full)
                        </label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                            Guardar Licencia
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Quick Add Customer Modal Nested */}
            <Modal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} title="Alta Rápida de Cliente">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Nombre Completo</label>
                        <input 
                            type="text" 
                            className="input-style" 
                            value={newCustomerData.name} 
                            onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})}
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Teléfono</label>
                            <input 
                                type="text" 
                                className="input-style" 
                                value={newCustomerData.phone} 
                                onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Email</label>
                            <input 
                                type="text" 
                                className="input-style" 
                                value={newCustomerData.email} 
                                onChange={e => setNewCustomerData({...newCustomerData, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={handleSaveQuickCustomer} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Guardar y Seleccionar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Memberships;
