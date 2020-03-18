<template>
  <div class=" h100p" :class="isinvite ? 'bgfff' : ''">
    <!--邀请-->
    <div class="fs18 textc bgfff pt25 pb11" v-if="isinvite">
      Hi！<span class="cblue">{{ inviteName }} </span>邀请你加入以下企业
    </div>

    <!--top-->
    <div
      class="enterprise_top overhidden trans2"
      :style="{ height: menu_id == 1 ? '0' : '' }"
    >
      <div class="pt14 pl15 pr15 bgfff pb20">
        <div class="shadow_gray pt15  pb11  bgfff fs12 ca8 bradius10">
          <div class="disflex jsbet pr15 pl15">
            <image
              :src="companyTop.companyLogo"
              mode="aspectFill"
              class="w50 h50 bradius5 mr11"
            >
            </image>
            <div class="flex1">
              <p class="c38 fs18 fbold">
                {{ companyTop.companyName || "暂无企业" }}
              </p>
              <p class="fs14 pt7">{{ companyTop.industryName }}</p>
            </div>
          </div>

          <div class="disflex jsbet lh45 pr15 pl15 align-cen pb13 pt7">
            <div class="disflex align-cen" @click="isShowNotice = true">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/notice.png"
                alt=""
                class="w16 h16 mr8"
              />
              <!--<span>壹立科技，以壹为始，立壹之上</span>-->

              <div
                class="marquee_container"
                style="--marqueeWidth--:-12em;"
                :style="{ width: isBoss ? '256px' : '580upx' }"
              >
                <div class="marquee_text">
                  {{ companyTop.companyNotice || "" }}
                </div>
              </div>
            </div>

            <span
              @click="page_tap('editEnterprise', '?type=edit')"
              v-if="isBoss"
              style="display: flex"
            >
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/edit.png"
                class="w20 h20"
                alt=""
              />
            </span>
          </div>

          <div class="btf7 disflex jsbet pl30 pr30 fs10 ca8 pt10 textc">
            <div @click="page_tap('companyPack/appointmentManage')">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-www/img/icon-appointment.png"
                alt=""
                class="w24 h24"
              />
              <p>预约</p>
            </div>
            <div @click="page_tap('companyPack/productControl')">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/prod_gray.png"
                alt=""
                class="w24 h24"
              />
              <p>商城</p>
            </div>
            <div @click="page_tap('companyPack/dyamicManage')">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/browser_gray.png"
                alt=""
                class="w24 h24"
              />
              <p>动态</p>
            </div>
            <div @click="page_tap('webSiteControl')">
              <img
                src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/computer_gray.png"
                alt=""
                class="w24 h24"
              />
              <p>官网</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="disflex jsaround fs12 ca8 pt10 pb10 bgfff textc"
        v-if="!isinvite"
      >
        <div @click="page_tap('companyPack/member')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/members.png"
            alt=""
            class="w30 h30"
          />
          <p class="pt7">企业成员</p>
        </div>
        <div @click="page_tap('orderLists')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/order_yellow.png"
            alt=""
            class="w30 h30"
          />
          <p class="pt7">订单管理</p>
        </div>
        <div @click="page_tap('companyPack/financialStatistics')">
          <img
            src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/money.png"
            alt=""
            class="w30 h30"
          />
          <p class="pt7">财务统计</p>
        </div>
      </div>
    </div>

    <div v-if="hasenterprise" class="mt10">
      <!--menu-->
      <!--top-->
      <div
        class="disflex jsaround w100p fs14 c38 lh44 bgfff enterprise_menu"
        :class="menu_id == 1 ? 'top zindex9' : ''"
      >
        <span
          :class="menu_id == 0 ? 'bbblue_2 cblue fbold' : ''"
          @click="menu_tap(0)"
          >个人数据</span
        >
        <span
          v-if="isBoss"
          :class="menu_id == 2 ? 'bbblue_2 cblue fbold' : ''"
          @click="menu_tap(2)"
          >企业数据</span
        >
        <span
          :class="menu_id == 1 ? 'bbblue_2 cblue fbold' : ''"
          @click="menu_tap(1)"
          >销售排行</span
        >
      </div>

      <div v-show="menu_id == 0 || menu_id == 2">
        <PersonalOverview
          :isChange="isChange"
          ref="personalOverview"
          :menu_id="menu_id"
          :type="'enterprise'"
        ></PersonalOverview>
      </div>

      <div v-show="menu_id == 1">
        <SalesRanking :menu_id="menu_id"></SalesRanking>
      </div>

      <!-- <div v-if="menu_id == 2">

       </div>-->

      <!--bottom-->
      <div class="textc lh42 fs12 ca8 bgf5f6">- 汉全科技集团出品 -</div>
    </div>

    <div v-if="!hasenterprise && !isinvite" class="pl43 pr43 pt25">
      <span
        class="disinblock bradius5 bg_line_blue textc cfff w290 fs18 lh44"
        @click="page_tap('editEnterprise', '?type=add')"
      >
        您还没有企业，请先创建企业
      </span>
    </div>

    <div v-if="isinvite && !hasenterprise" class="pl43 pr43 pt25">
      <span
        class="disinblock bradius5 bg_line_blue textc cfff w290 fs18 lh44 mb15"
        >立即加入该企业</span
      >
      <span class="disinblock bradius5 bblue textc cblue w290 fs18 lh44"
        >我的企业</span
      >
    </div>

    <div v-if="isShowNotice" @click="isShowNotice = false">
      <Notice title="公告" :notice="companyTop.companyNotice"></Notice>
    </div>
    <div style="position: fixed;bottom: 0"></div>
  </div>
