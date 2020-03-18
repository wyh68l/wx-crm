<template>
  <div class=" bgfff h100p">
    <!--top-->
    <div class="pt10 pb10 bgf5f6">
      <MsgBox :msg="msgitem"
              :istel="true"></MsgBox>
    </div>

    <Log :logs="followLogs" :isInFollowLog="true" :firstLog="firstLog" @updateLogs="updateLogs">
    </Log>

    <!--bottom-->
    <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
    <div class="pb44"></div>

    <BottomButtonSmall :text="'添加跟进记录'" :url="'editLog'" @btn_tap="btn_tap"></BottomButtonSmall>

  </div>
</template>

<script>
  import MsgBox from '@/components/msgBox' // 订单项
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import Log from '@/components/log' //

  import WXAJAX from '../../utils/request'
  import util from '../../utils/index'

  export default {
    name: '',
    components: {MsgBox, BottomButtonSmall,Log},
    data() {
      return {
        monthTime: '',
        msgitem:  {},
        followLogs:[],//跟进记录
        cardId:0,
        page:1,
        isLoading : false ,//是否在加载
        nodata:false ,//是否已经没有数据
        firstLog: '',
      }
    },
    async onPullDownRefresh() {
      // to doing..
      // 下拉刷新
      wx.showNavigationBarLoading();
      this.nodata = false ;
      this.followLogs = [] ;
      this.page = 1 ;
      this.isLoading = false ;
      this.getFollowLog();
      wx.stopPullDownRefresh();
      setTimeout(function () {
        wx.hideNavigationBarLoading();
      },300)
    },
    onReachBottom() {
      let v = this ;
      v.getFollowLog();

    },
    onShow(){
      this.cardId = this.$root.$mp.query.cardId ;
      this.nodata = false ;
      this.followLogs = [] ;
      this.page = 1 ;
      this.isLoading = false ;
      this.getFollowLog();
    },
    onUnload(){
      this.nodata = false ;
      this.followLogs = [] ;
      this.page = 1 ;
      this.isLoading = false ;
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "跟进记录"
      });
      this.cardId = this.$root.$mp.query.cardId ;
      this.followLogs = [] ;
      this.getClientMsg() ;
      this.getFollowLog() ;
    },
    methods: {
      btn_tap(url) {
        wx.navigateTo({url: '../' + url + '/main' + '?clientName='+this.msgitem.name + '&id='+this.msgitem.cardId});
      },
      getClientMsg(){//获取客户信息
        wx.showLoading();
        WXAJAX.POST({
          cardId  : this.cardId ,
        }, '', '/customer/getCustomerInfo').then((data) => {

          wx.hideLoading();
          if(data){
            data.userLogo = data.logo ;
            this.msgitem = data ;
            this.firstLog = data.createTime+ '由 '+ data.followName+' 主动加入';
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      updateLogs(month) {
        console.log(month)
        this.monthTime = month;
        this.page = 1;
        this.followLogs = [];
        this.getFollowLog();
      },
      getFollowLog(){//获取跟进记录
        if (this.monthTime === '') {
          let newDate = new Date(),
          endTime = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2);
          this.monthTime = endTime
        }
        let v = this ;
        if(v.isLoading){
          return
        }
        v.isLoading = true ;

        wx.showLoading();
        WXAJAX.POST({
          cardId  : this.cardId ,
          pageNum : this.page ,
          yearMonth: this.monthTime,
        }, '', '/followRecord/getFollowList').then((data) => {

          wx.hideLoading();
          if(data){
            data.forEach(function (i, k) {
              i.followRemark = JSON.parse(i.followRemark) ;
              i.infoText = i.followRemark.data ;
              i.time = util.getdate( i.createTime , 'monthTime') ;
              i.time = i.time.split(' ');
              // 1 -- 设置标签
              // 2 -- 修改客户共享范围
              // 3 -- 手动添加为客户
              // >= 4 -- 直接显示数据( 1 -- 电话 ， 2 -- 微信 ， 3 -- 手动添加 ， 4 -- 当面拜访 ， 5 -- 其他)
              if(i.followType){
                switch (i.followType) {
                  case 1 :
                    i.mark = '电话拜访' ;
                    i.name = i.followName ;
                    break;
                  case 2 :
                    i.mark = '微信拜访' ;
                    i.name = i.followName ;
                    break;
                  case 3 :
                    i.mark = i.followName ;
                    i.name = '' ;
                    break;
                  case 4 :
                    i.mark = '当面拜访' ;
                    i.name = i.followName ;
                    break;
                  case 5 :
                    i.mark = i.followName ;
                    break;
                }
                i.infoType = 3 + i.followType;
              }else{
                i.infoType = i.followRemark.type ;
              }
            });
            v.followLogs = [...v.followLogs , ...data];
            v.page ++ ;
            setTimeout(function () {
              v.isLoading = false ;
            },500);
          }else{
            setTimeout(function () {
              v.isLoading = false ;
            },500);
          }
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          if(err.code == 204){
            v.nodata = true ;
          }
          setTimeout(function () {
            v.isLoading = false ;
          },500);
        });
      },
    }
  }
</script>

<style>

</style>

















