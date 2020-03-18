<template>
  <!-- 客户兴趣 -->
  <div class="interest pl16 pt24 bgfff pr15">
    <TiTleSlot title="客户兴趣"
               subtitle="DATA">
      <picker @change="bindPickerChange"
              :value="index"
              :range="array"
              range-key="name">
        <view class="picker">{{array[index].name}}</view>
      </picker>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right.png"
           alt
           class="w10 h10 bottom-arrow" />
    </TiTleSlot>
    <div class="w100p h270 bgfff">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleNewClientInit"
                     canvasId="interest"
                     ref="interest" />
    </div>
  </div>
</template>
<script>
import mpvueEcharts from '@/components/Echarts'
import echarts from 'echarts/dist/echarts.min'
import chartsOptions from '@/mixins/BaseEcharts.js'
import TiTleSlot from '@/components/TiTleSlot';
import WXAJAX from '@/utils/request'

let echartPie = null;
export default {
  components: {
    mpvueEcharts,
    TiTleSlot
  },
  data () {
    return {
      index: 0,
      array: [
        { name: '全部', id: '' },
        { name: '近七天', id: 7 },
        { name: '近15天', id: 15 },
        { name: '近30天', id: 30 },
      ],
      interestType: ['', '查看名片', '重视产品', '关注动态', '关注企业'],
      AIUserId: 0, //客户id,
      dayNum: '', //选择的时间
    }
  },
  mounted () {
    this.AIUserId = wx.getStorageSync('AIUserId') || 0;
    setTimeout(() => {
      this.chart_like();
    }, 100);
  },
  mixins: [chartsOptions],
  methods: {
    bindPickerChange (e) {
      this.index = e.detail.value;
      this.dayNum = this.array[this.index].id;
      this.chart_like();
    },
    handleNewClientInit ({ width, height }) {
      let options = JSON.parse(JSON.stringify(this.options));
      options.series = this.pieSeries;
      options.series.radius = [20, 80];
      // options.series.roseType = false;
      options.series.color = ['#3FB1E3', '#FFCC01', '#6B769F', '#6BE6C1'];
      options.series.center = ['50%', '50%'];
      options.series.data = [{ name: '客户兴趣', value: 0, type: 'pie' }];
      options.legend.data = ['客户兴趣'];

      echartPie = this.initChart(width, height, options, 'interest');
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
    chart_like () {
      let params = {
        userId: this.AIUserId,
        type: 1,
        dayNum: this.dayNum
      };
      WXAJAX.POST(params, '', '/seeRecord/countCustomerAnalysis').then((data) => {
        let pieDatas = [];
        let legendData = []
        if (data) {
          data.map(item => {
            let name = this.interestType[item.seeType]
            item.name = name;
            item.value = item.num;
            legendData.push(name);
          });
          pieDatas = data;
        } else {
          pieDatas = [{ name: '客户兴趣', value: 0, type: 'pie' }]
        }
        let option = echartPie.getOption();
        option.series[0].data = pieDatas;
        option.legend[0].data = legendData;
        echartPie.setOption(option);
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}
</script>
<style scoped>
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
