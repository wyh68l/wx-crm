<template>
  <div class="index bgf5f6 h100p">
    <div>
      <div v-if="card_msg.style == 0">
        <Card_1 :card_msg="card_msg"></Card_1>
      </div>

      <div v-if="card_msg.style == 1">
        <Card_2 :card_msg="card_msg" @uploadpic="uploadpic"></Card_2>
      </div>

      <div v-if="card_msg.style == 2">
        <Card_3 :card_msg="card_msg"></Card_3>
      </div>

      <div v-if="card_msg.style == 3">
        <Card_4 :card_msg="card_msg"></Card_4>
      </div>
      <div v-if="card_msg.style == 4">
        <Card_5 :card_msg="card_msg"></Card_5>
      </div>
    </div>

<!--    <div class="pt15 pl16 pr15 pt16 bgfff pb15">-->
<!--      <div class="top_card fs12 shadow_gray pb40">-->
<!--        <div class="pl34 pt25 cblue fs12"><span class="before_line_3">{{card_msg.companyName}}</span></div>-->
<!--        <div class="top_msg disflex jsbet pt40">-->
<!--          <div>-->
<!--            <p class="fbold c38 fs18">{{card_msg.name}}</p>-->
<!--            <p class="fs14 ca8 pt10 pb23">{{card_msg.position || '职位'}}</p>-->
<!--            <p class="fs12 c78">» {{card_msg.phone || '电话'}}</p>-->
<!--            <p class="fs12 c78">» {{card_msg.email || '邮箱'}}</p>-->
<!--          </div>-->

<!--          <img :src="card_msg.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'"-->
<!--               mode="aspectFill"-->
<!--               alt="" class="w60 h60 bradius5" />-->

