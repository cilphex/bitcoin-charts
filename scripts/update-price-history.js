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

async function getNewPriceData(sinceTimestamp) {
  const queryUrl = "https://api.kraken.com/0/public/OHLC?";
  const queryParams = {
    pair: "BTCUSD",
    interval: 1440, // Interval in minutes; 1440 per day
    since: sinceTimestamp,
  };
  const res = await fetch(queryUrl + new URLSearchParams(queryParams));
  const data = await res.json();
  return data.result && data.result["XXBTZUSD"];
}

async function getNewCandles() {
  const candleData = getCandleData();
  let candleEntries = candleData.candles;
  const lastCandle = candleEntries[candleEntries.length-2]; // minus two to overwrite the last value, which is never set in stone
  const lastCandleTimestamp = lastCandle[0];
  let newEntries = await getNewPriceData(lastCandleTimestamp);

  if (!newEntries) {
    throw "Price data not retrieved";
  }

  // Convert string values to numbers.
  newEntries = newEntries.map(entry => entry.map(val => Number(val)));

  // First ensure the timestamps are lined up properly.
  // The first timestamp from the new set should match the last one from the existing set.
  if (newEntries[0][0] != candleEntries[candleEntries.length-1][0]) {
    throw "Timestamps do not match up.";
  }

  // Remove most recent, outdated value.
  candleEntries.pop();
  candleEntries = candleEntries.concat(newEntries);
  candleData.candles = candleEntries;

  // Write the new data.
  writeCandleData(candleData);

  console.log('Added new entries', newEntries)
}

getNewCandles();
