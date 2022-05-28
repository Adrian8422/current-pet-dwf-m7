import { Router } from "@vaadin/router";
import { state } from "../state";
import { Dropzone } from "dropzone";
import * as mapboxgl from "mapbox-gl";
import MapboxClient from "mapbox";
const mapboxClient = new MapboxClient(process.env.MAPBOX_TOKEN);

const imgPencil = require("../assets/pencil.png");
class UpdateReport extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  addListeners() {
    const cs = state.getState();
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
        console.log("el formulario", form);
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const target = e.target as any;
          const name = target.nombre.value;
          const location = target.buscar.value;
          ///SETEAMOS LOS DATOS DEL REPORT Y LUEGO LO ENVIAMOS
          state.setDatesMeReport(lng, lat, name, location, pictureURL, () => {
            state.updateReport(window.localStorage.getItem("idReport"));
            window.localStorage.removeItem("idReport");

            setTimeout(() => {
              Router.go("me-reports");
            }, 5000);
          });
        });
      });
    })();
  }
  card: [];

  render() {
    const cs = state.getState();
    console.log("data del state en render", cs.meReport);
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


      `;
    this.innerHTML = `
    <script src="//api.mapbox.com/mapbox-gl-js/v2.3.1/mapbox-gl.js"></script>
    <script src="//unpkg.com/mapbox@1.0.0-beta9/dist/mapbox-sdk.min.js"></script>
   

    <header-comp></header-comp>
    
    <div class="container-page">
        <div class="container-titles">
           <h1 class="title-page">Modificar reporte</h1>
        </div>

        <form class="form">
           <input class="input" name="nombre" type="text" placeholder="${cs.meReport.namePet}"/>
         <div class="profile-picturer-container">
             <img class="profile-picture" src="${cs.meReport.pictureURL}" alt="" />
             <h3 class="text-indication">Arrastrá tu foto aquí</h3>
         </div>

         <div class="mapa">
            <div id="map" style="width: 250px; height: 200px"></div>
            <div class="container-inputs">
               <input class="input-search" name="buscar" placeholder="example: Ezeiza"/>
               <button class="confirmar-ubicacion">Confirmar ubication</button>
               <button>Modificar</button>              
            </div>   
         </div>
        </form>
   </div>
        
  
        
        `;

    this.appendChild(style);

    this.addListeners();
  }
}
customElements.define("update-report", UpdateReport);
