
import React, { useState, useMemo } from 'react';
import Header from './Header';
import Modal from './common/Modal';
import type { ManagedFile, Repository } from '../types';
import { mockFiles, mockRepositories } from '../data/mockData';

// --- Icons ---
const InstallerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const DocumentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
const SketchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TemplateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>;
const OtherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const GoogleDriveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-2.25l-4-6.94L7.75 10H5.5L12 0l6.5 10zM5.5 14h2.25l4 6.94 4.25-6.94H18.5L12 24l-6.5-10zM2 12l6-3.5 6 3.5-6 3.5L2 12z"/></svg>;
const LocalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>;
const GitIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;

interface FileHubProps {
    onTerminalOpen?: (command: string) => void;
}

const FileHub: React.FC<FileHubProps> = ({ onTerminalOpen }) => {
    const [files, setFiles] = useState<ManagedFile[]>(mockFiles);
    const [repos, setRepos] = useState<Repository[]>(mockRepositories);
    const [filter, setFilter] = useState<'all' | ManagedFile['type'] | 'Repos'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredFiles = useMemo(() => {
        if (filter === 'all') return files;
        if (filter === 'Repos') return []; // Repos handled separately
        return files.filter(file => file.type === filter);
    }, [files, filter]);

    const handleSaveFile = (fileData: Omit<ManagedFile, 'id' | 'createdAt'>) => {
        const newFile: ManagedFile = {
            ...fileData,
            id: `FILE${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
        };
        setFiles([newFile, ...files]);
        setIsModalOpen(false);
    };

    const handleFileClick = (file: ManagedFile) => {
        if (file.source === 'Google Drive') {
            window.open(file.path, '_blank', 'noopener,noreferrer');
        } else {
            alert(`Este es un acceso directo a tu archivo local:\n\n${file.path}`);
        }
    };
    
    const fileTypes: ManagedFile['type'][] = ['Instalador', 'Documento', 'Boceto', 'Plantilla', 'Otro'];
    const filterOptions: ('all' | ManagedFile['type'] | 'Repos')[] = ['all', ...fileTypes, 'Repos'];

    return (
        <div>
            <Header title="Archivo Digital y Repositorios" />
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-1 p-1 bg-black/50 border border-green-500/20 rounded-lg overflow-x-auto">
                    {filterOptions.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors whitespace-nowrap ${filter === f ? 'bg-green-600 text-white shadow-[0_0_10px_#16a34a]' : 'text-gray-400 hover:bg-green-900/50'}`}
                        >
                            {f === 'all' ? 'Todos' : f}
                        </button>
                    ))}
                </div>
                 <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 flex items-center shrink-0 ml-2 font-bold transition-all active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Nuevo
                </button>
            </div>

            {filter === 'Repos' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {repos.map(repo => (
                        <div key={repo.id} className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 hover:border-green-400 transition-all group hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-gray-900 rounded-full border border-gray-700 text-white group-hover:bg-green-900/30 group-hover:border-green-500/50 transition-colors">
                                    <GitIcon />
                                </div>
                                <span className={`text-[10px] px-2 py-1 rounded border font-bold uppercase ${repo.status === 'Installed' ? 'bg-green-900/30 text-green-300 border-green-500/30 shadow-[0_0_5px_#16a34a]' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                    {repo.status}
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-green-300 mb-1 group-hover:text-white transition-colors">{repo.name}</h3>
                            <p className="text-xs text-gray-400 mb-4 h-8 overflow-hidden leading-tight">{repo.description}</p>
                            
                            <div className="flex space-x-2 mt-auto">
                                <a href={repo.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs text-white font-bold transition-colors">
                                    GitHub
                                </a>
                                {repo.status === 'Installed' && onTerminalOpen ? (
                                    <button 
                                        onClick={() => onTerminalOpen(`cd ${repo.localPath || '/home/admin/projects'} && ls -la`)}
                                        className="flex-[1.5] py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/20 active:scale-95"
                                    >
                                        <span className="mr-1">&gt;_</span> Ejecutar Shell
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => onTerminalOpen ? onTerminalOpen(`git clone ${repo.url}`) : alert("Terminal no disponible")}
                                        className="flex-[1.5] py-2 bg-green-600 hover:bg-green-500 rounded text-xs text-white flex items-center justify-center font-bold shadow-lg shadow-green-900/20 active:scale-95"
                                    >
                                        Instalar (Clone)
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredFiles.map(file => (
                        <FileCard key={file.id} file={file} onClick={() => handleFileClick(file)} />
                    ))}
                </div>
            )}
            
            {filter !== 'Repos' && filteredFiles.length === 0 && <p className="text-center text-gray-500 col-span-full py-10 italic">:: No hay archivos en esta categoría ::</p>}

            <AddFileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveFile} />
        </div>
    );
};


// --- File Card Component ---
const FileCard: React.FC<{file: ManagedFile, onClick: () => void}> = ({ file, onClick }) => {
    const getIcon = () => {
        switch(file.type) {
            case 'Instalador': return <InstallerIcon />;
            case 'Documento': return <DocumentIcon />;
            case 'Boceto': return <SketchIcon />;
            case 'Plantilla': return <TemplateIcon />;
            default: return <OtherIcon />;
        }
    };
    
    return (
        <div
            onClick={onClick}
            className="bg-black/50 backdrop-blur-sm border border-green-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-green-400 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-200 aspect-square group"
        >
            <div className="text-4xl text-green-400 mb-2 group-hover:scale-110 transition-transform">{getIcon()}</div>
            <p className="font-semibold text-sm text-gray-200 break-words w-full group-hover:text-green-300 transition-colors">{file.name}</p>
            <div className="mt-auto pt-2 flex items-center text-[10px] text-gray-500 uppercase tracking-tighter">
                {file.source === 'Google Drive' ? <GoogleDriveIcon /> : <LocalIcon />}
                <span className="ml-1 font-mono">{file.source}</span>
            </div>
        </div>
    )
};


// --- Add File Modal ---
const AddFileModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (data: Omit<ManagedFile, 'id'|'createdAt'>) => void}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<ManagedFile['type']>('Otro');
    const [source, setSource] = useState<ManagedFile['source']>('Local');
    const [path, setPath] = useState('');

    const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setPath(e.target.files[0].name);
        }
    };
    
    const handleSubmit = () => {
        if(!name || !path) {
            alert('El nombre y la ruta/archivo son obligatorios.');
            return;
        }
        onSave({ name, type, source, path });
        onClose();
        setName('');
        setPath('');
        setType('Otro');
        setSource('Local');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Archivo">
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Nombre Descriptivo</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ej: Contrato Firmado Cliente X" className="input-style" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Tipo de Archivo</label>
                        <select value={type} onChange={e => setType(e.target.value as ManagedFile['type'])} className="input-style">
                            <option>Instalador</option>
                            <option>Documento</option>
                            <option>Boceto</option>
                            <option>Plantilla</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Origen del Archivo</label>
                         <select value={source} onChange={e => { setSource(e.target.value as ManagedFile['source']); setPath(''); }} className="input-style">
                            <option value="Local">Local</option>
                            <option value="Google Drive">Google Drive</option>
                        </select>
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-400">{source === 'Local' ? 'Seleccionar Archivo Local' : 'URL de Google Drive'}</label>
                     {source === 'Local' ? (
                        <input type="file" onChange={handleLocalFileChange} className="input-style file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-green-900/50 file:text-green-300 hover:file:bg-green-800/50 cursor-pointer"/>
                     ) : (
                        <input type="url" value={path} onChange={e => setPath(e.target.value)} placeholder="Pegue el enlace para compartir aquí" className="input-style" />
                     )}
                     {source === 'Local' && path && <p className="text-[10px] text-green-500 mt-1 font-mono">OK: {path} seleccionado.</p>}
                </div>
                 <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 font-bold transition-all active:scale-95 shadow-lg shadow-green-900/20">
                        Guardar Archivo
                    </button>
                </div>
            </div>
        </Modal>
    );
};


export default FileHub;
