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
      margin: 0 auto;
      flex-direction: row;
      justify-content: space-between;
      background-color: #05d3d9ed;
      position: fixed;
      left: 8px;
      right: 8px;
      top: 8px;
      max-width: 1000px;
      border-radius: 13px;

    }
    .container-logo{
        display: flex;
        padding: 8px;
        width: 58px;
    }
    .window-header{
      display: none;
      flex-direction: column;
      background-color: #dcdcdce8;
      align-items: center;
      height: 361px;
      position: fixed;
      top: 57px;
      left: 8px;
      right: 8px;
      max-width: 800px;
      margin: 0 auto;
      border-radius: 4px;
      justify-content: space-evenly;
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

    
    

    
    
    
    `;
    this.appendChild(style);
  }
  addlisteners() {
    const cs = state.getState();
    /// SEGUN LA PAGE DONDE ESTE MODIFICO EL TOP DEL WINDOW HEADER
    if (location.pathname == "/me-reports") {
      const header = this.querySelector(".header");
      header.setAttribute("style", "top:0");
    }
    if (location.pathname == "/home-oficial") {
      const header = this.querySelector(".header");
      header.setAttribute("style", "top:0");
    }
    if (location.pathname == "/me-reports") {
      const windowHeader = this.querySelector(".window-header");
      windowHeader.setAttribute("style", "top: 50px");
    }
    /////ACOMODAR LA VENTANA DEL MENU BURGER PORQUE SE VA A LA DERECHA
    const menuBurger = this.querySelector(".menu-burger");
    const windowHeader = this.querySelector(".window-header");
    const closeWindowHeader = this.querySelector(".close-menu");

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
    const petIcon = this.querySelector(".pet-icon");
    petIcon.addEventListener("click", () => {
      if (!cs.meDate.location.lat && !cs.meDate.location.lng) {
        Router.go("/");
      } else {
        Router.go("home-oficial");
      }
    });
    meDate.addEventListener("click", () => {
      state.setPages("/me-page");
      windowHeader.setAttribute("style", "display:none");
      if (cs.meDate.condition == "initiated") {
        Router.go("me-page");
      } else {
        Router.go("sign");
      }
    });
    mePets.addEventListener("click", () => {
      state.setPages("/me-reports");
      windowHeader.setAttribute("style", "display:none");
      if (cs.meDate.condition == "initiated") {
        Router.go("me-reports");
      } else {
        Router.go("sign");
      }
    });
    meReport.addEventListener("click", () => {
      state.setPages("/report-pet");
      windowHeader.setAttribute("style", "display:none");
      if (cs.meDate.condition == "initiated") {
        Router.go("report-pet");
      } else {
        Router.go("sign");
      }
    });
  }
  render() {
    const cs = state.getState();
    this.innerHTML = `

      <header class="header">
         <div class="container-logo">
            <img class="pet-icon" src="${dog}" alt="">
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
               <h3 style="text-align: center" > User => ${cs.meDate.email}</h3>
               
            </div>
         </div>

      `;

    this.addlisteners();
  }
}
customElements.define("header-comp", Header);
