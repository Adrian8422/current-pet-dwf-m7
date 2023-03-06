import { Router } from "@vaadin/router";
import { state } from "../state";

class Homepage extends HTMLElement {
  connectedCallback() {
    this.render();
    const style = document.createElement("style");
    style.innerHTML = `
    .home-page{
      display: flex;
      flex-direction: column;
      height: 807px;
    }
    .container-titles{
      display: flex;
      flex-direction: column;
      padding: 85px;
      text-align: center;
      height: 572px;
      justify-content: space-between;
      margin: 0 auto;
    }
    .subtitle-page{
      max-width: 566px;
    }
    `;
    this.appendChild(style);
  }
  addlisteners() {
    const cs = state.getState();
    const button: any = this.querySelector(".button-el");
    button.addEventListener("click", () => {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      function successfully(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        cs.meDate.location.lat = lat;
        cs.meDate.location.lng = lng;
        state.setState(cs);
      }
      function error(err) {
        console.log("error in ubication");
      }
      navigator.geolocation.getCurrentPosition(successfully, error, options);
      setTimeout(() => {
        Router.go("home-oficial");
      }, 3000);
    });
  }
  render() {
    this.innerHTML = `


    <header-comp></header-comp>
    <div class="home-page">
    
       <div class="container-titles">
          <h1 class="title-page">Mascotas perdidas cerca tuyo</h1>
          <h2 class="subtitle-page">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</h2>
          <button-comp class="button-el" variant="button-green">comenzar</button-comp>
       </div>

    </div>
    
    
    `;
    this.addlisteners();
  }
}
customElements.define("home-ubication", Homepage);
