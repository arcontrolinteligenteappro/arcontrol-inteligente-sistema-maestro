
import React, { useState } from 'react';
import Header from './Header';
import Modal from './common/Modal';
import { mockSecurityAudits } from '../data/mockData';
import type { SecurityAudit, Finding } from '../types';

const SecurityAudit: React.FC = () => {
    const [audits, setAudits] = useState<SecurityAudit[]>(mockSecurityAudits);
    const [selectedAudit, setSelectedAudit] = useState<SecurityAudit | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSaveAudit = (newAuditData: Partial<SecurityAudit>) => {
        // In a real app, you'd have better validation
        const newAudit: SecurityAudit = {
            id: `AUD${Date.now()}`,
            target: newAuditData.target || 'N/A',
            auditType: newAuditData.auditType || 'Análisis de Vulnerabilidades',
            status: 'Pendiente',
            date: new Date().toISOString().split('T')[0],
            summary: newAuditData.summary || '',
            findings: [],
        };
        setAudits([newAudit, ...audits]);
        setIsFormOpen(false);
    };

    const getStatusBadge = (status: SecurityAudit['status']) => {
        const styles = {
            'Completado': 'bg-green-900/50 text-green-300 border-green-500/30',
            'En Progreso': 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30',
            'Pendiente': 'bg-gray-700/50 text-gray-400 border-gray-500/30',
        };
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>{status}</span>;
    };

    const getSeverityBadge = (severity: Finding['severity']) => {
        const styles = {
            'Crítico': 'bg-red-700 text-red-100 border-red-500',
            'Alto': 'bg-red-900/80 text-red-200 border-red-600/80',
            'Medio': 'bg-yellow-900/80 text-yellow-200 border-yellow-600/80',
            'Bajo': 'bg-blue-900/80 text-blue-200 border-blue-600/80',
            'Informativo': 'bg-gray-800/80 text-gray-300 border-gray-600/80',
        };
        return <span className={`px-2 py-1 text-xs font-bold rounded-full border ${styles[severity]}`}>{severity}</span>;
    };

    const AuditDetailsModal: React.FC = () => {
        if (!selectedAudit) return null;
        return (
            <Modal isOpen={!!selectedAudit} onClose={() => setSelectedAudit(null)} title={`Detalle de Auditoría #${selectedAudit.id}`}>
                <div className="space-y-4">
                    <div>
                        <p><strong className="text-green-400">Objetivo:</strong> {selectedAudit.target}</p>
                        <p><strong className="text-green-400">Tipo:</strong> {selectedAudit.auditType}</p>
                        <p><strong className="text-green-400">Fecha:</strong> {selectedAudit.date}</p>
                        <div className="mt-2">
                           <strong className="text-green-400">Estado:</strong> {getStatusBadge(selectedAudit.status)}
                        </div>
                    </div>
                    <div className="border-t border-green-500/20 pt-4">
                        <h4 className="font-semibold text-green-200">Resumen Ejecutivo</h4>
                        <p className="text-sm text-gray-400 whitespace-pre-wrap">{selectedAudit.summary}</p>
                    </div>
                    <div className="border-t border-green-500/20 pt-4">
                        <h4 className="font-semibold text-green-200 mb-2">Hallazgos ({selectedAudit.findings.length})</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                            {selectedAudit.findings.map(finding => (
                                <div key={finding.id} className="p-3 bg-black/30 border border-green-500/20 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <h5 className="font-bold text-gray-300">Finding #{finding.id}</h5>
                                        {getSeverityBadge(finding.severity)}
                                    </div>
                                    <p className="text-sm text-gray-400"><strong className="text-gray-300">Descripción:</strong> {finding.description}</p>
                                    <p className="text-sm text-gray-400 mt-1"><strong className="text-gray-300">Recomendación:</strong> {finding.recommendation}</p>
                                </div>
                            ))}
                            {selectedAudit.findings.length === 0 && <p className="text-sm text-gray-500">No se han registrado hallazgos.</p>}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };
    
    return (
        <div>
            <Header title="Auditoría de Seguridad (Hacking)" />
            <div className="flex justify-end mb-6">
                <button onClick={() => setIsFormOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Nueva Auditoría
                </button>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-green-500/20 shadow-lg p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-green-300 mb-4">Registros de Auditoría</h3>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {audits.map(audit => (
                        <div key={audit.id} className="p-4 border border-green-500/20 rounded-lg bg-black/30 flex justify-between items-center list-item-enter">
                            <div>
                                <p className="font-bold text-green-400">{audit.auditType} - {audit.target}</p>
                                <p className="text-sm text-gray-400 mt-1">Fecha: {audit.date}</p>
                                <p className="text-xs text-gray-500">ID: {audit.id}</p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {getStatusBadge(audit.status)}
                                <button onClick={() => setSelectedAudit(audit)} className="text-green-400 hover:text-green-300 hover:underline text-sm">
                                    Ver Detalles
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <AuditFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSave={handleSaveAudit} />
            <AuditDetailsModal />
        </div>
    );
};


// --- Form Modal ---
interface AuditFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<SecurityAudit>) => void;
}

const AuditFormModal: React.FC<AuditFormModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Partial<SecurityAudit>>({
        target: '',
        auditType: 'Test de Penetración',
        summary: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
        setFormData({ target: '', auditType: 'Test de Penetración', summary: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Iniciar Nueva Auditoría">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400">Objetivo (Target)</label>
                    <input name="target" value={formData.target} onChange={handleChange} placeholder="Ej: 192.168.1.0/24, api.example.com" className="input-style" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Tipo de Auditoría</label>
                    <select name="auditType" value={formData.auditType} onChange={handleChange} className="input-style">
                        <option>Test de Penetración</option>
                        <option>Análisis de Vulnerabilidades</option>
                        <option>Revisión de Código</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400">Resumen / Alcance</label>
                    <textarea name="summary" value={formData.summary} onChange={handleChange} rows={5} className="input-style" placeholder="Describe el alcance y los objetivos de la auditoría."></textarea>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">
                        Crear Auditoría
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SecurityAudit;
