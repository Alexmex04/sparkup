import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class RoadmapTag extends Model {}

RoadmapTag.init(
  {
    roadmapId: {
      type: DataTypes.INTEGER.UNSIGNED,       // <- UNSIGNED para empatar Roadmap.id
      allowNull: false,
      field: "roadmapId",
      references: { model: "roadmaps", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tagId: {
      type: DataTypes.INTEGER.UNSIGNED,       // <- UNSIGNED para empatar Tag.id
      allowNull: false,
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
      { unique: true, fields: ["roadmapId", "tagId"] },
      { fields: ["tagId"] },
    ],
  }
);

export default RoadmapTag;
