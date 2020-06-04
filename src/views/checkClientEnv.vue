<template>
    <div class="container">
        <el-row v-if="!stepShow">
            <el-col :span="24">
                <div class="check-box">
                    <div>欢迎使用在线教室</div>
                    <div class="prompt-text">为了保证更好的授课效果，请先完成设备检测</div>
                    <el-button type='primary' round @click="handlerStartCheck">开始检测</el-button>
                </div>
            </el-col>
        </el-row>

        <CheckClientEnv ref="CheckClientEnv" :stepShow='stepShow'/>
    </div>
</template>

<script>
import { mapState,mapMutations } from 'vuex'
import CheckClientEnv from '../components/checkClientEnvStep'

export default {
    components: {
        CheckClientEnv
    },
    data() {
        return {
            stepShow:false,
        };
    },

    computed: {
    },

    methods:{

        handlerStartCheck(){
            this.stepShow = true
            
            this.$refs.CheckClientEnv.checkCamera()
        }
    }
};
</script>

<style lang='less' scoped>
    .container{
        min-height: 100vh;
        background-color: #EBEBEB;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 100px;
        .el-row{
            display: flex;
            justify-content: center;
        text-align: center;

        }
        .check-box{
            .prompt-text{
                font-size: 16px;
                margin-top: 50px;
                margin-bottom: 70px;
            }
            .el-button {
                width: 100%;
            }
        }
    }
</style>