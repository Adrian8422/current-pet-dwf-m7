import { state } from "../state";
const dogImg = require("../assets/dog.svg");
const closeImg = require("../assets/close.png");

class HomeOficial extends HTMLElement {
  connectedCallback() {
    state.getReports();
    state.subscribe(() => {
      const cs = state.getState();
      console.log("console.log", cs);
      this.cardPets = cs.reportNotUser.reportsCloseToMe;
      this.render();
    });
    this.render();
  }

  addListeners() {
    const cs = state.getState();
    // const refresh = document.querySelector(".button-refresh");
    // refresh.addEventListener("click", () => {});

    /// ACTIVO CADA FORMULARIO
    const sentReportNotUser = this.querySelectorAll(".report-info");
    sentReportNotUser.forEach((report) => {
      report.addEventListener("click", () => {
        const form = this.querySelector(".form");
        form.setAttribute("style", "display:flex");
      });
    });
    //// OBTENGO ID DE CADA CARDpET Y REALIZO SUBMIT A EL ID QUE SELECCIONE
    sentReportNotUser.forEach((e) => {
      e.addEventListener("click", (event) => {
        const id = e.getAttribute("id");
        const idParse = parseInt(id);

        state.getOneReportsNotUser(idParse, () => {
          const formSubmit = this.querySelector(".form");
          formSubmit.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;

            const nameReporter = target.nameReporter.value;
            const cellphone = target.cellphone.value;
            const message = target.message.value;

            /// SETEO LAS VARIABLES PROXIMAS A ENVIAR
            state.sentReportNotUser(
              { id, cellphone, nameReporter, message },
              () => {
                ////OBTENGO EL EMAIL DEL USER VINCULADO A ESE REPORTE
                state.getEmailUsers(() => {
                  ///ENVIO EL EMAIL
                  state.sentEmailToUser();
                  console.log("todo ok");
                });
              }
            );
            state.setState(cs);
            setTimeout(() => {
              alert("mensaje enviado correctamente :D");
            }, 2000);
          });
        });
      });
      ///CIERRO FORM
      const closeWindowReport = this.querySelectorAll(".img-close");

      closeWindowReport.forEach((form) => {
        form.addEventListener("click", () => {
          const formReport = this.querySelector(".form");
          formReport.setAttribute("style", "display:none");
        });
      });
    });
  }
  addStylesMsg() {}

  cardPets: [] = [];
  render() {
    const style = document.createElement("style");
    style.innerHTML = `
     .home-page{
      height: 100%;
      padding: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
     }
     .title-page{
      padding: 46px 0 0 0;
     }
     .container-cards{
      display: flex;
      flex-direction: column;
      max-width: 302px;
      justify-content: center;
      margin: 0 auto;
      margin-top: 60px;
   
     }
     .card{
      max-width: 261px;
      margin: 0 auto;
      border: solid 1px;
      border-radius: 5px;
      box-shadow: 2px 1px 8px 2px;
      margin-bottom: 51px;
     }
     .img-card{
      padding: 4px;
      max-width: 185px;
     }
     .title-card{
       margin:0;
     }

     .container-titles-card{
       padding: 7px;
       
       
      }
      .report-info{
        color:blue;
      }
      
      .form{
        display:none;
        width: 299px;
        border: solid 2px;
        text-align: center;
        flex-direction: column;
        box-shadow: 1px 1px 16px 0px;
        background-color: #ffe4c4b5;
      }
      .container-img-close{
        display: flex;
        justify-content: end;
        padding: 9px;
      }


      `;
    this.innerHTML = `
    <header-comp></header-comp>
    <div class="home-page">
    <div class="container-titles">
      <h1 class="title-page">Mascotas perdidas cerca tuyo</h1>
    </div>
    <div class="container-cards">
      ${this.cardPets
        .map((c: any) => {
          if (c) {
            return `
      <div class="card">
        <div class="container-img">
          <img class="img-card" src="${c.pictureURL}" />
        </div>
        <div class="container-titles-card">
          <h2 class="title-card">${c.name}</h2>
          <p class="sub-title">${c.location}</p>
          <div id="${c.objectID}" class="report-info" href="">Reportar info</div>
        </div>
      </div>
    
    <form class="form">
       <div class="container-img-close">
          <img class="img-close" src="${closeImg}"/> 
       
       </div>
       <label>
         <h2>Your name</h2>
         <input class="input" type="text" name="nameReporter" />
       </label>
       <label>
         <h2>Your cellphone</h2>
         <input class="input" type="text" name="cellphone" />
         </label>
       <div class="sent-message">
         <h2>How to watching pet</h2>
         <textarea name="message" class="text-area"></textarea>
       </div>
       <div>
         <br />
         <button>Sent</button>
       </div>
    </form>
      `;
          }
        })
        .join(" ")}
    </div>


    <button class="button-refresh">Refresh</button>
  </div>
        `;
    this.appendChild(style);
    this.addListeners();
    this.addStylesMsg();
  }
}
customElements.define("home-oficial", HomeOficial);
