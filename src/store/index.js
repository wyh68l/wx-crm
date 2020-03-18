import Vue from "vue";
import Vuex from "vuex";
// import mutations from './mutations.js'
import msgList from './msgList'
import msgCont from './msgCont'
import jsMsg from './jsMsg'
import app from './app';

Vue.use(Vuex);
const state = {
  currentCompany: {},
  currentClient: {},
  cardVideo: [],
  //分享的文章 分享的动态的详情
  shareRecordsInfo: null
  /* name: 'HD384483939',// 用户名
   infocount: 1,// 消息数量
   token: '123456'//token*/
};

const mutations = {
  SET_CURRENT_COMPANY(state, data) {
    state.currentCompany = Object.assign({}, state.currentCompany, data);
  },
  SET_CURRENT_CLIENT(state, data) {
    state.currentClient = data;
  },
  SET_CARDVIDEO(state, data) {
    state.cardVideo = data;
  },
  setShareRecordsInfo(state, data) {
    state.shareRecordsInfo = data;
  }
};

const actions = {
  setCurrentCompany({ commit }, data) {
    commit("SET_CURRENT_COMPANY", data);
  },
  setCurrentClient({ commit }, data) {
    commit("SET_CURRENT_CLIENT", data);
  }
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    msgList,
    msgCont,
    jsMsg,
    app
  },
  getters: {
    currentCompany: state => state.currentCompany,
    currentClient: state => state.currentClient,
    msglist: state => state.msgList.msglist,
    msgCont:state=>state.msgCont.msgCont,
    changePosition:state=>state.msgCont.status,
    article: state => state.app.article
  },
  /* plugins: [
       createPersistedState({
           storage: {
               getItem: key => {
                   wx.getStorageSync(key)
               },
               setItem : (key ,value)=>{
                   wx.setStorageSync(key,value)
               },
               removeItem:key=>{
                   wx.clearStorage()
               }
           }
       })
   ]*/
});
