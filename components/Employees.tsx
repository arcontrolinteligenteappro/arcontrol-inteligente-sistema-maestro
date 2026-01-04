
import React, { useState, useMemo } from 'react';
import Header from './Header';
import type { Employee, Payment, Loan, AttendanceRecord, Sale, ManufacturingOrder } from '../types';
import Table from './common/Table';
import { mockEmployees, mockPayments, mockLoans, mockAttendance, mockSales, mockManufacturingOrders } from '../data/mockData';
import Modal from './common/Modal';

const Employees: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'list' | 'attendance' | 'payroll'>('list');
    
    // Data State
    const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
    const [loans, setLoans] = useState<Loan[]>(mockLoans);
    const [attendanceLog, setAttendanceLog] = useState<AttendanceRecord[]>(mockAttendance);
    const [payments, setPayments] = useState<Payment[]>(mockPayments);

    // Filter/Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
    const [showSalesOnly, setShowSalesOnly] = useState(false);

    // UI State
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    const filteredEmployees = useMemo(() => {
        let filtered = employees;
        
        if (showSalesOnly) {
            filtered = filtered.filter(e => 
                e.position.toLowerCase().includes('ventas') || 
                e.position.toLowerCase().includes('vendedor') ||
                e.paymentType === 'Comision' ||
                e.paymentType === 'Mixto'
            );
        }

        if (searchTerm) {
            filtered = filtered.filter(e => 
                e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (e.alias && e.alias.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return filtered;
    }, [employees, searchTerm, showSalesOnly]);

    // Calculate Sales Stats for Sales People
    const getSalesStats = (empId: string) => {
        // Warning: This assumes sales mock data has employee link, but mockSales currently links 'customer'.
        // For this demo, we'll simulate linking or use a placeholder logic if no field exists.
        // Assuming we update types later to include `salesRepId` in Sale.
        // For now, let's just return dummy random data seeded by ID for visualization
        const seed = empId.charCodeAt(empId.length - 1);
        return {
            totalSales: seed * 1200,
            commission: (seed * 1200) * 0.05
        };
    };

    // --- LOGIC: Attendance ---
    const activeProjects = useMemo(() => {
        const projects = [];
        // Add Services/Projects from Sales
        mockSales.filter(s => s.status === 'Pending' || s.status === 'Completed').forEach(s => {
            if(s.type === 'Servicio' || s.type === 'Venta') {
                projects.push({ id: s.id, name: `${s.type === 'Venta' ? 'Venta' : 'Servicio'}: ${s.customerName} (${s.id})` });
            }
        });
        // Add Manufacturing Orders
        mockManufacturingOrders.filter(o => o.status !== 'Completado').forEach(o => {
            projects.push({ id: o.id, name: `Manufactura: ${o.productName} (${o.id})` });
        });
        return projects;
    }, []);

    const handleAttendanceChange = (employeeId: string, updates: Partial<AttendanceRecord>) => {
        const existingRecordIndex = attendanceLog.findIndex(a => a.employeeId === employeeId && a.date === attendanceDate);
        
        let newRecord: AttendanceRecord = {
            id: existingRecordIndex >= 0 ? attendanceLog[existingRecordIndex].id : `ATT${Date.now()}-${employeeId}`,
            employeeId,
            date: attendanceDate,
            status: updates.status || 'Asistencia',
            // Preserve existing data if not updating status
            checkInTime: updates.status === 'Asistencia' || updates.status === 'Retardo' ? new Date().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'}) : undefined,
            projectId: updates.projectId,
            projectName: updates.projectId ? activeProjects.find(p => p.id === updates.projectId)?.name : undefined,
            activityLog: updates.activityLog
        };

        if (existingRecordIndex >= 0) {
            const current = attendanceLog[existingRecordIndex];
            // Merge updates
            newRecord = { ...current, ...updates };
            // Auto set project name if ID changed
            if (updates.projectId) {
                newRecord.projectName = activeProjects.find(p => p.id === updates.projectId)?.name;
            }
            // Auto set checkin if status changed to present
            if (updates.status && (updates.status === 'Asistencia' || updates.status === 'Retardo') && !current.checkInTime) {
                newRecord.checkInTime = new Date().toLocaleTimeString('es-MX', {hour: '2-digit', minute:'2-digit'});
            }

            const updatedLog = [...attendanceLog];
            updatedLog[existingRecordIndex] = newRecord;
            setAttendanceLog(updatedLog);
        } else {
            setAttendanceLog([...attendanceLog, newRecord]);
        }
    };

    // --- COMPONENT: Employee List Tab ---
    const ListTab = () => {
        const columns = [
            { header: 'Nombre', accessor: 'name' as keyof Employee },
            { header: 'Puesto', accessor: 'position' as keyof Employee },
            { header: 'Tipo Pago', accessor: 'paymentType' as keyof Employee },
            { header: 'Fecha Alta', accessor: 'hireDate' as keyof Employee },
        ];
        
        const renderActions = (employee: Employee) => (
            <div className="flex space-x-2 justify-end">
                 <button onClick={() => { setEditingEmployee(employee); setIsFormOpen(true); }} className="text-blue-400 hover:text-blue-300 hover:underline">Editar</button>
                <button onClick={() => setSelectedEmployee(employee)} className="text-green-400 hover:text-green-300 hover:underline">Detalles</button>
            </div>
        );

        return (
            <>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4 items-center flex-1">
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="Buscar empleado..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-style w-full pl-10"
                            />
                             <div className="absolute top-0 left-0 inline-flex items-center p-2 mt-1 ml-1 text-gray-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowSalesOnly(!showSalesOnly)}
                            className={`px-3 py-2 rounded text-sm border transition-colors ${showSalesOnly ? 'bg-blue-900/50 border-blue-500 text-blue-300' : 'border-gray-600 text-gray-400 hover:bg-gray-800'}`}
                        >
                            {showSalesOnly ? 'Viendo: Solo Vendedores' : 'Filtrar: Solo Vendedores'}
                        </button>
                    </div>
                    <button 
                        onClick={() => { setEditingEmployee(null); setIsFormOpen(true); }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 shadow-md shadow-green-500/20 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11"x2="16" y2="11"/></svg>
                        Nuevo Empleado
                    </button>
                </div>

                {showSalesOnly ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEmployees.map(emp => {
                            const stats = getSalesStats(emp.id);
                            return (
                                <div key={emp.id} className="bg-black/40 border border-blue-500/30 p-4 rounded-lg flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-bold text-white">{emp.name}</h4>
                                            <p className="text-sm text-blue-300">{emp.position}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">Comisión</p>
                                            <p className="font-bold text-yellow-400">{emp.commissionRate || 0}%</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-gray-700 pt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Total Vendido</p>
                                            <p className="text-xl font-bold text-green-400">${stats.totalSales.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Comisión Est.</p>
                                            <p className="text-xl font-bold text-blue-400">${stats.commission.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedEmployee(emp)} className="mt-4 w-full py-1 bg-gray-800 hover:bg-gray-700 text-sm rounded text-gray-300">
                                        Ver Detalles Completos
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <Table columns={columns} data={filteredEmployees} renderActions={renderActions} />
                )}
            </>
        );
    };

    // --- COMPONENT: Attendance Tab ---
    const AttendanceTab = () => {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-black/30 p-3 rounded-lg border border-green-500/20">
                    <label className="text-gray-400 text-sm">Fecha de Asistencia:</label>
                    <input 
                        type="date" 
                        value={attendanceDate} 
                        onChange={(e) => setAttendanceDate(e.target.value)} 
                        className="input-style w-auto"
                    />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {employees.map(emp => {
                        const record = attendanceLog.find(a => a.employeeId === emp.id && a.date === attendanceDate);
                        const status = record?.status || 'Pendiente';
                        const note = record?.activityLog || '';
                        const projectId = record?.projectId || '';

                        return (
                            <div key={emp.id} className="bg-gray-900/50 border border-green-500/20 p-4 rounded-lg flex flex-col xl:flex-row items-center justify-between gap-4">
                                <div className="w-full xl:w-1/5">
                                    <p className="font-bold text-green-300 text-lg">{emp.name}</p>
                                    <p className="text-xs text-gray-500">{emp.position}</p>
                                </div>
                                
                                {/* Status Buttons */}
                                <div className="flex space-x-2">
                                    {['Asistencia', 'Falta', 'Retardo', 'Descanso'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleAttendanceChange(emp.id, { status: s as any })}
                                            className={`px-3 py-1 rounded text-sm transition-colors ${
                                                status === s 
                                                ? (s === 'Falta' ? 'bg-red-600 text-white' : s === 'Retardo' ? 'bg-orange-500 text-white' : 'bg-green-600 text-white')
                                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                {/* Project Assignment & Notes */}
                                <div className="w-full xl:w-2/5 flex flex-col md:flex-row gap-2">
                                    <select 
                                        className="input-style text-sm md:w-1/2" 
                                        value={projectId}
                                        onChange={(e) => handleAttendanceChange(emp.id, { projectId: e.target.value })}
                                        disabled={status === 'Falta' || status === 'Descanso'}
                                    >
                                        <option value="">-- Sin Proyecto Asignado --</option>
                                        {activeProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                    <input 
                                        type="text" 
                                        placeholder="Nota de actividad extra..." 
                                        className="input-style text-sm md:w-1/2"
                                        value={note}
                                        onChange={(e) => handleAttendanceChange(emp.id, { activityLog: e.target.value })}
                                        disabled={status === 'Falta' || status === 'Descanso'}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // --- COMPONENT: Payroll Tab ---
    const PayrollTab = () => {
        const [payrollEmployeeId, setPayrollEmployeeId] = useState('');
        const [calculatedPayroll, setCalculatedPayroll] = useState<any>(null);
        const [payrollNotes, setPayrollNotes] = useState('');

        const calculatePayroll = () => {
            const emp = employees.find(e => e.id === payrollEmployeeId);
            if (!emp) return;

            // Simplified Logic
            const dailyRate = emp.baseSalary / 30;
            const workedDays = attendanceLog.filter(a => a.employeeId === emp.id && (a.status === 'Asistencia' || a.status === 'Retardo')).length;
            const salaryTotal = dailyRate * workedDays;

            // Commissions
            const commissionTotal = (emp.paymentType === 'Comision' || emp.paymentType === 'Mixto') ? (emp.baseSalary * 0.10) : 0;

            // Deductions (Pending Loans)
            const empLoans = loans.filter(l => l.employeeId === emp.id && l.status === 'Pendiente' && l.type === 'Prestamo_Empresa_a_Empleado');
            const loanDeduction = empLoans.reduce((sum, l) => sum + l.amount, 0);

            setCalculatedPayroll({
                base: emp.baseSalary,
                workedDays,
                salaryTotal,
                commissionTotal,
                loanDeduction,
                total: (salaryTotal + commissionTotal) - loanDeduction
            });
        };

        const handleRegisterPayment = () => {
            if(!calculatedPayroll || !payrollEmployeeId) return;
            const newPayment: Payment = {
                id: `PAY${Date.now()}`,
                employeeId: payrollEmployeeId,
                amount: calculatedPayroll.total,
                date: new Date().toISOString().split('T')[0],
                type: 'Nomina',
                description: `Nómina Periodo Actual (${calculatedPayroll.workedDays} días)${payrollNotes ? ' - Notas: ' + payrollNotes : ''}`
            };
            setPayments([...payments, newPayment]);
            setCalculatedPayroll(null);
            setPayrollEmployeeId('');
            setPayrollNotes('');
            alert("Pago de nómina registrado exitosamente.");
        };

        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-black/40 p-6 rounded-lg border border-green-500/20">
                    <h3 className="text-lg font-bold text-green-300 mb-4">Calculadora de Nómina</h3>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-400 mb-1">Seleccionar Empleado</label>
                        <select 
                            className="input-style" 
                            value={payrollEmployeeId} 
                            onChange={(e) => { setPayrollEmployeeId(e.target.value); setCalculatedPayroll(null); }}
                        >
                            <option value="">-- Seleccione --</option>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                    </div>
                    <button onClick={calculatePayroll} disabled={!payrollEmployeeId} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 disabled:bg-gray-700">
                        Calcular Periodo
                    </button>
                </div>

                {calculatedPayroll && (
                    <div className="bg-gray-900 border border-green-500/50 p-6 rounded-lg animate-fade-in">
                        <h4 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Desglose</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between">
                                <span>Salario Base Mensual:</span>
                                <span>${calculatedPayroll.base.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Días Trabajados ({calculatedPayroll.workedDays}):</span>
                                <span className="text-green-400">+${calculatedPayroll.salaryTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Comisiones:</span>
                                <span className="text-green-400">+${calculatedPayroll.commissionTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Deducciones (Préstamos):</span>
                                <span className="text-red-400">-${calculatedPayroll.loanDeduction.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-600 pt-2 mt-2 text-lg font-bold">
                                <span>Total a Pagar:</span>
                                <span className="text-yellow-400">${calculatedPayroll.total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Notas / Detalles del Pago</label>
                            <textarea 
                                className="input-style" 
                                rows={2} 
                                value={payrollNotes} 
                                onChange={e => setPayrollNotes(e.target.value)}
                                placeholder="Ej: Bono de puntualidad incluido, descuento por herramienta..."
                            />
                        </div>
                        <button onClick={handleRegisterPayment} className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-500 shadow-lg shadow-green-900/20">
                            CONFIRMAR PAGO
                        </button>
                    </div>
                )}
            </div>
        );
    };

    // --- COMPONENT: Employee Detail Modal (Reports) ---
    const EmployeeDetailModal: React.FC<{ employee: Employee, onClose: () => void }> = ({ employee, onClose }) => {
        const empPayments = payments.filter(p => p.employeeId === employee.id);
        const empAttendance = attendanceLog.filter(a => a.employeeId === employee.id);
        
        // Stats
        const presences = empAttendance.filter(a => a.status === 'Asistencia').length;
        const absences = empAttendance.filter(a => a.status === 'Falta').length;
        const delays = empAttendance.filter(a => a.status === 'Retardo').length;

        // Loans (Simplified from original component logic)
        const empLoans = loans.filter(l => l.employeeId === employee.id && l.status === 'Pendiente');
        const debt = empLoans.reduce((sum, l) => sum + l.amount, 0);

        return (
            <Modal isOpen={!!employee} onClose={onClose} title={`Reporte: ${employee.name} (${employee.alias || ''})`}>
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm bg-black/20 p-3 rounded">
                        <div>
                            <p className="text-gray-400">Puesto:</p> <p className="text-white font-semibold">{employee.position}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Fecha Alta:</p> <p className="text-white font-semibold">{employee.hireDate}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Tipo Pago:</p> <p className="text-white font-semibold">{employee.paymentType}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Salario Base:</p> <p className="text-white font-semibold">${employee.baseSalary.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="border-t border-green-500/20 pt-4">
                        <h4 className="font-semibold text-green-300 mb-3">Estadísticas de Asistencia</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="bg-green-900/30 p-2 rounded border border-green-500/30">
                                <p className="text-xs text-gray-400">Asistencias</p>
                                <p className="text-xl font-bold text-green-400">{presences}</p>
                            </div>
                            <div className="bg-red-900/30 p-2 rounded border border-red-500/30">
                                <p className="text-xs text-gray-400">Faltas</p>
                                <p className="text-xl font-bold text-red-400">{absences}</p>
                            </div>
                            <div className="bg-yellow-900/30 p-2 rounded border border-yellow-500/30">
                                <p className="text-xs text-gray-400">Retardos</p>
                                <p className="text-xl font-bold text-yellow-400">{delays}</p>
                            </div>
                            <div className="bg-gray-800/30 p-2 rounded border border-gray-600/30">
                                <p className="text-xs text-gray-400">Deuda Act.</p>
                                <p className="text-xl font-bold text-white">${debt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="border-t border-green-500/20 pt-4">
                        <h4 className="font-semibold text-green-300 mb-2">Historial de Actividades/Proyectos</h4>
                        <div className="max-h-40 overflow-y-auto bg-black/30 p-2 rounded border border-gray-700">
                            {empAttendance.length > 0 ? (
                                <ul className="space-y-2 text-xs">
                                    {empAttendance.map(log => (
                                        <li key={log.id} className="flex flex-col border-b border-gray-800 pb-1 mb-1">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400 font-mono">{log.date}</span>
                                                <span className={`font-bold ${log.status === 'Falta' ? 'text-red-400' : 'text-green-200'}`}>{log.status}</span>
                                            </div>
                                            {log.projectName && (
                                                <span className="text-blue-300 truncate">Proyecto: {log.projectName}</span>
                                            )}
                                            {log.activityLog && (
                                                <span className="text-gray-300 italic truncate">Nota: {log.activityLog}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-xs text-center">Sin registros.</p>}
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="border-t border-green-500/20 pt-4">
                        <h4 className="font-semibold text-green-300 mb-2">Últimos Pagos</h4>
                        <div className="max-h-32 overflow-y-auto bg-black/30 p-2 rounded border border-gray-700">
                             {empPayments.length > 0 ? (
                                <ul className="space-y-2 text-xs">
                                    {empPayments.map(p => (
                                        <li key={p.id} className="flex justify-between border-b border-gray-800 pb-1">
                                            <div className="flex flex-col">
                                                <span>{p.date} - {p.type}</span>
                                                <span className="text-[10px] text-gray-500 truncate max-w-[200px]">{p.description}</span>
                                            </div>
                                            <span className="text-green-400 font-bold">${p.amount.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-gray-500 text-xs text-center">No hay pagos registrados.</p>}
                        </div>
                    </div>
                </div>
            </Modal>
        );
    };

    // --- MAIN RENDER ---
    return (
        <div>
            <Header title="Gestión de Recursos Humanos" />
            
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-black/40 p-1 rounded-lg border border-green-500/20 mb-6 w-fit">
                <button 
                    onClick={() => setActiveTab('list')} 
                    className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'list' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-green-300'}`}
                >
                    Personal
                </button>
                <button 
                    onClick={() => setActiveTab('attendance')} 
                    className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'attendance' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-green-300'}`}
                >
                    Control de Asistencia
                </button>
                <button 
                    onClick={() => setActiveTab('payroll')} 
                    className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'payroll' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-green-300'}`}
                >
                    Cálculo de Nómina
                </button>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-green-500/10 rounded-lg p-4 min-h-[500px]">
                {activeTab === 'list' && <ListTab />}
                {activeTab === 'attendance' && <AttendanceTab />}
                {activeTab === 'payroll' && <PayrollTab />}
            </div>

            {selectedEmployee && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
            
            <EmployeeForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                onSave={(data) => {
                    if(editingEmployee) {
                        setEmployees(employees.map(e => e.id === data.id ? data : e));
                    } else {
                        setEmployees([...employees, data]);
                    }
                    setIsFormOpen(false);
                    setEditingEmployee(null);
                }} 
                initialData={editingEmployee} 
            />
        </div>
    );
};

// --- Subcomponent: Employee Form ---
const EmployeeForm: React.FC<{ isOpen: boolean, onClose: () => void, onSave: (data: Employee) => void, initialData: Employee | null }> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<Employee>>({});

    React.useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ 
                name: '', alias: '', position: '', email: '', phone: '', address: '', notes: '', 
                hireDate: new Date().toISOString().split('T')[0],
                paymentType: 'Nomina',
                baseSalary: 0,
                commissionRate: 0
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'baseSalary' || name === 'commissionRate' ? parseFloat(value) : value });
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.position) return alert("Nombre y Posición son obligatorios");
        onSave(formData as Employee);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Empleado" : "Nuevo Empleado"}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400">Nombre</label><input name="name" value={formData.name || ''} onChange={handleChange} className="input-style" /></div>
                    <div><label className="block text-sm text-gray-400">Alias</label><input name="alias" value={formData.alias || ''} onChange={handleChange} className="input-style" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400">Puesto</label><input name="position" value={formData.position || ''} onChange={handleChange} className="input-style" /></div>
                    <div><label className="block text-sm text-gray-400">Fecha Alta</label><input type="date" name="hireDate" value={formData.hireDate || ''} onChange={handleChange} className="input-style" /></div>
                </div>
                
                <div className="border-t border-green-500/20 pt-2 mt-2">
                    <h5 className="text-green-300 font-semibold mb-2">Esquema de Pago</h5>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400">Tipo</label>
                            <select name="paymentType" value={formData.paymentType} onChange={handleChange} className="input-style">
                                <option value="Nomina">Nómina (Fijo)</option>
                                <option value="Comision">Comisión</option>
                                <option value="Proyecto">Por Proyecto</option>
                                <option value="Mixto">Mixto</option>
                            </select>
                        </div>
                        <div><label className="block text-sm text-gray-400">Salario Base ($)</label><input type="number" name="baseSalary" value={formData.baseSalary || 0} onChange={handleChange} className="input-style" /></div>
                        <div><label className="block text-sm text-gray-400">Comisión (%)</label><input type="number" name="commissionRate" value={formData.commissionRate || 0} onChange={handleChange} className="input-style" /></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-gray-400">Teléfono</label><input name="phone" value={formData.phone || ''} onChange={handleChange} className="input-style" /></div>
                    <div><label className="block text-sm text-gray-400">Email</label><input name="email" value={formData.email || ''} onChange={handleChange} className="input-style" /></div>
                </div>
                <div><label className="block text-sm text-gray-400">Dirección</label><input name="address" value={formData.address || ''} onChange={handleChange} className="input-style" /></div>
                <div><label className="block text-sm text-gray-400">Notas</label><textarea name="notes" value={formData.notes || ''} onChange={handleChange} className="input-style" rows={2} /></div>
                
                <div className="flex justify-end pt-4">
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500">Guardar</button>
                </div>
            </div>
        </Modal>
    );
};

export default Employees;
