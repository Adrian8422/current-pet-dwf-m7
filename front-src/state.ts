type Condition = "registered" | "initiated";
type UserCreated = true | false;
type StateUser = "actived" | "deactivated";

const API_BASE_URL = "http://localhost:3001";
import "lodash/map";

const state = {
  data: {
    registerDate: {
      password: "",
      userCreated: "",
      token: "",
      condition: "",
      stateUser: "",
      pages: ([] = []),
    },
    meDate: {
      error: "",
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
  init() {
    localStorage.getItem("userTk");
  },

  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("el state a cambiado", newState);
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
    ///HARDCODE- ACOMODAR
    const cs = this.getState();
    // const idReportSentMessage = cs.reportNotUser.idReports;
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
        cs.registerDate.condition = "registered";
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
        ///CUANDO ESTE BIEN LA INTERACCION DE LAS PAGES- SETEAR PARA QUE EL TOKEN SE GUARDE EN LOCALSTORAGE Y SI ESTA ALLI FUNCIONE TODO SINO QUE ME PIDA LOGUEARME ARE NOW
        // window.localStorage.setItem("userTk", `${data.token}`);
        cs.meDate.email = data.auth.email;
        cs.meDate.name = data.user.name;
        cs.registerDate.condition = "initiated";
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
        ////ACA VER COMO PODER GUARDAR UN ERROR SI NO SE PUEDE MODIFICAR LOS DATOS ASI PUEDO MOSTRARLO EN LA PAGE CON UN ALERT!
        cs.meDate.error = this.setState(cs);
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
    const cs = this.getState();
    ///PROXIMO HACER, VACIAR REGISTER DATA Y ME DATA DEL STATE ASI SE REINICIA CUANDO CIERRO SESION :D

    ////ACA LUEGO VAMOS A QUITAR EL TOKEN DEL LOCALSTORAGE CUANDO LO GUARDEMOS EN EL LOCAL STORAGE 4894♦68‗796♦98♦964b49
    (cs.registerDate.password = ""),
      (cs.registerDate.userCreated = ""),
      (cs.registerDate.token = ""),
      (cs.registerDate.condition = ""),
      (cs.registerDate.stateUser = ""),
      (cs.registerDate.pages = [] = []);

    (cs.meDate.name = ""),
      (cs.meDate.token = ""),
      (cs.meDate.password = ""),
      (cs.meDate.reportsByMe = []),
      (cs.meDate.email = ""),
      (cs.meDate.location = {
        lat: "",
        lng: "",
      });
    this.setState(cs);
  },
  ////SET PICTUREURL AND DATES IN CLOUDINARY
  // setDatePictureCloud(URL) {
  //   const cs = this.getState();
  //   cs.meReport.pictureURL = URL;

  //   this.setState(cs);
  // },

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

  ////((((((((PROXIMO A REALIZAR , ENVIAR EL REPORTTE A TRAVES DEL STATE , NO USAR LOS DATOS DIRECTO DESDE LA PAGE))))))))
  ////Create Reports
  createReport() {
    ///ACA TRAER TOKEN LOCALSTORAGE
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
  saveIdReportEdit(id) {
    window.localStorage.setItem("idReport", id);
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
        // cs.meReport.namePet = data.namePet;
        // cs.meReport.location = data.location;
        // cs.meReport.lat = data.lat;
        // cs.meReport.lng = data.lng;
        // cs.meReport.pictureURL = data.pictureURL;
        // this.setState(cs);
      });
  },
  getOneReport(id) {
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
};

export { state };
