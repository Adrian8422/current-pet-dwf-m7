import { Router } from "@vaadin/router";
import { state } from "../state";
import { Dropzone } from "dropzone";
import * as mapboxgl from "mapbox-gl";
import MapboxClient from "mapbox";
// import { json } from "body-parser";
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

const insertImg = require("../assets/insertImg.png");

///

class ReportPet extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  addListeners() {
    const cs = state.getState();
    ///Submit img dropzone
    let pictureURL;

    const dropzoneImg: any = this.querySelector(".profile-picture");
    const myDropzone = new Dropzone(dropzoneImg, {
      url: "/falsa",
      autoProcessQueue: false,
      clickable: true,
    });
    myDropzone.on("thumbnail", function (file) {
      pictureURL = file.dataURL;
      dropzoneImg.src = file.dataURL;
      pictureURL = file.dataURL;
    });

    const reportForm = this.querySelector(".form");
    reportForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    function initMap() {
      mapboxgl.accessToken = process.env.MAPBOX_TOKEN;
      return new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
      });
    }

    function initSearchForm(callback) {
      ///  Insert date location
      const formSearch: HTMLFormElement =
        document.querySelector(".input-search");
      console.log(formSearch);
      const buscar: any = document.querySelector(".confirmar-ubicacion");

      buscar.addEventListener("click", (e) => {
        e.preventDefault();
        mapboxClient.geocodeForward(
          formSearch.value,
          {
            country: "ar",
            autocomplete: true,
            language: "es",
          },
          function (err, data, res) {
            console.log(data);
            if (!err) callback(data.features);
          }
        );
      });
    }
    let lat;
    let lng;
    (function () {
      ////save location ((lng & lat))
      const map = initMap();
      initSearchForm(function (results) {
        const firstResult = results[0];
        const marker = new mapboxgl.Marker()
          .setLngLat(firstResult.geometry.coordinates)
          .addTo(map);

        map.setCenter(firstResult.geometry.coordinates);
        map.setZoom(14);
        const [long, latitude] = firstResult.geometry.coordinates;
        lng = long;
        lat = latitude;
        //submit del form complete
        const form: HTMLFormElement = document.querySelector(".form");
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const target = e.target as any;
          const name = target.nombre.value;
          const location = target.buscar.value;
          ///SETEAMOS LOS DATOS DEL REPORT Y LUEGO LO ENVIAMOS
          state.setDatesMeReport(lng, lat, name, location, pictureURL, () => {
            state.createReport();
            if (cs.meReport.pictureURL) {
              const loadingContainer =
                document.querySelector(".container-load");
              const containerPage = document.querySelector(".container-page");
              containerPage.setAttribute("style", "display:none");
              loadingContainer.setAttribute("style", "display:flex");
            }
            setTimeout(() => {
              ///agregar donde crea el reporte  un create: true asi podemos hacer un if con esa info para que luego funcione el router
              Router.go("me-reports");
            }, 5000);
          });
          form.reset();
        });
      });
    })();
  }

  render() {
    const cs = state.getState();

    const style = document.createElement("style");
    style.innerHTML = `
    .profile-picturer-container{
      width:150px;
      height:150px;
    }
    .profile-picture{
      width: 150px;
      height: 150px;
    }
    .text-indication{
      margin: 0;
    }
    .container-page{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 0 auto;
      padding: 29px;
    }
    .container-titles{
      padding: 20px 0 1px 0px;
    }
    .form{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mapa{
      display: flex;
      flex-direction: column;
      padding: 71px 0 41px 0px;
    }
    .container-inputs{
      display:grid;
      gap:2px;
    }
    .mapboxgl-control-container{
      display:none;
    }
    .container-load{
      display:none;
      justify-content:center;
      align-items:center;
      padding: 50%;
    }

    

      `;
    this.innerHTML = `
    <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
    <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>

    <header-comp></header-comp>
    <div class="container-load">
    <load-comp>Creando reporte...</load-comp>
    </div>
    <div class="container-page">
        <div class="container-titles">
           <h1 class="title-page">Reportar
           mascota perdida</h1>
        </div>

        <form class="form">
           <input class="input" name="nombre" type="text" placeholder="Nombre de su mascota"/>
         <div class="profile-picturer-container">
             <img class="profile-picture" src="${insertImg}" alt="" />
             <h3 class="text-indication">Arrastrá tu foto aquí</h3>
         </div>

         <div class="mapa">
            <div id="map" style="width: 250px; height: 200px"></div>
            <div class="container-inputs">
               <input class="input-search" name="buscar" placeholder="example: Ezeiza"/>
               <button class="confirmar-ubicacion">Confirmar ubication</button>
               <button>Reportar como perdido</button>
            </div>   
         </div>
        </form>
    </div>

    
    
    `;

    this.appendChild(style);

    this.addListeners();
  }
}
customElements.define("report-pet", ReportPet);
