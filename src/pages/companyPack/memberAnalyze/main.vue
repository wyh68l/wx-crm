<template>
  <div>

    <div class="mt10 bgfff disflex pl15 pt15 pb15 bbf7">

      <img :src="cardMsg.logo" mode="aspectFill" alt="" class="w50 h50 bradius5 mr10">
      <div>
        <p class="disflex align-cen"><span class="fbold c38 fs18 pr11">{{cardMsg.name}}</span><span class="fs12 ca8">{{cardMsg.position}}</span> </p>
        <div class="disflex align-cen pt7">
          <span class="fs14 ca8  pr10">{{cardMsg.phone}}</span>
          <span @click="tel">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png"
                              alt="" class="w16 h16 "
                              />
          </span>
        </div>
      </div>

    </div>

    <div class="disflex jsbet align-cen bgfff mb10 pl16 pr15 lh49" @click="toyimai">
      <span class="fs16 fbold c38" @click="toUser">{{cardMsg.name}}的名片</span>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />
    </div>

    <!---->


    <!--AI分析-->
    <MemberOverview :type="'memberAnalyze'" :userId="userId" :cardId="cardId" :menu_id="0" :loadMore="loadMore"></MemberOverview>


  </div>
</template>

<script>
  import MemberOverview from '@/components/memberOverview' // 个人总览
  import StaticResources from '@/components/StaticResources';
  import WXAJAX from '../../../utils/request'
  import util from '../../../utils'

  export default {
    name: '',
    components: {MemberOverview, StaticResources},
    data() {
      return{
        userId : 0 ,
        cardId : 0 ,
        cardMsg:{
          photo:'' ,
          name : '' ,
          phone : '' ,
          position : ''
        } ,
        loadMore:0
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "成员分析"
      });
      this.userId = this.$root.$mp.query.userId || 0 ;
      this.cardId = this.$root.$mp.query.cardId || 0 ;
      this.getCardMsg() ;
    },
    onReachBottom(){
      this.loadMore ++ ;
    },
    onUnload(){
      wx.setStorageSync('memberCardId' , '') ;
      wx.setStorageSync('memberUserId' , '') ;
    },
    methods: {
      toUser(){
        const { companyId, cardId } = this.cardMsg;
        util.toMiniProgram(`/pages/index/main?companyId=${companyId}&cardId=${cardId}&goType=1`)
      },
      getCardMsg(){//获取名片信息
        let v = this ;
        wx.showLoading() ;
        WXAJAX.POST({
          cardId : this.cardId
        }, '', '/businessCard/getCompanyUserInfo').then((data) => {
          console.log('info-----------',data);
          wx.hideLoading();
          if (data) {
            v.$set(v, 'cardMsg', data);
          }
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();

        });
      },
      toyimai(){
        console.log('跳转到用户端的名片详情页面');
      },
      tel(){
        util.MakePhone(this.cardMsg.phone || '');
      }
    }
  }
</script>

<style>

</style>
