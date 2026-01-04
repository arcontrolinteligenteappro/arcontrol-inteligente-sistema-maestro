
import React, { useState, useEffect, useRef, useMemo } from 'react';

// --- ICONS ---
const PhysicsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M7 19.3 12 12l-2-5"/><path d="m15 19.3 2-14.6"/><path d="M2 12c2 0 2-5 7-5s5 5 5 5 0-5 5-5 5 5 5 5"/></svg>;
const ChipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8.5 3v18"/><path d="M15.5 3v18"/><path d="M3 8.5h18"/><path d="M3 15.5h18"/></svg>;
const ServerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>;
const SensorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
const LogisticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;

// ==========================================
// 1. MECÁNICA & FÍSICA (Universal Mechanic Converter)
// ==========================================
const PhysicsTools = () => {
    const [category, setCategory] = useState('torque');
    const [input, setInput] = useState<string>('');
    const [fromUnit, setFromUnit] = useState('');
    const [toUnit, setToUnit] = useState('');
    const [result, setResult] = useState<string>('0');

    // Data Structure for Conversions
    // Factor: Multiplier to convert FROM base unit TO this unit. 
    // To convert FROM unit A to Base: Value / FactorA
    // To convert FROM Base to unit B: Value * FactorB
    // Exception: Temperature uses formulas.
    const conversionData: Record<string, { label: string, units: Record<string, number> }> = {
        torque: {
            label: 'Par de Apriete (Torque)',
            units: {
                'N·m (Newton Metro)': 1, // Base
                'ft·lb (Pie Libra)': 0.737562,
                'in·lb (Pulgada Libra)': 8.85075,
                'kg·m (Kilogramo Metro)': 0.101972,
                'kg·cm (Kilogramo Centímetro)': 10.19716
            }
        },
        pressure: {
            label: 'Presión (Neumáticos/Fluidos)',
            units: {
                'PSI (Libra/pulg²)': 1, // Base
                'Bar': 0.0689476,
                'kPa (Kilopascal)': 6.89476,
                'kg/cm² (Atm Técnica)': 0.070307,
                'Atm (Atmósfera)': 0.068046
            }
        },
        power: {
            label: 'Potencia Motor',
            units: {
                'kW (Kilowatt)': 1, // Base
                'HP (Horsepower - Mecánico)': 1.34102,
                'CV / PS (Caballo Vapor)': 1.35962,
                'W (Watt)': 1000
            }
        },
        volume: {
            label: 'Volumen (Fluidos/Aceite)',
            units: {
                'Litro (L)': 1, // Base
                'Mililitro (mL)': 1000,
                'Galón (US)': 0.264172,
                'Cuarto (US qt)': 1.05669,
                'Pinta (US pt)': 2.11338,
                'Onza Líquida (US fl oz)': 33.814,
                'Galón (UK)': 0.219969
            }
        },
        length: {
            label: 'Longitud / Distancia',
            units: {
                'Metro (m)': 1, // Base
                'Kilómetro (km)': 0.001,
                'Centímetro (cm)': 100,
                'Milímetro (mm)': 1000,
                'Milla (mi)': 0.000621371,
                'Yarda (yd)': 1.09361,
                'Pie (ft)': 3.28084,
                'Pulgada (in)': 39.3701
            }
        },
        weight: {
            label: 'Masa / Peso',
            units: {
                'Kilogramo (kg)': 1, // Base
                'Gramo (g)': 1000,
                'Tonelada Métrica (t)': 0.001,
                'Libra (lb)': 2.20462,
                'Onza (oz)': 35.274
            }
        },
        speed: {
            label: 'Velocidad',
            units: {
                'km/h': 1, // Base
                'mph (Milla por hora)': 0.621371,
                'm/s (Metro por segundo)': 0.277778,
                'Nudo (kn)': 0.539957
            }
        },
        temp: {
            label: 'Temperatura',
            units: {
                'Celsius (°C)': 1,
                'Fahrenheit (°F)': 2,
                'Kelvin (K)': 3
            } // Logic handled separately
        }
    };

    // Update selectors when category changes
    useEffect(() => {
        const units = Object.keys(conversionData[category].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
    }, [category]);

    // Conversion Logic
    useEffect(() => {
        const val = parseFloat(input);
        if (isNaN(val) || input === '') {
            setResult('---');
            return;
        }

        if (category === 'temp') {
            let cel = 0;
            // To Celsius
            if (fromUnit === 'Celsius (°C)') cel = val;
            else if (fromUnit === 'Fahrenheit (°F)') cel = (val - 32) * 5 / 9;
            else if (fromUnit === 'Kelvin (K)') cel = val - 273.15;

            // From Celsius to Target
            let res = 0;
            if (toUnit === 'Celsius (°C)') res = cel;
            else if (toUnit === 'Fahrenheit (°F)') res = (cel * 9 / 5) + 32;
            else if (toUnit === 'Kelvin (K)') res = cel + 273.15;
            
            setResult(res.toFixed(2));
        } else {
            // Linear Conversion
            // 1. Normalize to Base: Value / Factor_From
            // 2. Convert to Target: Normalized * Factor_To
            
            const factors = conversionData[category].units;
            const factorFrom = factors[fromUnit];
            const factorTo = factors[toUnit];

            // Formula: (Value / FactorFrom) * FactorTo
            // Example Torque: 100 ft-lb to Nm. 
            // Base Nm. Factor ft-lb = 0.737. 
            // 100 ft-lb / 0.737 = 135.5 Nm. 
            // Correct.
            
            const res = (val / factorFrom) * factorTo;
            
            // Format logic based on magnitude
            if (res > 10000) setResult(res.toExponential(4));
            else if (Math.abs(res) < 0.001 && res !== 0) setResult(res.toExponential(4));
            else setResult(res.toLocaleString('en-US', { maximumFractionDigits: 4 }));
        }
    }, [input, fromUnit, toUnit, category]);

    const swapUnits = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-green-300">Conversor Universal Mecánica</h3>
                <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded border border-green-500/30">Auto/Industrial</span>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2 block">Tipo de Medida</label>
                    <select 
                        value={category} 
                        onChange={(e) => { setCategory(e.target.value); setInput(''); setResult('0'); }} 
                        className="input-style bg-gray-900 border-green-500/40 text-white font-bold"
                    >
                        {Object.entries(conversionData).map(([key, val]) => (
                            <option key={key} value={key}>{val.label}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-gray-700 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                    {/* FROM */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">De:</label>
                        <input 
                            type="number" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            className="input-style text-xl font-mono text-white" 
                            placeholder="0.00"
                        />
                        <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-style text-sm">
                            {Object.keys(conversionData[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>

                    {/* SWAP */}
                    <div className="flex justify-center pt-6">
                        <button onClick={swapUnits} className="p-2 bg-gray-800 rounded-full hover:bg-green-600 hover:text-white text-gray-400 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10h14l-4-4"/><path d="M17 14H3l4 4"/></svg>
                        </button>
                    </div>

                    {/* TO */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-500">A:</label>
                        <div className="input-style bg-green-900/20 border-green-500/50 text-green-300 font-mono text-xl flex items-center h-[46px] overflow-x-auto">
                            {result}
                        </div>
                        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input-style text-sm">
                            {Object.keys(conversionData[category].units).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Quick Reference Table for Mechanics */}
            {category === 'torque' && (
                <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-200">
                    <strong>Tip Mecánico:</strong> Para culatas y motores, usa siempre el torquímetro en la unidad especificada por el manual. 
                    <br/> Aprox: 10 Nm ≈ 7.4 ft-lb.
                </div>
            )}
             {category === 'pressure' && (
                <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded text-xs text-orange-200">
                    <strong>Tip Neumáticos:</strong> 1 Bar ≈ 14.5 PSI. La mayoría de autos turismo usan entre 30-35 PSI (2.0 - 2.4 Bar).
                </div>
            )}
        </div>
    );
};

// ==========================================
// 2. ELECTRÓNICA (Electronics Tools)
// ==========================================
const ElectronicsTools = () => {
    const [tool, setTool] = useState('resistor');
    
    // Resistor Logic
    const colors = ['Negro', 'Marrón', 'Rojo', 'Naranja', 'Amarillo', 'Verde', 'Azul', 'Violeta', 'Gris', 'Blanco'];
    const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];
    const [band1, setBand1] = useState(0);
    const [band2, setBand2] = useState(0);
    const [multiplier, setMultiplier] = useState(2); // x100
    const resistorValue = (band1 * 10 + band2) * multipliers[multiplier];

    // LED Logic
    const [sourceV, setSourceV] = useState(5);
    const [ledV, setLedV] = useState(2);
    const [ledI, setLedI] = useState(20);
    const ledR = (sourceV - ledV) / (ledI / 1000);

    // Capacitor / Reactance Logic
    const [freq, setFreq] = useState(60); // Hz
    const [capVal, setCapVal] = useState(10); // uF
    const [indVal, setIndVal] = useState(10); // mH
    const xc = 1 / (2 * Math.PI * freq * (capVal / 1000000));
    const xl = 2 * Math.PI * freq * (indVal / 1000);

    return (
        <div className="space-y-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                <button onClick={() => setTool('resistor')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${tool === 'resistor' ? 'bg-green-600' : 'bg-gray-800'}`}>Resistencias</button>
                <button onClick={() => setTool('ohm')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${tool === 'ohm' ? 'bg-green-600' : 'bg-gray-800'}`}>Ley de Ohm</button>
                <button onClick={() => setTool('led')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${tool === 'led' ? 'bg-green-600' : 'bg-gray-800'}`}>LEDs</button>
                <button onClick={() => setTool('reactance')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${tool === 'reactance' ? 'bg-green-600' : 'bg-gray-800'}`}>Reactancia</button>
                <button onClick={() => setTool('pinouts')} className={`px-3 py-1 rounded text-sm whitespace-nowrap ${tool === 'pinouts' ? 'bg-green-600' : 'bg-gray-800'}`}>Pinouts</button>
            </div>

            {tool === 'resistor' && (
                <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-4">Calculadora de Código de Colores (4 Bandas)</h4>
                    <div className="flex space-x-2 mb-4">
                        <div className="flex-1">
                            <label className="text-xs text-gray-400">Banda 1</label>
                            <select value={band1} onChange={e => setBand1(parseInt(e.target.value))} className="input-style">
                                {colors.map((c, i) => <option key={i} value={i}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs text-gray-400">Banda 2</label>
                             <select value={band2} onChange={e => setBand2(parseInt(e.target.value))} className="input-style">
                                {colors.map((c, i) => <option key={i} value={i}>{c}</option>)}
                            </select>
                        </div>
                         <div className="flex-1">
                            <label className="text-xs text-gray-400">Multiplicador</label>
                             <select value={multiplier} onChange={e => setMultiplier(parseInt(e.target.value))} className="input-style">
                                {colors.map((c, i) => <option key={i} value={i}>{c} (x{multipliers[i]})</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-900 rounded">
                        <p className="text-gray-400 text-sm">Resistencia:</p>
                        <p className="text-2xl font-bold text-white">{resistorValue >= 1000 ? (resistorValue/1000) + ' kΩ' : resistorValue + ' Ω'}</p>
                    </div>
                    <div className="mt-4 flex justify-center space-x-1">
                         <div className="w-8 h-20 rounded" style={{ backgroundColor: ['black','brown','red','orange','yellow','green','blue','violet','gray','white'][band1] }}></div>
                         <div className="w-8 h-20 rounded" style={{ backgroundColor: ['black','brown','red','orange','yellow','green','blue','violet','gray','white'][band2] }}></div>
                         <div className="w-8 h-20 rounded" style={{ backgroundColor: ['black','brown','red','orange','yellow','green','blue','violet','gray','white'][multiplier] }}></div>
                         <div className="w-8 h-20 rounded bg-yellow-600"></div>
                    </div>
                </div>
            )}

            {tool === 'ohm' && (
                <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-2">Ley de Ohm</h4>
                    <p className="text-xs text-gray-500 mb-4">Deja un campo vacío para calcularlo.</p>
                    {/* Reusing existing Ohm logic simplified */}
                    <div className="space-y-2">
                        <input type="number" placeholder="Voltaje (V)" className="input-style" id="ohm_v" />
                        <input type="number" placeholder="Corriente (A)" className="input-style" id="ohm_i" />
                        <input type="number" placeholder="Resistencia (Ω)" className="input-style" id="ohm_r" />
                        <button onClick={() => {
                             const v = parseFloat((document.getElementById('ohm_v') as HTMLInputElement).value);
                             const i = parseFloat((document.getElementById('ohm_i') as HTMLInputElement).value);
                             const r = parseFloat((document.getElementById('ohm_r') as HTMLInputElement).value);
                             if(isNaN(v) && !isNaN(i) && !isNaN(r)) (document.getElementById('ohm_v') as HTMLInputElement).value = (i*r).toString();
                             if(!isNaN(v) && isNaN(i) && !isNaN(r)) (document.getElementById('ohm_i') as HTMLInputElement).value = (v/r).toString();
                             if(!isNaN(v) && !isNaN(i) && isNaN(r)) (document.getElementById('ohm_r') as HTMLInputElement).value = (v/i).toString();
                        }} className="w-full bg-green-700 text-white rounded py-2 mt-2">Calcular</button>
                    </div>
                </div>
            )}

            {tool === 'led' && (
                 <div className="bg-black/30 p-4 rounded border border-green-500/20">
                     <h4 className="font-bold text-green-300 mb-4">Calculadora Resistencia para LED</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400">Voltaje Fuente (V)</label>
                            <input type="number" value={sourceV} onChange={e=>setSourceV(parseFloat(e.target.value))} className="input-style" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Voltaje LED (V)</label>
                            <input type="number" value={ledV} onChange={e=>setLedV(parseFloat(e.target.value))} className="input-style" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs text-gray-400">Corriente LED (mA)</label>
                            <input type="number" value={ledI} onChange={e=>setLedI(parseFloat(e.target.value))} className="input-style" />
                        </div>
                     </div>
                     <div className="mt-4 text-center">
                         <p className="text-sm text-gray-400">Resistencia Necesaria:</p>
                         <p className="text-2xl font-bold text-green-400">{ledR > 0 ? Math.round(ledR) + ' Ω' : 'Error'}</p>
                         <p className="text-xs text-gray-500">Potencia: {((ledI/1000) * (sourceV - ledV)).toFixed(3)} W</p>
                     </div>
                 </div>
            )}

            {tool === 'reactance' && (
                <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-4">Cálculo de Reactancia</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <div><label className="text-xs text-gray-400">Frecuencia (Hz)</label><input type="number" value={freq} onChange={e=>setFreq(parseFloat(e.target.value))} className="input-style"/></div>
                        <div><label className="text-xs text-gray-400">Capacitor (uF)</label><input type="number" value={capVal} onChange={e=>setCapVal(parseFloat(e.target.value))} className="input-style"/></div>
                        <div><label className="text-xs text-gray-400">Inductor (mH)</label><input type="number" value={indVal} onChange={e=>setIndVal(parseFloat(e.target.value))} className="input-style"/></div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                        <div className="p-2 bg-gray-900 rounded">
                            <p className="text-xs text-gray-400">Capacitiva (Xc)</p>
                            <p className="font-bold text-blue-300">{xc.toFixed(2)} Ω</p>
                        </div>
                        <div className="p-2 bg-gray-900 rounded">
                            <p className="text-xs text-gray-400">Inductiva (Xl)</p>
                            <p className="font-bold text-orange-300">{xl.toFixed(2)} Ω</p>
                        </div>
                    </div>
                </div>
            )}

             {tool === 'pinouts' && (
                <div className="space-y-4 text-sm text-gray-300">
                    <div className="bg-gray-900 p-3 rounded">
                        <h5 className="font-bold text-green-400">USB 2.0 (Type A)</h5>
                        <ul className="list-disc pl-4 mt-2">
                            <li>Pin 1: VCC (+5V) - Red</li>
                            <li>Pin 2: D- (Data -) - White</li>
                            <li>Pin 3: D+ (Data +) - Green</li>
                            <li>Pin 4: GND (Ground) - Black</li>
                        </ul>
                    </div>
                    <div className="bg-gray-900 p-3 rounded">
                        <h5 className="font-bold text-green-400">IC 555 Timer</h5>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                            <div>1: GND</div><div>8: VCC</div>
                            <div>2: Trigger</div><div>7: Discharge</div>
                            <div>3: Output</div><div>6: Threshold</div>
                            <div>4: Reset</div><div>5: Control</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. INFORMÁTICA & CCTV (Informatics)
// ==========================================
const InformaticsTools = () => {
    const [subTool, setSubTool] = useState('cctv');

    // Units
    const [val, setVal] = useState(1);
    const [unit, setUnit] = useState('GB');

    // CCTV Enhanced State
    const [cctvCams, setCctvCams] = useState(4);
    const [cctvDays, setCctvDays] = useState(30);
    const [cctvRes, setCctvRes] = useState('1080p');
    const [cctvFps, setCctvFps] = useState(15);
    const [cctvCodec, setCctvCodec] = useState('h265');
    const [cctvScene, setCctvScene] = useState('medium'); // Low, Medium, High complexity
    const [cctvQuality, setCctvQuality] = useState('medium'); // Bitrate quality multiplier

    // Results State
    const [storageResult, setStorageResult] = useState({ totalGB: 0, totalTB: 0, bandwidthMbps: 0 });

    useEffect(() => {
        // Calculation Logic for CCTV
        // Base Bitrate reference (H.264 @ 15fps, Medium Quality) per camera in Kbps
        const baseBitrates: Record<string, number> = {
            '720p': 1024,   // 1MP
            '1080p': 2048,  // 2MP
            '3mp': 3072,    // 3MP
            '4mp': 4096,    // 4MP (2K)
            '5mp': 5120,    // 5MP
            '8mp': 8192     // 8MP (4K)
        };

        // Modifiers
        const codecModifiers: Record<string, number> = { 'h264': 1.0, 'h265': 0.5, 'h265+': 0.35, 'mjpeg': 2.5 };
        const fpsModifiers = cctvFps / 15; // Normalize to 15fps base
        const sceneModifiers: Record<string, number> = { 'low': 0.8, 'medium': 1.0, 'high': 1.5 }; // Lente/Escena impact
        const qualityModifiers: Record<string, number> = { 'low': 0.8, 'medium': 1.0, 'high': 1.3 };

        const base = baseBitrates[cctvRes] || 2048;
        const bitratePerCamKbps = base * codecModifiers[cctvCodec] * fpsModifiers * sceneModifiers[cctvScene] * qualityModifiers[cctvQuality];
        
        const totalBitrateMbps = (bitratePerCamKbps * cctvCams) / 1000;
        
        // Storage: (Bitrate(Mbps) / 8) * seconds * days
        const totalStorageMB = (totalBitrateMbps / 8) * 3600 * 24 * cctvDays;
        const totalStorageGB = totalStorageMB / 1024;
        const totalStorageTB = totalStorageGB / 1024;

        setStorageResult({
            totalGB: parseFloat(totalStorageGB.toFixed(2)),
            totalTB: parseFloat(totalStorageTB.toFixed(2)),
            bandwidthMbps: parseFloat(totalBitrateMbps.toFixed(2))
        });

    }, [cctvCams, cctvDays, cctvRes, cctvFps, cctvCodec, cctvScene, cctvQuality]);

    const handleExportCCTV = () => {
        const text = `
REPORTE DE CÁLCULO DE ALMACENAMIENTO CCTV
-----------------------------------------
Fecha: ${new Date().toLocaleDateString()}

PARÁMETROS:
- Cámaras: ${cctvCams}
- Días de Grabación: ${cctvDays} (24h)
- Resolución: ${cctvRes.toUpperCase()}
- Velocidad: ${cctvFps} FPS
- Compresión: ${cctvCodec.toUpperCase()}
- Escena/Complejidad: ${cctvScene.toUpperCase()}
- Calidad de Imagen: ${cctvQuality.toUpperCase()}

RESULTADOS ESTIMADOS:
- Ancho de Banda Total: ${storageResult.bandwidthMbps} Mbps
- Almacenamiento Requerido: ${storageResult.totalTB} TB (${storageResult.totalGB} GB)

DISCO DURO RECOMENDADO:
${storageResult.totalTB <= 1 ? '1 TB (Vigilancia)' : 
  storageResult.totalTB <= 2 ? '2 TB (Vigilancia)' : 
  storageResult.totalTB <= 4 ? '4 TB (Purple/Skyhawk)' : 
  storageResult.totalTB <= 8 ? '8 TB (Enterprise/Surveillance)' : 
  Math.ceil(storageResult.totalTB) + ' TB (Arreglo RAID recomendado)'}
        `;
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calculo_cctv_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Internet speed calc
    const [fileSizeGB, setFileSizeGB] = useState(10);
    const [speedMbps, setSpeedMbps] = useState(100);
    const downloadTimeSec = (fileSizeGB * 1024 * 8) / speedMbps;

    return (
         <div className="space-y-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 border-b border-green-500/20 mb-2">
                <button onClick={() => setSubTool('cctv')} className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${subTool === 'cctv' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Simulador CCTV</button>
                <button onClick={() => setSubTool('units')} className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${subTool === 'units' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Bits & Bytes</button>
                <button onClick={() => setSubTool('net')} className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${subTool === 'net' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>Redes</button>
            </div>

            {subTool === 'cctv' && (
                 <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                        Calculadora de Almacenamiento CCTV
                    </h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold"># Cámaras</label>
                            <input type="number" value={cctvCams} onChange={e=>setCctvCams(Math.max(1, parseInt(e.target.value)))} className="input-style"/>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Días Grabación</label>
                            <input type="number" value={cctvDays} onChange={e=>setCctvDays(Math.max(1, parseInt(e.target.value)))} className="input-style"/>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Resolución</label>
                            <select value={cctvRes} onChange={e=>setCctvRes(e.target.value)} className="input-style">
                                <option value="720p">720p (1MP)</option>
                                <option value="1080p">1080p (2MP)</option>
                                <option value="3mp">3MP</option>
                                <option value="4mp">4MP (2K)</option>
                                <option value="5mp">5MP</option>
                                <option value="8mp">8MP (4K)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">FPS</label>
                            <select value={cctvFps} onChange={e=>setCctvFps(parseInt(e.target.value))} className="input-style">
                                <option value="7">7 fps</option>
                                <option value="10">10 fps</option>
                                <option value="15">15 fps (Estándar)</option>
                                <option value="20">20 fps</option>
                                <option value="25">25 fps (Real)</option>
                                <option value="30">30 fps (Fluido)</option>
                                <option value="60">60 fps (Alto)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Codec</label>
                            <select value={cctvCodec} onChange={e=>setCctvCodec(e.target.value)} className="input-style">
                                <option value="h264">H.264 (AVC)</option>
                                <option value="h265">H.265 (HEVC)</option>
                                <option value="h265+">H.265+ / Ultra</option>
                                <option value="mjpeg">MJPEG (Legacy)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase text-gray-500 font-bold">Lente / Escena</label>
                            <select value={cctvScene} onChange={e=>setCctvScene(e.target.value)} className="input-style">
                                <option value="low">Bajo Movimiento (Pasillo/Almacén)</option>
                                <option value="medium">Estándar (Oficina/Casa)</option>
                                <option value="high">Alto Movimiento (Tráfico/Entrada)</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-900 border border-green-500/20 rounded flex flex-col justify-center items-center text-center">
                            <span className="text-xs text-gray-400 mb-1">Disco Duro Requerido</span>
                            <p className="text-3xl font-bold text-white font-mono">{storageResult.totalTB} TB</p>
                            <span className="text-xs text-green-500 font-mono">({storageResult.totalGB.toLocaleString()} GB)</span>
                        </div>
                        <div className="p-4 bg-gray-900 border border-blue-500/20 rounded flex flex-col justify-center items-center text-center">
                            <span className="text-xs text-gray-400 mb-1">Ancho de Banda Total</span>
                            <p className="text-2xl font-bold text-blue-300 font-mono">{storageResult.bandwidthMbps} Mbps</p>
                            <span className="text-[10px] text-gray-500 mt-1">Suficiente para switch 10/100 si &lt; 80 Mbps</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleExportCCTV}
                        className="w-full mt-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm transition-colors shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Exportar Cálculo (.txt)
                    </button>
                </div>
            )}

            {subTool === 'units' && (
                <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-2">Conversor de Almacenamiento</h4>
                    <div className="flex space-x-2 mb-4">
                        <input type="number" value={val} onChange={e=>setVal(parseFloat(e.target.value))} className="input-style flex-1" />
                        <select value={unit} onChange={e=>setUnit(e.target.value)} className="input-style w-24">
                            <option>MB</option><option>GB</option><option>TB</option>
                        </select>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-300">
                        <li>Binary (IEC): {(val * (unit==='TB'?1024*1024*1024 : unit==='GB'?1024*1024 : 1024) / 1024).toFixed(2)} KiB</li>
                        <li>Bits: {(val * (unit==='TB'?8e12 : unit==='GB'?8e9 : 8e6)).toExponential(2)} bits</li>
                        <li>Bytes: {(val * (unit==='TB'?1e12 : unit==='GB'?1e9 : 1e6)).toLocaleString()} bytes</li>
                    </ul>
                </div>
            )}

             {subTool === 'net' && (
                 <div className="bg-black/30 p-4 rounded border border-green-500/20">
                    <h4 className="font-bold text-green-300 mb-2">Tiempo de Transferencia</h4>
                    <div className="space-y-2">
                        <div><label className="text-xs text-gray-400">Tamaño Archivo (GB)</label><input type="number" value={fileSizeGB} onChange={e=>setFileSizeGB(parseFloat(e.target.value))} className="input-style"/></div>
                        <div><label className="text-xs text-gray-400">Velocidad Internet (Mbps)</label><input type="number" value={speedMbps} onChange={e=>setSpeedMbps(parseFloat(e.target.value))} className="input-style"/></div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-400">Tasa real: {(speedMbps/8).toFixed(2)} MB/s</p>
                        <p className="text-sm text-green-400 font-bold mt-1">Tiempo estimado: {downloadTimeSec < 60 ? downloadTimeSec.toFixed(0) + ' seg' : (downloadTimeSec/60).toFixed(1) + ' min'}</p>
                    </div>
                </div>
            )}
         </div>
    );
};

// ==========================================
// 4. SENSORES (Sensors Tools)
// ==========================================
const SensorTools = () => {
    const [activeSensor, setActiveSensor] = useState<string | null>(null);
    const [sensorData, setSensorData] = useState<any>(null);
    const [error, setError] = useState<string>('');

    // --- Flashlight ---
    const toggleFlashlight = async () => {
        try {
            // @ts-ignore
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', advanced: [{ torch: true }] } });
            const track = stream.getVideoTracks()[0];
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ torch: !activeSensor }] });
            setActiveSensor(activeSensor === 'torch' ? null : 'torch');
            // Clean up stream if turning off? Usually keep track active. 
            if(activeSensor === 'torch') {
                track.stop();
                setActiveSensor(null);
            } else {
                setActiveSensor('torch');
            }
        } catch (e) {
            setError('No se pudo acceder a la linterna o no es compatible.');
        }
    };

    // --- Compass ---
    useEffect(() => {
        if (activeSensor === 'compass') {
            const handleOrientation = (e: DeviceOrientationEvent) => {
                setSensorData(e.alpha ? Math.round(e.alpha) : 0);
            };
            window.addEventListener('deviceorientation', handleOrientation);
            return () => window.removeEventListener('deviceorientation', handleOrientation);
        }
    }, [activeSensor]);

    // --- Sound Meter (Decibels) ---
    const audioContextRef = useRef<AudioContext | null>(null);
    useEffect(() => {
        if (activeSensor === 'sound') {
            const startAudio = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const source = audioContextRef.current.createMediaStreamSource(stream);
                    const analyser = audioContextRef.current.createAnalyser();
                    analyser.fftSize = 256;
                    source.connect(analyser);
                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);
                    
                    const updateVolume = () => {
                        if(activeSensor !== 'sound') return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for(let i=0; i<bufferLength; i++) sum += dataArray[i];
                        const average = sum / bufferLength;
                        setSensorData(Math.round(average)); // Crude approx of volume
                        requestAnimationFrame(updateVolume);
                    };
                    updateVolume();
                } catch(e) { setError('Micrófono no disponible.'); }
            };
            startAudio();
            return () => { if(audioContextRef.current) audioContextRef.current.close(); }
        }
    }, [activeSensor]);

    // --- Speedometer (GPS) ---
    useEffect(() => {
        if(activeSensor === 'speed') {
            const id = navigator.geolocation.watchPosition(
                (pos) => {
                    const speedMps = pos.coords.speed || 0;
                    setSensorData((speedMps * 3.6).toFixed(1)); // Convert m/s to km/h
                },
                (err) => setError('GPS no disponible.'),
                { enableHighAccuracy: true }
            );
            return () => navigator.geolocation.clearWatch(id);
        }
    }, [activeSensor]);


    return (
        <div className="grid grid-cols-2 gap-4">
            <button onClick={toggleFlashlight} className={`p-4 rounded-lg border border-green-500/30 flex flex-col items-center ${activeSensor === 'torch' ? 'bg-green-600 text-white' : 'bg-black/40 text-gray-300'}`}>
                <span className="text-2xl mb-2">🔦</span>
                <span className="text-sm font-bold">Linterna</span>
            </button>

            <button onClick={() => { setActiveSensor('compass'); setError(''); }} className={`p-4 rounded-lg border border-green-500/30 flex flex-col items-center ${activeSensor === 'compass' ? 'bg-green-900/50 border-green-400' : 'bg-black/40 text-gray-300'}`}>
                <span className="text-2xl mb-2">🧭</span>
                <span className="text-sm font-bold">Brújula</span>
                {activeSensor === 'compass' && <span className="text-xl font-mono mt-2 text-green-400">{sensorData || 0}°</span>}
            </button>

            <button onClick={() => { setActiveSensor('sound'); setError(''); }} className={`p-4 rounded-lg border border-green-500/30 flex flex-col items-center ${activeSensor === 'sound' ? 'bg-green-900/50 border-green-400' : 'bg-black/40 text-gray-300'}`}>
                <span className="text-2xl mb-2">🔊</span>
                <span className="text-sm font-bold">Sonómetro</span>
                {activeSensor === 'sound' && (
                    <div className="w-full mt-2">
                         <span className="text-xl font-mono text-green-400 block text-center">~{sensorData || 0} dB</span>
                         <div className="h-2 bg-gray-700 rounded mt-1 overflow-hidden">
                             <div className="h-full bg-green-500 transition-all duration-75" style={{ width: `${Math.min(100, (sensorData || 0))}%` }}></div>
                         </div>
                    </div>
                )}
            </button>

             <button onClick={() => { setActiveSensor('speed'); setError(''); }} className={`p-4 rounded-lg border border-green-500/30 flex flex-col items-center ${activeSensor === 'speed' ? 'bg-green-900/50 border-green-400' : 'bg-black/40 text-gray-300'}`}>
                <span className="text-2xl mb-2">🚀</span>
                <span className="text-sm font-bold">Velocímetro</span>
                 {activeSensor === 'speed' && <span className="text-xl font-mono mt-2 text-green-400">{sensorData || 0} km/h</span>}
            </button>

            {error && <div className="col-span-2 text-red-400 text-xs text-center mt-2">{error}</div>}
        </div>
    );
};

// ==========================================
// 5. LOGISTICS (New)
// ==========================================
const LogisticsTools = () => {
    // Volumetric Weight State
    const [dims, setDims] = useState({ l: 0, w: 0, h: 0 }); // cm
    const [factor, setFactor] = useState(5000); // Default Air Freight
    
    const volWeight = (dims.l * dims.w * dims.h) / factor;

    return (
        <div className="space-y-6">
            <div className="bg-black/30 p-4 rounded border border-green-500/20">
                <h4 className="font-bold text-green-300 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    Calculadora Peso Volumétrico
                </h4>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div>
                        <label className="text-xs text-gray-400">Largo (cm)</label>
                        <input type="number" value={dims.l} onChange={e => setDims({...dims, l: parseFloat(e.target.value)})} className="input-style" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Ancho (cm)</label>
                        <input type="number" value={dims.w} onChange={e => setDims({...dims, w: parseFloat(e.target.value)})} className="input-style" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400">Alto (cm)</label>
                        <input type="number" value={dims.h} onChange={e => setDims({...dims, h: parseFloat(e.target.value)})} className="input-style" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-xs text-gray-400">Factor Divisor (Estándar)</label>
                    <select value={factor} onChange={e => setFactor(parseInt(e.target.value))} className="input-style">
                        <option value="5000">5000 (Aéreo Estándar / IATA)</option>
                        <option value="4000">4000 (Terrestre / Paquetería)</option>
                        <option value="6000">6000 (Algunos Couriers)</option>
                    </select>
                </div>

                <div className="p-4 bg-gray-900 rounded text-center border border-green-500/30">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Peso Volumétrico</p>
                    <p className="text-3xl font-bold text-white font-mono">{volWeight ? volWeight.toFixed(2) : '0.00'} <span className="text-sm text-green-500">kg</span></p>
                    <p className="text-[10px] text-gray-500 mt-2">Fórmula: (L x A x H) / {factor}</p>
                </div>
            </div>
        </div>
    );
};


// ==========================================
// MAIN COMPONENT
// ==========================================
const Toolbox: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'physics' | 'electronics' | 'informatics' | 'sensors' | 'logistics'>('physics');

    const renderContent = () => {
        switch(activeTab) {
            case 'physics': return <PhysicsTools />;
            case 'electronics': return <ElectronicsTools />;
            case 'informatics': return <InformaticsTools />;
            case 'sensors': return <SensorTools />;
            case 'logistics': return <LogisticsTools />;
            default: return null;
        }
    };

    return (
        <div className="bg-black/50 rounded-lg text-gray-300 overflow-hidden">
            <div className="flex border-b border-green-500/30 overflow-x-auto">
                <button onClick={() => setActiveTab('physics')} className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors ${activeTab === 'physics' ? 'bg-green-900/50 text-green-300 border-b-2 border-green-400' : 'hover:bg-green-900/20'}`}>
                    <div className="flex flex-col items-center"><PhysicsIcon /><span className="mt-1 text-[10px]">Mecánica</span></div>
                </button>
                <button onClick={() => setActiveTab('electronics')} className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors ${activeTab === 'electronics' ? 'bg-green-900/50 text-green-300 border-b-2 border-green-400' : 'hover:bg-green-900/20'}`}>
                    <div className="flex flex-col items-center"><ChipIcon /><span className="mt-1 text-[10px]">Electrónica</span></div>
                </button>
                <button onClick={() => setActiveTab('informatics')} className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors ${activeTab === 'informatics' ? 'bg-green-900/50 text-green-300 border-b-2 border-green-400' : 'hover:bg-green-900/20'}`}>
                    <div className="flex flex-col items-center"><ServerIcon /><span className="mt-1 text-[10px]">Informática</span></div>
                </button>
                <button onClick={() => setActiveTab('sensors')} className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors ${activeTab === 'sensors' ? 'bg-green-900/50 text-green-300 border-b-2 border-green-400' : 'hover:bg-green-900/20'}`}>
                    <div className="flex flex-col items-center"><SensorIcon /><span className="mt-1 text-[10px]">Sensores</span></div>
                </button>
                <button onClick={() => setActiveTab('logistics')} className={`flex-1 min-w-[80px] py-3 text-sm font-medium transition-colors ${activeTab === 'logistics' ? 'bg-green-900/50 text-green-300 border-b-2 border-green-400' : 'hover:bg-green-900/20'}`}>
                    <div className="flex flex-col items-center"><LogisticsIcon /><span className="mt-1 text-[10px]">Logística</span></div>
                </button>
            </div>
            <div className="p-6 min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default Toolbox;
