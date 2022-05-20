import { Router } from "@vaadin/router";
import { state } from "../state";

///

class EditMeDate extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  addListeners() {
    const cs = state.getState();
    const form = this.querySelector(".form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      const name = target.name.value;
      const email = target.email.value;
      console.log(name, email);
      state.updateMeDate(name, email);

      alert("Se cambiaron tus datos :D");
      Router.go("me-page");
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
         <input class="input" name="name" placeholder="${state.data.meDate.name}"/>
         <input class="input" name="email" placeholder="${state.data.meDate.email}"/>
         <button class="button">Modificar</button>  
       </form>





    </div>

    
    
        `;
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("edit-me", EditMeDate);
