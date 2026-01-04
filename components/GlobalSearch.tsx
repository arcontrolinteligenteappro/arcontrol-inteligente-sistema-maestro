
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    mockProducts, 
    mockCustomers, 
    mockSuppliers, 
    mockEmployees, 
    mockFiles, 
    mockPlans, 
    mockNetworkMaps,
    mockMemberships,
    mockManufacturingOrders,
    mockSales
} from '../data/mockData';
import BarcodeScanner from './common/BarcodeScanner';
import type { View } from '../types';

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (view: View, itemId?: string) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Aggregate all searchable items
    const allItems = useMemo(() => {
        const items: any[] = [];

        // 1. Products & Services (Includes QR/SKU search)
        mockProducts.forEach(p => items.push({
            id: p.id,
            type: p.productType === 'Servicio' ? 'Servicio' : 'Articulo/Producto',
            title: p.name,
            subtitle: `SKU: ${p.sku} | $${p.price}`,
            view: 'inventory' as View,
            // Indexing SKU allows QR search to work
            keywords: `${p.name} ${p.sku} ${p.category} ${p.description || ''} ${p.notes || ''}`
        }));

        // 2. Customers & Suppliers (Includes Notes)
        [...mockCustomers, ...mockSuppliers].forEach(c => items.push({
            id: c.id,
            type: c.id.startsWith('SUP') ? 'Proveedor' : 'Cliente',
            title: c.name,
            subtitle: c.alias ? `${c.alias} | ${c.email}` : c.email,
            view: 'customers' as View,
            keywords: `${c.name} ${c.alias || ''} ${c.email} ${c.phone} ${c.address || ''} ${c.notes || ''}`
        }));

        // 3. Employees (Includes Notes)
        mockEmployees.forEach(e => items.push({
            id: e.id,
            type: 'Empleado',
            title: e.name,
            subtitle: e.position,
            view: 'employees' as View,
            keywords: `${e.name} ${e.alias || ''} ${e.position} ${e.email} ${e.notes || ''}`
        }));

        // 4. Files (Names & Notes)
        mockFiles.forEach(f => items.push({
            id: f.id,
            type: 'Archivo',
            title: f.name,
            subtitle: `${f.type} (${f.source})`,
            view: 'files' as View,
            keywords: `${f.name} ${f.type} ${f.path} ${f.notes || ''}`
        }));
        
        // 5. Diagrams & Plans
        [...mockPlans, ...mockNetworkMaps].forEach(d => items.push({
             id: d.id,
             type: 'Plano/Diagrama',
             title: d.name,
             subtitle: d.customerName,
             view: (d as any).planType ? 'construction' as View : 'network' as View,
             keywords: `${d.name} ${d.customerName} ${d.notes || ''} ${(d as any).planType || (d as any).networkType}`
        }));

        // 6. Memberships / Licenses
        mockMemberships.forEach(m => items.push({
            id: m.id,
            type: 'Licencia/Membresía',
            title: m.serviceName,
            subtitle: `${m.customerName} - ${m.status}`,
            view: 'memberships' as View,
            keywords: `${m.serviceName} ${m.customerName} ${m.notes || ''}`
        }));

        // 7. Manufacturing Orders
        mockManufacturingOrders.forEach(m => items.push({
            id: m.id,
            type: 'Manufactura',
            title: `Prod: ${m.productName}`,
            subtitle: `Estado: ${m.status} | Cant: ${m.quantity}`,
            view: 'manufacture' as View,
            keywords: `${m.id} ${m.productName} ${m.status} ${m.notes || ''}`
        }));

        // 8. Sales / Tickets (Search by ID or Note)
        mockSales.forEach(s => items.push({
            id: s.id,
            type: s.type,
            title: `${s.type} #${s.id}`,
            subtitle: `${s.customerName} - $${s.total}`,
            view: 'sales' as View,
            keywords: `${s.id} ${s.customerName} ${s.notes || ''} ${s.products.map(p=>p.name).join(' ')}`
        }));

        return items;
    }, []);

    const filteredItems = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        // Priority sorting: Exact matches first, then includes
        return allItems
            .filter(item => item.keywords.toLowerCase().includes(lowerQuery))
            .sort((a, b) => {
                const aStarts = a.title.toLowerCase().startsWith(lowerQuery);
                const bStarts = b.title.toLowerCase().startsWith(lowerQuery);
                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            })
            .slice(0, 15);
    }, [query, allItems]);

    const handleSelect = (item: any) => {
        onNavigate(item.view, item.id);
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-start justify-center pt-[10vh] p-4 transition-opacity duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-[#0a0a0a] border border-green-500/30 rounded-xl shadow-[0_0_50px_rgba(0,255,65,0.1)] w-full max-w-3xl overflow-hidden flex flex-col relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="flex items-center p-4 border-b border-green-500/20 bg-black/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-3 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        ref={inputRef}
                        type="text" 
                        className="bg-transparent border-none text-white placeholder-gray-600 focus:ring-0 w-full text-lg outline-none font-mono"
                        placeholder="Buscar archivo, cliente, SKU, nota, plano..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setIsScannerOpen(true)} 
                            className="p-2 bg-gray-900 rounded-md text-gray-400 hover:text-green-400 hover:bg-gray-800 transition-colors border border-gray-700 hover:border-green-500/50"
                            title="Escanear QR / Código de Barras"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
                        </button>
                        <button onClick={onClose} className="px-3 py-1 bg-gray-900 rounded text-xs font-bold text-gray-500 hover:text-white border border-gray-700">ESC</button>
                    </div>
                </div>
                
                {/* Results List */}
                <div className="max-h-[65vh] overflow-y-auto custom-scrollbar bg-black/80">
                    {filteredItems.length > 0 ? (
                        <div className="p-2 space-y-1">
                            {filteredItems.map(item => (
                                <button
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => handleSelect(item)}
                                    className="w-full text-left p-3 rounded-lg hover:bg-green-900/20 group flex items-center justify-between transition-colors border border-transparent hover:border-green-500/30"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="flex items-center">
                                            <p className="font-semibold text-gray-200 group-hover:text-green-400 truncate text-base font-tech tracking-wide">{item.title}</p>
                                            {query && item.keywords.toLowerCase().includes(query.toLowerCase()) && !item.title.toLowerCase().includes(query.toLowerCase()) && (
                                                <span className="ml-2 text-[9px] bg-yellow-900/40 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wider border border-yellow-700/50">
                                                    Coincidencia en nota/info
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{item.subtitle}</p>
                                    </div>
                                    <span className={`shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded border 
                                        ${item.type === 'Articulo/Producto' ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' : 
                                          item.type === 'Cliente' ? 'bg-purple-900/20 text-purple-400 border-purple-500/30' :
                                          item.type === 'Archivo' ? 'bg-orange-900/20 text-orange-400 border-orange-500/30' :
                                          'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                        {item.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        query && (
                            <div className="p-12 text-center text-gray-600 flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <p>No se encontraron resultados para <span className="text-green-500 font-mono">"{query}"</span></p>
                                <p className="text-xs mt-2">Intenta buscar por nombre, nota, SKU, o contenido.</p>
                            </div>
                        )
                    )}
                    {!query && (
                        <div className="p-6">
                            <p className="text-[10px] text-gray-600 mb-4 font-mono uppercase tracking-widest border-b border-gray-800 pb-2">Comandos Rápidos & Categorías</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-center">
                                    <span className="block text-xl mb-1">📦</span>
                                    <span className="text-xs text-gray-400">Inventario</span>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-center">
                                    <span className="block text-xl mb-1">👥</span>
                                    <span className="text-xs text-gray-400">Clientes</span>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-center">
                                    <span className="block text-xl mb-1">📂</span>
                                    <span className="text-xs text-gray-400">Archivos</span>
                                </div>
                                <div className="p-3 bg-gray-900/50 rounded border border-gray-800 text-center">
                                    <span className="block text-xl mb-1">🏗️</span>
                                    <span className="text-xs text-gray-400">Planos</span>
                                </div>
                            </div>
                            <div className="mt-6 text-xs text-gray-600 font-mono">
                                <p>💡 Tip: Escanea un código QR para buscar productos instantáneamente.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Footer Info */}
                <div className="bg-black/80 border-t border-green-500/10 p-2 px-4 flex justify-between items-center text-[10px] text-gray-600 font-mono">
                    <span>GLOBAL SEARCH v2.1</span>
                    <span>INDEX: {allItems.length} ITEMS</span>
                </div>
            </div>
            
            <BarcodeScanner 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScan={(code) => {
                    setIsScannerOpen(false);
                    setQuery(code);
                }} 
            />
        </div>
    );
};

export default GlobalSearch;
