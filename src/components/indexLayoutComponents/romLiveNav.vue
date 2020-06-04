<template>
    <div class="nav">
        <div class="nav-left-box">
            <img src="https://cna.talk-cloud.net/upload0/20200506_112206_qzhpozje.png">
            <div class="rom-id">
                <span>房间号：</span>
                <span>845484</span>
            </div>
            <!-- 计时器 -->
            <div class="timer">
                <div ref="startTimer">00:00:00</div>
            </div>
        </div>
        <el-button class="nav-middle-box" round>课程未开始</el-button>
        <div class="nav-right-box">
            <div class="icon-bg" @click="handlerDrawer('花名册')">
                <img src="../../assets/img/user-icon.png" title="花名册">
            </div>
            <div class="icon-bg" @click="handlerDrawer('课件库')">
                <img src="../../assets/img/courseware-icon.png" title="课件库">
            </div>
            <div class="icon-bg">
                <img src="../../assets/img/layout-icon.png" title="布局切换">
            </div>
            <div class="icon-bg">
                <img src="../../assets/img/doubt-icon.png" title="求助">
            </div>
            <div class="icon-bg">
                <img src="../../assets/img/setting-icon.png" title="设置">
            </div>
            <div class="icon-bg">
                <img src="../../assets/img/full-screen.png" @click="handlerFullScreen" title="全屏">
            </div>
            <el-button round type="success">上课</el-button>
        </div>
    </div>
</template>

<script>
import screenfull from "screenfull";
export default {
  props: {},
  data() {
    return {
      timer: "",
      hour: 0,
      minutes: 0,
      seconds: 0,
      cr: "",
      drawer: false
    };
  },

  created() {},

  methods: {
    startTimer() {
      this.seconds += 1;
      if (this.seconds >= 60) {
        this.seconds = 0;
        this.minutes = this.minutes + 1;
      }

      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hour = this.hour + 1;
      }
      this.$refs.startTimer.innerHTML =
        (this.hour < 10 ? "0" + this.hour : this.hour) +
        ":" +
        (this.minutes < 10 ? "0" + this.minutes : this.minutes) +
        ":" +
        (this.seconds < 10 ? "0" + this.seconds : this.seconds);
      this.cr = this.seconds;
    },
    handlerTimerStop() {
      clearInterval(this.timer);
    },
    handlerTimerStart() {
      this.timer = setInterval(this.startTimer, 1000);
    },
    handlerDrawer(text) {
      this.$parent.$parent.$parent.handlerOpenDrawer(text);
    },
    // 全屏
    handlerFullScreen() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: "不支持全屏",
          type: "warning"
        });
        return false;
      }
      screenfull.toggle();
    }
  }
};
</script>

<style lang='less' scoped>
.nav {
  height: 50px;
  background-color: #f1633a;
  display: flex;
  align-content: center;
  justify-content: space-between;
  padding: 0 25px;
  .nav-left-box {
    display: flex;
    align-items: center;
    img {
      width: 130px;
      height: 35px;
    }
    .rom-id {
      color: #fff;
      font-size: 13px;
      margin: 0 15px;
    }
    .timer {
      color: #fff;
      font-size: 14px;
    }
  }

  .nav-middle-box {
    background-color: rgba(255, 255, 255, 0.1);
    border-width: 2px;
    border-color: rgba(255, 255, 255, 0.4);
    color: #fff;
    height: 35px;
    margin-top: 8px;
    font-size: 13px;
    padding: 0 20px;
  }

  .nav-right-box {
    display: flex;
    align-items: center;
    .icon-bg {
      background-color: #fec62b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 33px;
      width: 38px;
      height: 38px;
      border-radius: 11px;
      img {
        width: 28px;
        height: 28px;
      }
    }
    .el-button {
      width: 110px;
      height: 40px;
      margin-left: 33px;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      padding: 0;
      letter-spacing: 2px;
      font-size: 15px;
    }
  }
}
</style>