import { Report } from "../models/report";
import { User } from "../models/user";

import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";
//// UPDATE REPORT PET USER ACTIVE

function bodyParse(body, id) {
  const resultado: any = {};
  if (body.namePet) {
    resultado.name = body.namePet;
  }
  if (body.location) {
    resultado.location = body.location;
  }
  if (body.lat && body.lng) {
    resultado._geoloc = {
      lat: body.lat,
      lng: body.lng,
    };
  }
  if (body.pictureURL) {
    resultado.pictureURL = body.pictureURL;
  }
  if (id) {
    resultado.objectID = id;
  }
}

export async function updateReportPet(userId: number, idReport, dataUser) {
  if (!userId) {
    throw "error in userId";
  }
  if (userId) {
    const imagen = await cloudinary.uploader.upload(dataUser.pictureURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });
    const dataMasImage = {
      namePet: dataUser.namePet,
      location: dataUser.location,
      lat: dataUser.lat,
      lng: dataUser.lng,
      pictureURL: imagen.secure_url,
    };
    const dataActualizada = await Report.update(dataMasImage, {
      where: { id: idReport },
    }).catch((err) => {
      console.error(err);
    });

    const user = await User.findByPk(userId).catch((err) => {
      console.error(err);
    });
    const reporte = await Report.findByPk(idReport);
    await index.partialUpdateObject({
      objectID: reporte.get("id"),
      name: reporte.get("namePet"),
      location: reporte.get("location"),
      emailUser: user["email"],
      pictureURL: imagen.secure_url,
      _geoloc: {
        lat: reporte.get("lat"),
        lng: reporte.get("lng"),
      },
    });
    const reporteModificado = await Report.findByPk(idReport);
    return reporteModificado;
  }

  // const currentDate = {
  //   namePet: dataUser.namePet,
  //   location: dataUser.location,
  //   lat: dataUser.lat,
  //   lng: dataUser.lng,
  //   pictureURL: imagen.secure_url,
  // };
  // const indexItem: any = bodyParse(currentDate, idReport);
  // index.partialUpdateObject(indexItem).then((object) => {
  //   console.log("todo ok");
  // });
  // return currentDate;

  // if (user) {
  //   const reportAModificar = await Report.update(
  //     {
  //       namePet: dataUser.namePet,
  //       location: dataUser.location,
  //       lat: dataUser.lat,
  //       lng: dataUser.lng,
  //       pictureURL: imagen.secure_url,
  //       user_id: user.get("id"),
  //     },
  //     { where: { id: reportId } }
  //   );
  //   const report = await Report.findByPk(reportId);

  //   await index.partialUpdateObject({
  //     objectID: report.get("id"),
  //     name: report.get("namePet"),
  //     location: report.get("location"),
  //     pictureURL: imagen.secure_url,
  //     _geoloc: {
  //       lat: report.get("lat"),
  //       lng: report.get("lng"),
  //     },
  //   });
  //   const reporteModificado = await Report.findByPk(reportId);
  //   return reporteModificado;
  // }
}

//////////////////////////////////////

///ALL REPORTS OF ALL USERS
export async function allReportsOfAllUsers() {
  const allReports = await Report.findAll();
  return allReports;
}

////GET ONE REPORT ID OF ALL USERS
export async function getOneReport(reportID) {
  const reportReturn = await Report.findByPk(reportID);
  return reportReturn;
}

/// SEARCH DATES LAT&&LNG IN ALGOLIA (AROUNDRADIOUS && AROUND LATLNG)

export async function searchDatesInAlgolia(data) {
  const { lat, lng } = data;
  if (lat && lng) {
    const { hits } = await index.search("", {
      aroundLatLng: [lat, lng].join(","),
      aroundRadius: 100000,
    });
    return hits;
  }
  try {
    if (lat && lng) {
      const { hits } = await index.search("", {
        aroundLatLng: [lat, lng].join(","),
        aroundRadius: 100000,
      });
      return hits;
    }
  } catch (error) {
    return console.log(error);
  }
}
