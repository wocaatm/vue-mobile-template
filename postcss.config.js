// 在postcss.config.js中设置
const path = require('path');
const autoprefixer = require('autoprefixer');
const px2rem = require('postcss-plugin-px2rem');
// 排除在外的转换
const excludePathList = [];
// 系统分隔符
const sep = path.sep;
const excludeRegStr = excludePathList.map(p => `(${p.replace(/\//gi, '\\' + sep)})`).join('|');

module.exports = ({ file }) => {
  let remUnit;
  if (file && file.dirname && file.dirname.indexOf(`vant${sep}lib`) > -1) {
    remUnit = 37.5;
  } else {
    remUnit = 75;
  }
  return {
    plugins: [
      autoprefixer(),
      px2rem({
        rootValue: remUnit,
        // propBlackList: ['font-size'],
        // selectorBlackList: ['van-circle__layer'],
        exclude: new RegExp(excludeRegStr),
      }),
    ],
  };
};
