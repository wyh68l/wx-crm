<template>
  <div class="closing-rank bgfff"
       :style="{'padding-bottom': showMore?0: '40rpx'}">
    <Title class="today"
           title="成交率最高用户 TOP10"
           subtitle="DATE" />
    <div class="closing-list">
      <template v-for="(item, index) of info">
        <VisitorItem :key="index"
                     :info="item"
                     :rank="index+1"
                     v-if="showMore || index<3"
                     @clickVistor="clickVistor" />
      </template>

      <QueryMore v-if="info.length>3 && !showMore "
                 @more="more"
                 class="more" />
      <NoData desc="暂无信息"
              v-if="!info || info.length===0" />
    </div>
  </div>
</template>
<script>
import Title from '@/components/TiTleSlot'
import VisitorItem from '@/pages/index/closing/VisitorItem'
import QueryMore from '@/pages/index/components/QueryMore'
import WXAJAX from "@/utils/request";
import NoData from '@/components/noData';
export default {
  components: {
    Title,
    VisitorItem,
    QueryMore,
    NoData
  },
  props: {
    info: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      showMore: false
    }
  },
  methods: {
    more () {
      this.showMore = true;
    },
    clickVistor (info) {
      this.$emit("clickVistor", '', info.userId);
    },
  }
}
</script>
<style scoped>
.closing-rank {
  /* min-height: 646upx; */
  padding: 40upx 32upx;
}
.closing-rank .closing-list {
  padding: 20upx 32upx 0 32upx;
  position: relative;
  min-height: 330upx;
  transition: all 2s linear;
}
.closing-rank .closing-list .more {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -30upx;
}
.closing-rank .all {
  min-height: 1100upx !important;
}
</style>