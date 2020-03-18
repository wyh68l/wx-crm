<template>
  <div class="share-precentage bgfff">
    <Title class="today"
           title="分享明细占比"
           subtitle="SHARE" />
    <div class="w100p h270 bgfff">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleNewClientInit"
                     canvasId="share_type"
                     ref="share_type" />
    </div>
  </div>
</template>
<script>
import Title from '@/components/TiTleSlot'
import chartsOptions from '@/mixins/BaseEcharts.js'
import mpvueEcharts from '@/components/Echarts'
import echarts from 'echarts/dist/echarts.min'
let echartPie;
export default {
  components: {
    Title,
    mpvueEcharts
  },
  props: {
    shareTypeData: {
      type: Array
    }
  },
  data () {
    return {
      echart_new: null,
      types: ['', '名片', '商品', '预约', '文章'] //分享类型（集合，根据类型分组的） （1:名片，2:商品，3:预约，4:文章）
    }
  },
  watch: {
    shareTypeData: {
      deep: true,
      handler (newVal) {
        if (newVal && newVal.length > 0) {
          let legendName = [];
          newVal.map(item => {
            item.name = this.types[item.shareType];
            legendName.push(item.name);
            item.value = item.count;
          })
          let option = echartPie.getOption();
          //console.log(JSON.stringify(newVal));
          option.series[0].data = newVal;
            option.series[0].roseType = false;//将不通过半径显示数据多少
          option.legend[0].data = legendName;
          echartPie.setOption(option);
        } else {
          let option = echartPie.getOption();
          option.series[0].data = [{ name: '分享占比', value: 0, type: "pie" }];
          option.legend[0].data = ['分享占比'];
          echartPie.setOption(option);
        }
      }
    }
  },
  mixins: [chartsOptions],
  methods: {
    handleNewClientInit ({ width, height }) {
      let options = JSON.parse(JSON.stringify(this.options));
      options.series = this.pieSeries;
      // let rpx = await new Promise(resolve => {
      //   wx.getSystemInfo({
      //     success: function (res) {
      //       let rpx = res.windowWidth / 750;
      //       resolve(rpx);
      //     }
      //   });
      // });
      let rpx = wx.getSystemInfoSync().windowWidth / 375;
      options.series = this.pieSeries;
      let a = 20 * rpx,
        b = 80 * rpx;
      options.series.radius = [a, b];
      options.series.center = ['50%', '50%'];
      options.series.data = [{ name: '分享占比', value: 0, type: 'pie' }];
      options.legend.data = ['分享占比'];
      options.legend.bottom = 0;

      echartPie = this.initChart(width || 360 * rpx, height || 260 * rpx, options, 'share_type');
    },
    initChart (width, height, options, name) {
      let canvas = this.$refs[name].canvas;
      echarts.setCanvasCreator(() => canvas);
      let chart = echarts.init(canvas, null, {
        width: width || 370,
        height: height || (name === 'active_client' ? 243 : 200)
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
.share-precentage {
  height: 556upx;
  padding: 32upx;
}
.echarts {
  /* height: 530upx; */
}
</style>
