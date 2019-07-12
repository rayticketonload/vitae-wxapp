// domain map
// URL 路径字符串最后必须要有层级的反斜杠

// 本地调试
const NP = `http://`;
const APIDOMAIN = `localhost:8000/`;
const APIPATH = `api/`;

// 腾讯云调试
// const NP = `https://`;
// const APIDOMAIN = `www.wellwell.wang/`;
// const APIPATH = `mini/api/`;
const IMGPATH = `mini/`;

// localStorage 存放搜索历史的 key
const SEARCH_HISTORY_KEY = `searchHistory`;
const MSG_QTY_HISTORY_KEY = `msgQtyHistory`;

// api
const API = {
  // 顶级收纳点（地点）
  packListForPackModifySelectMenu: `${NP}${APIDOMAIN}${APIPATH}packListForPackModifySelectMenu`, // 用于”修改盒子“页面的”存放位置“选择菜单的盒子列表
  getPackListByDefaultPack: `${NP}${APIDOMAIN}${APIPATH}getPackListByDefaultPack`,
  modifyDefaultPack: `${NP}${APIDOMAIN}${APIPATH}modifyDefaultPack`,
  getDefaultPackList: `${NP}${APIDOMAIN}${APIPATH}getDefaultPackList`,
  // 获取某个收纳点内的收纳点列表和物品列表
  getPAGListById: `${NP}${APIDOMAIN}${APIPATH}getPAGListById`,
  // 收纳点
  addPack: `${NP}${APIDOMAIN}${APIPATH}addPack`,
  getPackInfoById: `${NP}${APIDOMAIN}${APIPATH}getPackInfoById`,
  updataPackInfoById: `${NP}${APIDOMAIN}${APIPATH}updataPackInfoById`,
  deletePackById: `${NP}${APIDOMAIN}${APIPATH}deletePackById`,
  // 物品
  addGood: `${NP}${APIDOMAIN}${APIPATH}addGood`,
  getGoodInfoById: `${NP}${APIDOMAIN}${APIPATH}getGoodInfoById`,
  updataGoodInfoById: `${NP}${APIDOMAIN}${APIPATH}updataGoodInfoById`,
  deleteItemById: `${NP}${APIDOMAIN}${APIPATH}delSingleItemById`,
  // 站内信
  msg: `${NP}${APIDOMAIN}${APIPATH}msg`,
  deleteMsgById: `${NP}${APIDOMAIN}${APIPATH}deleteMsgById`,
  // 用户信息
  getUserInfo: `${NP}${APIDOMAIN}${APIPATH}getUserInfo`,
  // 最近编辑
  getNewest: `${NP}${APIDOMAIN}${APIPATH}getNewestModify`,
  // 搜索
  search: `${NP}${APIDOMAIN}${APIPATH}search`,
  // 权限
  getToken: `${NP}${APIDOMAIN}${APIPATH}getToken`,
  // 上传
  upload: `${NP}${APIDOMAIN}${APIPATH}upload/photo`,
};

// route
const ROUTE = {
  // 首页
  index: `../index/index`,
  // 信息页面
  msg: `../msg/msg`,
  // 增加顶级收纳点（地点）页面
  addLocation: `../addLocation/addLocation`,
  // 选择顶级收纳点（地点）页面
  changeLocation: `../changeLocation/changeLocation`,
  // 修改顶级收纳点（地点）页面
  editLocation: function(id, name) {
    return `../editLocation/editLocation?locationId=${id}&locationName=${name}`;
  },
  // 帮助页面
  help: `../help/help`,
  // 搜索页面
  search: `../search/search`,
  // 列表页
  list: function(parentPackID, parentPackName, checked = "package") {
    return `../list/list?packName=${parentPackName}&packId=${parentPackID}&checked=${checked}`;
  },
  // 增加物品页面
  addItem: function(parentPackID, parentPackName) {
    return `../addItem/addItem?parentPackID=${parentPackID}&parentPackName=${parentPackName}`;
  },
  // 修改物品页面
  editItem: function(id) {
    return `../editItem/editItem?itemId=${id}`;
  },
  // 增加收纳盒页面
  addBox: function(parentPackID, parentPackName) {
    return `../addBox/addBox?parentPackID=${parentPackID}&parentPackName=${parentPackName}`;
  },
  // 修改收纳盒页面
  editBox: function(id) {
    return `../editBox/editBox?packId=${id}`;
  },
};

module.exports = {
  NP,
  APIDOMAIN,
  APIPATH,
  IMGPATH,
  SEARCH_HISTORY_KEY,
  MSG_QTY_HISTORY_KEY,
  API,
  ROUTE,
};
