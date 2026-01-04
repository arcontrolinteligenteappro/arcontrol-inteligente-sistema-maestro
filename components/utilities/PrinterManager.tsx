
import React, { useState, useEffect } from 'react';

// Configuration Interface
interface PrinterConfig {
    type: 'system' | 'network' | 'bluetooth_app'; // bluetooth_app uses Intents (RawBT, PrinterShare)
    name: string;
    ip?: string; // For Network
    port?: string; // For Network (default 9100)
    paperWidth: '58mm' | '80mm';
    driverAppPackage?: string; // e.g., 'ru.a402d.rawbtprinter'
}

const PrinterManager: React.FC = () => {
    const [config, setConfig] = useState<PrinterConfig>(() => {
        const saved = localStorage.getItem('printerConfig');
        return saved ? JSON.parse(saved) : { 
            type: 'system', 
            name: 'Impresora Predeterminada', 
            paperWidth: '80mm' 
        };
    });

    const [testResult, setTestResult] = useState('');

    useEffect(() => {
        localStorage.setItem('printerConfig', JSON.stringify(config));
    }, [config]);

    const handleTypeChange = (type: PrinterConfig['type']) => {
        let defaultName = 'Impresora';
        if(type === 'system') defaultName = 'Android Print Service';
        if(type === 'bluetooth_app') defaultName = 'RawBT Driver (Bluetooth/USB)';
        if(type === 'network') defaultName = 'Impresora de Red WiFi';
        
        setConfig({ ...config, type, name: defaultName });
    };

    const handleTestPrint = () => {
        const testContent = `
TEST IMPRESION
--------------------------------
AR CONTROL SYSTEM
Fecha: ${new Date().toLocaleDateString()}
Hora: ${new Date().toLocaleTimeString()}
--------------------------------
Conexion: ${config.type}
Ancho: ${config.paperWidth}
--------------------------------
Prueba Exitosa!
        `;

        if (config.type === 'system') {
            // Use native browser print (which calls Android Print Spooler)
            const printWindow = window.open('', '', 'height=600,width=400');
            printWindow?.document.write(`
                <html><body style="font-family: monospace; font-size: 12px;">
                <pre>${testContent}</pre>
                </body></html>
            `);
            printWindow?.document.close();
            setTimeout(() => {
                printWindow?.print();
                printWindow?.close();
            }, 500);
            setTestResult('Enviado al servicio de impresión de Android.');
        } 
        else if (config.type === 'bluetooth_app') {
            // Android Intent Scheme for RawBT (Industry Standard for Web-to-Bluetooth Print)
            // Format: rawbt:base64,data
            const base64Data = btoa(testContent);
            const intentUrl = `rawbt:base64,${base64Data}`;
            
            // Try to open the app
            window.location.href = intentUrl;
            setTestResult('Intento de abrir App de Driver (RawBT)...');
        }
        else if (config.type === 'network') {
            // Simulation of Network Print (Requires Backend usually, but here we simulate success)
            if(!config.ip) { alert("Ingrese IP"); return; }
            setTestResult(`Conectando a ${config.ip}:9100... [Simulado: OK]`);
        }
    };

    return (
        <div className="bg-black/50 p-6 rounded-lg text-gray-300">
            <h3 className="text-xl font-semibold text-green-300 mb-2">Configuración de Impresión (Android)</h3>
            <p className="text-sm text-gray-400 mb-6">
                Selecciona cómo se conecta tu dispositivo móvil a la impresora.
            </p>

            <div className="space-y-6">
                
                {/* Connection Selector */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Método de Conexión</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => handleTypeChange('system')}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${config.type === 'system' ? 'border-green-500 bg-green-900/20 text-green-300' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
                            <span className="font-bold text-sm">Servicio Android</span>
                            <span className="text-[10px] mt-1 text-center">WiFi / Cloud Print / PDF</span>
                        </button>

                        <button 
                            onClick={() => handleTypeChange('bluetooth_app')}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${config.type === 'bluetooth_app' ? 'border-blue-500 bg-blue-900/20 text-blue-300' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>
                            <span className="font-bold text-sm">Bluetooth / USB</span>
                            <span className="text-[10px] mt-1 text-center">Vía App (RawBT) - Térmica</span>
                        </button>

                        <button 
                            onClick={() => handleTypeChange('network')}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all ${config.type === 'network' ? 'border-purple-500 bg-purple-900/20 text-purple-300' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/><rect x="10" y="20" width="4" height="4"/></svg>
                            <span className="font-bold text-sm">Red LAN / WiFi</span>
                            <span className="text-[10px] mt-1 text-center">Directo a IP (ESC/POS)</span>
                        </button>
                    </div>
                </div>

                {/* Configuration Fields */}
                <div className="bg-gray-900 p-4 rounded border border-gray-700 space-y-4">
                    <h4 className="text-sm font-bold text-white border-b border-gray-700 pb-2">Parámetros</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Nombre Identificador</label>
                            <input 
                                type="text" 
                                value={config.name} 
                                onChange={e => setConfig({...config, name: e.target.value})} 
                                className="input-style" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Ancho de Papel</label>
                            <select 
                                value={config.paperWidth} 
                                onChange={e => setConfig({...config, paperWidth: e.target.value as any})} 
                                className="input-style"
                            >
                                <option value="58mm">58mm (Ticket Pequeño)</option>
                                <option value="80mm">80mm (Estándar)</option>
                            </select>
                        </div>
                    </div>

                    {config.type === 'network' && (
                        <div className="grid grid-cols-2 gap-4 animate-fade-in">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Dirección IP</label>
                                <input 
                                    type="text" 
                                    value={config.ip || ''} 
                                    onChange={e => setConfig({...config, ip: e.target.value})} 
                                    className="input-style" 
                                    placeholder="192.168.1.200"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Puerto</label>
                                <input 
                                    type="text" 
                                    value={config.port || '9100'} 
                                    onChange={e => setConfig({...config, port: e.target.value})} 
                                    className="input-style" 
                                    placeholder="9100"
                                />
                            </div>
                        </div>
                    )}

                    {config.type === 'bluetooth_app' && (
                        <div className="bg-blue-900/20 p-3 rounded text-xs text-blue-200 border border-blue-500/30">
                            <strong>Instrucciones Bluetooth/USB:</strong>
                            <ol className="list-decimal pl-4 mt-1 space-y-1">
                                <li>Instala la App <strong>"RawBT"</strong> desde Google Play en tu Android.</li>
                                <li>Empareja tu impresora Bluetooth o conecta el USB OTG.</li>
                                <li>Configura RawBT para que sea tu servicio de impresión predeterminado.</li>
                                <li>Al pulsar "Imprimir", esta web enviará los datos a la App.</li>
                            </ol>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <span className="text-xs text-yellow-400">{testResult}</span>
                    <button 
                        onClick={handleTestPrint}
                        className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-500 shadow-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Probar Impresión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrinterManager;
