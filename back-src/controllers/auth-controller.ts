import { User } from "../models/user";
import { Auth } from "../models/auth";
import { Report } from "../models/report";
import { cloudinary } from "../lib/cloudinary";
import { sha256 } from "../function/hasheador";
import * as jwt from "jsonwebtoken";
import { authMiddleware } from "../function/authMiddleware";
import { index } from "../lib/algolia";
const SECRET = "alsododo";

///SIGNUP
export async function findOrCreateUser(dataUser) {
  const { email, password, name } = dataUser;
  if (!email) {
    throw "no hay email";
  }
  const [user, created] = await User.findOrCreate({
    where: { email: email },
    defaults: {
      email: email,
      name: name,
    },
  });
  const passwordHasheado = sha256(password);
  const [auth, authCreated] = await Auth.findOrCreate({
    where: { email: email, password: passwordHasheado },
    defaults: {
      name: name,
      email: email,
      password: passwordHasheado,
      user_id: user.get("id"),
    },
  });
  return { user, auth };
}

///SIGNIN

export async function authToken(dataUser) {
  const { email, password } = dataUser;

  const passwordHasheado = sha256(password);

  const user = await User.findOne({
    where: { email: email },
  });
  const auth = await Auth.findOne({
    where: { email: email, password: passwordHasheado },
  });
  const token = jwt.sign({ id: auth.get("id") }, SECRET);
  if (auth) {
    return { token: token, auth, user };
  } else {
    throw "error in signin";
  }
}

////GET MY DATA

export async function getMyDate(user_id) {
  if (!user_id) {
    throw "not found id";
  }
  const data = await Auth.findByPk(user_id);
  return data;
}

///UPDATE MY DATE

export async function updateMyDate(user_id, dataUser) {
  const { email, name } = dataUser;
  if (!user_id) {
    throw "not found id";
  }
  if (user_id) {
    const myUser = await User.update(
      { email: email, name: name },
      {
        where: { id: user_id },
      }
    );
    const myDataModified = await User.findByPk(user_id);

    const myAuth = await Auth.update(
      { email: email },
      {
        where: { user_id: user_id },
      }
    );
    const myDataAuthModified = await Auth.findByPk(user_id);
    return { myDataModified, myDataAuthModified };
  }
}

///CHANGE PASSWORD

export async function changesPassword(data, user_id) {
  const { passwordOld, passwordVerify, passwordNew } = data;

  if (!user_id) {
    throw "error in id";
  }
  if (user_id) {
    const auth = await Auth.findByPk(user_id);
    if (auth) {
      if (passwordOld == passwordVerify) {
        const changes = await Auth.update(
          { password: sha256(passwordNew) },
          { where: { user_id: auth.get("user_id") } }
        );
        const AuthModifiedSucess = await Auth.findByPk(user_id);

        return { AuthModifiedSucess, message: "password changed success" };
      } else {
        return { message: "error" };
      }
    }
  }
}

/// REPORT PET USER ACTIVE && INSERT IN DATABASES ALGOLIA GEOLOC

export async function reportPetUser(userId: number, dataUser) {
  if (!userId) {
    throw "error not found userId";
  }

  if (userId) {
    if (dataUser.pictureURL) {
      const imagen = await cloudinary.uploader.upload(dataUser.pictureURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 1000,
      });

      const user = await User.findByPk(userId);
      if (user) {
        const reportCreate = await Report.create({
          ...dataUser,
          pictureURL: imagen.secure_url,
          user_id: user.get("id"),
        });
        await index.saveObject({
          objectID: reportCreate.get("id"),
          name: reportCreate.get("namePet"),
          location: reportCreate.get("location"),
          pictureURL: imagen.secure_url,
          _geoloc: {
            lat: reportCreate.get("lat"),
            lng: reportCreate.get("lng"),
          },
        });
        return reportCreate;
      }
    }
  }
}

////ME REPORTS
export async function meReports(user_id) {
  if (!user_id) {
    throw "not user id";
  }

  if (user_id) {
    const reportIdUserOwner = await Report.findAll({
      where: { user_id: user_id },
    });
    return reportIdUserOwner;
  } else {
    throw "userID owner incorrect";
  }
}

/// GET MY REPORT //ONE FOR ONE

export async function getMyreportOneForOne(user_id, reportId) {
  if (!user_id && !reportId) {
    throw "error not found id";
  }
  if (user_id) {
    const user = await User.findByPk(user_id);
    if (user) {
      const getReport = await Report.findOne({
        where: { id: reportId },
      });
      return getReport;
    }
  }
}

//// DELETED REPORTS

export async function deletedReport(reportId) {
  if (!reportId) {
    throw "error not idReport";
  }
  if (reportId) {
    const reportDeleted = await Report.destroy({
      where: { id: reportId },
    });
    return reportDeleted;
  }
}

////ALL USERS

export async function getAllUsers() {
  const allUsers = await User.findAll();
  return allUsers;
}
