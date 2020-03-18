<template>
  <div class="disflex fix_bottom bte8"
       v-if="!loaded">
    <!--  -->
    <div class="disflex flex1 bgfff pt8 textc">
      <div class="w33p"
           @click="makePhone">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_gray.png"
             alt=""
             class="w20 h20" />
        <p class="ca8 fs12 textc mt-4">电话</p>
      </div>
      <div class="w33p"
           @click="addWx">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/wx.png"
             alt=""
             class="w20 h20" />
        <p class="ca8 fs12 textc mt-4">微信</p>
      </div>
    </div>
    <div class="w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40">
      <span class="flex1 bg_line_orange"
            :class="cardMsg.analysisModel.isMyCustomer <= 0 ? 'bra_left_20' : 'bradius20' "
            @click="toIM">在线沟通</span>
      <span class="flex1 bg_line_blue bra_right_20"
            v-if="cardMsg.analysisModel.isMyCustomer <= 0 "
            @click="page_turn('clientAdd' , '?type=userAdd&cardId='+(cardMsg.analysisModel.cardId || '')+'&userId='+(cardMsg.analysisModel.userId || ''))">存为客户</span>
    </div>
  </div>
  <cover-view class="disflex fix_bottom bte8"
              v-else>
    <cover-view class="disflex flex1 bgfff pt8 textc">
      <cover-view class="w33p textc"
                  @click="makePhone">
        <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101137.png"
                     alt=""
                     class=" disinblock make-phone" />
      </cover-view>
      <cover-view class="w33p textc"
                  @click="addWx">
        <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101149.png"
                     alt=""
                     class=" disinblock add-wx" />
      </cover-view>
    </cover-view>
    <cover-view class="w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40">
      <template v-if="cardMsg.analysisModel.isMyCustomer <= 0">
        <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101156.png"
                     alt=""
                     class=" disinblock concat-client"
                     @click="toIM" />
        <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101201.png"
                     alt=""
                     class=" disinblock save-client"
                     @click="page_turn('clientAdd' , '?type=userAdd&cardId='+(cardMsg.analysisModel.cardId || '')+'&userId='+(cardMsg.analysisModel.userId || ''))" />
      </template>
      <template v-else>
        <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101323.png"
                     alt=""
                     class=" disinblock concat-client-full"
                     @click="toIM" />
      </template>
    </cover-view>
  </cover-view>

</template>
<script>

import util from '@/utils/index'
import { mapGetters } from 'vuex';

export default {
  props: {
    cardMsg: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['currentClient']),
  },
  data () {
    return {
      loaded: false,
    }
  },
  mounted () {
    this.timer = setTimeout(() => {
      this.loaded = true;
    }, 0.1 * 1000);
  },
  methods: {
    makePhone () {//拨打电话
      util.MakePhone(this.cardMsg.analysisModel.phone || '');
    },
    toIM () {
      const { cardId = '', logo = '', userId = '', name = '' } = this.currentClient;
      const { phone = '', personalWx = '' } = this.cardMsg.analysisModel;
      wx.navigateTo({
        url: '/pages/IM/main?userId=' + userId + '&logo=' + logo + '&type=2&cardId=' + cardId + '&name=' + name + '&wxCode=' + personalWx + '&phone=' + phone
      });
    },
    page_turn (url, query) {
      query = query || '';
      wx.setStorageSync('isClearClientInfo', true);
      wx.navigateTo({ url: '../' + url + '/main' + query });
    },
    addWx () {//添加微信
      const { personalWx } = this.cardMsg.analysisModel;

      if (!personalWx) {
        wx.showToast({
          title: '还没有添加微信呢！',
          duration: 2000,
          icon: 'none'
        });
      }

      let v = this;
      wx.setClipboardData({
        data: personalWx,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
              v.isShowCourse = true;
            }
          })
        }
      })
    },
  }
}
</script>
<style scoped>
.concat-client-full {
  width: 206px;
  height: 78upx;
}
.make-phone,
.add-wx {
  width: 46upx;
  height: 66upx;
}

.concat-client,
.save-client {
  width: 206upx;
  height: 78upx;
}
</style>
