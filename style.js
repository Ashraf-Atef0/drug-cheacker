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
     document.getElementById("search").click();
  }
};
inputFeld.onblur = ()=>{
  if(inputFeld.value.trim().length > 2) {
    document.getElementById("search").click();
  }
}
interactionCheck.click();

let scrollTopBtn = document.getElementById("scroll-top");
scrollTopBtn.onclick = ()=>{
  window.scrollTo({top:"0",behavior: "smooth"})
}
window.onscroll = ()=>{
  if(window.scrollY > 800){
    scrollTopBtn.classList.add('active')
  }else {
    scrollTopBtn.classList.remove('active')
  }
}
