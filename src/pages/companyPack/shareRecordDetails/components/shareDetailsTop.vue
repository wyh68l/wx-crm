<template>
  <div class="share-details-top  bgfff">
    <div class="middle flex-base h90 pl15 pr15">
      <img
        :src="info.dynamic.photos"
        alt=""
        mode="aspectFill"
        class="w60 h60 bradius5 mr15"
      />
      <p class="fs16 c38 title fbold lh25">
        {{ info.dynamic.title }}
      </p>
    </div>
    <div class="bottom h40 pl15 pr15">
      <p class="orgin fs12 ca8">
        来源: <span class="pl6">{{ info.dynamic.originAuthor }}</span>
      </p>
      <p class="orgin fs12 ca8">
        最近分享时间 <span class="pl6">{{ info.time }}</span>
      </p>
    </div>
    <div class="details h44">
      <div class="textc">
        <span class="fs12 c38">获客人数</span>
        <span class="fs12 cblue fbold pl3">{{ info.userCount }}</span>
      </div>
      <div class="textc">
        <span class="fs12 c38">浏览次数</span>
        <span class="fs12 cblue fbold pl3">{{ info.viewCount }}</span>
      </div>
      <div class="textc">
        <span class="fs12 c38 ">分享次数</span>
        <span class="fs12 cblue fbold pl3">{{ info.shardCount }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object
    }
  }
};
</script>
<style scoped>
.middle {
  display: flex;
  align-items: flex-start;
  height: 120upx;
  align-items: flex-start;
}
.title {
  width: 538upx;
  word-break: break-all;
  display: -webkit-box; /**对象作为伸缩盒子模型展示**/
  -webkit-box-orient: vertical; /**设置或检索伸缩盒子对象的子元素的排列方式**/
  -webkit-line-clamp: 2; /**显示的行数**/
  overflow: hidden; /**隐藏超出的内容**/
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.details {
  border-top: 1upx solid #f8f8f8;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
