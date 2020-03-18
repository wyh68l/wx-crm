<template>
  <div class="total-record bgfff pt15 pb22">
    <div class="line "></div>
    <div class="record">

      <span class="fs24 cblue fbold">{{rate||0}}%</span>
      <span class="fs14 close-rate cfff textc">成交率</span>
    </div>
    <p class="desc fs14 ca8 textc ">总计与你互动{{info.num}}次，预计成交率达{{rate||0}}%， 尽快把握商机</p>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      rate: 0,
    }
  },
  mounted () {
    this.rate = (this.info.rate * 1).toFixed(2);
  }
}
</script>
<style scoped>
.total-record {
  height: 484upx;
  width: 100%;
  border-radius: 20upx 20upx 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
}
.line {
  width: 100upx;
  height: 8upx;
  background: #f5f5f6;
  border-radius: 4upx;
}
.record {
  width: 354upx;
  height: 324upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/deal-rate@2x.png")
    no-repeat center;
  background-size: 354upx 324upx;
}
.close-rate {
  display: inline-block;
  width: 128upx;
  height: 50upx;
  background: #ffcc01;
  border-radius: 26upx;
  line-height: 50upx;
  margin-top: 30upx;
}
.desc {
  width: 550upx;
}
</style>
