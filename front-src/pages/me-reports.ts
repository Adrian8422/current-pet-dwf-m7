import { Router } from "@vaadin/router";
import { state } from "../state";

///

const imgPencil = require("../assets/pencil.png");
class MeReports extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    state.getMeReports();
    state.subscribe(() => {
      const cs = state.getState();
      this.cardMeReports = cs.meDate.reports;
      this.render();
    });
    this.render();
  }

  addListeners() {
    const cs = state.getState();

    ///REDIRIJO A PAGE EDIT REPORT DESDE LA CARD QUE TOQUE OBTENIENDO EL ID DE LA CARD
    const editRedirectPage = this.querySelectorAll(".pencil");
    editRedirectPage.forEach((pencil) => {
      pencil.addEventListener("click", () => {
        const id = pencil.getAttribute("id");
        const idParse = parseInt(id);
        state.saveIdReportEdit(idParse);
        setTimeout(() => {
          Router.go("update-report");
        }, 2000);
      });
    });
  }
  cardMeReports: [] = [];

  render() {
    const cs = state.getState();
    const style = document.createElement("style");
    style.innerHTML = `
    .container-cards{
      display: flex;
      flex-direction: column-reverse;
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
     }
     .img-card{
      padding: 4px;
      max-width: 260px;
     }
     .title-card{
      margin:0;
    }

    .container-titles-card{
      padding: 7px;
      
      
     }
     .container-pencil{
       display:flex;

     }
     .sub-title{
      margin: 0;
     }
     .container-edit-report{
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
     }
     .pencil{
      padding: 0 3px 0px 0;
     }


      `;
    this.innerHTML = `
  
   

    <header-comp></header-comp>
    <div class="container-page">
    <h1>Me reports</h1>

        <div class="container-cards">
        ${this.cardMeReports
          .map((c: any) => {
            if (c) {
              return `
            <div class="card">
               <div class="container-img">
                 <img class="img-card" src="${c.pictureURL}" />
               </div>
               <div class="container-titles-card">
                 <h2 class="title-card">${c.namePet}</h2>
                 <p class="sub-title">${c.location}</p>       
                 <div class="container-edit-report" href=""><img id="${c.id}" class="pencil" src="${imgPencil}" alt="" /></div>
                 
               </div>    
              </div>

            `;
            }
          })
          .join(" ")}
        </div>
  
    </div>

    
    
    `;

    this.appendChild(style);

    this.addListeners();
  }
}
customElements.define("me-reports", MeReports);
