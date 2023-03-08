import { Sequelize } from "sequelize";
// import {Sequelize}
// export const sequelize = new Sequelize({
//   dialect: "postgres",
//   username: process.env.USERNAMEDB,
//   password: process.env.PASSWORDDB,
//   database: process.env.DATA_BASE,
//   port: 5432,
//   host: process.env.DB_HOST,
//   ssl: true,
//   ///esto es necesario para que corra correctament
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// });

export const sequelize = new Sequelize(process.env.DATABASE_URL);

console.log({ sequelize });
