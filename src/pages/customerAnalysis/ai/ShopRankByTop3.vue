<template>
  <div class="top3 bgfff">
    <TiTleSlot title="访问商品排名 TOP3"
               subtitle="DATA" />
    <ShopItem v-for="(item, index) of dataList"
              :rank="index+1"
              :info="item"
              :key="index" />

    <NoData desc="暂无信息"
            v-if="!dataList || dataList.length===0" />
  </div>
</template>
<script>
import ShopItem from '@/components/ShopItem'
import TiTleSlot from '@/components/TiTleSlot'
import WXAJAX from "@/utils/request";
import NoData from '@/components/noData';
export default {
  props: {
    activeId: {
      type: Number,
      required: true
    },
    timeType: {
      type: Number,
      required: true
    }
  },
  components: {
    ShopItem,
    TiTleSlot,
    NoData
  },
  data () {
    return {
      dataList: [],
    }
  },
  async mounted () {
    await this.getTop3Data(this.timeType);
  },
  watch: {
    timeType (newVal) {
      this.getTop3Data(newVal);
    }
  },
  methods: {
    async getTop3Data (timeType) {
      wx.showLoading();
      try {
        let data = await WXAJAX.POST(
          { ignore: true, userId: this.activeId, topN: 3, timeType },
          "",
          "/seeRecord/getVisitGoodsTopN"

        );
        if (data) {
          this.dataList = data;
        }
      } catch (error) {
        console.log("error", error);
        this.dataList = []
      }
      wx.hideLoading();
    }
  }
}
</script>
<style scoped>
.top3 {
  padding: 40upx 32upx 0 32upx;
}
</style>