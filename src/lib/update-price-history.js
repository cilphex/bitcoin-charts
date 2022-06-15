import * as fs from "fs";
import fetch from "node-fetch";

const dataPath = "./tmp/price-candles.json";
const newDataPath = "./tmp/price-candles-tmp.json";

async function getNewPriceData(afterTimestamp) {
  const queryUrl = "https://api.cryptowat.ch/markets/coinbase/btcusd/ohlc?";
  const queryParams = {
    after: afterTimestamp,
    periods: 86400,
  };
  const res = await fetch(queryUrl + new URLSearchParams(queryParams));
  const data = await res.json();
  return data.result && data.result["86400"];
}

async function getNewCandles() {
  const priceCandlesFileBuffer = fs.readFileSync(dataPath);
  const candleData = JSON.parse(priceCandlesFileBuffer);
  const candleEntries = candleData.candles;
  const lastCandle = candleEntries[candleEntries.length-1];
  const lastCandleTimestamp = lastCandle[0];
  const newEntries = await getNewPriceData(lastCandleTimestamp);

  if (!newEntries) {
    throw "Price data not retrieved";
  }

  candleEntries.concat(newEntries);

  console.log('candleData', candleData);
}

getNewCandles();

// (async () => {
//   let today = moment();
//   console.log('Today is', today.format());
//
//   const queryUrl = "https://api.cryptowat.ch/markets/coinbase/btcusd/ohlc?";
//   const queryParams = {
//     after: 1652072331,
//     periods: 86400,
//   };
//
//   const res = await fetch(queryUrl + new URLSearchParams(queryParams));
//   const data = await res.json();
//
//   console.log('data', data.toString());
// })()

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
