
import React, { useState } from 'react';
import Header from './Header';
import Table from './common/Table';
import Modal from './common/Modal';
import { mockManufacturingOrders, mockProducts } from '../data/mockData';
import type { ManufacturingOrder, Product } from '../types';

const Manufacture: React.FC = () => {
    const [orders, setOrders] = useState<ManufacturingOrder[]>(mockManufacturingOrders);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form State
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');

    const manufacturedProducts = mockProducts.filter(p => p.productType === 'Manufacturado');
    const rawMaterials = mockProducts.filter(p => p.productType === 'Materia Prima');

    const handleCreateOrder = () => {
        if(!selectedProduct || quantity <= 0) {
            alert("Seleccione un producto y cantidad válida.");
            return;
        }

        const productDetails = mockProducts.find(p => p.id === selectedProduct);
        
        // Simple logic: Assume creation requires 1 of each available raw material for demo
        // In real app, pull BOM from product definition
        const estimatedMaterials = rawMaterials.slice(0, 2).map(rm => ({
            materialId: rm.id,
            materialName: rm.name,
            quantityRequired: quantity // 1 per unit
        }));

        const newOrder: ManufacturingOrder = {
            id: `MO-${Date.now()}`,
            productToProduceId: selectedProduct,
            productName: productDetails?.name || 'Producto Desconocido',
            quantity: quantity,
            startDate: startDate,
            status: 'Planificado',
            materials: estimatedMaterials,
            notes: notes
        };

        setOrders([newOrder, ...orders]);
        setIsModalOpen(false);
        // Reset form
        setSelectedProduct('');
        setQuantity(1);
        setNotes('');
    };

    const updateStatus = (orderId: string, newStatus: ManufacturingOrder['status']) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    const columns = [
        { header: 'ID Orden', accessor: 'id' as keyof ManufacturingOrder },
        { header: 'Producto a Producir', accessor: 'productName' as keyof ManufacturingOrder },
        { header: 'Cantidad', accessor: 'quantity' as keyof ManufacturingOrder },
        { header: 'Fecha Inicio', accessor: 'startDate' as keyof ManufacturingOrder },
        { header: 'Estado', accessor: 'status' as keyof ManufacturingOrder, render: (row: ManufacturingOrder) => (
             <span className={`px-2 py-1 rounded text-xs font-bold 
                ${row.status === 'Completado' ? 'bg-green-900 text-green-200 border border-green-500' : 
                  row.status === 'En Proceso' ? 'bg-blue-900 text-blue-200 border border-blue-500' :
                  row.status === 'Control Calidad' ? 'bg-purple-900 text-purple-200 border border-purple-500' :
                  'bg-gray-700 text-gray-300'}`}>
                {row.status}
             </span>
        )},
    ];

    const renderActions = (row: ManufacturingOrder) => (
        <div className="flex space-x-2 justify-end">
            {row.status === 'Planificado' && (
                <button onClick={() => updateStatus(row.id, 'En Proceso')} className="text-blue-400 hover:text-blue-300 text-xs border border-blue-500/50 px-2 py-1 rounded">Iniciar</button>
            )}
            {row.status === 'En Proceso' && (
                <button onClick={() => updateStatus(row.id, 'Control Calidad')} className="text-purple-400 hover:text-purple-300 text-xs border border-purple-500/50 px-2 py-1 rounded">Revisión</button>
            )}
            {row.status === 'Control Calidad' && (
                <button onClick={() => updateStatus(row.id, 'Completado')} className="text-green-400 hover:text-green-300 text-xs border border-green-500/50 px-2 py-1 rounded">Terminar</button>
            )}
        </div>
    );

    return (
        <div>
            <Header title="Gestión de Manufactura y Producción" />
            
            <div className="flex justify-between items-center mb-6">
                <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                    <div className="bg-black/40 border border-green-500/20 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 uppercase">Órdenes Activas</p>
                        <p className="text-2xl font-bold text-blue-400">{orders.filter(o => o.status === 'En Proceso').length}</p>
                    </div>
                     <div className="bg-black/40 border border-green-500/20 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 uppercase">En Control de Calidad</p>
                        <p className="text-2xl font-bold text-purple-400">{orders.filter(o => o.status === 'Control Calidad').length}</p>
                    </div>
                    <div className="bg-black/40 border border-green-500/20 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 uppercase">Completadas (Mes)</p>
                        <p className="text-2xl font-bold text-green-400">{orders.filter(o => o.status === 'Completado').length}</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 flex items-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Nueva Orden
                </button>
            </div>

            <Table columns={columns} data={orders} renderActions={renderActions} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nueva Orden de Producción">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Producto a Fabricar</label>
                        <select 
                            value={selectedProduct} 
                            onChange={(e) => setSelectedProduct(e.target.value)} 
                            className="input-style"
                        >
                            <option value="">Seleccione Producto Manufacturado</option>
                            {manufacturedProducts.map(p => <option key={p.id} value={p.id}>{p.name} (SKU: {p.sku})</option>)}
                        </select>
                        {manufacturedProducts.length === 0 && <p className="text-xs text-red-400 mt-1">No hay productos tipo 'Manufacturado' en inventario.</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Cantidad</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="input-style" min="1"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Fecha Planificada</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-style"/>
                        </div>
                    </div>

                    <div className="border-t border-green-500/20 pt-4">
                        <p className="text-sm font-semibold text-green-300 mb-2">Materiales Requeridos (Estimado)</p>
                        {selectedProduct ? (
                             <ul className="text-sm text-gray-400 space-y-1 bg-black/30 p-2 rounded">
                                 {rawMaterials.slice(0,2).map(rm => (
                                     <li key={rm.id} className="flex justify-between">
                                         <span>{rm.name}</span>
                                         <span>x{quantity} {rm.unit}</span>
                                     </li>
                                 ))}
                             </ul>
                        ) : <p className="text-xs text-gray-500 italic">Seleccione un producto para ver la lista de materiales.</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400">Notas / Lote</label>
                        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-style" rows={2} placeholder="Instrucciones especiales..."></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleCreateOrder} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                            Crear Orden
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Manufacture;
