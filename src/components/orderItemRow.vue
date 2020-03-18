<template>
  <div class="bgfff bradiustr10 orderrow"  @click="order_tap(orderData.ordersId)">
    <div class="pl15 lh44 posre disflex jsbet pl20 pr21">
      <div class="disflex align-cen">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/company_name.png" alt="" class="w16 h16 mr7">
        <span class="fs14 pr7">{{orderData.companyName}}</span>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10">
      </div>

      <span v-if="orderData.status==0" class="corange fs14">等待付款</span>
      <span v-if="orderData.status==1" class="cblue fs14">已完成</span>
    </div>

    <!--产品-->
    <div class="disflex posre pb21"
         :class="'pl15'"
         v-for="(prod_item,k) in orderData.ordersModelList"
         :key="k">

      <div class="disflex w100p pr16">
        <img :src="prod_item.photoUrl" alt="" class="w70 h70 mr11 bradius5" mode="aspectFill">
        <div class="flex1">
          <p class="over_1 fs14 c38 w200">{{prod_item.goodsName || prod_item.name}}</p>
          <div class="mt8">
                        <span class="pl7 pr8 lh20 fs12 ca8 mr8">
                            {{prod_item.specName}}；{{prod_item.specAttribute}} x {{prod_item.num}}
                        </span>
            <div>
              <span class="pl7 pr8 lh20 fs12 ca8 mr8">￥{{(prod_item.price/100)}}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
<!--    <div class="posre pl15 pr16">-->
<!--      <scroll-view scroll-x class="nav disflex" scroll-with-animation style="height:100%">-->
<!--        <div class="disflex jsbet mb10">-->

<!--          <div class="disflex ">-->
<!--            <img :src='orderData.ordersModelList[0].photoUrl' alt="" class="w70 h70 bradius5 mr7 disinblock">-->
<!--            <div class="disflex fd ml1" v-if="">-->
<!--              <span class="fs16 c68">{{orderData.ordersModelList[0].goodsName}}</span>-->
<!--              <span class="fs14 mt10 cb8">{{orderData.ordersModelList[0].specName}}</span>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="disflex w100p pr16">-->
<!--            &lt;!&ndash;                  <img :src="prod_item.photoUrl" alt="" class="w70 h70 mr11 bradius5">&ndash;&gt;-->
<!--            <div class="flex1">-->
<!--              <p class="over_1 fs14 c38 w200">{{prod_item.goodsName || prod_item.name}}</p>-->


<!--              <div class="mt8">-->
<!--                        <span class="pl7 pr8 lh20 fs12 ca8 mr8">-->
<!--                            {{prod_item.specName}}；{{prod_item.specAttribute}} x {{prod_item.num}}-->
<!--                        </span>-->
<!--                <div>-->
<!--                  <span class="pl7 pr8 lh20 fs12 ca8 mr8">￥{{(prod_item.price)}}</span>-->
<!--                </div>-->
<!--              </div>-->


<!--            </div>-->

<!--          </div>-->
<!--          &lt;!&ndash;                <div>&ndash;&gt;-->
<!--          &lt;!&ndash;                  <span class="fs14 ca8">{{orderData.ordersModelList[0].allPrice/100}}</span>&ndash;&gt;-->
<!--          &lt;!&ndash;                </div>&ndash;&gt;-->
<!--        </div>-->

<!--      </scroll-view>-->
<!--    </div>-->
  </div>
</template>




<script>
  export default {
    name: '',
    props:['orderData'],
    components: {},
    data() {
      return{
      }
    },
    mounted() {

    },
    methods: {
      order_tap(orderIds){
        this.$emit('order_tap',orderIds);
      },
    }
  }
</script>

<style>
  .orderrow .nav {
    height: 220upx;
    width: 100%;
    white-space: nowrap;
    padding-top: 40upx;
    box-sizing: border-box;
  }

  .orderrow .nav-item {
    display: inline-block;
  }
</style>
















