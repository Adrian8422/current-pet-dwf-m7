const dog = require("../../assets/image 1 (1).svg");
const menuBurger = require("../../assets/menu-burger.png");
const closeBurgerMenu = require("../../assets/close-img-menu.png");
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Header extends HTMLElement {
  connectedCallback() {
    this.render();
    const style = document.createElement("style");
    style.innerHTML = `

    .header{
       display: flex;
       max-width: 1320px;
       margin: 0 auto;
       flex-direction: row;
       justify-content: space-between;
       background-color: #cb00ff;
       border-radius:4px;

    }
    .container-logo{
        display: flex;
        padding: 8px;
        width: 58px;
    }
    .window-header{
        display:none;
        flex-direction:column;
    }
    .container__window-date{
        display:flex;
        flex-direction:column;


    }
    .user-conected{
        display:flex;
        flex-direction:column;
    }
    .close-menu{
        display:none;
        width: 49px;
        height: 45px;
        padding: 6px 15px 0 0;
    }
    .window-header{
        display: none;
        flex-direction: column;
        background-color: #dcdcdccc;
        align-items: center;
        height: 463px;
        position: absolute;
        top: 65px;
        left: 0;
        right: 0;
        justify-content: center;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 4px;
        justify-content: space-evenly;
    }
    
    

    
    
    
    `;
    this.appendChild(style);
  }
  addlisteners() {
    const cs = state.getState();
    /////ACOMODAR LA VENTANA DEL MENU BURGER PORQUE SE VA A LA DERECHA
    const menuBurger = this.querySelector(".menu-burger");
    const windowHeader = this.querySelector(".window-header");
    const closeWindowHeader = this.querySelector(".close-menu");
    const closeSession = this.querySelector(".button-close-session");

    menuBurger.addEventListener("click", () => {
      windowHeader.setAttribute("style", "display:flex");
      menuBurger.setAttribute("style", "display:none");
      closeWindowHeader.setAttribute("style", "display:flex");
    });
    closeWindowHeader.addEventListener("click", () => {
      windowHeader.setAttribute("style", "display:none");
      closeWindowHeader.setAttribute("style", "display:none");
      menuBurger.setAttribute("style", "display:flex");
    });
    ////Redirijo a la page seleccionada si el usuario esta activo initiated, sino lo envio a page para loguearse
    const meDate = this.querySelector(".meDate");
    const mePets = this.querySelector(".mePets");
    const meReport = this.querySelector(".meReport");
    meDate.addEventListener("click", () => {
      state.setPages("/me-page");
      if (cs.registerDate.condition == "initiated") {
        Router.go("me-page");
      } else {
        Router.go("sign");
      }
    });
    mePets.addEventListener("click", () => {
      state.setPages("/me-reports");
      if (cs.registerDate.condition == "initiated") {
        Router.go("me-reports");
      } else {
        Router.go("sign");
      }
    });
    meReport.addEventListener("click", () => {
      state.setPages("/report-pet");
      if (cs.registerDate.condition == "initiated") {
        Router.go("report-pet");
      } else {
        Router.go("sign");
      }
    });
    //// Close session

    closeSession.addEventListener("click", () => {
      window.localStorage.removeItem("userTk");
      Router.go("home-oficial");
    });
  }
  render() {
    this.innerHTML = `

      <header class="header">
         <div class="container-logo">
            <img src="${dog}" alt="">
         </div> 
         <div class="container-menu-burger" class="container-logo">
            <img class="menu-burger" src="${menuBurger}" alt="">
            <img class="close-menu" src="${closeBurgerMenu}" alt="">
         </div>   
         
           
         </header> 
         <div class="window-header">
            <div class="container__window-date">
               <h3 class="meDate">Mis datos</h3>
               <h3 class="mePets">Mis mascotas reportadas</h3>
               <h3 class="meReport">Reportar mascota</h3>
            </div>
            <div class="user-conected">
               <h3>example adrian@gmail.com</h3>
               <button class="button-close-session">Sign off</button>
            </div>
         </div>

      `;

    this.addlisteners();
  }
}
customElements.define("header-comp", Header);
