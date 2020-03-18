<template>
  <div class="visit">
    <div class="vistor-item"
         @click="clickVistor">
      <!-- <div class="img" :style="{background:`url(${info.logo}) no-repeat center`}"></div> -->
      <img class="img"
           :src="info.photo||'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
           alt />
      <div class="desc">
        <div>
          <span class="name">{{info.nickName}}</span>
        </div>
        <p class="content">
          <!-- 正在
          <span class="c38">查看</span>
          你的
          <span class="c38">{{typeName}}</span>
          第{{info.num}}次，{{desc}} -->
          总计与你互动<span class="c38">{{info.totalCount}}</span>次,预计成交率达<span class="c38">{{info.rate}}%</span>,尽快把握商机
        </p>
      </div>
      <div class="right">
        <p class="time cblue fbold">NO.{{rank}}</p>
        <img class="wechat"
             @click.stop="toIM"
             src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/message@2x.png"
             alt />
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: {
    info: {
      type: Object,
      required: true,
      default: () => ({})
    },
    rank: {
      type: Number
    }
  },
  data () {
    return {
      // typeName: "",
      // desc: "",
      // head:
      //   "https://static.xiongmaozhanggui.com/cdn/wechat/images/share_icon_newcomer.png"
    };
  },
  methods: {
    ...mapActions(['setCurrentClient']),
    clickVistor () {
      this.setCurrentClient(this.info);
      this.$emit("clickVistor", this.info);
    },
    toIM () {
      const { cardId, logo, userId, name, phone, personalWx } = this.info;
      wx.navigateTo({
        url:
          "../IM/main?userId=" +
          userId +
          "&logo=" +
          logo +
          "&type=2&cardId=" +
          cardId +
          "&name=" +
          name +
          "&wxCode=" +
          personalWx +
          "&phone=" +
          phone
      });
    }
  }
};
</script>
<style scoped>
.visit {
  /* padding: 0 30upx; */
  margin-top: 40upx;
}
.vistor-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* border-bottom: 1upx solid #F5F5F6; */
}
.vistor-item .img {
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  flex-shrink: 0;
  margin-left: 32upx;
}
.vistor-item .desc {
  margin-left: 22upx;
  width: 446upx;
}
.vistor-item .desc .name {
  font-size: 36upx;
  color: #383838;
}
.vistor-item .desc .new-user {
  display: inline-block;
  background-color: #00a0e9;
  border-radius: 6upx;
  color: #fff;
  font-size: 24upx;
  padding: 2upx 10upx;
  margin-left: 14upx;
}
.vistor-item .desc .content {
  font-size: 28upx;
  color: #bcbbbc;
  margin-top: 13upx;
}
.vistor-item .right {
  text-align: right;
  flex-shrink: 0;
  margin-right: 32upx;
}
.vistor-item .right .time {
  font-size: 24upx;
  color: #a8a8a8;
  margin-top: 14upx;
}
.vistor-item .right .wechat {
  width: 32upx;
  height: 32upx;
  margin-top: 30upx;
}
.line {
  width: 100%;
  height: 1upx;
  background-color: #f5f5f6;
  margin-top: 40upx;
}
</style>
