
import React, { useState } from 'react';
import Header from './Header';
import Modal from './common/Modal';

import ExpenseTracker from './utilities/ExpenseTracker';
import IncomeTracker from './utilities/IncomeTracker';
import WastageTracker from './utilities/WastageTracker';
import BarcodeGenerator from './utilities/BarcodeGenerator';
import Toolbox from './utilities/Toolbox';
import Backup from './utilities/Backup';
import PrinterManager from './utilities/PrinterManager';
import AdbManager from './utilities/AdbManager';
import SystemTester from './utilities/SystemTester';


type UtilityView = 'expenses' | 'income' | 'wastage' | 'barcodes' | 'toolbox' | 'backup' | 'printers' | 'adb' | 'integrity';

const Utilities: React.FC = () => {
    const [activeModal, setActiveModal] = useState<UtilityView | null>(null);

    const utilityCategories: { id: UtilityView; title: string; description: string; icon: React.ReactNode }[] = [
        { id: 'integrity', title: 'Integridad del Sistema', description: 'Pruebas automáticas de todos los módulos.', icon: <ShieldCheckIcon /> },
        { id: 'adb', title: 'ADB Debug & Compiler', description: 'Depuración inalámbrica y despliegue de apps.', icon: <BugIcon /> },
        { id: 'printers', title: 'Configuración de Impresoras', description: 'Conectar Bluetooth, WiFi o USB.', icon: <PrinterIcon /> },
        { id: 'expenses', title: 'Registro de Gastos', description: 'Controla salidas y costos operativos.', icon: <ArrowDownIcon /> },
        { id: 'income', title: 'Registro de Ingresos', description: 'Añade ingresos fuera de ventas.', icon: <ArrowUpIcon /> },
        { id: 'wastage', title: 'Registro de Mermas', description: 'Gestiona productos dañados o perdidos.', icon: <TrashIcon /> },
        { id: 'barcodes', title: 'Códigos de Barras', description: 'Genera e imprime códigos para productos.', icon: <BarcodeIcon /> },
        { id: 'toolbox', title: 'Caja de Herramientas', description: 'Conversores y calculadoras útiles.', icon: <WrenchIcon /> },
        { id: 'backup', title: 'Copia de Seguridad', description: 'Exporta los datos de tu sistema.', icon: <CloudIcon /> },
    ];
    
    const renderModalContent = () => {
        switch (activeModal) {
            case 'integrity': return <SystemTester />;
            case 'adb': return <AdbManager />;
            case 'printers': return <PrinterManager />;
            case 'expenses': return <ExpenseTracker />;
            case 'income': return <IncomeTracker />;
            case 'wastage': return <WastageTracker />;
            case 'barcodes': return <BarcodeGenerator />;
            case 'toolbox': return <Toolbox />;
            case 'backup': return <Backup />;
            default: return null;
        }
    }

    return (
        <div>
            <Header title="Centro de Utilidades" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {utilityCategories.map(cat => (
                    <UtilityCard key={cat.id} {...cat} onClick={() => setActiveModal(cat.id)} />
                ))}
            </div>
            <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={utilityCategories.find(c => c.id === activeModal)?.title || 'Utilidad'}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};


const UtilityCard: React.FC<{ title: string, description: string, icon: React.ReactNode, onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div 
        className="bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg shadow-green-900/10 rounded-lg p-6 flex flex-col justify-between hover:border-green-400 hover:shadow-green-500/20 transition-all duration-300 cursor-pointer group"
        onClick={onClick}
    >
        <div>
            <div className="p-3 bg-green-900/50 text-green-400 rounded-full w-max mb-4 group-hover:bg-green-800/50 transition-colors">{icon}</div>
            <h3 className="text-xl font-bold text-green-300">{title}</h3>
            <p className="text-gray-400 mt-2 text-sm">{description}</p>
        </div>
        <button className="mt-4 text-left font-semibold text-green-400 group-hover:text-green-200 transition-colors">
            Abrir Herramienta &rarr;
        </button>
    </div>
);


// --- Icons ---
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const BugIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
const PrinterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 0 0 2 2h2m2 4h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2zm8-12V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v4h10z" /></svg>;
const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l4 4m0 0l4-4m-4 4V3" /></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3l4 4m0 0l4-4m-4 4v14" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const BarcodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const WrenchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-1.066 2.573c-1.543.94-3.31-.826-2.37-2.37.996.608 2.296.096 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;


export default Utilities;
