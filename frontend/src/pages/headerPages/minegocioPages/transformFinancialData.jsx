export const transformFinancialData = (explain) => {
  if (!explain) return [];
  
  // Agrupar métricas por categorías
  const categorias = {
    'Liquidez': ['RazonDeLiquidez', 'CapitalDeTrabajo'],
    'Endeudamiento': ['RazonDeEndeudamiento', 'DeudaDePatrimonio'],
    'Eficiencia': ['RotacionDeInventario', 'RotacionCuentasPorCobrar', 'RotacionDeActivos'],
    'Rentabilidad': ['MargenNeto', 'RendimientoSobreActivos', 'RendimientoSobrePatrimonio']
  };

  const resultado = [];

  // Calcular promedio por categoría
  Object.entries(categorias).forEach(([categoria, metricas]) => {
    const metricasFiltradas = metricas
      .map(metrica => explain[metrica])
      .filter(Boolean);  

    if (metricasFiltradas.length > 0) {
      const promedio = metricasFiltradas.reduce((sum, metrica) => sum + metrica.score, 0) / metricasFiltradas.length;
      
      resultado.push({
        name: categoria,
        value: Math.round(promedio),  
        metrics: metricasFiltradas  
      });
    }
  });

  return resultado;
};