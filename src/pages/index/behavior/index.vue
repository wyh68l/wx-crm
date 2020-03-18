<template>
  <div class="behavior">
    <TodayGuid @selectDate="selectDate"
               :info="info.shareUserAndCountStatistics" />
    <SharePercentage :shareTypeData="info.shareTypeStatistics" />
    <ShareUser :info="info" />
    <ShareRank :info="ranks" />
  </div>
</template>
<script>
import TodayGuid from "./TodayGuid";
import SharePercentage from "./SharePercentage";
import ShareUser from "./ShareUser";
import ShareRank from "./ShareRank";
import WXAJAX from "@/utils/request";

export default {
  components: {
    TodayGuid,
    SharePercentage,
    ShareUser,
    ShareRank
  },
  data () {
    return {
      timeType: 0, //统计类型 0:今日;1:昨日;2:7天;3:30天
      info: {
        shareUserAndCountStatistics: {},
        shareTypeStatistics: [],//分享类型（集合，根据类型分组的） （1:名片，2:商品，3:预约，4:文章）
        shareGenderStatistics: []
      },
      ranks: [], //分享排名前10
      gender: {  //性别
        man: 0,
        woman: 0,
        notknow: 0
      },
    };
  },
  mounted () {
    this.getBehaviorDatas();
    this.getShareTop10();
  },
  methods: {
    // 获取分享排行topN
    async getShareTop10 () {
      wx.hideLoading();
      try {
        wx.showLoading();
        let data = await WXAJAX.POST(
          { ignore: true, timeType: this.timeType, topN: 10 },
          "",
          "/shareRecord/topN"
        );
        this.ranks = data;
      } catch (error) {
        console.log("error", error);
      }
      wx.hideLoading();
    },
    // 获取行为数据
    async getBehaviorDatas () {
      wx.hideLoading();
      try {
        wx.showLoading();
        let data = await WXAJAX.POST(
          { ignore: true, timeType: this.timeType },
          "",
          "/shareRecord/situationStatistics"
        );
        this.info = data;
      } catch (error) {
        console.log("error", error);
      }
      wx.hideLoading();
    },

    // 选择时间
    selectDate (day) {
      this.timeType = day;
      this.getBehaviorDatas();
      this.getShareTop10();
    }
  }
};
</script>
<style scoped>
.behavior {
  transform: translateY(-20upx);
}
</style>
