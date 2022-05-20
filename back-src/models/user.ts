import { sequelize } from "./connection";
import { Model, DataTypes } from "sequelize";

export class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);
