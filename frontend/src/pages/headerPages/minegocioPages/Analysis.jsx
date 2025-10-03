import { useState } from 'react';
import "./Analysis.css";
import FinancialIndicatorsChart from './FinancialIndicatorsChart';
import { transformFinancialData } from "./transformFinancialData";

const Analysis = ({ explain }) => {
  const [chartType, setChartType] = useState('general');


   const getChartData = () => {
    if (!explain) return [];
    
    if (chartType === 'general') {
      return transformFinancialData(explain);
    } else {
      // Filtrar datos por categoría específica
      const categorias = {
        'liquidez': ['RazonDeLiquidez', 'CapitalDeTrabajo'],
        'endeudamiento': ['RazonDeEndeudamiento', 'DeudaDePatrimonio'],
        'eficiencia': ['RotacionDeInventario', 'RotacionCuentasPorCobrar', 'RotacionDeActivos'],
        'rentabilidad': ['MargenNeto', 'RendimientoSobreActivos', 'RendimientoSobrePatrimonio']
      };

      const metricas = categorias[chartType] || [];
      return metricas
        .map(metrica => explain[metrica])
        .filter(Boolean)
        .map(metric => ({
          name: metric.metric,
          value: metric.score,
          result: metric.value
        }));
        
    }
  };

    const getChartTitle = () => {
    const titulos = {
      'general': 'Análisis General Financiero',
      'liquidez': 'Análisis de Liquidez',
      'endeudamiento': 'Análisis de Endeudamiento', 
      'eficiencia': 'Análisis de Eficiencia Operativa',
      'rentabilidad': 'Análisis de Rentabilidad'
    };
    return titulos[chartType] || 'Análisis Financiero';
  };

  if (!explain) return <div>No hay datos disponibles</div>;

  return (
    <>
<select 
          id="chart-select"
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
        
          className='select-analysis1'
        >
          <option value="general">General</option>
          <option value="liquidez">Liquidez</option>
          <option value="endeudamiento">Endeudamiento</option>
          <option value="eficiencia">Eficiencia Operativa</option>
          <option value="rentabilidad">Rentabilidad</option>
        </select>
       
         

         <div className='div-analysis'>
          <h3 className='text-analysis'>
          {getChartTitle()}
        </h3>


          {chartType==='general' && (
            <div className='center-info'>
              <span className="info-tooltip-icon">?
                  <span className="info-tooltip-text">
                  Este gráfico muestra el resultado global de tu negocio en 
                  cuatro áreas clave: <b>liquidez</b>, <b>endeudamiento</b>, <b>eficiencia</b> y <b>rentabilidad</b>.
                  Cada barra representa el puntaje promedio de sus indicadores.
                  </span>
                </span>
            </div>
          )}
                    
          {chartType === 'liquidez' && (
            <div>
              <span className="info-tooltip-icon">?
                <span className="info-tooltip-text">
                  
                  La <b>liquidez</b> refleja tu capacidad para cubrir deudas a corto plazo. 
                  Incluye la Razón de Liquidez y el Capital de Trabajo.
                </span>
              </span>
            </div>
          )}

          {chartType === 'endeudamiento' && (
            <div>
              <span className="info-tooltip-icon">?
                <span className="info-tooltip-text">
                  
                  El <b>endeudamiento</b> mide cuánto depende tu negocio de financiamiento externo. 
                  Incluye la Razón de Endeudamiento y la Deuda sobre Patrimonio.
                </span>
              </span>
            </div>
          )}

          {chartType === 'eficiencia' && (
            <div>
              <span className="info-tooltip-icon">?
                <span className="info-tooltip-text">
                  
                  La <b>eficiencia</b> muestra qué tan bien usas tus recursos. 
                  Considera la rotación de inventario, cuentas por cobrar y activos.
                </span>
              </span>
            </div>
          )}

          {chartType === 'rentabilidad' && (
            <div>
              <span className="info-tooltip-icon">?
                <span className="info-tooltip-text">
                  
                  La <b>rentabilidad</b> indica qué tan rentable es tu negocio. 
                  Incluye el Margen Neto, Rendimiento sobre Activos y Rendimiento sobre Patrimonio.
                </span>
              </span>
            </div>
          )}


        <FinancialIndicatorsChart 
          data={getChartData()} 
          title={getChartTitle()}
        />
      </div>




    </>
  );
};

export default Analysis;