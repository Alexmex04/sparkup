

const financialKnowledgeBase = {
  metrics: {
    //Metricas de liquidez
    RazonDeLiquidez: {
      name: "Razon de Liquidez (Current Ratio)",
      description: "Mide la capacidad de pagar obligaciones a corto plazo",
      formula: "Activo Corriente / Pasivo Corriente",
      interpretation: {
        ranges: [
          { condition: (value) => value < 1 || value > 5, rating: "Malo", score: 20, explanation: "No puede cubrir deudas a corto plazo, se debe renegociar deudas urgentemente." },
          { condition: (value) => value >= 1 && value < 1.5, rating: "Regular", score: 60, explanation: "Capacidad mínima adecuada para deudas a corto plazo, se debe optmizar la línea de crédito preventiva." },
          { condition: (value) => value >= 1.5 && value <= 5, rating: "Bueno", score: 100, explanation: "Posición líquida saludable, se debe mantener las políticas actuales." }
        ]
      },
      weight: 0.1
    },
   
    CapitalDeTrabajo:{
      name: "Capital de trabajo",
      description: "Colchon operativo de corto plazo.",
      formula: "Activo Corriente - Pasivo Corriente",
      interpretation: {
        ranges: [
         
           { condition: (value) => value < 0, rating: "Malo", score: 20, explanation: "Riesgo alto de no poder pagar obligaciones inmediatas, se requiere financiación externa."},
            { condition: (value) => value === 0, rating: "Regular", score: 60, explanation: "Justo alcanza para cubrir las deudas a corto plazo, se debe optimizar el control de flujo de caja."},
          { condition: (value) => value > 0, rating: "Bueno", score: 100, explanation: "La empresa tiene excedente después de cubrir todas sus deudas a corto plazo."}
        ]
      },
      weight: 0.1
    },
    //Endeudamiento
    RazonDeEndeudamiento:{
      name: "Razon De Endeudamiento",
      description: "Que parte de los activos se financia con deuda.",
      formula: "Pasivo_Total_financiado / Activo_Total_financiado",
      interpretation: {
        ranges: [
           { condition: (value) => value > 0.7 || value < 0, rating: "Malo", score: 20, explanation: "Deuda demasiada alta, se debe disminuir apalancamiento y usar utilidades para reducir pasivos."},
            { condition: (value) => value >= 0.5 && value <= 0.7, rating: "Regular", score: 60, explanation: "Nivel de deuda aceptable, se debe buscar financiar con capital propio."},
          { condition: (value) => value > 0 && value < 0.5, rating: "Bueno", score: 100, explanation: "Buena independencia financiera, se tiene la capacidad de tomar deuda si es necesario."}
        ]
      },
       weight: 0.1
    },
    
    DeudaDePatrimonio:{
      name: "Deuda De Patrimonio",
      description: "Deuda relativa al capital propio",
      formula: "Total Pasivos / (Total activo -Total Pasivo)",
      interpretation: {
        ranges: [
           { condition: (value) => value > 1.5, rating: "Malo", score: 20, explanation: "La deuda es mucho mayor que el capital propio, se debe aumentar el capital social y retener utilidades en lugar de distribuirlas."},
            { condition: (value) => value >= 1 && value < 1.5, rating: "Regular", score: 60, explanation: "La deuda es similar o un poco mayor al capital, se debe mantener el equilibrio."},
          { condition: (value) => value < 1, rating: "Bueno", score: 100, explanation: "El capital propio es mayor que la deuda."}
        ]
      },
       weight: 0.1
    },
    RotacionDeInventario:{
      name: "Rotacion De Inventario",
      description: "Cuántas veces se vende/renueva el inventario en el periodo.",
      formula: "COGS / Inventario_Promedio",
      interpretation: {
        ranges: [
          { condition: (value) => value < 2, rating: "Malo", score: 20, explanation: "Rotación de inventario lenta, se deben mejorar pronósticos y esquemas de inventario."},
          { condition: (value) => value >= 2 && value <= 4, rating: "Regular", score: 60, explanation: "El inventario se renueva moderadamente, se necesita optimizar el pronóstico de demanda."},
          { condition: (value) => value > 4, rating: "Bueno", score: 100, explanation: "El inventario se renueva rápidamente. "}
        ]
      },
       weight: 0.1
    },
    RotacionCuentasPorCobrar:{
      name: "Rotacion Cuentas Por Cobrar",
      description: "Velocidad de cobro a clientes",
      formula: "Ventas_a_Credito / Cuentas_por_Cobrar_Promedio",
      interpretation: {
        ranges: [
          { condition: (value) => value < 2, rating: "Malo", score: 20, explanation: "Mucho dinero esperando por cobrar, se deben de revisar políticas de crédito."},
          { condition: (value) => value >= 2 && value <= 5, rating: "Regular", score: 60, explanation: "Se deben fortalecer procesos de cobro y segumiento."},
          { condition: (value) => value > 5, rating: "Bueno", score: 100, explanation: "Se tiene una gestión eficiente de cobranza."}
        ]
      },
       weight: 0.1
    },
    RotacionDeActivos:{
      name: "Rotacion de activos",
      description: "Eficiencia en el uso de activos para generar ventas.",
      formula: "Ventas_Totales / Activo_Total",
      interpretation: {
        ranges: [
        { condition: (value) => value < 0.5, rating: "Malo", score: 20, explanation: "Los activos no están generando suficientes ventas, se debe mejorar la eficiencia productiva." },
        { condition: (value) => value >= 0.5 && value <= 1.5, rating: "Regular", score: 60, explanation: "Uso moderado de los activos para generar ventas, se debe identificar activos para optimizar." },
        { condition: (value) => value > 1.5, rating: "Bueno", score: 100, explanation: "Se tiene alta eficiencia en el uso de activos." }
    
        ]
      },
      weight: 0.1
    },
    MargenNeto: {
      name: "Margen neto",
      description: "Rentabilidad final despues de todos los gastos e impuestos.",
      formula: "Utilidad_Neta / Ventas_Totales",
      interpretation: {
        ranges: [
        { condition: (value) => value < 0.05, rating: "Malo", score: 20, explanation: "Muy poca ganancia después de todos los gastos, se debe revisar la estructura de costos y estrategia de precios." },
        { condition: (value) => value >= 0.05 && value <= 0.10, rating: "Regular", score: 60, explanation: "Rentabilidad aceptable, se debe buscar eficiencias operativas y reducción de costos." },
        { condition: (value) => value > 0.10, rating: "Bueno", score: 100, explanation: "Rentabilidad sólida y eficiente, se tiene capacidad para reinversión." }
    
        ]
      },
      weight: 0.1
    },
    
    RendimientoSobreActivos: {
      name: "Rendimiento Sobre Activos",
      description: "Utilidad generada por cada peso en activos.",
      formula: "Utilidad_Neta / Activo_Total",
      interpretation: {
        ranges: [
        { condition: (value) => value < 0.05, rating: "Malo", score: 20, explanation: "Activos poco productivos, se debe evaluar todas las inversiones en activos." },
        { condition: (value) => value >= 0.05 && value <= 0.10, rating: "Regular", score: 60, explanation: "Rentabilidad aceptable de los activos, se debe optimizar la utilización de capacidad instalada." },
        { condition: (value) => value > 0.10, rating: "Bueno", score: 100, explanation: "Alta eficiencia en el uso de activos, se puede considerar la expansión." }
    
        ]
      },
      weight: 0.1
    },
    RendimientoSobrePatrimonio: {
      name: "Rendimiento Sobre Patrimonio",
      description: "Utilidad para los propietarios por cada peso invertido.",
      formula: "Utilidad_Neta / Patrimonio",
      interpretation: {
        ranges: [
          { condition: (value) => value < 0.10, rating: "Malo", score: 20, explanation: "Baja rentabilidad para el propietario, se debe revisar la estrategia de negocio." },
          { condition: (value) => value >= 0.10 && value <= 0.20, rating: "Regular", score: 60, explanation: "Rentabilidad aceptable, se tiene que balancear el crecimiento con el retorno esperado." },
          { condition: (value) => value > 0.20, rating: "Bueno", score: 100, explanation: "Excelente rentabilidad para los propietarios." }
      
        ]
      },
      weight: 0.1
    }




 
  },





  scoringSystem: {
    overallRating: [
      { min: 0, max: 40, rating: "Crítico" },
      { min: 40, max: 70, rating: "Regular" },
      { min: 70, max: Infinity, rating: "Saludable" }
    ]
  }
};


