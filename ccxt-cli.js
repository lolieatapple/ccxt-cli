const fs = require("fs");
const ccxt = require('ccxt');


const optimist = require("optimist");
let argv = optimist
  .usage(
    "A JavaScript cryptocurrency trading command line script with support for 130+ exchanges based on ccxt library. @wandevs \nUsage: $0 -c ./config.json -e huobi -b"
  )
  .alias("c", "config")
  .alias("e", "exchange")
  .alias("b", "balance")
  .alias("o", "order")
  .demand(["e"])
  .default('c', './config.json')

  .describe("c", "select config.json file")
  .describe("e", "select exchange")
  .describe("b", "check balance")
  .describe("o", "display order")
  .describe("create", "create trade order").argv;

async function main() {
  try {
    if (!fs.existsSync(argv.c)) {
      throw new Error(argv.c + ' not exist');
    }


    const config = JSON.parse(fs.readFileSync(argv.c, 'utf-8'));

    // console.log(argv, config);

    if (argv.b) {
      if (config[argv.e]) {
        for (let i=0; i<config[argv.e].length; i++) {
          console.log(argv.e, i, ':')
          console.log(await queryBalance(argv.e, config[argv.e][i]));
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.o) {
      if (config[argv.e]) {
        for (let i=0; i<config[argv.e].length; i++) {
          console.log(argv.e, i, ':')
          await fetchOrders(argv.e, config[argv.e][i]);
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    console.log();
    console.log('Done!');
  } catch (error) {
    console.log(error);
  }
}

const queryBalance = async (name, apikey) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.fetchBalance();
  const free = ret.free;
  const used = ret.used;
  const total = ret.total;

  Object.keys(free).map(v=>{
    if (free[v] === 0) {
      delete free[v];
    }
  });

  Object.keys(used).map(v=>{
    if (used[v] === 0) {
      delete used[v];
    }
  });

  Object.keys(total).map(v=>{
    if (total[v] === 0) {
      delete total[v];
    }
  });

  return { free, used, total }
}

const fetchOrders = async (name, apikey) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.fetchOrders();
  console.log(ret);
}

main();