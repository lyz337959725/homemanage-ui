import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state={
    userName:""
}

const mutations = {
    saveUserName: (state, name) => {
        state.userName = name
    }
}

const getters = {
    getUserName: (state) => state.userName
}


const Store = new Vuex.Store({
    state,mutations,getters
})

export default Store