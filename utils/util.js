var momnet = require("./moment");
var request = require("./request");
var login = require("./login");

// 去掉左右空格
const trim = string => {
  return string.replace(/(^\s*)|(\s*$)/g, "");
};

module.exports = {
  request,
  momnet,
  login,
  trim,
};
