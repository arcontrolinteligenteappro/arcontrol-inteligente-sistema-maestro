
export type View = 'dashboard' | 'inventory' | 'sales' | 'promotions' | 'customers' | 'employees' | 'settings' | 'reports' | 'company' | 'utilities' | 'engineering' | 'notebook' | 'security' | 'files' | 'measurement' | 'memberships' | 'manufacture' | 'dailylog' | 'terminal';

export interface Product {
    id: string;
    name: string;
    sku: string;
    stock?: number; // Optional now for services
    price: number; // Precio Público
    cost: number;
    category: string;
    supplier: string;
    image?: string;
    description?: string;
    unit?: 'Unidad' | 'Kit' | 'Pieza' | 'Litro' | 'Metro';
    notes?: string;
    additionalPrices?: { name: string; price: number }[];
    productType: 'Producto' | 'Servicio' | 'Materia Prima' | 'Manufacturado';
}

export type ClientCategory = 'Comercial' | 'Suscripción' | 'Manufactura' | 'Servicios' | 'Proveedor';

export interface Customer {
    id: string;
    name: string;
    alias?: string; // Nuevo campo
    email: string;
    phone: string;
    address?: string; // Nuevo campo
    clientTypes: ClientCategory[]; // Categorización automática o manual
    totalSpent: number;
    lastPurchase: string;
    notes?: string;
    // License Management
    purchasedLicenses: number; // Total paid/contracted
    savedPlans?: Plan[]; // Historial de planos guardados
}

export interface SaleProduct {
    productId: string;
    name: string;
    quantity: number;
    price: number; // The final sold price
    originalPrice: number; // To track discounts/modifications
    discountApplied?: number; // Amount or percentage value
    discountType?: 'percent' | 'amount';
}

export interface Sale {
    id:string;
    customerId?: string;
    customerName: string;
    date: string;
    total: number;
    subtotal: number; // Added for calculations
    globalDiscount?: number; // Discount on the total
    couponCode?: string; // If a promo was used
    amountPaid: number;
    products: SaleProduct[];
    type: 'Venta' | 'Cotización' | 'Servicio' | 'Compra'; // Added Compra for suppliers
    status: 'Completed' | 'Pending' | 'Cancelled';
    paymentStatus: 'Pagado' | 'Parcial' | 'Pendiente';
    paymentMethod?: 'Efectivo' | 'Tarjeta Crédito' | 'Tarjeta Débito' | 'Transferencia' | 'Otro';
    notes?: string;
    dueDate?: string; // Fecha de vencimiento del crédito
}

export interface Promotion {
    id: string;
    code: string; // Coupon code or Name
    name: string;
    type: 'percent' | 'amount';
    value: number;
    startDate: string;
    endDate: string;
    activeDays: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    description?: string;
    active: boolean;
}

export type PaymentMethod = 'Nomina' | 'Comision' | 'Proyecto' | 'Mixto';

export interface Employee {
    id: string;
    name: string;
    alias?: string;
    position: string;
    email: string;
    phone: string;
    address?: string;
    hireDate: string; // Fecha de Alta
    paymentType: PaymentMethod;
    baseSalary: number; // Mensual o por Proyecto
    commissionRate?: number; // % de comisión si aplica
    notes?: string;
}

export interface AttendanceRecord {
    id: string;
    employeeId: string;
    date: string;
    status: 'Asistencia' | 'Falta' | 'Retardo' | 'Descanso';
    checkInTime?: string;
    checkOutTime?: string;
    projectId?: string; // ID del proyecto/servicio/orden asignado
    projectName?: string; // Nombre legible del proyecto
    activityLog?: string; // Nota de actividad manual
}

export interface Loan {
    id: string;
    employeeId: string;
    amount: number;
    date: string;
    type: 'Prestamo_Empresa_a_Empleado' | 'Prestamo_Empleado_a_Empresa';
    status: 'Pendiente' | 'Pagado';
    notes?: string;
}

export interface Payment {
    id: string;
    employeeId: string;
    amount: number;
    date: string;
    type: 'Jornada' | 'Proyecto' | 'Bono' | 'Abono_Prestamo' | 'Comision' | 'Nomina';
    description: string;
}

export interface ToolAssignment {
    id: string;
    employeeId: string;
    employeeName: string;
    toolName: string;
    serialNumber?: string;
    assignmentDate: string;
    returnDate?: string;
    condition: 'Nueva' | 'Buena' | 'Regular' | 'Mala' | 'Dañada';
    status: 'Asignada' | 'Devuelta' | 'Perdida' | 'Mantenimiento';
    notes: string;
}

export interface SupplierPayment {
    id: string;
    supplierId: string;
    amount: number;
    date: string;
    invoiceId: string;
    notes?: string;
}

export interface ServerConfig {
    id: string;
    name: string;
    type: 'cPanel' | 'VPS' | 'Database' | 'API Key';
    host?: string;
    user?: string;
    key?: string; // Pass or Token
    url?: string;
}