<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="disflex pl15 pr15 fs18 lh44 textc jsbet bgfff" v-if="card_msg.cardId">
      <div class="bblue cblue  bradius5 w165" @click="toRoute('editCard','?type=edit')">
        编辑名片
      </div>
      <!-- <div class="bgblue bradius5 cfff w165">
           发送名片
       </div>-->
      <button class='bgblue bradius5 cfff w165 mr0' open-type="share" hover-class="other-button-hover">
        发送名片
      </button>
    </div>

    <div class="bgfff pl43 pr43" v-else>
      <span class="disinblock bradius5 bg_line_blue textc cfff w290 fs18 lh44" @click="toCreatePage">创建我的名片</span>
    </div>

    <view>
      <div class="card_menu fs12 ca8 bgfff borderbox pl10">
        <div class="clearfix pt5 pb5 disflex operation-box">
          <div class="shadow_gray textc pt15 pl15 pr15 h65 mr10 business_card" @click="createCode">
            <p class="pb3">名片码</p>
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/ercode.png" alt=" "
                 class="w20 h20" />
          </div>
          <scroll-view scroll-x scroll-with-animation>
            <div class="disflex scroll-list">
              <div class="shadow_gray textc pt15 pl15 pr15 h65 mr10"
                   @click="toRoute('showBill', '?cardId='+currentCompany.cardId)">
                <p class="pb7">
                  名片海报
                </p>
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/wx_timeline.png" alt=" "
                     class="w20 h20" />

              </div>
              <div class="shadow_gray textc pt15 pl15 pr15 h65 mr10" @click="tel">
                <p class="disflex align-cen">
                  <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png" alt=""
                       class="w16 h16" />
                  <span class="pl9">拨打电话</span>
                </p>
                <p class="c78 fbold pt7">{{card_msg.phone || '未填写'}}</p>
              </div>
              <div class="shadow_gray textc pt15 pl15 pr15 h65 mr10" @click="addWx">
                <p class="disflex align-cen">
                  <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/im_msg.png" alt=""
                       class="w16 h16" />
                  <span class="pl9">添加微信</span>
                </p>
                <p class="c78 fbold pt7">{{card_msg.personalWx || '未填写'}}</p>
              </div>
              <div class="shadow_gray textc pt15 pl15 pr15 h65 mr10">
            <p class="disflex align-cen">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190425164542.png" alt=""
                   class="w16 h16" />
              <span class="pl9">公司地址</span>
            </p>
            <p class="c78 fbold pt7">{{card_msg.address || '未填写'}}</p>
          </div>
            </div>
          </scroll-view>
        </div>
        <div class="more-info">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190514143457.png" alt="" class="left-img">
        </div>
      </div>

    </view>

    <div class="seen_peo disflex pl15 pr26 fs10 ca8 pb15 jsbet bgfff">
      <div>
        <div class="disflex">
          <img v-for="(v,k) in card_msg.browsePhoto" :key="k" :src="v" alt=""
               mode="aspectFill"
               class="w20 h20 bradius3 mr3"
          >
        </div>
        <p class="lh20">
          已有{{card_msg.browseNum}}人浏览
        </p>
      </div>
      <div class="textc">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/like.png"
             alt=""
             :class="isThumbs ? 'w20 h20' : 'filter_gray w20 h20'"
        />
        <p>靠谱 <span class="cpurple">{{card_msg.thumbsNum}}</span></p>
      </div>
    </div>

    <div class="bgfff pl15 pr15 pt20 pb20 mt10 mb10 ">
      <div class="degree-of-perfection">
        <div class="perfection c38 fs14 mb10">
          名片完善度
          <span class="fs18 fbold">{{card_msg.perfectRate || 0}}%</span>
          超越
          <span class="fs18 fbold">{{card_msg.perfectRateRank || 0}}%</span>
          同行
          <span class="fs18 cblue floatr" @click="toRoute('editCard','?type=edit')">去完善</span>
        </div>
        <div class="desc ca8 fs12">
          提高名片的完善度能更好地推广您的名片哦
        </div>
        <div class="line-outer">
          <div class="line" :style="'width: '+card_msg.perfectRate + '%'"></div>
        </div>
      </div>
      <div class="disflex jsbet wrap textc pt20">
        <div class="w108 h108 be8 bradius3 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">昨日获客</p>
            <p class="fs18 c38 fbold">{{card_msg.yesterdayCustomerCount || 0}}</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">昨日浏览</p>
            <p class="fs18 c38 fbold">{{card_msg.yesterdaySeeCount || 0}}</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">昨日订单</p>
            <p class="fs18 fbold">{{card_msg.yesterdayOrderCount || 0}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bgfff disflex jsbet pl33 pr26 pt20 mt10 mb10 textc">
      <div @click="toCardCase">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/cardcase.png" alt="" class="w30 h30" />
        <p class="fs12 c78 pt10 pb20">名片夹</p>
      </div>
      <div @click="toFrequent">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190529/1559095573730.png" alt="" class="w30 h30" />
        <p class="fs12 c78 pt10 pb20">常用功能</p>
      </div>
      <div @click="makeWx">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/im_msg.png" alt="" class="w30 h30" />
        <p class="fs12 c78 pt10 pb20">我要合作</p>
      </div>
      <div @click="makePhone">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/kefu.png" alt="" class="w30 h30" />
        <p class="fs12 c78 pt10 pb20">我的客服</p>
      </div>
    </div>

    <!--未创建名片提示-->
    <div v-show="nocard_show">
      <DialogBox :dialog_title="'提示'" @btn_tap="nocard_btn_tap" :dialog_ph="'您还没有名片哦，请先创建自己的名片再进入'"
                 :type="'hint2'"
                 :left="'取消'"
                 :right="'创建名片'"
      ></DialogBox>
    </div>

    <div v-if="isShowCourse">
      <addWxCourse :isShow="isShowCourse"
                   @close="isShowCourse=false"
      />
    </div>
  </div>
</template>

<script>
  import DialogBox from '@/components/dialogBox' // 对话框
  import StaticResources from '@/components/StaticResources';
  import AddWxCourse from '@/components/addWxCourse'
  import Card_1 from '@/components/card_1' //
  import Card_2 from '@/components/card_2' //
  import Card_3 from '@/components/card_3' //
  import Card_4 from '@/components/card_4' //
  import Card_5 from "@/components/card_5"; //
  import util from '../../utils/index'
  import WXAJAX from '../../utils/request';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    data() {
      return {
        hasCard: true,//是否已经有自己的名片
        nocard_show: false,
        COMPANYID: 0,
        CARDID: 0,
        card_msg: {
          style: 0,
        },
        isThumbs: 0,//是否点赞
        isShowCourse: false,
        card_style: 0,
      }
    },

    components: {DialogBox, AddWxCourse, StaticResources, Card_1, Card_2, Card_3, Card_4,Card_5},

    created() {
      wx.setNavigationBarTitle({
        title: "我的"
      });
      this.COMPANYID = this.currentCompany.companyId;
      this.CARDID = this.currentCompany.cardId;
      // this.inits();
    },
    onShow() {
      if (!this.COMPANYID) {
        this.COMPANYID = this.currentCompany.companyId;
        this.CARDID = this.currentCompany.cardId;
      }
      this.inits();

    },
    async onPullDownRefresh() {
      // to doing..
      // 停止下拉刷新
      wx.showNavigationBarLoading();
      this.inits();
      wx.stopPullDownRefresh();
      setTimeout(function () {
        wx.hideNavigationBarLoading();
      }, 300)
    },
    onShareAppMessage(e) {
      const {cardId, companyName, name, position, shareSpeech} = this.currentCompany;
      let shareMessage = "";
      if (shareSpeech && typeof (shareSpeech) === "string") {
        shareMessage = shareSpeech.replace('#name#', name).replace('#company#', companyName);
      }

      return {
        title: shareMessage || `您好，我是${companyName}的${position || ''}${name}，敬请惠存!`,
        path: `/pages/shareCard/main?cardId=${cardId}`,
        success(e) {
        },
        fail(e) {
          console.log('失败-- ', e);
        }
      }
    },
    methods: {
      ...mapActions(['setCurrentCompany']),
      toCardCase(){
        util.toMiniProgram(`/pages/cardCase/main?goType=1`);
      },
      toFrequent(){
        if (!this.card_msg.cardId) {
          this.nocard_show = true;
        } else {
          wx.navigateTo({
            url: "/pages/frequentPack/frequent/main"
          });
        }
      },
      makePhone(){
        wx.makePhoneCall({
          phoneNumber: '13392115519',
        })
      },
      makeWx(){
        let v = this;

        wx.setClipboardData({
          data: 'A6shop',
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
                v.isShowCourse =  true;
              }
            })
          }
        })
      },
      inits() {//获取数据
        wx.showLoading();
        WXAJAX.POST({ignore: true}, '', '/businessCard/getCompanyUserInfo').then((data) => {

          wx.hideLoading();
          console.log(data);
          if (data) {
            let cardWelcomeSpeech = {
              company: data.companyName,
              user: data.name,
              shareSpeech: data.shareSpeech ? data.shareSpeech : '',
              welcomeSpeech: data.welcomeSpeech ? data.welcomeSpeech : ''
            };
            wx.setStorageSync('cardWelcomeSpeech', cardWelcomeSpeech);
            this.card_msg = Object.assign({}, data, {
              companyId:data.companyId,
              picchecked: data.logo || '',
              username: data.name || '',
              tel: data.phone || '',
              wx: data.personalWx || '',
              company_wx: data.companyWx || '',
              email: data.email || '',
              post: data.position || '',
              company: data.companyName,
              company_logo: data.companyLogo,
              password: data.password || '',
            });
            this.card_msg.perfectRateRank = data.perfectRateRank ? (data.perfectRateRank*100).toFixed(0) : 0;
            this.card_msg.browsePhoto = this.card_msg.browsePhoto ? this.card_msg.browsePhoto.split(',') : [];
            this.setCurrentCompany(data);

              // 获取企业模块配置信息
            this.findCompanyModuleConfigs(data.companyId);
          } else {
            this.hasCard = false;
          }
        }).catch((err) => {
          console.log(err);
          this.card_msg = {};
          wx.hideLoading();
          this.hasCard = false;
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
      },
        /**
         * 获取企业模块配置信息
         * @param companyId 企业id
         */
        findCompanyModuleConfigs(companyId){
            WXAJAX.POST({companyId: companyId}, '', '/companyModuleConfig/findCompanyModuleConfigs').then((data) => {
                if(data){
                    let d = {} ;
                    data.forEach(function (i,k) {
                        d[i.moduleName] = i.close;
                    });
                    wx.setStorageSync('companyModuleConfig', d);
                }
            }).catch((err) => {
            });
        },
      tocardCase() {//名片夹
        // wx.navigateTo({url:'../cardCase/main'})
        // wx.navigateTo({url: '../orderLists/main'})
      },
      createCode(){
        WXAJAX.POST({
          cardId: this.currentCompany.cardId,
        }, '', '/businessCard/getWxTwoCode').then((data) => {
          wx.navigateTo({url: '/pages/cardCode/main?code='+data})
        }).catch((err) => {
          wx.hideLoading();
          if(err.code == 403){
            this.nocard_show=true;
          }else{
            wx.showToast({
              title: err.message,
              duration: 2000,
              icon: 'none'
            });
          }
        });
      },
      toRoute(url, query) {
        if (!this.card_msg.cardId) {
          this.nocard_show = true;
        } else {
          if (url == 'cardCase') {
            util.toMiniProgram(`/pages/index/main?companyId=${companyId}&cardId=${cardId}&goType=1`);
          } else {
            wx.navigateTo({url: '../' + url + '/main' + (query ? query : '')})
          }
        }

      },
      tel() {//拨打电话
        util.MakePhone(this.card_msg.phone || '');
      },
      nocard_btn_tap(str) {
        console.log(str);
        if (str == 'save') {
          this.toCreatePage();
        }
        this.nocard_show = false;
      },
      addWx() {//添加微信
        let v = this;
        if (v.card_msg.personalWx) {
          wx.setClipboardData({
            data: this.card_msg.personalWx,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  wx.showToast({
                    title: '复制成功'
                  })
                  v.isShowCourse =  true;
                }
              })
            }
          })
        } else {
          wx.showToast({
            title: '还没有添加微信呢！',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      doThumbs() {//点赞
        wx.showLoading();
        WXAJAX.POST({
          cardId: this.currentCompany.cardId,

        }, '', '/businessCard/doThumbs').then((data) => {

          wx.hideLoading();
          if (this.isThumbs) {
            this.$set(this.card_msg, 'thumbsNum', --this.card_msg.thumbsNum);
          } else {
            this.$set(this.card_msg, 'thumbsNum', ++this.card_msg.thumbsNum);
          }
          this.isThumbs = !this.isThumbs;
        }).catch((err) => {
          wx.hideLoading();
        });
      }
    },
    computed: {
      ...mapGetters(['currentCompany']),
    }

  }
</script>

<style>
  .degree-of-perfection .line-outer{
    position: relative;
    height: 8upx;
    width: 100%;
    background: rgb(245,245,245);
    border-radius: 198upx;
    overflow: hidden;
    margin-top: 40upx;
  }

  .degree-of-perfection .line-outer .line{
    height: 8upx;
    width: 0%;
    background: #00a0e9;
  }

  .more-info{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto 0;
    height: 40upx;
    width: 30upx;
    background: white;
    box-shadow:0px 0px 20upx 0px rgba(56,56,56,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .more-info .left-img{
    width: 10upx;
    height: 20upx;
  }
  .operation-box{
    margin-left: 130rpx;
    margin-right: 40upx;
    padding-left: 10upx;
  }
  .business_card{
    position: absolute;
    left: 0;
    top:50%;
    transform:translateY(-50%);
    border-radius: 0 50% 50% 0;
    display: flex;
    align-items: center;
    padding-top: 0;
    width: 140upx;
    box-sizing: border-box;
  }
  .business_card p{
    writing-mode:tb-rl;
  }

  .card_menu{
    position: relative;
  }

  .scroll-list{
    padding: 20upx 40upx 20upx 20upx;
  }
  .scroll-list > div {
    white-space:nowrap;
    box-sizing: border-box;
  }

  .self_introduce {
    height: 214upx;
    transition: .1s;
    overflow: hidden;
  }

  .self_introduce.higher {
    height: auto;
  }

  .output-audio {
    width: 167px;
    height: 40px;
    position: relative;
    margin-right: 22upx;
    padding-left: 40upx;
  }

  .audio::before {
    content: '';
    display: block;
    width: 20upx;
    height: 20upx;
    background: #F5F5F6;
    position: absolute;
    border: 1upx solid #E8E8E8;
    border-radius: 8upx;
    transform: rotate(45deg);
    border-right-width: 0;
    border-top-width: 0;
    top: 0px;
    bottom: 0;
    left: -12upx;
    margin: auto;
  }

  .output-audio .audio {
    padding: 24upx 0 24upx 34upx;
    background: #F5F5F6;
    border: 1upx solid #E8E8E8;
    position: relative;
    height: 34upx;
    border-radius: 10upx;
  }

  .output-audio .audio .ico {
    width: 24upx;
    height: 34upx;
    float: left;
  }

  scroll-view {
    background: #fff;
  }

</style>























