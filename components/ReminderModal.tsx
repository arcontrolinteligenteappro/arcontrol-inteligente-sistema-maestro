
import React, { useState } from 'react';
import Modal from './common/Modal';
import type { Reminder } from '../types';

interface ReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (reminder: Omit<Reminder, 'id' | 'status'>) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');

    const handleSave = () => {
        if (!title || !dueDate) {
            alert("El título y la fecha de vencimiento son obligatorios.");
            return;
        }
        onSave({ title, dueDate, priority });
        setTitle('');
        setDueDate('');
        setPriority('Media');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nuevo Recordatorio">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Título del Recordatorio</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-style"
                        placeholder="Ej. Llamar al cliente..."
                        autoFocus
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Fecha de Vencimiento</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="input-style"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Prioridad</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as any)}
                            className="input-style"
                        >
                            <option value="Alta">Alta</option>
                            <option value="Media">Media</option>
                            <option value="Baja">Baja</option>
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500"
                    >
                        Guardar Recordatorio
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ReminderModal;
