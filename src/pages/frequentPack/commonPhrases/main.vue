<template>
  <div class="common-phrases">
    <div class="tips">提示：最多可添加12条话术</div>
    <div>
      <PhrasesItem v-for="item in lists"
                   :key="item.commonId"
                   :content="item.text"
                   @edit="editPhrases(item)"
                   @del="showDelTip(item)"
                   @moveUp="movePhrases(item, 1)"
                   @moveDown="movePhrases(item, 2)"
      >
      </PhrasesItem>
    </div>
    <BottomButtonSmall :text="'新增常用语'" @btn_tap="addNew"></BottomButtonSmall>


    <div v-show="isShowTips">
      <DialogBox :dialog_title="'提示'" @btn_tap="btn_tap" dialog_ph="确定要删除这条常用语吗？"
                 :type="'hint2'"
                 :left="'取消'"
                 :right="'确定'"
      ></DialogBox>
    </div>
  </div>
</template>

<script>
  import WXAJAX from '@/utils/request';
  import PhrasesItem from '@/components/PhrasesItem'
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框

  export default {
    components: { PhrasesItem, BottomButtonSmall, DialogBox },
    data () {
      return {
        type: '',
        lists: [],
        isShowTips: false,
        current: {},
      }
    },
    onUnload(){
      this.lists = [];
    },
    async onPullDownRefresh() {
      await this.getPhrasesList();

      wx.stopPullDownRefresh();
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "常用语管理"
      });

    },
    onShow(){
      this.type = this.$root.$mp.query.type;
      this.getPhrasesList();
    },
    methods: {
      editPhrases(info){
        wx.setStorageSync('phrasesInfo', info);
        wx.navigateTo({url: `/pages/frequentPack/addPhrases/main?type=${this.type}`});
      },
      // 添加新常用语
      addNew(){
        if (this.lists.length >= 12) {
          wx.showToast({
            title: '最多只能设置12条常用语！',
            icon: 'success',
            duration: 2000
          });
          return;
        }

        wx.navigateTo({url: `/pages/frequentPack/addPhrases/main?type=${this.type}`});
      },
      showDelTip(info){
        this.current = info;
        this.isShowTips = true;
      },
      delPhrases(){
        wx.showLoading({mask:true});

        WXAJAX.POST({
          type:this.type,
          commonId: this.current.commonId,
        }, '', '/businessCard/delUserCommonList').then(res=>{
          this.getPhrasesList();
        }).catch((err)=>{
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      },
      movePhrases(info, moveType){
        wx.showLoading({mask:true});

        WXAJAX.POST({
          type:this.type,
          moveType: moveType ,
          commonId: info.commonId,
        }, '', '/businessCard/moveUserCommon').then(res=>{
          this.getPhrasesList();
        }).catch((err)=>{
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          });
        });
      },
      // 获取常用语列表
      getPhrasesList(){
        wx.showLoading({mask:true});
        return WXAJAX.POST({
          type: this.type,
        }, '', '/businessCard/selectUserCommonList').then(res=>{
          this.lists = res || [];
          wx.hideLoading();
        }).catch(()=>{
          wx.hideLoading();
        });
      },
      btn_tap(methods){
        this.isShowTips = false;

        if (methods === 'save') {
          this.delPhrases();
        }
      }
    }
  }
</script>
<style>
  .tips{
    text-align: center;
    font-size: 24upx;
    line-height: 1;
    color: #A8A8A8;
    padding: 20upx 0;
  }
  .common-phrases{
    padding: 0 30upx 100upx;
  }
</style>
