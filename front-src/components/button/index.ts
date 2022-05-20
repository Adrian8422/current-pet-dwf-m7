class Button extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    const variant = this.getAttribute("variant") || "body";

    const shadow = this.attachShadow({ mode: "open" });
    const button = document.createElement("button");
    const style = document.createElement("style");
    button.className = "root";
    style.innerHTML = `
               .button-blue{
            font-size: 18px;
            border-solid: 2px ;
            border-radius: 4px;
            padding: 17px 13px; 
            background-color:blue;
            width: 100%
  
          }
          .button-red{
  
            font-size: 18px;
            border-solid: 2px ;
            border-radius: 4px;
            padding: 17px 13px; 
            background-color: red;
            width: 100%
  
          }
          .button-green{
            font-size: 18px;
            border-solid: 2px ;
            border-radius: 4px;
            padding: 17px 13px; 
            background-color: green;
            width: 100%
          }
          
          `;

    button.className = variant;
    button.textContent = this.textContent;

    shadow.appendChild(style);

    shadow.appendChild(button);
  }
}
customElements.define("button-comp", Button);
