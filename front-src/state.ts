type Condition = "registered" | "initiated";

// const API_BASE_URL = "http://localhost:3002";
const API_BASE_URL = "https://current-desafio-m-7.herokuapp.com";

// ("https://pet-app-dwf-m7.herokuapp.com");
//http://localhost:3001"

const state = {
  data: {
    registerDate: {
      password: "",
      userCreated: false,
      token: "",
      condition: "",
      pages: ([] = []),
    },
    meDate: {
      condition: "",
      name: "",
      token: "",
      password: "",
      reports: ([] = []),
      email: "",
      location: {
        lat: "",
        lng: "",
      },
    },
    meReport: {
      deleted: "",
      modified: false,
      namePet: "",
      location: "",
      lat: false,
      lng: false,
      pictureURL: "",
    },

    reportNotUser: {
      petsName: "",
      emailSuccessfull: "",
      location: "",
      nameReporter: "",
      cellphone: "",
      message: "",
      cordenates: {
        lat: "",
        lng: "",
      },
      reportsCloseToMe: ([] = []),
      usersOwnersId: "",
      usersEmail: "",
    },
  },
  listeners: [],

  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("meDate", JSON.stringify(this.data.meDate));
    console.log("el state a cambiado", newState);
  },
  init() {
    let dataMe = this.getState();
    if (!localStorage.meDate) {
      this.setState(dataMe);
    } else {
      const localData = JSON.parse(localStorage.getItem("meDate"));
      dataMe.meDate = localData;
      this.setState(dataMe);
    }
  },

  ////SECTION REPORT NOT USERS///////////

  getReports() {
    const cs = this.getState();
    const lat = cs.meDate.location.lat;
    const lng = cs.meDate.location.lng;
    fetch(API_BASE_URL + "/reports-close-to?lat=" + lat + "&lng=" + lng, {
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        cs.reportNotUser.reportsCloseToMe = data;
        this.setState(cs);
      });
  },
  /// TRAIGO UN USUARIO ESPECIFICO
  getEmailUsers(callback?) {
    const cs = this.getState();
    const idUser = cs.reportNotUser.usersOwnersId;
    fetch(API_BASE_URL + "/one-user/" + idUser)
      .then((res) => res.json())
      .then((data) => {
        console.log("getEmailUsers", data);
        cs.reportNotUser.usersEmail = data.email;
        this.setState(cs);
      });

    callback();
  },

  ///TRAIGO UN REPORT ID
  getOneReportsNotUser(reportID, callback) {
    const cs = this.getState();

    fetch(API_BASE_URL + "/report/" + reportID)
      .then((res) => res.json())
      .then((data) => {
        cs.reportNotUser.petsName = data.namePet;
        cs.reportNotUser.location = data.location;
        cs.reportNotUser.cordenates.lat = data.lat;
        cs.reportNotUser.cordenates.lng = data.lng;
        cs.reportNotUser.usersOwnersId = data.user_id;
      });
    if (callback) {
      callback();
    }
  },

  ////PREPARO EL MENSAJE PARA ENVIAR
  sentReportNotUser({ id, cellphone, nameReporter, message }, callback?) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/not-user-report/" + id, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        nameReporter: nameReporter,
        cellphone: cellphone,
        message: message,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data del sent state", data);
        cs.reportNotUser.nameReporter = data.nameReporter;
        cs.reportNotUser.cellphone = data.cellphone;
        cs.reportNotUser.message = data.message;
        this.setState(cs);
      });
    if (callback) {
      callback();
    }
  },

  ///// ENVIO EL EMAIL
  sentEmailToUser() {
    const cs = this.getState();
    const emailUser = cs.reportNotUser.usersEmail;
    const name = cs.reportNotUser.nameReporter;
    const message = cs.reportNotUser.message;
    const cellphone = cs.reportNotUser.cellphone;

    fetch(API_BASE_URL + "/email", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        emailUser: emailUser,
        name: name,
        message: message,
        cellphone: cellphone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data del metodo envio de email", data);
        cs.reportNotUser.emailSuccessfull = data.message;
        this.setState(cs);
      });
  },
  setPages(currentPage) {
    const cs = this.getState();
    cs.registerDate.pages = currentPage;
    this.setState(cs);
  },

  ////SECTION AUTHENTICATION AND DATES USERS

  signUp(name, email, password, callback?) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data signup", data);
        cs.meDate.name = data.user.name;
        cs.meDate.email = data.user.email;
        cs.registerDate.password = data.auth.password;
        cs.meDate.password = data.auth.password;
        cs.registerDate.userCreated = true;
        cs.registerDate.condition = "registered";
        cs.meDate.condition = "registered";
        this.setState(cs);
      });
  },
  signIn(email, password) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((res) => res.json())
      .then((data) => {
        cs.meDate.token = data.token;
        cs.meDate.email = data.auth.email;
        cs.meDate.name = data.user.name;
        cs.registerDate.condition = "initiated";
        cs.meDate.condition = "initiated";
        state.setState(cs);
      });
  },
  updateMeDate(name, email) {
    const cs = this.getState();
    ///ACA TRAER TOKEN LOCALSTORAGE
    fetch(API_BASE_URL + "/me/modified", {
      method: "put",
      headers: {
        Authorization: `bearer ${cs.meDate.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, email: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        cs.meDate.email = data.myDataModified.email;
        cs.meDate.name = data.myDataModified.name;
        this.setState(cs);
      });
  },
  changePassword(oldPassword, oldPasswordVerify, newPassword) {
    ///ACA TRAER TOKEN LOCALSTORAGE
    const cs = this.getState();
    fetch(API_BASE_URL + "/change-password", {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${cs.meDate.token}`,
      },
      body: JSON.stringify({
        passwordOld: oldPassword,
        passwordVerify: oldPasswordVerify,
        passwordNew: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data del changepassword", data);
        cs.meDate.password = data.AuthModifiedSucess.password;
        cs.registerDate.password = data.AuthModifiedSucess.password;
        this.setState(cs);
      });
  },
  closeSession() {
    window.localStorage.removeItem("meDate");
    const cs = this.getState();

    (cs.registerDate.password = ""),
      (cs.registerDate.userCreated = false),
      (cs.registerDate.token = ""),
      (cs.registerDate.condition = ""),
      (cs.registerDate.pages = [] = []);

    (cs.meDate.name = ""),
      (cs.meDate.token = ""),
      (cs.meDate.password = ""),
      (cs.meDate.condition = ""),
      (cs.meDate.reportsByMe = []),
      (cs.meDate.email = ""),
      (cs.meDate.location = {
        lat: "",
        lng: "",
      });
    this.setState(cs);
  },

  /// SET LAT AND LNG datesss todo MIREPORT IN STATE

  setDatesMeReport(lng, lat, name, location, pictureURL, callback?) {
    const cs = this.getState();
    cs.meReport.namePet = name;
    cs.meReport.location = location;
    cs.meReport.lng = lng;
    cs.meReport.lat = lat;
    cs.meReport.pictureURL = pictureURL;

    this.setState(cs);
    if (callback) {
      callback();
    }
  },

  ////Create Reports
  createReport() {
    const cs = this.getState();
    const namePet = cs.meReport.namePet;
    const location = cs.meReport.location;
    const lat = cs.meReport.lat;
    const lng = cs.meReport.lng;
    const pictureURL = cs.meReport.pictureURL;

    fetch(API_BASE_URL + "/report-pet", {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${cs.meDate.token}`,
      },
      body: JSON.stringify({
        namePet: namePet,
        location: location,
        lat: lat,
        lng: lng,
        pictureURL: pictureURL,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data Create", data);
        cs.meReport.namePet = data.namePet;
        cs.meReport.location = data.location;
        cs.meReport.lat = data.lat;
        cs.meReport.lng = data.lng;
        cs.meReport.pictureURL = data.pictureURL;
        this.setState(cs);
      });
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
  getMeReports() {
    const cs = this.getState();
    fetch(API_BASE_URL + "/me/reports-pets", {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${cs.meDate.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        cs.meDate.reports = data;
        this.setState(cs);
      });
  },

  ////GET ONE REPORT
  saveAndGetIdReportEdit(id) {
    window.localStorage.setItem("idReport", id);
    const cs = this.getState();
    fetch(API_BASE_URL + "/me/report/" + id, {
      method: "get",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${cs.meDate.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("el report elegido", data);
        cs.meReport.namePet = data.namePet;
        cs.meReport.location = data.location;
        cs.meReport.lat = data.lat;
        cs.meReport.lng = data.lng;
        cs.meReport.pictureURL = data.pictureURL;
        this.setState(cs);
      });
  },
  updateReport(idReport) {
    const cs = this.getState();
    const namePet = cs.meReport.namePet;
    const location = cs.meReport.location;
    const lat = cs.meReport.lat;
    const lng = cs.meReport.lng;
    const pictureURL = cs.meReport.pictureURL;

    fetch(API_BASE_URL + "/me/reports-modified/" + idReport, {
      method: "put",
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${cs.meDate.token}`,
      },
      body: JSON.stringify({
        namePet: namePet,
        location: location,
        lat: lat,
        lng: lng,
        pictureURL: pictureURL,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data modificada", data);
        cs.meReport.modified = true;
        this.setState(cs);
      });
  },

  deletedReport(id, callback?) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/delete-report/" + id, {
      method: "delete",
      headers: {
        authorization: `bearer ${cs.meDate.token}`,
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("datadeleted", data);
        cs.meReport.deleted = data.message;
        this.setState(cs);
      });
    if (callback) {
      callback();
    }
  },
};

export { state };
