import * as fs from "fs";
import fetch from "node-fetch";

const dataPath = "./public/data/price-candles.json";
const newDataPath = "./public/data/price-candles.json";

function getCandleData() {
  const priceCandlesFileBuffer = fs.readFileSync(dataPath);
  return JSON.parse(priceCandlesFileBuffer);
}

function writeCandleData(candleData) {
  const stringCandleData = JSON.stringify(candleData, null, 2);
  fs.writeFileSync(newDataPath, stringCandleData);
}

async function getNewPriceData(afterTimestamp) {
  const queryUrl = "https://api.cryptowat.ch/markets/coinbase/btcusd/ohlc?";
  const queryParams = {
    periods: 86400,
    after: afterTimestamp,
    // Use before because we don't want the most recent day
    // as it is not yet final
    before: Math.floor(new Date().getTime()/1000),
  };
  const res = await fetch(queryUrl + new URLSearchParams(queryParams));
  const data = await res.json();
  return data.result && data.result["86400"];
}

async function getNewCandles() {
  const candleData = getCandleData();
  let candleEntries = candleData.candles;
  const lastCandle = candleEntries[candleEntries.length-1];
  const lastCandleTimestamp = lastCandle[0];
  let newEntries = await getNewPriceData(lastCandleTimestamp);

  if (!newEntries) {
    throw "Price data not retrieved";
  }

  // Remove existing date from new entries
  newEntries = newEntries.filter(i => i[0] != lastCandleTimestamp);

  if (!newEntries.length) {
    console.log('No new entries');
    return;
  }

  candleEntries = candleEntries.concat(newEntries);
  candleData.candles = candleEntries;
  writeCandleData(candleData);

  console.log('Added new entries', newEntries)
}

getNewCandles();




// import { Storage } from "@google-cloud/storage";
// async function getCandlesFile() {
//   const bucketName = "bitcoin.craighammell.com";
//   const filePath = "data/price-candles.json";
//   let file;
//   try {
//     file = await new Storage()
//       .bucket(bucketName)
//       .file(filePath)
//       .download();
//   }
//   catch(e) {
//     console.log('Got error', e);
//   }
//   console.log('got file', file[0].toString("utf8").length);
//   // const json = JSON.parse(file.toString("utf8"));
//   // console.log('got json', json);
// }
// getCandlesFile();
