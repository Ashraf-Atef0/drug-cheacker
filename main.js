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
let getInteraction = true;
let interactionList = [];
let interactionComments = [];

searchBtn.addEventListener("click", () => {
  if (searchCount > 0) {
    drugsContainer.firstElementChild.remove();
  }
  getDataBase(inputFeld.value.toLowerCase(), 1);
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
  });
  drugsContainer.appendChild(allDrugCards);
}

document.addEventListener("click", (e) => {
  if (e.target.className == "drug-Alt-eg") {
    let drugCode = e.target.parentElement.getAttribute("drug-code");
    drugsContainer.firstElementChild.remove();
    getDataBase(drugCode, 2);
  } else if (e.target.className == "drug-Sim-eg") {
    let drugCode = e.target.parentElement.getAttribute("drug-code");
    drugsContainer.firstElementChild.remove();
    getDataBase(drugCode, 3);
  } else if (e.target.className == "drug-more-eg") {
    let moreRequest = new XMLHttpRequest();
    moreRequest.onreadystatechange = () => {
      if (moreRequest.readyState == 4) {
        console.log(moreRequest.responseText);
        let htmlText = moreRequest.responseText,
          sliceStart = htmlText.lastIndexOf("<td"),
          sliceEnd = htmlText.lastIndexOf("</td>");
        let preTreatedText = htmlText.slice(sliceStart, sliceEnd);
        let treatedText = preTreatedText.slice(preTreatedText.indexOf(">") + 1);
        e.target.classList.add("active-pop");
        let moreInformation = document.createElement("p");
        moreInformation.className = "pop-info";
        moreInformation.innerHTML = treatedText;
        e.target.parentElement.append(moreInformation);
      }
    };
    moreRequest.open(
      "get",
      "http://www.drugeye.pharorg.com/drugeyeapp/android-search/drugeye-android-live-more.aspx?gname=" +
        e.target.parentElement.firstElementChild.innerText,
      true
    );
    moreRequest.send();
  } else if (e.target.classList.contains("drug-card-eg") && getInteraction) {
    console.log("clicked");
    let apiName = e.target.children.item(1).innerText;
    getApiNumber(apiName, 1);
    // if (firstCheck) {
    //   let rxCode = firstCheck[0];
    //   interactionList.push(rxCode);
    //   console.log(rxCode);
    // } else if (apiName.indexOf("+") != -1) {
    //   apiName.split("+").map((eachName) => {
    //     let mulitCheck = getApiNumber(eachName);
    //     if (mulitCheck) {
    //       let rxCode = mulitCheck[0];
    //       interactionList.push(rxCode);
    //       console.log(rxCode);
    //     } else {
    //       console.log("sorry there is no data about" + eachName);
    //     }
    //   });
    // }
    ///////////////////////////////////////////////////////////////////
    // if (e.target.classList.contains("selected")) {
    //   e.target.classList.remove("selected");
    // } else {
    //   let apiName = e.target.children.item(1).innerText;
    //   console.log(apiName);
    //   let codeRequest = new XMLHttpRequest();
    //   codeRequest.onreadystatechange = () => {
    //     if (codeRequest.readyState == 4) {
    //       let responseObject = JSON.parse(codeRequest.response);

    //       if (!responseObject.idGroup.rxnormId) {
    //         let rxCode = responseObject.idGroup.rxnormId[0];
    //       } else {
    //         let rxCode = null;
    //       }
    //       if (interactionList.indexOf(rxCode) == -1 && rxCode) {
    //         interactionList.push(rxCode);
    //         console.log(interactionList);
    //       } else {
    //         if (apiName.indexOf("+") == -1) {
    //           let apiNewName = apiName.split(" ")[0];
    //           let newCodeRequest = new XMLHttpRequest();
    //           newCodeRequest.onreadystatechange = () => {
    //             if (codeRequest.readyState == 4) {
    //               let responseObject = JSON.parse(codeRequest.response);
    //               if (!responseObject.idGroup.rxnormId) {
    //                 let rxCode = responseObject.idGroup.rxnormId[0];
    //               } else {
    //                 let rxCode = null;
    //               }
    //               if (interactionList.indexOf(rxCode) == -1 && rxCode) {
    //                 interactionList.push(rxCode);
    //                 console.log(interactionList);
    //               } else {
    //                 // need to edit it;
    //                 console.log("Sorry there is no data about this drug");
    //               }
    //             }
    //           };
    //           codeRequest.open(
    //             "get",
    //             `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${apiNewName}&search=1`,
    //             true
    //           );
    //           codeRequest.send();
    //         } else {
    //           //
    //           let apiNewNameList = apiName.split("+");
    //           apiNewNameList.map((apiNewName) => {
    //             let newCodeRequest = new XMLHttpRequest();
    //             newCodeRequest.onreadystatechange = () => {
    //               if (codeRequest.readyState == 4) {
    //                 let responseObject = JSON.parse(codeRequest.response);
    //                 if (!responseObject.idGroup.rxnormId) {
    //                   let rxCode = responseObject.idGroup.rxnormId[0];
    //                 } else {
    //                   let rxCode = null;
    //                 }
    //                 if (interactionList.indexOf(rxCode) == -1 && rxCode) {
    //                   interactionList.push(rxCode);
    //                   console.log(interactionList);
    //                 } else {
    //                   // need to edit it;
    //                   console.log("Sorry there is no data about this drug");
    //                 }
    //               }
    //             };
    //             codeRequest.open(
    //               "get",
    //               `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${apiNewName}&search=1`,
    //               true
    //             );
    //             codeRequest.send();
    //           });
    //         }
    //       }
    //       console.log(rxCode);
    //     }
    //   };
    //   codeRequest.open(
    //     "get",
    //     `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${apiName}&search=1`,
    //     true
    //   );
    //   codeRequest.send();
    //   e.target.classList.add("selected");
    // }
  }
});

