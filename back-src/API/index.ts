import * as path from "path";
import * as express from "express";
let cors = require("cors");
import { sequelize } from "../models/connection";
import bodyParser = require("body-parser");
import {
  authToken,
  // changePassword,
  changesPassword,
  deletedReport,
  findOrCreateUser,
  getAllUsers,
  getMyDate,
  getMyreportOneForOne,
  meReports,
  reportPetUser,
  updateMyDate,
} from "../controllers/auth-controller";
import { authMiddleware } from "../function/authMiddleware";
import {
  allReportsSentNotUser,
  getOneUser,
  // getOneUser,
  reportNotUser,
} from "../controllers/not-user-controller";
import {
  allReportsOfAllUsers,
  getOneReport,
  searchDatesInAlgolia,
  updateReportPet,
} from "../controllers/report-controller";
import { sendEmailToUser, transporter } from "../lib/mailer";
import { User } from "../models/user";
const pathResolve = path.resolve("", "dist/index.html");
const app = express();
const port = process.env.PORT || 3002;

// app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,x-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

//SIGNUP

app.post("/auth", async (req, res) => {
  const data = await User.tableName;
  console.log({ data });

  const createUser = await findOrCreateUser(req.body).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(data);
});

// SIGNIN

app.post("/auth/token", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message: "no estan todos los datos",
    });
  } else {
    try {
      const authUserToken = await authToken(req.body);

      res.json(authUserToken);
    } catch (error) {
      res.status(405).json({
        message: error,
      });
    }
  }
});

///MY DATE

app.get("/me", authMiddleware, async (req: any, res) => {
  const { id } = req._user;
  const userMe = await getMyDate(id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });

  res.json(userMe);
  // console.log(userMe.getDataValue("password"));
});

///UPDATE MY DATE
app.put("/me/modified", authMiddleware, async (req: any, res) => {
  const { id } = req._user;
  const myNewData = await updateMyDate(id, req.body).catch((err) => {
    res.status(400).json({ message: err });
  });
  res.json(myNewData);
});

///CHANGE PASSWORD

app.post("/change-password", authMiddleware, async (req: any, res) => {
  const { id } = req._user;
  if (id && req.body) {
    const passwordChangedSuccessfully = await changesPassword(
      req.body,
      id
    ).catch((error) => {
      res.status(400).json({
        message: error,
      });
    });
    res.json(passwordChangedSuccessfully);
    res.status(200);
  }
});

///REPORT PET USER ACTIVE

app.post("/report-pet", authMiddleware, async (req: any, res) => {
  ///endpoint crear pet con user registrado
  const { id } = req._user;
  const createReported = await reportPetUser(id, req.body).catch((err) => {
    res.status(405).json({ message: err });
  });
  res.json(createReported);
});

//// UPDATE REPORT PET USER ACTIVE
app.put(
  "/me/reports-modified/:idReport",
  authMiddleware,
  async (req: any, res) => {
    const { id } = req._user;
    const { idReport } = req.params;
    const updateReport = await updateReportPet(id, idReport, req.body).catch(
      (err) => {
        res.status(401).json({ message: err });
      }
    );
    res.json(updateReport);
  }
);

////ME REPORTS

app.get("/me/reports-pets", authMiddleware, async (req: any, res) => {
  const { id } = req._user;
  const reportsOwner = await meReports(id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(reportsOwner);
});

/// GET MY REPORT //ONE FOR ONE

app.get("/me/report/:reportId", authMiddleware, async (req: any, res) => {
  const { id } = req._user;
  const { reportId } = req.params;
  const getMyReport = await getMyreportOneForOne(id, reportId).catch((err) => {
    res.status(400).json({ message: err });
  });
  res.json(getMyReport);
});
/// DELETED REPORT

app.delete("/delete-report/:id", authMiddleware, async (req: any, res) => {
  const { id } = req.params;
  const reportDeleted = await deletedReport(id).catch((err) => {
    res.status(400).json({ message: err });
  });
  res.json({ message: "report DELETED" });
});

/// SEARCH DATES LAT&&LNG IN ALGOLIA

app.get("/reports-close-to", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  if (req.query) {
    const result = await searchDatesInAlgolia(req.query).catch((err) => {
      res.status(400).json({
        message: err,
      });
    });
    res.json(result);
  }
});

///REPORT NOT USER// // NO LOGIN NO SIGNUP

app.post("/not-user-report/:id", async (req, res) => {
  const { id } = req.params;
  const report = await reportNotUser(id, req.body).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(report);
});

////ALL REPORTS OF ALL USERS
app.get("/all-reports", async (req, res) => {
  const allReports = await allReportsOfAllUsers().catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(allReports);
});

/// GET ONE FOR ONE REPORT ID ALL USERS

app.get("/report/:id", async (req, res) => {
  const { id } = req.params;
  const report = await getOneReport(id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(report);
});

///ALL USERS nose si hace falta prox end point

app.get("/users-all", async (req, res) => {
  const allUsers = await getAllUsers().catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(allUsers);
});

// GET ONE USER
app.get("/one-user/:id", async (req, res) => {
  const { id } = req.params;
  const oneUser = await getOneUser(id).catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(oneUser);
});

///ALL REPORTS NOT USER SENT MESSAGE

app.get("/all-reports-not-user", async (req, res) => {
  const allReportsNotUser = await allReportsSentNotUser().catch((err) => {
    res.status(400).json({
      message: err,
    });
  });
  res.json(allReportsNotUser);
});

/// SENT EMAIL
app.post("/email", async (req, res) => {
  const { emailUser, name, message, cellphone } = req.body;
  if (!req.body) {
    res.status(404).json({ error: "faltan datos" });
  } else {
    const outputData = await sendEmailToUser(
      emailUser,
      name,
      message,
      cellphone
    ).catch((err) => {
      res.status(400).json({
        message: err,
      });
    });
    res.json({ message: "enviado" });
  }
});

app.get("/env", (req, res) => {
  res.json({ environment: process.env.NODE_ENV });
});

app.get("*", (req, res) => {
  res.sendFile(pathResolve);
});

app.listen(port, () => {
  console.log(`service in http://localhost:${port}`);
});

// sequelize.sync({ force: true });
