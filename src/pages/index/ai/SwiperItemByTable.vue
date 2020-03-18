<template>
  <!-- <rich-text :nodes="nodes"></rich-text> -->
  <div class="tables">
    <div class="title cblue tr fs12">
      <span class="fblod">场景名称</span>
      <span>名片</span>
      <span>预约</span>
      <span>商城</span>
      <span>动态</span>
      <span>官网</span>
    </div>
    <div class="tr fs12 ca8">
      <span>访问人数</span>
      <span>{{sceneDataList.visitUserCount.cardCount||0}}</span>
      <span>{{sceneDataList.visitUserCount.appointmentCount||0}}</span>
      <span>{{sceneDataList.visitUserCount.shopCount||0}}</span>
      <span>{{sceneDataList.visitUserCount.dynamicCount||0}}</span>
      <span>{{sceneDataList.visitUserCount.webCount||0}}</span>
    </div>
    <div class="tr fs12 ca8">
      <span>新用户数</span>
      <span>{{sceneDataList.visitNewUserCount.cardCount||0}}</span>
      <span>{{sceneDataList.visitNewUserCount.appointmentCount||0}}</span>
      <span>{{sceneDataList.visitNewUserCount.shopCount||0}}</span>
      <span>{{sceneDataList.visitNewUserCount.dynamicCount||0}}</span>
      <span>{{sceneDataList.visitNewUserCount.webCount||0}}</span>
    </div>
    <div class="tr fs12 ca8">
      <span>访问次数</span>
      <span>{{sceneDataList.visitCount.cardCount||0}}</span>
      <span>{{sceneDataList.visitCount.appointmentCount||0}}</span>
      <span>{{sceneDataList.visitCount.shopCount||0}}</span>
      <span>{{sceneDataList.visitCount.dynamicCount||0}}</span>
      <span>{{sceneDataList.visitCount.webCount||0}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    sceneDataList: {
      type: Object
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style scoped>
.tables {
  padding: 0 32upx;
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
  border-radius: 20upx 20upx 0 0;
  background-color: #edfafa !important;
}
.tables .tr span:nth-of-type(n + 1) {
  width: 16%;
  text-align: center;
}
.tables .tr span:nth-of-type(1) {
  font-weight: bold;
  color: #787878;
  width: 20%;
}
.tables .title span:nth-of-type(1) {
  font-weight: bold;
  color: #00a0e9;
}
</style>