import React from "react";
import { jsPDF } from "jspdf";

const PDFDownload = ({ formData, score, predictionTree, explain, scoreTree}) => {

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



  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    let y = 40;

    // --- Título ---
    doc.setFontSize(18);
    doc.text("Semáforo PyME", 40, y);
    y += 30;

    // --- Formulario ---
    doc.setFontSize(14);
    doc.text("Formulario de Evaluación", 40, y);
    y += 20;
    doc.setFontSize(12);

    Object.entries(formData).forEach(([key, value]) => {
      const label = metricNames[key] || key;
      doc.text(`${label}: ${value}`, 40, y);
      y += 18;
      if (y > 780) { doc.addPage(); y = 40; }
    });

    y += 20;
    // --- Diagnóstico ---
    doc.setFontSize(14);
    doc.text("Diagnóstico Financiero", 40, y);
    y += 20;
    doc.setFontSize(12);

    // Sistema Experto
    doc.text("Sistema experto:", 40, y);
    y += 18;
    doc.text(`Resultado: ${getDiagnostico(score)}`, 60, y);
    y += 18;
    doc.text(`Puntaje: ${score}`, 60, y);
    y += 20;

    // Modelo ML
    doc.text("Modelo de Machine Learning:", 40, y);
    y += 18;
    const mlPred = predictionTree === 0 ? "Fuera de riesgo" : "En riesgo";
    doc.text(`Predicción: ${mlPred}`, 60, y);
    y += 18;
    doc.text(`Puntaje estimado: ${(Math.max(...scoreTree) * 100).toFixed(1)}%`, 60, y);
    y += 20;

    // Semáforo
    const semColor = getSemaforoColor(score, predictionTree);
    doc.setFillColor(semColor);
    doc.rect(40, y, 30, 30, "F");
    doc.text("Semáforo", 80, y + 20);
    y += 50;

    // --- Puntajes óptimos ---
    doc.setFontSize(14);
    doc.text("Puntajes Óptimos", 40, y);
    y += 20;
    doc.setFontSize(12);

    Object.values(explain).forEach((item) => {
      const label = metricNames[item.metric] || item.metric;
      doc.text(`${label}:`, 40, y);
      y += 18;
      const value = typeof item.value === "number" ? item.value.toFixed(2) : item.value;
      doc.text(`Valor Obtenido: ${value}`, 60, y);
      y += 18;
      doc.text(`Rango Óptimo: ${scores[item.metric] || "N/A"}`, 60, y);
      y += 20;
      if (y > 780) { doc.addPage(); y = 40; }
    });

    // --- Análisis Detallado ---
    y += 30;
    doc.setFontSize(14);
    doc.text("Análisis Detallado y Recomendaciones", 40, y);
    y += 20;
    doc.setFontSize(12);

    Object.values(explain).forEach((item) => {
      const label = metricNames[item.metric] || item.metric;
      doc.text(`${label}:`, 40, y);
      y += 18;
      doc.text(`${item.explanation}`, 60, y);
      y += 20;
      if (y > 780) { doc.addPage(); y = 40; }
    });


    doc.save("diagnostico_pyme.pdf");
  };

  // Funciones de apoyo
  const getDiagnostico = (score) => {
    if (score < 40) return "Riesgo de quiebra";
    if (score >= 40 && score <= 70) return "Empresa estable";
    if (score > 70) return "Empresa saludable";
    return "Sin diagnóstico";
  };

  const getSemaforoColor = (score, predictionTree) => {
    const isScorePositivo = score > 70; // positivo si > 70
    const isTreePositivo = predictionTree === 0;
    if (isScorePositivo && isTreePositivo) return "#28a745"; // verde
    if ((isScorePositivo && !isTreePositivo) || (!isScorePositivo && isTreePositivo)) return "#ffc107"; // amarillo
    return "#dc3545"; // rojo
  };

  return (
    <button className="btn-diagnostic" onClick={handleDownloadPDF}>
      Descargar PDF
    </button>
  );
};

export default PDFDownload;
