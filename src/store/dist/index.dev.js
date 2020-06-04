"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var state = {
  USER: {
    NIKE_NAME: '',
    ROOM_ID: ''
  },
  CHECK_STEP: false,
  //控制检测媒体设备组件展示
  CHECK_RESULT: {}
};
var mutations = {
  SET_USER: function SET_USER(state, options) {
    state.USER.NIKE_NAME = options.userNikeName;
    state.USER.ROOM_ID = options.roomId;
  },
  SET_CHECK_STEP: function SET_CHECK_STEP(state, options) {
    state.CHECK_STEP = options;
  },
  SET_CHECK_RESULT: function SET_CHECK_RESULT(state, options) {
    state.CHECK_RESULT = options;
  }
};
var actions = {
  syncCheckResult: function syncCheckResult(context, options) {
    return new Promise(function (resolve) {
      context.commit('SET_CHECK_RESULT', options);
      resolve();
    });
  }
};

var _default = new _vuex["default"].Store({
  state: state,
  mutations: mutations,
  actions: actions
});

exports["default"] = _default;