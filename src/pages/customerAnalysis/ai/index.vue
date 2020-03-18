<template>
  <div>
    <TotalRecord class="total-record"
                 v-if="userInfo.analysisModel"
                 :info="userInfo.analysisModel" />
    <ShopRankByTop3 v-if="userInfo && userInfo.analysisModel.userId"
                    :activeId="userInfo.analysisModel.userId"
                    :timeType="timeType" />
    <Interest />

    <!--客户与企业互动-->
    <Interact :info="userInfo" />

    <!--客户活跃度-->
    <Activity />

    <!--bottom-->
    <!-- <div class="textc lh42 fs12 ca8 bgf5f6">- 汉全科技集团出品 -</div> -->

    <BottomConnect :cardMsg="userInfo" />

    <cover-view style="display: none">
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101137.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101149.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101156.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101201.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101323.png"></cover-image>

    </cover-view>
    <NoDataBottom />
    <!--客户兴趣时间选择-->
    <div v-if="chooseTimeShow">
      <SelectorOne :title="'选择添加内容'"
                   :status="chooseTimeShow"
                   :allClass="like_time"
                   :choose_id="choose_like_time"
                   @choose_tap="chooseTime"
                   @closeModal="chooseTimeShow=false"></SelectorOne>
    </div>

    <div v-if="isShowCourse">
      <addWxCourse :isShow="isShowCourse"
                   @close="isShowCourse=false" />
    </div>

  </div>
</template>

<script>
import echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from '@/components/Echarts'
import util from '@/utils/index'
import WXAJAX from '@/utils/request'
import SelectorOne from '@/components/selectorOne' // 订单项
import StaticResources from '@/components/StaticResources';
import AddWxCourse from '@/components/addWxCourse'
import { mapGetters } from 'vuex';
import TotalRecord from './TotalRecord'
import ShopRankByTop3 from './ShopRankByTop3';
import TiTleSlot from '@/components/TiTleSlot'
import BottomConnect from '@/components/BottomConnect'
import Interest from './Interest'
import Activity from './Activity'
import Interact from './Interact'
import NoDataBottom from '@/components/NoDataBottom';

let echart_consult, echart_active, echart_seeType, echart_activeCustomer;

export default {
  name: '',
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    },
    timeType: {
      type: Number,
      required: true
    }
  },
  components: { mpvueEcharts, SelectorOne, AddWxCourse, StaticResources, TotalRecord, ShopRankByTop3, TiTleSlot, BottomConnect, Interest, Activity, Interact, NoDataBottom },
  data () {
    return {
      echarts,
      LBR: '',
      circle_class: '',
      circle_right_class: 'wth0',
      loaded: false,
      circle_count: '',
      like_time: [
        { name: '全部', id: '' },
        { name: '近七天', id: 7 },
        { name: '近15天', id: 15 },
        { name: '近30天', id: 30 },
      ],//客户兴趣时间选择
      chooseTimeShow: false,
      clientLikeTime: '全部',
      choose_like_time: '',
      AIUserId: 0,
      customerInteract: [],//客户互动
      customerInteractMax: 0,
      default_options: {
        baseSet: {
          backgroundColor: "rgba(255,255,255,0)",
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            show: false
          },
        },
        color: [
          "#fd634e",
          "#ffa133",
          "#2bcf88",
          "#00a0e9"
        ],

        yAxis: {
          type: 'value',
          minInterval: '1',
          // min: 3,
          axisLabel: {
            formatter: '{value}'
          },
          nameTextStyle: {
            color: '#B2B2B2'
          },
          axisLine: {
            lineStyle: {
              color: '#B2B2B2'
            }
          },
          splitLine: {
            show: false
          },
        },
        series: {
          itemStyle: {
            normal: {
              borderWidth: "1"
            }
          },
          lineStyle: {
            normal: {
              width: "2"
            },
          },
          symbolSize: "4",
          symbol: "emptyCircle",
          smooth: true
        }
      },
      isShowCourse: false,
      timer: null,
    }
  },
  mounted () {
    this.AIUserId = wx.getStorageSync('AIUserId') || 0;

    this.timer = setTimeout(() => {
      this.loaded = true;
    }, 3 * 1000);
  },
  onShow () {
    this.AIUserId = wx.getStorageSync('AIUserId') || 0;
    this.timer = setTimeout(() => {
      this.loaded = true;
    }, 3 * 1000);

  },
  onUnload () {
    this.timer && clearTimeout(this.timer);
    this.loaded = false;
  },
  computed: {
    ...mapGetters(['currentClient']),
  },
  methods: {

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
    echart_time_tap (type, id) {//echart时间选择
      wx.showLoading();
      this.menu_id = id;

      wx.hideLoading();
    },
    chooseTime (id, name) {
      this.chooseTimeShow = !this.chooseTimeShow;
      if (id == -1) return;
      this.clientLikeTime = name;
      this.choose_like_time = id;
      wx.showLoading();
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
    }
  }
}
</script>

<style scoped>
.total-record {
  /* margin-top: -20upx; */
}
.interest {
  /* height: 656upx; */
}
.select-border {
  width: 158upx;
  height: 50upx;
  display: inline-block;
}
.concat-client-full {
  width: 206px;
  height: 78upx;
}
.make-phone,
.add-wx {
  width: 46upx;
  height: 66upx;
}

.concat-client,
.save-client {
  width: 206upx;
  height: 78upx;
}

.line-out {
  flex-grow: 1;
  padding-top: 8upx;
  position: relative;
}
.line-out::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8upx;
  right: 36upx;
  background: #e8e8e8;
  border-radius: 50upx;
  height: 16upx;
}

.line-out b {
  position: relative;
  z-index: 2;
}

.interact-title {
  flex: 0 0 140upx;
}
.circle_outer {
  width: 100upx;
  height: 100upx;
  position: relative;
  /*background-color: #5d6570;*/
  border: 1upx solid #e8e8e8;
  box-sizing: border-box;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.circle_outer .circle,
.percent {
  position: absolute;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.circle_outer .circle {
  width: 100upx;
  height: 100upx;
  /*border: 40px solid #5d6570;*/
  clip: rect(0, 100upx, 100upx, 50upx);
  margin-top: -2upx;
  margin-left: -2upx;
}
.circle_outer .clip-auto {
  clip: rect(auto, auto, auto, auto);
}
.circle_outer .percent {
  width: 100upx;
  height: 100upx;
  box-sizing: border-box;
  top: 0px;
  left: 0px;
}
.circle_outer .left {
  transition: transform ease;
  border: 8upx solid #ffa133;
  clip: rect(0, 50upx, 100upx, 0);
}
.circle_outer .right {
  border: 8upx solid #ffa133;
  clip: rect(0, 100upx, 100upx, 50upx);
}
.circle_outer .wth0 {
  width: 0;
}
.ec-canvas {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>

