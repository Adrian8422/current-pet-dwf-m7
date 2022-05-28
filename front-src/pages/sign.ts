import { Router } from "@vaadin/router";
import { state } from "../state";

///

class Sign extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  addListeners() {
    const cs = state.getState();
    ////cambio de formulario segun eleccion
    const titleSignUp = this.querySelector(".container-get-register");
    const titleSignIn = this.querySelector(".container-get-login");
    const buttonGetRegister = this.querySelector(".button-register");
    const buttonGetLogin = this.querySelector(".button-login");
    const buttonChangeAloginForSubmitOkey = this.querySelector(
      ".button-signupAsignin"
    );
    const formSignUp: HTMLFormElement = this.querySelector(".form-signup");
    const formSignIn: HTMLFormElement = this.querySelector(".form-signin");
    buttonGetRegister.addEventListener("click", () => {
      titleSignUp.setAttribute("style", "display:none");
      titleSignIn.setAttribute("style", "display:flex");
      formSignIn.setAttribute("style", "display:none");
      formSignUp.setAttribute("style", "display:flex");
    });
    buttonGetLogin.addEventListener("click", () => {
      titleSignUp.setAttribute("style", "display:flex");
      titleSignIn.setAttribute("style", "display:none");
      formSignIn.setAttribute("style", "display:flex");
      formSignUp.setAttribute("style", "display:none");
    });
    ///UNA VEZ QUE COMPLETO EL SIGNUP ME DERIVA AL SIGNIN CLICKANDO EL BUTTON REGISTER DEL FORM
    buttonChangeAloginForSubmitOkey.addEventListener("click", () => {
      titleSignUp.setAttribute("style", "display:flex");
      titleSignIn.setAttribute("style", "display:none");
      formSignIn.setAttribute("style", "display:flex");
      formSignUp.setAttribute("style", "display:none");
    });
    ////// Submit en cada formulario

    formSignUp.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      const name = target.nombre.value;
      const emailSignUp = target.emailSignUp.value;
      const passwordSignUp = target.passwordSignUp.value;
      setTimeout(() => {
        state.signUp(name, emailSignUp, passwordSignUp);
        if (cs.registerDate.userCreated == true) {
          alert("user register successfull 😉");
        } else if (cs.registerDate.userCreated == false) {
          alert("error in signup, please try again");
        }
      }, 2000);
      formSignUp.reset();
    });
    formSignIn.addEventListener("submit", (event) => {
      event.preventDefault();
      const target = event.target as any;
      const email = target.email.value;
      const password = target.password.value;
      state.signIn(email, password);
      formSignIn.reset();
      setTimeout(() => {
        if (cs.registerDate.condition == "initiated") {
          alert("login successfull :D");
          Router.go(cs.registerDate.pages) || Router.go("/");
        } else if (cs.registerDate.condition !== "initiated") {
          alert("email or password incorrect");
          Router.go("sign");
        }
      }, 2000);
    });
  }

  render() {
    const style = document.createElement("style");
    style.innerHTML = `
    .container-page{
      display: flex;
      flex-direction: column;
      height: 448px;
      justify-content: center;
    }
    .form-signin{
      width: 266px;
      text-align: center;
      flex-direction: column;
      margin: 0 auto;
      display: flex;
      align-items: center;
      padding: 10px 0px 5px 1px;
    }
    .container-get-register{
      display: flex;
      flex-direction: column;
      padding: 14px 35px 6px 59px;
      max-width: 291px;
    }
    .container-get-login{
      display:none;
      flex-direction: column;
      padding: 14px 35px 6px 59px;
      max-width: 291px;
    }

    .form-signup{
      width: 266px;
      text-align: center;
      flex-direction: column;
      margin: 0 auto;
      display: none;
      align-items: center;

    }
    .input{
      margin-bottom: 5px;
    }
    

      `;
    this.innerHTML = `
    <header-comp></header-comp>
        <div class="container-get-register">
        <h3>Aun no tienes una cuenta?</h3>
        <p>Registrate clickando el botón</p>
        <button class="button-register">Registrarme</button>
      </div>
    
      <form class="form-signin">
        <h2 class="title-form">Iniciar sesion</h2>
        <label class="label">
          <input
            class="input"
            type="email"
            name="email"
            placeholder="Ingrese su email"
          />
        </label>
        <label class="label">
          <input
            class="input"
            type="password"
            name="password"
            placeholder="Ingrese su contraseña"
          />
        </label>
        <button class="button">Entrar</button>
      </form>



      <div class="container-get-login">
      <h3>Ya estas registrado?</h3>
      <p>Inicia sesion clickando el botón</p>
      <button class="button-login">Iniciar sesión</button>
    </div>
    <form class="form-signup">
      <h2 class="title-form">Registrame</h2>
      <label class="label">
        <input
          class="input"
          type="text"
          name="nombre"
          placeholder="Ingrese su nombre"
        />
      </label>
      <label class="label">
        <input
          class="input"
          type="email"
          name="emailSignUp"
          placeholder="Ingrese su email"
        />
      </label>
      <label class="label">
        <input
          class="input"
          type="password"
          name="passwordSignUp"
          placeholder="Ingrese su contraseña"
        />
      </label>
      <button class="button-signupAsignin">Registrarme</button>
    </form>
    
        `;
    this.className = "container-page";
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("sign-page", Sign);
