<template>
  <div class="swiper-item-echarts">
    <div class="disflex jsbet">
      <picker @change="bindPickerChange"
              :value="index"
              range-key="title"
              :range="array">
        <view class="picker">
          {{array[index].title}}
        </view>
      </picker>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
           alt
           class="w10 h10 bottom-arrow" />
      <div class="right">
        <span class="c38 fbold fs14 mr9">{{total||0}}</span>
        <img class="card-case-num-img "
             src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card-case-num.png"
             alt="">

      </div>
    </div>
    <mpvue-echarts class="ec-canvas"
                   @onInit="handleNewClientInit"
                   canvasId="new_client"
                   ref="new_client" />

  </div>
</template>
<script>
import mpvueEcharts from '@/components/Echarts'
import echarts from 'echarts/dist/echarts.min'
import chartsOptions from '@/mixins/BaseEcharts.js'
let echart_new = null;
export default {
  props: {
    timeDataList: {
      type: Array
    },
    total: {
      type: Number,
      default: 0
    }
  },
  components: {
    mpvueEcharts
  },
  watch: {
    timeDataList: {
      deep: true,
      handler (newVal) {
        if (!newVal) return;
        let xAxisData = [],
          seriesData = [];
        newVal.forEach(function (i, k) {
          xAxisData.push(i.time.replace(/^.*?-/, ''));
          seriesData.push(i.count);
        });

        let option = echart_new.getOption();
        option.xAxis[0]['data'] = xAxisData;
        option.series[0] = {
          label: {
            nromal: {
              show: true,
              position: 'top'
            }
          },
          data: seriesData,
          type: 'line',
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#51CBCD' },
                { offset: 1, color: '#fff' }
              ])
            }
          },
        };
        echart_new.setOption(option);
      }
    }
  },
  data () {
    return {
      index: 0,
      array: [
        { title: "查看名片", id: 1 },
        { title: "重视产品", id: 2 },
        { title: "关注动态", id: 4 },
        { title: "关注企业", id: 3 },
        // { title: "全部", id: 5 }
      ],
      echarts,
    }
  },
  mixins: [chartsOptions],
  methods: {
    bindPickerChange (e) {
      this.index = e.detail.value;
      this.$emit("changeBusinessType", this.array[this.index].id);
    },
    handleNewClientInit ({ width, height }) {
      let options = JSON.parse(JSON.stringify(this.lineOptions));
      echart_new = this.initChart(width, height, options, 'new_client');
    },
    initChart (width, height, options, name) {
      let canvas = this.$refs[name].canvas;

      echarts.setCanvasCreator(() => canvas);
      let chart;
      chart = echarts.init(canvas, null, {
        width: width || 370,
        height: height || (name === 'active_client' ? 400 : 200)
      });
      canvas.setChart(chart);
      chart.setOption(options);
      this.$refs[name].setChart(chart);
      return chart
    },
  }
}
</script>
<style scoped>
.swiper-item-echarts {
  height: 400upx;
  padding: 0 32upx;
}
.card-case-num-img {
  width: 32upx;
  height: 22upx;
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
.ec-canvas {
  width: 100%;
  height: 100%;
  flex: 1;
}
.bottom-arrow {
  position: absolute;
  left: 25%;
  top: 20rpx;
  transform: rotate(90deg);
}
</style>
