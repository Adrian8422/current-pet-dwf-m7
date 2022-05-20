import { sequelize } from "./connection";
import { Model, DataTypes } from "sequelize";

export class ReportNotUser extends Model {}

ReportNotUser.init(
  {
    nameReporter: DataTypes.STRING,
    cellphone: DataTypes.INTEGER,
    message: DataTypes.STRING,
    petReport_id: DataTypes.STRING,
  },
  { sequelize, modelName: "notUserReport" }
);
