import { Sequelize } from "sequelize";
// import {Sequelize}
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: process.env.USERNAMEDB,
  password: process.env.PASSWORDDB,
  database: "d32f2qmapsfk0p",
  port: 5432,
  host: "ec2-3-229-252-6.compute-1.amazonaws.com",
  ssl: true,
  ///esto es necesario para que corra correctamente
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
