const path = require('path');
const config = require('./config');

const {
  historyApiFallback,
  host,
  port,
  proxyTable,
  autoOpenBrowser,
  publicPathDev,
  useEslint,
  before,
} = config.dev;
const { publicPathProd } = config.prod;
const isProd = process.env.NODE_ENV === 'production';

// webpack externals
const enternals = {};

// dir's absolute path
function resolve(dir) {
  return path.join(__dirname, dir);
}

// webapck base config
let baseConfig = {
  chainWebpack: config => {
    // config enternals
    config.externals({ ...config.get('externals'), ...enternals });
    // config modules alias，make some alias for path
    config.resolve.modules
      .add(resolve('src'))
      .end()
      .alias.set('@', resolve('src'));

    // delete preload and prefetch for slow network. ex: mobile
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');

    // provide jQuery for use, no need to import $ from 'jQuery'
    // config
    //     .plugin('provide')
    //     .use(require('webpack/lib/ProvidePlugin'), [
    //       {
    //         $: 'jquery'
    //       }
    //     ])

    // definePlugin, define some global variable
    // config
    //     .plugin('define')
    //       .tap(args => {
    //         return args
    //       })

    // delete elsint
    if (!useEslint) config.module.rules.delete('eslint');

    if (isProd) {
      // code split for mode production
      config.optimization.splitChunks({
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
        },
      });

      // close performance waring
      config.performance.hints(false);
    }
  },
  configureWebpack: config => {
    if (isProd) {
      // 使用的terser-webpack-plugin插件，默认drop_console 为false，vue-cli源码里是chainWebpack 后执行configureWebpack
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  },
};

// some other config for different mode
if (isProd) {
  const prodConfig = {
    publicPath: publicPathProd,
    productionSourceMap: false, // close sourceMap for production
  };
  baseConfig = { ...baseConfig, ...prodConfig };
} else {
  const devConfig = {
    publicPath: publicPathDev,
    devServer: {
      host: host || 'localhost',
      port: port || 8080,
      // vue-router hash mode now is a hack in vue-router3.x
      historyApiFallback,
      // ajax proxy
      proxy: proxyTable,
      open: autoOpenBrowser || true,
      // eslint's warning display in browsers
      overlay: {
        warnings: false,
        errors: false,
      },
      before,
    },
  };
  baseConfig = { ...baseConfig, ...devConfig };
}

module.exports = baseConfig;
