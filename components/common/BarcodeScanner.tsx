
import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import { mockProducts } from '../../data/mockData';

interface BarcodeScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onScan: (code: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ isOpen, onClose, onScan }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        if (isOpen) {
            setIsScanning(true);
            setError(null);
            
            // Note: Permissions handled by metadata.json requestFramePermissions
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    setError("No se pudo acceder a la cámara. Verifique permisos o disponibilidad de hardware.");
                    setIsScanning(false);
                });
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isOpen]);

    // Enhanced Simulated Scan Logic for demo
    useEffect(() => {
        if (isScanning && !error) {
            const timer = setTimeout(() => {
                // Pick a random product from mock data to simulate a successful real-world scan
                const productsWithSku = mockProducts.filter(p => p.sku);
                const randomProduct = productsWithSku[Math.floor(Math.random() * productsWithSku.length)];
                if(randomProduct) {
                    onScan(randomProduct.sku);
                    // Flash effect simulation
                    const flash = document.createElement('div');
                    flash.className = 'fixed inset-0 bg-white z-[60] animate-pulse pointer-events-none';
                    document.body.appendChild(flash);
                    setTimeout(() => document.body.removeChild(flash), 150);
                }
            }, 3500); 
            return () => clearTimeout(timer);
        }
    }, [isScanning, error, onScan]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lector Láser / QR Cámara">
            <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-sm aspect-square bg-[#050505] border-2 border-green-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                    {error ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500 text-center p-6 space-y-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            <p className="font-tech text-sm">{error}</p>
                        </div>
                    ) : (
                        <>
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted
                                className="w-full h-full object-cover grayscale brightness-110"
                            />
                            {/* Scanning UI Overlays */}
                            <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none"></div>
                            <div className="absolute inset-[40px] border-2 border-green-500/30 rounded-sm pointer-events-none">
                                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                            </div>
                            
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_red] animate-bounce opacity-70"></div>
                            <div className="absolute bottom-4 left-0 w-full text-center">
                                <span className="inline-block text-[10px] text-green-400 bg-black/80 px-3 py-1 rounded-full uppercase tracking-widest font-mono animate-pulse border border-green-900">
                                    Escaneando Entorno...
                                </span>
                            </div>
                        </>
                    )}
                </div>
                
                <div className="mt-6 w-full max-w-sm">
                    <div className="flex flex-col items-center">
                        <p className="text-gray-500 text-[10px] uppercase tracking-tighter mb-2">Entrada Manual de SKU</p>
                        <div className="flex w-full space-x-2">
                            <input 
                                type="text" 
                                placeholder="ID O SKU PRODUCTO" 
                                className="input-style text-center uppercase flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onScan(e.currentTarget.value);
                                    }
                                }}
                            />
                            <button 
                                onClick={(e) => {
                                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                    if(input.value) onScan(input.value);
                                }}
                                className="px-4 bg-green-600 text-white rounded font-bold hover:bg-green-500"
                            >
                                OK
                            </button>
                        </div>
                        <p className="text-gray-600 text-[9px] mt-4 italic">
                            * El sistema procesa códigos de barras estándar y códigos QR.
                        </p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BarcodeScanner;
