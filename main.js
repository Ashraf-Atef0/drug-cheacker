// fetch("./test.json")
//   .then((response) => response.json())
//   .then((dataBase) => {
//     console.log(JSON.parse(dataBase));
//   });
import myJson from "./dataJSON.json" assert { type: "json" };
for (let i = 1; i <= 19772; i++) {
  if (myJson[i][0].toLowerCase().startsWith("augme")) {
    console.log(myJson[i]);
  }
}
console.log(myJson["1"]);
