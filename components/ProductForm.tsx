
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import Modal from './common/Modal';

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product: Product | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, onClose, onSave, product }) => {
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            setFormData(product);
            setImagePreview(product.image || null);
        } else {
            setFormData({
                name: '',
                sku: '',
                stock: 0,
                price: 0,
                cost: 0,
                category: '',
                supplier: '',
                unit: 'Unidad',
                additionalPrices: [],
                productType: 'Producto',
            });
            setImagePreview(null);
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };

        if (name === 'productType' && value === 'Servicio') {
            delete updatedFormData.stock;
            delete updatedFormData.unit;
        }

        setFormData(updatedFormData);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData({ ...formData, image: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        // Basic validation
        if (formData.name && (formData.price !== undefined)) {
            onSave(formData as Product);
        } else {
            alert('Nombre y Precio Público son obligatorios.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Ítem' : 'Nuevo Ítem'}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                {/* Image and basic info */}
                <div className="md:col-span-1 space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Imagen (Opcional)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-500/30 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                               {imagePreview ? (
                                   <img src={imagePreview} alt="Preview" className="mx-auto h-24 w-24 object-cover rounded-md"/>
                               ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M20 4v12l-4-4-4 4V4M36 20h-8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                               )}
                                <div className="flex text-sm text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-black/50 rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none p-1">
                                        <span>Subir archivo</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Nombre del Ítem</label>
                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Tipo de Ítem</label>
                        <select name="productType" value={formData.productType || 'Producto'} onChange={handleChange} className="input-style">
                            <option value="Producto">Producto (Venta)</option>
                            <option value="Servicio">Servicio</option>
                            <option value="Materia Prima">Materia Prima (Insumo)</option>
                            <option value="Manufacturado">Manufacturado (Producción)</option>
                        </select>
                    </div>
                </div>

                {/* Details and pricing */}
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">SKU / Código</label>
                        <input type="text" name="sku" value={formData.sku || ''} onChange={handleChange} className="input-style" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Categoría</label>
                        <input type="text" name="category" value={formData.category || ''} onChange={handleChange} className="input-style" />
                    </div>
                    {formData.productType !== 'Servicio' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Stock</label>
                                <input type="number" name="stock" value={formData.stock || 0} onChange={handleChange} className="input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Unidad</label>
                                <select name="unit" value={formData.unit || 'Unidad'} onChange={handleChange} className="input-style">
                                    <option>Unidad</option>
                                    <option>Pieza</option>
                                    <option>Kit</option>
                                    <option>Litro</option>
                                    <option>Metro</option>
                                </select>
                            </div>
                        </>
                    )}
                    <div className="col-span-2 border-t border-green-500/20 pt-4 grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-green-400">Precio Público / Venta</label>
                            <input type="number" name="price" value={formData.price || 0} onChange={handleChange} className="input-style" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-red-400">Costo</label>
                            <input type="number" name="cost" value={formData.cost || 0} onChange={handleChange} className="input-style" />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-400">Descripción / Notas</label>
                        <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={formData.productType === 'Producto' ? 4 : 8} className="input-style"></textarea>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={handleSave} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">Guardar</button>
            </div>
        </Modal>
    );
};

export default ProductForm;
