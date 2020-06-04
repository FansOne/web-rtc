<template>
    <div class="teacher-live-viewport" id="teacher-live-viewport"></div>
</template>

<script>
var loading = null;

export default {
  components: {},
  data() {
    return {
      localStream: {}
    };
  },
  created() {
    loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(255, 255, 255, 1)"
    });
  },
  computed: {},
  watch: {},
  methods: {
    play(localStream) {
      this.localStream = localStream;
      // 播放本地流音频
      localStream
        .play("teacher-live-viewport")
        .then(() => {
          loading.close();
          console.log("播放该音视频流成功");
        })
        .catch(e => {
          const errorCode = e.getCode();
          if (errorCode === 0x4043) {
            // PLAY_NOT_ALLOWED,引导用户手势操作恢复音视频播放
            // stream.resume()
          }
        });
    }
  }
};
</script>
<style lang='less' scoped>
.teacher-live-viewport {
  height: 40%;
  background-color: #e5e5e5;
}
.teacher-live-viewport:hover {
}
</style>