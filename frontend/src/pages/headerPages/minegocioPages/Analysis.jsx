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
    <div>
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
    </div>


    <div className="detailed-analysis">
       <h3 className='title-diagnostic'>Análisis Detallado y recomendaciones </h3>
      {Object.values(explain).map((item, index) => (
        <div key={index} className="detailed-metric">
          <strong>{metricNames[item.metric] || item.metric}:</strong> 
          <span>{item.explanation}</span>
        </div>
      ))}
    </div>


    <div className="explanation-section">
      <h3 className='title-diagnostic'>Explicación</h3>
      <div className="explanation-block">
        <strong>Sistema experto:</strong>
        <p>Se basa en fórmulas contables rígidas.</p>
        <p>Penaliza mucho a los ratios.</p>
      </div>

      <div className="explanation-block">
        <strong>Modelo de machine learning:</strong>
        <p>Se basa en patrones de datos históricos.</p>
        <p>Puede que, aunque los ratios se vean malos, en los datos de entrenamiento haya casos similares que sobrevivieron</p>
      </div>


      <div className="explanation-block">
        <strong>Razón de Liquidez:</strong>
        <p>Capacidad de pagar deudas a corto plazo. Ideal: 1.5-5</p>
      </div>

      <div className="explanation-block">
        <strong>Capital de Trabajo:</strong>
        <p>Excedente después de pagar deudas inmediatas. Ideal: Mayor a 0</p>
      </div>

      <div className="explanation-block">
        <strong>Razón de Endeudamiento:</strong>
        <p>Porcentaje de activos financiados con deuda. Ideal: Menor al 50%</p>
      </div>

      <div className="explanation-block">
        <strong>Deuda de Patrimonio:</strong>
        <p>Comparación entre deuda y capital propio. Ideal: Menor a 1</p>
      </div>

      <div className="explanation-block">
        <strong>Rotación de Inventario:</strong>
        <p>Veces que se renueva el inventario al año. Ideal: Mayor a 4</p>
      </div>

      <div className="explanation-block">
        <strong>Rotación de Cuentas por Cobrar:</strong>
        <p>Velocidad de cobro a clientes. Ideal: Mayor a 5</p>
      </div>

      <div className="explanation-block">
        <strong>Rotación de Activos:</strong>
        <p>Eficiencia en uso de activos para generar ventas. Ideal: Mayor a 1.5</p>
      </div>

      <div className="explanation-block">
        <strong>Margen Neto:</strong>
        <p>Ganancia después de todos los gastos. Ideal: Mayor al 10%</p>
      </div>

      <div className="explanation-block">
        <strong>Rendimiento sobre Activos:</strong>
        <p>Utilidad generada por cada peso en activos. Ideal: Mayor al 10%</p>
      </div>

      <div className="explanation-block">
        <strong>Rendimiento sobre Patrimonio:</strong>
        <p>Rentabilidad para los dueños. Ideal: Mayor al 20%</p>
      </div>
    </div>

    </>
  );
};

export default Analysis;