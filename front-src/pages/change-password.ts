import { Router } from "@vaadin/router";
import { state } from "../state";

///

class ChangePassword extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  addListeners() {
    const cs = state.getState();
    const form = this.querySelector(".form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      const oldPassword = target.passwordOld.value;
      const oldPasswordVerify = target.passwordOldVerify.value;
      const newPassword = target.newPassword.value;
      state.changePassword(oldPassword, oldPasswordVerify, newPassword);
      setTimeout(() => {
        Router.go("me-page");
      }, 2000);
    });
  }

  render() {
    const cs = state.getState();
    const style = document.createElement("style");
    style.innerHTML = `
    .container-page{
        display: flex;
        height: 500px;
        flex-direction: column;
        justify-content: center;
    }
    .form{
        display: flex;
        flex-direction: column;
        max-width: 205px;
        margin: 0 auto;
    }


      `;
    this.innerHTML = `

    <header-comp></header-comp>
    <div class="container-page">

       <form class="form">
         <input class="input" type="password" name="passwordOld" placeholder="Ingrese password actual"/>
         <input class="input" type="password" name="passwordOldVerify" placeholder="Repita password"/>
         <input class="input" type="password" name="newPassword" placeholder="Ingrese password nueva"/>
         <button class="button">Modificar</button>  
       </form>





    </div>

    
    
        `;
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("change-password", ChangePassword);
