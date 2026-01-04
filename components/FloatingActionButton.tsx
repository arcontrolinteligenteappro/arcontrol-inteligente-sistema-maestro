
import React, { useState } from 'react';

interface FloatingActionButtonProps {
    onCalculatorClick: () => void;
    onNoteClick: () => void;
    onReminderClick: () => void;
    onConverterClick: () => void;
    onFlashlightClick: () => void;
    onTerminalClick?: () => void;
    isFlashlightOn: boolean;
    isDarkMode: boolean;
    onThemeToggle: () => void;
}

const CalculatorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="12" y1="10" x2="12" y2="18"></line><line x1="8" y1="10" x2="8" y2="18"></line></svg>;
const NoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 2H6.5C5.12 2 4 3.12 4 4.5v15C4 20.88 5.12 22 6.5 22h11c1.38 0 2.5-1.12 2.5-2.5V8.5L13.5 2z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const ConvertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>;
const FlashlightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const TerminalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>;

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
    onCalculatorClick, onNoteClick, onReminderClick, onConverterClick, onFlashlightClick, onTerminalClick, isFlashlightOn,
    isDarkMode, onThemeToggle 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const actionButtons = [
        { icon: isDarkMode ? <SunIcon /> : <MoonIcon />, action: onThemeToggle, label: isDarkMode ? 'Modo Claro' : 'Modo Oscuro', active: false },
        { icon: <FlashlightIcon />, action: onFlashlightClick, label: isFlashlightOn ? 'Apagar Luz' : 'Linterna', active: isFlashlightOn },
        { icon: <TerminalIcon />, action: onTerminalClick || (() => {}), label: 'Consola Shell', active: false },
        { icon: <ConvertIcon />, action: onConverterClick, label: 'Convertidores' },
        { icon: <BellIcon />, action: onReminderClick, label: 'Recordatorio' },
        { icon: <NoteIcon />, action: onNoteClick, label: 'Nota Rápida' },
        { icon: <CalculatorIcon />, action: onCalculatorClick, label: 'Calculadora' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-40">
            <div className="relative flex flex-col items-center">
                {isOpen && (
                    <div className="flex flex-col items-center mb-4 space-y-3">
                        {actionButtons.map((btn, index) => (
                             <button
                                key={index}
                                onClick={() => { btn.action(); if(btn.label !== 'Linterna' && btn.label !== 'Apagar Luz' && !btn.label.includes('Modo')) setIsOpen(false); }}
                                className={`group relative w-12 h-12 lg:w-14 lg:h-14 backdrop-blur-md border rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                                    ${btn.active ? 'bg-green-600 border-green-400 text-white shadow-green-500/50' : 'bg-black/80 border-green-500/50 text-green-400 hover:bg-green-900/80 hover:border-green-400'}
                                `}
                                style={{ transitionDelay: `${index * 50}ms`, transform: isOpen ? 'translateY(0)' : 'translateY(10px)', opacity: isOpen ? 1 : 0 }}
                                title={btn.label}
                            >
                                {btn.icon}
                                 <span className="absolute right-full mr-4 px-2 py-1 bg-black/90 text-green-300 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-green-500/30 font-bold tracking-wide">
                                    {btn.label}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.4)] hover:bg-green-500 transition-all duration-300 ${isOpen ? 'rotate-45 bg-green-500 shadow-[0_0_30px_rgba(0,255,65,0.6)]' : 'rotate-0'}`}
                >
                    <PlusIcon />
                </button>
            </div>
        </div>
    );
};

export default FloatingActionButton;
