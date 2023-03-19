let inputFeld = document.getElementById("drug-name");
let searchBtn = document.getElementById("search");
let interactionBtn = document.getElementById("interaction-checker");
let drugsContainer = document.querySelector(".drug-list");
let searchCount = 0;
let getInteraction = false;
let interactionList = [];
let interactionComments = [];

searchBtn.addEventListener("click", (e) => {
  if (searchCount > 0) {
    drugsContainer.firstElementChild.remove();
  }
  getDataBase(inputFeld.value, 1);
  searchCount++;
});

// This function getting HTML file that has all avalible drugs that matching input text
function getDataBase(drugName, reqNum) {
  let request = new XMLHttpRequest();
  request.onreadystatechange = (e) => {
    if (request.readyState == 4) {
      let htmlText = request.responseText;
      let drugList = filterDate(htmlText);
      generateDrugCards(drugList);
    }
  };
  if (reqNum == 1) {
    request.open(
      "get",
      `http://www.drugeye.pharorg.com/drugeyeapp/android-search/drugeye-android-live-go.aspx?__VIEWSTATE=%2FwEPDwULLTE3NjMzNDAyODMPZBYCAgEPZBYYAgEPDxYEHglGb250X1NpemUoKiJTeXN0ZW0uV2ViLlVJLldlYkNvbnRyb2xzLkZvbnRVbml0BDE2cHQeBF8hU0ICgAgWAh4Fc3R5bGUFG3dpZHRoOjk5JTtwYWRkaW5nOjEwcHggMHB4O2QCAw8PFgQfACgrBAQxNnB0HwECgAgWAh8CBSd3aWR0aDoxMDAlO3BhZGRpbmc6MTBweCAxMHB4IDEwcHggMTBweDtkAgUPDxYEHwAoKwQEMTZwdB8BAoAIFgIfAgUccGFkZGluZzoxMHB4IDEwcHggMTBweCAxMHB4O2QCBw8PFgQfACgrBAQxNnB0HwECgAgWAh8CBRxwYWRkaW5nOjEwcHggMTBweCAxMHB4IDEwcHg7ZAIJDw8WBB8AKCsEBDE2cHQfAQKACBYCHwIFHHBhZGRpbmc6MTBweCAxMHB4IDEwcHggMTBweDtkAgsPDxYEHwAoKwQEMTZwdB8BAoAIFgIfAgUccGFkZGluZzoxMHB4IDEwcHggMTBweCAxMHB4O2QCDQ8PFgQfACgrBAQxNnB0HwECgAgWAh8CBRxwYWRkaW5nOjEwcHggMTBweCAxMHB4IDEwcHg7ZAIPDw8WAh4EVGV4dAVW2YbYqtmK2KzYqSDYp9mE2KjYrdirICDYqNin2YTYp9iz2YUg2KfZhNiq2KzYp9ix2Yog2KjYp9mE2LfYsdmK2YLYqSDYp9mE2KrZgtmE2YrYr9mK2KlkZAIRDw8WBB4ISW1hZ2VVcmwFLn4vZHJ1Z2V5ZWltYWdlL2xpdmUtYWRkLmpwZz82MzgxNDY2MjU4MzI5NzI4MTEeB1Zpc2libGVoZGQCEw8WAh8DZWQCFQ8PZBYCHwIFC3dpZHRoOjEwMCU7ZAIZDxYCHwVoZGQJqx0Bqvizr9LHFg468WM6VQXPma3QDNDxWT74PncZMA%3D%3D&__EVENTVALIDATION=%2FwEdAAozcgy%2BW0TBTODaGPmWPbTozS5kBMU1oQXBQwc1g6Fqj%2FXP3t7nFw1%2Fa6i4TwISb2eRlcn6XPhRWycf2h30l%2BqXtiBs%2FkUwG4IYj9qOQatVbcT4DaeqYdVgAIw53S9OL2TN%2BDvxnwFeFeJ9MIBWR693wjyYm5TMNRbJyFjhq3wkGm8C9lxkzlCL7uJpTMNnmASzyOwjZWrM83wn5HJU8rVJcIBbRpp4ZK0TD81vUHME%2B5aZMCxW5c9b6Gus4ccrW%2BE%3D&ttt=${drugName}&b1=wait...`,
      true
    );
  } else if (reqNum == 2) {
    request.open(
      "get",
      `http://www.drugeye.pharorg.com/drugeyeapp/android-search/drugeye-android-live-go.aspx?gname=${drugName}alto`,
      true
    );
  } else if (reqNum == 3) {
    request.open(
      "get",
      `http://www.drugeye.pharorg.com/drugeyeapp/android-search/drugeye-android-live-go.aspx?gname=${drugName}geno`,
      true
    );
  }
  request.send();
}

