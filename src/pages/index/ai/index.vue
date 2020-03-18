<template>
  <div class="ai">
    <TodayOverview />
    <ShowDataTab :timeDataList="timeDataList"
                 :sceneDataList="sceneDataList"
                 :total="total"
                 @selectData="selectData"
                 @changeBusinessType="changeBusinessType" />
    <VisitRank @clickVistor="clickVistor"
               @changeSeeType="changeSeeType"
               :visitorList="visitorList" />
  </div>
</template>
<script>
import TodayOverview from "./TodayOverview";
import ShowDataTab from "./ShowDataTab";
import VisitRank from "./VisitRank";
import WXAJAX from "@/utils/request";

export default {
  components: { TodayOverview, ShowDataTab, VisitRank },
  async mounted () {
    this.getVisitRank(false, this.page);
    await this.getTimeStatistics();
    await this.getSceneStistics();
  },
  data () {
    return {
      isLoading: false, //是否在加载
      page: 1,
      visitorList: [], //访问排名的人
      aiTimeType: 0, //统计日期类型.0:今日;1:昨日;2:7天;3:30天
      businessType: 1, //业务类型1:名片;2:产品;3：官网;4:查看文章;5:预约
      closingDayType: 0, //统计日期类型.0:今日;1:昨日;2:7天;3:30天
      seeTypeId: "", //业务类型  '': 全部;1:名片;2:产品;3：官网;4:查看文章;5:预约
      timeDataList: [], //折线图数据
      sceneDataList: {
        visitUserCount: {},
        visitNewUserCount: {},
        visitCount: {},
      }, //场景值
      total: 0, //对应场景的总条数
    };
  },
  methods: {
    /**
     *  根据不同的时间获取不同的场景值
     */
    async getTimeStatistics () {
      wx.hideLoading();
      try {
        wx.showLoading();
        let data = await WXAJAX.POST({          ignore: true, timeType: this.aiTimeType,
          businessType: this.businessType        },
          "",
          "/seeRecord/timeStatistics"
        );
        if (data) {
          this.timeDataList = data.cell || [];
          this.total = data.total;
        } else {
          this.total = 0;
          this.timeDataList = [];
        }
      } catch (error) {
        this.total = 0;
        this.timeDataList = [];
        console.log("error", error);
      }
      wx.hideLoading();
    },

    clickVistor (cardId, userId) {
      //选择AI客户
      wx.setStorageSync("AIUserId", userId);
      wx.navigateTo({ url: "../customerAnalysis/main?userId=" + userId });
    },
    //选择seeType类型
    changeSeeType (typeId) {
      this.seeTypeId = typeId;
      this.page = 1;
      wx.showLoading();
      this.visitorList = [];
      this.getVisitRank(false, this.page);
    },
    //切换日期
    selectData (index) {
      this.aiTimeType = index;
      this.page = 1;
      this.getTimeStatistics();
      this.getSceneStistics();
      this.getVisitRank(false, this.page);
    },
    async changeBusinessType (businessType) {
      this.businessType = businessType;
      await this.getTimeStatistics();
    },
    /**
     * 获取访问排行
     * isScrollLower： scrollview滚动到底部 true是 false 没有
     * 父组件在scrollview滚动到底部以后，page默认+1， 调用该方法加载更多数据，
     */
    getVisitRank (isScrollLower, page) {
      if (this.isLoading) return;
      this.isLoading = true;
      if (isScrollLower) {
        this.page++;
        page = this.page;
      }
      WXAJAX.POST(
        {
          pageNum: page,
          pageSize: 10,
          seeType: this.seeTypeId,
          timeType: this.aiTimeType
        },
        "",
        "/seeRecord/getVisitRankingList",
        null,
        "/pages/index/main"
      ).then(
        (data, code) => {
          wx.hideLoading();
          if (data) {
            if (this.page === 1) {
              this.visitorList = data;
            } else {
              this.visitorList = this.visitorList.concat(data);
            }
          } else {
            this.page--;
          }
          this.isLoading = false;
        },
        err => {
          wx.hideLoading();
          this.page--;
          this.isLoading = false;
        }
      );
    },
    async getSceneStistics () {
      wx.hideLoading();
      try {
        wx.showLoading();
        let data = await WXAJAX.POST(
          {
            ignore: true,
            timeType: this.aiTimeType,
            // businessType: this.businessType
          },
          "",
          "/seeRecord/sceneStatistics"
        );
        if (data) {
          this.sceneDataList = data;
        } else {
          this.sceneDataList = {
            visitUserCount: {},
            visitNewUserCount: {},
            visitCount: {},
          };
        }
      } catch (error) {
        console.log("error", error);
        this.sceneDataList = {
          visitUserCount: {},
          visitNewUserCount: {},
          visitCount: {},
        };
      }
      wx.hideLoading();
    }
  }
};
</script>
<style scoped>
.ai {
  transform: translateY(-20upx);
}
</style>