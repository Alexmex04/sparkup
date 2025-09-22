import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedRoadmap extends Model {}

UserLikedRoadmap.init(
  {
    userId: {
      type: DataTypes.INTEGER,                 // User.id = INTEGER normal
      allowNull: false,
      primaryKey: true,                        // <-- PK compuesta (1/2)
      field: "userId",
      references: { model: "user", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    roadmapId: {
      type: DataTypes.INTEGER.UNSIGNED,        // Roadmap.id = UNSIGNED
      allowNull: false,
      primaryKey: true,                        // <-- PK compuesta (2/2)
      field: "roadmapId",
      references: { model: "roadmaps", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "UserLikedRoadmap",
    tableName: "user_liked_roadmaps",
    timestamps: true,
    underscored: false,
    indexes: [
      // { unique: true, fields: ["userId", "roadmapId"] }, // redundante con PK compuesta
      { fields: ["roadmapId"] },
    ],
  }
);

export default UserLikedRoadmap;
