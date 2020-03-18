<template>
  <div class="visit-rank bgfff">
    <TitleSlot title="访问排名"
               subtitle="DATE">
      <picker @change="bindPickerChange"
              :value="index"
              :range="array"
              range-key="title">
        <view class="picker">{{array[index].title}}</view>
      </picker>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
           alt
           class="w10 h10 bottom-arrow" />
    </TitleSlot>

    <VisitorItem v-for="(item, index) of visitorList"
                 :key="index"
                 :info="item"
                 @clickVistor="clickVistor" />
    <!-- <p class="textc pt20 pb20"
       v-if="!visitorList ||visitorList.length===0">没有获取到相关信息</p> -->
    <NoData desc="暂无信息"
            v-if="!visitorList ||visitorList.length===0" />
  </div>
</template>
<script>
import TitleSlot from "@/components/TiTleSlot";
import VisitorItem from "../components/VisitorItem";
import NoData from '@/components/noData';

export default {
  props: {
    visitorList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    TitleSlot,
    VisitorItem,
    NoData
  },
  data () {
    return {
      index: 0,
      array: [
        { title: "全部", id: '' },
        { title: "查看名片", id: 1 },
        { title: "重视产品", id: 2 },
        { title: "关注动态", id: 4 },
        { title: "关注企业", id: 3 },
        // { title: "全部", id: 5 }
      ]
    };
  },
  methods: {
    bindPickerChange (e) {
      this.index = e.detail.value;
      this.$emit("changeSeeType", this.array[this.index].id);
    },
    clickVistor (info) {
      this.$emit("clickVistor", info.cardId, info.userId);
    }
  }
};
</script>
<style scoped>
.visit-rank {
  /* max-height: 904upx; */
  padding: 0 30upx;
}
.picker {
  border: 1px solid #e8e8e8;
  font-size: 24upx;
  width: 184upx;
  height: 48upx;
  line-height: 48upx;
  color: #808080;
  padding-left: 18upx;
  /* margin-right: 30upx; */
}
.bottom-arrow {
  position: absolute;
  right: 22upx;
  top: 40%;
  transform: rotate(90deg);
}
</style>