async function getApiNumber(drugName, state) {
  if (state == 1) {
    console.log("hello1");
    let codeRequest = new XMLHttpRequest();
    codeRequest.onreadystatechange = async () => {
      if (codeRequest.readyState == 4) {
        let responseObject = await JSON.parse(codeRequest.response);
        console.log(responseObject, "from await");
        let rxList = responseObject.idGroup.rxnormId;
        if (rxList) {
          interactionList.push(rxList[0]);
          console.log(rxList);
        } else {
          if (drugName.indexOf("+") == -1) {
            getApiNumber(drugName.split(" ")[0], 2);
          } else {
            getApiNumber(drugName.split("+"), 3);
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
    console.log("hello2");
    let codeRequest = new XMLHttpRequest();
    codeRequest.onreadystatechange = async () => {
      if (codeRequest.readyState == 4) {
        let responseObject = await JSON.parse(codeRequest.response);
        console.log(responseObject, "from await");
        let rxList = responseObject.idGroup.rxnormId;
        if (rxList) {
          interactionList.push(rxList[0]);
          console.log(rxList);
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
    console.log("hello3");
    drugName.map((drugNamePart) => {
      let codeRequest = new XMLHttpRequest();
      codeRequest.onreadystatechange = async () => {
        if (codeRequest.readyState == 4) {
          let responseObject = await JSON.parse(codeRequest.response);
          console.log(responseObject, "from await");
          let rxList = responseObject.idGroup.rxnormId;
          if (rxList) {
            interactionList.push(rxList[0]);
            console.log(rxList);
          } else {
            console.log("sorry no data state 3");
          }
          // return responseObject.idGroup.rxnormId;
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
  console.log(interactionList);
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
                //   console.log(interText.description);
              });
            });
          });
        }
        console.log(interactionComments);
        // console.log(interactionGroups);
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
  }
};
