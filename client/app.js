import {
  addBases,
  addARNg,
  pamsFounds,
  selectPam,
  getPams,
  getComp,
  resetStrands,
  setSeq,
  chargeStrands,
  cutStrands,
  getPamPos,
  deleteARNg,
} from "./d3-src/svg.js";

import { alertBoxShow } from "./animation.js";

const addBtn = document.querySelector(".add-btn");
const cutBtn = document.querySelector(".cut-btn");

const descContainer = document.querySelector(".desc-container");
const searchPamsContainer = document.querySelector(".search-pam-container");
const pamsContainer = document.querySelector(".pams-container");
const selectionADNBg = document.querySelector(".selectionAdnBackground");
const menuAdnSelection = document.querySelector(".selectionContainer");
const closeSelectionAdnBtn = document.querySelector(".close-selection-adn-btn");
const svgContainer = document.querySelector(".svg-container");
const menuAddSeqContainer = document.querySelector(".addSeqContainer");

const showPamsBtn = document.querySelector(".show-pams-btn");
const insertARNgBtn = document.querySelector(".insert-arn-btn");
const addADNBtn = document.querySelector(".add-adn-btn");

let posPamIndex;
let ADNPresent = false;
let ARNgPresent = false;
let cutBool = false;
let pamPresent = false;
let dataJson;

closeSelectionAdnBtn.addEventListener("click", () => {
  selectionADNBg.classList.remove("active");
});

// Menú de selección de ADN

fetch("./ADNs.json")
  .then((response) => response.json())
  .then((data) => {
    Object.values(data).forEach((e) => {
      menuAdnSelection.innerHTML += `<div class="rectAdn">
      <h2>Gen <span>${e.gen}</span></h2> 
      <h5 style="font-size: 13px;"> ${e.aplicacion}<h5> 
      <h4><span>Organismo:</span> ${e.organismo}</h4>
      <h4><span>Secuencia:</span> ${e.secuencia_5to3}</h4>
      </div>`;
    });

    menuAdnSelection.querySelectorAll("div").forEach((e, i) => {
      e.addEventListener("click", (e) => {
        selectionADNBg.classList.remove("active");
        dataJson = data[i];
        chargeSeqSelection(dataJson);
        resetStrands();
        setSeq(e.currentTarget.children[4].innerText.split(" ")[1]);
        chargeStrands();
        chargePamSelection();
        deleteARNg();
        descContainer.innerHTML = ``;
        descContainer.innerHTML += `<p style="word-break:break-all"><span>[!] GEN CARGADO:</span> ${dataJson.gen}</p>`;
        descContainer.innerHTML += `<p style="word-break:break-all"><span style="color: #349371"> [!] ORGANISMO:</span> ${dataJson.organismo}</p>`
        descContainer.innerHTML += `<p style="word-break:break-all"><span style="color: rgb(99 167 179)"> > HEBRA NO OBJETIVO:</span> ${getComp()}</p>`;
        descContainer.innerHTML += `<p style="word-break:break-all"><span style="color: rgb(99 167 179)"> > HEBRA OBJETIVO:</span> ${
          e.currentTarget.children[4].innerText.split(" ")[1]
        }</p>`;
        svgContainer.querySelectorAll(".textGraph").forEach((e) => {
          e.style.display = "block";
        });
        svgContainer.querySelector(".wall").style.display = "none";
      });
    });
  });

// -----------------------------------------

addADNBtn.addEventListener("click", () => {
  selectionADNBg.classList.add("active");
});

insertARNgBtn.addEventListener("click", () => {

  if (searchPamsContainer.classList.contains("active")) {
    searchPamsContainer.classList.toggle("active");
  }

  if (pamPresent && !ARNgPresent) {
    addARNg(posPamIndex);
    ARNgPresent = true;
  } else if (!pamPresent) {
    alertBoxShow("No se encontro un pam seleccionado");
  } else if (ARNgPresent) {
    alertBoxShow("Ya ha introducido un ARNg");
  } 
});

showPamsBtn.addEventListener("click", () => {
  if (!ARNgPresent) {
    searchPamsContainer.classList.toggle("active");
  } else if (ARNgPresent || cutBool) {
    alertBoxShow("Termina el proceso de CRIPSR antes.");
  }
});

