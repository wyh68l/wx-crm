<template>
  <div class="today-overview bgfff">
    <!-- <p class="fs20 fbold title">今日概况<span class="fs14 cblue">TODAY</span> </p> -->
    <TitleSlot title="今日概况"
               subtitle="TODAY" />
    <div class="data-pic pt20">
      <div class="item item1 h105 w105 posre">
        <p class="fs12 c38 pl10 mt15 fbold">访问人数</p>
        <p class="fs16 cblue pl10 mt8 fbold">{{info.visitUserCount||0}}</p>
        <p class="fs12 cblue posab yestoday">昨日{{info.yesterdayVisitUserCount||0}}</p>
      </div>
      <div class="item item2 h105 w105 posre">
        <p class="fs12 c38 pl10 mt15 fbold">新用户</p>
        <p class="fs16 cblue pl10 mt8 fbold">{{info.visitNewUserCount||0}}</p>
        <p class="fs12 cblue posab yestoday">昨日{{info.yesterdayVisitNewUserCount||0}}</p>
      </div>
      <div class="item item3 h105 w105 posre">
        <p class="fs12 c38 pl10 mt15 fbold">访问次数</p>
        <p class="fs16 cblue pl10 mt8 fbold">{{info.visitCount||0}}</p>
        <p class="fs12 cblue posab yestoday">昨日{{info.yesterdayVisitCount||0}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import TitleSlot from "@/components/TiTleSlot";
import WXAJAX from "@/utils/request";

export default {
  components: {
    TitleSlot
  },
  data () {
    return {
      info: {
        visitUserCount: 0, //今日访问人数
        visitNewUserCount: 0, //今日新用户访问人数
        visitCount: 0, //今日访问次数
        yesterdayVisitUserCount: 0, //昨日访问人数
        yesterdayVisitNewUserCount: 0, //昨日新用户访问人数
        yesterdayVisitCount: 0 //昨日访问次数
      }
    };
  },
  methods: {
    getTodayOverview () {
      WXAJAX.POST({ ignore: true }, "", "/seeRecord/situationStatistics").then(
        data => {
          if (data) {
            this.info = data;
          }
        },
        error => {
          console.log("error", error);
        }
      );
    }
  },
  mounted () {
    this.getTodayOverview();
  }
};
</script>
<style scoped>
.today-overview {
  height: 294upx;
  border-radius: 20upx 20upx 0 0;
  padding: 110upx 32upx 38upx 32upx;
}
.today-overview .data-pic {
  padding-top: 40upx;
  display: flex;
  justify-content: space-between;
}
.today-overview .data-pic .item {
  box-shadow: 6upx 0 20upx 0upx rgba(81, 205, 203, 0.2);
  border-radius: 10upx;
}
.today-overview .data-pic .item1 {
  background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/bg1%402x.png")
    no-repeat center;
  background-size: 210upx;
}
.today-overview .data-pic .item2 {
  background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/bg2%402x.png")
    no-repeat center;
  background-size: 210upx;
}
.today-overview .data-pic .item3 {
  background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/bg3%402x.png")
    no-repeat center;
  background-size: 210upx;
}
.today-overview .data-pic .item .yestoday {
  bottom: 20upx;
  right: 30upx;
}
.today-overview .title span {
  opacity: 0.3;
  margin-left: 6upx;
}
</style>
