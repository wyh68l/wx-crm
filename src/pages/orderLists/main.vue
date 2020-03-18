<template>
  <div>
    <!--menu-->
    <div class="disflex jsbet pl16 pr16 lh49 ca8 fs16 ordertype bgfff">
      <span :class="order_type == 1 ? 'active' : '' " @click="order_type_tap(1)">待付款</span>
      <span :class="order_type == 2 ? 'active' : '' " @click="order_type_tap(2)">待发货</span>
      <span :class="order_type == 3 ? 'active' : '' " @click="order_type_tap(3)">待收货</span>
      <span :class="order_type == 4 ? 'active' : '' " @click="order_type_tap(4)">已完成</span>
      <span :class="order_type == 5 || order_type == 6 ? 'active' : '' " @click="order_type_tap(5)">退款/售后</span>
    </div>

    <!--订单-->
    <div class="pl15 pr15" v-if="cart_lists.length">
      <div class="mt11" v-for="(cart_item,k) in cart_lists" :key="k">
<!--        <OrderItem :orderData="cart_item" :orderIndex="k"-->
<!--                   :index1="k"-->
<!--                   v-if="cart_item.prod.length===1"-->
<!--                   @order_tap="order_tap"-->
<!--        ></OrderItem>-->


        <OrderItemRow :orderData="cart_item"
                      @order_tap="order_tap"
        >

        </OrderItemRow>

        <div class="textr lh44 bgfff pr20">
          <span class="fs14 c333">共{{cart_item.ordersModelList[0].num}}件商品 实付款: </span>
          <span class="fs14 c333 pl10 fbold corange">¥{{((order_type == 1 ? cart_item.orderPrice : cart_item.payPrice)/100)}}</span>
        </div>


        <!--退款-->
        <div class="lh44 pl20 bgfff fs14 c38 disflex align-cen bradiusbl10" v-if="order_type == 6">
          <static-resources src="yimai_photos/crm/refund.png" alt="" className="w16 h16 mr7" />
          退款原因：{{cart_item.refundRemark}}
        </div>

        <div class="textr lh30 pt10 pb10 fs14 bgfff bradiusbl10" v-if="order_type == 1">
          <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="showTips(cart_item)">撤销订单</span>
          <span class="disinblock bgblue textc cfff bradius20 w90 mr10" @click="toIM(cart_item)">联系客户</span>
        </div>

        <div class="textr lh30 pt10 pb10 fs14 bgfff bradiusbl10" v-if="order_type == 2">
          <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="toIM(cart_item)">联系客户</span>
          <span class="disinblock bgblue textc cfff bradius20 w90 mr10" @click="confirmShipment(cart_item)">确认发货</span>
        </div>

        <div class="textr lh30 pt10 pb10 fs14 bgfff bradiusbl10" v-if="order_type == 3">
          <span class="disinblock bgblue textc cfff bradius20 w90 h32 mr10" @click="toIM(cart_item)">联系客户</span>
        </div>

        <div class="textr lh30 pt10 pb10 fs14 bgfff bradiusbl10" v-if="order_type == 4">
          <span class="disinblock textc ca8 bradius20 w90 be8 mr10" @click="toIM(cart_item)">联系客户</span>
        </div>

        <div class="textr lh30 pt10 pb10 fs14 bgfff bradiusbl10" v-if="order_type == 5">
          <span class="disinblock textc be8 ca8 bradius20 w90 mr10" @click="toIM(cart_item)">联系客户</span>
          <span class="disinblock textc ca8 bradius20 w90 be8 mr10" v-if="cart_item.refundState == 2" @click="refusalOfRefund(cart_item)">拒绝退款</span>
          <span class="disinblock bgblue textc cfff bradius20 w90 mr10" v-if="cart_item.refundState == 2" @click="confirmRefund(cart_item)">确认退款</span>
        </div>
      </div>
      <div class="textc lh42 fs12 ca8 bgf5f6" v-if="noMore">- 汉全科技集团出品 -</div>
    </div>
    <NoData v-else>暂无数据</NoData>

    <div class="textc disflex w60 h60 bradius50p bgblue disinblock goToUserCenter" @click="page_turn('mine')">
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png" alt="" class="w30 h30 mt15">
    </div>

    <div v-show="isShowCancelOrderBox">
      <DialogBox :dialog_title="'提示'" @btn_tap="cancelOrder" dialog_ph="确定要撤销该订单吗？"
                 :type="'hint2'"
                 :left="'取消'"
                 :right="'确定'"
      ></DialogBox>
    </div>

  </div>
</template>

