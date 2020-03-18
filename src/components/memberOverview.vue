<template>
  <div>
    <!--本月业绩-->
    <div class="bgfff pt26 pl15 pr16 pb19">
      <div class="disflex jsbet pr13 pb15">
        <span class="fs15 c38">本月业绩(KPI）</span>
        <span class="be8 lh25 pl9 pr10 bradius3 fs12 c80">
                    <picker class='time-picker disinblock pr10'
                            mode="date"
                            fields="month"
                            :value="personalDataEndTime"
                            :end="personalDataEndTime"
                            @change="datePickerChange"
                    >
                        {{chooseMonth}}
                    </picker>
                    <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt=""
                                      class="w10 h10"/>
                </span>

      </div>

      <div class="disflex jsbet wrap textc">
        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">月目标</p>
            <p class="fs18 c38 fbold">￥{{personalData.monthMoney || 0}}</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">已成交</p>
            <p class="fs18 c38 fbold">￥{{personalData.dealMoney || 0}}</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">完成率</p>
            <p class="fs18 cblue fbold">{{personalData.rate || 0}}%</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">今日单量</p>
            <p class="fs18 c38 fbold">{{personalData.toDayNum || 0}}单</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">本周单量</p>
            <p class="fs18 c38 fbold">{{personalData.toWeek || 0}}单</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">本月单量</p>
            <p class="fs18 c38 fbold">{{personalData.toMonth || 0}}单</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">今日成交</p>
            <p class="fs18 c38 fbold">{{personalData.toDayDeal || 0}}单</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">本周成交</p>
            <p class="fs18 c38 fbold">{{personalData.toWeekDeal || 0}}单</p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">本月成交</p>
            <p class="fs18 c38 fbold">{{personalData.toMonthDeal || 0}}单</p>
          </div>
        </div>
      </div>

    </div>

    <!--近七日成交额（元）-->
    <div class="w100p h243 borderbox bgfff pl5 disflex align-cen">
      <mpvue-echarts class="ec-canvas" @onInit="handleVolumeInit" canvasId="volume" ref="volume"/>
    </div>
    <div class="bgfff w100p disflex jscen pl15 pr15 fs12 ca8 borderbox mb5 pb12 deal-info">
      <div class="disflex align-cen mr23">
        <span class="w10 h10 bgorange bradius50p mr6"></span>
        <span>商城订单</span>
      </div>
      <div class="disflex align-cen mr23">
        <span class="w10 h10 bgyellow bradius50p mr6"></span>
        <span>个人成交订单</span>
      </div>
      <div class="disflex align-cen mr23" v-if="menu_id == 2">
        <span class="w10 h10 bgblue bradius50p mr6"></span>
        <span>企业成交订单</span>
      </div>
    </div>

    <!--成员分析tab-->
    <div v-if="type == 'memberAnalyze'">
      <div class="disflex jsaround lh44 bgfff fs14 ">
                <span :class="tab_id == v.id ? 'cblue bbblue_2' : 'bbfff_2 c38' "
                      v-for="(v,k) in tabs"
                      :key="k"
                      @click="tab_change(v.id)">
                    {{v.title}}
                </span>
      </div>
    </div>


    <div v-show="pandect_show">
      <div class="disflex jsbet pl15 pr15 fs14 ca8 lh26 bgfff pt16 pb20 textc">
            <span class="w67 borderbox bfff" v-for="(v,k) in menus" :key="k"
                  :class="menu2_id == v.id ? 'cblue bblue bradius5' : '' "
                  @click="summarize_tap(v.id)"
            >{{v.title}}</span>
      </div>

      <div class="disflex jsbet wrap textc pl15 pr16 bgfff pb11">
        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">客户总数UV</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="fbold pr4">{{dataSummary.data.customerNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.customerNum >=0 ">
                                +{{dataSummary.diff.customerNum}}
                            </span>
                <span class="fs10 cblue" v-else>
                                {{dataSummary.diff.customerNum}}
                            </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">浏览总数PV</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="fbold pr4">{{dataSummary.data.seeNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.seeNum >=0 ">
                                +{{dataSummary.diff.seeNum || 0}}
                            </span>
                <span class="fs10 cblue" v-else>
                                {{dataSummary.diff.seeNum || 0}}
                            </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">跟进总数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="fbold pr4">{{dataSummary.data.followNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.followNum >=0 ">
                                  +{{dataSummary.diff.followNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.followNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">沟通总客户数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.consultNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.consultNum >=0 ">
                                  +{{dataSummary.diff.consultNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.consultNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">商城销售金额</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.orderAmount || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.orderAmount >=0 ">
                                  +{{dataSummary.diff.orderAmount || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.orderAmount || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">商城订单数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.orderNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.orderNum >=0 ">
                                  +{{dataSummary.diff.orderNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.orderNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>


        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">被转发总数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.forwardNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.forwardNum >=0 ">
                                  +{{dataSummary.diff.forwardNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.forwardNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>


        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">被保存次数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.saveNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.saveNum >=0 ">
                                  +{{dataSummary.diff.saveNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.saveNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>

        <div class="w108 h108 be8 bradius3 mb10 textc disflex align-cen borderbox">
          <div class="w100p">
            <p class="fs12 ca8 pb7">被点赞总数</p>
            <p class="fs18 c38 disflex align-cen jscen">
              <span class="pr4">{{dataSummary.data.thumbNum || 0}}</span>
              <template v-if="menu2_id == 0">
                <span class="fs10 corange" v-if="dataSummary.diff.thumbNum >=0 ">
                                  +{{dataSummary.diff.thumbNum || 0}}
                              </span>
                <span class="fs10 cblue" v-else>
                                  {{dataSummary.diff.thumbNum || 0}}
                              </span>
              </template>
            </p>
          </div>
        </div>
      </div>

      <!--成交率漏斗-->
      <div class="bgfff">
        <p class="pt37 pb21 c38 fbold fs16 textc">成交率漏斗</p>

        <div class="disflex jscen lh40 cfff fs12 pb4"
             v-for="(v,k) in 4"
             :key="k">
          <div class="textc bgblue posre"
               :class="turnColor[k]"
               :style="{width : turnoverRate.width[k]}">
            {{turnoverRate[k+1] || 0}}
          </div>
        </div>

        <div class="disflex pl44 pr41 jsbet fs12 ca8 pt29">
          <div class="disflex align-cen" v-for="(v,k) in 4"
               :key="k">
            <span class="w15 h15" :class="turnColor[k]"></span>
            <span class="pl6">{{turnoverRate.rate[k]}}</span>
          </div>
        </div>

      </div>

      <!--客户统计-->
      <p class="textc bgfff lh44 fs16 c38 fbold pt37 posre">
        客户统计
        <span class="be8 lh25 pl9 pr10 bradius3 fs12 c80 posab right15 bottom10 fnormal"
                @click="chooseTimeShow0=!chooseTimeShow0">
                        {{clientStatisticalTime}}
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt=""
                                class="w10 h10" />
                    </span>
      </p>
      <!--新增客户数-->
      <p class="textc bgfff lh44 fs14 c38 fbold">新增客户数</p>
      <div class="disflex jsbet pl40 pr40 pr15 fs14 ca8 lh26 bgfff textc">
        <!-- <span class="w67 borderbox bfff" v-for="(v,k) in new_clients" :key="k"
               :class="new_client_id == v.id ? 'cblue bblue bradius5' : '' "
               @click="echart_time_tap('new_clients',v.id)"
         >{{v.title}}</span>-->
      </div>
      <div class="w100p h200 borderbox bgfff disflex align-cen pl5">
        <mpvue-echarts class="ec-canvas" @onInit="handleNewClientInit" canvasId="new_client" ref="new_client"/>
      </div>
      <!--咨询客户数-->
      <p class="textc bgfff lh44 fs14 c38 fbold">咨询客户数</p>
      <div class="disflex jsbet pl40 pr40 pr15 fs14 ca8 lh26 bgfff textc">
      </div>
      <div class="w100p h200 borderbox bgfff disflex align-cen pl5">
        <mpvue-echarts class="ec-canvas" @onInit="handleConsultClientInit" canvasId="consult_client" ref="consult_client"/>
      </div>
      <!--跟进客户数-->
      <p class="textc bgfff lh44 fs14 c38 fbold">跟进客户数</p>
      <div class="disflex jsbet pl40 pr40 pr15 fs14 ca8 lh26 bgfff textc">
      </div>
      <div class="w100p h200 borderbox bgfff disflex align-cen pl5">
        <mpvue-echarts class="ec-canvas" @onInit="handleFollowClientInit" canvasId="follow_client" ref="follow_client"/>
      </div>
      <!--近15日客户活跃度-->
      <p class="textc bgfff lh44 fs14 c38 fbold">近15日客户活跃度</p>
      <div class="w100p h243 borderbox bgfff disflex align-cen pl5">
        <mpvue-echarts class="ec-canvas" @onInit="handleActiveClientInit" canvasId="active_client" ref="active_client"/>
      </div>

    </div>

    <div :style="{height : active_show ? 'auto' : '0'}" class="trans2 overhidden">
      <!--客户兴趣-->
      <div>
        <div class="disflex bgfff jsbet pl15 pr15">
          <span class="fs15 c38">客户兴趣</span>
          <span class="be8 lh25 pl9 pr10 bradius3 fs12 c80"
                @click="chooseTimeShow=!chooseTimeShow">
                        {{clientLikeTime}}
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt=""
                                class="w10 h10" />
                    </span>
        </div>
        <div class="w100p h200">
          <mpvue-echarts class="ec-canvas" :onInit="handleLikeInit" canvasId="like_client" ref="like_client"/>
        </div>
        <div class="bgfff btf7 pt19 pb19 w100p disflex jsbet pl15 pr15 fs12 ca8 borderbox">
          <div class="disflex align-cen">
            <span class="w10 h10 bgorange bradius50p mr6"></span>
            <span>对{{menu_id == 2 ? '员工' : '我'}}感兴趣</span>
          </div>
          <div class="disflex align-cen">
            <span class="w10 h10 bgyellow bradius50p mr6"></span>
            <span>喜欢产品</span>
          </div>
          <div class="disflex align-cen">
            <span class="w10 h10 bggreen bradius50p mr6"></span>
            <span>关注动态</span>
          </div>
          <div class="disflex align-cen">
            <span class="w10 h10 bgblue bradius50p mr6"></span>
            <span>看重企业</span>
          </div>
        </div>
      </div>

      <div class="bgfff">
        <p class="fs14 c38 fbold textc lh44">客户与{{menu_id == 2 ? '企业' : '我的'}}互动</p>
        <div class="pl17 pr24 fs12 ca8 pt15 pb16">
          <!--咨询产品-->
          <div class="disflex jsbet">
            <div class="disflex align-cen w70">
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
            <div class="disflex align-cen w70">
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
            <div class="disflex align-cen w70">
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
            <div class="disflex align-cen w70">
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
            <div class="disflex align-cen w70">
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

      <div class="bgfff acitveRecord" v-if="type == 'memberAnalyze' && tab_id == 1">
        <p class="fs14 c38 fbold textc lh44">互动记录</p>
        <Log :logs="acitveRecord" :istop="1" :type="'2'"></Log>
      </div>

    </div>

    <!--跟进记录-->
    <div v-if="logs_show" class="bgfff pt20">
      <Log :isTopTitle="1" :logs="followLogs"></Log>
    </div>

    <!--客户统计时间选择-->
    <div v-if="chooseTimeShow0">
      <SelectorOne
        :title="'客户统计时间选择'"
        :status="chooseTimeShow0"
        :allClass="statistical_time"
        :choose_id="choose_statistical_time"
        @closeModal="chooseTimeShow=false"
        @choose_tap="chooseTime0"
      ></SelectorOne>
    </div>

    <!--客户兴趣时间选择-->
    <div v-if="chooseTimeShow">
      <SelectorOne
        :title="'选择添加内容'"
        :status="chooseTimeShow"
        :allClass="like_time"
        :choose_id="choose_like_time"
        @closeModal="chooseTimeShow=false"
        @choose_tap="chooseTime"
      ></SelectorOne>
    </div>

  </div>
</template>

<script>

  import echarts from 'echarts/dist/echarts.min'
  import mpvueEcharts from '@/components/Echarts'
  import Log from '@/components/log' //
  import WXAJAX from '../utils/request'
  import util from '../utils/index'
  import StaticResources from '@/components/StaticResources';
  import SelectorOne from '@/components/selectorOne' // 订单项

  let echart_new = null,
    echart_consult = null,
    echart_follow = null,
    echart_seven = null,
    echart_activeCustomer = null,
    echart_seeType = null;

  export default {
    name: "personalOverview",
    components: {mpvueEcharts, Log, SelectorOne, StaticResources},
    props: ['type', 'menu_id' ,'loadMore', 'isChange'],
    data() {
      return {
        echarts,
        chooseMonth: '2019-02',//本月业绩选择的时间
        personalDataEndTime: '',
        personalData: {},
        menus: [
          {title: '汇总', id: 0},
          {title: '昨日', id: 1},
          {title: '近7天', id: 7},
          {title: '近30天', id: 30},
        ],
        menu2_id: 0,
        choose_statistical_time: 7,
        choose_like_time: 7,
        statistical_time: [
          {name: '近七天', id: 7},
          {name: '近15天', id: 15},
          {name: '近30天', id: 30},
        ],
        like_time: [
          {name: '近七天', id: 7},
          {name: '近15天', id: 15},
          {name: '近30天', id: 30},
        ],
        // 客户统计时间选择
        chooseTimeShow0: false,
        clientStatisticalTime: '近七天',
        // 客户兴趣时间选择
        chooseTimeShow: false,
        clientLikeTime: '近七天',
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
            axisLabel: {
              formatter: function (val,idx) {
                let showNum = val;
                let unit = '';
                if (val>100000000) {
                  unit = '亿';
                  showNum = (val/100000000).toFixed(1);
                } else if (val > 10000){
                  unit = '万';
                  showNum = (val/10000).toFixed(1);
                }

                return showNum+unit;
              },
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
        dataSummary: {
          data: {},
          diff: {},
        },
        turnoverRate: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          width: [],
          rate: [],
          max: 0,
        },//成交率漏斗
        turnColor: {
          0: 'bgblue',
          1: 'bggreen',
          2: 'bgyellow',
          3: 'bgorange',
        },
        UV: '',
        PV: '',
        logs_num: '',
        talks_num: '',
        tabs: [//成员分析时的tab
          {title: '个人总览', id: 0},
          {title: '互动详情', id: 1},
          {title: '跟进记录', id: 2},
        ],
        tab_id: 0,
        pandect_show: false,//总览
        active_show: false,//互动详情
        logs_show: false,//跟进记录
        acitveRecord: [{time:[]}],//互动记录
        interactPage:1,//互动记录页数
        page: 1,
        isLoading: false,//是否在加载newCustomerNum
        nodata: false,//是否已经没有数据
        followLogs: [],
        followPage:1,//跟进记录页数
        cardId: 0,
        userId: 0,
        cardMsg: {},
        seeType: {
          1: {
            title: '名片',
            1: '现在沟通，效率更高哦',
            4: '成交有望'
          },
          2: {
            title: '产品',
            1: '尽快把握商机',
            4: '可标注为重点客户',
          },
          3: {
            title: '官网',
            1: '有望合作',
            4: '可标注为重点客户',
          },
          4: {
            title: '动态',
            1: '合作意向很强烈',
            4: '成单在望',
          }
        },

        customerInteract: [],//客户互动
        customerInteractMax: 0,
      }
    },
    watch: {
      'menu_id': function (newVal, oldVal) {
        if (this.type == 'enterprise') {//企业页面
          this.getPersonalData();
          this.getSevenData();
          this.getNewCustomerNum();//新增客户数
          this.chart_follow_client();//跟进客户数
          this.chart_like('1');
          this.getCustomerAnalysis();//客户与我、企业的互动
        }
      },
      'loadMore':function (newVal, oldVal) {
        console.log(newVal ) ;
        console.log(this.tab_id);
        if(this.tab_id == 1){//互动记录
          this.getSeeRecordList() ;
        }else if(this.tab_id == 2){//跟进记录
          this.getFollowLog();
        }
      },
      isChange: {
        handler(){
          this.inits();
        },
        deep: true,
      },
    },
    mounted() {
      echart_new = null;
      echart_consult = null;
      echart_follow = null;
      echart_seven = null;
      echart_activeCustomer = null;
      echart_seeType = null;

      this.userId = wx.getStorageSync('memberUserId') || 0;
      this.cardId = wx.getStorageSync('memberCardId') || 0;

      if (this.type == 'memberAnalyze') {
        this.pandect_show = true;
        this.active_show = false;
        this.logs_show = false;
      } else {
        this.pandect_show = true;
        this.active_show = true;
        this.logs_show = false;
      }

      let newDate = new Date(),
        endTime = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2);
      this.personalDataEndTime = endTime;
      this.chooseMonth = endTime;

    },
    onShow(){

    },
    methods: {
      getFollowLog() {//获取跟进记录
        let v = this;
        if (v.isLoading) {
          return
        }
        v.isLoading = true;

        // wx.showLoading();
        WXAJAX.POST({
          cardId: this.cardId,
          pageNum: this.followPage,
        }, '', '/followRecord/getFollowList').then((data) => {

          wx.hideLoading();
          if (data) {
            data.forEach(function (i, k) {
              i.followRemark = JSON.parse(i.followRemark);
              i.infoText = i.followRemark.data;
              i.time = util.getdate(i.createTime, 'monthTime');
              i.time = i.time.split(' ');
              // 1 -- 设置标签
              // 2 -- 修改客户共享范围
              // 3 -- 手动添加为客户
              // >= 4 -- 直接显示数据( 1 -- 电话 ， 2 -- 微信 ， 3 -- 手动添加 ， 4 -- 当面拜访 ， 5 -- 其他)
              if (i.followType) {
                switch (i.followType) {
                  case 1 :
                    i.mark = '电话拜访';
                    i.name = i.followName;
                    break;
                  case 2 :
                    i.mark = '微信拜访';
                    i.name = i.followName;
                    break;
                  case 3 :
                    i.mark = i.followName;
                    i.name = '';
                    break;
                  case 4 :
                    i.mark = '当面拜访';
                    i.name = i.followName;
                    break;
                  case 5 :
                    i.mark = i.followName;
                    break;
                }
                i.infoType = 3 + i.followType;
              } else {
                i.infoType = i.followRemark.type;
              }
            });
            v.followLogs = [...v.followLogs, ...data];
            v.followPage++;
          }
          setTimeout(function () {
            v.isLoading = false;
          }, 500);
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function () {
            v.isLoading = false;
          }, 500);
        });
      },
      inits() {
        // wx.showLoading();
        this.getPersonalData();//个人数据统计/企业数据统计
        setTimeout(() => {
          this.getDataSummary(); //数据汇总
        }, 500);
        setTimeout(() => {
          this.getTurnoverRate();//成交率漏斗
        }, 1000);
        this.getCustomerAnalysis();//客户与我、企业的互动
        if (this.type == 'enterprise') {//企业页面

        } else {//成员分析
          // this.getSeeRecordList();//互动记录
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 5000)
      },
      getSeeRecordList() {//互动记录
        let v = this;
        if (v.isLoading) {
          return
        }
        v.isLoading = true;
        WXAJAX.POST({
          entranceType: 1,
          cardId: this.cardId || '',
          pageNum: v.interactPage,
        }, '', '/seeRecord/getSeeRecordList').then((data) => {

          wx.hideLoading();
          if (data) {
            let item = {},
              _datas = [];
            v.interactPage == 1 && (v.acitveRecord = [] );

            data.forEach(function (i, k) {
              var time = '',
                info = '' ,
                showTime = '';

              // showTime = time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate();
              info = v.seeType[i.seeType][1];

              time = util.getdate(i.createTime, 'monthTime');
              time = time.split(' ');

              item = {
                time: time,//页面显示时间
                logo: i.logo,
                see: v.seeType[i.seeType].title,
                action: '查看',
                name: i.nickName || '',
                num : i.num,
                info : info
              };
              _datas.push(item);
            });
            v.acitveRecord = [...v.acitveRecord , ..._datas];
            v.interactPage ++ ;
          }

          setTimeout(function () {
            v.isLoading = false;
          }, 500);

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function () {
            v.isLoading = false;
          }, 500);
        });
      },
      getPersonalData() {//个人数据统计/企业数据统计
        let params = {};

        params.cardId = this.cardId || '';
        params.yearMonth = this.chooseMonth;

        WXAJAX.POST(params, '', '/dataCount/personalData').then((data) => {

          if (data) {
            data.monthMoney = data.monthMoney / 100;
            data.dealMoney = data.dealMoney / 100;
            data.rate = data.monthMoney ? (data.dealMoney / data.monthMoney* 100).toFixed(2) : 0;
            data.toDayNum = data.toDayNum ;
            data.toWeek = data.toWeek ;
            data.toMonth = data.toMonth ;
            this.personalData = data;
          }

        }).catch((err) => {
          console.log(err);
        });
      },
      getSevenData() {//近7日成交额
        this.chart_volume();
      },
      getNewCustomerNum() {//新增客户数
        setTimeout(() => {
          this.chart_new_client();
        }, 1000)
      },
      getDataSummary() {//数据汇总
        let params = {},
          v = this;

        params.cardId = this.cardId || '';
        if (this.menu2_id != 0 || params.userId) {
          params.days = this.menu2_id;
        }
        WXAJAX.POST(params, '', '/dataCount/dataSummary').then((data) => {
          if (data) {
            v.dataSummary.data = data[0];
            if (data[1]) {
              v.dataSummary.diff = {
                customerNum: data[0].customerNum - data[1].customerNum,
                seeNum: data[0].seeNum - data[1].seeNum,
                followNum: data[0].followNum - data[1].followNum,
                consultNum:data[0].consultNum - data[1].consultNum,
                orderAmount: data[0].orderAmount - data[1].orderAmount,
                orderNum: data[0].orderNum - data[1].orderNum,
                forwardNum: data[0].forwardNum - data[1].forwardNum,
                saveNum: data[0].saveNum - data[1].saveNum,
                thumbNum: data[0].thumbNum - data[1].thumbNum,
              };
            }else{
              v.dataSummary.diff = {
                customerNum: 0,
                seeNum: 0,
                followNum: 0,
                consultNum:0,
                orderAmount: 0,
                orderNum: 0,
                forwardNum: 0,
                saveNum: 0,
                thumbNum: 0,
              };
            }
            console.log(v.dataSummary.diff);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      getTurnoverRate() {//成交率漏斗
        let v = this;

        WXAJAX.POST({
          cardId: this.cardId || '',
        }, '', '/dataCount/turnoverRate').then((data) => {
          if (data) {
            let max = 0;
            data.forEach(function (i, k) {
              max = max > i.num ? max : i.num;
              v.turnoverRate[i.state] = i.num || 12;
            });
            v.turnoverRate.max = max;
            for (let i in 4) {

            }
            v.turnoverRate.width = [
              ((v.turnoverRate[1] || 1) / max).toFixed(2) * 149 + 'px',
              ((v.turnoverRate[2] || 1) / max).toFixed(2) * 149 + 'px',
              ((v.turnoverRate[3] || 1) / max).toFixed(2) * 149 + 'px',
              ((v.turnoverRate[4] || 1) / max).toFixed(2) * 149 + 'px',
            ];
          }
          v.turnoverRate.rate = [
            '≤50%',
            '≤80%',
            '≤99%',
            '≤100%',
          ];
        }).catch((err) => {
          console.log(err);
        });
      },
      chart_volume() {//近七日成交额（元）
        let params = {},
          v = this;
        params.cardId = this.cardId || '';

        WXAJAX.POST(params, '', '/dataCount/sevenData').then((data) => {

          if (data) {
            let series = [[], [], []],
              xAxisData = [],
              seriesItem = [];

            data.orderList.forEach(function (i, k) {//商城订单
              xAxisData.push(i.date.replace(/^.*?-/, ''));
              series[0].push(Math.floor(i.amount / 100));
            });

            data.dealList.forEach(function (i, k) {//个人成交订单
              series[1].push(Math.floor(i.amount / 100));
            });

            if (v.menu_id == 2) {
              data.companyList.forEach(function (i, k) {//商城订单
                series[2].push(Math.floor(i.amount / 100));
              })
            }

            //更新数据
            var option = echart_seven.getOption();
            option.xAxis[0].data = xAxisData;
            option.series[0].data = series[0];
            option.series[1].data = series[1];
            option.series[2] = {
              type: 'line',
              data: series[2],
              ...v.default_options.series
            };
            echart_seven.setOption(option);

          }
          v.inits();

        }).catch((err) => {
          console.log(err);
        });

      },
      chart_new_client() {//新增客户数

        let params = {},
          v = this;

        params.cardId = this.cardId || '';
        params.days = v.choose_statistical_time;

        WXAJAX.POST(params, '', '/dataCount/newCustomerNum').then((data) => {
          if (data) {
            let xAxisData = [],
              seriesData = [];
            data.forEach(function (i, k) {
              xAxisData.push(i.date.replace(/^.*?-/, ''));
              seriesData.push(Math.ceil(i.data / 100));
            });

            var option = echart_new.getOption();
            option.xAxis[0].data = xAxisData;
            option.series[0].data = seriesData;
            echart_new.setOption(option);
          }

        }).catch((err) => {
          console.log(err);
        });

      },
      chart_consult_client() {//咨询客户数
        let params = {},
          v = this;
        setTimeout(function () {
          params.cardId = v.cardId || '';
          params.days = v.choose_statistical_time;

          WXAJAX.POST(params, '', '/dataCount/followCustomerNum').then((data) => {
            if (data) {
              let xAxisData = [],
                seriesData = [];
              data.forEach(function (i, k) {
                xAxisData.push(i.date.replace(/^.*?-/, ''));
                seriesData.push(Math.ceil(i.data / 100));
              });

              //更新数据
              var option = echart_consult.getOption();
              option.xAxis[0].data = xAxisData;
              option.series[0].data = seriesData;
              echart_consult.setOption(option);

            }
          }).catch((err) => {
            console.log(err);
          });
        }, 1000)
      },
      chart_follow_client() {//跟进客户数

        let params = {},
          v = this;
        setTimeout(function () {
          params.cardId = v.cardId || '';

          params.days = v.choose_statistical_time;
          WXAJAX.POST(params, '', '/dataCount/consultationNum').then((data) => {
            if (data) {
              let xAxisData = [],
                seriesData = [];
              data.forEach(function (i, k) {
                xAxisData.push(i.date.replace(/^.*?-/, ''));
                seriesData.push(Math.ceil(i.data / 100));
              });

              //更新数据
              var option = echart_follow.getOption();
              option.xAxis[0].data = xAxisData;
              option.series[0].data = seriesData;
              echart_follow.setOption(option);
            }
          }).catch((err) => {
            console.log(err);
          });
        }, 2000)

      },
      chart_active_client() {//近15日客户活跃度
        let params = {},
          v = this;
        setTimeout(function () {
          params.cardId = v.cardId || '';

          WXAJAX.POST(params, '', '/dataCount/activeCustomerNum').then((data) => {
            if (data) {
              let xAxisData = [],
                seriesData = [];
              data.forEach(function (i, k) {
                xAxisData.push(i.date.replace(/^.*?-/, ''));
                seriesData.push(Math.ceil(i.data / 100));
              });

              //更新数据
              var option = echart_activeCustomer.getOption();
              option.xAxis[0].data = xAxisData;
              option.series[0].data = seriesData;
              echart_activeCustomer.setOption(option);
            }
          }).catch((err) => {
            console.log(err);
          });
        }, 3000)
      },
      chart_like(canvas, width, height) {

        let v = this,
          params = {},
          timer = 0;
        if (canvas) timer = 4000;

        params.cardId = this.cardId;

        setTimeout(function () {
          params.dayNum = v.choose_like_time;
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
              // option.xAxis[0].data = xAxisData;
              option.series[0].data = [
                {value: _data[1], name: '对' + v.menu_id == 2 ? '员工' : '我' + '感兴趣'},
                {value: _data[2], name: '喜欢产品'},
                {value: _data[4], name: '关注动态'},
                {value: _data[3], name: '看重企业'},
              ];
              echart_seeType.setOption(option);
            }

          }).catch((err) => {
            console.log(err);
          });
        }, timer);
      },

      handleVolumeInit({width, height}){
        let series = [[], [], []],
          xAxisData = [];
        let options = {
          "color": this.default_options.color,
          ...this.default_options.baseSet,
          "title": {
            "textStyle": {
              "color": "#383838",
              fontSize: 10,
            },
            "subtextStyle": {
              "color": "#a8a8a8"
            },
            text: '近七日成交额（元）',
            top: '5%'
          },
          grid:{
            left: '15%'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            textStyle: {
              color: '#B2B2B2',
              // fontSize:'20upx',
            },
            nameTextStyle: {
              color: '#B2B2B2'
            },
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#B2B2B2'
              }
            }
          },
          yAxis: this.default_options.yAxis,
          series: [
            {
              // name: '最高气温',
              type: 'line',
              data: series[0],
              ...this.default_options.series,

            },
            {
              // name: '最低气温',
              type: 'line',
              data: series[1],
              ...this.default_options.series

            }
          ]
        };
        if (this.menu_id == 2) {
          options.series.push({
            type: 'line',
            data: series[2],
            ...this.default_options.series
          });
        }
        echart_seven = this.initChart(width, height, options, 'volume');
        this.chart_volume();
      },
      handleNewClientInit({width, height}){
        let xAxisData = [],
          seriesData = [];
        let options = {
          "color": this.default_options.color[0],
          ...this.default_options.baseSet,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#B2B2B2'
              }
            }
          },
          grid:{
            left: '15%'
          },
          yAxis: this.default_options.yAxis,
          series: [
            {
              type: 'line',
              data: seriesData,
              ...this.default_options.series
            },
          ]
        };
        echart_new = this.initChart(width, height, options, 'new_client');
        this.chart_new_client();
      },
      handleConsultClientInit({width, height}){
        let xAxisData = [],
          seriesData = [];
        var options = {
          "color": this.default_options.color[1],
          ...this.default_options.baseSet,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#B2B2B2'
              }
            }
          },
          grid:{
            left: '15%'
          },
          yAxis: this.default_options.yAxis,
          series: [
            {
              type: 'line',
              data: seriesData,
              ...this.default_options.series
            },
          ]
        };
        echart_consult = this.initChart(width, height, options, 'consult_client');

        this.chart_consult_client();
      },
      handleFollowClientInit({width, height}){
        let xAxisData = [],
          seriesData = [];
        var options = {
          "color": this.default_options.color[2],
          ...this.default_options.baseSet,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#B2B2B2'
              }
            }
          },
          grid:{
            left: '15%'
          },
          yAxis: this.default_options.yAxis,
          series: [
            {
              type: 'line',
              data: seriesData,
              ...this.default_options.series
            },
          ]
        };
        echart_follow = this.initChart(width, height, options, 'follow_client');
        this.chart_follow_client();
      },
      handleActiveClientInit({width, height}){
        let xAxisData = [],
          seriesData = [];
        var options = {
          "color": this.default_options.color[3],
          ...this.default_options.baseSet,
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLine: {
              lineStyle: {
                color: '#B2B2B2'
              }
            }
          },
          grid:{
            left: '15%'
          },
          yAxis: this.default_options.yAxis,
          series: [
            {
              type: 'line',
              data: seriesData,
              ...this.default_options.series
            },
          ]
        };
        echart_activeCustomer = this.initChart(width, height, options, 'active_client');
        this.chart_active_client();
      },
      handleLikeInit({width, height}){
        var options = {
          "color": this.default_options.color,
          ...this.default_options.baseSet,
          "textStyle": {},
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          grid:{
            left: '15%'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: [
                {value: 1, name: '对' + this.menu_id == 2 ? '员工' : '我' + '感兴趣'},
                {value: 2, name: '喜欢产品'},
                {value: 3, name: '关注动态'},
                {value: 4, name: '看重企业'},
              ],
            }
          ]
        };
        echart_seeType = this.initChart(width, height, options, 'like_client');
        this.chart_like();
      },

      getCustomerAnalysis() {//客户与我 、 企业的互动

        let v = this,
          params = {ignore: true};

        params.cardId = this.cardId;

        setTimeout(function () {
          WXAJAX.POST(params, '', '/seeRecord/customerAnalysis').then((data) => {
            if (data) {
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
          });
        }, 4000)
      },

      initChart( width, height, options, name) {
        let canvas = this.$refs[name].canvas;

        echarts.setCanvasCreator(() => canvas);
        let chart;
        chart = echarts.init(canvas, null, {
          width: width || 370,
          height: height || (name ==='active_client' ? 243 :200)
        });
        canvas.setChart(chart);
        chart.setOption(options);
        this.$refs[name].setChart(chart);
        return chart
      },

      summarize_tap(id) {//汇总点击
        this.menu2_id = id;
        // wx.showLoading();
        this.getDataSummary();
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      },
      echart_time_tap(type, id) {//echart时间选择
        // wx.showLoading();
        switch (type) {
          case 'new_clients':
            // this.$set(this,'new_client_id',id);
            this.new_client_id = id;
            //更新数据
            var option = echart_new.getOption();
            option.series[0].data = [15, 1, 25, 13, 12, 13, 10];
            echart_new.setOption(option);
            break;
          case 'consult_clients':
            this.consult_client_id = id;
            break;
          case 'follow_clients':
            this.follow_client_id = id;
            break;
        }
        wx.hideLoading();
      },
      tab_change(id) {//切换tab
        this.tab_id = id;
        // wx.showLoading();
        switch (id) {
          case 0:
            this.pandect_show = true;
            this.active_show = false;
            this.logs_show = false;
            break;
          case 1:
            this.pandect_show = false;
            this.active_show = true;
            this.logs_show = false;
            if (this.acitveRecord[0].time.length == 0) {
              this.getSeeRecordList();
            }
            break;
          case 2:
            this.pandect_show = false;
            this.active_show = false;
            this.logs_show = true;
            if (this.followLogs.length == 0) {
              this.isLoading = false ;
              console.log(this.isLoading) ;
              this.getFollowLog();
            }
            break;
        }
        setTimeout(function () {
          wx.hideLoading();
        }, 300)
      },
      datePickerChange(e) {//本月业绩选择时间
        let _time = e.target.value.split('-');
        _time = _time[0] + '-' + _time[1];
        this.chooseMonth = _time;
        // wx.showLoading();
        this.getPersonalData();
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      },
      chooseTime0(id, name) {
        console.log(id, name)
        this.chooseTimeShow0 = !this.chooseTimeShow0;
        if (id == -1) return;
        this.clientStatisticalTime = name;
        this.choose_statistical_time = id;
        this.chart_new_client();
        this.chart_consult_client();
        this.chart_follow_client();
        // wx.showLoading();
        // this.chart_like();
        // setTimeout(function () {
        //   wx.hideLoading();
        // }, 1000)
      },
      chooseTime(id, name) {
        this.chooseTimeShow = !this.chooseTimeShow;
        if (id == -1) return;
        this.clientLikeTime = name;
        this.choose_like_time = id;
        // wx.showLoading();
        this.chart_like();
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      }
    }
  }
</script>

<style>
  .w70{
    flex: 0 0 140upx;
  }
  .line-out{
    flex-grow: 1;
    padding-top: 8upx;
  }
  .deal-info >div:last-child{
    margin-right: 0 !important;
  }
  canvas {
    background: #fff;
  }
  .acitveRecord .follow_log.active .right{
    color:#BCBBBC
  }
  .acitveRecord .follow_log{
    padding-left: 40px;
    padding-right: 92upx;
  }

  .ec-canvas {
    width: 100%;
    height: 100%;
    flex: 1;
  }
</style>