function filterDate(rawDate) {
  let sliceStart = rawDate.indexOf('id="MyTable" style="width:100%;">');
  let sliceEnd = rawDate.indexOf(
    '<input name="Passgenericname" type="hidden" id="Passgenericname" />'
  );
  let htmlDataTable = rawDate.slice(sliceStart, sliceEnd);
  let drugRegex = />[^<>]+<\/td>/gi;
  let drugListPreTreated = htmlDataTable.match(drugRegex);
  let drugList = drugListPreTreated
    .map((e) => e.slice(1, -5))
    .filter((e) => !["similars", "alternatives", "more", "images"].includes(e));
  let drugNumRegex = /title='\d+'/g;
  let drugNumbersList = htmlDataTable
    .match(drugNumRegex)
    .map((e) => e.slice(7, -1));
  let allDrugs = [];
  for (let i = 0, j = 0; i < drugList.length; i += 5, j += 2) {
    allDrugs.push([
      drugList[i],
      drugList[i + 1],
      drugList[i + 2],
      drugList[i + 3],
      drugList[i + 4],
      drugNumbersList[j],
    ]);
  }
  return allDrugs;
}

function generateDrugCards(drugLists) {
  let allDrugCards = document.createElement("div");
  allDrugCards.className = "all-drug-cards";
  drugLists.map((drugItems) => {
    let drugCard = document.createElement("div"),
      drugName = document.createElement("h3"),
      drugPrice = document.createElement("span");
    (drugApi = document.createElement("p")),
      (drugAction = document.createElement("p")),
      (drugCompany = document.createElement("p")),
      (drugAlt = document.createElement("button")),
      (drugSim = document.createElement("button")),
      (drugMore = document.createElement("button"));
    drugName.innerText = drugItems[0];
    drugName.className = "drug-name-eg";
    drugPrice.innerText = drugItems[1];
    drugPrice.className = "drug-price-eg";
    drugApi.innerText = drugItems[2];
    drugApi.className = "drug-api-eg";
    drugAction.innerText = drugItems[3];
    drugAction.className = "drug-action-eg";
    drugCompany.innerText = drugItems[4];
    drugCompany.className = "drug-company-eg";
    drugAlt.innerText = "See Alterantive Drugs";
    drugAlt.className = "drug-Alt-eg";
    drugSim.innerText = "See Similar Drugs";
    drugSim.className = "drug-Sim-eg";
    drugMore.innerText = "More Information";
    drugMore.className = "drug-more-eg";
    drugCard.setAttribute("drug-code", drugItems[5]);
    drugCard.className = "drug-card-eg";
    drugCard.append(
      drugName,
      drugPrice,
      drugApi,
      drugAction,
      drugCompany,
      drugAlt,
      drugSim,
      drugMore
    );
    allDrugCards.append(drugCard);
    console.log(drugCard);
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
    if (e.target.classList.contains("selected")) {
      e.target.classList.remove("selected");
    } else {
      let apiName = e.target.children.item(2).innerText;
      console.log(apiName);
      let codeRequest = new XMLHttpRequest();
      codeRequest.onreadystatechange = () => {
        if (codeRequest.readyState == 4) {
          let responseObject = JSON.parse(codeRequest.response);
          let rxCode = responseObject.idGroup.rxnormId[0];
          if (interactionList.indexOf(rxCode) == -1) {
            interactionList.push(rxCode);
            console.log(interactionList);
          }
          console.log(rxCode);
        }
      };
      codeRequest.open(
        "get",
        `https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${apiName}&search=1`,
        true
      );
      codeRequest.send();
      e.target.classList.add("selected");
    }
  }
});

interactionBtn.onclick = () => {
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
