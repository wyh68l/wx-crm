<template>
  <div>
    <div class="bgfff pl15 pb10 pr15">
      <div class="bgf5f6 bradius17 textc lh34 disflex align-cen pl25 search trans2 pr25"
           @click="search_focus"
      >
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/search.png" style="flex: 0 0 32upx" alt="" class="w16 h16"/>
        <input type="text" v-model="searchKey" placeholder="输入公司名称"
               class="ca8 fs14 lh34 h34 textl pl10 trans2 w100p"
               @confirm="search_confirm">
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "chooseCompany",
    data(){
      return {
        searchKey: '',
      }
    },
    methods:{
      search_confirm(){

      },
    }
  }
</script>

<style scoped>
  page{
    background: white;
  }
</style>
