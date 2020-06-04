<template>
    <div class="student-viewport-box">
        <div v-for="(item,index) in remoteStream" :key="index" :id="item.id"></div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      remoteStream: [] //远端流
    };
  },
  computed: {},
  watch: {},
  methods: {

    //播放远端流
    sendRemoteStream(remoteStream,TRTC) {
      this.remoteStream.push({
          id:`id-${remoteStream.getId()}`,
          stream:remoteStream
      });

      this.$nextTick(() => {
        //播放
        remoteStream.play(`id-${remoteStream.getId()}`).then(()=>{
            // console.log(this.$refs.remoteStream)
        });
        // 获取当前所有远端流的视频统计数据
        TRTC.getRemoteVideo(stats=>{
            // 远端有视频流通知父组件调整白板高度
           if(Object.keys(stats).length){
               this.$emit('beStudentLive',true)
           }else{
               this.$emit('beStudentLive',false)
           }
        })
      });
    },

    // 删除指定流
    async deleteStream(stream){

        await stream.stop()
        await stream.close()

        this.remoteStream.forEach((item,index)=>{
            if(item.id.indexOf(stream.getId()) != -1){

                this.remoteStream.splice(index,1)
            }
        })

        if(!this.remoteStream.length) this.$emit('beStudentLive',false)
    }
  },
  created() {}
};
</script>
<style lang='less' scoped>
.student-viewport-box{
  width: 100%;
  height: 160px;
  padding: 0 25px;
  display: flex;
  justify-content: center;
  div {
    width: 200px;
    height: 160px;
    margin: 0 5px;
  }
}
</style>