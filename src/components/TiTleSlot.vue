<template>
  <div class="titles">
    <div class="left">
      <span class="maintitle">{{title}}</span>
      <span class="subtitle">{{subtitle}}</span>
    </div>
    <div class="right">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: ['title', 'subtitle']
}
</script>
<style scoped>
.titles {
  height: 50upx;
  /* width: 686upx; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* padding: 0 32upx; */
}
.titles .left {
  /* margin-left: 32upx; */
}
.titles .left .maintitle {
  font-size: 40upx;
  color: #383838;
  font-weight: bold;
}
.titles .left .subtitle {
  font-size: 28upx;
  color: #00a0e9;
  margin-left: 12upx;
  font-weight: bold;
  opacity: 0.3;
}
.titles .right {
  /* margin-right: 32upx; */
  position: relative;
}
</style>