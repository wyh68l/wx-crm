<template>
  <!-- 客户互动 -->
  <div class="interact   pl16 pt40 bgfff pr15">
    <TiTleSlot title="客户与我的互动"
               subtitle="DATA">
    </TiTleSlot>
    <div class="w100p h200 bgfff">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleClientInit"
                     canvasId="interact"
                     ref="interact" />
    </div>
  </div>
</template>
<script>
import mpvueEcharts from '@/components/Echarts'
import echarts from 'echarts/dist/echarts.min'
import chartsOptions from '@/mixins/BaseEcharts.js'
import TiTleSlot from '@/components/TiTleSlot';

let echart_activeCustomer;
export default {
  props: {
    info: {
      type: Object
    }
  },
  components: {
    TiTleSlot,
    mpvueEcharts
  },
  mixins: [chartsOptions],
  watch: {
    info: {
      deep: true,
      handler (newVal) {
        if (newVal) {
          if (!echart_activeCustomer) return;
          //更新数据
          let option = echart_activeCustomer.getOption();
          option.series[0] = {
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#51CBCD',
                fontWeight: 'bold'
              }
            },
            data: [newVal.imNum, newVal.callsNum, newVal.goodForwardNum, newVal.dynamicNum, newVal.commentNum],
            type: 'bar',
            barCategoryGap: '60%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(118,218,216, 0.3)' },
                  { offset: 1, color: '#51CBCD' }
                ])
              }
            },
          };
          echart_activeCustomer.setOption(option);
        }
      }
    }
  },
  methods: {
    handleClientInit ({ width, height }) {
      let options = JSON.parse(JSON.stringify(this.barOtions));
      options.xAxis.data = ['咨询产品', '拨打电话', '分享产品', '转发动态', '评论'];
      echart_activeCustomer = this.initChart(width, height, options, 'interact');
    },
    initChart (width, height, options, name) {
      let canvas = this.$refs[name].canvas;

      echarts.setCanvasCreator(() => canvas);
      let chart;
      chart = echarts.init(canvas, null, {
        width: width || 370,
        height: height || 200
      });
      canvas.setChart(chart);
      chart.setOption(options);
      this.$refs[name].setChart(chart);
      return chart;
    },
  }
}
</script>
<style scoped>
</style>