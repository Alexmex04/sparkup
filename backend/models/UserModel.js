import {Sequelize} from "sequelize";
import db from "../config/database.js";
//Se importa la conexion a la base de datos

const {DataTypes} = Sequelize;

const User = db.define('user',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, 
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING(255),
    },
    role: {
        type: DataTypes.ENUM("admin", "user"), 
        defaultValue: "user",
        
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
    },
    emailToken: {
    type: DataTypes.STRING,
},

},{
    freezeTableName:true,  //sequelize no va a pluralizar no cambia de user a users
    timestamps: false, //no agrega automaticamente createdAt
    underscored: true  //evita que use snake_case
});

//Aqui se crean las relaciones 
//hasOne es una relacion uno a uno, la llave foranea  se define en el modelo objetivo
//belongsTo relacion de uno a uno, la llave foranea  se define en el modelo origen
//hasMany relacion uno a muchos, la llave foranea se define en el modelo objetivo
//belongstoMany relacion muchos a muchos
User.associate = function(models) {
    if (!models?.MLanalisis) return;
        User.belongsToMany(models.AnalisisFinanciero, {
        through: models.UserML,
        foreignKey: "user_id",
        otherKey: "ml_id",
        as: "analisis_financieros"
    });
};

 

export default User;
