<template>
  <div>
    <!--用户信息-->
    <div class="disflex pl15 pr15 pt15 pb14 bgfff">
      <img :src="cardMsg.analysisModel.logo"
           mode="aspectFill"
           alt=""
           class="w50 h50 bradius5 mr12" />

      <div class="flex1">
        <p class="pt5 c38 fs18 pb13">{{cardMsg.analysisModel.name}}</p>

        <p class="fs14 cbc">
          总计与你互动 <span class="cblue">{{cardMsg.analysisModel.num||0}}</span> 次，
          预计成交率达 <span class="corange">{{cardMsg.analysisModel.rate|| 0}}%</span>，
          尽快把握商机
        </p>

      </div>

      <div class="ml18 w50">
        <div class="circle_outer"
             data-value="0.75">
          <div class="circle"
               :class="circle_class">
            <div class="percent left"
                 :style="{'-webkit-transform':'rotate('+circle_count+'deg)'}"></div>
            <div class="percent right"
                 :class="circle_right_class"></div>
          </div>
          <p class="cyellow fbold fs12 lh50 textc posre">{{cardMsg.analysisModel.rate||0}}%</p>
        </div>
        <p class="fs14 cbc">成交率</p>
      </div>

    </div>

    <!--客户兴趣-->
    <div class="disflex bgfff jsbet pl15 pr15 mt11 pt20">
      <span class="fs15 c38">客户兴趣</span>
      <span class="be8 lh25 pl9 pr10 bradius3 fs12 c80"
            @click="chooseTimeShow=!chooseTimeShow">
        {{clientLikeTime}}
      </span>
    </div>
    <div class="w100p h200 bgfff">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleInit"
                     canvasId="like_client"
                     ref="like_client" />
    </div>
    <div class="bgfff btf7 pt19 pb19 w100p disflex jsbet pl15 pr15 fs12 ca8 borderbox">
      <div class="disflex align-cen">
        <span class="w10 h10 bgorange bradius50p mr6"></span>
        <span>查看名片</span>
      </div>
      <div class="disflex align-cen">
        <span class="w10 h10 bgyellow bradius50p mr6"></span>
        <span>重视产品</span>
      </div>
      <div class="disflex align-cen">
        <span class="w10 h10 bggreen bradius50p mr6"></span>
        <span>关注动态</span>
      </div>
      <div class="disflex align-cen">
        <span class="w10 h10 bgblue bradius50p mr6"></span>
        <span>关注企业</span>
      </div>
    </div>

    <!--客户与企业互动-->
    <div class="bgfff">
      <p class="fs14 c38 fbold textc lh44">客户与我的互动</p>
      <div class="pl17 pr24 fs12 ca8 pt15 pb16">
        <!--咨询产品-->
        <div class="disflex jsbet">
          <div class="disflex align-cen interact-title">
            <span class="pr18">咨询产品</span>
          </div>
          <div class="line-out pr18">
            <b class="h8 bradius4 bgblue"
               :style="{width:customerInteract[0]/customerInteractMax*100 + '%'}"></b>
          </div>
          <span>{{customerInteract[0]}}</span>
        </div>
        <!--保存名片-->
        <div class="disflex jsbet pt14">
          <div class="disflex align-cen interact-title">
            <span class="pr18">拨打电话</span>
          </div>
          <div class="line-out pr18">
            <b class="h8 bradius4 bgblue"
               :style="{width:customerInteract[1]/customerInteractMax*100 + '%'}"></b>
          </div>
          <span>{{customerInteract[1]}}</span>
        </div>
        <!--保存电话-->
        <div class="disflex jsbet pt14">
          <div class="disflex align-cen interact-title">
            <span class="pr18">分享产品</span>
          </div>
          <div class="line-out pr18">
            <b class="h8 bradius4 bgblue"
               :style="{width:customerInteract[2]/customerInteractMax*100 + '%'}"></b>
          </div>
          <span>{{customerInteract[2]}}</span>
        </div>
        <!--拨打电话-->
        <div class="disflex jsbet pt14">
          <div class="disflex align-cen interact-title">
            <span class="pr18">转发动态</span>
          </div>
          <div class="line-out pr18">
            <b class="h8 bradius4 bgblue"
               :style="{width:customerInteract[3]/customerInteractMax*100 + '%'}"></b>
          </div>
          <span>{{customerInteract[3]}}</span>
        </div>
        <!--企业点赞-->
        <div class="disflex jsbet pt14">
          <div class="disflex align-cen interact-title">
            <span class="pr18">评论</span>
          </div>
          <div class="line-out pr18">
            <b class="h8 bradius4 bgblue"
               :style="{width:customerInteract[4]/customerInteractMax*100 + '%'}"></b>
          </div>
          <span>{{customerInteract[4]}}</span>
        </div>

      </div>
    </div>

    <!--客户活跃度-->
    <div class="disflex bgfff jsbet pl15 pr15 mt11 pt20">
      <span class="fs15 c38">客户活跃度</span>
      <!--   <div class="be8 lh25 pl9 pr10 bradius3 fs12 c80" @click="echart_time_tap('active')">
             近15天
             <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.pngg" alt="" class="w10 h10">
         </div>-->
    </div>
    <div class="w100p h200 borderbox bgfff disflex align-cen pl5">
      <mpvue-echarts class="ec-canvas"
                     @onInit="handleActiveClientInit"
                     canvasId="active_client"
                     ref="active_client" />
    </div>

    <!--bottom-->
    <div class="textc lh42 fs12 ca8 bgf5f6">- 汉全科技集团出品 -</div>

    <div class="disflex fix_bottom bte8"
         v-if="!loaded">
      <div class="disflex flex1 bgfff pt8 textc">
        <div class="w33p"
             @click="makePhone">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_gray.png"
               alt=""
               class="w20 h20" />
          <p class="ca8 fs12 textc mt-4">电话</p>
        </div>
        <div class="w33p"
             @click="addWx">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/wx.png"
               alt=""
               class="w20 h20" />
          <p class="ca8 fs12 textc mt-4">微信</p>
        </div>
      </div>
      <div class="w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40">
        <span class="flex1 bg_line_orange"
              :class="cardMsg.analysisModel.isMyCustomer <= 0 ? 'bra_left_20' : 'bradius20' "
              @click="toIM">在线沟通</span>
        <span class="flex1 bg_line_blue bra_right_20"
              v-if="cardMsg.analysisModel.isMyCustomer <= 0 "
              @click="page_turn('clientAdd' , '?type=userAdd&cardId='+(cardMsg.analysisModel.cardId || '')+'&userId='+(cardMsg.analysisModel.userId || ''))">存为客户</span>
      </div>
    </div>

    <cover-view class="disflex fix_bottom bte8"
                v-else>
      <cover-view class="disflex flex1 bgfff pt8 textc">
        <cover-view class="w33p textc"
                    @click="makePhone">
          <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101137.png"
                       alt=""
                       class=" disinblock make-phone" />
        </cover-view>
        <cover-view class="w33p textc"
                    @click="addWx">
          <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101149.png"
                       alt=""
                       class=" disinblock add-wx" />
        </cover-view>
      </cover-view>
      <cover-view class="w220 disflex textc fs16 cfff pr15 pt5 pb5 borderbox bgfff lh40">
        <template v-if="cardMsg.analysisModel.isMyCustomer <= 0">
          <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101156.png"
                       alt=""
                       class=" disinblock concat-client"
                       @click="toIM" />
          <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101201.png"
                       alt=""
                       class=" disinblock save-client"
                       @click="page_turn('clientAdd' , '?type=userAdd&cardId='+(cardMsg.analysisModel.cardId || '')+'&userId='+(cardMsg.analysisModel.userId || ''))" />
        </template>
        <template v-else>
          <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101323.png"
                       alt=""
                       class=" disinblock concat-client-full"
                       @click="toIM" />
        </template>
      </cover-view>
    </cover-view>

    <cover-view style="display: none">
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101137.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101149.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101156.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101201.png"></cover-image>
      <cover-image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/20190509101323.png"></cover-image>

    </cover-view>
    <div class="h49"></div>
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
import echarts from 'echarts/dist/echarts.min'
import mpvueEcharts from '@/components/Echarts'
import util from '../utils/index'
import WXAJAX from '../utils/request'
import SelectorOne from '@/components/selectorOne' // 订单项
import StaticResources from '@/components/StaticResources';
import AddWxCourse from '@/components/addWxCourse'
import { mapGetters } from 'vuex';

