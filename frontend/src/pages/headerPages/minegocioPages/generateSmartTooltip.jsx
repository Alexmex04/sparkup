export const generateSmartTooltip = (details) => {
  const metrics = Object.values(details);
  const buenos = metrics.filter(m => m.rating === "Bueno").length;
  const regulares = metrics.filter(m => m.rating === "Regular").length;
  const malos = metrics.filter(m => m.rating === "Malo").length;
  
  // Traducir nombres de métricas a español
  const traducirMetrica = (metric) => {
    const traducciones = {
      'RazonDeLiquidez': 'Liquidez',
      'CapitalDeTrabajo': 'Capital de trabajo',
      'RazonDeEndeudamiento': 'Endeudamiento',
      'DeudaDePatrimonio': 'Deuda/Patrimonio',
      'RotacionDeInventario': 'Rotación inventario',
      'RotacionCuentasPorCobrar': 'Rotación cuentas',
      'RotacionDeActivos': 'Rotación activos',
      'MargenNeto': 'Margen neto',
      'RendimientoSobreActivos': 'Rendimiento activos',
      'RendimientoSobrePatrimonio': 'Rendimiento patrimonio'
    };
    return traducciones[metric] || metric;
  };

  // Detectar fortalezas (solo "Bueno")
  const metricasBuenas = metrics
    .filter(m => m.rating === "Bueno")
    .map(m => traducirMetrica(m.metric));

  // Métricas regulares
  const metricasRegulares = metrics
    .filter(m => m.rating === "Regular")
    .map(m => traducirMetrica(m.metric));

  // Métricas críticas
  const metricasCriticas = metrics
    .filter(m => m.rating === "Malo")
    .map(m => traducirMetrica(m.metric));

  return (
    <span className="info-tooltip-text">
      <strong>📊 Resumen del Análisis</strong><br/>
      • {buenos} óptimos ✅<br/>
      {regulares > 0 && <>• {regulares} regulares ⚠️<br/></>}
      • {malos} por mejorar ❌<br/>
      <br/>
      
     {metricasBuenas.length > 0 && (
  <>
    <strong>Fortalezas:</strong><br/>
    {metricasBuenas.map((metrica, index) => (
      <div key={index}>• {metrica}</div>
    ))}
    <br/>
  </>
)}

{metricasRegulares.length > 0 && (
  <>
    <strong>En observación:</strong><br/>
    {metricasRegulares.map((metrica, index) => (
      <div key={index}>• {metrica}</div>
    ))}
    <br/>
  </>
)}

{metricasCriticas.length > 0 && (
  <>
    <strong>Áreas críticas:</strong><br/>
    {metricasCriticas.map((metrica, index) => (
      <div key={index}>• {metrica}</div>
    ))}
  </>
)}
    </span>
  );
};