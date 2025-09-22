import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Resource = db.define('resource',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    img_url: {
        type: DataTypes.STRING(200),
        allowNull: false,
    },
    file_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id",
        },
    },
    posted_date: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    status:{
        type: DataTypes.ENUM("pendiente", "aprobado","rechazado"),
        defaultValue: "pendiente",
    },
    deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    download:{
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },



},{
    freezeTableName:true,
    timestamps: false,
    underscored: true
});

// Relación con el modelo User
Resource.associate = function(models) {
    if (!models?.User) return;
    Resource.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'creator' // Relación inversa de User.hasMany(Resource)
    });
    if (!models?.Rating) return;
    Resource.hasMany(models.Rating, {
        foreignKey: 'resource_id',
        as: 'received_ratings' // Relación: Resource → Ratings (recibidos)
    });
    if (!models?.Favorite) return;
    Resource.belongsToMany(models.User, {
        through: models.Favorite,
        foreignKey: 'resource_id',
        as: 'favorited_by_users' // Relación inversa de User.belongsToMany(Resource)
    });
    if (!models?.Category || !models?.ResourceCategory) return;
    Resource.belongsToMany(models.Category, {
        through: models.ResourceCategory,
        foreignKey: 'resource_id',
        as: 'associated_categories' // Relación: Resource ↔ Categories
    });
};

export default Resource;
