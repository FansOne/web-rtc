<template>
    <div class="layout">
        <!-- 顶部导航 -->
        <el-row>
            <el-col :span="24">
                <Nav/>
            </el-col>
        </el-row>
        <!-- 内容区域 -->
        <el-row>
            <!-- 白板&学生视频窗口 -->
            <el-col :span="19" class="el-col-style">
                <!-- 白板区域 -->
                <DrawingBoard :beStudentLiveViewports='beStudentLiveViewports'/>
                <!-- 学生发言席(视频窗口)区域（多人课堂） -->
                <StudentLiveViewport v-show="beStudentLiveViewports" ref='studentLiveCom' @beStudentLive="studentLiveStats"/>
            </el-col>
            <!-- 教师视频窗口&聊天窗口 -->
            <el-col :span="5" class="el-col-style">
                <!-- 老师直播视口 -->
                <TeacherLiveViewport ref="teacherLiveCom"/>
                <!-- 群组聊天区域 -->
                <ChatGroup/>
            </el-col>
        </el-row>

        <!-- 右侧抽屉（花名册，课件库） -->
        <el-drawer :visible.sync="drawer" :withHeader='false' :append-to-body='true' custom-class='drawer-style' :modal='false' :size="drawerType==='花名册'?'30%':'25%'">
            <span>我来啦!</span>
        </el-drawer>
    </div>
</template>

<script>
import { mapState } from "vuex";

import TrtcInit from "../utils/TRTC/init";

import Nav from "../components/indexLayoutComponents/romLiveNav";

import DrawingBoard from "../components/indexLayoutComponents/drawingBoard";
import StudentLiveViewport from "../components/indexLayoutComponents/studentLiveViewport";

import TeacherLiveViewport from "../components/indexLayoutComponents/teacherLiveViewport";
import ChatGroup from "../components/indexLayoutComponents/chatGroup";

var TRTC = null;
export default {
  name: "index",
  data(){
      return{
          time:'44',
          drawer: false,
          drawerType:'',
          beStudentLiveViewports:false, //是否有学生加入到发言席
      }
  },
  components: {
    Nav,
    DrawingBoard,
    StudentLiveViewport,
    TeacherLiveViewport,
    ChatGroup
  },
  computed:{
      ...mapState(['CHECK_RESULT']) //检测结果
  },
  created(){
    console.log(JSON.parse(JSON.stringify(this.CHECK_RESULT)))

    // 初始化rtc
    TRTC = new TrtcInit({
      userId: this.$store.state.USER.NIKE_NAME,
      roomId: this.$store.state.USER.ROOM_ID
    });

    // 加入直播间&订阅远端流
    this.joinLive()
  },
  methods:{
      // 加入直播间&订阅远端流
      async joinLive(){
        //初始化获取签名
        await TRTC.clientInit(this.$store.state.USER.NIKE_NAME)

        //创建本地流 根据用户选择校验
        this.checkSelectLive((localStream)=>{

            // 子 老师视口组件播放本地流
            this.$refs.teacherLiveCom.play(localStream)
            
        })

        //订阅远端流
        TRTC.subscribedRemoteStream( remoteStream =>{
            // 子 学生视口组件播放本地流
            this.$refs.studentLiveCom.sendRemoteStream(remoteStream,TRTC)
        })
        // 监听远端流移除
        TRTC.removeStream(currentDeleteStream => {
            this.$refs.studentLiveCom.deleteStream(currentDeleteStream)
        })
      },

      //校验用户选择
      checkSelectLive(callback){
          let checkResult = this.CHECK_RESULT;
          let deviceIdObj = {
              mirror:this.CHECK_RESULT[0].mirror
          };
          // 用户选择开启视频/麦克风
          if (checkResult[0].result === "正常" && checkResult[2].result === "正常") {
            //   并且存在对应媒体id
              if(checkResult[0].videoId && checkResult[2].audioId){
                  deviceIdObj = {
                      cameraId:checkResult[0].videoId,
                      microphoneId:checkResult[2].audioId
                  };
                  TRTC.join(deviceIdObj,(localStream)=>{
                      callback(localStream)
                  })
              }
          }
      },

      //远端流存在状态 调整白板高度
      studentLiveStats(stats){
          this.beStudentLiveViewports = stats
      },

      handlerOpenDrawer(text){
          this.drawerType = text
          this.drawer = true
      }
  }
};
</script>

<style lang='less' scoped>
.layout {
  height: 100vh;
  background-color: #f1f1f1;
  .el-col-style{
      height: calc(100vh - 50px);
  }
}
/deep/ .drawer-style{
      top: 50px;
      bottom: 0;
      background-color: rgba(0, 0, 0, .7);
      color: #f1633a;
  }
</style>