</template>

<script>
import PersonalOverview from "@/components/personalOverview"; // 个人总览
import SalesRanking from "@/components/salesRanking"; // 销售排行
import Notice from "@/components/Notice";
import StaticResources from "@/components/StaticResources";
import WXAJAX from "../../utils/request";
import utils from "@/utils";
import { mapActions } from "vuex";

export default {
  name: "",
  components: { PersonalOverview, SalesRanking, StaticResources, Notice },
  data() {
    return {
      resdata: [], //定义一个数组，用来动态传递图表数据
      menu_id: 0, //0--个人总览 ， 1-- 销售排行 ， 2-- AI分析
      hasenterprise: false, //是否有企业
      topHeight: "auto",
      isinvite: false, //是否为企业邀请
      inviteName: "付鑫", //谁邀请的
      companyTop: {
        companyName: "",
        companyNotice: ""
      },
      isBoss: true, //是否为Boss
      isChange: false,
      isShowNotice: false
    };
  },
  /*   onShareAppMessage(e){
           return {
               // title : '转发',
               path :'/pages/companyInvite/main',
               success(e){
                   console.log(e);
                   wx.showShareMenu({
                       withShareTicket : true
                   })
               },
               fail(e){
                   console.log('失败-- ',e);
               }
           }
       },*/
  onShow() {
    this.isBoss = wx.getStorageSync("isBoss") || false;

    if (this.isinvite) {
      //邀请详情
      // wx.hideTabBar({});
      this.getInvites();
    } else {
      this.getCompanyMsg();
    }
  },
  async onPullDownRefresh() {
    // to doing..
    // 下拉刷新
    wx.showNavigationBarLoading();
    if (this.isinvite) {
      //邀请详情
      // wx.hideTabBar({});
      this.getInvites();
    } else {
      this.getCompanyMsg();
      this.isChange = !this.isChange;
    }
    /*        this.nodata = false ;
              this.member_lists = [] ;
              this.page = 1 ;
              this.isLoading = false ;
              this.searchkey = '' ;
              this.focusTag = false ;*/
    wx.stopPullDownRefresh();
    setTimeout(function() {
      wx.hideNavigationBarLoading();
    }, 300);
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "企业"
    });
    let v = this;
    v.isBoss = wx.getStorageSync("isBoss") || false;
    v.$nextTick(function() {
      v.getTopHeight();
    });
  },
  methods: {
    ...mapActions(["setCurrentCompany"]),
    getCompanyMsg() {
      //获取企业信息
      wx.showLoading();
      let v = this;

      WXAJAX.POST({ ignore: true }, "", "/company/getCompany")
        .then((data, code) => {
          wx.hideLoading();
          if (data) {
            v.companyTop = data;
            v.hasenterprise = true;
            wx.setStorageSync("COMPANYID", data.companyId);
            wx.setStorageSync("USERNAME", data.name);
            this.setCurrentCompany(data);
          } else if (code == 209) {
          } else {
            this.companyTop = {};
            v.hasenterprise = false;
          }
        })
        .catch(err => {
          v.companyTop = {};
          console.log(err);
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
          v.hasenterprise = false;
        });
    },
    getInvites() {
      wx.showLoading();
      let v = this;

      WXAJAX.POST(
        {
          companyId: 1
        },
        "",
        "/company/invitation"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            this.companyTop = data;
          }
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
    },
    page_tap: utils.throttle(function(url, query) {
      if (
        [
          "companyPack/productControl",
          "companyPack/dynamicControl",
          "webSiteControl",
          "companyPack/appointmentManage"
        ].includes(url) &&
        !wx.getStorageSync("isBoss")
      ) {
        wx.showToast({
          title: "只有BOSS才能编辑",
          duration: 2000,
          icon: "none"
        });
        return;
      }

      if (url != "editEnterprise" && !this.hasenterprise) {
        return;
      }
      query = query || "";
      wx.navigateTo({ url: "../" + url + "/main" + query });
    }),
    menu_tap(id) {
      //点击menu
      console.log(id);
      this.menu_id = id;
    },
    getTopHeight() {
      //获取top的高度
      let v = this;
      wx.createSelectorQuery()
        .select(".enterprise_top")
        .boundingClientRect(function(rect) {
          v.topHeight = rect.height + "px";
        })
        .exec();
    }
  }
};
</script>

<style>
.enterprise_menu {
  transition: 0.2s;
}

.enterprise_menu.top {
  position: fixed;
  top: 0;
}

.enterprise_top.hide {
  height: 0;
}

@keyframes around {
  from {
    margin-left: 100%;
  }
  to {
    /* var接受传入的变量 */
    margin-left: var(--marqueeWidth--);
  }
}

.marquee_container {
  /*background-color: #fe4655;*/
  height: 50upx;
  line-height: 44upx;
  position: relative;
  width: 200px;
  margin-top: 0;
  overflow: hidden;
}
.marquee_container:hover {
  /* 不起作用 */
  animation-play-state: paused;
}
.marquee_text {
  color: #a8a8a8;
  font-size: 24upx;
  display: inline-block;
  white-space: nowrap;
  animation-name: around;
  animation-duration: 10s; /*过渡时间*/
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
</style>
