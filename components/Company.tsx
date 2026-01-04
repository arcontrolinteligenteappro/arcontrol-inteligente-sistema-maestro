
import React, { useState, useEffect } from 'react';
import Header from './Header';
import type { CompanyInfo } from '../types';
import { mockCompanyInfo } from '../data/mockData';

const Company: React.FC = () => {
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
        const savedInfo = localStorage.getItem('companyInfo');
        return savedInfo ? JSON.parse(savedInfo) : mockCompanyInfo;
    });
    const [logoPreview, setLogoPreview] = useState<string | undefined>(companyInfo.logo);

    useEffect(() => {
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    }, [companyInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setLogoPreview(result);
                setCompanyInfo({ ...companyInfo, logo: result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <Header title="Datos de la Empresa" />

            <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg p-8 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Logo Section */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <label className="block text-sm font-medium text-gray-400 text-center">Logo de la Empresa</label>
                        <div className="mt-2 w-48 h-48 flex items-center justify-center border-2 border-dashed border-green-500/50 rounded-full overflow-hidden bg-black/30">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo Preview" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-gray-500">Sin Logo</span>
                            )}
                        </div>
                        <label htmlFor="logo-upload" className="mt-4 cursor-pointer px-4 py-2 bg-gray-800 border border-green-500/50 text-green-300 text-sm font-medium rounded-md hover:bg-green-900/50">
                           Cambiar Logo
                           <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoChange} accept="image/*" />
                        </label>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Razón Social / Nombre</label>
                            <input type="text" name="name" value={companyInfo.name} onChange={handleChange} className="input-style" />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-400">RFC (Tax ID)</label>
                                <input type="text" name="rfc" value={companyInfo.rfc || ''} onChange={handleChange} className="input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Régimen Fiscal</label>
                                <input type="text" name="taxRegime" value={companyInfo.taxRegime || ''} onChange={handleChange} className="input-style" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400">Dirección Fiscal / Física</label>
                            <input type="text" name="address" value={companyInfo.address || ''} onChange={handleChange} className="input-style" placeholder="Calle, Número, Colonia, CP, Ciudad" />
                        </div>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-400">Teléfono</label>
                                <input type="text" name="phone" value={companyInfo.phone} onChange={handleChange} className="input-style" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400">Email</label>
                                <input type="email" name="email" value={companyInfo.email} onChange={handleChange} className="input-style" />
                            </div>
                         </div>
                         
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Sitio Web</label>
                            <input type="text" name="website" value={companyInfo.website || ''} onChange={handleChange} className="input-style" placeholder="www.tuempresa.com" />
                        </div>

                         <div>
                            <label className="block text-sm font-medium text-gray-400">Slogan</label>
                            <input type="text" name="slogan" value={companyInfo.slogan} onChange={handleChange} className="input-style" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-400">Datos de Transferencia Bancaria (Aparecen en Cotizaciones)</label>
                            <textarea name="transferDetails" value={companyInfo.transferDetails} onChange={handleChange} rows={4} className="input-style" placeholder="Banco: ...&#10;Cuenta: ...&#10;CLABE: ..."></textarea>
                        </div>
                    </div>
                </div>
                 <div className="mt-8 pt-6 border-t border-green-500/20 flex justify-end">
                    <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50">
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Company;
