// fetch("./test.json")
//   .then((response) => response.json())
//   .then((dataBase) => {
//     console.log(JSON.parse(dataBase));
//   });

import myJson from "./dataJSON.json" assert { type: "json" };
// for (let i = 1; i <= 19772; i++) {
//   if (myJson[i][0].toLowerCase().startsWith("augme")) {
//     console.log(myJson[i]);
//   }
// }

let inputFeld = document.getElementById("drug-name-search");
let searchBtn = document.getElementById("search");
let interactionBtn = document.getElementById("interaction-checker");
let drugsContainer = document.querySelector(".drug-list");
let searchCount = 0;
let getInteraction = false;
let interactionList = [];
let interactionComments = [];

searchBtn.addEventListener("click", () => {
  if (searchCount > 0) {
    drugsContainer.firstElementChild.remove();
  }
  getDataBase(inputFeld.value, 1);
  searchCount++;
});

// This function getting HTML file that has all avalible drugs that matching input text
function getDataBase(drugName, reqNum) {
  if (reqNum == 1) {
    let drugLists = [];
    for (let i = 1; i <= 19772; i++) {
      if (myJson[i][0].toLowerCase().startsWith(drugName)) {
        console.log(myJson[i]);
        drugLists.push(myJson[i]);
      }
    }
    generateDrugCards(drugLists);
  }
}

function generateDrugCards(drugLists) {
  let allDrugCards = document.createElement("div");
  allDrugCards.className = "all-drug-cards";
  drugLists.map((drugItems) => {
    let drugCard = document.createElement("div"),
      drugName = document.createElement("h3"),
      drugPrice = document.createElement("span"),
      drugApi = document.createElement("p"),
      drugMoreText = document.createElement("p"),
      drugAction = document.createElement("p"),
      drugCompany = document.createElement("p"),
      drugRoute = document.createElement("p"),
      drugAlt = document.createElement("button"),
      drugSim = document.createElement("button"),
      drugMoreBtn = document.createElement("button");
    drugName.innerText = drugItems[0];
    drugName.className = "drug-name-eg";
    drugApi.innerText = drugItems[1];
    drugApi.className = "drug-api-eg";
    drugPrice.innerText = drugItems[3];
    drugPrice.className = "drug-price-eg";
    drugCompany.innerText = drugItems[6];
    drugCompany.className = "drug-company-eg";
    drugAction.innerText = drugItems[7];
    drugAction.className = "drug-action-eg";
    drugRoute.innerText = drugItems[10];
    drugRoute.className = "drug-route-eg";
    drugMoreText.innerText = drugItems[9];
    drugMoreText.className = "drug-more-text-eg";
    drugAlt.innerText = "See Alterantive Drugs";
    drugAlt.className = "drug-Alt-eg";
    drugSim.innerText = "See Similar Drugs";
    drugSim.className = "drug-Sim-eg";
    drugMoreBtn.innerText = "More Information";
    drugMoreBtn.className = "drug-more-btn-eg";
    drugCard.setAttribute("drug-code", drugItems[5]);
    drugCard.className = "drug-card-eg";
    drugCard.append(
      drugName,
      drugApi,
      drugAction,
      drugCompany,
      drugPrice,
      drugMoreText,
      drugMoreText,
      drugAlt,
      drugSim,
      drugMoreBtn
    );
    allDrugCards.append(drugCard);
    console.log(drugCard);
  });
  drugsContainer.appendChild(allDrugCards);
}
