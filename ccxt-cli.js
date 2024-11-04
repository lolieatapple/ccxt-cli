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
  .describe("time", "fetch time")
  .describe("trade", "with market symbol WAN/USDT, default use first apikey to trade. must use same time with side, type, amount, price")
  .describe("cancel", "with orderId, default use first apikey to trade. must use same time with id, input order id")
  .describe("cancelAll", "cancel all orders")
  .describe("symbol", "market symbol")
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
          console.log(await queryBalance(argv.e, config[argv.e][i]));
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.o) {
      if (config[argv.e]) {
        for (let i=0; i<config[argv.e].length; i++) {
          await fetchOrders(argv.e, config[argv.e][i], argv.o);
        }
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.cancel) {
      console.log('ready to cancel order id:', argv.id);
      if (config[argv.e][0]) {
        await cancelOrder(argv.e, config[argv.e][0], argv.id);
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.cancelAll) {
      console.log('ready to cancel all orders');
      if (config[argv.e][0]) {
        await cancelAllOrders(argv.e, config[argv.e][0], argv.symbol);
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.trade) {
      if (config[argv.e][0]) {
        await createOrder(argv.e, config[argv.e][0], argv.trade, argv.type, argv.side, argv.amount, argv.price);
      } else {
        throw new Error(`can not found ${argv.e} in config file`);
      }
    }

    if (argv.time) {
      let time = await fetchTime(argv.e, config[argv.e][0]);
      console.log(time);
      // config local system time to server time 
      // Set system time to match server time
      const { execSync } = require('child_process');
      const date = new Date(time);
      
      if (process.platform === 'win32') {
        // Windows
        execSync(`date ${date.toLocaleDateString()}`);
        execSync(`time ${date.toLocaleTimeString()}`);
      } else {
        // Linux/Unix/MacOS
        execSync(`date -s "${date.toISOString()}"`);
      }
      console.log('System time synchronized with server', date.toISOString());
    }
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
  let ret = await exchange.fetchOpenOrders(symbol);
  
  // 定义颜色代码
  const RED = '\x1b[31m';
  const GREEN = '\x1b[32m';
  const RESET = '\x1b[0m';
  
  const formattedOrders = ret.sort((a, b) => b.price - a.price).map((v, i) => {
    const sideWithColor = v.side === 'sell' 
      ? `${RED}${v.side}${RESET}`
      : `${GREEN}${v.side}${RESET}`;
    
    return {
      index: i,
      id: v.id,
      symbol: v.symbol,
      side: sideWithColor,
      price: v.price,
      amount: v.amount,
    }
  });

  console.table(formattedOrders);
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

const cancelAllOrders = async (name, apikey, symbol) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.cancelAllOrders(symbol);
  console.log(ret);
}

const fetchTime = async (name, apikey) => {
  const Exchange = ccxt[name.toLowerCase()];
  const exchange = new Exchange(apikey);
  let ret = await exchange.fetchTime();
  return ret;
}

main();
