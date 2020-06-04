import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    USER: {
        NIKE_NAME: '',
        ROOM_ID: ''
    },

    CHECK_STEP: false, //控制检测媒体设备组件展示

    CHECK_RESULT: {}

};

const mutations = {
    SET_USER(state, options) {
        state.USER.NIKE_NAME = options.userNikeName
        state.USER.ROOM_ID = options.roomId
    },
    SET_CHECK_STEP(state, options) {
        state.CHECK_STEP = options
    },
    SET_CHECK_RESULT(state, options) {
        state.CHECK_RESULT = options
    },
};

const actions = {
    syncCheckResult(context, options) {
        return new Promise(resolve => {
            context.commit('SET_CHECK_RESULT', options);
            resolve();
        });
    }
}

export default new Vuex.Store({
    state,
    mutations,
    actions
})