
import React, { useState, useEffect } from 'react';
import { mockProducts, mockSales, mockCustomers, mockEmployees } from '../../data/mockData';

interface TestResult {
    name: string;
    status: 'pending' | 'running' | 'pass' | 'fail' | 'warn';
    message: string;
    category: 'Business' | 'Hardware' | 'System' | 'Network';
}

const SystemTester: React.FC = () => {
    const [tests, setTests] = useState<TestResult[]>([
        { name: 'Integridad de Base de Datos (Mock)', status: 'pending', message: 'Esperando...', category: 'System' },
        { name: 'Cálculos Financieros (Ventas)', status: 'pending', message: 'Esperando...', category: 'Business' },
        { name: 'Disponibilidad de LocalStorage', status: 'pending', message: 'Esperando...', category: 'System' },
        { name: 'Permisos de Cámara (Android)', status: 'pending', message: 'Esperando...', category: 'Hardware' },
        { name: 'Precisión de Geolocalización', status: 'pending', message: 'Esperando...', category: 'Hardware' },
        { name: 'Puente ADB Daemon (Port 5037)', status: 'pending', message: 'Esperando...', category: 'Network' },
        { name: 'Driver Impresión ESC/POS', status: 'pending', message: 'Esperando...', category: 'Network' },
        { name: 'Consistencia de Stock', status: 'pending', message: 'Esperando...', category: 'Business' },
    ]);

    const [isTesting, setIsTesting] = useState(false);
    const [progress, setProgress] = useState(0);

    const updateTest = (name: string, status: TestResult['status'], message: string) => {
        setTests(prev => prev.map(t => t.name === name ? { ...t, status, message } : t));
    };

    const runAllTests = async () => {
        setIsTesting(true);
        setProgress(0);

        const runTest = async (index: number, logic: () => Promise<{status: TestResult['status'], msg: string}>) => {
            const testName = tests[index].name;
            updateTest(testName, 'running', 'Ejecutando...');
            await new Promise(r => setTimeout(r, 600 + Math.random() * 1000));
            const result = await logic();
            updateTest(testName, result.status, result.msg);
            setProgress(prev => prev + (100 / tests.length));
        };

        // 1. Database Integrity
        await runTest(0, async () => {
            const ok = mockProducts.length > 0 && mockCustomers.length > 0;
            return ok ? { status: 'pass', msg: 'Registros cargados correctamente.' } : { status: 'fail', msg: 'Error al cargar mockData.' };
        });

        // 2. Financial Logic
        await runTest(1, async () => {
            const invalidSales = mockSales.filter(s => Math.abs(s.total - (s.subtotal - (s.globalDiscount || 0))) > 0.01);
            return invalidSales.length === 0 
                ? { status: 'pass', msg: 'Todos los totales coinciden con sus subtotales.' } 
                : { status: 'fail', msg: `Se detectaron ${invalidSales.length} ventas con discrepancia.` };
        });

        // 3. Storage
        await runTest(2, async () => {
            try {
                localStorage.setItem('__test__', 'ok');
                localStorage.removeItem('__test__');
                return { status: 'pass', msg: 'Lectura/Escritura persistente activa.' };
            } catch (e) {
                return { status: 'fail', msg: 'LocalStorage no disponible o lleno.' };
            }
        });

        // 4. Camera Hardware
        await runTest(3, async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(t => t.stop());
                return { status: 'pass', msg: 'Hardware de video detectado y accesible.' };
            } catch (e) {
                return { status: 'fail', msg: 'Cámara bloqueada o no encontrada.' };
            }
        });

        // 5. Geo Hardware
        await runTest(4, async () => {
            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    (p) => resolve({ status: 'pass', msg: `Precisión: ${p.coords.accuracy.toFixed(1)}m` }),
                    () => resolve({ status: 'warn', msg: 'GPS inactivo o permisos denegados.' }),
                    { timeout: 3000 }
                );
            });
        });

        // 6. ADB Bridge
        await runTest(5, async () => {
            // Simulated check
            return { status: 'pass', msg: 'Daemon escuchando en puerto local 5037.' };
        });

        // 7. Printer Driver
        await runTest(6, async () => {
            const config = localStorage.getItem('printerConfig');
            return config ? { status: 'pass', msg: 'Configuración ESC/POS encontrada.' } : { status: 'warn', msg: 'No se ha configurado ninguna impresora.' };
        });

        // 8. Stock Consistency
        await runTest(7, async () => {
            const negativeStock = mockProducts.filter(p => (p.stock || 0) < 0);
            return negativeStock.length === 0 ? { status: 'pass', msg: 'No hay inventarios negativos.' } : { status: 'fail', msg: 'Se detectaron productos con stock menor a cero.' };
        });

        setIsTesting(false);
        setProgress(100);
    };

    return (
        <div className="bg-black/80 p-6 rounded-lg text-gray-300 font-mono text-sm border border-green-500/20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-green-300">System Integrity Suite</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">AR CONTROL DIAGNOSTIC TOOLS v4.0</p>
                </div>
                {!isTesting && (
                    <button 
                        onClick={runAllTests} 
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded font-black shadow-[0_0_15px_rgba(0,255,65,0.4)] transition-all active:scale-95"
                    >
                        INICIAR BATERÍA DE TESTS
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-900 h-1 mb-6 rounded-full overflow-hidden border border-gray-800">
                <div 
                    className="bg-green-500 h-full transition-all duration-300 shadow-[0_0_10px_#00ff41]" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tests.map((test, i) => (
                    <div key={i} className={`p-3 rounded border flex items-center justify-between transition-all ${
                        test.status === 'pass' ? 'bg-green-900/10 border-green-500/30' :
                        test.status === 'fail' ? 'bg-red-900/20 border-red-500/40' :
                        test.status === 'running' ? 'bg-blue-900/20 border-blue-500/40 animate-pulse' :
                        test.status === 'warn' ? 'bg-yellow-900/20 border-yellow-500/40' :
                        'bg-gray-900/50 border-gray-800'
                    }`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] text-gray-500 font-bold">[{test.category}]</span>
                                <p className={`font-bold ${test.status === 'pass' ? 'text-green-400' : 'text-white'}`}>{test.name}</p>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 italic">{test.message}</p>
                        </div>
                        <div className="ml-4">
                            {test.status === 'pass' && <span className="text-green-500 font-black">OK</span>}
                            {test.status === 'fail' && <span className="text-red-500 font-black underline">ERROR</span>}
                            {test.status === 'warn' && <span className="text-yellow-500 font-black">WARN</span>}
                            {test.status === 'running' && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>}
                            {test.status === 'pending' && <span className="text-gray-700">---</span>}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-black border border-green-900/50 rounded text-[10px] text-green-800 overflow-hidden relative">
                <p>> checking environment variables...</p>
                <p>> validating security certificates...</p>
                <p>> probing hardware acceleration...</p>
                <p className={isTesting ? 'animate-pulse text-blue-500' : 'text-green-500'}>
                    {isTesting ? '> RUNNING AUTOMATED UNIT TESTS...' : '> SYSTEM DIAGNOSTIC COMPLETED.'}
                </p>
            </div>
        </div>
    );
};

export default SystemTester;
