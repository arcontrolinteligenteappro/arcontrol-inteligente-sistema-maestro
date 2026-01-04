
import React, { useState, useMemo } from 'react';
import Header from './Header';
import { mockCommunicationEvents, mockCustomers, mockEmployees, mockReminders, mockManufacturingOrders } from '../data/mockData';
import type { CommunicationEvent, Employee } from '../types';
import Modal from './common/Modal';

// Mock Tasks combining events, reminders, orders
interface DailyTask {
    id: string;
    time: string;
    title: string;
    description: string;
    type: 'Visita' | 'Instalación' | 'Llamada' | 'Pendiente' | 'Soporte';
    status: 'Pendiente' | 'En Proceso' | 'Completado';
    assignedTo?: string; // Employee ID
    location?: string;
    customerId?: string;
}

const DailyLog: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [tasks, setTasks] = useState<DailyTask[]>([]);
    const [filterEmployee, setFilterEmployee] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<DailyTask | null>(null);

    // Initial Load Logic
    useMemo(() => {
        // Generate mock daily tasks from existing data for the selected date
        const generatedTasks: DailyTask[] = [];

        // 1. From Communication Events
        mockCommunicationEvents.forEach(evt => {
            if (evt.date === selectedDate) {
                const customer = mockCustomers.find(c => c.id === evt.customerId);
                generatedTasks.push({
                    id: evt.id,
                    time: evt.time,
                    title: `${evt.type}: ${customer?.name}`,
                    description: evt.notes,
                    type: evt.type === 'Visita' ? 'Visita' : evt.type === 'Llamada' ? 'Llamada' : 'Soporte',
                    status: evt.status as any,
                    location: customer?.address,
                    customerId: evt.customerId
                });
            }
        });

        // 2. From Reminders (Assign default time if missing)
        mockReminders.filter(r => r.status === 'Pendiente').forEach((rem, idx) => {
             // Mock assign to today for demo
             generatedTasks.push({
                id: rem.id,
                time: `09:${idx}0`,
                title: rem.title,
                description: `Prioridad: ${rem.priority}`,
                type: 'Pendiente',
                status: 'Pendiente'
             });
        });

        // 3. From Manufacturing (Installations)
        mockManufacturingOrders.filter(o => o.status === 'En Proceso').forEach(o => {
             // Mock install date
             generatedTasks.push({
                 id: o.id,
                 time: '14:00',
                 title: `Instalación: ${o.productName}`,
                 description: o.notes || 'Instalación pendiente',
                 type: 'Instalación',
                 status: 'Pendiente',
                 location: 'Taller / Cliente'
             });
        });

        setTasks(generatedTasks.sort((a,b) => a.time.localeCompare(b.time)));
    }, [selectedDate]);

    const filteredTasks = tasks.filter(t => filterEmployee === 'all' || t.assignedTo === filterEmployee);

    const handleAssign = (employeeId: string) => {
        if(selectedTask) {
            setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, assignedTo: employeeId } : t));
            setIsAssignModalOpen(false);
            setSelectedTask(null);
        }
    };

    const updateStatus = (taskId: string, status: DailyTask['status']) => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    };

    return (
        <div className="h-full flex flex-col">
            <Header title="Bitácora Operativa y Rutas" />
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-black/40 p-4 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-4">
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={e => setSelectedDate(e.target.value)} 
                        className="input-style"
                    />
                    <select 
                        value={filterEmployee} 
                        onChange={e => setFilterEmployee(e.target.value)} 
                        className="input-style min-w-[200px]"
                    >
                        <option value="all">Todos los Empleados</option>
                        {mockEmployees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                    </select>
                </div>
                
                <div className="flex space-x-2 bg-gray-900 rounded p-1">
                    <button 
                        onClick={() => setViewMode('timeline')}
                        className={`px-4 py-1.5 rounded text-sm transition-colors ${viewMode === 'timeline' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Cronología
                    </button>
                    <button 
                        onClick={() => setViewMode('map')}
                        className={`px-4 py-1.5 rounded text-sm transition-colors ${viewMode === 'map' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        Ruta (Mapa)
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                
                {/* Task List / Timeline */}
                <div className={`flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 ${viewMode === 'map' ? 'hidden md:block md:w-1/3 md:flex-none' : ''}`}>
                    {filteredTasks.length === 0 && (
                        <div className="text-center text-gray-500 py-10 border border-dashed border-gray-700 rounded-lg">
                            No hay actividades programadas para este día.
                        </div>
                    )}
                    
                    {filteredTasks.map(task => {
                        const assignedEmp = mockEmployees.find(e => e.id === task.assignedTo);
                        return (
                            <div key={task.id} className={`relative pl-4 border-l-2 ${task.status === 'Completado' ? 'border-green-500' : 'border-gray-700'} pb-4 last:pb-0`}>
                                {/* Time Marker */}
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${task.status === 'Completado' ? 'bg-green-500 border-green-500' : 'bg-black border-gray-500'}`}></div>
                                
                                <div className="bg-black/30 border border-green-500/10 p-3 rounded-lg hover:border-green-500/30 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-mono text-green-400 font-bold text-sm bg-green-900/20 px-1 rounded">{task.time}</span>
                                        <div className="flex space-x-1">
                                            {task.status !== 'Completado' && (
                                                <button onClick={() => updateStatus(task.id, 'Completado')} className="text-xs border border-green-500 text-green-500 px-2 py-0.5 rounded hover:bg-green-500 hover:text-black">✓</button>
                                            )}
                                            <button onClick={() => { setSelectedTask(task); setIsAssignModalOpen(true); }} className="text-xs border border-blue-500 text-blue-500 px-2 py-0.5 rounded hover:bg-blue-500 hover:text-white">👤</button>
                                        </div>
                                    </div>
                                    
                                    <h4 className={`font-bold ${task.status === 'Completado' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                                        {task.title}
                                    </h4>
                                    
                                    <div className="flex items-center text-xs text-gray-400 mt-1 space-x-3">
                                        <span className={`px-1.5 rounded uppercase font-bold text-[10px] 
                                            ${task.type === 'Visita' ? 'bg-blue-900/50 text-blue-300' : 
                                              task.type === 'Instalación' ? 'bg-orange-900/50 text-orange-300' : 
                                              'bg-gray-800 text-gray-300'}`}>
                                            {task.type}
                                        </span>
                                        {assignedEmp && (
                                            <span className="flex items-center text-purple-300">
                                                <span className="mr-1">●</span> {assignedEmp.name}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {task.location && (
                                        <p className="text-xs text-gray-500 mt-2 flex items-start">
                                            <svg className="w-3 h-3 mr-1 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                            {task.location}
                                        </p>
                                    )}
                                    
                                    {task.description && <p className="text-xs text-gray-500 mt-1 italic">{task.description}</p>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Map Visualization (Mocked) */}
                {(viewMode === 'map' || viewMode === 'timeline') && (
                    <div className={`flex-1 bg-gray-900 rounded-lg border border-green-500/20 relative overflow-hidden ${viewMode === 'timeline' ? 'hidden lg:block' : 'block'}`}>
                        {/* Mock Map Background */}
                        <div className="absolute inset-0 opacity-20" style={{ 
                            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}></div>
                        
                        {/* Mock Route Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M100,100 L300,200 L200,400 L500,300" fill="none" stroke="#00ff41" strokeWidth="2" strokeDasharray="5,5" className="opacity-60" />
                        </svg>

                        {/* Mock Pins */}
                        <div className="absolute top-[100px] left-[100px] transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap hidden group-hover:block z-10 border border-blue-500">
                                Inicio: Oficina
                            </div>
                        </div>

                        {filteredTasks.filter(t => t.location).map((t, i) => {
                            // Generate pseudo-random positions for demo based on string hash
                            const hash = t.id.split('').reduce((a,b)=>a+b.charCodeAt(0),0);
                            const top = (hash % 60) + 20; // 20-80%
                            const left = ((hash * 13) % 70) + 15; // 15-85%
                            
                            return (
                                <div key={t.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer" style={{ top: `${top}%`, left: `${left}%` }}>
                                    <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-lg text-[10px] font-bold text-black ${t.status === 'Completado' ? 'bg-gray-400' : 'bg-green-500'}`}>
                                        {i + 1}
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 px-3 py-2 rounded text-xs whitespace-nowrap hidden group-hover:block z-10 border border-green-500 min-w-[150px]">
                                        <p className="font-bold text-white">{t.title}</p>
                                        <p className="text-gray-400">{t.time} - {t.type}</p>
                                        {t.assignedTo && <p className="text-purple-300 text-[10px]">Asignado: {mockEmployees.find(e=>e.id===t.assignedTo)?.name}</p>}
                                    </div>
                                </div>
                            );
                        })}
                        
                        <div className="absolute bottom-4 right-4 bg-black/80 p-2 rounded border border-gray-700 text-[10px] text-gray-400">
                            <p>Visualización de Ruta Estimada</p>
                            <p className="text-green-500">● Pendiente</p>
                            <p className="text-gray-500">● Completado</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Assign Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Asignar Responsable">
                <div className="space-y-4">
                    <p className="text-sm text-gray-300">Selecciona el empleado encargado de: <br/><span className="text-green-400 font-bold">{selectedTask?.title}</span></p>
                    <div className="grid grid-cols-1 gap-2">
                        {mockEmployees.map(emp => (
                            <button 
                                key={emp.id}
                                onClick={() => handleAssign(emp.id)}
                                className="flex justify-between items-center p-3 bg-gray-800 rounded hover:bg-gray-700 border border-transparent hover:border-green-500/50 transition-colors"
                            >
                                <span className="text-sm font-bold text-white">{emp.name}</span>
                                <span className="text-xs text-gray-500">{emp.position}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DailyLog;
