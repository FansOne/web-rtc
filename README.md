# xufu-rtc

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

##适配处理：安装依赖后在node_modules文件夹下找到flexible.js 更改‘750’为‘width’#####eg：if (width / dpr > 540) {
            width = width * dpr;
        }```### 请在~@/src/utils/TRTC/getTestYserSig.js文件下配置申请好的SDKAPPID SECRETKEY ```###后期抽空会做一个互动白板 及web IM...