
import MLanalisis from "../models/MLanalisis.js"; 
import UserML from "../models/UserML.js";

export const createMLData = async(req, res) =>{
    try{
       //Se calculan indicadores
  
        const inventario_promedio = (parseFloat(req.body.inventario_inicial) + parseFloat(req.body.inventario_final)) / 2;
        const Patrimonio = (parseFloat(req.body.total_activos)-parseFloat(req.body.total_pasivos));
        const Utilidad_Neta = parseFloat(req.body.ventas_totales) - parseFloat(req.body.costo_ventas) - (parseFloat(req.body.ventas_totales)*0.15);
           let RotacionCuentas = 0;

            if (parseFloat(req.body.ventas_credito) === 0 || parseFloat(req.body.cuentas_por_cobrar) === 0) {
            RotacionCuentas = 6;
            } else {
            RotacionCuentas = parseFloat(req.body.ventas_credito) / parseFloat(req.body.cuentas_por_cobrar);
            }

            
        const indicadores = {
        razon_liquidez: parseFloat(parseFloat(req.body.activo_corriente) / parseFloat(req.body.pasivo_corriente)), //Activo_Corriente / Pasivo_Corriente
        capital_trabajo: parseFloat(parseFloat(req.body.activo_corriente) - parseFloat(req.body.pasivo_corriente)),  //Total de Activos - Total de Pasivos
        razon_endeudamiento: parseFloat(parseFloat(req.body.total_pasivos)/parseFloat(req.body.total_activos)), //Pasivo_Total_financiado / Activo_Total_financiado
        deuda_patrimonio: parseFloat(parseFloat(req.body.total_pasivos)/ Patrimonio),   //Total Pasivos / (Total activo -Total Pasivo)
        rotacion_inventario: parseFloat(parseFloat(req.body.costo_ventas)/ parseFloat(inventario_promedio) ), //COGS / Inventario_Promedio
        rotacion_cuentas: parseFloat(RotacionCuentas),  //Ventas_a_Crédito / Cuentas_por_Cobrar_Promedio
        rotacion_activos: parseFloat(parseFloat(req.body.ventas_totales)/parseFloat(req.body.total_activos)), //Ventas_Totales / Activo_Total
        margen_neto: parseFloat(Utilidad_Neta/parseFloat(req.body.ventas_totales)),  //Utilidad_Neta / Ventas_Totales
        rendimiento_activos: parseFloat(Utilidad_Neta/parseFloat(req.body.total_activos)),  //Utilidad_Neta / Activo_Total
        rendimiento_patrimonio: parseFloat(Utilidad_Neta/Patrimonio), //Utilidad_Neta / Patrimonio
        resultado_ml: req.body.predictionTree,
        resultado_se: req.body.score,
       };

     
       
       //Guarda en ml_analysis
        const nuevoRegistro = await MLanalisis.create(indicadores);

       //Guarda en User_ML_analysis
           await UserML.create({
                user_id: req.body.user_id,  
                ml_id:  nuevoRegistro.id          
            });

        res.status(201).json({
        msg: "Indicadores guardados correctamente",
        data: nuevoRegistro,
        });

        

        }
    catch (error){
        console.log(error.message);
        res.status(500).json({ msg: "Error al crear el registro para el analisis", error: error.message });

    }
}

