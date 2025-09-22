import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedTag extends Model {}

UserLikedTag.init(
  {
    userId: {
      type: DataTypes.INTEGER,                 // User.id es INTEGER (normal)
      allowNull: false,
      field: "userId",
      references: { model: "user", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    tagId: {
      type: DataTypes.INTEGER.UNSIGNED,        // <- UNSIGNED para empatar Tag.id
      allowNull: false,
      field: "tagId",
      references: { model: "tags", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "UserLikedTag",
    tableName: "user_liked_tags",
    timestamps: true,
    underscored: false,
    indexes: [
      { unique: true, fields: ["userId", "tagId"] },
      { fields: ["tagId"] },
    ],
  }
);

export default UserLikedTag;