<script>
  import OrderItem from '@/components/orderItem' // 订单项
  import OrderItemRow from '@/components/orderItemRow' // 订单项
  import NoData from '@/components/noData'
  import StaticResources from '@/components/StaticResources';
  import WXAJAX from '@/utils/request'
  import DialogBox from '@/components/dialogBox' // 对话框

  export default {
    name: '',
    components: {OrderItem , OrderItemRow, StaticResources, NoData, DialogBox},
    data() {
      return{
        order_type :'1' ,
        cart_lists: [],
        page : 1,
        loading: false,
        noMore: false,
        isShowCancelOrderBox: false,
        currentOrder: {},
        tipsTitle: '',
        isPageLoading: false,
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "订单"
      });
      this.getOrder();
    },
    async onPullDownRefresh() {
      this.reset();
      await this.getOrder();
      wx.stopPullDownRefresh();
    },
    onReachBottom(){
      this.getOrder();
    },
    methods: {
      showTips(orderInfo, type){
        this.tipsTitle = '确定要撤销该订单吗？';

        this.currentOrder = orderInfo;
        this.isShowCancelOrderBox = true;
      },
      cancelOrder(str){
        if (str == 'save') {
          this.postRevoke(this.currentOrder);
        }
        this.isShowCancelOrderBox = false;
      },
      toIM(orderInfo){
        const {userId, logo, name, personalWx, phone} = orderInfo;
        let selfId = wx.getStorageSync('userId');

        if (userId == selfId) {
          wx.showToast({
            title: '不能和自己聊天~~',
            duration: 2000,
            icon: 'none'
          })
          return;
        }

        wx.navigateTo({url: '../IM/main?userId='+userId+'&logo='+logo+'&type=2'+'&name='+name+'&wxCode='+personalWx +'&phone='+phone})
      },
      page_turn(url){
        wx.reLaunch({url:'../'+url+'/main'});
      } ,
      order_tap(orderIds){
        wx.setStorageSync('orderState', this.order_type);

        wx.navigateTo({url: '/pages/orderDetail/main?orderIds=' + orderIds + '&orderState=' + this.order_type});
      },
      reset() {
        this.page = 1;
        this.nodata = false;
        this.isPageLoading = false;
        this.cart_lists = [];
      },
      getOrder(){
        if (this.isPageLoading) return;

        this.isPageLoading = true;
        return WXAJAX.POST({
          //参数订单状态
          pageNum: this.page,
          orderState:this.order_type
        },'','/orders/selectOrdersInfo').then((data) => {
          this.isPageLoading = false;
          if(data){
            if(this.page == 1){
              this.cart_lists = [];
            }
            this.page++;
            this.cart_lists.push(...data);
          }else {
            this.noMore = true;
          }

        }).catch((err) =>{
          this.isPageLoading = false;
        })
      },
      //(3)
      order_type_tap(type_id){
        //选择订单类型
        this.order_type = type_id;
        this.isPageLoading = false;
        this.page = 1;
        this.cart_lists=[];
        this.getOrder();
      },
      //(4)撤销订单
      postRevoke(cart_item){
        if(this.loading) return;

        this.loading=true;
        WXAJAX.POST({
          //参数订单状态
          orderState:5,
          ordersId :cart_item.ordersId,
        },'','/orders/updateOrderState').then((data) => {
          this.loading =false;
          console.log("撤销成功")
          wx.showToast({
            title: '操作成功',
            duration: 2000,
            icon: 'none'
          });
          this.reset();
          this.getOrder();
        }).catch((err) =>{
          console.log("撤销失败")
          this.loading =false;
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
      },
      //(5)拒绝退款
      refusalOfRefund(cart_item){
        if(this.loading) return;
        this.loading = true;

        WXAJAX.POST({
          refundState:1,
          ordersId:cart_item.ordersId,
        },'','/orders/updateRefundState').then((data) => {
          this.loading = false;
          console.log("拒绝退款成功")
          wx.showToast({
            title: '操作成功',
            duration: 2000,
            icon: 'none'
          });
          this.reset();
          this.getOrder()

        }).catch((err) =>{
          this.loading = false;
          console.log("拒绝退款失败")
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
        //重新请求
        // this.onceAgain()
      },
      //(6)确认退款
      confirmRefund(cart_item){
        if(this.loading) return;

        this.loading = true;
        WXAJAX.POST({
          refundState:3,
          ordersId :cart_item.ordersId,
        },'','/orders/updateRefundState').then((data) => {
          this.loading = false;
          wx.showToast({
            title: '操作成功',
            duration: 2000,
            icon: 'none'
          });
          this.reset();
          this.getOrder()
        }).catch((err) =>{
          this.loading = false;
          console.log("退款失败")
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
        //重新请求
        // this.onceAgain()
      },
      // 确认发货
      confirmShipment(cart_item){
        if(this.loading) return;
        this.loading = true;
        WXAJAX.POST({
          //参数订单状态
          orderState:3,
          ordersId :cart_item.ordersId,
        },'','/orders/updateOrderState').then((data) => {
          console.log("发货成功")
          this.loading = false;
          wx.showToast({
            title: '操作成功',
            duration: 2000,
            icon: 'none'
          });
          this.reset();
          this.getOrder()
        }).catch((err) =>{
          this.loading = false;
          console.log("发货失败")
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
        // this.onceAgain()
      },
      //(7)
      onceAgain(){
        WXAJAX.POST({
          //参数订单状态
          orderState:5
        },'','/orders/selectOrdersInfo').then((data) => {
          this.cart_lists = data;
          console.log("成功")
        }).catch((err) =>{
          console.log("失败")
        });
      }

    }
  }
</script>

<style>
  .ordertype .active{
    color: #00a0e9;
    border-bottom: 6upx solid #00a0e9;
  }
  .goToUserCenter{
    position: fixed;
    right: 20upx;
    bottom: 102upx;
    z-index: 99;
    box-sizing: border-box;
    text-align: center;
  }
</style>








































