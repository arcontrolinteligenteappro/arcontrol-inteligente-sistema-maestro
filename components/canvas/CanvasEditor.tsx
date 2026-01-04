
import React, { useState, useRef, useEffect } from 'react';
import type { DiagramElement } from '../../types';

interface CanvasEditorProps {
    toolboxItems: { type: string; label: string; icon: React.ReactNode | string }[];
    renderProperties: (element: DiagramElement, updateElement: (id: string, data: any) => void) => React.ReactNode;
    defaultElementData: Record<string, any>;
    initialElements?: DiagramElement[];
    initialLayers?: string[];
    activeLayer?: string;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({ toolboxItems, renderProperties, defaultElementData, initialElements = [], initialLayers = ['Capa 1'], activeLayer: parentActiveLayer }) => {
    const [elements, setElements] = useState<DiagramElement[]>(initialElements);
    const [layers, setLayers] = useState<string[]>(initialLayers);
    const [activeLayer, setActiveLayer] = useState<string>(parentActiveLayer || initialLayers[0]);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [interactionMode, setInteractionMode] = useState<'none' | 'drag' | 'resize' | 'pan' | 'rotate' | 'place'>('none');
    const [pendingPlacement, setPendingPlacement] = useState<{type: string, label: string} | null>(null);
    
    const canvasRef = useRef<HTMLDivElement>(null);
    const startPos = useRef({ x: 0, y: 0 });
    const initialElState = useRef<Partial<DiagramElement>>({});
    const initialOffset = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if(parentActiveLayer && layers.includes(parentActiveLayer)) setActiveLayer(parentActiveLayer);
    }, [parentActiveLayer, layers]);

    const snapToGrid = (value: number) => Math.round(value / 20) * 20;
    
    const getCoords = (e: any) => {
        if (!canvasRef.current) return { x: 0, y: 0, screenX: 0, screenY: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left - offset.x) / scale,
            y: (clientY - rect.top - offset.y) / scale,
            screenX: clientX,
            screenY: clientY
        };
    };

    const handlePointerDown = (e: React.PointerEvent, id: string | null, action?: any) => {
        const coords = getCoords(e);

        if (interactionMode === 'place' && pendingPlacement) {
            addNewElement(pendingPlacement.type, pendingPlacement.label, coords.x, coords.y);
            setInteractionMode('none');
            setPendingPlacement(null);
            return;
        }

        e.stopPropagation();
        startPos.current = { x: coords.screenX, y: coords.screenY };

        if (id) {
            setSelectedElementId(id);
            const el = elements.find(el => el.id === id);
            if (el) {
                initialElState.current = { ...el };
                setInteractionMode(action || 'drag');
            }
        } else {
            setSelectedElementId(null);
            setInteractionMode('pan');
            initialOffset.current = { ...offset };
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (interactionMode === 'none' || interactionMode === 'place') return;
        const coords = getCoords(e);
        const deltaX = (coords.screenX - startPos.current.x) / scale;
        const deltaY = (coords.screenY - startPos.current.y) / scale;

        if (interactionMode === 'pan') {
            setOffset({
                x: initialOffset.current.x + (coords.screenX - startPos.current.x),
                y: initialOffset.current.y + (coords.screenY - startPos.current.y)
            });
            return;
        }

        if (!selectedElementId) return;

        setElements(prev => prev.map(el => {
            if (el.id !== selectedElementId) return el;
            const init = initialElState.current;
            if (!init) return el;

            if (interactionMode === 'drag') {
                return { ...el, x: snapToGrid(init.x! + deltaX), y: snapToGrid(init.y! + deltaY) };
            }
            if (interactionMode === 'resize') {
                return { ...el, width: Math.max(40, init.width! + deltaX), height: Math.max(30, init.height! + deltaY) };
            }
            return el;
        }));
    };

    const addNewElement = (type: string, label: string, x: number, y: number) => {
        const newEl: DiagramElement = {
            id: `${type}-${Date.now()}`,
            type,
            label,
            x: snapToGrid(x - 50),
            y: snapToGrid(y - 30),
            width: 100,
            height: 60,
            layer: activeLayer,
            data: { ...defaultElementData, name: label },
        };
        setElements([...elements, newEl]);
        setSelectedElementId(newEl.id);
    };

    const handleToolClick = (type: string, label: string) => {
        setPendingPlacement({ type, label });
        setInteractionMode('place');
    };

    const handleDragStartTool = (e: React.DragEvent, type: string, label: string) => {
        e.dataTransfer.setData('type', type);
        e.dataTransfer.setData('label', label);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('type');
        const label = e.dataTransfer.getData('label');
        if (!type || !canvasRef.current) return;

        const coords = getCoords(e);
        addNewElement(type, label, coords.x, coords.y);
    };

    const zoom = (factor: number) => setScale(s => Math.min(Math.max(0.2, s * factor), 3));

    const selectedElement = elements.find(el => el.id === selectedElementId);

    return (
        <div className="flex h-full bg-[#050505] text-gray-300 relative select-none">
            {/* Toolbox */}
            <div className="w-52 bg-black/60 border-r border-green-500/20 flex flex-col z-20">
                <div className="p-3 bg-black/80 border-b border-green-500/20">
                    <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">Herramientas</h3>
                    <p className="text-[9px] text-gray-500 mt-1">Arrastra o pulsa para colocar</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {toolboxItems.map(item => (
                        <div
                            key={item.type}
                            draggable
                            onDragStart={(e) => handleDragStartTool(e, item.type, item.label)}
                            onClick={() => handleToolClick(item.type, item.label)}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all group
                                ${pendingPlacement?.type === item.type ? 'bg-green-600 border-green-400 text-white shadow-lg' : 'bg-gray-900/60 border-gray-800 hover:border-green-500/40 hover:bg-green-900/10'}
                            `}
                        >
                            <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="text-xs font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-black/40 border-t border-green-500/20 text-[9px] text-gray-600">
                    Pellizca para Zoom o Ctrl+Scroll
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className="bg-black/40 border-b border-green-500/10 p-2 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <button onClick={() => zoom(0.8)} className="px-2 py-1 bg-gray-800 rounded text-xs">-</button>
                        <span className="text-xs font-mono text-green-500 w-12 text-center">{Math.round(scale * 100)}%</span>
                        <button onClick={() => zoom(1.2)} className="px-2 py-1 bg-gray-800 rounded text-xs">+</button>
                    </div>
                    <div className="flex items-center gap-2">
                        {interactionMode === 'place' && (
                            <span className="text-[10px] text-cyan-400 font-bold animate-pulse uppercase tracking-tighter">Tocando para colocar...</span>
                        )}
                        <select value={activeLayer} onChange={e => setActiveLayer(e.target.value)} className="bg-gray-900 border-none text-[10px] rounded px-2 py-1 text-gray-400 outline-none">
                            {layers.map(l => <option key={l} value={l}>Capa: {l}</option>)}
                        </select>
                    </div>
                </div>

                <div 
                    ref={canvasRef}
                    className="flex-1 relative overflow-hidden bg-[#0a0a0a]"
                    onPointerDown={(e) => handlePointerDown(e, null)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={() => { if(interactionMode !== 'place') setInteractionMode('none'); }}
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    onWheel={e => { if(e.ctrlKey) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : 0.9); } }}
                    style={{ 
                        backgroundImage: `radial-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px)`, 
                        backgroundSize: `${20 * scale}px ${20 * scale}px`,
                        backgroundPosition: `${offset.x}px ${offset.y}px`
                    }}
                >
                    <div style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0' }}>
                        {elements.map(el => {
                            if(el.layer !== activeLayer) return null;
                            const isSelected = selectedElementId === el.id;
                            return (
                                <div
                                    key={el.id}
                                    onPointerDown={(e) => handlePointerDown(e, el.id)}
                                    className={`absolute flex flex-col items-center justify-center rounded border-2 transition-shadow shadow-lg
                                        ${isSelected ? 'border-green-400 bg-green-500/10 shadow-green-500/20 z-10' : 'border-gray-700 bg-black/60'}
                                    `}
                                    style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
                                >
                                    <div className="text-2xl mb-1">{toolboxItems.find(t => t.type === el.type)?.icon}</div>
                                    <div className="text-[9px] font-bold uppercase tracking-tighter truncate w-full text-center px-1">
                                        {el.data.name || el.label}
                                    </div>
                                    
                                    {isSelected && (
                                        <div 
                                            onPointerDown={(e) => handlePointerDown(e, el.id, 'resize')}
                                            className="absolute -bottom-1 -right-1 w-4 h-4 bg-white border border-green-500 rounded-full cursor-nwse-resize z-20"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Properties Panel */}
            <div className="w-64 bg-black/80 border-l border-green-500/20 p-4 overflow-y-auto hidden lg:block z-20">
                <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-6 pb-2 border-b border-green-900">Propiedades</h3>
                {selectedElement ? (
                    <>
                        {renderProperties(selectedElement, (id, data) => setElements(elements.map(e => e.id === id ? { ...e, data } : e)))}
                        <button 
                            onClick={() => { if(confirm("¿Eliminar elemento?")) { setElements(elements.filter(e => e.id !== selectedElementId)); setSelectedElementId(null); } }}
                            className="w-full mt-8 py-2 bg-red-900/30 text-red-500 border border-red-500/30 rounded text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                        >
                            ELIMINAR OBJETO
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 opacity-30 text-center">
                        <span className="text-4xl mb-2">🖱️</span>
                        <p className="text-[10px] uppercase">Selecciona un elemento en el lienzo para ver sus propiedades</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CanvasEditor;
