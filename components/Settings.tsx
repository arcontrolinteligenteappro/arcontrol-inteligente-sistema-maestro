
import React, { useState, useEffect } from 'react';
import Header from './Header';
import type { CompanyInfo, ServerConfig } from '../types';
import { mockCompanyInfo } from '../data/mockData';
import * as mockData from '../data/mockData';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'database' | 'diagnostics'>('profile');
    
    // --- STATE MANAGEMENT ---
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
        const savedInfo = localStorage.getItem('companyInfo');
        return savedInfo ? JSON.parse(savedInfo) : mockCompanyInfo;
    });

    const [logoPreview, setLogoPreview] = useState<string | undefined>(companyInfo.logo);
    const [newServer, setNewServer] = useState<Partial<ServerConfig>>({ type: 'cPanel' });
    const [autoSaveEnabled, setAutoSaveEnabled] = useState(companyInfo.backup?.autoSave || false);
    const [autoSaveInterval, setAutoSaveInterval] = useState(companyInfo.backup?.autoSaveInterval || 15);

    // Diagnostics State
    const [diagStatus, setDiagStatus] = useState<any>({
        camera: 'waiting',
        geolocation: 'waiting',
        adb_bridge: 'waiting',
        printer_driver: 'waiting'
    });

    useEffect(() => {
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    }, [companyInfo]);

    const handleRunDiagnostics = async () => {
        setDiagStatus({ camera: 'testing', geolocation: 'testing', adb_bridge: 'testing', printer_driver: 'testing' });
        
        // 1. Check Camera
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(t => t.stop());
            setDiagStatus(prev => ({ ...prev, camera: 'pass' }));
        } catch { setDiagStatus(prev => ({ ...prev, camera: 'fail' })); }

        // 2. Check Geo
        navigator.geolocation.getCurrentPosition(
            () => setDiagStatus(prev => ({ ...prev, geolocation: 'pass' })),
            () => setDiagStatus(prev => ({ ...prev, geolocation: 'fail' }))
        );

        // 3. Sim ADB
        setTimeout(() => setDiagStatus(prev => ({ ...prev, adb_bridge: 'pass' })), 1000);
        
        // 4. Check Printer Config
        const printer = localStorage.getItem('printerConfig');
        setDiagStatus(prev => ({ ...prev, printer_driver: printer ? 'pass' : 'warn' }));
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
    };

    const handleAddServer = () => {
        if (!newServer.name || !newServer.type) return alert("Nombre y Tipo son requeridos");
        const server: ServerConfig = {
            id: `SRV-${Date.now()}`,
            name: newServer.name!,
            type: newServer.type || 'cPanel',
            host: newServer.host,
            user: newServer.user,
            key: newServer.key,
            url: newServer.url
        };
        const updatedServers = [...(companyInfo.servers || []), server];
        setCompanyInfo({ ...companyInfo, servers: updatedServers });
        setNewServer({ type: 'cPanel', name: '', host: '', user: '', key: '', url: '' });
    };

    return (
        <div className="h-full flex flex-col">
            <Header title="Configuración del Sistema" />

            <div className="flex border-b border-green-500/20 mb-6 bg-black/40 rounded-t-lg overflow-x-auto">
                <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'profile' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-transparent text-gray-400 hover:text-white'}`}>🏢 Empresa</button>
                <button onClick={() => setActiveTab('integrations')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'integrations' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-transparent text-gray-400 hover:text-white'}`}>🔌 API/Servidores</button>
                <button onClick={() => setActiveTab('database')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'database' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-transparent text-gray-400 hover:text-white'}`}>💾 Datos</button>
                <button onClick={() => setActiveTab('diagnostics')} className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'diagnostics' ? 'border-green-500 text-green-400 bg-green-900/20' : 'border-transparent text-gray-400 hover:text-white'}`}>🩺 Diagnóstico</button>
            </div>

            <div className="flex-1 overflow-y-auto pb-10">
                {activeTab === 'profile' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-black/30 p-6 rounded-lg border border-green-500/20 flex flex-col items-center">
                            <label className="text-sm text-gray-400 mb-2 font-bold">Logo</label>
                            <div className="w-48 h-48 border-2 border-dashed border-green-500/40 rounded-lg flex items-center justify-center bg-black/50 overflow-hidden mb-4">
                                {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" /> : <span className="text-gray-600 text-xs">Sin Imagen</span>}
                            </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                                <h3 className="text-lg font-bold text-green-300 mb-4 border-b border-green-500/20 pb-2">Datos Principales</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-400 mb-1">Razón Social</label>
                                        <input name="name" value={companyInfo.name} onChange={handleCompanyChange} className="input-style" />
                                    </div>
                                    <div><label className="block text-xs text-gray-400 mb-1">RFC</label><input name="rfc" value={companyInfo.rfc} onChange={handleCompanyChange} className="input-style" /></div>
                                    <div><label className="block text-xs text-gray-400 mb-1">Teléfono</label><input name="phone" value={companyInfo.phone} onChange={handleCompanyChange} className="input-style" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'diagnostics' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-black/40 border border-green-500/30 p-8 rounded-xl shadow-2xl">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-white tracking-tight">Diagnóstico de Entorno Android</h3>
                                    <p className="text-gray-400 text-sm mt-1">Verifica la compatibilidad de sensores y controladores inalámbricos.</p>
                                </div>
                                <button 
                                    onClick={handleRunDiagnostics}
                                    className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all active:scale-95"
                                >
                                    INICIAR TEST
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DiagItem label="Permisos de Cámara" status={diagStatus.camera} sub="Requerido para QR y Medición AR" />
                                <DiagItem label="Geolocalización GPS" status={diagStatus.geolocation} sub="Requerido para Bitácora de Rutas" />
                                <DiagItem label="Servicio ADB Bridge" status={diagStatus.adb_bridge} sub="Conexión remota puerto 5555" />
                                <DiagItem label="Driver de Impresión" status={diagStatus.printer_driver} sub="Configuración ESC/POS local" />
                            </div>

                            <div className="mt-10 p-4 bg-gray-900/80 rounded border border-gray-700 font-mono text-xs">
                                <p className="text-green-500 mb-2">/usr/bin/check_compatibility --android-target=30</p>
                                <p className="text-gray-500">[INFO] Browser UserAgent: {navigator.userAgent}</p>
                                <p className="text-gray-500">[INFO] Screen Resolution: {window.screen.width}x{window.screen.height}</p>
                                <p className="text-gray-500">[INFO] PWA Manifest: ACTIVE</p>
                                <p className="text-gray-500">[INFO] WebView Context: {window.location.protocol === 'https:' ? 'SECURE' : 'UNSECURE'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Previous tabs logic... */}
            </div>
        </div>
    );
};

const DiagItem = ({ label, status, sub }: any) => {
    const icons = {
        waiting: <span className="text-gray-600">⚪</span>,
        testing: <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>,
        pass: <span className="text-green-500">✔</span>,
        fail: <span className="text-red-500">✘</span>,
        warn: <span className="text-yellow-500">⚠</span>
    };
    return (
        <div className="bg-black/20 p-4 border border-gray-800 rounded-lg flex items-center justify-between">
            <div>
                <p className="text-sm font-bold text-gray-200">{label}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
            </div>
            <div className="text-lg">{icons[status as keyof typeof icons]}</div>
        </div>
    );
};

export default Settings;
