
import React, { useState } from 'react';
import Header from './Header';
import CanvasEditor from './canvas/CanvasEditor';
import type { DiagramElement, Material } from '../types';

// --- Structural & Walls ---
const WallStandardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22h20"/><path d="M2 2h20"/><path d="M12 2v20"/></svg>;
const WallBrickIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="16" x2="22" y2="16"/><line x1="8" y1="2" x2="8" y2="8"/><line x1="16" y1="8" x2="16" y2="16"/><line x1="8" y1="16" x2="8" y2="22"/></svg>;
const WallDrywallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20"/><line x1="12" y1="2" x2="12" y2="22" strokeDasharray="4 2"/></svg>;
const WallGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20"/><line x1="16" y1="2" x2="8" y2="22" opacity="0.5"/></svg>;

// --- Doors & Windows ---
const DoorSingleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V2h.01"/><path d="M4 22A18 18 0 0 1 22 4"/></svg>;
const DoorDoubleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22V2"/><path d="M22 22V2"/><path d="M2 22a10 10 0 0 1 10-10"/><path d="M22 22a10 10 0 0 0-10-10"/></svg>;
const DoorSlidingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16"/><line x1="10" y1="4" x2="10" y2="20"/><line x1="14" y1="4" x2="14" y2="20"/><path d="M6 12h2"/><path d="M16 12h2"/></svg>;
const GarageDoorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16"/><line x1="2" y1="8" x2="22" y2="8"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="16" x2="22" y2="16"/></svg>;
const WindowStandardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;

// --- Security & CCTV (New) ---
const CamDomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-10 10v3h20v-3a10 10 0 0 0-10-10z"/><circle cx="12" cy="12" r="3"/><path d="M4 15h16"/></svg>;
const CamPTZIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="7" width="10" height="8" rx="2"/><path d="M12 15v6"/><path d="M8 21h8"/><path d="M12 7V3"/><path d="M17 5l-2-2"/><path d="M7 5l2-2"/><circle cx="12" cy="11" r="2"/></svg>;
const NVRIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="16" width="20" height="6" rx="1"/><rect x="2" y="8" width="20" height="6" rx="1"/><path d="M6 19h.01"/><path d="M10 19h.01"/><circle cx="18" cy="11" r="1" fill="currentColor"/><circle cx="18" cy="19" r="1" fill="red"/></svg>;
const RackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/><path d="M7 2v20"/><path d="M17 2v20"/></svg>;
const UPSIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12v14a6 6 0 0 1-12 0V2z"/><path d="M10 22h4"/><path d="M12 12v6"/><path d="M12 12l2-2"/><path d="M12 12l-2-2"/></svg>;
const MonitorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
const SmokeSensorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4"/><path d="M12 18v4"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/></svg>;
const AlarmPanelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><rect x="8" y="6" width="8" height="4" rx="1"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>;

// --- Infrastructure (New) ---
const ConduitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="20" height="4" rx="1"/><line x1="6" y1="10" x2="6" y2="14"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="18" y1="10" x2="18" y2="14"/></svg>;
const PowerOutletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 16v-2"/></svg>;

// --- Furniture ---
const SofaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6v8"/><path d="M18 6v8"/><path d="M2 14h20"/><path d="M6 6h12a2 2 0 0 1 2 2v6H4V8a2 2 0 0 1 2-2z"/></svg>;
const TableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="10" rx="10" ry="6"/><path d="M4 14v6"/><path d="M20 14v6"/><path d="M12 16v6"/></svg>;
const ChairIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 21v-8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8"/><path d="M19 21v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2"/><path d="M7 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8H7V3z"/></svg>;
const BedIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const ToiletIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="6" rx="1"/><path d="M12 8v4"/><path d="M6 12a6 6 0 0 0 12 0v-2H6v2z"/><path d="M8 12h8"/></svg>;

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

