import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedTag extends Model {}

UserLikedTag.init(
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
    tagId: {
      type: DataTypes.INTEGER.UNSIGNED,        // Tag.id = UNSIGNED
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
    modelName: "UserLikedTag",
    tableName: "user_liked_tags",
    timestamps: true,
    underscored: false,
    indexes: [
      // { unique: true, fields: ["userId", "tagId"] }, // redundante con PK compuesta
      { fields: ["tagId"] },
    ],
  }
);

export default UserLikedTag;
