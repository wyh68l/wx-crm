<template>
  <div class="today-guid bgfff">
    <DaysSwitch @select="select" />
    <view class="h40" />
    <div class="pl16 pr16">
      <Title class="today"
             title="今日概况"
             subtitle="TODAY" />
      <div class="today-info disflex jsaround pt30">
        <VerticalData class="flex-shrink"
                      title="分享次数"
                      :subtitle="info.shareCount||0" />
        <VerticalData class="flex-shrink"
                      title="分享人数"
                      :subtitle="info.shareUserCount||0" />
        <VerticalData class="flex-shrink"
                      title="分享新增"
                      :subtitle="info.shareNewUserCount||0" />
      </div>
    </div>
  </div>
</template>
<script>
import DaysSwitch from '@/pages/index/components/DaysSwitch';
import Title from '@/components/TiTleSlot'
import VerticalData from '@/pages/index/components/VerticalData';
export default {
  props: {
    info: {
      type: Object,
      default: () => ({
        shareCount: 0,
        shareUserCount: 0,
        shareNewUserCount: 0,
      })
    }
  },
  components: {
    DaysSwitch,
    Title,
    VerticalData,
  },
  methods: {
    select (index) {
      this.$emit('selectDate', index);
    }
  }
}
</script>
<style scoped>
.today-guid {
  height: 354upx;
  border-radius: 20upx 20upx 0 0;
  padding: 110upx 0 38upx 0;
  overflow: hidden;
}
.today-guid .today {
  padding-top: 80upx;
}
.flex-shrink {
  flex-shrink: 0;
}
</style>