import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Roadmap extends Model {}

Roadmap.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(180), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: "Roadmap",
    tableName: "roadmaps",
    timestamps: true,       // ✅ Sequelize crea/gestiona createdAt/updatedAt
  }
);

export default Roadmap;
