import TRTC from "trtc-js-sdk";
import {
    genTestUserSig
} from './getTestYserSig'
class Init {
    /**
     * 
     * @param {Object} options = {
     *  userId:xxx,
     *  roomId:xxx
     * }
     */
    constructor(options) {
        this.userId = options.userId;
        this.roomId = options.roomId;
        this.client = null; //客户端服务
        this.MicrophonesArr = []; //用户麦克风设备数组集合
        this.camerasArr = []; //用户摄像头设备数组集合
        this.speakersArr = []; //用户扬声器设备
        this.localStream = null; ////本地流
    }

    // 检查设备环境 获取设备列表
    /***
     * @params checkStep 可选值 'getCameras','getMicrophones','getSpeakers'
     */
    checkDevicesEnv(checkStep = false) {
        return new Promise((resolve, reject) => {
            TRTC.checkSystemRequirements().then(result => {
                if (!result) {
                    alert('您的浏览器不兼容此应用！\n建议下载最新版Chrome浏览器');
                    window.location.href = 'http://www.google.cn/chrome/';
                } else {
                    // 用户授权摄像头、麦克风设备
                    // *****注意测试环境下此API(navigator.mediaDevices.getUserMedia)只在开启本地服务的设备上有效
                    navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: true
                    })
                    .then(stream => {
                        // console.log('已点击允许,开启成功', stream);

                        // 返回媒体输入输出设备列表。
                        TRTC.getDevices().then(devices => {
                            devices.forEach(item => {
                                // console.log('媒体输入输出设备列表↓↓↓: ',item);
                            });
                        }).catch(error => console.error('getDevices error observed ', error));

                        let getCameras = TRTC.getCameras(); // 获取摄像头设备列表。
                        let getMicrophones = TRTC.getMicrophones(); //获取麦克风设备列表
                        let getSpeakers = TRTC.getSpeakers(); // 获取扬声器设备

                        if (!checkStep) { // 同时检测返回设备集合
                            Promise.all([getCameras, getMicrophones, getSpeakers]).then(result => {
                                this.camerasArr = result[0];
                                this.MicrophonesArr = result[1];
                                this.speakersArr = result[2];
                                resolve(result)
                            })
                        } else { //分步骤检测 按传入‘checkStep’设备名称检测
                            if (checkStep === '摄像头') {
                                getCameras.then(res => {
                                    this.camerasArr = res;
                                    resolve(res)
                                })
                            } else if (checkStep === '扬声器') {
                                getSpeakers.then(res => {
                                    this.speakersArr = res;
                                    resolve(res)
                                })
                            } else if (checkStep === '麦克风') {
                                getMicrophones.then(async res => {
                                    this.MicrophonesArr = res; //麦克风设备列表

                                    resolve(res)
                                })
                            }
                        }
                    })
                    .catch(error=>{
                        console.log(`错误===>：${error}`)
                        reject(error)
                    })
                }
            });

            TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.DEBUG);
            TRTC.Logger.enableUploadLog();
        })
    }

    clientInit(userId) {
        //获取签名
        const config = genTestUserSig(userId);
        const sdkAppId = config.sdkAppId;
        const userSig = config.userSig;

        this.client = TRTC.createClient({
            mode: 'videoCall',
            sdkAppId,
            userId,
            userSig
        });
        // 监听订阅客户端对象事件
        this.handleEvents();
    }

    // 监听订阅远端流
    subscribedRemoteStream(callback) {
        // step 1>远端流添加事件，当远端用户发布流后会收到该通知
        this.client.on('stream-added', event => {
            const remoteStream = event.stream;
            // const remoteUserId = remoteStream.getUserId();
            console.log('1>远端流增加: ' + remoteStream.getId());

            // step 2>订阅远端音频和视频流
            this.client.subscribe(remoteStream)
                .then(() => {
                    console.log('2>订阅远端流成功===>');
                })
                .catch((e) => {
                    console.error('订阅远端流失败↓↓↓', e);
                });
        });

        // step 3>监听远端流订阅成功事件
        this.client.on('stream-subscribed', event => {
            const remoteStream = event.stream;
            // 远端流订阅成功
            console.log('3>远端流订阅成功，准备播放远端音视频流>>>', remoteStream)
            //播放远端音视频流
            callback(remoteStream)
        });

        //远端流更新事件，当远端用户添加、移除或更换音视频轨道后会收到该通知。
        this.client.on('stream-updated', event => {
            const remoteStream = event.stream;
            console.log('stream-updated>>>远端用户添加、移除或更换音视频轨道', remoteStream)
        });
    }

    /**
     * @param deviceIdObj 摄像头麦克风设备ID对象
     * deviceIdObj = {
     *      cameraId:'xxx',
     *      microphoneId:'xxx',
     *      mirror: true //视频镜像
     * }
     */
    async join(deviceIdObj = {}, callback, switchCamera = false) { //switchCamera=true 重新发布本地流 (需要先取消发布)
        if (!switchCamera) {
            await this.client.join({
                roomId: this.roomId
            });
            console.log('加入房间成功');
            this.initLocalStream(deviceIdObj, callback)
        }

        if (switchCamera) { //取消初始化发布的本地流
            await this.localStream.close()
            this.client.unpublish(this.localStream).then(() => {
                console.log('========>取消发布本地流成功')
                this.initLocalStream(deviceIdObj, callback)
            });
        }

    }

    // 初始化本地流
    async initLocalStream(deviceIdObj, callback) {
        let localStreamParams = {
            audio: true,
            video: true,
            userId: this.userId,
            mirror: true
        };
        if (deviceIdObj.audio != undefined) localStreamParams.audio = deviceIdObj.audio;
        if (deviceIdObj.video != undefined) localStreamParams.video = deviceIdObj.video;
        if (deviceIdObj.mirror != undefined) localStreamParams.mirror = deviceIdObj.mirror;
        if (deviceIdObj.cameraId) localStreamParams.cameraId = deviceIdObj.cameraId;
        if (deviceIdObj.microphoneId) localStreamParams.microphoneId = deviceIdObj.microphoneId;
        // localStreamParams
        // debugger
        //根据是否传入（deviceIdObj）设备id来创建有无麦克风/摄像头本地流 Stream 对象
        this.localStream = await TRTC.createStream(localStreamParams);

        // 初始化本地音视频流对象
        await this.localStream.initialize()
            .then(() => {
                console.log('本地流音频初始化成功')
                //  状态变化事件 App 可根据状态变化来更新 UI
                this.localStream.on('player-state-changed', event => {
                    console.log(`状态变化事件 App 可根据状态变化来更新 UI local stream ${event.type} player is ${event.state}`);
                });
                // 发布本地流
                this.client.publish(this.localStream).then(() => {
                    console.log('发布本地流成功')
                    callback.call(window, this.localStream)
                })
            })
            .catch(error => {
                console.error('初始化本地流失败 ', error);
                alert('请确保摄像头正确接入')
            })
    }

    handleEvents() {
        //客户端错误事件，当出现不可恢复错误后 Client 会通过该事件上报。
        this.client.on('error', err => {
            console.error('!!!!!!!!!!!!!!!!' + err);
            const errorCode = err.getCode();
            alert(errorCode);

            // 页面重载
            // ...
        });

        //用户被踢出房间通知
        this.client.on('client-banned', err => {
            console.error('客户被禁止' + err);
        });
    }

    /*
     * 获取浏览器版本信息
     */
    getBrowerInfo() {
        var agent = navigator.userAgent.toLowerCase();

        var regStr_ie = /msie [\d.]+;/gi;
        var regStr_ff = /firefox\/[\d.]+/gi
        var regStr_chrome = /Chrome\/[\d.]+/gi;
        var regStr_saf = /safari\/[\d.]+/gi;
        //IE
        if (agent.indexOf("msie") > 0) {
            return agent.match(regStr_ie)[0];
        }
        //firefox
        if (agent.indexOf("firefox") > 0) {
            return agent.match(regStr_ff)[0];
        }
        //Chrome
        if (agent.indexOf("chrome") > 0) {
            return agent.match(regStr_chrome)[0];
        }
        //Safari
        if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
            return agent.match(regStr_saf)[0];
        }

    }

    // 解除所有事件绑定
    clientOff() {
        this.client.off('*');
    }
    
    // 获取当前所有远端流的视频统计数据
    getRemoteVideo(callback){
        this.client.getRemoteVideoStats().then(stats => {
            callback(stats)
            // for (let userId in stats) {
            //     console.log('userId: ' + userId)
            // }
        });
    }

    // 远端用户进房通知
    peerJoin() {
        return new Promise(resolve => {
            client.on('peer-join', event => {
                resolve(event.userId)
            });
        })
    }

    // 远端用户退房通知
    peerLeave() {
        return new Promise(resolve => {
            client.on('peer-leave', event => {
                resolve(event.userId)
            });
        })
    }

    //远端流移除事件
    removeStream(callback) {
        this.client.on('stream-removed', event => {
            const remoteStream = event.stream;
            callback(remoteStream)
        });
    }
}

export default Init;