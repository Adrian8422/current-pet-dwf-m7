import { sequelize } from "./connection";
import { Model, DataTypes } from "sequelize";

export class Report extends Model {}

Report.init(
  {
    namePet: DataTypes.STRING,
    location: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    pictureURL: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
  },
  { sequelize, modelName: "report" }
);
