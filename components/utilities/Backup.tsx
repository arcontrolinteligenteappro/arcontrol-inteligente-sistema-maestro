
import React from 'react';
import * as mockData from '../../data/mockData';

const Backup: React.FC = () => {

    // Helper to convert array of objects to CSV string
    const convertToCSV = (objArray: any[]) => {
        if (!objArray || objArray.length === 0) return '';
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        
        // Header row
        const header = Object.keys(array[0]).join(',');
        str += header + '\r\n';

        // Data rows
        for (let i = 0; i < array.length; i++) {
            let line = '';
            for (const index in array[i]) {
                if (line !== '') line += ',';
                // Handle commas in data by quoting
                let cellData = array[i][index];
                if (typeof cellData === 'string') {
                    // Escape quotes and wrap in quotes if contains comma or quote
                    if (cellData.includes(',') || cellData.includes('"')) {
                        cellData = `"${cellData.replace(/"/g, '""')}"`;
                    }
                }
                // Handle objects inside cells (basic stringify)
                if (typeof cellData === 'object' && cellData !== null) {
                     cellData = `"${JSON.stringify(cellData).replace(/"/g, '""')}"`;
                }
                line += cellData;
            }
            str += line + '\r\n';
        }
        return str;
    };

    const downloadCSV = (data: any[], filename: string) => {
        const csvStr = convertToCSV(data);
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleExportJSON = () => {
        try {
            const dataToExport = {
                companyInfo: mockData.mockCompanyInfo,
                products: mockData.mockProducts,
                sales: mockData.mockSales,
                customers: mockData.mockCustomers,
                suppliers: mockData.mockSuppliers,
                employees: mockData.mockEmployees,
                payments: mockData.mockPayments,
                supplierPayments: mockData.mockSupplierPayments,
                expenses: mockData.mockExpenses,
                income: mockData.mockIncome,
                wastage: mockData.mockWastage,
                memberships: mockData.mockMemberships,
                timestamp: new Date().toISOString()
            };
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `arcontrol_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('Copia de seguridad (JSON) generada exitosamente.');

        } catch (error) {
            console.error("Error al generar la copia de seguridad:", error);
            alert('Ocurrió un error al generar la copia de seguridad.');
        }
    };

    // Improved CSV parser to handle quotes and newlines
    const csvToJSON = (csv: string) => {
        const lines = csv.split(/\r\n|\n/);
        const result = [];
        const headers = lines[0].split(',').map(h => h.trim());
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const row = lines[i];
            const fields: string[] = [];
            let inQuote = false;
            let field = '';
            
            for (let j = 0; j < row.length; j++) {
                const char = row[j];
                if (char === '"') {
                    if (j + 1 < row.length && row[j + 1] === '"') {
                        // Handle escaped quote
                        field += '"';
                        j++; 
                    } else {
                        // Toggle quote state
                        inQuote = !inQuote;
                    }
                } else if (char === ',' && !inQuote) {
                    fields.push(field);
                    field = '';
                } else {
                    field += char;
                }
            }
            fields.push(field); // Push last field

            const obj: any = {};
            for (let j = 0; j < headers.length; j++) {
                if (fields[j] !== undefined) {
                    let val = fields[j];
                    // Attempt to parse JSON strings back to objects if they look like it
                    if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
                        try {
                            val = JSON.parse(val);
                        } catch (e) {
                            // Keep as string if parse fails
                        }
                    }
                    obj[headers[j]] = val;
                }
            }
            result.push(obj);
        }
        return result;
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                if (file.name.endsWith('.json')) {
                     try {
                        const json = JSON.parse(text);
                        console.log("Imported JSON:", json);
                        alert(`Archivo JSON cargado. Datos encontrados: ${Object.keys(json).join(', ')}.`);
                     } catch(err) {
                         alert("Error al leer JSON.");
                     }
                } else if (file.name.endsWith('.csv')) {
                    const jsonData = csvToJSON(text);
                    console.log("Imported CSV Data:", jsonData);
                    alert(`Archivo CSV cargado. ${jsonData.length} registros encontrados. Revisa la consola para ver los datos.`);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-black/50 p-6 rounded-lg text-gray-300 space-y-8 view-enter">
            <div>
                <h3 className="text-xl font-semibold text-green-300">Exportar Datos (Respaldo Completo)</h3>
                <p className="text-gray-400 mt-2 text-sm">
                    Crea una copia de seguridad completa de todos los datos en formato JSON (formato nativo) para restaurar el sistema.
                </p>
                <button onClick={handleExportJSON} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md">
                    Generar Respaldo JSON
                </button>
            </div>

            <div className="border-t border-green-500/20 pt-8">
                <h3 className="text-xl font-semibold text-blue-300">Exportar Catálogos a Excel</h3>
                <p className="text-gray-400 mt-2 text-sm">
                    Descarga tablas individuales en formato compatible con Excel (.csv) para su análisis externo o edición.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => downloadCSV(mockData.mockCustomers, 'clientes.csv')} className="px-3 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 rounded hover:bg-blue-800 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Clientes (Excel)
                    </button>
                    <button onClick={() => downloadCSV(mockData.mockProducts, 'productos.csv')} className="px-3 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 rounded hover:bg-blue-800 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Productos (Excel)
                    </button>
                    <button onClick={() => downloadCSV(mockData.mockSales, 'ventas.csv')} className="px-3 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 rounded hover:bg-blue-800 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Ventas (Excel)
                    </button>
                     <button onClick={() => downloadCSV(mockData.mockMemberships, 'membresias.csv')} className="px-3 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-200 rounded hover:bg-blue-800 transition-colors flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Licencias (Excel)
                    </button>
                </div>
            </div>

             <div className="border-t border-green-500/20 pt-8">
                <h3 className="text-xl font-semibold text-red-400">Importar Datos</h3>
                <p className="text-gray-400 mt-2 text-sm">
                    Restaura tu aplicación desde un archivo de copia de seguridad (JSON) o importa catálogos editados en Excel (.csv).
                </p>
                 <label htmlFor="import-file" className="mt-4 cursor-pointer inline-block px-4 py-2 bg-red-900/50 border border-red-500/50 text-white rounded-lg hover:bg-red-800 transition-all shadow-md">
                    Seleccionar Archivo (JSON o Excel CSV)
                    <input type="file" id="import-file" className="sr-only" onChange={handleImport} accept=".json,.csv" />
                 </label>
            </div>
        </div>
    );
};

export default Backup;
