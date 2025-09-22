import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const UserML = db.define('User_ML_analysis', {
    user_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    ml_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'ML_analysis',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }


}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

export default UserML;