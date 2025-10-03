import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import "./Chartstyle.css";


const formatLabel = (label) => {
  // Convierte de "RazonDeLiquidez" a "Razon de Liquidez"
  return label.replace(/([a-z])([A-Z])/g, '$1 $2');
};

const explanations = {
  "RazonDeLiquidez": "Capacidad de pagar deudas a corto plazo (ideal 1.5–5).",
  "CapitalDeTrabajo": "Excedente después de pagar deudas inmediatas (ideal > 0).",
  "RazonDeEndeudamiento": "Porcentaje de activos financiados con deuda (ideal < 50%).",
  "DeudaDePatrimonio": "Relación deuda/capital propio (ideal < 1).",
  "RotacionDeInventario": "Veces que se renueva el inventario al año (ideal > 4).",
  "RotacionCuentasPorCobrar": "Velocidad de cobro a clientes (ideal > 5).",
  "RotacionDeActivos": "Eficiencia en uso de activos (ideal > 1.5).",
  "MargenNeto": "Ganancia después de todos los gastos (ideal > 10%).",
  "RendimientoSobreActivos": "Utilidad generada por activos (ideal > 10%).",
  "RendimientoSobrePatrimonio": "Rentabilidad para los dueños (ideal > 20%)."
};

const CustomTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <title>{explanations[payload.value]}</title> 
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="middle"
        fill="#ffffffff"
        style={{ cursor: "help" }}
      >
        {formatLabel(payload.value)}
      </text>
    </g>
  );
};


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload; 
    return (
      <div className='div-customtooltip'>


        {/* Título del tooltip */}
        <p className='p-cutomtooltip-label'>
          {formatLabel(label)}
        </p>

        {/* Score de la categoría */}
        <p className='p-cutomtooltip-r'>
          Puntaje: <strong>{item.value}</strong>
        </p>
        
        {item.result !== undefined && item.result !== null && (
            <p className='p-cutomtooltip-r'>
                Resultado: <strong>{item.result.toFixed(2)}</strong>
            </p>
            )}
  

      </div>
    );
  }
  return null;
};








const FinancialIndicatorsChart = ({ data, title }) => {
  const getColorByScore = (score) => {
    if (score >= 70) return "#22c55e";
    if (score >= 30) return "#f59e0b";  
    return "#ef4444";
  };



  return (
    <div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={<CustomTick />} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="value" name="Indicadores">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getColorByScore(entry.value)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export default FinancialIndicatorsChart;