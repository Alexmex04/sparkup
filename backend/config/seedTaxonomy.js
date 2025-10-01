// backend/config/seedTaxonomy.js
import slugify from "slugify";
// En Tanda 1, SOLO tenemos Tag y Roadmap exportados:
import { Tag, Roadmap } from "../models/index.js";

const toSlug = (s) => slugify(s, { lower: true, strict: true, locale: "es" });

const TAGS = [
  //GENERALES
  "Excel Básico","Excel Avanzado","Macros VBA","Modelado Financiero","Power BI",
  "Google Sheets","Presupuestos","Flujo de Caja","Ahorro","Finanzas Personales",
  "Contabilidad Básica","Análisis de Estados Financieros","Análisis Financiero","Costos y Presupuestos",
  "Indicadores Económicos",

  // Razones: Liquidez / Solvencia
  "Razón Corriente","Prueba Ácida","Liquidez Inmediata","Capital de Trabajo","Índice de Solvencia",

  // Razones: Endeudamiento
  "Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses","Deuda LP / Capital",

  // Razones: Actividad / Productividad
  "Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro",
  "Rotación de Cuentas por Pagar","Periodo Medio de Pago","Rotación de Activos Totales","Ciclo de Conversión de Efectivo",

  // Razones: Rentabilidad / Resultado
  "Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC",

  // Otros (educación financiera y herramientas; optimizados para búsqueda en YouTube)
  "Finanzas para Micronegocios", "Presupuesto personal 50/30/20","Fondo de emergencia 3-6 meses","Interés compuesto explicado",
  "Ahorro automático","Ahorro para metas SMART","Control de gastos diarios","Deudas método bola de nieve","Deudas método avalancha",
  "Buró de crédito México","Tarjeta de crédito responsable","Refinanciamiento de deudas","Crédito personal México","Inflación y poder adquisitivo","Inversión básica para principiantes",
  "CETES Directo paso a paso","Bonos gubernamentales México","ETF S&P 500 para principiantes", "Fondos índice México",
  "Riesgo vs rendimiento","Diversificación de portafolio","Horizonte de inversión","Intermediarios bursátiles México","AFORE cómo elegir","Retiro AFORE aportaciones voluntarias",
  "Pensión y retiro México","Declaración anual personas físicas","ISR personas físicas México","Factura SAT en línea","Inscripción RFC SAT","Régimen de confianza (RESICO)",
  "Impuestos para freelancers México","Comprobantes fiscales CFDI","Punto de equilibrio","Precio de venta y margen","Costos fijos y variables","Cuentas por cobrar y pagar","Capital de trabajo",
  "Control de inventarios PyME","Excel finanzas para principiantes","Plantilla presupuesto en Excel","Tablas dinámicas Excel","Google Sheets presupuesto",
  "Power BI finanzas básico","Dashboard financiero Power BI","Google Looker Studio finanzas","Análisis de sensibilidad financiero","Modelado financiero básico","Simulación escenarios finanzas",
  "Planeación financiera familiar","Presupuesto por categorías","Metodología Kakebo","Regla del 24 horas (compras)","Educación financiera para adolescentes","Seguro de gastos médicos básico",
  "Seguro de auto y deducibles","Crédito hipotecario México","Hipoteca vs rentar","Enganche y CAT","Transferencias SPEI y seguridad","Fraudes financieros comunes",
  "Protección de datos bancarios","Power Query finanzas","Power Pivot básico","Excel macros finanzas (VBA)",
  "Funciones financieras en Excel VNA y Tir","Conectar Excel a Power BI","Power Query limpiar y transformar datos","Modelado estrella en Power BI","Calendario de fechas DAX","DAX medidas básicas (SUM, CALCULATE)","DAX Time Intelligence (YTD, MTD)",
  "KPI financieros en Power BI","Formato moneda MXN en Power BI","Publicar y actualizar en Power BI Service",
  "Flujo de caja (cash flow)","Plan de negocios simple","Fijación de precios PyME","Flujo de caja PyME",
  "Metas financieras a corto, mediano y largo plazo","Estado de resultados explicado","Balance general explicado","Estado de flujo de efectivo"
];

