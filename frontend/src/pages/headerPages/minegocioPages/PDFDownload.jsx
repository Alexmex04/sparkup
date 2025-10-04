import React from "react";
import { jsPDF } from "jspdf";

const PDFDownload = ({ formData, score, predictionTree, explain, scoreTree }) => {

// Valores ideales numéricos
const idealValues = {
  "RazonDeLiquidez": "1.5 – 5",
  "CapitalDeTrabajo": "> 0",
  "RazonDeEndeudamiento": "< 50%",
  "DeudaDePatrimonio": "< 1",
  "RotacionDeInventario": "> 4",
  "RotacionCuentasPorCobrar": "> 5",
  "RotacionDeActivos": "> 1.5",
  "MargenNeto": "> 10%",
  "RendimientoSobreActivos": "> 10%",
  "RendimientoSobrePatrimonio": "> 20%"
};


  const handleDownloadPDF = async () => {
    const doc = new jsPDF("p", "pt", "a4");

    // --- Fondo blanco ---
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 595, 842, "F"); 

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text("Diagnóstico financiero", 200, 50);

    // === Recuadros informativos ===
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(40, 100, 160, 120, 8, 8, "F"); 
    doc.setFontSize(12);
    doc.text("Sistema experto", 60, 120);
    doc.text(`Resultado: ${getDiagnostico(score)}`, 50, 160, { maxWidth: 140 });
    doc.text(`Puntaje: ${score}`, 50, 190);

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(220, 100, 160, 120, 8, 8, "F"); 
    doc.setFontSize(12);
    doc.text("Modelo de Machine Learning", 230, 120, { maxWidth: 140 });
    
    const puntajeEstimado = scoreTree && scoreTree.length > 0 
      ? (Math.max(...scoreTree) * 100).toFixed(1) 
      : "N/A";
    const mlPred = predictionTree === 0 ? "Fuera de riesgo" : "En riesgo";
    
    doc.text(`Predicción: ${mlPred}`, 230, 160, { maxWidth: 140 });
    doc.text(`Puntaje estimado: ${puntajeEstimado}%`, 230, 180);

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(400, 100, 160, 120, 8, 8, "F"); 
    doc.setFontSize(12);
    doc.text("Semáforo", 450, 120);

    const semColor = getSemaforoColor(score, predictionTree);
    doc.setFillColor(parseInt(semColor.slice(1, 3), 16), parseInt(semColor.slice(3, 5), 16), parseInt(semColor.slice(5, 7), 16));
    doc.circle(480, 170, 25, "F"); 


// === Tabla de indicadores ===
if (explain) {
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Indicadores Financieros", 40, 260);

  // Encabezados
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const startY = 280;
  doc.text("Indicador", 40, startY);
  doc.text("Puntaje", 200, startY);
  doc.text("Valor obtenido", 300, startY);
  doc.text("Valor deseado", 430, startY);

  // Línea debajo del encabezado
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(40, startY + 5, 550, startY + 5);

  // Datos de cada indicador
  let y = startY + 20;

  Object.keys(explain).forEach(key => {
    const indicador = explain[key];
    if (!indicador) return;


    const name = formatLabel(indicador.metric || key);
    const score = indicador.score !== undefined ? indicador.score.toFixed(2) : "-";
    const value = indicador.value !== undefined ? indicador.value.toFixed(2) : "-";
    const ideal = idealValues[key] || "N/A";  // 🔹 Usa valores ideales numéricos

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    doc.text(name, 40, y, { maxWidth: 140 });
    doc.text(score.toString(), 200, y);
    doc.text(value.toString(), 300, y);
    doc.text(ideal, 430, y);

    y += 20;
    if (y > 700) { // si se pasa de la página, crea una nueva
      doc.addPage();
      y = 60;
    }
  });
}




    // === GENERAR GRÁFICAS ===
    const chartTypes = ['general', 'liquidez', 'endeudamiento', 'eficiencia', 'rentabilidad'];
    
    for (let i = 0; i < chartTypes.length; i++) {
      const chartType = chartTypes[i];
      const chartData = getChartDataByType(chartType);
      const chartTitle = getChartTitleByType(chartType);
      
      if (chartData.length > 0) {
        doc.addPage();
        
        // Título de la gráfica
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(chartTitle, 40, 40);
        
        // Crear gráfica de barras
        createBarChart(doc, chartData, 40, 60, 515, 300);
        
        // Agregar leyenda
        createLegend(doc, chartData, 40, 380);
      }
    }

    doc.save("diagnostico.pdf");
  };

  // Función para crear gráficas de barras
  const createBarChart = (doc, data, x, y, width, height) => {
    const maxValue = 100; // Puntaje máximo
    const barWidth = (width - 100) / data.length;
    const chartHeight = height - 80;
    
    // Dibujar ejes
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(1);
    
    // Eje Y
    doc.line(x + 40, y, x + 40, y + chartHeight);
    // Eje X
    doc.line(x + 40, y + chartHeight, x + width - 40, y + chartHeight);
    
    // Escala del eje Y
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    for (let i = 0; i <= 100; i += 20) {
      const yPos = y + chartHeight - (i / maxValue) * chartHeight;
      doc.line(x + 35, yPos, x + 40, yPos);
      doc.text(i.toString(), x + 30, yPos + 3, { align: 'right' });
    }
    
    // Barras
    data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const barX = x + 50 + (index * barWidth);
      const barY = y + chartHeight - barHeight;
      
      // Color según puntaje
      const color = getColorByScore(item.value);
      doc.setFillColor(color[0], color[1], color[2]);
      doc.roundedRect(barX, barY, barWidth - 10, barHeight, 2, 2, 'F');
      
      // Borde de la barra
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      doc.roundedRect(barX, barY, barWidth - 10, barHeight, 2, 2, 'S');
      
      // Valor encima de la barra
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text(item.value.toString(), barX + (barWidth - 10) / 2, barY - 5, { align: 'center' });
      
      // Etiqueta del indicador
      doc.setFontSize(8);
      const label = formatLabel(item.name);
      // Rotar texto si es muy largo
      if (label.length > 12) {
        doc.text(label, barX + (barWidth - 10) / 2, y + chartHeight + 15, { 
          align: 'center',
          maxWidth: barWidth - 5
        });
      } else {
        doc.text(label, barX + (barWidth - 10) / 2, y + chartHeight + 12, { align: 'center' });
      }
      
      // Resultado debajo de la etiqueta
      if (item.result !== undefined && item.result !== null) {
        const resultText = formatResult(item.result, item.name);
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(resultText, barX + (barWidth - 10) / 2, y + chartHeight + 25, { 
          align: 'center',
          maxWidth: barWidth - 5
        });
      }
    });
  };

  // Función para crear leyenda
  const createLegend = (doc, data, x, y) => {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Leyenda:", x, y);
    
    const legendItems = [
      { color: [34, 197, 94], text: "Excelente (70-100)" },
      { color: [245, 158, 11], text: "Regular (30-69)" },
      { color: [239, 68, 68], text: "Crítico (0-29)" }
    ];
    
    legendItems.forEach((item, index) => {
      const legendX = x + 60 + (index * 150);
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(legendX, y - 8, 10, 10, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(item.text, legendX + 15, y);
    });
  };

  // Funciones para obtener datos (las mismas que antes)
  const getChartDataByType = (type) => {
    if (!explain) return [];

    if (type === 'general') {
      const categorias = {
        liquidez: ['RazonDeLiquidez', 'CapitalDeTrabajo'],
        endeudamiento: ['RazonDeEndeudamiento', 'DeudaDePatrimonio'],
        eficiencia: ['RotacionDeInventario', 'RotacionCuentasPorCobrar', 'RotacionDeActivos'],
        rentabilidad: ['MargenNeto', 'RendimientoSobreActivos', 'RendimientoSobrePatrimonio']
      };

      return Object.keys(categorias).map(categoria => {
        const data = categorias[categoria]
          .map(m => explain[m])
          .filter(Boolean)
          .map(metric => metric.score);
        
        const promedio = data.length > 0 ? 
          data.reduce((sum, score) => sum + score, 0) / data.length : 0;
        
        return {
          name: categoria,
          value: Math.round(promedio),
          result: '-'
        };
      });
    } else {
      const categorias = {
        liquidez: ['RazonDeLiquidez', 'CapitalDeTrabajo'],
        endeudamiento: ['RazonDeEndeudamiento', 'DeudaDePatrimonio'],
        eficiencia: ['RotacionDeInventario', 'RotacionCuentasPorCobrar', 'RotacionDeActivos'],
        rentabilidad: ['MargenNeto', 'RendimientoSobreActivos', 'RendimientoSobrePatrimonio']
      };

      return (categorias[type] || [])
        .map(m => explain[m])
        .filter(Boolean)
        .map(metric => ({
          name: metric.metric,
          value: metric.score,
          result: metric.value
        }));
    }
  };

  const getChartTitleByType = (type) => {
    const titulos = {
      general: 'Análisis General Financiero',
      liquidez: 'Análisis de Liquidez',
      endeudamiento: 'Análisis de Endeudamiento',
      eficiencia: 'Análisis de Eficiencia Operativa',
      rentabilidad: 'Análisis de Rentabilidad'
    };
    return titulos[type] || 'Análisis Financiero';
  };

  // Funciones de formato
  const formatLabel = (label) => {
    return label.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  const formatResult = (result, metricName) => {
    if (result === undefined || result === null) return 'N/A';
    
    if (metricName.includes('Razon') || metricName.includes('Margen') || 
        metricName.includes('Rendimiento') || metricName.includes('Rotacion')) {
      return `${result}%`;
    }
    
    if (metricName.includes('Capital')) {
      return `$${result.toLocaleString()}`;
    }
    
    return result.toString();
  };

  const getColorByScore = (score) => {
    if (score >= 70) return [34, 197, 94];    // Verde
    if (score >= 30) return [245, 158, 11];   // Amarillo
    return [239, 68, 68];                     // Rojo
  };

  // Funciones de apoyo existentes
  const getDiagnostico = (score) => {
    if (score < 40) return "Riesgo de quiebra";
    if (score >= 40 && score <= 70) return "Empresa estable";
    if (score > 70) return "Empresa saludable";
    return "Sin diagnóstico";
  };

  const getSemaforoColor = (score, predictionTree) => {
    const isScorePositivo = score > 70;
    const isTreePositivo = predictionTree === 0;
    if (isScorePositivo && isTreePositivo) return "#28a745";
    if ((isScorePositivo && !isTreePositivo) || (!isScorePositivo && isTreePositivo)) return "#ffc107";
    return "#dc3545";
  };

  return (
    <button className="btn-diagnostic" onClick={handleDownloadPDF}>
      Descargar PDF
    </button>
  );
};

export default PDFDownload;