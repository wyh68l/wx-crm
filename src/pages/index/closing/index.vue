<template>
  <div class="closing-ratio">
    <div class="select-time bgfff">
      <DaysSwitch @select="select" />
    </div>

    <ShopRatio :info="visitStatistics" />
    <ShopRank :dataList="top5DataList" />
    <ClosingRank :info="top10List"
                 @clickVistor="clickVistor" />
  </div>
</template>
<script>
import ShopRatio from './ShopRatio'
import ShopRank from './ShopRank'
import ClosingRank from './ClosingRank'
import DaysSwitch from '@/pages/index/components/DaysSwitch';
import WXAJAX from '@/utils/request'

export default {
  components: {
    ShopRatio,
    ShopRank,
    ClosingRank,
    DaysSwitch,
  },
  data () {
    return {
      timeType: 0,
      // userId: wx.setStorageSync("AIUserId", userId);
      top10List: [],  //成交率最高用户10
      top5DataList: [],  //访问商品排名前5
      visitStatistics: {
        visitCount: 0,
        delCount: 0,
        sumPrices: 0
      }
    }
  },
  mounted () {
    this.getvisitMallStatistics();
    this.getDealRateTopN();
    this.getTop5Data();
  },
  methods: {
    select (index) {
      this.timeType = index;
      this.getDealRateTopN();
      this.getvisitMallStatistics();
      this.getTop5Data();
    },
    clickVistor (cardId, userId) {
      //选择AI客户
      wx.setStorageSync("AIUserId", userId);
      wx.navigateTo({ url: "../customerAnalysis/main?userId=" + userId });
    },
    //获取预计成交率最高客户top10
    async getDealRateTopN (timeType) {
      wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          { topN: 10, timeType: this.timeType },
          "",
          "/seeRecord/dealRateTopN"
        );
        if (data) {
          this.top10List = data;
        } else {
          this.top10List = [];
        }
      } catch (error) {
        this.top10List = [];
      }
      wx.hideLoading();
    },
    getvisitMallStatistics () {
      WXAJAX.POST({
        timeType: this.timeType
      }, '', '/seeRecord/visitMallStatistics').then((data) => {
        if (data) {
          this.visitStatistics = data;
        } else {
          this.visitStatistics = {
            visitCount: 0,
            delCount: 0,
            sumPrices: 0
          }
        }
      }).catch((err) => {
        this.visitStatistics = {
          visitCount: 0,
          delCount: 0,
          sumPrices: 0
        }
      });
    },
    async getTop5Data () {
      wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          { topN: 5, timeType: this.timeType },
          "",
          "/seeRecord/getVisitGoodsTopN"
        );
        if (data) {
          this.top5DataList = data;
        }
      } catch (error) {
        this.top5DataList = [];
        this.showMore = false;
      }
      wx.hideLoading();
    }
  }
}
</script>
<style scoped>
.closing-ratio {
  transform: translateY(-20upx);
}
.select-time {
  border-radius: 20upx 20upx 0 0;
  /* height: 162upx; */
  padding-top: 110upx;
}
</style>