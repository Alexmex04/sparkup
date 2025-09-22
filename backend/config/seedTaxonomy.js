// backend/config/seedTaxonomy.js
import slugify from "slugify";
// En Tanda 1, SOLO tenemos Tag y Roadmap exportados:
import { Tag, Roadmap } from "../models/index.js";

const toSlug = (s) => slugify(s, { lower: true, strict: true, locale: "es" });

const TAGS = [
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
  // Otros
  "Finanzas para Micronegocios"
];

const ROADMAPS = [
  { title: "Excel para Finanzas", tags: ["Excel Básico","Excel Avanzado","Macros VBA","Modelado Financiero"] },
  { title: "Google Sheets para Negocios", tags: ["Google Sheets","Presupuestos","Flujo de Caja","Ahorro"] },
  { title: "Power BI Inicial", tags: ["Power BI","Análisis Financiero","Indicadores Económicos"] },
  { title: "Finanzas Personales", tags: ["Finanzas Personales","Ahorro","Presupuestos"] },
  { title: "Aprendiendo a llevar Presupuestos", tags: ["Presupuestos","Costos y Presupuestos","Flujo de Caja"] },
  { title: "Finanzas para Micronegocios", tags: ["Finanzas para Micronegocios","Contabilidad Básica","Análisis de Estados Financieros"] },
  { title: "Razones de Liquidez / Solvencia", tags: ["Razón Corriente","Prueba Ácida","Liquidez Inmediata","Capital de Trabajo","Índice de Solvencia"] },
  { title: "Razones de Endeudamiento", tags: ["Deuda Total / Activos","Deuda / Capital","Apalancamiento Financiero","Cobertura de Intereses","Deuda LP / Capital"] },
  { title: "Razones de Actividad / Productividad", tags: ["Rotación de Inventarios","Rotación de Cuentas por Cobrar","Periodo Medio de Cobro","Rotación de Cuentas por Pagar","Periodo Medio de Pago","Rotación de Activos Totales","Ciclo de Conversión de Efectivo"] },
  { title: "Razones de Rentabilidad / Resultado", tags: ["Margen Bruto","Margen Operativo","Margen Neto","ROA","ROE","Margen EBITDA","ROIC"] },
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