const ConstructionPlanner: React.FC = () => {
    const [activeLayer, setActiveLayer] = useState('Planta Baja/Única');

    const toolboxItems = [
        // Muros y Estructuras
        { type: 'wall_std', label: 'Muro Estándar', icon: <WallStandardIcon /> },
        { type: 'wall_brick', label: 'Muro Ladrillo', icon: <WallBrickIcon /> },
        { type: 'wall_dry', label: 'Muro Tablaroca', icon: <WallDrywallIcon /> },
        { type: 'wall_glass', label: 'Muro Cristal', icon: <WallGlassIcon /> },
        
        // Puertas y Ventanas
        { type: 'door_single', label: 'Puerta Simple', icon: <DoorSingleIcon /> },
        { type: 'door_double', label: 'Puerta Doble', icon: <DoorDoubleIcon /> },
        { type: 'door_slide', label: 'Puerta Corrediza', icon: <DoorSlidingIcon /> },
        { type: 'garage', label: 'Portón Garage', icon: <GarageDoorIcon /> },
        { type: 'window_std', label: 'Ventana', icon: <WindowStandardIcon /> },

        // Seguridad y CCTV
        { type: 'cam_dome', label: 'Cámara Domo', icon: <CamDomeIcon /> },
        { type: 'cam_ptz', label: 'Cámara PTZ', icon: <CamPTZIcon /> },
        { type: 'nvr', label: 'NVR / DVR', icon: <NVRIcon /> },
        { type: 'rack', label: 'Rack Comunic.', icon: <RackIcon /> },
        { type: 'ups', label: 'UPS / Respaldo', icon: <UPSIcon /> },
        { type: 'monitor', label: 'Monitor / VMS', icon: <MonitorIcon /> },
        { type: 'sensor_smoke', label: 'Sensor Humo', icon: <SmokeSensorIcon /> },
        { type: 'alarm_panel', label: 'Panel Alarma', icon: <AlarmPanelIcon /> },

        // Infraestructura y Cableado
        { type: 'conduit', label: 'Tubería/Ducto', icon: <ConduitIcon /> },
        { type: 'power_out', label: 'Toma Corriente', icon: <PowerOutletIcon /> },

        // Muebles Básicos
        { type: 'sofa', label: 'Sofá', icon: <SofaIcon /> },
        { type: 'table', label: 'Mesa', icon: <TableIcon /> },
        { type: 'chair', label: 'Silla', icon: <ChairIcon /> },
        { type: 'bed', label: 'Cama', icon: <BedIcon /> },
        { type: 'toilet', label: 'WC', icon: <ToiletIcon /> },
    ];

    const layers = [
        'Planta Baja/Única',
        'Plantas Superiores',
        'Planta de Conjunto',
        'Planta de Cubierta',
        'Instalaciones (CCTV/Eléctrico)',
        'Plantas Cenitales'
    ];

    const renderProperties = (element: DiagramElement, updateElement: (id: string, data: any) => void) => {
        const [newMaterial, setNewMaterial] = useState<{name: string, type: Material['type'], quantity: number, unit: string}>({ name: '', type: 'Cable', quantity: 1, unit: 'pza' });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };

        const handleMaterialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setNewMaterial(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) || 0 : value }));
        };

        const handleAddMaterial = () => {
             if (!newMaterial.name || newMaterial.quantity <= 0 || !newMaterial.unit) {
                alert("Por favor, complete todos los datos del material.");
                return;
            }
            const updatedMaterials = [...(element.data.materials || []), { ...newMaterial, id: `mat-${Date.now()}` }];
            updateElement(element.id, { ...element.data, materials: updatedMaterials });
            setNewMaterial({ name: '', type: 'Cable', quantity: 1, unit: 'pza' });
        };

        const handleRemoveMaterial = (materialId: string) => {
            const updatedMaterials = (element.data.materials || []).filter((m: Material) => m.id !== materialId);
            updateElement(element.id, { ...element.data, materials: updatedMaterials });
        };

        const materialTypes: Material['type'][] = ['Cable', 'Conector', 'Caja', 'Tapa', 'Accesorio', 'Otro'];

        return (
            <div className="space-y-4">
                <div className="pb-4 border-b border-green-500/20">
                    <h4 className="font-semibold text-green-300 mb-2">Propiedades</h4>
                    <p className="text-xs text-green-500 mb-2">Capa: {element.layer}</p>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Etiqueta</label>
                        <input type="text" name="name" value={element.data.name || ''} onChange={handleChange} className="input-style" />
                    </div>
                    {/* Architectural Properties */}
                    {['wall_std', 'wall_brick', 'wall_dry', 'wall_glass'].includes(element.type) && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Altura (m)</label>
                                <input type="number" name="height" value={element.data.height || ''} onChange={handleChange} className="input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Longitud (m)</label>
                                <input type="number" name="length" value={element.data.length || ''} onChange={handleChange} className="input-style" />
                            </div>
                        </>
                    )}
                    
                    {/* Security Properties */}
                    {['cam_dome', 'cam_ptz'].includes(element.type) && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Ángulo Visión</label>
                            <input type="text" name="angle" value={element.data.angle || ''} onChange={handleChange} placeholder="Ej: 90 grados" className="input-style" />
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold text-green-300 mb-2">Lista de Materiales</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 mb-4">
                        {(element.data.materials || []).map((mat: Material) => (
                            <div key={mat.id} className="flex justify-between items-center p-2 bg-green-900/40 rounded-md text-sm">
                                <div>
                                    <p className="font-medium text-gray-200">{mat.name}</p>
                                    <p className="text-xs text-gray-400">{mat.quantity} {mat.unit} ({mat.type})</p>
                                </div>
                                <button onClick={() => handleRemoveMaterial(mat.id)} className="text-red-400 hover:text-red-300"><TrashIcon /></button>
                            </div>
                        ))}
                         {(element.data.materials || []).length === 0 && <p className="text-xs text-center text-gray-500">Sin materiales asignados.</p>}
                    </div>

                    <div className="space-y-3 p-3 border border-green-500/20 rounded-lg bg-black/30">
                         <h5 className="text-sm font-semibold text-green-200">Añadir Material</h5>
                         <input type="text" name="name" value={newMaterial.name} onChange={handleMaterialChange} placeholder="Nombre del material" className="input-style text-sm"/>
                         <select name="type" value={newMaterial.type} onChange={handleMaterialChange} className="input-style text-sm">
                            {materialTypes.map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                         <div className="flex space-x-2">
                             <input type="number" name="quantity" value={newMaterial.quantity} onChange={handleMaterialChange} placeholder="Cant." className="input-style text-sm w-1/2"/>
                             <input type="text" name="unit" value={newMaterial.unit} onChange={handleMaterialChange} placeholder="Unidad" className="input-style text-sm w-1/2"/>
                         </div>
                         <button onClick={handleAddMaterial} className="w-full py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-500">Agregar</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header title="Planos de Ubicación y Arquitectónicos" />
            
            <div className="mb-4 flex overflow-x-auto pb-2 space-x-2">
                {layers.map(layer => (
                    <button
                        key={layer}
                        onClick={() => setActiveLayer(layer)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            activeLayer === layer 
                            ? 'bg-green-600 text-white border border-green-400' 
                            : 'bg-black/40 text-gray-400 border border-green-500/20 hover:bg-green-900/30'
                        }`}
                    >
                        {layer}
                    </button>
                ))}
            </div>

            <CanvasEditor 
                toolboxItems={toolboxItems}
                renderProperties={renderProperties}
                defaultElementData={{ height: 2.4, width: 1, length: 1, materials: [] }}
                activeLayer={activeLayer}
            />
        </div>
    );
};

export default ConstructionPlanner;
