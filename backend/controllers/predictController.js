import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const calcularFeatures = (data) => {
  // Calcular todas las features que espera el modelo (17 en total) 
  const X1 = parseFloat(data.utilidad_neta) / parseFloat(data.total_activos); // net profit / total assets
  const X2 = parseFloat(data.total_pasivos) / parseFloat(data.total_activos); // total liabilities / total assets
  const X3 = (parseFloat(data.activo_corriente) - parseFloat(data.pasivo_corriente)) / parseFloat(data.total_activos); // working capital / total assets
  const X4 = parseFloat(data.activo_corriente) / parseFloat(data.pasivo_corriente); // current assets / short-term liabilities
  const X6 = parseFloat(data.utilidad_neta) / parseFloat(data.total_activos); // retained earnings / total assets
  const X8 = parseFloat(data.patrimonio) / parseFloat(data.total_pasivos); // book value of equity / total liabilities
  const X9 = parseFloat(data.ventas_totales) / parseFloat(data.total_activos); // sales / total assets
  const X10 = parseFloat(data.patrimonio) / parseFloat(data.total_activos); // equity / total assets
  const X17 = parseFloat(data.total_activos) / parseFloat(data.total_pasivos); // total assets / total liabilities
  const X18 = (parseFloat(data.ventas_totales) - parseFloat(data.costo_ventas)) / parseFloat(data.total_activos); // gross profit / total assets
  const X19 = (parseFloat(data.ventas_totales) - parseFloat(data.costo_ventas)) / parseFloat(data.ventas_totales); // gross profit / sales
  const X23 = parseFloat(data.utilidad_neta) / parseFloat(data.ventas_totales); // net profit / sales
  const X44 = (parseFloat(data.cuentas_por_cobrar) * 365) / parseFloat(data.ventas_totales); // (receivables * 365) / sales
  const X50 = parseFloat(data.activo_corriente) / parseFloat(data.total_pasivos); // current assets / total liabilities
  const X51 = parseFloat(data.pasivo_corriente) / parseFloat(data.total_activos); // short-term liabilities / total assets
  const X60 = parseFloat(data.ventas_totales) / parseFloat(data.inventario_final); // sales / inventory
  const X61 = parseFloat(data.ventas_totales) / parseFloat(data.cuentas_por_cobrar); // sales / receivables

  return [
    X1, X2, X3, X4, X6, X8, X9, X10, X17, X18, 
    X19, X23, X44, X50, X51, X60, X61
  ];
};


export const getPrediction = (req, res) => {
  try {

    const features = calcularFeatures(req.body);

    const scriptPath = path.resolve(__dirname, "../../model/model.py");
    const py = spawn("python", [scriptPath]);

    let result = "";
    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error(`Error en Python: ${data}`);
    });

    py.on("close", (code) => {
      try {
        if (result.trim()) {
          res.json(JSON.parse(result));
        } else {
          res.status(500).json({ error: "Python no devolvió datos" });
        }
      } catch (err) {
        res.status(500).json({ error: "Error al parsear respuesta de Python", raw: result });
      }
    });
    //console.log(features);
    
    
    const inputData = JSON.stringify({features});
    py.stdin.write(inputData);
    py.stdin.end();
    

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor Node" });
  }
};