
import type { Product, Sale, Customer, Employee, Payment, SupplierPayment, CompanyInfo, Expense, Wastage, Income, Plan, NetworkMap, Reminder, SecurityAudit, ManagedFile, Membership, ManufacturingOrder, Loan, AttendanceRecord, Promotion, CommunicationEvent, ToolAssignment, Repository } from '../types';

export const mockCompanyInfo: CompanyInfo = {
    name: "AR CONTROL SISTEMAS S.A. de C.V.",
    phone: "(123) 456-7890",
    email: "contacto@arcontrolinteligente.com",
    address: "Av. Tecnológico #2000, Col. Industrial, CP 12345",
    rfc: "ARC-230101-ABC",
    taxRegime: "Régimen General de Ley Personas Morales",
    website: "www.arcontrolinteligente.com",
    slogan: "Soluciones Inteligentes para tu Negocio",
    transferDetails: "Banco: BBVA\nCuenta: 1234567890\nCLABE: 098765432112345678\nTitular: AR Control S.A. de C.V.",
    socials: {
        facebook: 'arcontrol.mx',
        instagram: 'ar_control_sys',
        whatsapp: '521234567890'
    },
    servers: [
        { id: 'SRV01', name: 'Servidor Principal', type: 'cPanel', host: 'cpanel.arcontrol.com', user: 'admin_ar' },
        { id: 'KEY01', name: 'Google Maps API', type: 'API Key', key: 'AIzaSyD...' }
    ],
    backup: {
        autoSave: true,
        autoSaveInterval: 15,
        googleDriveConnected: false
    }
};

export const mockProducts: Product[] = [
    { 
        id: 'P001', 
        name: 'Laptop Pro 15"', 
        sku: 'LP15-2024', 
        stock: 15, 
        price: 24000.00, 
        cost: 16000.00, 
        category: 'Electronics', 
        supplier: 'Tech Supply Co.',
        image: 'https://via.placeholder.com/150/007BFF/FFFFFF?Text=Laptop',
        description: 'Potente laptop para profesionales y creativos.',
        unit: 'Unidad',
        productType: 'Producto',
        notes: 'Revisar garantía extendida.'
    },
    { 
        id: 'P002', 
        name: 'Wireless Mouse', 
        sku: 'WM-01', 
        stock: 45, 
        price: 500.00, 
        cost: 250.00, 
        category: 'Accessories', 
        supplier: 'Gadget World',
        image: 'https://via.placeholder.com/150/6C757D/FFFFFF?Text=Mouse',
        description: 'Mouse inalámbrico ergonómico.',
        unit: 'Pieza',
        productType: 'Producto',
    },
    { 
        id: 'P003', 
        name: 'Mechanical Keyboard', 
        sku: 'MK-ELITE', 
        stock: 200, 
        price: 1800.00, 
        cost: 1100.00, 
        category: 'Accessories', 
        supplier: 'Gadget World',
        image: 'https://via.placeholder.com/150/28A745/FFFFFF?Text=Keyboard',
        description: 'Teclado mecánico retroiluminado RGB.',
        unit: 'Pieza',
        productType: 'Producto',
    },
     { 
        id: 'S001', 
        name: 'Servicio de Mantenimiento de Redes', 
        sku: 'SERV-NET-01', 
        price: 5000.00, 
        cost: 2000.00, 
        category: 'Servicios TI', 
        supplier: 'N/A',
        description: 'Servicio mensual de monitoreo.',
        productType: 'Servicio',
    },
    { 
        id: 'M001', 
        name: 'Carcasa de Aluminio', 
        sku: 'MAT-ALU-01', 
        stock: 500, 
        price: 0, 
        cost: 150.00, 
        category: 'Materia Prima', 
        supplier: 'Metalworks Inc',
        description: 'Carcasa base para dispositivos.',
        unit: 'Pieza',
        productType: 'Materia Prima',
    },
    { 
        id: 'M002', 
        name: 'Chipset Controlador', 
        sku: 'MAT-CHIP-X1', 
        stock: 1200, 
        price: 0, 
        cost: 450.00, 
        category: 'Materia Prima', 
        supplier: 'Silicon Valley Parts',
        description: 'Microcontrolador principal.',
        unit: 'Pieza',
        productType: 'Materia Prima',
    },
    { 
        id: 'PROD-CUSTOM', 
        name: 'Controlador Personalizado AR', 
        sku: 'AR-CTRL-V1', 
        stock: 5, 
        price: 3500.00, 
        cost: 1200.00, 
        category: 'Manufactura', 
        supplier: 'Interno',
        description: 'Dispositivo ensamblado internamente.',
        unit: 'Unidad',
        productType: 'Manufacturado',
    },
    { 
        id: 'CAM001', 
        name: 'Cámara Bullet 4MP', 
        sku: 'CCTV-BUL-4MP', 
        stock: 20, 
        price: 1200.00, 
        cost: 700.00, 
        category: 'CCTV', 
        supplier: 'Hikvision',
        description: 'Cámara de seguridad exterior.',
        unit: 'Pieza',
        productType: 'Producto',
    },
    { 
        id: 'DVR001', 
        name: 'DVR 8 Canales', 
        sku: 'CCTV-DVR-8CH', 
        stock: 8, 
        price: 2500.00, 
        cost: 1500.00, 
        category: 'CCTV', 
        supplier: 'Hikvision',
        description: 'Grabador digital de video.',
        unit: 'Pieza',
        productType: 'Producto',
    },
];

