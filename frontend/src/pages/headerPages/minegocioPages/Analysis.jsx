import "./Analysis.css";

const Analysis = ({ explain }) => {
  const metricNames = {
    RazonDeLiquidez: "Razón de Liquidez",
    CapitalDeTrabajo: "Capital de Trabajo",
    RazonDeEndeudamiento: "Razón de Endeudamiento",
    DeudaDePatrimonio: "Deuda de Patrimonio",
    RotacionDeInventario: "Rotación de Inventario",
    RotacionCuentasPorCobrar: "Rotación de Cuentas por Cobrar",
    RotacionDeActivos: "Rotación de Activos",
    MargenNeto: "Margen Neto",
    RendimientoSobreActivos: "Rendimiento sobre Activos",
    RendimientoSobrePatrimonio: "Rendimiento sobre Patrimonio"
  };

  const scores = {
    RazonDeLiquidez: "Mayor a 1.5 y menor que 5",
    CapitalDeTrabajo: "Mayor que 0",
    RazonDeEndeudamiento: "Mayor a 0 y menor que 0.5",
    DeudaDePatrimonio: "Menor que 1",
    RotacionDeInventario: "Mayor que 4",
    RotacionCuentasPorCobrar: "Mayor que 5",
    RotacionDeActivos: "Mayor que 1.5",
    MargenNeto: "Mayor que 0.1",
    RendimientoSobreActivos: "Mayor que 0.1",
    RendimientoSobrePatrimonio: "Mayor que 0.2"
  };

  if (!explain) return <div>No hay datos disponibles</div>;

  return (
    <>
    {/**<div>
      <h3 className='title-diagnostic'>Puntajes óptimos</h3>
      {Object.values(explain).map((item, index) => (
        <div key={index} className="metric-block">
          <div className="metric-name">
            <strong>{metricNames[item.metric] || item.metric}:</strong> 
          </div>
          <div className="metric-values">
            <div className="valor-obtenido">Valor Obtenido: {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}</div>
            <div className="rango-optimo">Rango Óptimo: {scores[item.metric] || 'N/A'}</div>
          </div>

 
        </div>
      ))}
    </div> */}
    




    </>
  );
};

export default Analysis;