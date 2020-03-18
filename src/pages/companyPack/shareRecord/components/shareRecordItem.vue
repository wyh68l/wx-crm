<template>
  <div class="item bgfff mt10">
    <div class="flex-base h44 pl15 pr15">
      <div class="left flex-base"
           v-if="info.dynamic.type === 2">
        <img class="w16 h16 pr9"
             src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/message@2x.png"
             alt="" />
        <span class="cblue fs12">分享动态</span>
      </div>
      <div class="left flex-base"
           v-else>
        <img class="w16 h16 pr9"
             src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/shard_dynamic_img.png"
             alt="" />
        <span class="fs12 cblue">分享文章</span>
      </div>
      <div class="right fs12 ca8">
        {{ time }}
      </div>
    </div>
    <!-- 中部 -->
    <div class="middle flex-base pl15 pr15">
      <img :src="info.dynamic.photos"
           alt=""
           mode="aspectFill"
           class="w60 h60 bradius5 " />
      <div class="content pl15">
        <p class="fs14 c38 title">
          {{ info.dynamic.title }}
        </p>
        <p class="fs12 ca8">
          来源: <span class="pl6">{{ info.dynamic.originAuthor }}</span>
        </p>
      </div>
    </div>
    <div class="flex-base bottom h44 pl15 pr15">
      <div class="flex-base">
        <p class="fs12 c38">
          获客人数
          <span class="fbold pl6">{{ info.userCount }}</span>
        </p>
        <p class="fs12 c38">
          · 浏览次数
          <span class="fbold pl6">{{ info.viewCount }}</span>
          ·
        </p>
        <p class="fs12 c38">
          分享次数
          <span class="fbold pl6">{{ info.shardCount }}</span>
        </p>
      </div>
      <p class="cblue fbold fs12"
         @click="lookDetails(info.dynamic.dynamicId)">
        查看详情
      </p>
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  props: {
    status: {
      type: String | Number,
      default: "articles"
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      time: ""
    };
  },
  mounted() {
    this.time = this.formatterTime(this.info.dynamic.createTime);
  },
  methods: {
    ...mapMutations(["setShareRecordsInfo"]),
    lookDetails(id) {
      this.setShareRecordsInfo({ ...this.info, time: this.time });
      wx.navigateTo({
        url: "../shareRecordDetails/main?id=" + id
      });
    },
    formatterTime(logTime) {
      // let nowDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      let daySeconds = 1000 * 60 * 60 * 24; //1天
      let date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      let nowTime = date.getTime();
      let logDate = new Date(logTime);
      let logHour = logDate.getHours();
      let logMin = logDate.getMinutes();
      if (logMin < 10) {
        logMin = "0" + logMin;
      }
      if (nowTime - logTime < 0) {
        return `今天  ${logHour}:${logMin}`;
      } else if (nowTime - logTime < daySeconds) {
        return `昨天  ${logHour}:${logMin}`;
      }
      let logYear = logDate.getFullYear();
      if (date.getFullYear() === logYear) {
        return `${logDate.getMonth() +
          1}月${logDate.getDate()}日  ${logHour}:${logMin}`;
      } else {
        return `${logDate.getFullYear()}年${logDate.getMonth() +
          1}月${logDate.getDate()}日  ${logHour}:${logMin}`;
      }
      return "";
    }
  }
};
</script>
<style scoped>
.item {
  /* width: 690upx; */
  border-radius: 20upx;
}
.flex-base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.middle {
  align-items: flex-start;
  height: 170upx;
  align-items: center;
}
.title {
  width: 475upx;
  word-break: break-all;
  display: -webkit-box; /**对象作为伸缩盒子模型展示**/
  -webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
  -webkit-line-clamp: 2; /**显示的行数**/
  overflow: hidden; /**隐藏超出的内容**/
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  height: 120upx;
}
.bottom {
  border-top: 1upx solid #f8f8f8;
}
</style>
