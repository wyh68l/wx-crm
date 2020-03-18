<template>
  <div class="index bgfff h100p">

    <div class="pt15 pl16 pr15 pt16 bgfff pb15" @click="tocardCase">
      <div class="top_card fs12 shadow_gray pb50">
        <div class="pl34 pt25 cblue fs12"><span class="before_line_3">{{card_msg.companyName}}</span></div>
        <div class="top_msg disflex jsbet pt47">
          <div>
            <p class="fbold c38 fs18">{{card_msg.name}}</p>
            <p class="fs14 ca8 pt10 pb23">{{card_msg.position || '职位'}}</p>
            <p class="fs12 c78">» {{card_msg.phone || '电话'}}</p>
            <p class="fs12 c78">» {{card_msg.email || '邮箱'}}</p>
          </div>

          <img :src="card_msg.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'"
               mode="aspectFill"
               alt="" class="w60 h60 bradius5" />

        </div>
      </div>
    </div>


    <div class="disflex jscen pt50 wrap">

      <span @click="showCardDetail"
            class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15 w290">
        查看详情
      </span>

      <span @click="toMineCard"
            class="bblue cblue fs18 lh44 textc w290 bradius5">
        我的名片
      </span>

    </div>

  </div>
</template>

<script>
  import WXAJAX from '../../utils/request';
  import StaticResources from '@/components/StaticResources';
  import { toMiniProgram } from '@/utils';

  export default {
    name: "shareCard",
    components: {StaticResources},
    data(){
      return{
          cardId: 0,
        card_msg: {},
      };
    },
    mounted(){
      this.getCompanyInfo();
    },
      onLoad(options){
          if (options.cardId) {
              //从分享的名片页面进入
              this.cardId = options.cardId;
          }
      },
    methods:{
      showCardDetail(){
        const { companyId, cardId } = this.card_msg;
        toMiniProgram(`/pages/index/main?companyId=${companyId}&cardId=${cardId}&goType=1`);
      },
      toMineCard(){
        wx.switchTab({
          url: '/pages/mine/main',
        })
      },
      getCompanyInfo() {
        wx.showLoading();
        WXAJAX.POST({
          cardId: this.cardId,
        }, '', '/businessCard/getCompanyUserInfoTransfer')
          .then((data) => {
            wx.hideLoading();
            this.card_msg = data;
            this.card_msg.browsePhoto = this.card_msg.browsePhoto ? this.card_msg.browsePhoto.split(',') : [];
          })
          .catch(()=>{
            wx.hideLoading();
          })

      },
    }
  }
</script>

<style scoped>

</style>
