<template>
    <div class="step-box" v-show="stepShow">
        <el-steps :active="stepActive">
            <el-step title="视频检测">
                <i class="step1" slot="icon"></i>
            </el-step>
            <el-step title="扬声器检测">
                <i class="step2" slot="icon"></i>
            </el-step>
            <el-step title="麦克风检测">
                <i class="step3" slot="icon"></i>
            </el-step>
            <el-step title="检测结果">
                <i class="step4" slot="icon"></i>
            </el-step>
        </el-steps>
        <!--step检测区域-->
        <div class="check-content-box">
            <div v-show="stepActive!=4" class="device-option-box">
                <div class="option-title">{{optionTitle}}选项</div>
                <el-select
                    v-model="selectedValue"
                    clearable
                    :placeholder="deviceOptions+optionTitle"
                    no-data-text="未检测到可用设备"
                    @change="handleSelectChange"
                >
                    <el-option
                        v-for="item in deviceInputOption"
                        :key="item.deviceId"
                        :label="item.label"
                        :value="item.deviceId"
                    ></el-option>
                </el-select>
            </div>
            <!--摄像头窗口-->
            <div v-show="stepActive===1">
                <div id="cameras" class="cameras"></div>
                <div class="mirror-box">
                    <div class="title">镜像模式</div>
                    <el-checkbox v-model="mirrorChecked">镜像模式</el-checkbox>
                </div>
                <div class="text-prompt">
                    <p>温馨提示:如果您无法看到视频，请按以下方式排查问题</p>
                    <p>1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；</p>
                    <p>2.确认摄像头已连接并开启；</p>
                    <p>3.如果摄像头仍然没有画面，换一个插口重新插入摄像头；</p>
                    <p>4.请选择正确摄像头选项，选择禁用会导致摄像头不可用；</p>
                    <p>5.确认摄像头没有被其他程序占用；</p>
                    <p>6.重启电脑。</p>
                </div>
            </div>
            <!--扬声器检测-->
            <div v-show="stepActive===2">
                <p style="margin-top:40px">点击下方播放按钮，您能听到音乐吗？</p>
                <audio
                    id="music_audio"
                    style="margin-top:10px"
                    controls
                    class="audio-play"
                    src="https://doccdn.talk-cloud.net/static/h5_new_3.3.13/music/detectionDevice_default.wav"
                ></audio>
                <div class="text-prompt">
                    <p>温馨提示:如果您无法听见声音，请按以下方式排查</p>
                    <p>1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；</p>
                    <p>2.确认手机、扬声器已连接并开启；</p>
                    <p>3.如果耳机、扬声器音量已经调整到最大；</p>
                    <p>4.请选择正确的耳机选项，选择禁用会导致耳机、扬声器不可用；</p>
                    <p>5.如果耳机、扬声器仍然没有声音，换一个插口重新插入耳机、扬声器；</p>
                    <p>6.重启电脑。</p>
                </div>
            </div>
            <!-- 麦克凤检测 -->
            <div v-show="stepActive===3">
                <p
                    style="color:#C3C3C3;font-size:13px;margin-top:35px"
                >对着麦克风从1数到10，您能听到自己的声音并且看到绿条滚动吗？</p>
                <!-- 滚动音条 -->
                <div class="spectrum">
                    <div class="spectrum-item">
                        <span :class="{green:this.voice>=1}"></span>
                        <span :class="{green:this.voice>=2}"></span>
                        <span :class="{green:this.voice>=3}"></span>
                        <span :class="{green:this.voice>=4}"></span>
                        <span :class="{green:this.voice>=5}"></span>
                        <span :class="{green:this.voice>=6}"></span>
                        <span :class="{green:this.voice>=7}"></span>
                        <span :class="{green:this.voice>=8}"></span>
                        <span :class="{green:this.voice>=9}"></span>
                        <span :class="{green:this.voice>=10}"></span>
                    </div>
                </div>
                <div class="text-prompt">
                    <p>温馨提示:如果您无法看到绿色滚动条，请按以下方式排查</p>
                    <p>1.若杀毒软件（如：360卫士，百度卫士）弹出提示信息，请选择“允许”；</p>
                    <p>2.确认麦克风已连接并开启；</p>
                    <p>3.确认麦克风已插入电脑的麦克风插孔中，并且麦克风声音已调整到最大；</p>
                    <p>4.请选择正确的麦克风选项，选择禁用会导致麦克风不可用；</p>
                    <p>5.如果麦克风仍然没有声音，换一个插口重新插入麦克风；</p>
                    <p>6.重启电脑。</p>
                </div>
            </div>
            <!-- 检测结果 -->
            <div v-show="stepActive===4">
                <el-table
                    :data="checkTableData"
                    style="width: 100%"
                    :header-cell-style="headerCellStyle"
                    :row-class-name="rowClassName"
                >
                    <el-table-column prop="title" label="检测项目" align="center" header-align="center"></el-table-column>
                    <el-table-column
                        prop="result"
                        label="检测结果"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                    <el-table-column
                        prop="details"
                        label="检测详情"
                        align="center"
                        header-align="center"
                    ></el-table-column>
                </el-table>
            </div>
            <!-- btn -->
            <div class="btn-box">
                <el-button
                    type="danger"
                    round
                    size="small"
                    @click="nextStep(stepActive,'fail')"
                >{{btnText !='重新检测'?`不${btnText}`:btnText}}</el-button>
                <el-button
                    type="success"
                    round
                    size="small"
                    @click="nextStep(stepActive,'success')"
                >{{btnText==='重新检测'?'进入房间':btnText}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import TrtcInit from "../utils/TRTC/init";
import { Loading, Switch } from "element-ui";

var checkEnv = null;

export default {
  name: "checkClientEnvStep",
  data() {
    return {
      stepActive: 1,
      optionTitle: "摄像头",
      deviceOptions: `未检测到`,
      deviceInputOption: [],
      selectedValue: "",
      deviceId: "",
      localStream: {}, //本地流对象
      loadingOptions: {
        target: ".cameras",
        text: ""
      },
      mirrorChecked: true, //镜像模式
      level: 0,
      voice: 0,
      checkTableData: [
        {
          title: "视频检测",
          result: "",
          details: ""
        },
        {
          title: "扬声器检测",
          result: "",
          details: ""
        },
        {
          title: "麦克风检测",
          result: "",
          details: ""
        },
        {
          title: "浏览器版本",
          result: "",
          details: ""
        }
      ],
      currentAudioId: "",
      currentVideoId: "",
      currentSpeakerId: ""
    };
  },
  props: {
    stepShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    //镜像切换
    mirrorChecked(value) {
      this.mirrorChecked = value;
      let deviceIdObj = {
        cameraId: this.selectedValue,
        mirror: value //视频镜像
      };
      //创建一个新的本地流
      this.clientJoinRoom(deviceIdObj, true);
    },
    stepActive(value) {
      switch (value) {
        case 1:
          this.optionTitle = "摄像头";
          break;
        case 2:
          this.optionTitle = "扬声器";
          checkEnv.checkDevicesEnv("扬声器").then(async result => {
            this.deviceInputOption = result;
            this.selectedValue = result[0].deviceId;
            
            this.localStream.setAudioOutput(result[0].deviceId).then(() => {
              console.log("扬声器切换成功---------------------->");
              this.currentSpeakerId = result[0].deviceId
            });
          });
          break;
        case 3:
          this.optionTitle = "麦克风";
          checkEnv.checkDevicesEnv("麦克风").then(async result => {
            this.deviceInputOption = result;
            this.selectedValue = result[0].deviceId;
            this.currentAudioId = result[0].deviceId;

            this.localStream
              .switchDevice("audio", this.selectedValue)
              .then(() => {
                console.log("audio切换成功---------------------->");
                //音频采集
                this.macPhoneStreamVolume();
              });
          });
          break;
      }
    },
    // 监听麦克风声音
    level(value) {
      // console.log(value)
      if (value >= 200 && value <= 400) {
        // 显示一格音谱
        this.voice = 1;
      } else if (value >= 401 && value <= 600) {
        this.voice = 2;
        // 显示二格音谱
      } else if (value >= 601 && value <= 800) {
        this.voice = 3;
        // 显示三格音谱
      } else if (value >= 801 && value <= 1000) {
        this.voice = 4;
        // 显示四格音谱
      } else if (value >= 1001 && value <= 1200) {
        this.voice = 5;
        // 显示五格音谱
      } else if (value >= 1201 && value <= 1400) {
        this.voice = 6;
        // 显示六格音谱
      } else if (value >= 1401 && value <= 1600) {
        this.voice = 7;
        // 显示七格音谱
      } else if (value >= 1601 && value <= 1800) {
        this.voice = 8;
        // 显示八格音谱
      } else if (value >= 1801 && value <= 2000) {
        this.voice = 9;
        // 显示九格音谱
      } else if (value > 2001) {
        this.voice = 10;
        // 显示全部音谱
      } else {
        this.voice = 0;
      }
    }
  },
  computed: {
    ...mapState(["USER"]),
    btnText() {
      switch (this.stepActive) {
        case 1:
          return "可以看到";
          break;
        case 2:
          return "可以听到";
          break;
        case 3:
          return "可以看到波动";
          break;
        case 4:
          return "重新检测";
          break;
      }
    }
  },
  created() {
    checkEnv = new TrtcInit({
      userId: this.USER.NIKE_NAME,
      roomId: this.USER.ROOM_ID
    });
  },
  mounted() {
    this.checkTableData[3]["result"] = checkEnv.getBrowerInfo();
    this.checkTableData[3]["details"] = "已是Chrome最新版本";
  },
  methods: {
    // 初始化创建本地流视频
    checkCamera() {
      checkEnv.checkDevicesEnv("摄像头").then(async result => {
        this.deviceInputOption = result;
        this.selectedValue = result[0].deviceId;
        this.deviceId = result[0].deviceId;
        this.currentVideoId = result[0].deviceId;
        // 备份视频数据 直接用于重新检测摄像头设备使用
        sessionStorage.setItem(
          "backupsCameraData",
          JSON.stringify({
            deviceInputOption: result,
            selectedValue: result[0].deviceId
          })
        );
        //   获取客户端签名
        await checkEnv.clientInit(this.USER.NIKE_NAME);
        // 加入房间获取本地流
        this.clientJoinRoom({ cameraId: result[0].deviceId });
      });
    },

    // 摄像头/麦克风切换 用户切换设备选择 el-select
    async handleSelectChange(deviceId) {
      // 切换摄像头
      if (this.stepActive == 1) {
        this.deviceId = deviceId;
        this.selectedValue = deviceId;
        this.localStream.switchDevice("video", deviceId).then(() => {
          console.log("camera切换成功---------------------->");
          this.currentVideoId = deviceId;
        });
      }
      //  设置扬声器
      if (this.stepActive == 2) {
        this.localStream.setAudioOutput(deviceId).then(() => {
          console.log("扬声器切换成功---------------------->");
          this.currentSpeakerId = deviceId;
        });
      }
      // 麦克风切换
      if (this.stepActive == 3) {
        this.localStream.switchDevice("audio", deviceId).then(() => {
          console.log("audio切换成功---------------------->");
          this.currentAudioId = deviceId;
        });
      }
    },

    // 切换下一步检测跳转
    nextStep(step, status) {
      switch (step) {
        case 1:
          this.stepActive = this.stepActive + 1;
          if (status === "success") {
            this.checkTableData[0]["result"] = "正常";
            this.checkTableData[0]["details"] = "可以看到视频";
          } else if (status === "fail") {
            this.checkTableData[0]["result"] = "异常";
            this.checkTableData[0]["details"] = "没有检测到摄像头设备";
          }
          break;
        case 2:
          this.stepActive = this.stepActive + 1;
          if (status === "success") {
            this.checkTableData[1]["result"] = "正常";
            this.checkTableData[1]["details"] = "可以听到声音";
          } else if (status === "fail") {
            this.checkTableData[1]["result"] = "异常";
            this.checkTableData[1]["details"] = "没有检测到扬声器设备";
          }
          break;
        case 3:
          this.stepActive = this.stepActive + 1;
          if (status === "success") {
            this.checkTableData[2]["result"] = "正常";
            this.checkTableData[2]["details"] = "您选择了'可以看到波动''";
          } else if (status === "fail") {
            this.checkTableData[2]["result"] = "异常";
            this.checkTableData[2]["details"] = "您选择了'不可以看到波动'";
          }
          break;
        case 4:
          if (status === "success") {
            // 检测完毕 取消发布本地流
            checkEnv.client
              .unpublish(this.localStream)
              .then(() => {
                this.checkTableData[0].videoId = this.currentVideoId;
                this.checkTableData[0].mirror = this.mirrorChecked;
                this.checkTableData[1].speakerId = this.currentSpeakerId;
                this.checkTableData[2].audioId = this.currentAudioId;
                // 取消发布本地流成功
                checkEnv.client
                  .leave()
                  .then(() => {
                    // 解除所有事件绑定
                    checkEnv.clientOff();
                    this.localStream.close();
                    this.$store
                      .dispatch("syncCheckResult", this.checkTableData)
                      .then(() => {
                        this.$router.replace("index");
                      });
                  })
                  .catch(error => {
                    console.error("leaving room failed: " + error);
                  });
              })
              .catch(() => {
                this.$store
                  .dispatch("syncCheckResult", this.checkTableData)
                  .then(() => {
                    this.$router.replace("index");
                  });
              });
          } else {
            // 重新检测
            let backupsCameraData = JSON.parse(
              sessionStorage.getItem("backupsCameraData")
            );
            this.deviceInputOption = backupsCameraData.deviceInputOption;
            this.selectedValue = backupsCameraData.selectedValue;
            this.stepActive = 1;
          }
          break;
      }
    },

    /**
     *加入直播间创建本地流并播放
     @params deviceIdObj 本地流参数对象
     @params switchCamera true创建一个新的本地流视频 反之获取默认并创建
     @params callBack 返回一个新创建的本地流对象
    **/
    clientJoinRoom(deviceIdObj, switchCamera, callBack) {
      checkEnv.join(
        deviceIdObj,
        localStream => {
          callBack && callBack(localStream);
          //  绑定流视频到DOM中并播放
          this.trtcVideoPlay(localStream);
        },
        switchCamera // 创建默认/新本地流视频开关
      );
    },

    //绑定流视频到DOM中并播放
    trtcVideoPlay(localStream) {
      this.localStream = localStream;
      // 播放本地流音频
      localStream
        .play("cameras")
        .then(() => {
          console.log("播放该音视频流成功");
          this.$nextTick(() => {
            Loading.service(this.loadingOptions).close();
          });
        })
        .catch(e => {
          const errorCode = e.getCode();
          if (errorCode === 0x4043) {
            // PLAY_NOT_ALLOWED,引导用户手势操作恢复音视频播放
            // stream.resume()
          }
        });
    },

    // 音频采集 获取音频流麦克风输出音量
    macPhoneStreamVolume() {
      setInterval(() => {
        const level = this.localStream.getAudioLevel();
        this.level = parseInt(level * 10000);
      }, 200);
    },

    // el-table样式
    headerCellStyle() {
      return "border-bottom:none;color:#f3571e";
    },
    // el-table样式
    rowClassName({ row, rowIndex }) {
      if (this.stepActive === 4) {
        if (row.result === "异常") {
          return "row-class-name-fail";
        } else {
          if (row.result === "正常") {
            return "row-class-name";
          } else {
            let ischrome = row.result.indexOf("chrome/83.0.41");
            if (ischrome == -1) {
              this.checkTableData[3]["details"] = "当前浏览器不支持";
              return "row-class-name-fail";
            } else {
              return "row-class-name";
            }
          }
        }
      }
    }
  }
};
</script>

<style lang='less' scoped>
.step-box {
  .el-steps {
    width: 800px;
    margin-bottom: 95px;
    .step1,
    .step2,
    .step3,
    .step4 {
      width: 35px;
      height: 35px;
      background-size: 100% 100%;
    }
    .step1 {
      background-image: url("../assets/img/shexiangtou.png");
    }
    .step2 {
      background-image: url("../assets/img/erji.png");
    }
    .step3 {
      background-image: url("../assets/img/macIphone.png");
    }
    .step4 {
      background-image: url("../assets/img/jieguo.png");
    }
  }

  /deep/ .el-steps {
    .el-step.is-horizontal .el-step__line {
      top: 48%;
      left: 33%;
      right: 9%;
    }
    .el-step__head.is-process {
      border-color: #dedede;
    }
    .el-step__title.is-process {
      font-weight: normal;
      color: #c0c4cc;
    }
    .el-step__title {
      transform: translateX(-2px);
    }
    .el-step__head.is-finish {
      border-color: rgb(252, 208, 192);
    }

    .el-step__title.is-finish {
      color: rgb(243, 87, 30);
    }

    .el-step__icon {
      width: 56px;
      height: 56px;
      background-color: rgb(253, 110, 57);
    }
  }

  .check-content-box {
    position: relative;
    padding: 30px;
    width: 800px;
    height: 600px;
    border: 4px solid rgb(250, 226, 217);
    border-radius: 10px;
    background-color: #ffffff;

    .device-option-box {
      display: flex;
      align-items: center;
      .option-title {
        font-size: 16px;
        margin-right: 15px;
      }
      .el-select {
        flex: 1;
      }
    }
    .spectrum {
      margin-top: 35px;
      margin-bottom: 62px;
      .spectrum-item {
        span {
          display: inline-block;
          width: 13px;
          height: 40px;
          border-radius: 10px;
          margin-right: 10px;
          background-color: #fdf3ef;
        }
      }
    }
  }

  #cameras,
  .cameras {
    width: 200px;
    height: 150px;
    margin-left: 95px;
    margin-top: 40px;
  }
  .mirror-box {
    display: flex;
    align-items: center;
    margin-top: 25px;
    .title {
      font-size: 16px;
      margin-right: 40px;
    }
  }
  .text-prompt {
    color: #acacac;
    font-size: 13px;
    margin-top: 30px;
  }
  .btn-box {
    position: absolute;
    width: 732px;
    bottom: 40px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 0;
      font-size: 13px;
      width: 116px;
      height: 37px;
      margin-left: 25px;
    }
  }
  .audio-play {
    width: 400px;
  }
}

.green {
  background-color: #a3cfad !important;
}

.el-table__row > td {
  border: none;
}

.el-table::before {
  height: 0px;
}

/deep/ .row-class-name {
  width: 732px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: rgb(245, 255, 241);
  border-radius: 10px;
  td {
    flex: 1;
    border-bottom: none;
    color: rgb(105, 103, 103);
  }
}

/deep/ .row-class-name-fail {
  width: 732px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border-radius: 10px;
  background-color: #fdf3ef;

  td {
    flex: 1;
    border-bottom: none;
    color: rgb(105, 103, 103);
  }
}
</style>