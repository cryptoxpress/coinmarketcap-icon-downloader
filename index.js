"use strict";

const fs = require("fs");
const https = require("https");

const iconDestination = `${__dirname}/icons/`;
const availableFormats = ["128x128", "64x64", "32x32", "16x16"];
const availableNames = ["rank", "slug", "symbol"];

let chosenFormat = availableFormats[1];
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
    await new Promise((resolve, reject) => {
      // console.log(cryptocurrencyDownloadUrls[i]);
      https
        .get(cryptocurrencyDownloadUrls[i], (response) => {
          if (response.statusCode !== 200) {
            let err = new Error(
              `The file ${CMCresult[i].slug}.png couldn\'t be retrieved :(`
            );
            err.status = response.statusCode;
            return reject(err);
          }
          let chunks = [];
          response.setEncoding("binary");
          response
            .on("data", (chunk) => {
              chunks += chunk;
            })
            .on("end", () => {
              let stream;
              if (chosenName === availableNames[0]) {
                stream = fs.createWriteStream(`${iconDestination}${i + 1}.png`);
              } else {
                stream = fs.createWriteStream(
                  `${iconDestination}${CMCresult[i][chosenName]}.png`
                );
              }
              stream.write(chunks, "binary");
              stream.on("finish", () => {
                resolve(
                  `${iconDestination}${CMCresult[i].slug}.png saved succesfully :)`
                );
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(
                  `Saved ${CMCresult[i][chosenName]}.png, url: ${
                    cryptocurrencyDownloadUrls[i]
                  }, pending: ${cryptocurrencyDownloadUrls.length - i} \r`
                );
              });
              response.pipe(stream);
            });
        })
        .on("error", (err) => {
          console.log(`Oops, an error occurred: ${err.message}`);
          reject(err.message);
        });
    });
    if (i === cryptocurrencyDownloadUrls.length - 1) {
      console.log(
        "Done! If this tool was helpfull to you please consider a donation:"
      );
      console.log("ETH: 0xb041a5b81981555656CaEecC959b42AFA0d0c0de");
      console.log("BSC: 0xb041a5b81981555656CaEecC959b42AFA0d0c0de");
    }
  }
})();
