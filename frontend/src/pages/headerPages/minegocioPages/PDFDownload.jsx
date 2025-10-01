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

  // --- Fondo blanco (por defecto) ---
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 595, 842, "F"); 

  doc.setTextColor(0, 0, 0); // texto negro
  doc.setFontSize(20);
  doc.text("Diagnóstico financiero", 200, 50);

  // === Recuadro 1: Sistema experto ===
  doc.setFillColor(240, 240, 240); // recuadro gris claro
  doc.roundedRect(40, 100, 160, 120, 8, 8, "F"); 
  doc.setFontSize(12);
  doc.text("Sistema experto", 60, 120);
  doc.text(`Resultado: ${getDiagnostico(score)}`, 50, 160, { maxWidth: 140 });
  doc.text(`Puntaje: ${score}`, 50, 190);

  // === Recuadro 2: Modelo ML ===
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(220, 100, 160, 120, 8, 8, "F"); 
  doc.setFontSize(12);
  doc.text("Modelo de Machine Learning", 230, 120, { maxWidth: 140 });
  const mlPred = predictionTree === 0 ? "Fuera de riesgo" : "En riesgo";
  doc.text(`Predicción: ${mlPred}`, 230, 160, { maxWidth: 140 });
  doc.text(`Puntaje estimado: ${(Math.max(...scoreTree) * 100).toFixed(1)}%`, 230, 180);

  // === Recuadro 3: Semáforo ===
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(400, 100, 160, 120, 8, 8, "F"); 
  doc.setFontSize(12);
  doc.text("Semáforo", 450, 120);

  // círculo del semáforo
  const semColor = getSemaforoColor(score, predictionTree);
  doc.setFillColor(semColor);
  doc.circle(480, 170, 25, "F"); 

///HASTA AQUI arriba calcula muy bien los tres recuadros sin problema ahora falta lo demqas



  doc.save("diagnostico.pdf");
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
