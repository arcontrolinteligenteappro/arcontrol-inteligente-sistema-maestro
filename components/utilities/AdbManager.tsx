
import React, { useState, useEffect, useRef } from 'react';

interface Device {
    id: string;
    model: string;
    ip: string;
    status: 'offline' | 'online' | 'pairing';
    battery?: number;
}

const AdbManager: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [ipInput, setIpInput] = useState('');
    const [portInput, setPortInput] = useState('5555');
    const [pairingCode, setPairingCode] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [isPairing, setIsPairing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 20));

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handlePairAndConnect = () => {
        if (!ipInput || !pairingCode) {
            alert("IP y Código de vinculación requeridos.");
            return;
        }
        setIsPairing(true);
        addLog(`Pairing with code ${pairingCode} at ${ipInput}:${portInput}...`);
        
        setTimeout(() => {
            setIsPairing(false);
            const newDevice: Device = {
                id: `dev-${Math.random().toString(36).substr(2, 5)}`,
                model: "Android 14 (Mobile Client)",
                ip: `${ipInput}:${portInput}`,
                status: 'online',
                battery: Math.floor(Math.random() * 20) + 80
            };
            setDevices(prev => [...prev, newDevice]);
            addLog(`SUCCESS: Device ${newDevice.model} authorized.`);
            addLog(`ADB daemon listening on port 5555.`);
        }, 2000);
    };

    const handleCompile = () => {
        if (devices.length === 0) {
            alert("No hay dispositivos vinculados.");
            return;
        }
        setIsCompiling(true);
        setLogs([]); // Clear logs for new build
        addLog("BUILD START: app-debug.apk");
        
        const sequence = [
            { t: 1000, m: "> Task :app:preBuild UP-TO-DATE" },
            { t: 2000, m: "> Task :app:compileDebugJavaWithJavac (100%)" },
            { t: 3500, m: "> Task :app:assembleDebug SUCCESS" },
            { t: 4500, m: "ADB: Pushing build to /data/local/tmp..." },
            { t: 6000, m: "ADB: Starting activity com.ar.control/.MainActivity" }
        ];

        sequence.forEach(step => {
            setTimeout(() => addLog(step.m), step.t);
        });

        setTimeout(() => {
            setIsCompiling(false);
            addLog("DEPLOYMENT COMPLETED SUCCESSFULLY.");
        }, 7000);
    };

    return (
        <div className="bg-black/50 p-6 rounded-lg text-gray-300">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-green-300">ADB Wireless Debugging</h3>
                    <p className="text-xs text-gray-500">Remote App Compiler & Deployment Center</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#00ff41]"></span>
                    <span className="text-[10px] text-green-500 font-mono font-bold tracking-widest">BRIDGE_ACTIVE</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-700 shadow-inner">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center uppercase tracking-widest">
                            <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            Connection Settings
                        </h4>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Device IP (e.g. 192.168.1.15)" value={ipInput} onChange={e => setIpInput(e.target.value)} className="input-style flex-1" />
                                <input type="text" placeholder="Port" value={portInput} onChange={e => setPortInput(e.target.value)} className="input-style w-20" />
                            </div>
                            <input type="text" placeholder="Wireless Pairing Code" value={pairingCode} onChange={e => setPairingCode(e.target.value)} className="input-style" />
                            <button 
                                onClick={handlePairAndConnect} 
                                disabled={isPairing}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold text-xs transition-all disabled:bg-gray-700 disabled:text-gray-500 shadow-lg shadow-blue-900/20 active:scale-95"
                            >
                                {isPairing ? 'PARING IN PROGRESS...' : 'PAIR DEVICE'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-900/80 p-5 rounded-xl border border-gray-700 min-h-[150px]">
                        <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-tighter">Authorized Endpoints</h4>
                        <div className="space-y-2">
                            {devices.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-gray-800 rounded">
                                    <p className="text-xs text-gray-600">Waiting for connections...</p>
                                </div>
                            ) : (
                                devices.map(dev => (
                                    <div key={dev.id} className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-green-500/20">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-green-900/20 rounded-full flex items-center justify-center text-green-400 mr-3 border border-green-500/20">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white">{dev.model}</p>
                                                <p className="text-[10px] text-blue-400 font-mono">{dev.ip}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-block px-2 py-0.5 rounded bg-green-900/30 text-green-500 text-[8px] font-bold mb-1">ONLINE</span>
                                            <div className="flex items-center gap-1">
                                                <div className="w-6 h-3 bg-gray-700 rounded-sm overflow-hidden">
                                                    <div className="h-full bg-green-500" style={{ width: `${dev.battery}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col h-full">
                    <button 
                        onClick={handleCompile}
                        disabled={isCompiling || devices.length === 0}
                        className={`w-full py-6 rounded-xl font-black text-sm flex items-center justify-center shadow-2xl transition-all mb-4 ${isCompiling ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 active:scale-95 text-white'}`}
                    >
                        {isCompiling ? (
                             <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div> COMPILING PROJECT...</>
                        ) : (
                            <><svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg> BUILD & DEPLOY TO DEVICE</>
                        )}
                    </button>

                    <div className="flex-1 bg-black p-5 rounded-xl border border-gray-800 font-mono text-[11px] flex flex-col min-h-[250px]">
                        <div className="flex justify-between items-center mb-3 text-gray-500 border-b border-gray-900 pb-2">
                            <span className="text-green-500">BUILD_OUTPUT_STREAM</span>
                            <button onClick={() => setLogs([])} className="hover:text-white transition-colors">CLEAR</button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 flex flex-col-reverse">
                            {logs.map((log, i) => (
                                <div key={i} className={`${log.includes('SUCCESS') ? 'text-green-400 font-bold' : log.includes('Task') ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {log}
                                </div>
                            ))}
                            {logs.length === 0 && <div className="text-gray-800 text-center mt-20 italic">No activity detected.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdbManager;
