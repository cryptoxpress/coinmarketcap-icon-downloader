"use strict";

const fs = require("fs");
const Path = require("path");
const Axios = require("axios");

async function downloadImage(url) {
  try {
    const response = await Axios({
      url,
      method: "GET",
      responseType: "stream",
    });
    if (response.status !== 200) {
      return 0;
    } else {
      return response.data;
    }
  } catch (e) {
    // console.log(e);
    return 0;
  }
}
async function saveImage(data, fileName) {
  const path = Path.resolve(__dirname, "icons", fileName);
  const writer = fs.createWriteStream(path);
  data.pipe(writer);
}

function printDetails(details) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${details} \r`);
}

const iconDestination = `${__dirname}/icons/`;
const availableFormats = ["128x128", "64x64", "32x32", "16x16"];
const availableNames = ["rank", "slug", "symbol"];

let chosenFormat = availableFormats[0];
let chosenName = availableNames[2];

let cryptocurrencyDownloadUrls = [];
let CMCresult = "";

if (process.argv.includes(availableFormats[0])) {
  chosenFormat = availableFormats[0];
}
if (process.argv.includes(availableFormats[1])) {
  chosenFormat = availableFormats[1];
}
if (process.argv.includes(availableFormats[2])) {
  chosenFormat = availableFormats[2];
}
if (process.argv.includes(availableFormats[3])) {
  chosenFormat = availableFormats[3];
}
if (process.argv.includes(availableNames[0])) {
  chosenName = availableNames[0];
}
if (process.argv.includes(availableNames[1])) {
  chosenName = availableNames[1];
}
if (process.argv.includes(availableNames[2])) {
  chosenName = availableNames[2];
}
if (process.argv.includes(availableNames[3])) {
  chosenName = availableNames[3];
}

!fs.existsSync(iconDestination) && fs.mkdirSync(iconDestination);

CMCresult = JSON.parse(fs.readFileSync("cmc.json", "utf8")).data;

for (let i = 0; i < CMCresult.length; i++) {
  cryptocurrencyDownloadUrls.push(
    `https://s2.coinmarketcap.com/static/img/coins/${chosenFormat}/${CMCresult[i].id}.png`
  );
}
(async function loop() {
  console.log("Started saving icons...");
  for (let i = 0; i < cryptocurrencyDownloadUrls.length; i++) {
    let newFileName = `${i + 1}.png`;
    if (chosenName === availableNames[0]) {
      newFileName = `${i + 1}.png`;
    } else {
      newFileName = `${CMCresult[i][chosenName]}.png`;
    }
    printDetails(
      `Downloading ${newFileName}, pending: ${
        cryptocurrencyDownloadUrls.length - i
      }`
    );
    let downloadedImage = await downloadImage(cryptocurrencyDownloadUrls[i]);
    if (!downloadedImage) {
      console.log(
        `The file ${CMCresult[i][chosenName]}.png couldn\'t be retrieved`
      );
      fs.copyFileSync("./CX-Logo.png", `./icons/${newFileName}`);
      console.log(`${newFileName} defaulted to cx logo`);
    } else {
      await saveImage(downloadedImage, newFileName);
      // console.log( `${newFileName} saved succesfully`)
      printDetails(
        `Saved ${newFileName}, pending: ${
          cryptocurrencyDownloadUrls.length - i
        }`
      );
    }
    if (i === cryptocurrencyDownloadUrls.length - 1) {
      console.log(
        "Done! If this tool was helpfull to you please consider a donation:"
      );
      console.log("ETH: 0xb041a5b81981555656CaEecC959b42AFA0d0c0de");
      console.log("BSC: 0xb041a5b81981555656CaEecC959b42AFA0d0c0de");
    }
  }
})();
