const app = {
  state: {
    // cardVideo: [],
    // editVideoExhibition: [],
    article: null, // 文章内容
  },
  mutations: {
  	// 保存文章
    SET_ARTICLE(state, data) {
    	state.article = data
    }
  },
  actions: { 
    setArticle({commit}, data) {
      commit('SET_ARTICLE', data)
    }
  }
}

export default app
