import myJson from "./dataJSON.json" assert { type: "json" };
import priceJson from "./newPrice.json" assert { type: "json" };

let inputFeld = document.getElementById("drug-name-search");
let searchBtn = document.getElementById("search");
let interactionBtn = document.getElementById("interaction-checker");
let drugsContainer = document.getElementById("drug-list");
let dInterCont = document.querySelector(".interaction-list-container");
let interComCont = document.getElementById("interaction-comment-container");
let searchCount = 0;
let searchByApi = false;
let getInteraction = true;
let interactionList = [];
let interactionNamesList = [];
let interactionComments = [];
let currentInteractionCount = 0;

searchBtn.addEventListener("click", () => {
  if (searchByApi && inputFeld.value.length) {
    if (searchCount > 0) {
      drugsContainer.firstElementChild.remove();
    }
    getDataBase(inputFeld.value.toLowerCase(), 1);
    searchCount++;
  } else if (inputFeld.value.length) {
    if (searchCount > 0) {
      drugsContainer.firstElementChild.remove();
    }
    getDataBase(inputFeld.value.toLowerCase(), 0);
    searchCount++;
  } else {
    alert("Please enter name of drug!");
  }
});

// This function getting HTML file that has all avalible drugs that matching input text
function getDataBase(drugName, reqNum) {
  if (reqNum == 0) {
    let drugLists = [];
    for (let i = 1; i <= 19772; i++) {
      if (myJson[i][0].toLowerCase().startsWith(drugName)) {
        drugLists.push(myJson[i]);
      }
    }
    generateDrugCards(drugLists);
  } else if (reqNum == 1) {
    let drugLists = [];
    for (let i = 1; i <= 19772; i++) {
      if (
        myJson[i][0].toLowerCase().startsWith(drugName) ||
        myJson[i][1].toLowerCase().indexOf(drugName) != -1
      ) {
        drugLists.push(myJson[i]);
      }
    }
    generateDrugCards(drugLists);
  } else if (reqNum == 2) {
    let drugLists = [];
    for (let i = 1; i <= 19772; i++) {
      if (myJson[i][1].toLowerCase().indexOf(drugName) != -1) {
        drugLists.push(myJson[i]);
      }
    }
    generateDrugCards(drugLists);
  } else if (reqNum == 3) {
    let drugLists = [];
    for (let i = 1; i <= 19772; i++) {
      if (myJson[i][7].toLowerCase().indexOf(drugName) != -1) {
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
      drugName = document.createElement("h4"),
      drugPrice = document.createElement("span"),
      drugApi = document.createElement("p"),
      drugMoreText = document.createElement("p"),
      drugAction = document.createElement("p"),
      drugCompany = document.createElement("p"),
      drugRoute = document.createElement("p"),
      drugAlt = document.createElement("button"),
      drugSim = document.createElement("button"),
      drugInteractionCircle = document.createElement("button"),
      drugMoreBtn = document.createElement("button");
    drugName.innerText = drugItems[0];
    drugName.className = "drug-name-eg";
    drugApi.innerText = drugItems[1];
    drugApi.className = "drug-api-eg";
    drugPrice.innerText = drugItems[3];
    getDrugPrice(drugItems[0], drugItems[3], drugPrice);
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
    drugInteractionCircle.className = "drug-interaction-circle";
    drugInteractionCircle.setAttribute("drug-name", drugItems[0]);
    drugInteractionCircle.setAttribute("api-name", drugItems[1]);
    drugCard.className = "drug-card-eg";
    drugCard.setAttribute("drug-name", drugItems[0]);
    drugCard.setAttribute("api-name", drugItems[1]);
    drugCard.setAttribute("action-name", drugItems[7]);
    drugCard.append(
      drugName,
      drugApi,
      drugAction,
      drugCompany,
      drugPrice,
      drugAlt,
      drugSim,
      drugMoreText,
      drugMoreBtn,
      drugInteractionCircle
    );
    allDrugCards.append(drugCard);
  });
  drugsContainer.appendChild(allDrugCards);
}
function getDrugPrice(drugName, drugOldPrice, drugPriceHolder) {
  let newPrice = "No Price";
  for (let i = 0; i < priceJson["price"].length; i++) {
    if (priceJson["price"][i][0] == drugName) {
      newPrice = priceJson["price"][i][1];
      drugPriceHolder.innerText = newPrice;
      break;
    }
  }
}
document.addEventListener("click", (e) => {
  if (e.target.className == "drug-Alt-eg") {
    let drugName = e.target.parentElement
      .getAttribute("action-name")
      .toLowerCase();

    drugsContainer.firstElementChild.remove();
    getDataBase(drugName, 3);
  } else if (e.target.className == "drug-Sim-eg") {
    let drugName = e.target.parentElement
      .getAttribute("api-name")
      .toLowerCase();

    drugsContainer.firstElementChild.remove();
    getDataBase(drugName, 2);
  } else if (e.target.classList.contains("drug-more-btn-eg")) {
    e.target.parentElement.classList.toggle("more");
    e.target.innerText = e.target.parentElement.classList.contains("more")
      ? "Show Less"
      : "More Information";
  } else if (
    e.target.classList.contains("drug-interaction-circle") &&
    getInteraction
  ) {
    if (e.target.classList.contains("active")) {
      removeInteraction(e.target.getAttribute("drug-name"));
    } else {
      let apiName = e.target.getAttribute("api-name");
      getApiNumber(apiName, 1, e.target.getAttribute("drug-name"));
    }
    e.target.classList.toggle("active");
  }
});

async function getApiNumber(drugName, state, productName) {
  if (state == 1) {
    let codeRequest = new XMLHttpRequest();
    codeRequest.onreadystatechange = async () => {
      if (codeRequest.readyState == 4) {
        let responseObject = await JSON.parse(codeRequest.response);

        let rxList = responseObject.idGroup.rxnormId;
        if (rxList) {
          // interactionList.push(rxList[0]);
          addDrugToInteractionList(rxList[0], productName, drugName);
        } else {
          if (drugName.indexOf("+") == -1) {
            if (drugName.indexOf("(") == -1) {
              getApiNumber(drugName.split(" ")[0], 2, productName);
            } else {
              getApiNumber(
                drugName.slice(
                  drugName.indexOf("(") + 1,
                  drugName.indexOf(")")
                ),
                2,
                productName
              );
            }
          } else {
            getApiNumber(drugName.split("+"), 3, productName);
          }
        }
        // return responseObject.idGroup.rxnormId;
      }
    };
    codeRequest.open(
      "get",
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}&search=1`,
      true
    );
    codeRequest.send();
  } else if (state == 2) {
    let codeRequest = new XMLHttpRequest();
    codeRequest.onreadystatechange = async () => {
      if (codeRequest.readyState == 4) {
        let responseObject = await JSON.parse(codeRequest.response);

        let rxList = responseObject.idGroup.rxnormId;
        if (rxList) {
          // interactionList.push(rxList[0]);
          addDrugToInteractionList(rxList[0], productName, drugName);
        } else {
          console.log("sorry no data state 2");
        }
        // return responseObject.idGroup.rxnormId;
      }
    };
    codeRequest.open(
      "get",
      `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugName}&search=1`,
      true
    );
    codeRequest.send();
  } else if (state == 3) {
    drugName.map((drugNamePart) => {
      let codeRequest = new XMLHttpRequest();
      codeRequest.onreadystatechange = async () => {
        if (codeRequest.readyState == 4) {
          let responseObject = await JSON.parse(codeRequest.response);

          let rxList = responseObject.idGroup.rxnormId;
          if (rxList) {
            // interactionList.push(rxList[0]);
            addDrugToInteractionList(rxList[0], productName, drugNamePart);
          } else {
            if (
              drugNamePart.indexOf("(") != -1 ||
              drugNamePart.indexOf(" ") != -1
            ) {
              if (drugNamePart.indexOf("(") == -1) {
                getApiNumber(drugNamePart.split(" ")[0], 2, productName);
              } else {
                getApiNumber(
                  drugNamePart.slice(
                    drugNamePart.indexOf("(") + 1,
                    drugNamePart.indexOf(")")
                  ),
                  2,
                  productName
                );
              }
            } else {
              console.log("sorry no data state 3");
            }
          }
        }
      };
      codeRequest.open(
        "get",
        `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${drugNamePart}&search=1`,
        true
      );
      codeRequest.send();
    });
  }
}

interactionBtn.onclick = () => {
  interactionNamesList.map((e) => {
    if (interactionList.indexOf(e[0]) == -1) {
      interactionList.push(e[0]);
    }
  });
  if (interactionList.length > 1) {
    let interactionRequest = new XMLHttpRequest();
    interactionRequest.onreadystatechange = () => {
      if (interactionRequest.readyState == 4) {
        let interactionObject = JSON.parse(interactionRequest.response);
        let interactionGroups = interactionObject.fullInteractionTypeGroup;
        if (interactionGroups) {
          interactionGroups.map((gruop) => {
            gruop.fullInteractionType.map((inters) => {
              inters.interactionPair.map((interText) => {
                if (interactionComments.indexOf(interText.description) == -1) {
                  interactionComments.push(interText.description);
                }
              });
            });
          });
        }
        interComCont.firstElementChild.remove();
        let intComt = document.createElement("p");
        intComt.className = "interaction-comment";
        interComCont.append(intComt);
        if (interactionComments.length) {
          intComt.innerText = interactionComments.join("\n");
          interactionComments = [];
          interactionList = [];
        } else {
          intComt.innerText = "There Is No Known Interactions";
        }
      }
    };
    interactionRequest.open(
      "get",
      `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${interactionList.join(
        "+"
      )}`,
      true
    );
    interactionRequest.send();
  } else {
    interComCont.firstElementChild.remove();
    let intComt = document.createElement("p");
    intComt.className = "interaction-comment";
    intComt.innerText =
      "Please choose at least 2 drug or more to check interaction";
    interComCont.append(intComt);
    //////////////////////////////////
  }
};
function addDrugToInteractionList(rxNumber, drugName, apiName) {
  interactionNamesList.push([rxNumber, drugName, apiName]);
  olRefresh(interactionNamesList);
}
function removeInteraction(drugName) {
  interactionNamesList = interactionNamesList.filter((e) => e[1] != drugName);
  olRefresh(interactionNamesList);
}
function olRefresh(list) {
  dInterCont.children.item(0).remove();
  let newOl = document.createElement("ol");
  newOl.className = "interaction-list";
  list.map((e) => {
    let li = document.createElement("li");
    li.innerHTML = `<span>${e[2]}</span> From <span>${e[1]}</span>`;
    newOl.append(li);
  });
  dInterCont.append(newOl);
}
