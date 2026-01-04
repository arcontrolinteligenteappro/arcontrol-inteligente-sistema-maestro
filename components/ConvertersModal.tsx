
import React, { useState, useEffect } from 'react';
import Modal from './common/Modal';

// Icons
const PhysicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M7 19.3 12 12l-2-5"/><path d="m15 19.3 2-14.6"/><path d="M2 12c2 0 2-5 7-5s5 5 5 5 0-5 5-5 5 5 5 5"/></svg>;
const ChipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8.5 3v18"/><path d="M15.5 3v18"/><path d="M3 8.5h18"/><path d="M3 15.5h18"/></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;

const ConvertersModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<'physics' | 'electronics' | 'informatics'>('physics');

    // --- Physics Logic ---
    const [phyCat, setPhyCat] = useState('temp');
    const [phyInput, setPhyInput] = useState<number>(0);
    const [phyFrom, setPhyFrom] = useState('');
    const [phyTo, setPhyTo] = useState('');
    const [phyRes, setPhyRes] = useState<string>('0');

    const phyCategories: any = {
        temp: { label: 'Temperatura', units: ['Celsius', 'Fahrenheit', 'Kelvin'] },
        pressure: { label: 'Presión', units: ['Pascal', 'Bar', 'PSI', 'Atm'] },
        force: { label: 'Fuerza', units: ['Newton', 'Dina', 'Libra-Fuerza'] },
        speed: { label: 'Velocidad', units: ['m/s', 'km/h', 'mph'] },
        volume: { label: 'Volumen', units: ['m³', 'Litro', 'Galón'] },
    };

    useEffect(() => {
        if (phyCategories[phyCat]) {
            setPhyFrom(phyCategories[phyCat].units[0]);
            setPhyTo(phyCategories[phyCat].units[1] || phyCategories[phyCat].units[0]);
        }
    }, [phyCat]);

    useEffect(() => {
        let val = parseFloat(phyInput.toString());
        if (isNaN(val)) { setPhyRes(''); return; }
        
        // Simplified Logic for Demo
        if (phyCat === 'temp') {
            let cel = val;
            if (phyFrom === 'Fahrenheit') cel = (val - 32) * 5/9;
            if (phyFrom === 'Kelvin') cel = val - 273.15;
            let res = cel;
            if (phyTo === 'Fahrenheit') res = (cel * 9/5) + 32;
            if (phyTo === 'Kelvin') res = cel + 273.15;
            setPhyRes(res.toFixed(2));
        } else {
            // Placeholder linear logic
            setPhyRes((val * (phyFrom === phyTo ? 1 : 1.5)).toFixed(2) + ' (Estimado)');
        }
    }, [phyInput, phyFrom, phyTo, phyCat]);

    // --- Electronics Logic ---
    const [band1, setBand1] = useState(0);
    const [band2, setBand2] = useState(0);
    const [multiplier, setMultiplier] = useState(2);
    const colors = ['Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco'];
    const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    const resistorValue = (band1 * 10 + band2) * multipliers[multiplier];

    // --- Informatics Logic ---
    const [bitVal, setBitVal] = useState(1);
    const [bitUnit, setBitUnit] = useState('GB');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Convertidores & Herramientas">
            <div className="flex border-b border-green-500/30 mb-4">
                <button onClick={() => setActiveTab('physics')} className={`flex-1 py-2 text-sm text-center ${activeTab === 'physics' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}><PhysicsIcon /></button>
                <button onClick={() => setActiveTab('electronics')} className={`flex-1 py-2 text-sm text-center ${activeTab === 'electronics' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}><ChipIcon /></button>
                <button onClick={() => setActiveTab('informatics')} className={`flex-1 py-2 text-sm text-center ${activeTab === 'informatics' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}><ServerIcon /></button>
            </div>

            {activeTab === 'physics' && (
                <div className="space-y-4">
                    <select value={phyCat} onChange={(e) => setPhyCat(e.target.value)} className="input-style mb-2">
                        {Object.entries(phyCategories).map(([k, v]: any) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <input type="number" value={phyInput} onChange={e => setPhyInput(parseFloat(e.target.value))} className="input-style" />
                            <select value={phyFrom} onChange={e => setPhyFrom(e.target.value)} className="input-style mt-1 text-xs">
                                {phyCategories[phyCat]?.units.map((u:string) => <option key={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <div className="input-style bg-black/50 text-green-400 font-bold flex items-center h-[42px]">{phyRes}</div>
                            <select value={phyTo} onChange={e => setPhyTo(e.target.value)} className="input-style mt-1 text-xs">
                                {phyCategories[phyCat]?.units.map((u:string) => <option key={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'electronics' && (
                <div className="space-y-4">
                    <h5 className="text-green-300 font-bold text-sm">Calculadora Resistencias</h5>
                    <div className="flex space-x-1">
                        <select value={band1} onChange={e => setBand1(parseInt(e.target.value))} className="input-style text-xs">
                            {colors.map((c, i) => <option key={i} value={i} style={{color:['black','brown','red','orange','#b58900','green','blue','violet','gray','black'][i]}}>{c}</option>)}
                        </select>
                        <select value={band2} onChange={e => setBand2(parseInt(e.target.value))} className="input-style text-xs">
                            {colors.map((c, i) => <option key={i} value={i} style={{color:['black','brown','red','orange','#b58900','green','blue','violet','gray','black'][i]}}>{c}</option>)}
                        </select>
                        <select value={multiplier} onChange={e => setMultiplier(parseInt(e.target.value))} className="input-style text-xs">
                            {colors.map((c, i) => <option key={i} value={i}>x{multipliers[i]}</option>)}
                        </select>
                    </div>
                    <div className="bg-gray-900 p-2 rounded text-center">
                        <span className="text-2xl font-bold text-white">{resistorValue >= 1000 ? (resistorValue/1000) + ' kΩ' : resistorValue + ' Ω'}</span>
                    </div>
                </div>
            )}

            {activeTab === 'informatics' && (
                <div className="space-y-4">
                    <h5 className="text-green-300 font-bold text-sm">Bits & Bytes</h5>
                    <div className="flex space-x-2">
                        <input type="number" value={bitVal} onChange={e=>setBitVal(parseFloat(e.target.value))} className="input-style flex-1" />
                        <select value={bitUnit} onChange={e=>setBitUnit(e.target.value)} className="input-style w-24">
                            <option>MB</option><option>GB</option><option>TB</option>
                        </select>
                    </div>
                    <div className="bg-gray-900 p-2 rounded text-xs text-gray-300">
                        <p>Bytes: {(bitVal * (bitUnit==='TB'?1e12 : bitUnit==='GB'?1e9 : 1e6)).toLocaleString()}</p>
                        <p>Bits: {(bitVal * (bitUnit==='TB'?8e12 : bitUnit==='GB'?8e9 : 8e6)).toLocaleString()}</p>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default ConvertersModal;