export const mockSales: Sale[] = [
    { 
        id: 'S001', 
        customerId: 'C001', 
        customerName: 'John Doe', 
        date: '2024-07-20', 
        total: 24500.00,
        subtotal: 24500.00,
        amountPaid: 24500.00,
        paymentStatus: 'Pagado',
        products: [
            { productId: 'P001', name: 'Laptop Pro 15"', quantity: 1, price: 24000.00, originalPrice: 24000.00 },
            { productId: 'P002', name: 'Wireless Mouse', quantity: 1, price: 500.00, originalPrice: 500.00 }
        ],
        type: 'Venta',
        status: 'Completed',
        notes: 'El cliente solicitó factura.'
    },
    { 
        id: 'S002', 
        customerId: 'C001', 
        customerName: 'John Doe', 
        date: '2024-08-01', 
        total: 10000.00, 
        subtotal: 10000.00,
        amountPaid: 2000.00,
        paymentStatus: 'Parcial',
        products: [
            { productId: 'P001', name: 'Laptop Pro 15" (Usada)', quantity: 1, price: 10000.00, originalPrice: 12000.00, discountApplied: 2000, discountType: 'amount' },
        ],
        type: 'Venta',
        status: 'Completed',
        notes: 'Venta a crédito. Restan $8,000. Descuento aplicado por detalle estético.'
    },
    { 
        id: 'Q001', 
        customerId: 'C003', 
        customerName: 'Tech Corp', 
        date: '2024-07-22', 
        total: 72000.00, 
        subtotal: 72000.00,
        amountPaid: 0,
        paymentStatus: 'Pendiente',
        products: [ { productId: 'P001', name: 'Laptop Pro 15"', quantity: 3, price: 24000.00, originalPrice: 24000.00 } ],
        type: 'Cotización',
        status: 'Pending'
    },
    // Mock Purchase on Credit
    { 
        id: 'PUR001', 
        customerId: 'SUP01', 
        customerName: 'Tech Supply Co.', 
        date: '2024-08-05', 
        total: 15000.00, 
        subtotal: 15000.00,
        amountPaid: 5000.00,
        paymentStatus: 'Parcial',
        products: [ { productId: 'M001', name: 'Lote Carcasas', quantity: 100, price: 150.00, originalPrice: 150.00 } ],
        type: 'Compra',
        status: 'Completed',
        notes: 'Compra de materia prima a crédito.'
    },
];

export const mockPromotions: Promotion[] = [
    {
        id: 'PROMO001',
        code: 'BUENFIN',
        name: 'Descuento Buen Fin',
        type: 'percent',
        value: 15,
        startDate: '2024-11-15',
        endDate: '2024-11-20',
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        description: '15% de descuento en toda la tienda.',
        active: true
    },
    {
        id: 'PROMO002',
        code: 'CCTV200',
        name: 'Cupón Instalación CCTV',
        type: 'amount',
        value: 200,
        startDate: '2024-08-01',
        endDate: '2024-12-31',
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        description: '$200 de descuento en mano de obra de CCTV.',
        active: true
    }
];

export const mockCustomers: Customer[] = [
    { 
        id: 'C001', 
        name: 'John Doe', 
        alias: 'Jhonny', 
        email: 'john.doe@example.com', 
        phone: '555-1234', 
        address: 'Av. Reforma 123, CDMX', 
        clientTypes: ['Comercial', 'Suscripción'],
        totalSpent: 36300.00, 
        lastPurchase: '2024-08-01', 
        notes: 'Cliente frecuente, paga puntual.',
        purchasedLicenses: 5 // Bought 5, used 1 in memberships
    },
    { 
        id: 'C002', 
        name: 'Jane Smith', 
        alias: 'Jan', 
        email: 'jane.smith@example.com', 
        phone: '555-5678', 
        address: 'Calle 5 de Mayo #40', 
        clientTypes: ['Comercial'],
        totalSpent: 1800.00, 
        lastPurchase: '2024-07-20', 
        notes: 'Prefiere contacto por WhatsApp.',
        purchasedLicenses: 0 
    },
    { 
        id: 'C003', 
        name: 'Tech Corp', 
        alias: 'Corporativo Tech', 
        email: 'contact@techcorp.com', 
        phone: '555-8765', 
        address: 'Parque Industrial Norte, Bodega 5', 
        clientTypes: ['Manufactura', 'Servicios'],
        totalSpent: 0, 
        lastPurchase: 'N/A',
        purchasedLicenses: 10 
    },
];

