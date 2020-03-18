<template>
  <div class="shop-ratio bgfff">
    <view class="h40" />
    <Title class="today"
           title="商城访问概率"
           subtitle="STORE" />
    <div class="disflex jsaround pt30">
      <VerticalData class="flex-shrink"
                    title="访问商城次数"
                    :subtitle="info.visitCount||0" />
      <VerticalData class="flex-shrink"
                    title="成交笔数"
                    :subtitle="info.delCount||0" />
      <VerticalData class="flex-shrink"
                    title="客单价"
                    :subtitle="parseInt((info.perUserPrices)/100)" />
    </div>
  </div>
</template>
<script>
import Title from '@/components/TiTleSlot'
import VerticalData from '@/pages/index/components/VerticalData';

export default {
  props: {
    info: Object,
  },
  components: {
    Title,
    VerticalData,
  }
}
</script>
<style scoped>
.shop-ratio {
  height: 360upx;
  padding: 0 32upx 0upx 32upx;
  overflow: hidden;
}
</style>