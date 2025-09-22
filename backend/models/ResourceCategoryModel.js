import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ResourceCategory = db.define('resource_category', {
   resource_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'resource',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'categories',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

export default ResourceCategory;