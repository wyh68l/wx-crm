<template>
  <view class="h44 bgfff disflex wrap posr">
    <view class="header disflex h44 mt6"
          style="width: 100%">
      <view class="ml16 fs18 fbold textl"
            style="width: 80%;">猿销帮</view>
      <view class="mr16 textr"
            v-if="!isEdit"
            @click="setDefaultCard"
            style="width: 20%;color: #00a0e9FF;">设置</view>
    </view>
    <view class="content mt11 bgfff w100p">
        <view v-if="!isEdit">
            <view class="ml16 h44 fs16 ca8 lh44">当前默认名片</view>
            <div class="content">
                <CardItem :isEdit="isEdit" :info="defaultCard" />
            </div>
        </view>
        <view  v-else>
            <view class="ml16 h44 fs16 ca8 lh44">选择默认名片</view>
            <div class="content">
                <CardItem @checkedItem="checkedItem"
                          v-for="(item, index) of cardList"
                          :key="index"
                          :isEdit="isEdit"
                          :info="item" />
            </div>
        </view>
    </view>
    <div v-if="isEdit"
         class="save-button bgblue h49 lh49 textc cfff"
         @click="submitData">保存</div>
  </view>

</template>

<script>
import WXAJAX from '@/utils/request';
import CardItem from './components/CardItem'
export default {
  components: { CardItem },
  data () {
    return {
      defaultCard: {},
      cardList: [],
      isEdit: false
    }
  },
  onUnload () {
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: "默认名片"
    });
    this.getDefaultCard();
  },
  onShow () {
  },
  methods: {
    //获取默认名片
    getDefaultCard () {
      WXAJAX.POST({ ignore: true }, '', '/businessCard/findDefaultBusinessCards').then((data, code) => {
          if (data && data.length > 0) {
              this.cardList = data;
              this.defaultCard = this.cardList[0];
          }
      });
    },
    //获取所有名片
    getAllCards () {
      WXAJAX.POST({ ignore: true }, '', '/businessCard/getList').then((data, code) => {
        if (data && data.length > 0) {
          data.forEach(item => {
              const checked = item.cardId === this.defaultCard.cardId;
            this.$set(item, 'checked', checked);
          });
          this.cardList = data;
        }
      });
    },
    //通过用户点击的行为,知道点击选择的是哪个名片,可以获取到id,通过这个id可以做出选中效果,取消其他名片的选中效果
    checkedItem (id) {
      this.cardList.forEach(item => {
        if (item.cardId === id) {
          item.checked = true;
          this.defaultCard = item;
        } else {
          item.checked = false;
        }
      })
    },
    //设置默认名片进入编辑状态
    setDefaultCard () {
      this.isEdit = true;
        this.getAllCards();
    },
    submitData () {
        if(!this.defaultCard || !this.defaultCard.cardId ){
            wx.showToast({
                title: '默认名片没有设置',
                icon: 'warn',
                duration: 1000
            });
            return;
        }
        WXAJAX.POST({ cardId: this.defaultCard.cardId }, '', '/businessCard/setDefaultBusinessCard').then(res => {
            wx.showToast({
                title: '设置默认名片成功',
                icon: 'success',
                duration: 1000
            });
            this.isEdit = false;
        });

    }
  }
}
</script>
<style>
.clearBoth {
  clear: both;
}

.floatl {
  float: left;
}
.fblod {
  font-weight: bold;
}
.im-item {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
.wx-switch-input {
  background: #00a0e9 !important;
  border: none;
}
.wx-switch-input::after {
  border: none !important;
}
.save-button {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
