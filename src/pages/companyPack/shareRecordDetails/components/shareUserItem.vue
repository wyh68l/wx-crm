<template>
  <div class="share-user-item bgfff h90 pl15 pr15">
    <div class="share-item"
         @click="clickVistor">
      <!-- <div class="img" :style="{background:`url(${info.logo}) no-repeat center`}"></div> -->
      <img class="img"
           :src="
          info.avatarUrl ||
            'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'
        "
           alt />
      <div class="desc">
        <div>
          <span class="name">{{ info.nickeName }}</span>
        </div>
        <p class="content">
          共浏览
          <span class="c38">{{ info.openCount||1 }}</span>
          次
          <!-- <span class="c38">{{ typeName }}</span>
          第{{ info.num }}次，{{ desc }} -->
        </p>
      </div>
      <div class="right">
        <p class="time">{{ info.lastOpenTime || info.createTime | formatterHourTime }}</p>
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
    }
  },
  filters: {
    formatterHourTime(value) {
      let time = new Date(value);
      return (
        time
          .getHours()
          .toString()
          .padStart(2, "0") +
        ":" +
        time
          .getMinutes()
          .toString()
          .padStart(2, "0")
      );
    }
  },
  methods: {
    ...mapActions(["setCurrentClient"]),
    clickVistor() {
      this.setCurrentClient(this.info);
      this.$emit("clickVistor", this.info);
    },
    toIM() {
      const {
        cardId,
        avatarUrl,
        userId,
        nickeName,
        phone,
        personalWx
      } = this.info;
      wx.navigateTo({
        url:
          "../../IM/main?userId=" +
          userId +
          "&logo=" +
          avatarUrl +
          "&type=2&cardId=" +
          cardId +
          "&name=" +
          nickeName +
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
.share-user-item {
  /* padding: 0 30upx; */
  /* margin-top: 40upx; */
  display: flex;
  align-items: center;
}
.share-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1upx solid #f8f8f8;
}
.share-item .img {
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  flex-shrink: 0;
  margin-left: 32upx;
}
.share-item .desc {
  margin-left: 22upx;
  width: 400upx;
}
.share-item .desc .name {
  font-size: 36upx;
  color: #383838;
}
.share-item .desc .new-user {
  display: inline-block;
  background-color: #00a0e9;
  border-radius: 6upx;
  color: #fff;
  font-size: 24upx;
  padding: 2upx 10upx;
  margin-left: 14upx;
}
.share-item .desc .content {
  font-size: 28upx;
  color: #bcbbbc;
  margin-top: 13upx;
}
.share-item .right {
  text-align: right;
  flex-shrink: 0;
  margin-right: 32upx;
}
.share-item .right .time {
  font-size: 24upx;
  color: #a8a8a8;
  margin-top: 14upx;
}
.share-item .right .wechat {
  width: 32upx;
  height: 32upx;
  margin-top: 30upx;
}
</style>
