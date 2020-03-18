<template>
  <div>
    <Inputs
      placeholder="请粘贴微信公众号文章链接"
      :value="inputValue"
      @change="change"
    ></Inputs>
    <button class="public-article-btn" @click="release">获取文章</button>
    <div class="public-article-imgs">
      <div class="imgs-title">如何获取公众号文章链接</div>
      <div class="imgs-desc">
        1.打开准备转发的公众号文章，点击屏幕右上角[...]
      </div>
      <div class="text-center">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/img_share.png"
          style="width:400upx;height: 400upx;margin-top: 20upx;"
        />
      </div>
      <div class="imgs-desc">2.在弹出的菜单选择[ 复制链接 ]</div>
      <div class="text-center">
        <img
          src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/img_share2.png"
          style="width:400upx;height: 400upx;margin-top: 20upx;"
        />
      </div>
      <div class="imgs-desc">
        3.打开【超级CRM】小程序，即可自动识别文章编辑推广
      </div>
    </div>
  </div>
</template>

<script>
import Inputs from "./components/Inputs";
import { mapGetters, mapActions } from "vuex";
import WXAJAX from "@/utils/request";
export default {
  components: { Inputs },
  data() {
    return {
      inputValue: ""
    };
  },
  methods: {
    ...mapActions(["setArticle"]),
    change(value) {
      this.inputValue = value;
    },
    // 发布文章
    async release() {
      if (!this.inputValue) return;
      wx.showLoading();
      //上传文章链接到后台,解析出文章标题
      try {
        let res = await WXAJAX.POST(
          {
            details: this.inputValue
          },
          "",
          "/company/resolverDynamic"
        );
        wx.hideLoading();
        let title = res.title;
        // const result = await this.getData(this.inputValue)
        let data = {
          details: this.inputValue,
          title
        };

        this.setArticle(data);
        //上传
        uni.navigateTo({
          url: `./articleImg?saveType=${3}`
        });
      } catch (error) {
        wx.hideLoading();
      }
    },
    getData(url) {
      return new Promise((resolve, reject) => {
        uni.request({
          url,
          success: res => {
            resolve(res.data);
          },
          fail: err => {
            reject(err);
          }
        });
      });
    }
  }
};
</script>

<style>
page {
  background: white;
}
.public-article-btn {
  width: 580upx;
  height: 88upx;
  background: #00a0e9;
  border-radius: 10upx;
  color: #ffffff;
  font-size: 36upx;
  margin-top: 20upx;
}
.public-article-imgs {
  margin-left: 30upx;
  margin-right: 30upx;
  margin-top: 40upx;
  border: 1upx solid #e8e8e8;
  border-radius: 10upx;
  padding: 40upx;
}
.imgs-title {
  font-size: 28upx;
  text-align: center;
  font-weight: bold;
  color: #383838;
}
.imgs-desc {
  font-size: 24upx;
  color: #383838;
  margin-top: 30upx;
}
.text-center {
  text-align: center;
}
</style>
