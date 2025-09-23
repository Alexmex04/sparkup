import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext.jsx";
import Analysis from "./Analysis";
import "./DiagnosticForm.css";
import PDFDownload from "./PDFDownload";
import { rootApi } from "../../../utils/api"; // ✅ cliente raíz (host sin /api)

const DiagnosticForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [score, setScore] = useState("");
  const [explain, setExplain] = useState("");
  const [predictionTree, setPredictionTree] = useState("");
  const [scoreTree, setScoreTree] = useState([]);

  const [formData, setFormData] = useState({
    activo_corriente: "",
    pasivo_corriente: "",
    total_activos: "",
    total_pasivos: "",
    costo_ventas: "",
    inventario_inicial: "",
    inventario_final: "",
    ventas_credito: "",
    cuentas_por_cobrar: "",
    ventas_totales: "",
    utilidad_neta: "",
    patrimonio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SystemExpertDiagnosis = async () => {
    try {
      // ✅ En producción: https://sparkup-6ood.onrender.com/model/diagnostic
      const res = await rootApi.post("/model/diagnostic", formData);
      setScore(res.data.overall.score);
      setExplain(res.data.details);
      return { score: res.data.overall.score };
    } catch (error) {
      console.error("Error al calcular en el sistema experto:", error);
      return { score: null };
    }
  };

  const TreeDiagnosis = async () => {
    try {
      // ✅ En producción: https://sparkup-6ood.onrender.com/model/predict
      const response = await rootApi.post("/model/predict", formData, {
        headers: { "Content-Type": "application/json" },
      });
      setPredictionTree(response.data.prediction);
      setScoreTree([
        response.data.probability_class_0,
        response.data.probability_class_1,
      ]);
      return { predictionTree: response.data.prediction };
    } catch (error) {
      console.error("Error al calcular en el modelo:", error);
      return { predictionTree: null };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const SEresult = await SystemExpertDiagnosis();
      const MLresult = await TreeDiagnosis();

      const payload = {
        ...formData,
        predictionTree: MLresult?.predictionTree ?? null,
        score: SEresult?.score ?? null,
        user_id: user?.id,
      };

      // ✅ En producción: https://sparkup-6ood.onrender.com/modelData
      await rootApi.post("/modelData", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Datos guardados correctamente");
    } catch (error) {
      console.error("Error al calcular:", error);
    }
  };

  const getDiagnostico = (score) => {
    if (score < 40) return "Riesgo de quiebra";
    if (score >= 40 && score <= 70) return "Empresa estable";
    if (score > 70) return "Empresa saludable";
    return "Sin diagnóstico";
  };

  const initialFormData = {
    activo_corriente: "",
    pasivo_corriente: "",
    total_activos: "",
    total_pasivos: "",
    costo_ventas: "",
    inventario_inicial: "",
    inventario_final: "",
    ventas_credito: "",
    cuentas_por_cobrar: "",
    ventas_totales: "",
    utilidad_neta: "",
    patrimonio: "",
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setScore("");
    setExplain("");
    setPredictionTree("");
    setScoreTree([]);
  };

  const getSemaforoClass = (score, predictionTree) => {
    const isScorePositivo = getDiagnostico(score) !== "Riesgo de quiebra";
    const isTreePositivo = predictionTree === 0; // 0 = fuera de riesgo
    if (isScorePositivo && isTreePositivo) return "semaforo-verde";
    if (
      (isScorePositivo && !isTreePositivo) ||
      (!isScorePositivo && isTreePositivo)
    )
      return "semaforo-amarillo";
    return "semaforo-rojo";
  };

  return (
    <div className="main-cont">
      <h2 className="semaforo">Semáforo PyME</h2>
      <form onSubmit={handleSubmit} className="form-diagnostic">
        <h3 className="title-diagnostic">Formulario de evaluación</h3>
        <div className="form-Cont">
          <div className="grid-cont">
            <div className="form-group">
              <label>Activos corrientes</label>
              <input
                type="number"
                name="activo_corriente"
                value={formData.activo_corriente}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Pasivos corrientes</label>
              <input
                type="number"
                name="pasivo_corriente"
                value={formData.pasivo_corriente}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Total de activos</label>
              <input
                type="number"
                name="total_activos"
                value={formData.total_activos}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Total de pasivos</label>
              <input
                type="number"
                name="total_pasivos"
                value={formData.total_pasivos}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Costo de ventas</label>
              <input
                type="number"
                name="costo_ventas"
                value={formData.costo_ventas}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Inventario inicial</label>
              <input
                type="number"
                name="inventario_inicial"
                value={formData.inventario_inicial}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Inventario final</label>
              <input
                type="number"
                name="inventario_final"
                value={formData.inventario_final}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Ventas crédito</label>
              <input
                type="number"
                name="ventas_credito"
                value={formData.ventas_credito}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Cuentas por cobrar</label>
              <input
                type="number"
                name="cuentas_por_cobrar"
                value={formData.cuentas_por_cobrar}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Ventas totales</label>
              <input
                type="number"
                name="ventas_totales"
                value={formData.ventas_totales}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Utilidad Neta</label>
              <input
                type="number"
                name="utilidad_neta"
                value={formData.utilidad_neta}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Patrimonio</label>
              <input
                type="number"
                name="patrimonio"
                value={formData.patrimonio}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn-diagnostic">
              Calcular Diagnóstico
            </button>
          </div>
        </div>
      </form>

      {score && (
        <div>
          <h2 className="title-diagnostic">Diagnóstico financiero</h2>
        </div>
      )}

      <div className="cont-results">
        {score && (
          <div className="cont-individual-result">
            <h3 className="title-diagnostic">Sistema experto</h3>
            <div className="data-diagnostic">
              <p>Resultado: </p>
              <span>{getDiagnostico(score)}</span>
              <p>Puntaje: </p>
              <span>{score}</span>
            </div>
          </div>
        )}

        {scoreTree.length > 0 && predictionTree !== "" && (
          <div className="cont-individual-result">
            <h3 className="title-diagnostic">Modelo de Machine Learning</h3>
            <div className="data-diagnostic">
              <p>Predicción: </p>
              {predictionTree === 0 ? (
                <span>Fuera de riesgo</span>
              ) : (
                <span>En riesgo</span>
              )}
              <p>Puntaje estimado: </p>
              <span>{(Math.max(scoreTree[0], scoreTree[1]) * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}

        {scoreTree.length > 0 && predictionTree !== "" && score && (
          <div className="cont-individual-result">
            <h3 className="title-diagnostic">Semáforo</h3>
            <div className={`semaforo-color ${getSemaforoClass(score, predictionTree)}`}></div>
          </div>
        )}
      </div>

      {explain && (
        <div className="analysis-main-content">
          <h2 className="title-diagnostic">Análisis</h2>
          <Analysis explain={explain} />
          <button type="button" className="btn-diagnostic" onClick={handleReset}>
            Reiniciar
          </button>

          <PDFDownload
            formData={formData}
            score={score}
            predictionTree={predictionTree}
            scoreTree={scoreTree}
            explain={explain}
          />
        </div>
      )}
    </div>
  );
};

export default DiagnosticForm;
