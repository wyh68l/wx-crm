<template>
  <div class="msg">
    <div class="outer">
      <div class="disflex align-cen fs14">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/btn_notice@2x.png"
             class="w20 h20">
        <span class="ml7 mr10">微信服务通知剩余推送次数</span>
        <span class="cblue">{{num}}</span>
      </div>
      <div class="disflex align-cen">
        <span class="mr23 fs14"
              @click="isShow=true">清空</span>
        <label for="add"
               class="h20">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/btn_add@2x.png"
               class="w20 h20">
        </label>
        <form report-submit
              @submit="submitOrder"
              :report-submit="true">
          <button form-type="submit"
                  id="add"
                  style="display: none"></button>
        </form>
      </div>
      <template v-if="isShow">
        <DialogBox :dialog_title="'提示'"
                   @btn_tap="nocard_btn_tap"
                   dialog_ph="清空次数将无法再接收到微信服务通知，您确认要清空吗？"
                   type="hint2"
                   left="取消"
                   right="确定"></DialogBox>
      </template>
    </div>
  </div>
</template>

<script>
import WXAJAX from '@/utils/request'
import DialogBox from '@/components/dialogBox' // 对话框
import HandleLogin from '@/utils/handleLogin' // 对话框

export default {
  name: "AddNoticeNum",
  components: { DialogBox },
  data () {
    return {
      num: 0,
      isShow: false,
    }
  },
  mounted () {
    this.getTotalNum();
  },
  methods: {
    //获取推送总数
    getTotalNum () {
      // 登录成功后才获取数据
      HandleLogin.isLogin(() => {
        WXAJAX.POST({
          ignore: true
        }, '', '/businessCard/formIdCount').then(res => {
          this.num = res;
        });
      });
    },
    nocard_btn_tap (str) {
      if (str == 'save') {
        this.clearNum();
      }
      this.isShow = false;
    },
    clearNum () {
      HandleLogin.isLogin(() => {
        WXAJAX.POST({
          ignore: true
        }, '', '/businessCard/delFormId').then(res => {
          this.num = 0;
        });
      });
    },
    submitOrder (e) {
      if ('the formId is a mock one' == e.mp.detail.formId) return;
      HandleLogin.isLogin(() => {
        WXAJAX.POST({
          formId: e.mp.detail.formId,
          type: 2,
        }, '', '/customer/addFormId').then(res => {
          this.num = res;
        });
      })

    }
  }
}
</script>

<style scoped>
.msg {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outer {
  width: 630upx;
  height: 100upx;
  border-radius: 20upx;
  box-shadow: 0 6upx 10upx rgba(81, 205, 203, 0.12);
  padding: 0 30upx;
  /* margin: 0 auto; */
  font-size: 28upx;
  color: rgba(162, 160, 160, 1);
  background: white;
  display: flex;
  justify-content: space-between;
  /* background: white;
    padding: 24upx 30upx;
    font-size: 28upx;
    color:rgba(162,160,160,1);
    display: flex;
    justify-content: space-between; */
}
.has-num {
  color: rgba(244, 141, 54, 1);
}
</style>
