<template>
    <div class="container">
        <el-row>
            <el-col :span="24">
                <div class="login-bg-box">
                    <div class="grid-content">
                        <el-form
                            :model="ruleForm"
                            label-position="top"
                            status-icon
                            :rules="rules"
                            ref="ruleForm"
                            label-width="100px"
                            class="demo-ruleForm"
                        >
                            <div class="title">学府云课堂</div>
                            <el-form-item label="" prop="userNikeName">
                                <el-input v-model="ruleForm.userNikeName" placeholder="用户ID"></el-input>
                            </el-form-item>
                            <el-form-item label="" prop="roomId">
                                <el-input v-model.number="ruleForm.roomId" placeholder="房间号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')">进入教室</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
    name: "login",

    data() {
        var checkUserNikeName = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户ID"));
            } else {
                callback();
            }
        };

        var checkRoomId = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("房间号不能为空"));
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error("请输入数字值"));
                } else {
                    callback();
                }
            }, 1000);
        };

        return {
            ruleForm: {
                userNikeName: "",
                roomId: ""
            },
            rules: {
                userNikeName: [{ validator: checkUserNikeName, trigger: "blur" }],
                roomId: [{ validator: checkRoomId, trigger: "blur" }]
            }
        };
    },

    methods: {
    ...mapMutations(["SET_USER"]),

        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    // this.ruleForm.userNikeName ="user_" +parseInt(Math.random() * 100000000) + this.ruleForm.userNikeName;
                    let params = {
                            userNikeName: this.ruleForm.userNikeName,
                            roomId: this.ruleForm.roomId
                        };
                    this.SET_USER(params)

                    this.$router.replace('/checkClientEnv');
                } else {
                    return false;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .login-bg-box {
    padding-top: 160px;
    margin-top: 90px;
    width: 100%;
    height: 330px;
    background: url("https://classedu.qq.com/Public/img/huiyi.jpg") no-repeat
      center;
    background-size: 100%;
  }
}
.grid-content {
  display: flex;
  justify-content: center;
  align-items: center;
  .demo-ruleForm {
    box-sizing: border-box;
    background-color: #fff;
    width: 460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 30px;
    box-shadow: 0 0 10px rgb(224, 224, 224);
    .title {
      font-size: 21px;
      text-align: center;
      margin-bottom: 40px;
    }
    button {
      width: 100%;
    }
  }
}
</style>
