
import React from 'react';
import Header from './Header';
import type { Reminder } from '../types';
import RemindersWidget from './RemindersWidget';

interface DashboardProps {
    reminders: Reminder[];
    onToggleReminder: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ reminders, onToggleReminder }) => {
    
    const StatCard = ({ title, value, trend, trendUp, icon, delay }: any) => (
        <div 
            className="relative group overflow-hidden bg-[#0a0f0a] border border-[#00ff41]/20 rounded p-5 transition-all duration-300 hover:border-[#00ff41] hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] view-enter"
            style={{ animationDelay: `${delay}s` }}
        >
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff41] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff41] opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start z-10 relative">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mb-1 group-hover:text-green-400 transition-colors">{title}</p>
                    <h3 className="text-3xl font-bold text-white font-tech tracking-wide group-hover:text-[#00ff41] transition-colors">{value}</h3>
                </div>
                <div className="p-2 bg-[#00ff41]/10 text-[#00ff41] rounded group-hover:bg-[#00ff41] group-hover:text-black transition-colors duration-300">
                    {icon}
                </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs font-mono z-10 relative">
                <span className={`${trendUp ? 'text-[#00ff41]' : 'text-red-500'} flex items-center`}>
                    {trendUp ? '▲' : '▼'} {trend}
                </span>
                <span className="text-gray-600 ml-2">vs. mes anterior</span>
            </div>
            
            {/* Background Grid Decoration */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiLz4KPC9zdmc+')] opacity-30 pointer-events-none"></div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/0 to-[#00ff41]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
    );

    return (
        <div>
            <Header title="Centro de Comando" />
            
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard 
                    title="Ingresos Totales" 
                    value="$402,560" 
                    trend="2.5%" 
                    trendUp={true}
                    delay={0.1}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
                />
                <StatCard 
                    title="Usuarios Activos" 
                    value="1,204" 
                    trend="15.8%" 
                    trendUp={true}
                    delay={0.2}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                />
                <StatCard 
                    title="Stock Crítico" 
                    value="12 Items" 
                    trend="1.2%" 
                    trendUp={false}
                    delay={0.3}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>}
                />
                <StatCard 
                    title="Tickets Abiertos" 
                    value="35" 
                    trend="5.0%" 
                    trendUp={true}
                    delay={0.4}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main HUD Panel */}
                <div className="lg:col-span-2 relative bg-[#050505] border border-[#00ff41]/20 rounded p-6 shadow-2xl view-enter" style={{ animationDelay: '0.5s' }}>
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-800">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center">
                            <span className="w-2 h-2 bg-[#00ff41] mr-3 animate-pulse"></span>
                            Resumen Operativo
                        </h3>
                        <div className="text-[10px] font-mono text-gray-500">SYSTEM_ID: ARC-9000</div>
                    </div>
                    
                    <div className="space-y-4 text-gray-400 text-sm leading-relaxed font-light">
                        <p>
                            <strong className="text-[#00ff41]">AR CONTROL SYSTEM v2.5.0</strong> inicializado correctamente. 
                            Todos los módulos operativos están funcionando dentro de los parámetros nominales.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-gray-900/50 p-3 rounded border-l-2 border-blue-500 hover:bg-gray-900 transition-colors cursor-default">
                                <h4 className="text-xs font-bold text-blue-400 mb-1">MÓDULO VENTAS</h4>
                                <p className="text-xs">Sincronización web activa. 3 Pedidos pendientes de despacho.</p>
                            </div>
                            <div className="bg-gray-900/50 p-3 rounded border-l-2 border-purple-500 hover:bg-gray-900 transition-colors cursor-default">
                                <h4 className="text-xs font-bold text-purple-400 mb-1">MÓDULO SEGURIDAD</h4>
                                <p className="text-xs">Último escaneo completado. Sin vulnerabilidades críticas detectadas.</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Code Block */}
                    <div className="mt-6 p-3 bg-black border border-green-900/30 rounded font-mono text-[10px] text-green-800 overflow-hidden relative group">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/80 group-hover:opacity-50 transition-opacity duration-500"></div>
                        <p>{`> initializing protocols... OK`}</p>
                        <p>{`> mounting file system... OK`}</p>
                        <p>{`> checking dependencies... OK`}</p>
                        <p>{`> starting daemon service...`}</p>
                        <p className="animate-pulse text-green-500">{`> system ready.`}</p>
                    </div>
                </div>

                {/* Side Widget */}
                <div className="lg:col-span-1 view-enter" style={{ animationDelay: '0.6s' }}>
                     <RemindersWidget reminders={reminders} onToggleStatus={onToggleReminder} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
