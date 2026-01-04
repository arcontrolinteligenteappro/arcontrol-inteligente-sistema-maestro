
import React, { useState, useEffect, useRef } from 'react';
import { mockProducts } from '../../data/mockData';
import type { Product } from '../../types';

declare var JsBarcode: any;

const BarcodeGenerator: React.FC = () => {
    const [selectedProductId, setSelectedProductId] = useState<string>(mockProducts[0]?.id || '');
    const barcodeRef = useRef<SVGSVGElement | null>(null);

    const selectedProduct = mockProducts.find(p => p.id === selectedProductId);

    useEffect(() => {
        if (barcodeRef.current && selectedProduct) {
            try {
                JsBarcode(barcodeRef.current, selectedProduct.sku, {
                    format: "CODE128",
                    lineColor: "#00ff00",
                    background: "transparent",
                    displayValue: true,
                    fontOptions: "bold",
                    font: "Fira Code",
                    fontSize: 16,
                    fontColor: "#e5e7eb",
                    margin: 10
                });
            } catch (e) {
                console.error("JsBarcode error:", e);
            }
        }
    }, [selectedProduct]);

    const handlePrint = () => {
        if (!barcodeRef.current) return;
        
        const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
        const printWindow = window.open('', '', 'height=400,width=600');
        printWindow?.document.write(`
            <html>
                <head><title>Imprimir Código de Barras</title></head>
                <body style="text-align:center; margin-top: 50px;">
                    <h3>${selectedProduct?.name || ''}</h3>
                    ${svgData}
                </body>
            </html>
        `);
        printWindow?.document.close();
        printWindow?.focus();
        setTimeout(() => {
            printWindow?.print();
            printWindow?.close();
        }, 250);
    };

    return (
        <div className="bg-black/50 p-6 rounded-lg text-gray-300">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400">Seleccionar Producto</label>
                <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="input-style">
                    {mockProducts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>)}
                </select>
            </div>

            {selectedProduct && (
                <div className="mt-6 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-green-300">{selectedProduct.name}</h3>
                    <div className="p-4 bg-gray-900 border border-green-500/30 rounded-lg mt-2">
                        <svg ref={barcodeRef}></svg>
                    </div>
                    <button onClick={handlePrint} className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                        Imprimir Código
                    </button>
                </div>
            )}
        </div>
    );
};

export default BarcodeGenerator;
