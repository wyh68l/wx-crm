<template>
  <div class="activity  pl16 pt40 bgfff pr15">
    <TiTleSlot title="客户活跃度"
               subtitle="DATA">
    </TiTleSlot>
    <div class="w100p h200 bgfff">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleActiveClientInit"
                     canvasId="acitivty"
                     ref="acitivty" />
    </div>
  </div>
</template>
<script>
import mpvueEcharts from '@/components/Echarts'
import echarts from 'echarts/dist/echarts.min'
import chartsOptions from '@/mixins/BaseEcharts.js'
import WXAJAX from '@/utils/request'
import TiTleSlot from '@/components/TiTleSlot';

let echart_activeCustomer = null;
export default {
  components: {
    mpvueEcharts,
    TiTleSlot
  },
  data () {
    return {
      AIUserId: 0, //客户id,
    }
  },
  mounted () {
    this.AIUserId = wx.getStorageSync('AIUserId') || 0;
    setTimeout(() => {
      this.chart_active_client();
    }, 100);
  },
  mixins: [chartsOptions],
  methods: {
    handleActiveClientInit ({ width, height }) {
      let options = JSON.parse(JSON.stringify(this.lineOptions));
      echart_activeCustomer = this.initChart(width, height, options, 'acitivty');
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
    chart_active_client () {//近15日客户活跃度
      let params = {
        type: 1,
        userId: this.AIUserId,
        seeUserId: this.AIUserId,
      };
      WXAJAX.POST(params, '', '/dataCount/activeCustomerNum').then((data) => {
        if (data) {
          let xAxisData = [],
            seriesData = [];
          data.forEach(function (i, k) {
            xAxisData.push(i.date.replace(/^.*?-/, ''));
            seriesData.push(i.data);
          });

          //更新数据
          let option = echart_activeCustomer.getOption();
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
          echart_activeCustomer.setOption(option);
        }
      }).catch((err) => {
        console.log(err);
      })
    },
  }
}
</script>
<style scoped>
</style>