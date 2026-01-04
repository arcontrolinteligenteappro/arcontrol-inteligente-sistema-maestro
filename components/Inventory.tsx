
import React, { useState, useMemo } from 'react';
import Header from './Header';
import Table from './common/Table';
import type { Product, CompanyInfo } from '../types';
import { mockProducts, mockCompanyInfo } from '../data/mockData';
import ProductForm from './ProductForm';
import BarcodeScanner from './common/BarcodeScanner';
import Modal from './common/Modal';

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [companyInfo] = useState<CompanyInfo>(() => {
        const saved = localStorage.getItem('companyInfo');
        return saved ? JSON.parse(saved) : mockCompanyInfo;
    });

    // Configurable threshold
    const LOW_STOCK_THRESHOLD = 10;

    const filteredProducts = useMemo(() => {
        if (!searchTerm) {
            return products;
        }
        return products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    // Inline Edit Handler
    const handleInlineUpdate = (id: string, field: keyof Product, value: string) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const numValue = parseFloat(value);
                // Validation
                if (field === 'stock' || field === 'price') {
                    if (isNaN(numValue)) return p; // Invalid number, do nothing
                    return { ...p, [field]: numValue };
                }
            }
            return p;
        }));
    };

    const getTypeBadge = (type: Product['productType']) => {
        const styles = {
            Producto: 'bg-blue-900/50 text-blue-300 border-blue-500/30',
            Servicio: 'bg-purple-900/50 text-purple-300 border-purple-500/30',
            'Materia Prima': 'bg-gray-700 text-gray-300 border-gray-500',
            'Manufacturado': 'bg-orange-900/50 text-orange-300 border-orange-500/30'
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[type]}`}>{type}</span>
    }

    const columns = [
        { header: 'Nombre', accessor: 'name' as keyof Product },
        { header: 'Tipo', accessor: 'productType' as keyof Product, render: (row: Product) => getTypeBadge(row.productType) },
        { header: 'SKU', accessor: 'sku' as keyof Product },
        { 
            header: 'Stock', 
            accessor: 'stock' as keyof Product, 
            render: (row: Product) => (
                <div className="flex items-center space-x-2">
                    {row.productType !== 'Servicio' ? (
                        <>
                            <input 
                                type="number" 
                                defaultValue={row.stock}
                                onBlur={(e) => handleInlineUpdate(row.id, 'stock', e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') e.currentTarget.blur() }}
                                className="bg-transparent border-b border-gray-700 focus:border-green-500 outline-none w-16 text-center text-sm hover:border-gray-500 transition-colors"
                            />
                            { (row.stock || 0) < LOW_STOCK_THRESHOLD && (
                                <span className="flex h-3 w-3 relative" title="Stock Bajo">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                            )}
                        </>
                    ) : <span className="text-gray-600 text-xs">N/A</span>}
                </div>
            )
        },
        { 
            header: 'Precio', 
            accessor: 'price' as keyof Product, 
            render: (row: Product) => (
                <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <input 
                        type="number" 
                        defaultValue={row.price}
                        onBlur={(e) => handleInlineUpdate(row.id, 'price', e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter') e.currentTarget.blur() }}
                        className="bg-transparent border-b border-gray-700 focus:border-green-500 outline-none w-20 text-right text-sm hover:border-gray-500 transition-colors font-mono"
                    />
                </div>
            )
        },
        { header: 'Categoría', accessor: 'category' as keyof Product },
    ];
    
    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const handleSaveProduct = (product: Product) => {
        if (editingProduct) {
            setProducts(products.map(p => p.id === product.id ? product : p));
        } else {
            setProducts([...products, { ...product, id: `P${Date.now()}` }]);
        }
        setIsFormOpen(false);
        setEditingProduct(null);
    };
    
    const renderActions = (product: Product) => (
        <button onClick={() => handleEdit(product)} className="text-green-400 hover:text-green-300 hover:underline">
            Editar
        </button>
    );

    const handleScan = (code: string) => {
        setSearchTerm(code);
        setIsScannerOpen(false);
    };

    return (
        <div>
            <Header title="Inventario y Servicios" />
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="relative w-full max-w-sm flex items-center">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-style w-full pl-10 pr-10"
                    />
                    <div className="absolute top-0 left-0 inline-flex items-center p-2 mt-1 ml-1 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        className="absolute right-0 top-0 bottom-0 px-3 text-gray-400 hover:text-green-400"
                        title="Escanear Código de Barras"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h3"/><path d="M20 7V4h-3"/><path d="M4 17v3h3"/><path d="M20 17v3h-3"/><line x1="4" y1="12" x2="20" y2="12"/></svg>
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsCatalogModalOpen(true)} className="px-4 py-2 bg-blue-900/50 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-800/50 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Catálogo PDF
                    </button>
                    <button onClick={() => { setEditingProduct(null); setIsFormOpen(true); }} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Nuevo
                    </button>
                </div>
            </div>
            
            <div className="bg-yellow-900/20 border border-yellow-500/20 p-2 rounded mb-4 flex items-center text-xs text-yellow-200">
                <span className="mr-2">💡</span>
                <span>Tip: Puedes editar el <strong>Stock</strong> y el <strong>Precio</strong> directamente haciendo clic en el número en la tabla.</span>
            </div>

            <Table columns={columns} data={filteredProducts} renderActions={renderActions} />
            
            <ProductForm 
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingProduct(null); }}
                onSave={handleSaveProduct}
                product={editingProduct}
            />

            <BarcodeScanner 
                isOpen={isScannerOpen} 
                onClose={() => setIsScannerOpen(false)} 
                onScan={handleScan} 
            />

            <CatalogExportModal 
                isOpen={isCatalogModalOpen}
                onClose={() => setIsCatalogModalOpen(false)}
                products={products}
                companyInfo={companyInfo}
            />
        </div>
    );
};

// --- Catalog Export Modal ---
const CatalogExportModal: React.FC<{
    isOpen: boolean; 
    onClose: () => void; 
    products: Product[]; 
    companyInfo: CompanyInfo 
}> = ({ isOpen, onClose, products, companyInfo }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<string>('All');

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ['All', ...Array.from(cats)];
    }, [products]);

    const handlePrintCatalog = () => {
        const printWindow = window.open('', '', 'height=800,width=800');
        if(!printWindow) return;

        const filtered = products.filter(p => {
            const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
            const typeMatch = selectedType === 'All' || p.productType === selectedType;
            return catMatch && typeMatch;
        });

        // HTML for the catalog
        const htmlContent = `
            <html>
            <head>
                <title>Catálogo - ${companyInfo.name}</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: sans-serif; -webkit-print-color-adjust: exact; }
                    .page-break { page-break-after: always; }
                    @media print { .no-print { display: none !important; } }
                </style>
            </head>
            <body class="bg-white text-gray-800 p-8">
                <!-- Header -->
                <div class="flex justify-between items-center border-b-2 border-gray-800 pb-4 mb-6">
                    <div class="flex items-center space-x-4">
                        ${companyInfo.logo ? `<img src="${companyInfo.logo}" class="h-20 w-20 object-contain" />` : ''}
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900">${companyInfo.name}</h1>
                            <p class="text-sm text-gray-600">${companyInfo.phone} | ${companyInfo.email}</p>
                            <p class="text-sm text-gray-600">${companyInfo.address}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <h2 class="text-2xl font-bold uppercase text-blue-900">CATÁLOGO DE PRODUCTOS</h2>
                        <p class="text-sm font-semibold">${selectedCategory !== 'All' ? selectedCategory.toUpperCase() : 'GENERAL'}</p>
                        <p class="text-xs text-gray-500">Generado: ${new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="grid grid-cols-2 gap-6">
                    ${filtered.map(p => `
                        <div class="border border-gray-300 rounded-lg p-4 flex flex-col justify-between break-inside-avoid shadow-sm">
                            <div class="flex space-x-4">
                                ${p.image ? `<img src="${p.image}" class="h-24 w-24 object-cover rounded bg-gray-100" />` : `<div class="h-24 w-24 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">Sin Foto</div>`}
                                <div>
                                    <h3 class="font-bold text-lg text-gray-900">${p.name}</h3>
                                    <p class="text-xs text-gray-500 font-mono mb-1">SKU: ${p.sku}</p>
                                    <span class="inline-block bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-600 mb-2">${p.category}</span>
                                    <p class="text-sm text-gray-700 leading-tight">${p.description || 'Sin descripción.'}</p>
                                </div>
                            </div>
                            <div class="mt-4 flex justify-between items-center border-t pt-2">
                                <span class="text-xs text-gray-500">${p.productType}</span>
                                <span class="text-xl font-bold text-blue-900">$${p.price.toFixed(2)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Footer -->
                <div class="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-500">
                    <p class="font-bold">${companyInfo.slogan}</p>
                    <p>${companyInfo.website || ''}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Exportar Catálogo PDF">
            <div className="space-y-4">
                <p className="text-sm text-gray-400">Seleccione los filtros para generar el catálogo imprimible para sus clientes.</p>
                
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Categoría</label>
                    <select 
                        value={selectedCategory} 
                        onChange={e => setSelectedCategory(e.target.value)} 
                        className="input-style"
                    >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tipo de Ítem</label>
                    <select 
                        value={selectedType} 
                        onChange={e => setSelectedType(e.target.value)} 
                        className="input-style"
                    >
                        <option value="All">Todos</option>
                        <option value="Producto">Productos</option>
                        <option value="Servicio">Servicios</option>
                        <option value="Manufacturado">Manufactura</option>
                        <option value="Materia Prima">Materia Prima</option>
                    </select>
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">Cancelar</button>
                    <button onClick={handlePrintCatalog} className="px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-500">
                        Generar PDF
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default Inventory;
