// In the react app, we do not need to use node-fetch because 'fetch' runs in
// the browser. But it is not implemented in node, and this file runs in node,
// not the browser, so we need a fetch alternative.
import fetch from 'node-fetch'
import moment from 'moment'
import { Storage } from '@google-cloud/storage'

const storage = new Storage();
let data = "";
let stats;

function getCurrentData() {
  const srcBucket = 'test.bitcoin.craighammell.com';
  const srcFilename = 'data/price-data.json';
  const file = storage.bucket(srcBucket).file(srcFilename);

  // Streams do not support async/await, so return a promise
  return new Promise(function(resolve, reject) {
    file.createReadStream()
      .on('error', reject)
      .on('data', (data_) => {
        data += data_.toString();
      })
      .on('end', () => {
        data = JSON.parse(data);
        resolve();
      });
  })
}

// Return true if the most recent date that we have price data for is yesterday.
function canUpdate() {
  const latestData = data[0];
  const latestDate = moment(Date.parse(latestData.date));
  const yesterday = moment().subtract(1, 'day');
  // According to moment docs, "Passing in day will check day, month, and year"
  // return latestDate.isSame(yesterday, 'day');
  return true;
}

async function getExchangeStats() {
  const res = await fetch('https://api.pro.coinbase.com/products/BTC-USD/stats');
  stats = await res.json();
}

function insertNewData() {
  const todayData = {
    date: moment().format('MMM DD, YYYY'),
    price: stats.open,
  };
  stats.unshift(todayData);
}

async function updateData() {
  await getCurrentData();

  if (!canUpdate()) {
    console.log("can't update");
    return;
  }

  await getExchangeStats();
  insertNewData();

  // TODO: upload new file
  // https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876
}

// export default {
//   updateData,
// };

updateData();


2Y6M-WN9Z-K343-HN2A