const ROADMAPS = [
  // Excel para Finanzas — ruta progresiva y accionable
  { title: "Excel para Finanzas", tags: [
    "Excel finanzas para principiantes",
    "Plantilla presupuesto en Excel",
    "Funciones financieras en Excel VNA y Tir",
    "Tablas dinámicas Excel",
    "Power Query finanzas",
    "Power Pivot básico",
    "Modelado financiero básico",
    "Análisis de sensibilidad financiero",
    "Simulación escenarios finanzas"
  ]},

  // Google Sheets
  { title: "Google Sheets para Negocios", tags: [
    "Google Sheets",
    "Presupuestos",
    "Flujo de caja (cash flow)", 
    "Ahorro"
  ]},

  // Power BI Inicial — ruta inicial-intermedio
  { title: "Power BI Inicial", tags: [
    "Power BI finanzas básico",
    "Conectar Excel a Power BI",
    "Power Query limpiar y transformar datos",
    "Modelado estrella en Power BI",
    "Calendario de fechas DAX",
    "DAX medidas básicas (SUM, CALCULATE)",
    "DAX Time Intelligence (YTD, MTD)",
    "KPI financieros en Power BI",
    "Formato moneda MXN en Power BI",
    "Dashboard financiero Power BI",
    "Publicar y actualizar en Power BI Service"
  ]},

  // Finanzas Personales
  { title: "Finanzas Personales", tags: [
    "Ahorro",
    "Presupuestos",
    "Presupuesto personal 50/30/20",
    "Fondo de emergencia 3-6 meses",
    "Interés compuesto explicado",
    "Ahorro automático"
  ]},

  // Presupuestos
  { title: "Aprendiendo a llevar Presupuestos", tags: [
    "Presupuesto personal 50/30/20",       
    "Ahorro automático",
    "Ahorro para metas SMART",
    "Plantilla presupuesto en Excel",
    "Costos fijos y variables",
    "Precio de venta y margen",
    "Flujo de caja (cash flow)",
    "Punto de equilibrio"
  ]},

  // Micronegocios
  { title: "Finanzas para Micronegocios", tags: [
    "Plan de negocios simple",
    "Fijación de precios PyME",
    "Costos fijos y variables",
    "Punto de equilibrio",
    "Flujo de caja PyME",
    "Cuentas por cobrar y pagar",
    "Control de inventarios PyME",
    "Capital de trabajo",
    "Análisis de Estados Financieros"      
  ]},

  // Razones: Liquidez / Solvencia
  { title: "Razones de Liquidez / Solvencia", tags: [
    "Razón Corriente","Prueba Ácida","Liquidez Inmediata","Capital de Trabajo","Índice de Solvencia"
  ]},

  // Razones: Endeudamiento
  { title: "Razones de Endeudamiento", tags: [
    "Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses","Deuda LP / Capital"
  ]},

  // Razones: Actividad / Productividad
  { title: "Razones de Actividad / Productividad", tags: [
    "Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro",
    "Rotación de Cuentas por Pagar","Periodo Medio de Pago","Rotación de Activos Totales","Ciclo de Conversión de Efectivo"
  ]},

  // Razones: Rentabilidad / Resultado
  { title: "Razones de Rentabilidad / Resultado", tags: [
    "Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC"
  ]},


  { title: "Ahorro SMART", tags: [
    "Metas financieras a corto, mediano y largo plazo",
    "Presupuesto personal 50/30/20",
    "Control de gastos diarios",
    "Fondo de emergencia 3-6 meses",
    "Ahorro automático",
    "Interés compuesto explicado"
  ]},

  { title: "Sal de deudas (ruta práctica)", tags: [
    "Buró de crédito México","Deudas método bola de nieve","Deudas método avalancha","Tarjeta de crédito responsable","Refinanciamiento de deudas","Crédito personal México"
  ]},

  { title: "Ahorro e inversión básica en México", tags: [
    "Fondo de emergencia 3-6 meses","CETES Directo paso a paso","Bonos gubernamentales México",
    "ETF S&P 500 para principiantes","Fondos índice México","Riesgo vs rendimiento",
    "Diversificación de portafolio","Horizonte de inversión","Intermediarios bursátiles México"
  ]},

  { title: "Impuestos esenciales para freelancers (MX)", tags: [
    "Inscripción RFC SAT","Régimen de confianza (RESICO)","Factura SAT en línea",
    "ISR personas físicas México","Declaración anual personas físicas",
    "Comprobantes fiscales CFDI","Impuestos para freelancers México"
  ]},

  { title: "Tu retiro en México paso a paso", tags: [
    "AFORE cómo elegir","Retiro AFORE aportaciones voluntarias","Pensión y retiro México",
    "Inversión básica para principiantes","ETF S&P 500 para principiantes"
  ]},

  { title: "Finanzas para micronegocios (operación)", tags: [
    "Plan de negocios simple","Fijación de precios PyME","Punto de equilibrio",
    "Flujo de caja (cash flow)",
    "Cuentas por cobrar y pagar","Control de inventarios PyME","Capital de trabajo"
  ]},

  { title: "Contabilidad y análisis financiero básico", tags: [
    "Contabilidad Básica",
    "Estado de resultados explicado",
    "Balance general explicado",   
    "Estado de flujo de efectivo",    
    "Razón Corriente","Prueba Ácida","ROA","ROE","Margen EBITDA","Ciclo de Conversión de Efectivo","Rotación de Inventarios"
  ]},

  { title: "Herramientas: Excel + Sheets + BI", tags: [
    "Excel finanzas para principiantes","Plantilla presupuesto en Excel","Tablas dinámicas Excel",
    "Google Sheets presupuesto","Power BI finanzas básico","Dashboard financiero Power BI",
    "Power Query finanzas","Power Pivot básico","Google Looker Studio finanzas"
  ]},

  { title: "Modelado financiero para principiantes", tags: [
    "Modelado financiero básico","Análisis de sensibilidad financiero","Simulación escenarios finanzas",
    "Punto de equilibrio","Precio de venta y margen","Costos fijos y variables"
  ]},

  { title: "Planeación financiera familiar", tags: [
    "Planeación financiera familiar","Presupuesto por categorías","Metodología Kakebo",
    "Regla del 24 horas (compras)","Ahorro para metas SMART","Seguro de gastos médicos básico","Seguro de auto y deducibles"
  ]},

  { title: "Crédito hipotecario sin sorpresas (MX)", tags: [
    "Crédito hipotecario México","Hipoteca vs rentar","Enganche y CAT","Inflación y poder adquisitivo"
  ]},

  { title: "Seguridad financiera digital", tags: [
    "Transferencias SPEI y seguridad","Fraudes financieros comunes","Protección de datos bancarios"
  ]},

  { title: "Excel y VBA para finanzas (ruta técnica)", tags: [
    "Excel finanzas para principiantes","Tablas dinámicas Excel","Excel macros finanzas (VBA)","Power Query finanzas","Power Pivot básico"
  ]}
];

