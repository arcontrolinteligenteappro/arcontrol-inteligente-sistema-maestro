
import React, { useState } from 'react';
import { mockProducts, mockWastage } from '../../data/mockData';
import type { Wastage } from '../../types';

const WastageTracker: React.FC = () => {
    const [wastageList, setWastageList] = useState<Wastage[]>(mockWastage);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const product = mockProducts.find(p => p.id === selectedProduct);
        if (!product || !quantity || parseInt(quantity) <= 0 || !reason) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }

        const newWastage: Wastage = {
            id: `WST${Date.now()}`,
            productId: product.id,
            productName: product.name,
            quantity: parseInt(quantity),
            date: new Date().toISOString().split('T')[0],
            reason,
        };

        setWastageList([newWastage, ...wastageList]);
        setSelectedProduct('');
        setQuantity('');
        setReason('');
    };

    return (
         <div className="bg-black/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Registrar Merma de Producto</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400">Producto</label>
                     <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} className="input-style">
                        <option value="">Seleccione un producto...</option>
                        {mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Cantidad</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="input-style" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Razón</label>
                    <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Ej. Dañado" className="input-style" />
                </div>
                <button type="submit" className="md:col-span-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 mt-2">
                    Registrar Merma
                </button>
            </form>
            
            <div className="mt-6 border-t pt-4 border-green-500/20">
                 <h4 className="font-semibold mb-2 text-green-200">Mermas Recientes</h4>
                 <div className="max-h-64 overflow-y-auto">
                    <ul className="space-y-2">
                         {wastageList.map(item => (
                            <li key={item.id} className="flex justify-between items-center p-2 bg-green-900/30 rounded list-item-enter">
                                <div>
                                    <p className="font-medium">{item.quantity}x {item.productName}</p>
                                    <p className="text-xs text-gray-500">{item.date} - {item.reason}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WastageTracker;
