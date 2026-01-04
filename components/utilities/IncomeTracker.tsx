
import React, { useState } from 'react';
import { mockIncome } from '../../data/mockData';
import type { Income } from '../../types';

const IncomeTracker: React.FC = () => {
    const [incomes, setIncomes] = useState<Income[]>(mockIncome);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Venta Directa');
    const [categories, setCategories] = useState(['Venta Directa', 'Servicio Adicional', 'Otro']);

    const handleAddCategory = () => {
        const newCategory = window.prompt("Ingrese el nombre de la nueva categoría de ingreso:");
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setCategory(newCategory);
        } else if (newCategory) {
            alert("Esa categoría ya existe.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || parseFloat(amount) <= 0) {
            alert('Por favor, complete todos los campos correctamente.');
            return;
        }

        const newIncome: Income = {
            id: `INC${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            category,
        };

        setIncomes([newIncome, ...incomes]);
        setDescription('');
        setAmount('');
        setCategory('Venta Directa');
    };

    return (
        <div className="bg-black/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Registrar Ingreso Extra</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400">Descripción</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Venta de material sobrante" className="input-style" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Monto</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="input-style" />
                </div>
                <div className="flex items-end">
                    <div className="flex-grow">
                        <label className="block text-sm font-medium text-gray-400">Categoría</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="input-style">
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <button type="button" onClick={handleAddCategory} className="ml-2 px-3 py-2 bg-gray-700 text-green-300 rounded-lg hover:bg-gray-600 h-[42px] shrink-0">[+]</button>
                 </div>
                <button type="submit" className="md:col-span-4 w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                    Agregar Ingreso
                </button>
            </form>
            <div className="mt-6 border-t pt-4 border-green-500/20">
                <h4 className="font-semibold mb-2 text-green-200">Ingresos Recientes</h4>
                <div className="max-h-64 overflow-y-auto">
                    <ul className="space-y-2">
                        {incomes.map(inc => (
                            <li key={inc.id} className="flex justify-between items-center p-2 bg-green-900/30 rounded list-item-enter">
                                <div>
                                    <p className="font-medium">{inc.description}</p>
                                    <p className="text-xs text-gray-500">{inc.date} - <span className="text-purple-400">{inc.category}</span></p>
                                </div>
                                <span className="font-bold text-green-400">+${inc.amount.toFixed(2)}</span>
                            </li>
                        ))}
                         {incomes.length === 0 && <p className="text-center text-sm text-gray-500">:: No hay ingresos registrados ::</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default IncomeTracker;
