// import moment from "moment";
//
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

import { Storage } from "@google-cloud/storage";

async function getCandlesFile() {
  const bucketName = "bitcoin.craighammell.com";
  const filePath = "data/price-candles.json";
  let file;

  try {
    file = await new Storage()
      .bucket(bucketName)
      .file(filePath)
      .download();
  }
  catch(e) {
    console.log('Got error', e);
  }

  console.log('got file', file[0].toString("utf8").length);

  // const json = JSON.parse(file.toString("utf8"));

  // console.log('got json', json);
}

getCandlesFile();
