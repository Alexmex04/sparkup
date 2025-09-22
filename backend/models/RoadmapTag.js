import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class RoadmapTag extends Model {}

RoadmapTag.init(
  {
    // Mapea los atributos a columnas camelCase existentes
    roadmapId: { type: DataTypes.INTEGER, allowNull: false, field: "roadmapId",references: { model: "roadmaps", key: "id" },onUpdate: "CASCADE",onDelete: "CASCADE", },
    tagId:     { type: DataTypes.INTEGER, allowNull: false, field: "tagId", references: { model: "tags", key: "id" }, onUpdate: "CASCADE",onDelete: "CASCADE", },
  },
  {
    sequelize,
    modelName: "RoadmapTag",
    tableName: "roadmap_tags",
    timestamps: false,
    underscored: false, // 
    indexes: [
      // Usa los nombres EXACTOS de columna que existen en la tabla
      { unique: true, fields: ["roadmapId", "tagId"] },
      { fields: ["tagId"] },
    ],
  }
);

export default RoadmapTag;