export const mockSuppliers: Customer[] = [
    { id: 'SUP01', name: 'Tech Supply Co.', alias: 'Proveedor Chips', email: 'sales@techsupply.com', phone: '111-2222', address: 'Silicon Valley Blvd, CA', clientTypes: ['Proveedor'], totalSpent: 50000.00, lastPurchase: '2024-07-15', notes: 'Proveedor principal de electrónicos. Da 30 días de crédito.', purchasedLicenses: 0 },
];

export const mockEmployees: Employee[] = [
    { 
        id: 'E001', 
        name: 'Carlos Rodriguez', 
        alias: 'Charly', 
        position: 'Gerente de Ventas', 
        email: 'carlos.r@example.com', 
        phone: '333-1111', 
        address: 'Col. Centro, Calle 1 #2', 
        hireDate: '2022-01-15', 
        paymentType: 'Mixto',
        baseSalary: 12000,
        commissionRate: 2.5,
        notes: 'Encargado de llave de almacén.' 
    },
    { 
        id: 'E002', 
        name: 'Ana López', 
        alias: 'Anita', 
        position: 'Técnico Instalador', 
        email: 'ana.l@example.com', 
        phone: '333-2222', 
        address: 'Av. Vallarta 500', 
        hireDate: '2023-05-10', 
        paymentType: 'Nomina',
        baseSalary: 10000,
        commissionRate: 0,
        notes: 'Especialista en CCTV.' 
    },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 'ATT001', employeeId: 'E001', date: '2024-08-01', status: 'Asistencia', checkInTime: '09:00', projectId: 'S001', projectName: 'Venta Laptop', activityLog: 'Supervisión en tienda' },
    { id: 'ATT002', employeeId: 'E002', date: '2024-08-01', status: 'Asistencia', checkInTime: '09:15', projectId: 'MO-2024-001', projectName: 'Controlador AR', activityLog: 'Instalación Proyecto Tech Corp' },
    { id: 'ATT003', employeeId: 'E001', date: '2024-08-02', status: 'Falta', activityLog: 'Sin aviso' },
    { id: 'ATT004', employeeId: 'E002', date: '2024-08-02', status: 'Asistencia', checkInTime: '09:00', activityLog: 'Configuración Servidor' },
];

export const mockLoans: Loan[] = [
    { id: 'L001', employeeId: 'E001', amount: 2000, date: '2024-08-01', type: 'Prestamo_Empresa_a_Empleado', status: 'Pendiente', notes: 'Adelanto de nómina' }
];

export const mockPayments: Payment[] = [
    { id: 'PAY001', employeeId: 'E001', amount: 15000, date: '2024-07-15', type: 'Nomina', description: 'Pago quincenal' },
];

export const mockToolAssignments: ToolAssignment[] = [
    {
        id: 'TA001',
        employeeId: 'E002',
        employeeName: 'Ana López',
        toolName: 'Taladro Percutor Bosch',
        serialNumber: 'BSH-998877',
        assignmentDate: '2024-05-12',
        condition: 'Buena',
        status: 'Asignada',
        notes: 'Taladro con batería extra y cargador. Entregado en maletín.'
    },
    {
        id: 'TA002',
        employeeId: 'E001',
        employeeName: 'Carlos Rodriguez',
        toolName: 'Laptop Dell Latitude',
        serialNumber: 'DLL-554433',
        assignmentDate: '2022-01-15',
        condition: 'Regular',
        status: 'Asignada',
        notes: 'Equipo de cómputo para ventas. Pantalla con leve rayón.'
    },
    {
        id: 'TA003',
        employeeId: 'E002',
        employeeName: 'Ana López',
        toolName: 'Multímetro Fluke',
        serialNumber: 'FLK-112233',
        assignmentDate: '2023-06-01',
        returnDate: '2024-01-10',
        condition: 'Buena',
        status: 'Devuelta',
        notes: 'Devuelto para calibración.'
    }
];

