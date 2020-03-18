<template>
  <div>
    <div class="img-box">
      <div class="img-icon" @click="selectImg">
        <img
          :src="imgUrl"
          style="width: 40upx;height: 40upx;margin-top: 60upx"
          v-if="imgUrl === 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon_add.png'"
        />
        <p class="img-title" v-if="imgUrl === 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon_add.png'">
          选择封面
        </p>
        <img
          :src="imgUrl"
          style="max-width: 205upx;max-height: 205upx;"
          v-else
        />
      </div>
    </div>
    <h4 class="img-h4">来源</h4>
    <Inputs
      placeholder="请输入文章来源"
      :value="inputValue"
      @change="change"
    ></Inputs>
    <BottomButtonSmall :text="'发布'" @btn_tap="save" />
  </div>
</template>

<script>
import BottomButtonSmall from "@/components/bottom_button_small";
import Inputs from "./components/Inputs";
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import { mapGetters, mapActions } from "vuex";
export default {
  components: { BottomButtonSmall, Inputs },
  data() {
    return {
      inputValue: "",
      imgUrl: "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon_add.png",

      saveType: 1
    };
  },
  computed: {
    ...mapGetters(["article"])
  },
  onShow() {
    this.saveType = this.$root.$mp.query.saveType || 1;
  },
  methods: {
    // 发布
    async save() {
      if (this.inputValue === "") {
        uni.showToast({
          title: "请输入文章来源",
          icon: "none"
        });
        return;
      }
      if (this.imgUrl === 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon_add.png') {
        uni.showToast({
          title: "请上传文章封面图片",
          icon: "none"
        });
        return;
      }
      // saveType: 1:文章 2:动态 3:转载
      // isDrafts: 保存到草稿箱则isDrafts设置为1，发布设置为0
      let data = {
        companyId: wx.getStorageSync("COMPANYID"),
        type: this.saveType,
        photos: this.imgUrl,
        details: this.article.details,
        title: this.article.title,
        isDrafts: 0
      };
      uni.showLoading();
      if (this.saveType == 1) {
        data.author = this.inputValue;
        data.title = this.article.title;
        data.originAuthor = this.inputValue;
      } else if (this.saveType == 3) {
        data.originAuthor = this.inputValue;
      }

      WXAJAX.POST(data, "", "/company/addDynamicInfo")
        .then(data => {
          uni.hideLoading();
          uni.showToast({
            title: "保存成功！"
          });
          uni.navigateTo({
            url: "../companyPack/dynamicControl/main"
          });
        })
        .catch(err => {
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        });
    },
    change(value) {
      this.inputValue = value;
    },
    // 选择图片
    async selectImg() {
      let path = await util.chooseImage("file", 1);
      this.imgUrl = await this.uploadImg(path[0]);
    },
    uploadImg(path) {
      wx.showLoading({
        mask: true,
        title: "上传中"
      });
      return new Promise(resolve => {
        WXAJAX.UploadImage(path)
          .then(data => {
            wx.hideLoading();
            console.log(data);
            data = JSON.parse(data);
            if (data.code == "200") {
              resolve(WXAJAX.imgBackUrl + data.data + ".primary.png");
            } else {
              wx.showToast({
                title: "网络异常",
                duration: 2000,
                icon: "none"
              });
            }
          })
          .catch(() => {
            wx.hideLoading();
          })
          .then(url => url);
      });
    }
  }
};
</script>
<style>
.img-box {
  margin-top: 60upx;
  text-align: center;
}
.img-icon {
  width: 205upx;
  height: 205upx;
  border: 2upx dashed #e8e8e8;
  display: inline-block;
  border-radius: 10upx;
}
.img-title {
  font-size: 24upx;
  font-weight: 400;
  color: rgba(81, 205, 203, 1);
}
.img-h4 {
  font-size: 28upx;
  font-weight: 400;
  text-align: center;
  margin-top: 60upx;
  color: rgba(56, 56, 56, 1);
}
page {
  background: white;
}
</style>
