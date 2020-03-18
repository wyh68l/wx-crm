<template>
  <div class="share-rank bgfff">
    <Title class="today"
           title="分享用户TOP10"
           subtitle="DATE" />
    <div class="rank-list tables mt30 pt30">
      <div class="title cblue tr fs12">
        <span class="fblod">排名</span>
        <span>用户</span>
        <span class="one-line">昵称</span>
        <span>分享次数</span>
        <span>查看次数</span>
      </div>
      <div class="tr fs12 ca8"
           v-for="(item, index) of info"
           :key="index">
        <span>{{index+1}}</span>
        <span class="disflex align-cen jscen">
          <img :src="item.photo||'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
               class="w30 h30"
               alt />
        </span>
        <span>{{item.nickName}}</span>
        <span>{{item.shareCount}}</span>
        <span>{{item.shareOpenCount}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import Title from "@/components/TiTleSlot";

export default {
  components: {
    Title
  },
  props: {
    info: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {};
  }
};
</script>
<style scoped>
.share-rank {
  padding: 40upx 32upx 20upx 32upx;
}
.tables .tr {
  height: 78upx;
  line-height: 78upx;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.tables .tr:nth-of-type(2n) {
  background-color: #fff;
}
.tables .tr:nth-of-type(2n + 1) {
  background-color: #f5f5f6;
}
.tables .title {
  background-color: #edfafa !important;
}
.tables .tr span:nth-of-type(n + 1) {
  width: 20%;
  text-align: center;
  line-height: 78upx;
}
.tables .tr span:nth-of-type(1) {
  color: #00a0e9;
  width: 19%;
}
.tables .title span:nth-of-type(1) {
  font-weight: bold;
  color: #00a0e9;
}
.tables .tr span:nth-of-type(3) {
  /* width: 120upx; */
  width: 21%;
  display: block; /*内联对象需加*/
  word-break: keep-all; /* 不换行 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
  text-overflow: ellipsis;
}
</style>
