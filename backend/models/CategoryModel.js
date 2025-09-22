import {Sequelize} from "sequelize";
import db from "../config/database.js";

const {DataTypes} = Sequelize;

const Category = db.define('categories', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
});

Category.associate = function(models) {
    if (!models?.Resource) return;
    Category.belongsToMany(models.Resource, {
        through: models.ResourceCategory,
        foreignKey: 'category_id',
        as: 'resources_in_category' // Relación inversa de Resource.belongsToMany(Category)
    });
};




export default Category;