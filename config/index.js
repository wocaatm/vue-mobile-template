const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
// proxy lists
const serverList = {
  local: 'http://127.0.0.1:8001',
};

// First Step check yard args, ex:yarn serve -- --env=test01
const rawArgv = process.argv.slice(2);
const args = require('minimist')(rawArgv);

const proxyTable = {};

// validate args
let errorMsg = '';
let serverTarget = 'local'; // default test serve

if (Reflect.has(args, 'env')) {
  const serverEnv = args.env;
  if (!Reflect.ownKeys(serverList).includes(serverEnv)) {
    errorMsg = '[INFO], 启动参数env不存在，请检查';
  }
  if (errorMsg) {
    console.log(errorMsg);
    process.exit(1);
  }
  serverTarget = serverEnv;
}

// Second Step check proxy
const proxyRules = ['/api'];

// provide args to http-proxy-middleware
// use args.ip ,if exist for local network
const proxyTarget = args.ip ? `http://${args.ip}:${args.port || '8001'}` : serverList[serverTarget]

if (process.env.NODE_ENV !== 'production') {
  console.log(`Proxy Target => ${proxyTarget}`);
}

proxyRules.forEach(item => {
  proxyTable[item] = {
    target: proxyTarget,
    changeOrigin: false,
    ws: false,
  };
});

// 导出的配置
module.exports = {
  dev: {
    host: '0.0.0.0',
    port: '8080',
    autoOpenBrowser: true,
    proxyTable,
    historyApiFallback: true,
    publicPathDev: '/',
    useEslint: false,
    before: (app) => {
      // provider mock api
      const mockDir = path.resolve(__dirname, '../mock');
      const mockRouter = express.Router();
      // express middleware bodyParser for mock server
      mockRouter.use(bodyParser.json()); // for parsing application/json
      mockRouter.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
      app.use('/mock', mockRouter);
      fs.readdirSync(mockDir).forEach(file => {
        const mock = require(path.resolve(mockDir, file));
        mockRouter.use(mock.api, mock.response);
      });
    },
  },
  prod: {
    productionSourceMap: false,
    // CDN make all resource link start with CDN, otherwise the / make it on server
    publicPathProd: '/',
  },
};
