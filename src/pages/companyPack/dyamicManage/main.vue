<template>
  <div class="dyamic-manage mt10">
    <div class="title fs18 pl15 pr15 pt10 pb10" @click="dynamic">
      <span>动态管理</span>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190514143457.png"
        alt=""
        class="left-img"
      />
    </div>
    <div class="line"></div>
    <div class="title fs18 pl15 pr15 pt10 pb10" @click="articles">
      <span>获客文章</span>
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190514143457.png"
        alt=""
        class="left-img"
      />
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  methods: {
    articles() {
      wx.navigateTo({
        url: "../shareRecord/main"
      });
    },
    dynamic() {
      wx.navigateTo({ url: "../dynamicControl/main" });
    }
  }
};
</script>
<style scoped>
.dyamic-manage {
  background: #f8f8f8;
  height: 100%;
}
.title {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-img {
  width: 10upx;
  height: 20upx;
}
</style>
