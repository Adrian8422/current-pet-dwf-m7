import { sequelize } from "./connection";
import { Model, DataTypes } from "sequelize";

export class Auth extends Model {}

Auth.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    user_id: DataTypes.STRING,
  },
  { sequelize, modelName: "auth" }
);
