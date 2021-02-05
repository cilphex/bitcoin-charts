import fetch from 'node-fetch'

async function getCurrentData() {

}

async function getExchangeStats() {
  const res = await fetch('https://api.pro.coinbase.com/products/BTC-USD/stats');
  const stats = await res.json();
  return stats;
}

async function updateData() {
  let data;
  let file;

  await getCurrentData();
  const stats = await getExchangeStats();

  console.log('got stats', stats);
}

// export default {
//   updateData,
// };

updateData();