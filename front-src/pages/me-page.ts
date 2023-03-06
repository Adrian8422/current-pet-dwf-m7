import { Router } from "@vaadin/router";
import { state } from "../state";

///

class MeDate extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  addListeners() {
    const editPerfil: any = this.querySelector(".button-editar-perfil");
    editPerfil.addEventListener("click", () => {
      Router.go("edit-me");
    });
    const changePassword: any = this.querySelector(".button-cambiar-password");
    changePassword.addEventListener("click", () => {
      Router.go("change-password");
    });
    /// Seguro cerrar sesion?
    const windowCloseSession: any = this.querySelector(".window-close-sesion");
    const buttonCloseSessionInWindow: any =
      this.querySelector(".button-window");
    const buttonReturnSesion: any = this.querySelector(".button-window-volver");
    const closeSesion: any = this.querySelector(".button-cerrar-sesion");
    closeSesion.addEventListener("click", () => {
      windowCloseSession.setAttribute("style", "display:flex");
    });
    buttonCloseSessionInWindow.addEventListener("click", () => {
      state.closeSession();
      console.log("luego de cerrar sesion", state.data);
      alert("sesion cerrada");

      Router.go("/");
    });
    buttonReturnSesion.addEventListener("click", () => {
      windowCloseSession.setAttribute("style", "display:none");
    });
  }

  render() {
    const cs = state.getState();
    const style = document.createElement("style");
    style.innerHTML = `
    .container-page{
      height: 503px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
    .title-page{
      text-align: center;
    }
    .container-options{
      max-width: 258px;
      display: grid;
      gap: 13px;
      margin: 0 auto;
    }
    .window-close-sesion{
      display: none;
      flex-direction: column;
      box-shadow: 1px 1px 4px 1px;
      border-radius: 4px;
      text-align: center;
    }
    .container-button-window{
      padding: 8px;
      background-color: #e66e6e;
    }
   
    .button-window{
      background-color: red;
      color: white;
    }
    

      `;
    this.innerHTML = `

    <header-comp></header-comp>
    <div class="container-page">
      <h2 class="title-page">Mis datos</h2>
       <div class="container-datos">
         <h3 class="name">user:${state.data.meDate.name}</h3> 
         <h3 class="email">${state.data.meDate.email}</h3> 
       </div>
       <div class="container-options">
           <div class="window-close-sesion">
              <div class="container-button-window">
                 <h3>Seguro quieres cerrar sesion ${state.data.meDate.name}?</h3>
                 <button class="button-window">cerrar</button>
                 <button class="button-window-volver">volver</button>

              </div>
           </div>
           <button class="button-editar-perfil">Editar perfil</button>
           <button class="button-cambiar-password">Cambiar password</button>
           <button class="button-cerrar-sesion">Cerrar sesión</button>
       </div>





    </div>

    
    
        `;
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("me-page", MeDate);
