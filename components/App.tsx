
import React, { useState, useEffect } from 'react';
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
import EngineeringHub from './components/EngineeringHub'; // Módulo Unificado
import DigitalNotebook from './components/DigitalNotebook';
import SecurityAudit from './components/SecurityAudit';
import FileHub from './components/FileHub';
import MeasurementTool from './components/MeasurementTool';
import Memberships from './components/Memberships';
import Manufacture from './components/Manufacture';
import Promotions from './components/Promotions';
import GlobalSearch from './components/GlobalSearch';
import DailyLog from './components/DailyLog'; // New
import Terminal from './components/Terminal'; // New Terminal
import type { View, Reminder } from './types';
import FloatingActionButton from './components/FloatingActionButton';
import CalculatorModal from './components/CalculatorModal';
import QuickNoteModal from './components/QuickNoteModal';
import ReminderModal from './components/ReminderModal';
import ConvertersModal from './components/ConvertersModal';
import { mockReminders } from './data/mockData';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
    const [language, setLanguage] = useState<'es' | 'en'>('es');
    
    // Terminal Integration State
    const [terminalCommand, setTerminalCommand] = useState<string>('');
    
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isConvertersOpen, setIsConvertersOpen] = useState(false);
    const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>(mockReminders);

    // Flashlight State (if needed globally, otherwise handled in FAB)
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

    // Keyboard shortcut for global search (Ctrl/Cmd + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsGlobalSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
        // Here you could potentially use the itemId to scroll to/highlight the specific item
        console.log(`Navigating to ${view} for item ${itemId}`);
    };

    // Handler to open terminal with a specific command
    const handleOpenTerminal = (command: string) => {
        setTerminalCommand(command);
        setCurrentView('terminal');
    };

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard reminders={reminders} onToggleReminder={handleToggleReminderStatus} />;
            case 'inventory':
                return <Inventory />;
            case 'sales':
                return <Sales />;
            case 'manufacture':
                return <Manufacture />;
            case 'customers':
                return <Customers />;
            case 'memberships':
                return <Memberships />;
            case 'promotions':
                return <Promotions />;
            case 'employees':
                return <Employees />;
            case 'settings':
                return <Settings />;
            case 'reports':
                return <Reports />;
            case 'company':
                return <Company />;
            case 'utilities':
                return <Utilities />;
            case 'engineering':
                return <EngineeringHub />;
            case 'notebook':
                return <DigitalNotebook />;
            case 'security':
                return <SecurityAudit />;
            case 'files':
                return <FileHub onTerminalOpen={handleOpenTerminal} />;
            case 'measurement':
                return <MeasurementTool />;
            case 'dailylog':
                return <DailyLog />;
            case 'terminal':
                return <Terminal initialCommand={terminalCommand} />;
            default:
                return <Dashboard reminders={reminders} onToggleReminder={handleToggleReminderStatus} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#050505] text-gray-300 font-sans overflow-hidden">
            <Sidebar 
                currentView={currentView} 
                setCurrentView={setCurrentView} 
                pendingRemindersCount={pendingRemindersCount} 
                onOpenSearch={() => setIsGlobalSearchOpen(true)}
                isMobileOpen={false} // Managed internally by sidebar or new logic if needed
                setIsMobileOpen={() => {}} 
                language={language}
                setLanguage={setLanguage}
            />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth relative">
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
                    isFlashlightOn={isFlashlightOn}
                    isDarkMode={isDarkMode}
                    onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                />
            </div>
            
            <CalculatorModal 
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
            />
            <QuickNoteModal
                isOpen={isQuickNoteOpen}
                onClose={() => setIsQuickNoteOpen(false)}
            />
            <ReminderModal
                isOpen={isReminderOpen}
                onClose={() => setIsReminderOpen(false)}
                onSave={handleSaveReminder}
            />
            <ConvertersModal 
                isOpen={isConvertersOpen}
                onClose={() => setIsConvertersOpen(false)}
            />
            <GlobalSearch 
                isOpen={isGlobalSearchOpen}
                onClose={() => setIsGlobalSearchOpen(false)}
                onNavigate={handleGlobalNavigate}
            />
        </div>
    );
};

export default App;
