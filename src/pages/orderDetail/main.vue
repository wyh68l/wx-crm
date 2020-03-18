<template>
  <div>

    <div class="bg_line_blue pl16 pr15 cfff disflex jsbet h99 borderbox pt30">
      <div>
        <p class="fs18 fbold">{{textInfo[orderState].title}}</p>
        <p class="fs12 pt7">{{textInfo[orderState].subtext}}</p>
      </div>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/orderDetail.png" alt="" class="w57 h79"/>
    </div>

    <div class="mb10 order_detail_addr">
      <div class="bgfff pl9 pr18 disflex pt20">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/addr_blue_bg.png" alt="" class="w30 h30 mr11 mt4" />
        <div class="disflex jsbet flex1">
          <div class="addr_detail">
            <p class="fs13 c38 over_1 pt10 pb21">   {{cart_lists[0].locationAddress}}</p>
          </div>
        </div>
      </div>
    </div>


    <!--商品-->
    <div v-for="(cart_item,k) in cart_lists" :key="k">
      <OrderItem :orderData="cart_item" :orderIndex="k"
                 :index1="k"></OrderItem>

    </div>
    <div class="disflex jsbet bbf5f6 pl16 pr17 c38 lh44 bgfff">
      <span class="fs16">商品金额</span>
      <span class="fs14 fbold">￥{{cart_lists[0].orderPrice/100}}</span>
    </div>
    <div class="disflex jsbet pl16 pr17 c38 lh44 bgfff" v-if="orderState != 1">
      <span class="fs16">实付款</span>
      <span class="fs16 corange fbold">￥{{cart_lists[0].payPrice / 100}}</span>
    </div>

    <!--订单信息-->
    <div class="bgfff lh44 fs16 c38 mb15 mt10">
      <p class="before_line fs18 pl21 fbold">订单信息</p>
      <div class="disflex jsbet pl15 pr16">
        <span>订单编号</span>
        <span class="ca8">{{cart_lists[0].ordersNo}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>下单时间</span>
        <span class="ca8">{{createTime}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>支付方式</span>
        <span class="ca8">{{cart_lists[0].payType == 1 ? '线上支付' : '其他支付'}}</span>
      </div>
      <div class="disflex jsbet pl15 pr16">
        <span>配送方式</span>
        <span class="ca8">--</span>
      </div>

      <div class="pl15 pr16 ">
        <p>订单留言</p>
        <p class="fs14 ca8 lh18 pb3">
          {{cart_lists[0].remark || '如果你无法简洁的表达你的想法，那只说明你还不够了解它。'}}
        </p>
      </div>
      <div class="lh44 pl20 bgfff fs14 c38 disflex align-cen" v-if="order_type == 6">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/refund.png" alt="" class="w16 h16 mr7" />
        退款原因：{{cart_lists[0].refundRemark}}
      </div>
    </div>


    <!--操作-->
    <div class="disflex row-reverse pt9 pb11 lh30 bgfff fs14">

      <div class="textr lh30 pt10 pb10 fs14 bgfff" v-if="order_type == 1">
        <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="postRevoke(cart_lists[0])">撤销订单</span>
        <span class="disinblock bgblue textc cfff bradius20 w90 mr10" @click="toIM(cart_lists[0])">联系客户</span>
      </div>

      <div class="textr lh30 pt10 pb10 fs14 bgfff" v-if="order_type == 2">
        <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="toIM(cart_lists[0])">联系客户</span>
        <span class="disinblock bgblue textc cfff bradius20 w90 mr10" @click="confirmShipment(cart_lists[0])">确认发货</span>
      </div>

      <div class="textr lh30 pt10 pb10 fs14 bgfff" v-if="order_type == 3">
        <span class="disinblock bgblue textc cfff bradius20 w90 h32 mr10" @click="toIM(cart_lists[0])">联系客户</span>
      </div>

      <div class="textr lh30 pt10 pb10 fs14 bgfff" v-if="order_type == 4">
        <span class="disinblock textc ca8 bradius20 w90 be8 mr10" @click="toIM(cart_lists[0])">联系客户</span>
      </div>

      <div class="textr lh30 pt10 pb10 fs14 bgfff" v-if="order_type == 5">
        <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="toIM(cart_lists[0])">联系客户</span>
        <span class="disinblock textc ca8 bradius20 w90 be8 mr10" v-if="cart_item.refundState == 2" @click="refusalOfRefund(cart_lists[0])">拒绝退款</span>
        <span class="disinblock bgblue textc cfff bradius20 w90 mr10" v-if="cart_item.refundState == 2" @click="confirmRefund(cart_lists[0])">确认退款</span>
      </div>


    </div>

    <!--退款提醒-->
    <!--dialog-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="'退款原因'" @btn_tap="btn_tap" :dialog_ph="'请输入退款原因'"
                 :default="refund_reason"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>

    </div>

  </div>
</template>

<script>
  import AddressItem from '@/components/addressItem' //
  import OrderItem from '@/components/orderItem' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import StaticResources from '@/components/StaticResources';
  import WXAJAX from '../../utils/request'
  import util from '../../utils/index'


  export default {
    name: '',
    components: {AddressItem,OrderItem,DialogBox,StaticResources},
    data() {
      return{
        dialog_show:false,
        refund_reason:'',//退款原因
        cart_lists: [
          {
            orderPrice:0 ,
            payPrice : 0 ,
          }
        ],
        count_money:[],
        total_money:'8576' ,
        default_addr:{},
        orderIds : 0 ,//订单id
        orderState : 0 ,//订单状态
        isChooseAddr : false ,//是否可以选择地址
        order_type: 1,
        textInfo:{
          1 :{
            title : '等待付款' ,
            subtext : '请在30′00内进行支付，超时后订单将自动取消'
          } ,
          2 : {
            title:'等待发货',
            subtext:'请尽快发货'
          },
          3 : {
            title:'卖家已发货',
            subtext:'离收货还有9天19时自动确认'
          },
          4 : {
            title:'已完成',
            subtext:''
          },
          5 : {
            title:'交易取消',
            subtext:''
          },
          6 : {
            title:'退款成功',
            subtext:''
          },
        },
        createTime:''
      }
    },
    onShow(){
      console.log(this.orderState);
      // this.orderState = wx.getStorageSync('orderState') || 0 ;
      /*  if(this.orderState == 0) {
            this.orderState = this.$root.$mp.query.orderState || 0 ;
        }*/
      if(this.orderState == 1){
        //获取地址
        // this.getOrderAddr();
        this.isChooseAddr = true ;
      }else{
        this.isChooseAddr = false ;
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "订单详情"
      });
      let v = this;

      v.orderIds = this.$root.$mp.query.orderIds || 0 ;
      //获取订单详情
      v.inits() ;

    },
    methods: {
      toIM(orderInfo){
        const {userId, logo, name, personalWx, phone} = orderInfo;

        wx.navigateTo({url: '../IM/main?userId='+userId+'&logo='+logo+'&type=2'+'&name='+name+'&wxCode='+personalWx +'&phone='+phone})
      },
      postRevoke(cart_item){
        WXAJAX.POST({
          //参数订单状态
          orderState:5,
          ordersId :cart_item.ordersId,
        },'','/orders/updateOrderState').then((data) => {
          console.log("撤销成功")
          console.log(data)
          this.inits() ;
        }).catch((err) =>{
          console.log("撤销失败")
        });
        this.onceAgain()
      },
      confirmShipment(cart_item){
        WXAJAX.POST({
          //参数订单状态
          orderState:3,
          ordersId :cart_item.ordersId,
        },'','/orders/updateOrderState').then((data) => {
          console.log("发货成功")
          this.inits() ;
          console.log(data)
        }).catch((err) =>{
          console.log("发货失败")
        });
        this.onceAgain()
      },
      getOrderAddr(){
        let v = this ;
        // WXAJAX.POST({}, '', '/personal/getAddress').then((data) => {
        //   wx.hideLoading();
        //   for ( let i of data){
        //     if(i.isdefault == 1){
        //       v.default_addr = {
        //         name : i.receiveName ,
        //         tel : i.receivePhone ,
        //         address : i.locationAddress + i.detailedAddress ,
        //         addressId : i.addressId
        //       };
        //       break
        //     }
        //
        //   }
        // }).catch((err) => {
        //   wx.hideLoading();
        // })
      },
      inits(){

        let v = this ;

        wx.showLoading() ;

        WXAJAX.POST({
          ordersId    : v.orderIds,
        }, '', '/orders/getOrdersInfo').then((data) => {

          if(data){

            data.forEach(function (i,k) {
              v.orderState = i.orderState;
              if(i.ordersModelList){
                i.ordersModelList.forEach(function (i2,k2){
                  i2.price /= 100 ;

                });

                i.shopcartModelList = i.ordersModelList ;
                v.$set(v.cart_lists , k , i);
              }

            });
            v.createTime = util.getdate(v.cart_lists[0].createTime , 'dateTime') ;
            v.order_type = data[0].orderState;
          }else{
            v.cart_lists = [] ;
          }

          wx.hideLoading();

        }).catch((err) => {
          wx.hideLoading();
          v.cart_lists = [] ;
          console.log(err)
        })

      },
      //(5)拒绝退款
      refusalOfRefund(cart_item){
        WXAJAX.POST({
          refundState:1,
          ordersId:cart_item.ordersId,
        },'','/orders/updateRefundState').then((data) => {
          console.log("拒绝退款成功")
          this.cart_lists=[];
          this.getOrder()

        }).catch((err) =>{
          console.log("拒绝退款失败")
        });
        //重新请求
        this.onceAgain()
      },
      //(6)确认退款
      confirmRefund(cart_item){
        WXAJAX.POST({
          refundState:3,
          ordersId :cart_item.ordersId,
        },'','/orders/updateRefundState').then((data) => {
          this.cart_lists=[];
        }).catch((err) =>{
          console.log("退款失败")
        });
        //重新请求
        this.onceAgain()
      },
      btn_tap(method,text){//退款点击
        if(method == 'cancel'){

          this.dialog_show = false;

        }else if(method == 'save'){
          if(!text){
            wx.showToast({
              title:'请输入退款原因！',
              icon:'none',
            });
            this.dialog_show = false ;
            return
          }

          wx.showLoading() ;
          let v = this ;
          WXAJAX.POST({
            ordersId : v.orderIds,
            refundRemark:text ,
          }, '', '/orders/refundOrder').then((data) => {

            wx.hideLoading();
            v.dialog_show = false ;
            if(data){
              wx.showToast({
                title:'申请成功！',
                icon:'success',
              });
              setTimeout(function () {
                wx.navigateBack();
              },500)
            }

          }).catch((err) => {
            wx.hideLoading();
            v.dialog_show = false ;
            console.log(err)
          })

        }
      },
      changeOrder(type , orderId , status){//订单操作
        let _url = '' ,
          params = {} ;
        switch (type) {
          case 'cancel' ://撤销订单
            _url = '/orders/backRefundState';
            params = {
              ordersId : orderId
            };
            break;
          case 'payNow'://立即支付
            wx.navigateTo({url:'../orderConfirm/main?orderId='+orderId});
            return;
          case 'deliverGood'://提醒发货
            _url = '/orders/doReminder';
            params = {
              ordersId : orderId
            };
            break;
          case 'getGood'://确认收货 \  撤销退款
          case 'cancelRefund' :
            _url = '/orders/updateOrderState';
            params = {
              ordersId : orderId ,
              orderState : status ,
            };
            break;
          case 'oneMoreOrder' ://再来一单
            _url = '/orders/anotherOrder';
            params = {
              ordersIds : orderId
            };
            break;
        }

        wx.showLoading() ;

        let  v = this ;

        WXAJAX.POST( params, '', _url).then((data) => {

          console.log(data);
          wx.hideLoading();

          if(data){
            wx.showToast({
              title:'操作成功！',
              icon:'success',
              duration:1000,
            });

            setTimeout(function () {

              if(type == 'cancel' || type == 'oneMoreOrder'){
                wx.navigateBack();
              }else {

                v.inits();

              }

            },800)

          }


        }).catch((err) => {
          wx.hideLoading();
          console.log(err)
        })


      },
    }
  }
</script>

<style>
  .before_line{
    position: relative;
  }
  .before_line::before{
    content: '';;
    position: absolute;
    width: 8upx;
    height: 40upx;
    background: #34CBC1;
    left: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .order_detail_addr>div{
    padding-left: 32upx;
  }
</style>



























