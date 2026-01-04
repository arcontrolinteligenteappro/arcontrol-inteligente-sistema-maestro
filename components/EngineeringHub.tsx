
import React, { useState } from 'react';
import Header from './Header';
import CanvasEditor from './canvas/CanvasEditor';
import type { DiagramElement, Material } from '../types';
import Modal from './common/Modal';
import { mockCustomers } from '../data/mockData';

// --- Icons ---
const BlueprintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const NetworkMapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>;
const UmlIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

const EngineeringHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'construction' | 'network' | 'software'>('construction');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveData, setSaveData] = useState({ planName: '', customerId: '' });

    // --- Toolbox Items by Category ---
    const constructionToolbox = [
        { type: 'wall_std', label: 'Muro', icon: '🧱' },
        { type: 'door_single', label: 'Puerta', icon: '🚪' },
        { type: 'window_std', label: 'Ventana', icon: '🪟' },
        { type: 'sofa', label: 'Sofá', icon: '🛋️' },
        { type: 'table', label: 'Mesa', icon: '🍱' },
        { type: 'chair', label: 'Silla', icon: '🪑' },
        { type: 'bed', label: 'Cama', icon: '🛏️' },
        { type: 'toilet', label: 'WC', icon: '🚽' },
        { type: 'conduit', label: 'Ducto', icon: '〰️' },
        { type: 'power_out', label: 'Enchufe', icon: '🔌' },
    ];

    const networkToolbox = [
        { type: 'router', label: 'Router', icon: '🌐' },
        { type: 'switch', label: 'Switch', icon: '🏢' },
        { type: 'server', label: 'Servidor', icon: '🖥️' },
        { type: 'camera_ip', label: 'CCTV IP', icon: '📹' },
        { type: 'access_control', label: 'Acceso', icon: '🛡️' },
        { type: 'iot_sensor', label: 'Sensor', icon: '📡' },
        { type: 'mobile', label: 'Mobile', icon: '📱' },
        { type: 'cloud', label: 'Nube', icon: '☁️' },
    ];

    const softwareToolbox = [
        { type: 'class', label: 'Clase', icon: '📦' },
        { type: 'actor', label: 'Actor', icon: '👤' },
        { type: 'database', label: 'DB', icon: '🗄️' },
        { type: 'note', label: 'Nota', icon: '📝' },
    ];

    // --- Property Renders ---
    const renderConstructionProperties = (element: DiagramElement, updateElement: (id: string, data: any) => void) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };

        const handleAddMaterial = () => {
            const matName = prompt("Nombre del material:");
            if(!matName) return;
            const updatedMaterials = [...(element.data.materials || []), { id: `mat-${Date.now()}`, name: matName, quantity: 1, unit: 'pza', type: 'Material' }];
            updateElement(element.id, { ...element.data, materials: updatedMaterials });
        };

        return (
            <div className="space-y-4">
                <div className="pb-4 border-b border-green-500/20">
                    <h4 className="font-semibold text-green-300 mb-2">Propiedades</h4>
                    <div className="mb-2">
                        <label className="block text-xs text-gray-400">Etiqueta</label>
                        <input type="text" name="name" value={element.data.name || ''} onChange={handleChange} className="input-style" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-400">Alto (m)</label>
                            <input type="number" name="height" value={element.data.height || ''} onChange={handleChange} className="input-style" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400">Ancho (m)</label>
                            <input type="number" name="width" value={element.data.width || ''} onChange={handleChange} className="input-style" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-green-300 mb-2">Materiales</h4>
                    <div className="space-y-1 mb-2">
                        {(element.data.materials || []).map((m: any) => (
                            <div key={m.id} className="text-xs bg-gray-800 p-2 rounded flex justify-between">
                                <span>{m.name} x{m.quantity}</span>
                                <button className="text-red-400" onClick={() => updateElement(element.id, { ...element.data, materials: element.data.materials.filter((ma:any)=>ma.id!==m.id)})}>×</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleAddMaterial} className="w-full py-1 bg-green-900/40 text-green-400 rounded text-xs border border-green-500/30">+ Añadir Material</button>
                </div>
            </div>
        );
    };

    const renderNetworkProperties = (element: DiagramElement, updateElement: (id: string, data: any) => void) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };
        return (
            <div className="space-y-4">
                <h4 className="font-semibold text-green-300">Configuración de Red</h4>
                <div><label className="block text-xs text-gray-400">ID/Nombre</label><input type="text" name="deviceName" value={element.data.deviceName || ''} onChange={handleChange} className="input-style" /></div>
                <div><label className="block text-xs text-gray-400">IP Address</label><input type="text" name="ipAddress" value={element.data.ipAddress || ''} onChange={handleChange} className="input-style" placeholder="192.168.1.x" /></div>
                <div><label className="block text-xs text-gray-400">MAC Address</label><input type="text" name="macAddress" value={element.data.macAddress || ''} onChange={handleChange} className="input-style" /></div>
                <div><label className="block text-xs text-gray-400">Notas de Enlace</label><textarea name="connection" value={element.data.connection || ''} onChange={handleChange} className="input-style" rows={2}></textarea></div>
            </div>
        );
    };

    const renderSoftwareProperties = (element: DiagramElement, updateElement: (id: string, data: any) => void) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };
        return (
            <div className="space-y-4">
                <h4 className="font-semibold text-green-300">Propiedades UML</h4>
                <div><label className="block text-xs text-gray-400">Nombre</label><input type="text" name="name" value={element.data.name || ''} onChange={handleChange} className="input-style" /></div>
                {element.type === 'class' && (
                    <>
                        <div><label className="block text-xs text-gray-400">Atributos</label><textarea name="attributes" value={element.data.attributes || ''} onChange={handleChange} className="input-style font-mono text-[10px]" rows={2}></textarea></div>
                        <div><label className="block text-xs text-gray-400">Métodos</label><textarea name="methods" value={element.data.methods || ''} onChange={handleChange} className="input-style font-mono text-[10px]" rows={2}></textarea></div>
                    </>
                )}
            </div>
        );
    };

    const getTabConfig = () => {
        switch(activeTab) {
            case 'construction': return { toolbox: constructionToolbox, renderer: renderConstructionProperties, def: { height: 2.4, width: 1, materials: [] } };
            case 'network': return { toolbox: networkToolbox, renderer: renderNetworkProperties, def: { deviceName: 'NUEVO_DEVICE', ipAddress: '', macAddress: '' } };
            case 'software': return { toolbox: softwareToolbox, renderer: renderSoftwareProperties, def: { name: 'Clase', attributes: '', methods: '' } };
        }
    };

    const config = getTabConfig();

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Header title="Hub de Ingeniería & Diseño" />
            
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex p-1 bg-black/40 border border-green-500/20 rounded-lg shadow-lg">
                    <button onClick={() => setActiveTab('construction')} className={`flex items-center px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'construction' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}>
                        <BlueprintIcon /> <span className="ml-2 hidden lg:inline">Construcción</span>
                    </button>
                    <button onClick={() => setActiveTab('network')} className={`flex items-center px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'network' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}>
                        <NetworkMapIcon /> <span className="ml-2 hidden lg:inline">Redes/IoT</span>
                    </button>
                    <button onClick={() => setActiveTab('software')} className={`flex items-center px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'software' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-green-300'}`}>
                        <UmlIcon /> <span className="ml-2 hidden lg:inline">Software</span>
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setIsSaveModalOpen(true)} className="bg-green-700 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-green-600 shadow-lg">
                        💾 Guardar Plano
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 bg-black/10 border border-green-500/10 rounded-lg overflow-hidden relative">
                <CanvasEditor 
                    toolboxItems={config.toolbox}
                    renderProperties={config.renderer}
                    defaultElementData={config.def}
                    initialLayers={['Planta Baja', 'Infraestructura', 'Diagrama']}
                />
            </div>

            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title="Guardar Proyecto">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400">Nombre del Proyecto</label>
                        <input type="text" className="input-style" value={saveData.planName} onChange={e => setSaveData({...saveData, planName: e.target.value})} placeholder="Ej: Red Central Oficina" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400">Asignar a Cliente</label>
                        <select className="input-style" value={saveData.customerId} onChange={e => setSaveData({...saveData, customerId: e.target.value})}>
                            <option value="">-- Sin Asignar --</option>
                            {mockCustomers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={() => { alert("Proyecto guardado localmente."); setIsSaveModalOpen(false); }} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-500">Confirmar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EngineeringHub;
