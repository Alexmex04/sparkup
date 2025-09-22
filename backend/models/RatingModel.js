import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Rating = db.define('rating', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['resource_id', 'user_id']
        }
    ]
});

Rating.associate = function(models) {
    if (!models?.Resource) return;
    Rating.belongsTo(models.Resource, {
        foreignKey: 'resource_id',
        as: 'rated_resource' // Relación inversa de Resource.hasMany(Rating)
    });
    if (!models?.User) return;
    Rating.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'rating_author'  // Relación inversa de User.hasMany(Rating)
    });
};



export default Rating;