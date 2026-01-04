
import React, { useState } from 'react';
import Header from './Header';
import Table from './common/Table';
import Modal from './common/Modal';
import { mockPromotions } from '../data/mockData';
import type { Promotion } from '../types';

const Promotions: React.FC = () => {
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
    const [selectedPromoForFlyer, setSelectedPromoForFlyer] = useState<Promotion | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<Promotion>>({
        code: '',
        name: '',
        type: 'percent',
        value: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        description: '',
        active: true
    });

    const daysOfWeek = [
        { id: 'Mon', label: 'Lun' },
        { id: 'Tue', label: 'Mar' },
        { id: 'Wed', label: 'Mié' },
        { id: 'Thu', label: 'Jue' },
        { id: 'Fri', label: 'Vie' },
        { id: 'Sat', label: 'Sáb' },
        { id: 'Sun', label: 'Dom' },
    ];

    const handleOpenModal = (promo?: Promotion) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData(promo);
        } else {
            setEditingPromo(null);
            setFormData({
                code: '',
                name: '',
                type: 'percent',
                value: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                description: '',
                active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (!formData.code || !formData.name || !formData.value) {
            alert("Código, Nombre y Valor son obligatorios.");
            return;
        }

        const newPromo: Promotion = {
            id: editingPromo ? editingPromo.id : `PROMO${Date.now()}`,
            code: formData.code!,
            name: formData.name!,
            type: formData.type as 'percent' | 'amount',
            value: Number(formData.value),
            startDate: formData.startDate!,
            endDate: formData.endDate || '',
            activeDays: formData.activeDays || [],
            description: formData.description || '',
            active: formData.active || false
        };

        if (editingPromo) {
            setPromotions(promotions.map(p => p.id === editingPromo.id ? newPromo : p));
        } else {
            setPromotions([...promotions, newPromo]);
        }
        setIsModalOpen(false);
    };

    const toggleDay = (day: string) => {
        const currentDays = formData.activeDays || [];
        if (currentDays.includes(day)) {
            setFormData({ ...formData, activeDays: currentDays.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, activeDays: [...currentDays, day] });
        }
    };

    const columns = [
        { header: 'Código', accessor: 'code' as keyof Promotion },
        { header: 'Nombre', accessor: 'name' as keyof Promotion },
        { header: 'Tipo', accessor: 'type' as keyof Promotion, render: (row: Promotion) => row.type === 'percent' ? 'Porcentaje (%)' : 'Monto Fijo ($)' },
        { header: 'Valor', accessor: 'value' as keyof Promotion },
        { header: 'Vigencia', accessor: 'endDate' as keyof Promotion, render: (row: Promotion) => row.endDate || 'Indefinida' },
        { header: 'Estado', accessor: 'active' as keyof Promotion, render: (row: Promotion) => (
            <span className={`px-2 py-1 rounded text-xs font-bold ${row.active ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                {row.active ? 'Activo' : 'Inactivo'}
            </span>
        )},
    ];

    const renderActions = (row: Promotion) => (
        <div className="flex justify-end space-x-2">
            <button onClick={() => setSelectedPromoForFlyer(row)} className="text-white hover:text-green-300 px-2 border border-white/20 rounded" title="Generar Folleto">
                🖨️ Folleto
            </button>
            <button onClick={() => handleOpenModal(row)} className="text-blue-400 hover:text-blue-300">Editar</button>
            <button 
                onClick={() => setPromotions(promotions.map(p => p.id === row.id ? { ...p, active: !p.active } : p))} 
                className="text-yellow-400 hover:text-yellow-300"
            >
                {row.active ? 'Desactivar' : 'Activar'}
            </button>
        </div>
    );

    return (
        <div>
            <Header title="Promociones y Cupones" />
            <div className="mb-4 flex justify-end">
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md">
                    Nueva Promoción
                </button>
            </div>

            <Table columns={columns} data={promotions} renderActions={renderActions} />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPromo ? "Editar Promoción" : "Nueva Promoción"}>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Código (Cupón)</label>
                            <input 
                                type="text" 
                                value={formData.code} 
                                onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                                className="input-style font-mono"
                                placeholder="Ej: VERANO20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Nombre Promoción</label>
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                                className="input-style"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Tipo Descuento</label>
                            <select 
                                value={formData.type} 
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })} 
                                className="input-style"
                            >
                                <option value="percent">Porcentaje (%)</option>
                                <option value="amount">Monto Fijo ($)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Valor</label>
                            <input 
                                type="number" 
                                value={formData.value} 
                                onChange={e => setFormData({ ...formData, value: Number(e.target.value) })} 
                                className="input-style"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Fecha Inicio</label>
                            <input 
                                type="date" 
                                value={formData.startDate} 
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })} 
                                className="input-style"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Fecha Fin (Opcional)</label>
                            <input 
                                type="date" 
                                value={formData.endDate} 
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })} 
                                className="input-style"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Días Activos</label>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map(day => (
                                <button
                                    key={day.id}
                                    onClick={() => toggleDay(day.id)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                        formData.activeDays?.includes(day.id) 
                                        ? 'bg-green-600 text-white border-green-500' 
                                        : 'bg-gray-800 text-gray-400 border-gray-600'
                                    }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400">Nota Adicional</label>
                        <textarea 
                            value={formData.description} 
                            onChange={e => setFormData({ ...formData, description: e.target.value })} 
                            className="input-style" 
                            rows={3}
                            placeholder="Condiciones, restricciones, etc."
                        />
                    </div>

                    <div className="flex items-center mt-2">
                        <input 
                            type="checkbox" 
                            id="active" 
                            checked={formData.active} 
                            onChange={e => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                        />
                        <label htmlFor="active" className="ml-2 text-sm text-gray-300">Promoción Activa</label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                            Guardar Promoción
                        </button>
                    </div>
                </div>
            </Modal>

            {selectedPromoForFlyer && (
                <FlyerGeneratorModal 
                    promotion={selectedPromoForFlyer} 
                    onClose={() => setSelectedPromoForFlyer(null)} 
                />
            )}
        </div>
    );
};

// --- Flyer Generator Component ---
const FlyerGeneratorModal: React.FC<{ promotion: Promotion, onClose: () => void }> = ({ promotion, onClose }) => {
    const [template, setTemplate] = useState<'cyber' | 'minimal' | 'retail'>('cyber');
    
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=600');
        const content = document.getElementById('flyer-preview')?.innerHTML;
        
        if (printWindow && content) {
            printWindow.document.write('<html><head><title>Imprimir Folleto</title>');
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
            printWindow.document.write('<style>@import url("https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap"); body { -webkit-print-color-adjust: exact; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(content);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Generador de Folletos Publicitarios">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Controls */}
                <div className="w-full lg:w-1/3 space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Seleccionar Estilo</label>
                        <div className="space-y-2">
                            <button onClick={() => setTemplate('cyber')} className={`w-full text-left px-4 py-2 rounded border ${template === 'cyber' ? 'border-green-500 bg-green-900/30' : 'border-gray-600'}`}>Cyber Punk (Tech)</button>
                            <button onClick={() => setTemplate('minimal')} className={`w-full text-left px-4 py-2 rounded border ${template === 'minimal' ? 'border-white bg-gray-200 text-black' : 'border-gray-600'}`}>Minimalista Elegante</button>
                            <button onClick={() => setTemplate('retail')} className={`w-full text-left px-4 py-2 rounded border ${template === 'retail' ? 'border-yellow-500 bg-yellow-900/30' : 'border-gray-600'}`}>Oferta Retail</button>
                        </div>
                    </div>
                    <button onClick={handlePrint} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 shadow-lg">
                        🖨️ Exportar PDF / Imprimir
                    </button>
                </div>

                {/* Preview Canvas */}
                <div className="flex-1 bg-gray-900 p-4 rounded-lg flex items-center justify-center overflow-hidden border border-gray-700">
                    <div id="flyer-preview" className="scale-75 lg:scale-90 origin-top">
                        {template === 'cyber' && (
                            <div className="w-[400px] h-[600px] bg-black border-4 border-green-500 relative flex flex-col items-center justify-center p-8 text-center font-[Rajdhani] shadow-[0_0_50px_rgba(0,255,0,0.3)]">
                                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_20%,#00ff0010_20%,#00ff0010_50%,transparent_50%,transparent_70%,#00ff0010_70%,#00ff0010_100%)] bg-[length:20px_20px]"></div>
                                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 uppercase z-10 mb-4 tracking-tighter">OFERTA</h1>
                                <div className="text-white text-xl z-10 mb-8 uppercase tracking-widest border-b border-green-500 pb-2">{promotion.name}</div>
                                <div className="bg-green-600 text-black font-bold text-8xl px-6 py-2 transform -rotate-3 z-10 shadow-lg mb-8 rounded-sm">
                                    {promotion.type === 'percent' ? `-${promotion.value}%` : `-$${promotion.value}`}
                                </div>
                                <p className="text-gray-300 z-10 text-sm mb-4 max-w-[250px]">{promotion.description || "Aprovecha esta oportunidad única en tecnología y servicios."}</p>
                                <div className="border-2 border-dashed border-green-500 p-4 z-10 mt-auto bg-black/80">
                                    <p className="text-xs text-green-400 mb-1">CÓDIGO DE CUPÓN:</p>
                                    <p className="text-4xl font-mono text-white tracking-widest">{promotion.code}</p>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-4 z-10">Válido hasta: {promotion.endDate || 'Agotar existencias'}</p>
                            </div>
                        )}

                        {template === 'minimal' && (
                            <div className="w-[400px] h-[600px] bg-white text-black relative flex flex-col items-center justify-center p-12 text-center shadow-2xl">
                                <div className="border border-black w-full h-full absolute top-2 left-2 pointer-events-none"></div>
                                <h2 className="text-sm uppercase tracking-[0.3em] mb-6 text-gray-500">Promoción Especial</h2>
                                <h1 className="text-4xl font-serif font-bold mb-4 leading-tight">{promotion.name}</h1>
                                <div className="h-px w-20 bg-black mb-8"></div>
                                <div className="text-9xl font-thin mb-2">
                                    {promotion.type === 'percent' ? `${promotion.value}%` : `$${promotion.value}`}
                                </div>
                                <p className="text-xl italic font-serif text-gray-600 mb-12">de descuento</p>
                                <p className="text-sm text-gray-600 mb-8 leading-relaxed px-4">{promotion.description}</p>
                                <div className="bg-black text-white px-8 py-3 text-lg font-bold tracking-widest">
                                    {promotion.code}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-auto">Expira: {promotion.endDate}</p>
                            </div>
                        )}

                        {template === 'retail' && (
                            <div className="w-[400px] h-[600px] bg-yellow-400 relative flex flex-col items-center justify-start p-4 text-center shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-40 bg-red-600 transform -skew-y-6 -translate-y-10 z-0"></div>
                                <h1 className="relative z-10 text-white text-6xl font-black italic mt-8 drop-shadow-md">¡GRAN VENTA!</h1>
                                <div className="relative z-10 bg-white p-6 rounded-lg shadow-xl mt-12 w-full max-w-[320px] transform rotate-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 uppercase">{promotion.name}</h3>
                                    <div className="text-red-600 font-black text-7xl mb-2">
                                        {promotion.type === 'percent' ? `${promotion.value}%` : `$${promotion.value}`}
                                    </div>
                                    <p className="text-red-600 font-bold uppercase text-2xl">OFF</p>
                                </div>
                                <div className="relative z-10 mt-8">
                                    <p className="font-bold text-gray-800 text-lg mb-1">USA EL CÓDIGO:</p>
                                    <div className="border-4 border-dashed border-red-600 p-2 text-4xl font-black text-red-600 bg-white inline-block transform -rotate-2">
                                        {promotion.code}
                                    </div>
                                </div>
                                <div className="mt-auto mb-4 text-xs font-bold text-gray-700">
                                    * Aplican términos y condiciones. Válido hasta {promotion.endDate}.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default Promotions;
