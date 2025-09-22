import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Tag extends Model {}

Tag.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    category: { type: DataTypes.STRING(80) },
  },
  {
    sequelize,
    modelName: "Tag",
    tableName: "tags",
    timestamps: true,       // ✅ lo mismo aquí
  }
);

export default Tag;
