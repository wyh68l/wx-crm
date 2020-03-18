<template>
  <div class="share-records pl15 pr15 pb15">
    <item v-for="(info, index) of list" :key="index" :info="info" />
  </div>
</template>
<script>
import item from "./components/shareRecordItem";
import WXAJAX from "@/utils/request";

export default {
  components: {
    item
  },
  data() {
    return {
      page: 1,
      isLoading: false, //数据加载中
      list: []
    };
  },
  mounted() {
    this.getSharedRecords();
  },
  async onPullDownRefresh() {
    this.page = 1;
    this.isLoading = false;
    await this.getSharedRecords();
    wx.stopPullDownRefresh();
  },
  async onReachBottom() {
    if (this.isLoading) {
      return;
    }
    this.page++;
    await this.getSharedRecords();
  },
  methods: {
    //
    async getSharedRecords() {
      if (this.isLoading) return;
      this.isLoading = true;
      wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          { ignore: true, pageNum: this.page },
          "",
          "/company/dynamicShardRecords"
        );
        if (data) {
          if (this.page === 1) {
            this.list = data;
          } else {
            this.list = [...this.list, ...data];
          }
        }
        this.isLoading = false;
        wx.hideLoading();
      } catch (error) {
        this.isLoading = false;
        wx.hideLoading();
      }
    }
  }
};
</script>
<style scoped></style>
