<template>
  <div class="set-box">
    <label class="fbold fs16">常用语内容</label>
    <div class="pb10 pt10 lh22">
            <textarea v-model="text"
                      v-if="showTextarea"
                      @blur="showTextarea=false"
                      :focus="showTextarea"
                      :maxlength="maxLength"
                      class="textarea"
                      placeholder="请输入常用语内容">
                </textarea>
      <div class="textarea"
           :class="{'no-value': !text}"
           @click="showTextarea=true"
           v-else
      >
        {{text || "请输入常用语内容"}}
      </div>
    </div>
    <div class="ce8 fs14 textr">{{text.length}}/{{maxLength}}</div>

    <BottomButtonSmall :text="'保存'" @btn_tap="save"></BottomButtonSmall>
  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import WXAJAX from '@/utils/request';

  export default {
    name: "addPhrases",
    components: { BottomButtonSmall },
    data(){
      return {
        text: '',
        showTextarea: false,
        maxLength: 50,
        type: '',
        info: {},
      };
    },
    onUnload(){
      this.info = {};
      wx.setStorageSync('phrasesInfo', {});
    },
    mounted(){
      this.type = this.$root.$mp.query.type;
      this.info = wx.getStorageSync('phrasesInfo') || {};
      this.text = this.info.text || '';
    },
    methods: {
      save(){
        if (!this.text.trim()){
          wx.showToast({
            title: `常用语不能为空！`,
            icon: 'none',
            duration: 2000
          });
          return
        }

        wx.showLoading({mask: true});

        WXAJAX.POST({
          commonId: this.info.commonId,
          text: this.text,
          type: this.type,
        }, '', '/businessCard/insertUserCommonList').then(res=>{
          wx.showToast({
            title: `${this.info.commonId ? '修改' : '添加'}成功`,
            icon: 'success',
            duration: 1000
          });
          setTimeout(()=>{
            wx.navigateBack();
          }, 1000)
        }).catch((err)=>{
          wx.hideLoading();

          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
      },
    }
  }
</script>

<style scoped>
  .set-box{
    background: white;
    margin-top: 20upx;
    padding: 30upx;
  }

  .textarea{
    box-sizing: border-box;
    width: 100%;
    font-size: 28upx;
    color: #383838;
    line-height: 1.5;
    min-height: 150px;
  }

  .no-value{
    color: #a8a8a8;
  }
</style>
