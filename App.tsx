
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Employees from './components/Employees';
import Settings from './components/Settings';
import Reports from './components/Reports';
import Company from './components/Company';
import Utilities from './components/Utilities';
import EngineeringHub from './components/EngineeringHub';
import DigitalNotebook from './components/DigitalNotebook';
import SecurityAudit from './components/SecurityAudit';
import FileHub from './components/FileHub';
import MeasurementTool from './components/MeasurementTool';
import Memberships from './components/Memberships';
import Manufacture from './components/Manufacture';
import Promotions from './components/Promotions';
import GlobalSearch from './components/GlobalSearch';
import DailyLog from './components/DailyLog';
import Terminal from './components/Terminal';
import type { View, Reminder } from './types';
import FloatingActionButton from './components/FloatingActionButton';
import CalculatorModal from './components/CalculatorModal';
import QuickNoteModal from './components/QuickNoteModal';
import ReminderModal from './components/ReminderModal';
import ConvertersModal from './components/ConvertersModal';
import { mockReminders } from './data/mockData';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [language, setLanguage] = useState<'es' | 'en'>('es');
    const [terminalCommand, setTerminalCommand] = useState<string>('');
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isConvertersOpen, setIsConvertersOpen] = useState(false);
    const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFlashlightOn, setIsFlashlightOn] = useState(false);

    const pendingRemindersCount = reminders.filter(r => r.status === 'Pendiente').length;

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const handleSaveReminder = (reminder: Omit<Reminder, 'id' | 'status'>) => {
        const newReminder: Reminder = {
            ...reminder,
            id: `REM${Date.now()}`,
            status: 'Pendiente',
        };
        setReminders([newReminder, ...reminders]);
        setIsReminderOpen(false);
    };

    const handleToggleReminderStatus = (id: string) => {
        setReminders(reminders.map(r => 
            r.id === id ? { ...r, status: r.status === 'Pendiente' ? 'Completado' : 'Pendiente' } : r
        ));
    };

    const handleGlobalNavigate = (view: View, itemId?: string) => {
        setCurrentView(view);
        setIsMobileMenuOpen(false);
        setIsGlobalSearchOpen(false);
    };

    const handleOpenTerminal = (command: string) => {
        setTerminalCommand(command);
        setCurrentView('terminal');
        setIsMobileMenuOpen(false);
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard reminders={reminders} onToggleReminder={handleToggleReminderStatus} />;
            case 'inventory': return <Inventory />;
            case 'sales': return <Sales />;
            case 'manufacture': return <Manufacture />;
            case 'customers': return <Customers />;
            case 'memberships': return <Memberships />;
            case 'promotions': return <Promotions />;
            case 'employees': return <Employees />;
            case 'settings': return <Settings />;
            case 'reports': return <Reports />;
            case 'company': return <Company />;
            case 'utilities': return <Utilities />;
            case 'engineering': return <EngineeringHub />;
            case 'notebook': return <DigitalNotebook />;
            case 'security': return <SecurityAudit />;
            case 'files': return <FileHub onTerminalOpen={handleOpenTerminal} />;
            case 'measurement': return <MeasurementTool />;
            case 'dailylog': return <DailyLog />;
            case 'terminal': return <Terminal initialCommand={terminalCommand} />;
            default: return <Dashboard reminders={reminders} onToggleReminder={handleToggleReminderStatus} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#050505] text-gray-300 font-sans overflow-hidden">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                pendingRemindersCount={pendingRemindersCount} 
                onOpenSearch={() => setIsGlobalSearchOpen(true)}
                isMobileOpen={isMobileMenuOpen}
                setIsMobileOpen={setIsMobileMenuOpen}
                language={language}
                setLanguage={setLanguage}
            />
            
            <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
                {/* Mobile Header Trigger */}
                <div className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-green-900/30 bg-[#080808] shrink-0 z-30">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-300 active:bg-gray-800 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                    </button>
                    <span className="font-bold text-lg text-green-500 tracking-wider font-tech uppercase">AR CONTROL</span>
                    <button onClick={() => setIsGlobalSearchOpen(true)} className="p-2 text-gray-300 active:bg-gray-800 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                </div>

                <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth relative custom-scrollbar">
                    <div className="container mx-auto px-4 lg:px-8 py-6 max-w-[1600px] h-full">
                        <div key={currentView} className="view-enter h-full">
                            {renderView()}
                        </div>
                    </div>
                </main>

                <FloatingActionButton 
                    onCalculatorClick={() => setIsCalculatorOpen(true)}
                    onNoteClick={() => setIsQuickNoteOpen(true)}
                    onReminderClick={() => setIsReminderOpen(true)}
                    onConverterClick={() => setIsConvertersOpen(true)}
                    onFlashlightClick={() => setIsFlashlightOn(!isFlashlightOn)}
                    onTerminalClick={() => setCurrentView('terminal')}
                    isFlashlightOn={isFlashlightOn}
                    isDarkMode={isDarkMode}
                    onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                />
            </div>
            
            <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} />
            <QuickNoteModal isOpen={isQuickNoteOpen} onClose={() => setIsQuickNoteOpen(false)} />
            <ReminderModal isOpen={isReminderOpen} onClose={() => setIsReminderOpen(false)} onSave={handleSaveReminder} />
            <ConvertersModal isOpen={isConvertersOpen} onClose={() => setIsConvertersOpen(false)} />
            <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} onNavigate={handleGlobalNavigate} />
        </div>
    );
};

export default App;