function evaluateMetric(metricName, value) {
  const metric = financialKnowledgeBase.metrics[metricName];
  
  if (!metric) {
    throw new Error(`Métrica ${metricName} no encontrada en la base de conocimiento`);
  }

  const range = metric.interpretation.ranges.find(r => 
  r.condition(value)
);

  if (!range) {
    throw new Error(`Valor ${value} fuera de rangos definidos para ${metricName}`);
  }

  return {
    metric: metricName,
    value: value,
    rating: range.rating,
    score: range.score,
    explanation: range.explanation,
    weight: metric.weight
  };
}


function calculateOverallScore(metricsResults) {
  try{
let weightedSum = 0;
  let totalWeight = 0;
  
  for (const metric in metricsResults) {
    weightedSum += metricsResults[metric].score * metricsResults[metric].weight;
    totalWeight += metricsResults[metric].weight;
  }

  const overallScore = Math.round(weightedSum / totalWeight);
  
  const overallRating = financialKnowledgeBase.scoringSystem.overallRating.find(
    r => overallScore >= r.min && overallScore < r.max
  );

      if (!overallRating) {
      return {
        score: overallScore,
        rating: "No definido",
        explanation: `Score ${overallScore} fuera de los rangos definidos`
      };
    }

  return {
    score: overallScore,
    rating: overallRating.rating
  };



  }catch(error){
    console.log(error);
    return error;
  }
  
}



