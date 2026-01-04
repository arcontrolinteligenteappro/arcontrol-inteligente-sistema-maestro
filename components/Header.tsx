
import React, { useState, useEffect } from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const [displayText, setDisplayText] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        setDisplayText('');
        let i = 0;
        // Effect type text
        const typeEffect = setInterval(() => {
            if (i < title.length) {
                setDisplayText(prev => prev + title.charAt(i));
                i++;
            } else {
                clearInterval(typeEffect);
            }
        }, 30); // Faster typing

        // Clock
        const clockInterval = setInterval(() => {
            const now = new Date();
            setTime(now.toLocaleTimeString('es-MX', { hour12: false }));
        }, 1000);

        return () => {
            clearInterval(typeEffect);
            clearInterval(clockInterval);
        };
    }, [title]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 border-b border-green-900/30 pb-2">
            <div>
                <div className="text-[10px] text-green-600 font-mono mb-1 tracking-widest">
                    UBICACIÓN: /ROOT/SISTEMA/{title.toUpperCase().replace(/\s/g, '_')}
                </div>
                <h2 className="text-3xl font-bold text-white font-tech uppercase tracking-wide flex items-center">
                    <span className="text-green-500 mr-2">➜</span>
                    {displayText}
                    <span className="animate-pulse ml-1 w-3 h-6 bg-green-500 block"></span>
                </h2>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-xs font-mono text-gray-500 mt-4 md:mt-0">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-green-700">RED</span>
                    <span className="text-green-400">SEGURA (TLS 1.3)</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-green-700">HORA SISTEMA</span>
                    <span className="text-gray-300">{time}</span>
                </div>
                <div className="h-8 w-8 border border-green-500/30 rounded-full flex items-center justify-center bg-black">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
            </div>
        </div>
    );
};

export default Header;