let echart_consult, echart_active, echart_seeType, echart_activeCustomer;

export default {
  name: '',
  components: { mpvueEcharts, SelectorOne, AddWxCourse, StaticResources },
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
      cardMsg: { analysisModel: {} },
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
    this.getCardMsg();
    this.chart_like();
    this.chart_active_client();

    this.timer = setTimeout(() => {
      this.loaded = true;
    }, 3 * 1000);
  },
  onShow () {
    this.AIUserId = wx.getStorageSync('AIUserId') || 0;
    this.getCardMsg();
    this.chart_like();
    this.chart_active_client();
    this.getCardMsg();
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
    toIM () {
      const { cardId = '', logo = '', userId = '', name = '' } = this.currentClient;
      const { phone = '', personalWx = '' } = this.cardMsg.analysisModel;
      wx.navigateTo({
        url: '/pages/IM/main?userId=' + userId + '&logo=' + logo + '&type=2&cardId=' + cardId + '&name=' + name + '&wxCode=' + personalWx + '&phone=' + phone
      });
    },
    handleInit ({ width, height }) {
      let options = {
        "color": this.default_options.color,
        ...this.default_options.baseSet,
        "textStyle": {},
        tooltip: {
          show: false,
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            hoverAnimation: false,
            data: [
              { value: 0, name: '暂无数据' },
            ],
          }
        ]
      };
      echart_seeType = this.initChart(width, height, options, 'like_client');
    },
    handleActiveClientInit ({ width, height }) {
      let options = {
        "color": this.default_options.color[3],
        ...this.default_options.baseSet,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
            lineStyle: {
              color: '#B2B2B2'
            }
          }
        },
        tooltip: {
          show: false,
        },
        yAxis: this.default_options.yAxis,
        series: [
          {
            type: 'line',
            hoverAnimation: false,
            data: [],
            ...this.default_options.series
          },
        ]
      };
      echart_activeCustomer = this.initChart(width, height, options, 'active_client');
    },
    getCardMsg () {//获取名片信息
      let v = this;
      wx.showLoading();
      WXAJAX.POST({
        userId: this.AIUserId
      }, '', '/seeRecord/customerAnalysis').then((data) => {

        wx.hideLoading();
        if (data) {
          data.analysisModel.rate = ((data.analysisModel.rate || 0) * 100).toFixed(2);
          v.cardMsg = data;

          var percent = (data.analysisModel.rate / 100).toFixed(2),
            count = 0;

          percent = ((!percent || percent > 1) ? 0 : percent * 100);
          var timer = setInterval(function () {

            if (count > percent) {
              clearInterval(timer);
              return false;
            } else if (count > 50) {
              v.circle_class = '';
              v.circle_right_class = '';
            }

            v.circle_count = (18 / 5) * count;
            count++;
          }, 10);

          let max = 0,
            array = [];
          v.customerInteract[0] = data.imNum;
          v.customerInteract[1] = data.callsNum;
          v.customerInteract[2] = data.goodForwardNum;
          v.customerInteract[3] = data.dynamicNum;
          v.customerInteract[4] = data.commentNum;

          v.customerInteractMax = data.imNum + data.callsNum + data.goodForwardNum + data.dynamicNum + data.commentNum;

        }
      }).catch((err) => {
        console.log(err);
        wx.hideLoading();

      });
    },
    chart_like () {

      let v = this,
        params = {
          userId: this.AIUserId,
          type: 1,
        },
        timer = 0;

      params.dayNum = v.choose_like_time;
      setTimeout(function () {
        WXAJAX.POST(params, '', '/seeRecord/countCustomerAnalysis').then((data) => {

          if (data) {

            let _data = {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
            };
            data.forEach(function (i, k) {
              _data[i.seeType] = i.num;
            });

            //更新数据
            var option = echart_seeType.getOption();
            option.series[0].data = [
              { value: _data[1], name: '查看名片' },
              { value: _data[2], name: '重视产品' },
              { value: _data[4], name: '关注动态' },
              { value: _data[3], name: '关注企业' },
            ];
            echart_seeType.setOption(option);
          }
        }).catch((err) => {
          console.log(err);
        });
      }, 1000)
    },
    chart_active_client () {//近15日客户活跃度
      let params = {
        type: 1,
        userId: this.AIUserId,
        seeUserId: this.AIUserId,
      },
        v = this;
      setTimeout(function () {

        WXAJAX.POST(params, '', '/dataCount/activeCustomerNum').then((data) => {
          if (data) {
            let xAxisData = [],
              seriesData = [];
            data.forEach(function (i, k) {
              xAxisData.push(i.date.replace(/^.*?-/, ''));
              seriesData.push(i.data);
            });

            //更新数据
            var option = echart_activeCustomer.getOption();
            option.series[0].data = seriesData;
            option.xAxis[0].data = xAxisData;
            echart_activeCustomer.setOption(option);

          }
        }).catch((err) => {
          console.log(err);
        })
      }, 1500)
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
    echart_time_tap (type, id) {//echart时间选择
      wx.showLoading();
      this.menu_id = id;

      /* var option = echart_new.getOption();
       option.series[0].data = [15, 1, 25, 13, 12, 13, 10];
       echart_new.setOption(option);*/

      wx.hideLoading();
    },
    makePhone () {//拨打电话
      util.MakePhone(this.cardMsg.analysisModel.phone || '');
    },
    addWx () {//添加微信
      const { personalWx } = this.cardMsg.analysisModel;

      if (!personalWx) {
        wx.showToast({
          title: '还没有添加微信呢！',
          duration: 2000,
          icon: 'none'
        });
      }

      let v = this;
      wx.setClipboardData({
        data: personalWx,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
              v.isShowCourse = true;
            }
          })
        }
      })
    },
    page_turn (url, query) {
      query = query || '';
      wx.setStorageSync('isClearClientInfo', true);
      wx.navigateTo({ url: '../' + url + '/main' + query });
    },
    chooseTime (id, name) {
      this.chooseTimeShow = !this.chooseTimeShow;
      if (id == -1) return;
      this.clientLikeTime = name;
      this.choose_like_time = id;
      wx.showLoading();
      this.chart_like();
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
    }
  }
}
</script>

<style>
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

