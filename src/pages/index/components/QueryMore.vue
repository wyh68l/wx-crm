<template>
  <div class="query-more">
    <div class="content"
         @click="more">
      <span class="more-text">查看更多</span> <img class="down-arrow"
           :src="arrow"
           alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      arrow: 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/downward-arrows%402x.png'
    }
  },
  methods: {
    more () {
      this.$emit('more');
    }
  }
}
</script>
<style scoped>
.query-more {
  width: 100%;
  height: 180upx;
  position: relative;
  background: linear-gradient(to bottom, #ffffff00, #ffffff);
}
.query-more .content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}
.query-more .more-text {
  font-size: 28upx;
  color: #00a0e9;
}
.down-arrow {
  width: 20upx;
  height: 20upx;
  margin-left: 16upx;
}
</style>
