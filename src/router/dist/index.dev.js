"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import {
//   localTake
// } from '../utils/baseTack'
_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  name: 'login',
  //login
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/login'));
    });
  } //../views/login

}, {
  path: '/checkClientEnv',
  name: 'checkClientEnv',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/checkClientEnv'));
    });
  }
}, {
  path: '/index',
  name: 'Home',
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('../views/index'));
    });
  }
}];
var router = new _vueRouter["default"]({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
}); // router.beforeEach((to, from, next) => {
//   const nextRoute = ['Home']; // 需要登录的页面
//   let isLogin = localTake('userMsg'); // 判断是否登录，本地存储有用户数据则视为已经登录
//   if (nextRoute.indexOf(to.name) >= 0) {
//     if (!isLogin) {
//       return next('/login')
//     }
//   } else {
//     if (isLogin) {
//       next('/')
//       return
//     }
//   }
//   next()
// })

var _default = router;
exports["default"] = _default;