import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Favorite = db.define('favorite', {
    usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    recurso_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: 'resource',
            key: 'id'
        }
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

Favorite.associate = function(models) {
    if (!models?.User) return;
    Favorite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
    if (!models?.Resource) return;
    Favorite.belongsTo(models.Resource, {
        foreignKey: 'resource_id',
        as: 'resource'
    });
};

export default Favorite;