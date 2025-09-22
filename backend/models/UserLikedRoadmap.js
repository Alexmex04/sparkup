import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedRoadmap extends Model {}

UserLikedRoadmap.init(
  {
    userId:    { type: DataTypes.INTEGER, allowNull: false, field: "userId",references: { model: "user", key: "id" },onUpdate: "CASCADE",onDelete: "CASCADE",  },
    roadmapId: { type: DataTypes.INTEGER, allowNull: false, field: "roadmapId", references: { model: "roadmaps", key: "id" },onUpdate: "CASCADE",onDelete: "CASCADE",},
  },
  {
    sequelize,
    modelName: "UserLikedRoadmap",
    tableName: "user_liked_roadmaps",
    timestamps: true,
    underscored: false,
    indexes: [
      { unique: true, fields: ["userId", "roadmapId"] },
      { fields: ["roadmapId"] },
    ],
  }
);

export default UserLikedRoadmap;