/** FASE 1: siembra solo catálogos (Tanda 1) */
export async function seedTagsAndRoadmaps() {
  const tagMap = {};
  for (const name of TAGS) {
    const [row] = await Tag.upsert({ name, slug: toSlug(name) });
    tagMap[name] = row;
  }

  for (const rm of ROADMAPS) {
    await Roadmap.upsert({ title: rm.title, slug: toSlug(rm.title) });
  }

  console.log("[seed] Catálogos Tag/Roadmap listos (fase 1).");
}

/** FASE 2: enlaza roadmaps con tags (requiere RoadmapTag ya creado en Tanda 2) */
export async function seedRoadmapTagLinks() {
  // Importa RoadmapTag SOLO aquí (ya existe en Tanda 2)
  const { RoadmapTag, Roadmap, Tag } = await import("../models/index.js");

  // obtén ids reales
  const tags = await Tag.findAll();
  const tagByName = new Map(tags.map(t => [t.name, t.id]));

  const roadmaps = await Roadmap.findAll();
  const rmByTitle = new Map(roadmaps.map(r => [r.title, r.id]));

  // limpia y vuelve a crear enlaces
  await RoadmapTag.destroy({ where: {} });

  const links = [];
  for (const rm of ROADMAPS) {
    const rmId = rmByTitle.get(rm.title);
    if (!rmId) continue;
    for (const name of rm.tags) {
      const tagId = tagByName.get(name);
      if (tagId) links.push({ roadmapId: rmId, tagId });
    }
  }
  if (links.length) await RoadmapTag.bulkCreate(links, { ignoreDuplicates: true });

  console.log("[seed] Enlaces Roadmap↔Tag listos (fase 2).");
}
