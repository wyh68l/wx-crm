<template>
  <div class="shop-rank bgfff">
    <Title class="today"
           title="访问商品排名 TOP5"
           subtitle="DATE" />
    <div class="rank-list"
         :class="{all: showMore}">
      <template v-for="(item, index) of dataList">
        <ShopItem :key="index"
                  :info="item"
                  :rank="index+1"
                  v-if="showMore || index<3" />
      </template>
      <QueryMore v-if="dataList.length>3 && !showMore"
                 @more="more"
                 class="more" />
      <NoData desc="暂无信息"
              v-if="!dataList || dataList.length===0" />
    </div>
  </div>
</template>
<script>
import Title from '@/components/TiTleSlot'
import ShopItem from '@/components/ShopItem'
import QueryMore from '@/pages/index/components/QueryMore'
import WXAJAX from "@/utils/request";
import NoData from '@/components/noData';

export default {
  components: {
    Title,
    ShopItem,
    QueryMore,
    NoData
  },
  props: {
    dataList: {
      type: Array,
      default: 0
    }
  },
  data () {
    return {
      showMore: false,
    }
  },
  methods: {
    more () {
      this.showMore = true;
    },
  }
}
</script>
<style scoped>
.shop-rank {
  min-height: 646upx;
  padding: 40upx 32upx;
}
.shop-rank .rank-list {
  padding: 20upx 32upx 0 32upx;
  min-height: 488upx;
  position: relative;
}
.shop-rank .rank-list .more {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -30upx;
}
.all {
  min-height: 910upx;
}
</style>