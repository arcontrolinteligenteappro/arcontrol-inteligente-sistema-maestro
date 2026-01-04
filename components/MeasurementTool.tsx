
import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import Modal from './common/Modal';
import type { Measurement, Point } from '../types';

const MeasurementTool: React.FC = () => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [endPoint, setEndPoint] = useState<Point | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState('');
    const [currentUnit, setCurrentUnit] = useState<'m' | 'cm' | 'ft' | 'in'>('m');
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (isCameraOn) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera(); // Cleanup on component unmount
    }, [isCameraOn]);
    
    useEffect(() => {
        if(startPoint && endPoint){
            setIsModalOpen(true);
        }
    }, [startPoint, endPoint]);

    const startCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert("No se pudo acceder a la cámara. Asegúrate de tener una y de haber otorgado los permisos.");
            setIsCameraOn(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };
    
    const handleSetPoint = () => {
        const point = { x: 50, y: 50 }; // Center of the view
        if (!startPoint) {
            setStartPoint(point);
        } else if (!endPoint) {
            setEndPoint(point);
        }
    };

    const handleSaveMeasurement = () => {
        if(!currentValue || parseFloat(currentValue) <= 0) {
            alert("Por favor, introduce un valor de medición válido.");
            return;
        }
        const newMeasurement: Measurement = {
            id: `M${Date.now()}`,
            value: parseFloat(currentValue),
            unit: currentUnit,
        };
        setMeasurements([...measurements, newMeasurement]);
        setIsModalOpen(false);
        setCurrentValue('');
        setStartPoint(null);
        setEndPoint(null);
    };
    
    const clearPoints = () => {
        setStartPoint(null);
        setEndPoint(null);
    };

    const exportMeasurements = () => {
        const content = measurements.map((m, i) => `Medida ${i+1}: ${m.value} ${m.unit}`).join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mediciones.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const MeasurementModal = () => (
        <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); clearPoints(); }} title="Ingresar Medición">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Valor de la Medición (Láser/Cinta)</label>
                    <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} className="input-style" autoFocus />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400">Unidad</label>
                    <select value={currentUnit} onChange={e => setCurrentUnit(e.target.value as any)} className="input-style">
                        <option value="m">Metros (m)</option>
                        <option value="cm">Centímetros (cm)</option>
                        <option value="ft">Pies (ft)</option>
                        <option value="in">Pulgadas (in)</option>
                    </select>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSaveMeasurement} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                        Guardar Medición
                    </button>
                </div>
            </div>
        </Modal>
    );

    return (
        <div>
            <Header title="Medición Asistida por Cámara" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Camera View */}
                <div className="lg:col-span-2 bg-black/50 border border-green-500/30 rounded-lg p-4 relative aspect-video flex items-center justify-center">
                    {isCameraOn ? (
                        <div className="relative w-full h-full">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-md" />
                            {/* Overlays */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-1 h-8 bg-green-400 opacity-70"></div>
                                <div className="w-8 h-1 bg-green-400 opacity-70 absolute"></div>
                            </div>
                            {startPoint && <div className="absolute w-4 h-4 bg-cyan-400 rounded-full border-2 border-white" style={{ left: 'calc(50% - 8px)', top: 'calc(50% - 8px)' }}></div>}
                            {endPoint && <div className="absolute w-4 h-4 bg-pink-400 rounded-full border-2 border-white" style={{ left: 'calc(50% - 8px)', top: 'calc(50% - 8px)' }}></div>}
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-400 mb-4">La cámara está desactivada.</p>
                            <button onClick={() => setIsCameraOn(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                                Activar Cámara
                            </button>
                        </div>
                    )}
                </div>
                {/* Controls and History */}
                <div className="bg-black/50 border border-green-500/30 rounded-lg p-4">
                     <h3 className="text-lg font-bold text-green-300 mb-4">Controles</h3>
                     <div className="space-y-3 mb-4">
                        <button onClick={() => setIsCameraOn(c => !c)} className={`w-full py-2 rounded-lg ${isCameraOn ? 'bg-red-700' : 'bg-green-700'} text-white`}>{isCameraOn ? 'Apagar Cámara' : 'Encender Cámara'}</button>
                        <button onClick={handleSetPoint} disabled={!isCameraOn || (!!startPoint && !!endPoint)} className="w-full py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-600">
                            {!startPoint ? 'Fijar Punto de Inicio' : 'Fijar Punto Final'}
                        </button>
                        <button onClick={clearPoints} disabled={!startPoint} className="w-full py-2 rounded-lg bg-gray-700 text-white disabled:bg-gray-800">Limpiar Puntos</button>
                    </div>
                    <div className="border-t border-green-500/20 pt-4">
                         <h3 className="text-lg font-bold text-green-300 mb-2">Historial</h3>
                         <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                             {measurements.map((m, i) => (
                                <div key={m.id} className="flex justify-between items-center p-2 bg-green-900/40 rounded-md">
                                    <span className="text-gray-300">Medida #{i + 1}</span>
                                    <span className="font-mono font-bold text-green-300">{m.value} {m.unit}</span>
                                </div>
                             ))}
                             {measurements.length === 0 && <p className="text-sm text-gray-500 text-center">No hay mediciones.</p>}
                         </div>
                         <div className="mt-4 flex space-x-2">
                             <button onClick={exportMeasurements} disabled={measurements.length === 0} className="flex-1 py-2 rounded-lg bg-purple-600 text-white disabled:bg-gray-600">Exportar</button>
                             <button onClick={() => setMeasurements([])} disabled={measurements.length === 0} className="flex-1 py-2 rounded-lg bg-red-800 text-white disabled:bg-gray-800">Limpiar Historial</button>
                         </div>
                    </div>
                </div>
            </div>
            <MeasurementModal />
        </div>
    );
};

export default MeasurementTool;