export const mockSupplierPayments: SupplierPayment[] = [
    { id: 'SPAY01', supplierId: 'SUP01', amount: 25000, date: '2024-07-10', invoiceId: 'INV-TS-1023' },
];

export const mockExpenses: Expense[] = [
    { id: 'EXP01', date: '2024-07-25', description: 'Renta de local', amount: 12000, category: 'Operativo' },
];

export const mockIncome: Income[] = [
    { id: 'INC01', date: '2024-07-26', description: 'Venta de equipo usado', amount: 5000, category: 'Otro' },
];


export const mockWastage: Wastage[] = [
    { id: 'WST01', productId: 'P002', productName: 'Wireless Mouse', quantity: 5, date: '2024-07-23', reason: 'Dañado en almacén' },
];

export const mockPlans: Plan[] = [
    {
        id: 'PLAN001',
        name: 'Plano Arquitectónico Residencia Doe',
        customerId: 'C001',
        customerName: 'John Doe',
        planType: 'Arquitectónico',
        architecturalData: 'Plano de 2 pisos.\n- 3 habitaciones',
        createdAt: '2024-07-28',
        notes: 'Pendiente revisión de medidas del patio.'
    },
];

export const mockNetworkMaps: NetworkMap[] = [
    {
        id: 'NET001',
        name: 'Red Local Oficina Principal',
        customerId: 'C003',
        customerName: 'Tech Corp',
        createdAt: '2024-07-30',
        networkType: 'LAN',
        description: 'Topología en estrella con switch central Cisco Catalyst.'
    },
];

export const mockReminders: Reminder[] = [
    { id: 'REM001', title: 'Llamar a proveedor Tech Supply Co.', dueDate: '2024-08-05', priority: 'Alta', status: 'Pendiente' },
];

export const mockSecurityAudits: SecurityAudit[] = [
    {
        id: 'AUD001',
        target: '192.168.1.1/24',
        auditType: 'Análisis de Vulnerabilidades',
        status: 'Completado',
        date: '2024-07-28',
        summary: 'Se realizó un escaneo de la red interna.',
        findings: []
    },
];

export const mockFiles: ManagedFile[] = [
    {
        id: 'FILE001',
        name: 'Instalador de Software Contable v2.5',
        type: 'Instalador',
        source: 'Local',
        path: 'Contabilidad_v2.5.exe',
        createdAt: '2024-08-01',
    },
];

export const mockRepositories: Repository[] = [
    {
        id: 'REPO001',
        name: 'ar-control-web',
        url: 'https://github.com/arcontrol/ar-control-web',
        language: 'TypeScript',
        description: 'Main dashboard application source code',
        status: 'Installed',
        localPath: '/home/admin/projects/ar-control-web'
    },
    {
        id: 'REPO002',
        name: 'network-scanner-tool',
        url: 'https://github.com/arcontrol/net-scan',
        language: 'Python',
        description: 'Utility scripts for network discovery',
        status: 'Installed',
        localPath: '/home/admin/projects/net-scan'
    },
    {
        id: 'REPO003',
        name: 'esp32-firmware',
        url: 'https://github.com/arcontrol/esp32-cam',
        language: 'C++',
        description: 'Firmware for custom surveillance cameras',
        status: 'Not Installed'
    }
];

export const mockMemberships: Membership[] = [
    {
        id: 'MEM001',
        customerId: 'C001',
        customerName: 'John Doe',
        serviceName: 'Streaming Premium',
        category: 'Combo (Mobile+TV)',
        startDate: '2024-07-01',
        endDate: '2024-08-01',
        cost: 120.00,
        paymentMethod: 'Efectivo',
        status: 'Activa',
        autoRenewal: true,
        notes: 'Cuenta Netflix 4 pantallas'
    },
];

export const mockManufacturingOrders: ManufacturingOrder[] = [
    {
        id: 'MO-2024-001',
        productToProduceId: 'PROD-CUSTOM',
        productName: 'Controlador Personalizado AR',
        quantity: 10,
        startDate: '2024-08-01',
        status: 'En Proceso',
        materials: [
            { materialId: 'M001', materialName: 'Carcasa de Aluminio', quantityRequired: 10 },
            { materialId: 'M002', materialName: 'Chipset Controlador', quantityRequired: 10 },
        ],
        notes: 'Pedido urgente para cliente VIP'
    }
];

export const mockCommunicationEvents: CommunicationEvent[] = [
    {
        id: 'EVT001',
        customerId: 'C001',
        type: 'Llamada',
        date: '2024-08-10',
        time: '10:00',
        status: 'Completado',
        notes: 'Seguimiento de preventa'
    }
];