function escribir(text) {
  let i = 0;
  if (i < text.length) {
    el.textContent += text.charAt(i);
    i++;
    setTimeout(escribir, 80);
  }
}

cutBtn.addEventListener("click", () => {
  if (cutBool) {
    alertBoxShow("El ADN ya ha sido cortado");
  }
  else if (ARNgPresent) {
    cutStrands(getPamPos(posPamIndex));
    cutBool = true;
  } else if (!ARNgPresent) {
    alertBoxShow("No se introdujo un ARNg");
  } 
});

addBtn.addEventListener("click", () => {
  if (cutBool) {
    document.querySelector(".selectAddSeqContainer").classList.toggle("active");
    chargePamSelection();
    chargeSeqSelection(dataJson);
  } else if (!cutBool) {
    alertBoxShow("El ADN no ha sido cortado");
  }
});

function chargeSeqSelection(data) {
  menuAddSeqContainer.innerHTML = "";
  data.edits.add.forEach((e) => {
    menuAddSeqContainer.innerHTML += `<h4
                      class="optAddSeq"
                      style="
                        padding: 4px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-bottom: 4px;
                        border-radius: 4px;
                        box-sizing: border-box;
                        height: auto;
                        display: flex;
                        align-items: stretch;
                        align-content:center;
                        gap: 6px;
                      "
                    >
                    <img src="../assets/dna.png" style="pointer-events: none; height: 20px;"></img> • Nombre: ${e.nombre}
                    </h4>`;
  });

  menuAddSeqContainer.querySelectorAll("h4").forEach((e, i) => {
    e.addEventListener("click", () => {
      document.querySelector(".selectAddSeqContainer").classList.toggle("active");
      addBases(getPamPos(posPamIndex) - 3, data.edits.add[i].secuencia);
      descContainer.innerHTML += `<p> <span style="color:rgba(255, 44, 88, 1)">> Introducción de:</span> ${data.edits.add[i].nombre} </p>`;
      descContainer.innerHTML += `<p> <span style="color:#334a63">> Efecto:</span> ${data.edits.add[i].efecto} </p>`;
      pamPresent = false;
      cutBool = false;
      ARNgPresent = false;
      chargePamSelection();
    });
  });
}

function chargePamSelection() {
  getPams();
  if (pamsFounds.length > 0) {
    pamsContainer.innerHTML = "";
    pamsContainer.parentNode.querySelector(
      "h4"
    ).innerHTML = `Se encontró ${pamsFounds.length} PAM(s)`;
    pamsFounds.forEach((e, i) => {
      pamsContainer.innerHTML += `<h4
                      style="
                        padding: 4px;
                        font-size: 15px;
                        font-weight: 600;
                        cursor: pointer;
                        margin-bottom: 4px;
                        border-radius: 4px;
                        box-sizing: border-box;
                        height: auto;
                        display: flex;
                        align-items: center;
                        margin-right: 4px;
                      "
                    >
                      ${i + 1}. Pam: ${e.pam}, posición: ${e.pos + 1}
                    </h4>`;
    });
    pamsContainer.querySelectorAll("h4").forEach((e) => {
      e.addEventListener("click", (d) => {
        pamPresent = true;
        descContainer.innerHTML += `<p> <span style="color:rgba(255, 44, 88, 1)">> Pam seleccionado:</span> ${d.currentTarget.innerText.split("Pam: ")[1]} </p>`;
        pamsContainer.querySelectorAll("h4").forEach((e) => {
          e.classList.remove("select");
        });
        d.currentTarget.classList.add("select");
        selectPam(Array.from(pamsContainer.children).indexOf(d.currentTarget));
        posPamIndex = Array.from(pamsContainer.children).indexOf(
          d.currentTarget
        );
      });
    });
  } else {
    pamsContainer.parentNode.querySelector(
      "h4"
    ).innerHTML = `💔 No se encontró PAM(s)`;
  }
}

//Cachimbo no te rindas aqui tambien se usa for 🗣🗣
for (let i = 0; i <= 10; i++) {
  console.log(i);
}