export interface SocialConfig {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    linkedin?: string;
    twitter?: string;
    telegram?: string; // Added Telegram
}

export interface BackupSettings {
    autoSave: boolean;
    autoSaveInterval: number; // Minutes
    googleDriveConnected: boolean;
    lastBackup?: string;
}

export interface CompanyInfo {
    logo?: string;
    name: string;
    phone: string;
    email: string;
    address: string; // Dirección completa
    rfc: string; // Tax ID
    taxRegime?: string; // Régimen Fiscal
    website?: string;
    slogan: string;
    transferDetails: string;
    socials?: SocialConfig;
    servers?: ServerConfig[];
    backup?: BackupSettings;
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

export interface Income {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
}

export interface Wastage {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    date: string;
    reason: string;
}

export type PlanType = 'Arquitectónico' | 'Estructural' | 'Eléctrico/Redes' | 'Software/UML';

export interface Plan {
    id: string;
    name: string;
    customerId: string;
    customerName: string;
    createdAt: string;
    planType: PlanType;
    // Legacy Data Structure
    architecturalData?: string;
    structuralData?: any;
    electricalData?: any;
    // New Universal Data Structure for Canvas
    elements?: DiagramElement[];
    notes?: string;
}

export type NetworkType = 'PAN' | 'LAN' | 'MAN' | 'WAN';

export interface NetworkMap {
    id: string;
    name: string;
    customerId: string;
    customerName: string;
    createdAt: string;
    networkType: NetworkType;
    description: string; // Topology, devices, IPs, etc.
    notes?: string;
}

export interface Reminder {
    id: string;
    title: string;
    dueDate: string;
    priority: 'Alta' | 'Media' | 'Baja';
    status: 'Pendiente' | 'Completado';
    relatedTo?: { type: 'Customer' | 'Supplier' | 'Employee', id: string, name: string };
}

export interface Finding {
    id: string;
    severity: 'Crítico' | 'Alto' | 'Medio' | 'Bajo' | 'Informativo';
    description: string;
    recommendation: string;
}

export interface SecurityAudit {
    id: string;
    target: string;
    auditType: 'Test de Penetración' | 'Análisis de Vulnerabilidades' | 'Revisión de Código';
    status: 'En Progreso' | 'Completado' | 'Pendiente';
    date: string;
    summary: string;
    findings: Finding[];
}

export interface DiagramElement {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  width?: number; // Visual width in pixels on canvas
  height?: number; // Visual height in pixels on canvas
  rotation?: number; // Rotation in degrees
  layer?: string; 
  data: Record<string, any>;
}

export interface ManagedFile {
  id: string;
  name: string;
  type: 'Instalador' | 'Documento' | 'Boceto' | 'Plantilla' | 'Otro';
  source: 'Local' | 'Google Drive';
  path: string; // URL for Drive, description/name for Local
  createdAt: string;
  notes?: string;
}

// New Interface for Repositories
export interface Repository {
    id: string;
    name: string;
    url: string;
    language: string;
    description: string;
    status: 'Installed' | 'Not Installed';
    localPath?: string;
}

export interface Measurement {
    id: string;
    value: number;
    unit: 'm' | 'cm' | 'ft' | 'in';
}

export interface Point {
    x: number;
    y: number;
}

export interface Material {
  id: string;
  name: string;
  type: 'Cable' | 'Conector' | 'Caja' | 'Tapa' | 'Accesorio' | 'Otro';
  quantity: number;
  unit: string;
}

export type LicenseCategory = 'Mobile Only' | 'TV/Box (Pantalla)' | 'Combo (Mobile+TV)';

export interface Membership {
    id: string;
    customerId: string;
    customerName: string;
    serviceName: string; // 'Streaming', 'Xupero', or custom
    category: LicenseCategory; 
    startDate: string;
    endDate: string; // Expiration date
    cost: number;
    discount?: number; // Discount applied
    finalPrice?: number; // Cost - Discount
    paymentMethod: 'Efectivo' | 'Transferencia' | 'Saldo a Favor' | 'Cortesia';
    status: 'Activa' | 'Vencida' | 'Suspendida';
    notes?: string;
    autoRenewal: boolean;
}

export interface CommunicationEvent {
    id: string;
    customerId: string;
    type: 'Llamada' | 'Visita' | 'Mensaje' | 'Soporte';
    date: string;
    time: string;
    status: 'Pendiente' | 'Completado' | 'Cancelado';
    notes: string;
}

export interface ManufacturingOrder {
    id: string;
    productToProduceId: string;
    productName: string;
    quantity: number;
    startDate: string;
    status: 'Planificado' | 'En Proceso' | 'Control Calidad' | 'Completado';
    materials: {
        materialId: string;
        materialName: string;
        quantityRequired: number;
    }[];
    notes?: string;
}
