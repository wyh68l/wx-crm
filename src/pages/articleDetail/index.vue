<template>
  <div style="height: 100vh;overflow-y: auto;" >
    <p class="pt15 fbold fs18 c38 pl15 pr27 bgfff">{{title}}</p>
    <div class="px15 dec">
      <div class="left-dec">
        <span>
          {{companyName}}
        </span>
        <span style="margin-left: 20upx;">
          {{time}}
        </span>
      </div>
      <view class="right-dec"
            @click="addTypeShow = true">
        编辑
      </view>
    </div>
    <div class="bgfff pt20 pl15 pr15 pb10" v-if="webViewSrc == ''">
      <img :src="v"
           alt=""
           v-for="(v,k) in photos"
           mode="widthFix"
           :key="k"
           class="w100p">
      <div v-html="details"></div>
    </div>
    <div class="bgfff pt20 pl15 pr15 pb10 main-box" v-else>
        <button class="more-btn"
                @click="goPage">
          点击查看更多
        </button>
    </div>
    <SelectorOne v-if="addTypeShow"
                 :status="addTypeShow"
                 :allClass="addTypes"
                 @closeModal="addTypeShow = !addTypeShow"
                 @choose_tap="choose_tap"></SelectorOne>
    <!-- 分享弹窗 -->
    <!--     <cover-view class="w100p h100p prod_choose_class borderbox disflex column-reverse"
      :class="isShowShare ? 'show' : '' "
      @click.stop="isShowShare = false">
      <cover-view class="bgfff inner textc lh44">
        <cover-view class="share-box">
           <button style="margin-right: 136.5upx;margin-left: 0;background: #fff;" open-type="share">
            <cover-image class="share-img" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/weixin_share.png"></cover-image>
            <cover-view class="share-title">微信好友</cover-view>
           </button>
           <cover-view style="margin-left: 136.5upx;">
            <cover-image class="share-img" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/weixin_share2.png"></cover-image>
            <cover-view class="share-title">名片海报</cover-view>
           </cover-view>
        </cover-view>
        <cover-view class="share-ornament"></cover-view>
        <cover-view class="fs16 c38 lh44"  @click.stop="isShowShare = false">
            取消
        </cover-view>
      </cover-view>
    </cover-view> -->
    <!-- <BottomButtonSmall :text="'去分享'"  @btn_tap="isShowShare = true" /> -->
  </div>
</template>

<script>
import WXAJAX from '@/utils/request';
import BottomButtonSmall from '@/components/bottom_button_small';
import SelectorOne from "@/components/selectorOne";
import util from '@/utils/index';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const isUrl = path => reg.test(path);

export default {
  components: { BottomButtonSmall, SelectorOne },
  data() {
    return {
      webViewSrc: '',
      dynamicId: 98,

      addTypeShow: false,
      addTypes: [
        { name: "删除", id: "delete" },
        { name: "取消", id: "cancel" }
      ],

      title: '',
      companyName: '',
      time: '',
      details: '',
      photos: [],

      isShowShare: false,

    }
  },
  onShareAppMessage() {
    return {
      title: this.title,
      path: `pages/dynamicDetail/main?dynamicId=${this.dynamicId}`,
      success: () => {
        uni.showToast({
          title: '分享成功',
          icon: 'none'
        })
      }
    }
  },
  async onLoad() {
    this.dynamicId = this.$root.$mp.query.id
    const result = await this.getInits()

    if (isUrl(result[0].details)) {
      this.webViewSrc = result[0].details
    } else {
      this.details = result[0].details
    }

    this.title = result[0].title || ''
    this.companyName = result[0].originAuthor
    this.time = util.getdate(result[0].createTime, 'dateTime')
    this.photos = result[0].photos.split(',')
  },
  methods: {
    getInits() {
      return WXAJAX.POST({
        dynamicId: this.dynamicId,
      }, '', '/company/getDynamicInfo')
    },
    //  删除
    choose_tap(id) {
      if (id === 'cancel') {
        this.addTypeShow = false;
        return;
      }
      wx.showLoading();

      WXAJAX.POST({
        dynamicId: this.dynamicId,
      }, '', '/company/delDynamicInfo').then((data) => {

        wx.hideLoading();
        wx.showToast({
          title: '成功！',
          icon: 'success'
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 600);
      }).catch((err) => {
        console.log(err);
        wx.hideLoading();
      });
    },
    goPage() {
      uni.navigateTo({
        url: `./webView?url=${this.webViewSrc}`
      })
    }
  }
}
</script>
<style>
page {
  background: #fff !important;
}
.dec {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30upx;
  padding-bottom: 40upx;
  border-bottom: 1upx solid #e8e8e8;
}
.left-dec {
  font-size: 24upx;
  color: #a8a8a8;
}
.main-box {
  background-image: url('https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/detail_img.png');
  background-size:cover;
  background-position: center center;
  height: 100vh;
}
.right-dec {
  font-size: 24upx;
  color: rgba(86, 108, 132, 1);
  z-index: 1000;
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  transition: 0.2s;
}
.more-btn {
  margin-top: 80upx;
  width: 240upx;
  border: 1upx solid rgba(81, 203, 205, 1);
  border-radius: 10upx;
  color: rgba(81, 203, 205, 1);
  font-size: 28upx;
}
.prod_choose_class.show {
  bottom: 0;
}

.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.share-box {
  display: flex;
  justify-content: center;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
.share-img {
  width: 100upx;
  height: 100upx;
}
.share-title {
  font-size: 24upx;
  color: #a8a8a8;
  /* line-height:14upx; */
}
.share-ornament {
  background: #f5f5f6;
  height: 10upx;
}
</style>
