import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const MLanalisis = db.define("ML_analysis", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    razon_liquidez: {
        type: DataTypes.FLOAT,
    },
    capital_trabajo: {
        type: DataTypes.FLOAT,
    },
    razon_endeudamiento: {
        type: DataTypes.FLOAT,
    },
    deuda_patrimonio: {
        type: DataTypes.FLOAT,
    },
    rotacion_inventario: {
        type: DataTypes.FLOAT,
    },
    rotacion_cuentas: {
        type: DataTypes.FLOAT,
    },
    rotacion_activos: {
        type: DataTypes.FLOAT,
    },
    margen_neto: {
        type: DataTypes.FLOAT,
    },
    rendimiento_activos: {
        type: DataTypes.FLOAT,
    },
    rendimiento_patrimonio: {
        type: DataTypes.FLOAT,
    },
    resultado_ml: {
        type: DataTypes.STRING(100), 
        allowNull: true,
    },
    resultado_se: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    freezeTableName: true,   
    timestamps: true,        
    underscored: true       
});


MLanalisis.associate = function(models) {
    if (!models?.User) return;
    MLanalisis.belongsTo(models.User, {
        through: models.UserML,
        foreignKey: "ml_id",
        otherKey: "user_id",
        as: "usuarios"
    });
};

export default MLanalisis;
