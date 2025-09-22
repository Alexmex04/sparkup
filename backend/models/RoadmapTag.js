import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class RoadmapTag extends Model {}

RoadmapTag.init(
  {
    roadmapId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,                        // <-- PK compuesta (1/2)
      field: "roadmapId",
      references: { model: "roadmaps", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tagId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,                        // <-- PK compuesta (2/2)
      field: "tagId",
      references: { model: "tags", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "RoadmapTag",
    tableName: "roadmap_tags",
    timestamps: false,
    underscored: false,
    indexes: [
      // Opcional: ya no es estrictamente necesario el unique, porque la PK compuesta lo garantiza
      // { unique: true, fields: ["roadmapId", "tagId"] },
      { fields: ["tagId"] },
    ],
  }
);

export default RoadmapTag;
