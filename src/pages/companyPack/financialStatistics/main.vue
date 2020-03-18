<template>
  <div>
    <!--top-->
    <div class="textc bgfff pt16">
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/money_2.png" alt="" class="w65 h65 mauto" />
      <p class="lh30 fs14 ca8">总收入</p>
      <p class="c38 fs21 fbold pb15">￥{{count}}</p>
      <div class="disflex jsaround pl14 pr15 fs14 c38 lh44">
        <span :class="type == 0 ? 'cblue bbblue_2' : '' " @click="type_tap(0)">商城流水</span>
        <span :class="type == 1 ? 'cblue bbblue_2' : '' " @click="type_tap(1)">成交流水</span>
        <span :class="type == 2 ? 'cblue bbblue_2' : '' " @click="type_tap(2)" v-if="isBoss">企业流水</span>
      </div>
    </div>
    <!--筛选-->
    <div class="disflex jsbet pt15 pr15 pb15 pl15 align-cen">
      <div class="bgfff lh30 pl16 pr15 c38 fs14 bradius15 disflex align-cen">
          <picker class='time-picker disinblock'
                  mode="date"
                  fields="month"
                  :end="endDate"
                  @change="datePickerChange"
          >
            {{chooseMonth}}
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down_2.png" alt="" class="w10 h10 ml6"/>
          </picker>
      </div>
      <span class="fs14 cb8">¥{{monthCount}}</span>
    </div>
    <!--订单-->
    <!--<scroll-view v-if="order_lists.length > 0"  scroll-y style="height: 55.5vh;background: #fff">
      <div @click="financialDetail(item.inputDealId || '')"  v-for="(item, index) in order_lists"  class="pl15 pt10 pb10 pr15 disflex jsbet align-cen" style="border-bottom: 1upx solid #f5f5f6">
        <div class="disflex align-cen">
          <image :src="item.userPhoto || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'" class="w40 h40 bradius50p" />
          <text style="color: #383838" class="ml10 fs16">{{item.userName}}</text>
        </div>
        <text class="fs16" style="color: #383838">{{item.action === 0 ? `-${item.money}` : `+${item.money}`}}</text>
      </div>
    </scroll-view>
    <div class="disflex jscen" v-else style="height: 55.5vh;background: #fff">
      <image src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190521/1558429867593.png" style="height: 340upx;width: 340upx;margin-top: 121upx" />
    </div>-->
    <div class="pt20 pl15 pb18 pr15 fs12 ca8 bbf5f6 bgfff"
         v-for="(v,k) in order_lists" :key="k">
        <p class="disflex jsbet fs18 c38 fbold">
            <span class="order-title over_1">{{v.title}}</span>
            <span v-if="v.action == 0" class="corange">-{{v.money}}</span>
            <span v-if="v.action == 1">+{{v.money}}</span>
        </p>
        <p class="disflex jsbet pt18">
            <span>{{v.time}}</span>
            <span>
                {{v.companyName}}-{{v.boosName}}
                <span :class="v.action == 0 ? 'corange' : 'c38' ">{{v.action == 0 ? '退款' : '成交'}}</span>
                {{v.userName}}
            </span>
        </p>
    </div>
    <!--bottom-->
    <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
  </div>
</template>

<script>
import WXAJAX from '../../../utils/request'
import util from '../../../utils'
import StaticResources from '@/components/StaticResources';
export default {
  name: '',
  components: {StaticResources},
  data() {
    return{
      type : 0 ,
      order_lists:[],
      endDate:'',
      chooseMonth:'',//本月业绩选择的时间
      isBoss : false ,//是否为boss
      urls:{
          0 : '/finance/selectFinanceMall' ,
          1 : '/finance/selectFinanceDeal' ,
          2 : '/finance/selectFinanceCompany' ,
      },
      page:1,
      count:0,
      monthCount:0,
      isLoading:false ,
      nodata : false ,
    }
  },
  onLoad() {

    this.isBoss = wx.getStorageSync('isBoss') || false ;
    let _endDate = new Date();
    _endDate = _endDate.getFullYear() + '-' + ( '0' + (_endDate.getMonth() + 1)).slice(-2) ;
    this.endDate = _endDate;
    this.chooseMonth = _endDate;
    _endDate = null ;
    this.getCount();
    this.getInits();
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.nodata = false ;
    this.order_lists = [] ;
    this.page = 1 ;
    this.isLoading = false ;
    this.getInits();
    wx.stopPullDownRefresh();
    setTimeout(function () {
        wx.hideNavigationBarLoading();
    },300)
  },
  onReachBottom() {
    this.getInits();
  },
  onUnload(){/*{{{*/
    /** 
    this.nodata = false ;
    this.order_lists = [] ;
    this.page = 1 ;
    this.type = 0 ;
    this.isLoading = false ;
    this.count = 0 ;
    this.monthCount = 0 ;
    **/
  },/*}}}*/
  methods: {
    type_tap(id){/*{{{*/
      this.type = id;
      this.nodata = false ;
      this.order_lists = [] ;
      this.page = 1 ;
      this.isLoading = false ;
      this.getInits();
    },
    bindDateChange(e){
      this.date=e.mp.detail.value;
    },
    datePickerChange(e){//本月业绩选择时间
      let _time = e.target.value.split('-');
      _time = _time[0] + '-' + _time[1] ;
      this.chooseMonth = _time ;
      this.nodata = false ;
      this.order_lists = [] ;
      this.page = 1 ;
      this.isLoading = false ;
      this.getInits();
    },/*}}}*/
    // 总收入获取
    getCount(){
      WXAJAX.POST({ignore: true}, '', '/finance/getGrossIncome').then((data) => {
        this.count = (data / 100).toFixed(2) ;
      }).catch((err) => {
        console.log(err);
      });
    },
    // 跳转详情页面 进入详情页根据id取数据
    financialDetail(id) {
      if (id === '') return
      uni.navigateTo({
        url: `./financialDetail?id=${id}`
      })
    },
    getInits(){
      if(this.isLoading){
        return
      }
      this.isLoading = true;
      wx.showLoading();
      WXAJAX.POST({whereDate: this.chooseMonth, pageNum : this.page}, '', this.urls[this.type]).then(data => {
        wx.hideLoading();
        if (!data) {
          return
        }
        this.monthCount = (data.money / 100).toFixed(2);
        if (this.type == 0) {
          data.data.forEach((i, k) => {
            if (i.orderType == 6) {//退款
                i.title = '订单退款';
                i.action = 0 ;
            } else {
                i.title = '订单收入';
                i.action = 1 ;
            }
            i.money = (i.money/100).toFixed(2) ;
            i.time = util.getdate(i.createTime , 'dateTime') ;
          })
        } else {
          data.data.forEach(function (i, k) {
            if (i.orderType) {
              i.title = i.orderType;
            } else {
              i.title = '成交流水';
            }
            i.money = (i.money/100).toFixed(2) ;
            i.time = util.getdate(i.createTime , 'dateTime');
            i.action = 1;
          })
        }
        this.order_lists = [...this.order_lists, ...data.data];
        this.page ++ ;
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
      }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          if(err.code == 204){
              v.nodata = true ;
          }
          setTimeout(function () {
              v.isLoading = false ;
          },500);
      });
    }
  }
}
</script>

<style scoped>
  .order-title{
    display: inline-block;
    width: 8em;
  }
</style>
