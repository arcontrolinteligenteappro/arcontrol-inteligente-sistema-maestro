
import React, { useState } from 'react';
import { mockExpenses } from '../../data/mockData';
import type { Expense } from '../../types';

const ExpenseTracker: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Varios');
    const [categories, setCategories] = useState(['Combustible', 'Viáticos', 'Comidas', 'Material', 'Extra', 'Varios']);

    const handleAddCategory = () => {
        const newCategory = window.prompt("Ingrese el nombre de la nueva categoría:");
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

        const newExpense: Expense = {
            id: `EXP${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description,
            amount: parseFloat(amount),
            category,
        };

        setExpenses([newExpense, ...expenses]);
        setDescription('');
        setAmount('');
        setCategory('Varios');
    };
    
    return (
        <div className="bg-black/50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Registrar Nuevo Gasto</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400">Descripción</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ej. Renta de local" className="input-style" />
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
                    Agregar Gasto
                </button>
            </form>
            
            <div className="mt-6 border-t pt-4 border-green-500/20">
                <h4 className="font-semibold mb-2 text-green-200">Gastos Recientes</h4>
                 <div className="max-h-64 overflow-y-auto">
                    <ul className="space-y-2">
                        {expenses.map(exp => (
                            <li key={exp.id} className="flex justify-between items-center p-2 bg-green-900/30 rounded list-item-enter">
                                <div>
                                    <p className="font-medium">{exp.description}</p>
                                    <p className="text-xs text-gray-500">{exp.date} - <span className="text-purple-400">{exp.category}</span></p>
                                </div>
                                <span className="font-bold text-red-400">-${exp.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracker;
