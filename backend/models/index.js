// backend/models/index.js
import sequelize from "../config/database.js";

// Modelos base
import User from "./UserModel.js";

// Taxonomía
import Tag from "./Tag.js";
import Roadmap from "./Roadmap.js";
import RoadmapTag from "./RoadmapTag.js";

// Likes (IMPORTA y EXPORTA estos dos)
import UserLikedTag from "./UserLikedTag.js";
import UserLikedRoadmap from "./UserLikedRoadmap.js";

//ML analisis
import MLanalisis from "./MLanalisis.js";
import UserML from "./UserML.js";

export const setupAssociations = () => {
  // Roadmap ↔ Tag (N–N) sin FKs en MySQL (constraints:false) para estabilizar en dev
  Roadmap.belongsToMany(Tag, {
    through: RoadmapTag,
    foreignKey: "roadmapId",
    otherKey: "tagId",
    as: "tags",
    constraints: false,
  });
  Tag.belongsToMany(Roadmap, {
    through: RoadmapTag,
    foreignKey: "tagId",
    otherKey: "roadmapId",
    as:"roadmaps",
    constraints: false,
  });

  // User ↔ Tag (likes)
  User.belongsToMany(Tag, {
    through: UserLikedTag,
    foreignKey: "userId",
    otherKey: "tagId",
    as: "likedTags",
    constraints: false,
  });
  Tag.belongsToMany(User, {
    through: UserLikedTag,
    foreignKey: "tagId",
    otherKey: "userId",
    as:"usersWhoLiked",
    constraints: false,
  });

  // User ↔ Roadmap (likes)
  User.belongsToMany(Roadmap, {
    through: UserLikedRoadmap,
    foreignKey: "userId",
    otherKey: "roadmapId",
    as: "likedRoadmaps",
    constraints: false,
  });
  Roadmap.belongsToMany(User, {
    through: UserLikedRoadmap,
    foreignKey: "roadmapId",
    otherKey: "userId",
    as:"usersWhoLiked",
    constraints: false,
  });

User.belongsToMany(MLanalisis, {
  through: UserML,
  foreignKey: "user_id",
  otherKey: "ml_id",
  as: "analisisFinancieros",
  constraints: false,
});

MLanalisis.belongsToMany(User, {
  through: UserML,
  foreignKey: "ml_id",
  otherKey: "user_id",
  as: "usuarios",
  constraints: false,
});


};

export const syncModels = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS=0;");

  // Padres
  await User.sync();
  await Tag.sync();
  await Roadmap.sync();
  await MLanalisis.sync();

  // Puente + likes
  await RoadmapTag.sync();
  await UserLikedTag.sync();
  await UserLikedRoadmap.sync();
  await UserML.sync();  


  await sequelize.query("SET FOREIGN_KEY_CHECKS=1;");
};

// 👇 ahora sí exporta también los “likes”
export {
  sequelize,
  User,
  Tag,
  Roadmap,
  RoadmapTag,
  UserLikedTag,
  UserLikedRoadmap,
  MLanalisis,  
  UserML,
};
