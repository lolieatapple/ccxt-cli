# CCTX-CLI

A JavaScript cryptocurrency trading command line script with support for 130+ exchanges based on ccxt library. 

# Prepare

```
$ git clone https://github.com/lolieatapple/ccxt-cli.git
$ cd ccxt-cli
$ npm i
$ node ./ccxt-cli.js

A JavaScript cryptocurrency trading command line script with support for 130+ exchanges based on ccxt library. @wandevs
Usage: node ./ccxt-cli.js -c ./config.json -e huobi -b

Options:
  -c, --config    select config.json file               [default: "./config.json"]
  -e, --exchange  select exchange                       [required]
  -b, --balance   check balance
  -o, --order     -o [symbol] fetch orders of [symbol]
  --create        create trade order

Missing required arguments: e

```

# CONFIG

Place a config.json file with format:
```
{
  "huobi": [
    {
      "apiKey": "f309*********24",
      "secret": "920*********bf9e"
    },
    {
      "apiKey": "f309*********a24",
      "secret": "920f*********bf9e"
    },
    {
      "apiKey": "f309*********a24",
      "secret": "920f*********bf9e"
    }
  ],
  "binance": [
    {
      "apiKey": "uAqr*********O6hgF",
      "secret": "0wJB1hC*********9Ji4a"
    },
    {
      "apiKey": "uAqr*********O6hgF",
      "secret": "0wJB1hC*********9Ji4a"
    }
  ],
  "kucoin": [
    {
      "apiKey": "61a*********1e5995f",
      "secret": "bd33c*********cd8897d",
      "password": "gm6*********AQ7Km"
    }
  ]
}
```

You can copy from config.example.json.

It support multi apikey in one exchange.

# USAGE

## Query balance:
```
$ node ./ccxt-cli.js -b -e kucoin
kucoin 0 :
{ free: { USDT: 0.0352168 }, used: {}, total: { USDT: 0.0352168 } }

Done!
```

## Query orders:
```
$ node ./ccxt-cli.js -o WAN/USDT -e binance

binance 0 :
[
  {
    info: {
      symbol: 'WANUSDT',
      orderId: '10136975',
      orderListId: '-1',
      clientOrderId: 'ios_51ca4faa5e2645f999da3a08d9c2375c',
      price: '0.19590000',
      origQty: '34690.00000000',
      executedQty: '34690.00000000',
      cummulativeQuoteQty: '6795.77100000',
      status: 'FILLED',
      timeInForce: 'GTC',
      type: 'LIMIT',
      side: 'SELL',
      stopPrice: '0.00000000',
      icebergQty: '0.00000000',
      time: '1580401443200',
      updateTime: '1580430907486',
      isWorking: true,
      origQuoteOrderQty: '0.00000000'
    },
    id: '10136975',
    clientOrderId: 'ios_51ca4faa5e2645f999da3a08d9c2375c',
    timestamp: 1580401443200,
    datetime: '2020-01-30T16:24:03.200Z',
    lastTradeTimestamp: undefined,
    symbol: 'WAN/USDT',
    type: 'limit',
    timeInForce: 'GTC',
    postOnly: false,
    side: 'sell',
    price: 0.1959,
    stopPrice: undefined,
    amount: 34690,
    cost: 6795.771,
    average: 0.1959,
    filled: 34690,
    remaining: 0,
    status: 'closed',
    fee: undefined,
    trades: [],
    fees: []
  },
  {
    info: {
      symbol: 'WANUSDT',
      orderId: '144288964',
      orderListId: '-1',
      clientOrderId: 'ios_667d353392f04b8eb4a14b9a9c8170eb',
      price: '2.29000000',
      origQty: '500.00000000',
      executedQty: '500.00000000',
      cummulativeQuoteQty: '1145.00000000',
      status: 'FILLED',
      timeInForce: 'GTC',
      type: 'LIMIT',
      side: 'SELL',
      stopPrice: '0.00000000',
      icebergQty: '0.00000000',
      time: '1618470537621',
      updateTime: '1618470537644',
      isWorking: true,
      origQuoteOrderQty: '0.00000000'
    },
    id: '144288964',
    clientOrderId: 'ios_667d353392f04b8eb4a14b9a9c8170eb',
    timestamp: 1618470537621,
    datetime: '2021-04-15T07:08:57.621Z',
    lastTradeTimestamp: undefined,
    symbol: 'WAN/USDT',
    type: 'limit',
    timeInForce: 'GTC',
    postOnly: false,
    side: 'sell',
    price: 2.29,
    stopPrice: undefined,
    amount: 500,
    cost: 1145,
    average: 2.29,
    filled: 500,
    remaining: 0,
    status: 'closed',
    fee: undefined,
    trades: [],
    fees: []
  }
]

```
