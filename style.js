let apiCheckBox = document.getElementById("api-search");
let apiCheckIcon = document.querySelector("#api-search ~ span.check-icon");
apiCheckBox.onchange = () => apiCheckIcon.classList.toggle("active");
let interactionCheck = document.getElementById("want-check-interaction");
let interactionField = document.querySelector(".interaction-fields");
let interactionCheckIcon = document.querySelector(
  "#want-check-interaction ~ span.check-icon"
);

interactionCheck.onchange = () => {
  interactionField.classList.toggle("active");
  interactionCheckIcon.classList.toggle("active");
};

let inputFeld = document.getElementById("drug-name-search");
inputFeld.focus();
inputFeld.onkeyup = (e) => {
  if (e.keyCode == 13) {
    searchBtn = document.getElementById("search").click();
  }
};
