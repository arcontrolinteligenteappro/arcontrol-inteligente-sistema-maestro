
import React from 'react';
import Header from './Header';
import CanvasEditor from './canvas/CanvasEditor';

// --- UML Symbology ---
const ClassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>;
const InterfaceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>;
const ActorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v10"/><path d="M9 10h6"/><path d="M9 21l3-4 3 4"/></svg>;
const UseCaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="12" rx="10" ry="6"/></svg>;
const PackageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v2"/></svg>;
const DatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>;
const NoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;


const SoftwareDiagrams: React.FC = () => {

    const toolboxItems = [
        { type: 'class', label: 'Clase', icon: <ClassIcon /> },
        { type: 'interface', label: 'Interfaz', icon: <InterfaceIcon /> },
        { type: 'actor', label: 'Actor', icon: <ActorIcon /> },
        { type: 'usecase', label: 'Caso de Uso', icon: <UseCaseIcon /> },
        { type: 'package', label: 'Paquete', icon: <PackageIcon /> },
        { type: 'database', label: 'Base de Datos', icon: <DatabaseIcon /> },
        { type: 'note', label: 'Nota / Comentario', icon: <NoteIcon /> },
    ];
    
     const renderProperties = (element: any, updateElement: (id: string, data: any) => void) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            updateElement(element.id, { ...element.data, [e.target.name]: e.target.value });
        };

        return (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Nombre</label>
                    <input type="text" name="name" value={element.data.name || ''} onChange={handleChange} className="input-style" />
                </div>
                
                {element.type === 'class' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Atributos</label>
                            <textarea name="attributes" value={element.data.attributes || ''} onChange={handleChange} className="input-style font-mono text-xs" rows={3} placeholder="+ id: int&#10;- name: string"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Métodos</label>
                            <textarea name="methods" value={element.data.methods || ''} onChange={handleChange} className="input-style font-mono text-xs" rows={3} placeholder="+ save(): void&#10;+ load(): Data"></textarea>
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-400">Notas / Descripción</label>
                    <textarea name="notes" value={element.data.notes || ''} onChange={handleChange} className="input-style" rows={4}></textarea>
                </div>
            </div>
        );
    };


    return (
        <div>
            <Header title="Diagramas de Software (UML)" />
            <CanvasEditor
                toolboxItems={toolboxItems}
                renderProperties={renderProperties}
                defaultElementData={{ name: 'Elemento', notes: '', attributes: '', methods: '' }}
                activeLayer="Diagrama General"
            />
        </div>
    );
};

export default SoftwareDiagrams;
