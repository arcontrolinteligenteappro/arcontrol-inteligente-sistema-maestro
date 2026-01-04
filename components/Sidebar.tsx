
import React, { useState } from 'react';
import type { View } from '../types';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    pendingRemindersCount: number;
    onOpenSearch: () => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    language: 'es' | 'en';
    setLanguage: (lang: 'es' | 'en') => void;
}

const ChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const GlobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const SalesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>;
const ManufactureIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V12a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/><circle cx="12" cy="7" r="4"/><path d="M6 12H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2"/><path d="M18 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const MembershipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
const PlanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const SecurityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const RulerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.535 6.071L17.93 2.464a1 1 0 0 0-1.415 0L2.464 16.515a1 1 0 0 0 0 1.414l3.607 3.607a1 1 0 0 0 1.414 0l14.05-14.05a1 1 0 0 0 0-1.415z"/><path d="M6 13l2 2"/><path d="M9 10l2 2"/><path d="M12 7l2 2"/></svg>;
const EmployeesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4 8 4v14"/><path d="M17 7v14"/><path d="M21 11H3"/><path d="M9 11v10"/></svg>;
const ToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const NotebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
const FolderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29a1 1 0 0 0 1.41 0l6.3-6.3a1 1 0 0 0 0-1.42z"/><path d="M6 7v.01"/></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 6v14a2 2 0 0 0 2-2V4a2 2 0 0 0-2 2z"/><path d="M21 6v14a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2z"/><path d="M3 6l9-4 9 4v14l-9-4-9 4V6z"/></svg>;
const TerminalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, pendingRemindersCount, onOpenSearch, isMobileOpen, setIsMobileOpen, language, setLanguage }) => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
        'ops': true,
        'eng': false,
        'adm': false,
        'sys': false
    });

    const toggleCategory = (key: string) => {
        setOpenCategories(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNavigate = (view: View) => {
        setCurrentView(view);
        setIsMobileOpen(false);
    };

    const t = {
        es: {
            ops: 'OPERACIONES', eng: 'INGENIERÍA', adm: 'ADMINISTRACIÓN', sys: 'SISTEMA',
            dailylog: 'Bitácora / Rutas', sales: 'Ventas y Compras', inventory: 'Inventario',
            manufacture: 'Manufactura', customers: 'Cartera Clientes', memberships: 'Membresías',
            promotions: 'Promociones', engineering: 'Planos y Diagramas', security: 'Auditoría Hacking',
            measurement: 'Medición AR', employees: 'Recursos Humanos', reports: 'Reportes Financieros',
            company: 'Datos Empresa', utilities: 'Caja de Herramientas', notebook: 'Notas Encriptadas',
            files: 'Archivos', settings: 'Configuración', search: 'BUSCAR_COMANDO...',
            dashboard: 'DASHBOARD', status: 'ESTADO:', online: 'EN LÍNEA', version: 'VERSIÓN:',
            terminal: 'Terminal / Shell'
        },
        en: {
            ops: 'OPERATIONS', eng: 'ENGINEERING', adm: 'ADMINISTRATION', sys: 'SYSTEM',
            dailylog: 'Daily Log / Routes', sales: 'Sales & Purchasing', inventory: 'Inventory',
            manufacture: 'Manufacturing', customers: 'Customer List', memberships: 'Memberships',
            promotions: 'Promotions', engineering: 'Blueprints & Diagrams', security: 'Hacking Audit',
            measurement: 'AR Measurement', employees: 'Human Resources', reports: 'Financial Reports',
            company: 'Company Data', utilities: 'Toolbox', notebook: 'Encrypted Notes',
            files: 'File Hub', settings: 'Settings', search: 'SEARCH_COMMAND...',
            dashboard: 'DASHBOARD', status: 'STATUS:', online: 'ONLINE', version: 'VERSION:',
            terminal: 'Terminal / Shell'
        }
    };

    const lang = t[language];

    const menuData = [
        {
            id: 'ops',
            label: lang.ops,
            items: [
                { id: 'dailylog', label: lang.dailylog, icon: <MapIcon /> },
                { id: 'sales', label: lang.sales, icon: <SalesIcon /> },
                { id: 'inventory', label: lang.inventory, icon: <InventoryIcon /> },
                { id: 'manufacture', label: lang.manufacture, icon: <ManufactureIcon /> },
                { id: 'customers', label: lang.customers, icon: <CustomersIcon /> },
                { id: 'memberships', label: lang.memberships, icon: <MembershipIcon /> },
                { id: 'promotions', label: lang.promotions, icon: <TagIcon /> },
            ]
        },
        {
            id: 'eng',
            label: lang.eng,
            items: [
                { id: 'engineering', label: lang.engineering, icon: <PlanIcon /> },
                { id: 'security', label: lang.security, icon: <SecurityIcon /> },
                { id: 'measurement', label: lang.measurement, icon: <RulerIcon /> },
            ]
        },
        {
            id: 'adm',
            label: lang.adm,
            items: [
                { id: 'employees', label: lang.employees, icon: <EmployeesIcon /> },
                { id: 'reports', label: lang.reports, icon: <ChartIcon /> },
                { id: 'company', label: lang.company, icon: <BuildingIcon /> },
            ]
        },
        {
            id: 'sys',
            label: lang.sys,
            items: [
                { id: 'terminal', label: lang.terminal, icon: <TerminalIcon /> },
                { id: 'utilities', label: lang.utilities, icon: <ToolIcon /> },
                { id: 'notebook', label: lang.notebook, icon: <NotebookIcon /> },
                { id: 'files', label: lang.files, icon: <FolderIcon /> },
                { id: 'settings', label: lang.settings, icon: <CogIcon /> },
            ]
        }
    ];

    return (
        <>
            <div className={`fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-md transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileOpen(false)} />

            <div className={`fixed lg:static top-0 left-0 h-full w-72 bg-[#020202] border-r border-[#00ff41]/20 text-gray-300 z-50 transform transition-transform duration-300 ease-out shadow-[10px_0_20px_rgba(0,0,0,0.5)] ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
                <div className="h-16 flex items-center justify-between px-5 border-b border-[#00ff41]/20 shrink-0 bg-black/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleNavigate('dashboard')}>
                        <div className="w-2 h-2 bg-[#00ff41] animate-pulse rounded-full"></div>
                        <h1 className="text-xl font-bold tracking-wider text-white font-tech">AR CONTROL</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="text-[10px] font-mono border border-green-500/50 px-2 py-1 rounded text-green-400 hover:bg-green-900/50 flex items-center gap-1 transition-colors">
                            <GlobeIcon /> {language.toUpperCase()}
                        </button>
                        <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 p-1 active:text-white transition-transform active:rotate-90">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="p-4 space-y-2 shrink-0">
                    <button onClick={onOpenSearch} className="w-full bg-[#0a0a0a] border border-[#00ff41]/30 text-gray-400 rounded py-2 px-3 flex items-center text-sm hover:border-[#00ff41] hover:text-[#00ff41] transition-all group active:scale-95 duration-200">
                        <SearchIcon /> <span className="ml-3 font-mono text-xs group-hover:tracking-widest transition-all">{lang.search}</span>
                    </button>
                    <button onClick={() => handleNavigate('dashboard')} className={`w-full flex items-center px-3 py-2 rounded border transition-all duration-200 relative overflow-hidden ${currentView === 'dashboard' ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'border-transparent hover:bg-white/5 text-gray-400 hover:text-white hover:border-gray-700'}`}>
                        <DashboardIcon /> <span className="ml-3 text-sm font-bold tracking-wide">{lang.dashboard}</span>
                        {pendingRemindersCount > 0 && <span className="ml-auto bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">{pendingRemindersCount}</span>}
                        {currentView === 'dashboard' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00ff41] shadow-[0_0_10px_#00ff41]"></div>}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-2 pb-20 scrollbar-thin">
                    {menuData.map((category) => (
                        <div key={category.id} className="mb-2">
                            <button onClick={() => toggleCategory(category.id)} className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-green-400 transition-colors border-b border-gray-800/50 hover:bg-gray-900/30 rounded-t">
                                <span>{category.label}</span>
                                <div className={`transform transition-transform duration-300 ${openCategories[category.id] ? 'rotate-180 text-green-500' : ''}`}>
                                    <ChevronDown />
                                </div>
                            </button>
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openCategories[category.id] ? 'max-h-[500px] opacity-100 py-1' : 'max-h-0 opacity-0'}`}>
                                {category.items.map((item) => (
                                    <button key={item.id} onClick={() => handleNavigate(item.id as View)} className={`w-full flex items-center px-4 py-2 text-sm transition-all duration-200 rounded-r-md border-l-2 ${currentView === item.id ? 'border-[#00ff41] text-white bg-gradient-to-r from-[#00ff41]/20 to-transparent font-medium pl-6' : 'border-transparent text-gray-400 hover:text-[#00ff41] hover:bg-white/5 hover:pl-5'}`}>
                                        <span className={`mr-3 transition-colors ${currentView === item.id ? 'text-[#00ff41]' : 'text-gray-500 group-hover:text-green-400'}`}>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-[#00ff41]/20 text-[10px] text-gray-600 font-mono shrink-0 bg-black/80 backdrop-blur">
                    <div className="flex justify-between mb-1">
                        <span>{lang.status}</span>
                        <span className="text-[#00ff41] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-ping"></span>{lang.online}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{lang.version}</span>
                        <span>2.6.5-PRO</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