export function evaluateFinancials(data) {
  try{
 const results = {
    details: {},
    overall: {}
  };


    //guardar los resultados de las formulas
    const razonliquidez = parseFloat(parseFloat(data.activo_corriente) / parseFloat(data.pasivo_corriente));   //Activo_Corriente / Pasivo_Corriente
    const capitaltrabajo = parseFloat(parseFloat(data.activo_corriente) - parseFloat(data.pasivo_corriente));  //Total de Activos - Total de Pasivos

    const RazonEndeudamiento = parseFloat(parseFloat(data.total_pasivos)/parseFloat(data.total_activos)); //Pasivo_Total_financiado / Activo_Total_financiado
    const deudaPatrimonio = parseFloat(parseFloat(data.total_pasivos)/ (parseFloat(data.total_activos)-parseFloat(data.total_pasivos)));   //Total Pasivos / (Total activo -Total Pasivo)
    
    const inventario_promedio = parseFloat((parseFloat(data.inventario_inicial)+parseFloat(data.inventario_final)/2))
    const Rotacioninventario = parseFloat(parseFloat(data.costo_ventas)/ parseFloat(inventario_promedio) ); //COGS / Inventario_Promedio
    const RotacionCuentas = parseFloat(parseFloat(data.ventas_credito)/parseFloat(data.cuentas_por_cobrar));   //Ventas_a_Crédito / Cuentas_por_Cobrar_Promedio
    const RotacionActivos = parseFloat(parseFloat(data.ventas_totales)/parseFloat(data.total_activos)); //Ventas_Totales / Activo_Total
  
    const MargenNe = parseFloat(parseFloat(data.utilidad_neta)/parseFloat(data.ventas_totales));  //Utilidad_Neta / Ventas_Totales
    const RendimientoActivos = parseFloat(parseFloat(data.utilidad_neta)/parseFloat(data.total_activos));  //Utilidad_Neta / Activo_Total
    const RendimientoPatrimonio = parseFloat(parseFloat(data.utilidad_neta)/parseFloat(data.patrimonio)); //Utilidad_Neta / Patrimonio


    //Evaluar metricas
    results.details.RazonDeLiquidez = evaluateMetric('RazonDeLiquidez',  razonliquidez);
    results.details.CapitalDeTrabajo = evaluateMetric('CapitalDeTrabajo', capitaltrabajo);

    results.details.RazonDeEndeudamiento = evaluateMetric('RazonDeEndeudamiento',  RazonEndeudamiento);
    results.details.DeudaDePatrimonio = evaluateMetric('DeudaDePatrimonio',  deudaPatrimonio);

    results.details.RotacionDeInventario = evaluateMetric('RotacionDeInventario',  Rotacioninventario);
    results.details.RotacionCuentasPorCobrar = evaluateMetric('RotacionCuentasPorCobrar',  RotacionCuentas);
    results.details.RotacionDeActivos = evaluateMetric('RotacionDeActivos',  RotacionActivos);

    results.details.MargenNeto = evaluateMetric('MargenNeto',  MargenNe); 
    results.details.RendimientoSobreActivos = evaluateMetric('RendimientoSobreActivos',  RendimientoActivos); 
    results.details.RendimientoSobrePatrimonio = evaluateMetric('RendimientoSobrePatrimonio',  RendimientoPatrimonio); 
  // Calcular score global
  results.overall = calculateOverallScore(results.details);

  return results;
  }catch(error){
    console.log(error);
    return error;
  }
 
}