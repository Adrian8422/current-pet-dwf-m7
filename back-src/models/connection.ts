import { Sequelize } from "sequelize";
// import {Sequelize}
export const sequelize = new Sequelize({
  dialect: "postgres",
  username: "ktascvqrsnhwrg",
  password: "48f8128d1800ac8eb6d676a425927885a3dd0b60cb5af6ccc86a3b3cd1403e2f",
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

// try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
