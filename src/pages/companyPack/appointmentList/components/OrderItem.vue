<template>
  <div class="order-item">
    <div class="time textc">
      <div class="appointment-time">
        预约时间：{{orderInfo.appointmentTime}}
      </div>
      <div class="order-time mt10">
        下单时间：{{orderInfo.createTime}}
      </div>
      <div class="mt10" v-if="orderInfo.state == 3 || orderInfo.state == 4">
        {{orderInfo.state == 3 ? ('完成时间：'+orderInfo.completionTime) : ''}}
        {{orderInfo.state == 4 ? ('取消时间：'+orderInfo.cancellationTime) : ''}}
      </div>
    </div>
    <ProductCard
      :title="orderInfo.productsName"
      :desc="orderInfo.describe"
      :price="orderInfo.price"
      :typeName="orderInfo.productsTypeName"
      :imgUrl="orderInfo.photo"
      outStyle="margin-top:0"
    />
    <div class="client-info">
      <img :src="orderInfo.avatarUrl || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'" alt=""
           mode="aspectFill"
           class="w60 h60 mr10 bradius5">
      <div>
        <div class="w100p">
          姓名：{{orderInfo.name}}
        </div>
        <div class="w100p">
          电话：{{orderInfo.phone}}
        </div>
        <div class="w100p">
          类型：{{orderInfo.typeName}}
        </div>
      </div>
    </div>
    <div class="remark" v-if="orderInfo.remark">
      备注：{{orderInfo.remark}}
    </div>
    <div class="operation" v-if="orderInfo.state == 1 || orderInfo.state == 2">
      <div class="textr lh30 pt10 pb10 fs14 bgfff pr21">
        <span class="disinblock textc be8 ca8 bradius20 w90" @click="cancel" v-if="orderInfo.state == 1 || orderInfo.state == 2">取消预约</span>
        <span class="disinblock bgblue textc cfff bradius20 w90" @click="confirmUse" v-if="orderInfo.state == 1">确认预约</span>
      </div>
    </div>
  </div>
</template>

<script>
  import ProductCard from '@/components/ProductCard' // 订单项

  export default {
    name: "OrderItem",
    components: { ProductCard },
    props: {
      orderInfo: {
        type: Object,
        default(){return {}},
      }
    },
    methods:{
      cancel(e){
        this.$emit('cancelOrder', e);
      },
      confirmUse(e) {
        this.$emit('confirmUse', e);
      }
    },
  }
</script>

<style scoped>
  .order-item{
    border-radius: 20upx;
    background: white;
    margin-top: 20upx;
    overflow: hidden;
  }

  .time{
    padding: 30upx 0;
    background: #51CBCD;
    font-size: 28upx;
    color: white;
  }

  .client-info{
    padding: 40upx 30upx;
    border-top: 2upx solid #F5F5F6;
    border-bottom: 2upx solid #F5F5F6;
    color: #333333;
    font-size: 24upx;
    display: flex;
  }

  .client-info>div{
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .operation span{
    margin-right: 20upx;
  }

  .operation span:last-child{
    margin-right: 0;
  }

  .remark{
    padding: 40upx 30upx;
    font-size: 28upx;
    color: #a8a8a8;
  }
</style>
