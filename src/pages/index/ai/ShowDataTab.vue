<template>
  <div class="show-data-tab"
       :style="{height:cur===0?'552rpx':'632rpx'}">
    <DaysSwitch @select="query" />
    <swiper :indicator-dots="false"
            class="swiper"
            :style="{height:cur===0?'320rpx':'400rpx'}"
            @change="swiperChange"
            indicator-active-color="#00a0e9">
      <swiper-item>
        <!-- <view class="swiper-item">1</view> -->
        <SwiperItemByTable :sceneDataList="sceneDataList" />
      </swiper-item>
      <swiper-item>
        <SwiperItemByEcharts :timeDataList="timeDataList"
                             :total="total"
                             @changeBusinessType="changeBusinessType" />
      </swiper-item>
    </swiper>
    <div class="dots">
      <div class="dot"
           :class="{active: cur===0}"></div>
      <div class="dot"
           :class="{active: cur===1}"></div>
    </div>
  </div>
</template>
<script>
import SwiperItemByTable from './SwiperItemByTable';
import SwiperItemByEcharts from './SwiperItemByEcharts';
import DaysSwitch from '@/pages/index/components/DaysSwitch';
export default {
  components: {
    SwiperItemByTable,
    SwiperItemByEcharts,
    DaysSwitch
  },
  props: {
    timeDataList: {
      type: Array,
    },
    total: {
      type: Number,
      default: 0
    },
    sceneDataList: {
      type: Object,
    },
  },
  data () {
    return {
      cur: 0
    }
  },
  methods: {
    query (index) {
      this.index = index;
      this.$emit('selectData', index);
    },
    //轮播图的切换事件  
    swiperChange (e) {
      this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
    },
    changeBusinessType (businessType) {
      this.$emit("changeBusinessType", businessType);
    }
  }
}
</script>
<style scoped>
.show-data-tab {
  /* min-height: 632upx; */
  background: #fff;
  position: relative;
  padding-top: 40upx;
}

.swiper {
  height: 400upx;
  margin-top: 60upx;
}
/* 自定义轮播图的指示点 */
.dots {
  width: 100%;
  height: 10upx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60upx;
}
/*未选中时的小圆点样式 */
.dot {
  margin-right: 8rpx;
  width: 26upx;
  height: 10upx;
  border-radius: 6upx;
  background-color: #e8e8e8;
}
/*选中以后的小圆点样式  */
.active {
  background-color: #00a0e9;
}
</style>