export default {
  state:{
    msgCont:{},
    status: 1,
  },
  mutations:{
    GET_MSG_CONT(state,data){
      state.msgCont=data;
      console.log("state",state.msgCont);
    },
    ADD(state, data) {
      if (!state.msgCont.data) state.msgCont.data = [];
      state.msgCont.data.push(data)
    },
    ADD_LIST(state, data){
      if (!state.msgCont.data) state.msgCont.data = [];
      state.msgCont.data.unshift(...(data.data || []));
    },
    CHANGE_STATUE(state){
      state.status++;
    },
    READ_MSG(state){

      if (!state.msgCont.data) return;
      let userId = wx.getStorageSync('userId');

      state.msgCont.data.map(val=>{

        if (val.sendId == userId) {
          val.type = 1;
        }
      });

    }
  },
  actions:{
    getMsgCont({commit},data){
      commit('GET_MSG_CONT',data)
    },
    add({commit}, data){
      commit('ADD', data);
      commit('CHANGE_STATUE')
    },
    addList({commit}, data){
      commit('ADD_LIST', data);
    },
    change({commit},data){
      commit('CHANGE_STATUE')
    },
    readMsg({commit}){
      commit('READ_MSG');
    },
  }
}
