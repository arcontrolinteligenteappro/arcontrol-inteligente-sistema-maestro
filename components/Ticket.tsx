
import React, { useState, useEffect } from 'react';
import type { Sale, CompanyInfo } from '../types';
import Modal from './common/Modal';

interface TicketProps {
    isOpen: boolean;
    onClose: () => void;
    sale: Sale | null;
    companyInfo: CompanyInfo;
}

const Ticket: React.FC<TicketProps> = ({ isOpen, onClose, sale, companyInfo }) => {
    const [printerConfig, setPrinterConfig] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem('printerConfig');
        if (saved) {
            setPrinterConfig(JSON.parse(saved));
        }
    }, [isOpen]);

    if (!sale) return null;

    const formatCurrency = (value: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);

    // Function to format plain text for thermal printers (ESC/POS simulation)
    const generateThermalText = () => {
        const line = "-".repeat(32); // Assuming 58mm/80mm avg chars
        let text = "";
        
        // Header
        text += `${companyInfo.name.toUpperCase()}\n`;
        text += `${companyInfo.phone}\n`;
        text += `${line}\n`;
        text += `TICKET: #${sale.id}\n`;
        text += `FECHA: ${sale.date}\n`;
        text += `CLIENTE: ${sale.customerName.substring(0, 20)}\n`;
        text += `${line}\n`;
        
        // Items
        text += `CANT  DESCRIPCION       TOTAL\n`;
        sale.products.forEach(p => {
            const name = p.name.substring(0, 16).padEnd(16, ' ');
            const qty = p.quantity.toString().padEnd(4, ' ');
            const total = (p.price * p.quantity).toFixed(2).padStart(8, ' ');
            text += `${qty}  ${name}  ${total}\n`;
        });
        
        text += `${line}\n`;
        text += `TOTAL: ${formatCurrency(sale.total)}\n`;
        text += `${line}\n`;
        text += `\n${companyInfo.slogan}\n\n\n`;
        
        return text;
    };

    const handlePrint = () => {
        if (printerConfig?.type === 'bluetooth_app') {
            // Mobile Android Thermal Print (RawBT)
            const textData = generateThermalText();
            const base64Data = btoa(textData);
            // Intent URL to open RawBT and print immediately
            window.location.href = `rawbt:base64,${base64Data}`;
        } else {
            // Standard Browser Print
            const printableContent = document.querySelector('.printable-ticket');
            if (printableContent) {
                const printWindow = window.open('', '', 'height=800,width=600');
                printWindow?.document.write('<html><head><title>Imprimir</title>');
                printWindow?.document.write('<script src="https://cdn.tailwindcss.com"></script>');
                printWindow?.document.write('<style>body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; } @media print { .no-print { display: none !important; } @page { margin: 0; size: auto; } }</style>');
                printWindow?.document.write('</head><body>');
                printWindow?.document.write(printableContent.innerHTML);
                printWindow?.document.write('</body></html>');
                printWindow?.document.close();
                printWindow?.focus();
                setTimeout(() => { 
                    printWindow?.print();
                    printWindow?.close();
                }, 250);
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`${sale.type} - #${sale.id}`}>
            <div className="printable-ticket bg-white text-gray-800 p-4 max-w-[80mm] mx-auto shadow-md">
                {/* Header */}
                <header className="flex flex-col items-center pb-4 border-b border-dashed border-gray-400 text-center">
                    {companyInfo.logo && <img src={companyInfo.logo} alt="Logo" className="h-12 w-12 object-contain mb-2 grayscale" />}
                    <div>
                        <h1 className="font-bold text-lg leading-tight">{companyInfo.name}</h1>
                        <p className="text-xs">{companyInfo.phone}</p>
                        <p className="text-xs">{companyInfo.address}</p>
                    </div>
                    <div className="mt-2 w-full text-left">
                        <p className="text-xs font-bold">Folio: {sale.id}</p>
                        <p className="text-xs">Fecha: {sale.date}</p>
                        <p className="text-xs">Cliente: {sale.customerName}</p>
                    </div>
                </header>

                {/* Products Table */}
                <section className="mt-2">
                    <table className="w-full text-xs">
                        <thead className="border-b border-gray-400">
                            <tr>
                                <th className="py-1 text-left">Cant</th>
                                <th className="py-1 text-left">Desc</th>
                                <th className="py-1 text-right">Importe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.products.map(p => (
                                <tr key={p.productId}>
                                    <td className="py-1 align-top">{p.quantity}</td>
                                    <td className="py-1 pr-1">{p.name}</td>
                                    <td className="py-1 text-right align-top">{formatCurrency(p.price * p.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t border-gray-400 border-dashed">
                            <tr>
                                <td colSpan={2} className="pt-2 text-right font-bold text-sm">TOTAL:</td>
                                <td className="pt-2 text-right font-bold text-sm">{formatCurrency(sale.total)}</td>
                            </tr>
                            {sale.amountPaid < sale.total && (
                                <>
                                    <tr>
                                        <td colSpan={2} className="text-right text-xs">Pagado:</td>
                                        <td className="text-right text-xs">{formatCurrency(sale.amountPaid)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className="text-right text-xs">Resta:</td>
                                        <td className="text-right text-xs">{formatCurrency(sale.total - sale.amountPaid)}</td>
                                    </tr>
                                </>
                            )}
                        </tfoot>
                    </table>
                </section>

                {/* Notes */}
                {sale.notes && (
                    <section className="mt-4 p-1 border border-gray-200 rounded">
                        <p className="text-[10px] italic">{sale.notes}</p>
                    </section>
                )}

                {/* Footer */}
                <footer className="mt-4 pt-2 border-t border-gray-400 text-center text-[10px]">
                    <p className="font-bold">{companyInfo.slogan}</p>
                    <p className="mt-1">¡Gracias por su preferencia!</p>
                </footer>
            </div>
             <div className="mt-6 flex justify-end space-x-3 no-print">
                <button onClick={handlePrint} className={`px-4 py-2 text-white rounded-lg flex items-center shadow-lg transition-transform active:scale-95 ${printerConfig?.type === 'bluetooth_app' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                    {printerConfig?.type === 'bluetooth_app' ? 'Imprimir (App)' : 'Imprimir (Sistema)'}
                </button>
            </div>
        </Modal>
    );
};

export default Ticket;
