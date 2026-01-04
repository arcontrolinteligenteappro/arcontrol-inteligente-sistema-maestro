
import React from 'react';
import Header from './Header';
import CanvasEditor from './canvas/CanvasEditor';

// --- Core Networking ---
const RouterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 8-8 8"/><path d="m8 8 8 8"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>;
const SwitchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m16 8-4 4 4 4"/><path d="M20 12H8"/><path d="m8 16 4-4-4-4"/><path d="M4 12h12"/></svg>;
const FirewallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M12 18v-3"/><path d="M8 15v-3"/><path d="M16 15v-3"/><path d="m3 3 18 18"/><path d="M3 9h18"/><path d="M9 21V3"/></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
const CloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>;

// --- IoT & Wireless ---
const AccessPointIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/><rect x="10" y="20" width="4" height="4"/></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const SensorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 6a6 6 0 0 1 6 6"/><path d="M22 12h-2"/><path d="M6 12H2"/></svg>;
const SmartphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;

// --- Logical Flow (IoT Logic) ---
const ProcessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="12" rx="2"/></svg>;
const DecisionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l10 10-10 10L2 12z"/></svg>;
const EventIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;

// --- Connections ---
const DataCableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9h20"/><path d="M2 15h20"/><path d="M5 9v6"/><path d="M19 9v6"/><rect x="9" y="7" width="6" height="10" rx="1"/></svg>;
const PowerCableIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;


const NetworkDiagram: React.FC = () => {

    const toolboxItems = [
        // Network Devices
        { type: 'router', label: 'Router', icon: <RouterIcon /> },
        { type: 'switch', label: 'Switch L2/L3', icon: <SwitchIcon /> },
        { type: 'firewall', label: 'Firewall', icon: <FirewallIcon /> },
        { type: 'server', label: 'Servidor', icon: <ServerIcon /> },
        { type: 'ap', label: 'Access Point', icon: <AccessPointIcon /> },
        
        // IoT & Endpoints
        { type: 'camera_ip', label: 'Cámara IP', icon: <CameraIcon /> },
        { type: 'sensor_iot', label: 'Sensor IoT', icon: <SensorIcon /> },
        { type: 'mobile', label: 'Smartphone', icon: <SmartphoneIcon /> },
        { type: 'cloud', label: 'Nube/Internet', icon: <CloudIcon /> },

        // Logical Flow (IoT Events)
        { type: 'logic_event', label: 'Evento/Alerta', icon: <EventIcon /> },
        { type: 'logic_process', label: 'Proceso/Acción', icon: <ProcessIcon /> },
        { type: 'logic_decision', label: 'Condición (SI/NO)', icon: <DecisionIcon /> },
        { type: 'db', label: 'Base de Datos', icon: <DatabaseIcon /> },

        // Connections (Representation)
        { type: 'cable_data', label: 'Cable Datos (UTP/Fibra)', icon: <DataCableIcon /> },
        { type: 'cable_power', label: 'Alimentación (AC/DC)', icon: <PowerCableIcon /> },
    ];

    const renderProperties = (element: any, updateElement: (id: string, data: any) => void) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };
        
        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Etiqueta / Nombre</label>
                    <input type="text" name="deviceName" value={element.data.deviceName || ''} onChange={handleChange} className="input-style" />
                </div>
                
                {['router', 'switch', 'server', 'camera_ip', 'ap'].includes(element.type) && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Dirección IP</label>
                            <input type="text" name="ipAddress" value={element.data.ipAddress || ''} onChange={handleChange} className="input-style" placeholder="192.168.x.x" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">MAC / ID</label>
                            <input type="text" name="macAddress" value={element.data.macAddress || ''} onChange={handleChange} className="input-style" />
                        </div>
                    </>
                )}

                {['logic_process', 'logic_decision', 'logic_event'].includes(element.type) && (
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Lógica / Condición</label>
                        <textarea name="logicDescription" value={element.data.logicDescription || ''} onChange={handleChange} className="input-style" rows={3} placeholder="Ej: Si detecta movimiento..."></textarea>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-400">Notas Adicionales</label>
                    <textarea name="connection" value={element.data.connection || ''} onChange={handleChange} className="input-style" rows={3} placeholder="Detalles de conexión o notas"></textarea>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Header title="Diagramas de Red y Flujo IoT" />
            <p className="text-gray-400 mb-4 text-sm">
                Diseñe la topología física, el cableado y la lógica de eventos de su sistema de seguridad e IoT.
            </p>
            <CanvasEditor
                toolboxItems={toolboxItems}
                renderProperties={renderProperties}
                defaultElementData={{ deviceName: 'Elemento', ipAddress: '', macAddress: '', connection: '' }}
                activeLayer="Diagrama General"
            />
        </div>
    );
};

export default NetworkDiagram;
