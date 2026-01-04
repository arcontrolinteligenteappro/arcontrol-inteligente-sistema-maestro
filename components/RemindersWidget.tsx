
import React from 'react';
import type { Reminder } from '../types';

interface RemindersWidgetProps {
    reminders: Reminder[];
    onToggleStatus: (id: string) => void;
}

const RemindersWidget: React.FC<RemindersWidgetProps> = ({ reminders, onToggleStatus }) => {
    const pendingReminders = reminders.filter(r => r.status === 'Pendiente');

    const getPriorityStyles = (priority: Reminder['priority']) => {
        switch (priority) {
            case 'Alta': return 'border-l-4 border-red-500 bg-red-900/20';
            case 'Media': return 'border-l-4 border-yellow-500 bg-yellow-900/20';
            case 'Baja': return 'border-l-4 border-blue-500 bg-blue-900/20';
            default: return 'border-l-4 border-gray-500';
        }
    };
    
    return (
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg rounded-lg p-6 h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-green-300">Eventos Pendientes</h3>
            <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {pendingReminders.length > 0 ? pendingReminders.map(reminder => (
                    <div key={reminder.id} className={`p-3 rounded-md flex items-start justify-between list-item-enter ${getPriorityStyles(reminder.priority)}`}>
                        <div className="flex items-start">
                             <input 
                                type="checkbox"
                                className="mt-1 h-4 w-4 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500 cursor-pointer"
                                onChange={() => onToggleStatus(reminder.id)}
                            />
                            <div className="ml-3">
                                <p className="font-medium text-gray-200">{reminder.title}</p>
                                <p className="text-xs text-gray-400">Vence: {reminder.dueDate}</p>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">¡Sin pendientes por ahora!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RemindersWidget;
