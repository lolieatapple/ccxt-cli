const fs = require("fs");
const ccxt = require('ccxt');


const optimist = require("optimist");
let argv = optimist
  .usage(
    "A JavaScript cryptocurrency trading command line script with support for 130+ exchanges based on ccxt library. \nUsage: $0 -c ./config.json -e huobi -b"
  )
  .alias("c", "config")
  .alias("e", "exchange")
  .alias("b", "balance")
  .alias("o", "order")
  .demand(["e"])
  .default('c', './config.json')

  .describe("c", "select config.json file")
  .describe("e", "-e huobi Select exchange")
  .describe("b", "check balance")
  .describe("o", "-o WAN/BTC Fetch orders of market")
  .describe("trade", "with market symbol WAN/USDT, default use first apikey to trade. must use same time with side, type, amount, price")
  .describe("cancel", "with orderId, default use first apikey to trade. must use same time with id, input order id")
  .describe("cancelAll", "cancel all orders")
  .describe("id", "order id")
  .describe("side", "the direction of your order, buy or sell")
  .describe("type", "market or limit")
  .describe("amount", "how much of currency you want to trade")
  .describe("price", "how much quote currency you are willing to pay for a trade lot of base currency (for limit orders only)")
  .argv;

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
          console.log(argv.e, 'apikey', i, ':')
          console.log(await queryBalance(argv.e, config[argv.e][i]));
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.o) {
      if (config[argv.e]) {
        for (let i=0; i<config[argv.e].length; i++) {
          console.log(argv.e, 'apikey', i, ':')
          await fetchOrders(argv.e, config[argv.e][i], argv.o);
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.cancel) {
      console.log('ready to cancel order id:', argv.id);
      if (config[argv.e][0]) {
        console.log(argv.e, 'apikey', 0, ':')
        await cancelOrder(argv.e, config[argv.e][0], argv.id);
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.cancelAll) {
      console.log('ready to cancel all orders');
      if (config[argv.e][0]) {
        console.log(argv.e, 'apikey', 0, ':')
        await cancelAllOrders(argv.e, config[argv.e][0]);
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.trade) {
      if (config[argv.e][0]) {
        console.log(argv.e, 'apikey', 0, ':')
        await createOrder(argv.e, config[argv.e][0], argv.trade, argv.type, argv.side, argv.amount, argv.price);
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

const fetchOrders = async (name, apikey, symbol) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.fetchOrders(symbol);
  console.log(ret);
}

const createOrder = async (name, apikey, symbol, type, side, amount, price) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.createOrder(symbol, type, side, amount, price);
  console.log(ret);
}

const cancelOrder = async (name, apikey, id) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.cancelOrder(id);
  console.log(ret);
}

const cancelAllOrders = async (name, apikey) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.cancelAllOrders();
  console.log(ret);
}

main();
