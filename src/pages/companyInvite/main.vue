<template>
  <div class="h100p bgfff">
    <p class="fs18 c38 fbold pt30 pb25 textc bgfff">
      Hi！<span class="cblue">{{companyInfo.name}}</span> 邀请你加入以下企业
    </p>

    <div class="pl15 pr15 bgfff">
      <div class="shadow_gray pt15  pb11  bgfff fs12 ca8">
        <div class="disflex jsbet pr15 pl15">
          <img :src="companyInfo.companyLogo"
               mode="aspectFill"
               class="w50 h50 bradius5 mr11">
          <div class="flex1">
            <p class="c38 fs18">{{companyInfo.companyName}}</p>
            <p class="fs14 pt7">{{companyInfo.industryName}}</p>
          </div>
        </div>

        <div class="disflex jsbet lh45 pr15 pl15 align-cen">
          <div class="disflex align-cen" @click="isShowNotice=true">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/notice.png" alt="" class="w16 h16 mr8" />

            <div class="marquee_container" style="--marqueeWidth--:-12em;" :style="{width: '580upx'}">
              <div class="marquee_text">{{companyInfo.companyNotice || ''}}</div>
            </div>
<!--            <span>{{companyInfo.companyNotice}}</span>-->
          </div>
        </div>

        <div class="btf7 disflex jsbet pl47 pr47 fs10 ca8 pt10 textc">
          <div>
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/prod_gray.png" alt="" class="w24 h24" />
            <p>产品</p>
          </div>
          <div>
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/browser_gray.png" alt="" class="w24 h24" />
            <p>动态</p>
          </div>
          <div>
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/computer_gray.png" alt="" class="w24 h24" />
            <p>官网</p>
          </div>
        </div>
      </div>
    </div>

    <div class="disflex jscen pt50 wrap">

      <span class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15 w290" @click="joinCompany">立即加入该企业</span>

      <span class="bblue cblue fs18 lh44 textc w290 bradius5" @click="createCompany">我的企业</span>

    </div>

    <!--提示弹框-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="'提示'" @btn_tap="hint_btn_tap" :dialog_ph="'你还没有归属企业哦，是否去创建自己的企业？'"
                 :type = "'hint2'"
                 :default="classify_name"
                 :left="'取消'"
                 :right="'创建企业'"
      ></DialogBox>

    </div>

    <div v-if="isShowNotice" @click="isShowNotice=false">
      <Notice title="公告" :notice="companyInfo.companyNotice"></Notice>
    </div>
  </div>
</template>

<script>
  import DialogBox from '@/components/dialogBox' // 对话框
  import Notice from '@/components/Notice'
  import WXAJAX from '../../utils/request'
  import StaticResources from '@/components/StaticResources';

  export default {
    name: '',
    components: {DialogBox, StaticResources, Notice},
    data() {
      return{
        dialog_show:false,
        companyInfo: {},
        isCreateCompany: false,
        isShowNotice:false,
      }
    },
    mounted() {
      this.getCompanyInfo();
      wx.setNavigationBarTitle({
        title: "企业邀请"
      });
    },
    methods: {
      joinCompany (){
        if(this.isCreateCompany) {
          wx.navigateTo({url: `/pages/editCard/main?invite=1`});
        } else {
          wx.showToast({
            title: '您已加入其它企业',
            icon: 'none'
          });
        }
      },
      createCompany(){
        if(this.isCreateCompany) {
          this.dialog_show = true;
        } else {
          wx.switchTab({
            url: '/pages/mine/main'
          })
        }
      },
      page_tap(url) {
        wx.navigateTo({url: '../' + url + '/main'})
      },
      hint_btn_tap(method,text){
        this.dialog_show = false ;
        if(method == 'save'){
          wx.navigateTo({url: '/pages/editEnterprise/main'});
        }
      },
      getCompanyInfo() {
        let companyId = decodeURIComponent(this.$root.$mp.query.scene || '').split('=')[1]
        WXAJAX.POST({
          companyId: this.$root.$mp.query.companyId || companyId
        }, '', '/company/getCompanyTransfer')
          .then(res=>{
            this.companyInfo = res;
            wx.setStorageSync('choose_company' , res.companyName) ;
            wx.setStorageSync('choose_company_id' , res.companyId) ;
            wx.setStorageSync('choose_company_logo' , res.companyLogo);
            this.checkUser();
          });
      },
      // 检测用户是否可以加入企业，或者是否有自己的企业
      checkUser(){
        WXAJAX.POST({ }, '', '/businessCard/isCreateCompany')
          .then(res=>{
            this.isCreateCompany = res;
          });
      },
    }
  }
</script>

<style>

  @keyframes around {
    from {
      margin-left: 100%;
    }
    to {
      /* var接受传入的变量 */
      margin-left: var(--marqueeWidth--);
    }
  }

  .marquee_container{
    /*background-color: #fe4655;*/
    height: 50upx;
    line-height: 44upx;
    position: relative;
    width: 580upx;
    margin-top:0;
    overflow: hidden;
  }
  .marquee_container:hover{
    /* 不起作用 */
    animation-play-state: paused;
  }
  .marquee_text{
    color:#A8A8A8;
    font-size: 24upx;
    display: inline-block;
    white-space: nowrap;
    animation-name: around;
    animation-duration: 10s;  /*过渡时间*/
    animation-iteration-count: infinite;
    animation-timing-function:linear;
  }
</style>





















