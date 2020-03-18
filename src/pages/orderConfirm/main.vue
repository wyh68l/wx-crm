<template>
    <div class="pb50">
        <div class="mt10 mb10">
            <AddressItem :addr="default_addr" :ismore="true"></AddressItem>
        </div>


        <!--商品-->
        <div class="mb10" v-for="(cart_item,k) in cart_lists">
            <OrderItem :orderData="cart_item" :orderIndex="k" :key="k"
                       :index1="k"
                       :isorder="true"
            ></OrderItem>
            <!--小计-->
            <div class="textr lh44 pr15 fs14 c333 bgfff">
                <span> 共{{cart_item.shopcartModelList.length}}件商品</span>
                <span> 小计: <span class="corange fs16 fbold">￥{{cart_item.orderPrice}}</span></span>
            </div>
        </div>

        <!--留言-->
        <div class="pl16 pr16 fs16 c38 lh44 bgfff disflex bbf5f6">
            <label for="mark">买家留言</label>
            <input id="mark" class="fs14 phe8 lh44 h44 pl16 flex1" type="text" v-model="remark"
                   placeholder="选填:填写内容已和卖家协商确认">
        </div>

        <!--提交-->
        <div class="disflex row-reverse fix_bottom pt5 pb5 lh39 bgfff">
            <span class="bg_line_blue textc cfff fs18 fbold bradius20 w110 mr16" @click="toPay">提交订单</span>
            <div class="fs16 c38 pr26">
                <span>实付:</span>
                <span class="corange fbold">￥{{total_money}}</span>
            </div>
        </div>

    </div>
</template>

<script>
    import AddressItem from '@/components/addressItem' // 订单项
    import OrderItem from '@/components/orderItem' // 订单项
    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {AddressItem, OrderItem},
        data() {
            return {
                remark: '',
                cart_lists: [],
                count_money: [],
                total_money: 0 ,
                default_addr : {
                    name  : '' ,
                    tel :'',
                    address : '' ,
                } ,
                orderId:0,//订单id
            }
        },
        onShow(){
            //获取默认地址
            this.getOrderAddr();
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "订单确认"
            });
            let v = this;
            v.orderId = this.$root.$mp.query.orderId || 0 ;
            console.log(this.orderId)

            v.getOrderDetail();

        },
        methods: {
            getOrderAddr(){
                let v = this ;
                WXAJAX.POST({}, '', '/personal/getAddress').then((data) => {
                    wx.hideLoading();
                    for ( let i of data){
                        if(i.isdefault == 1){
                            v.default_addr = {
                                name : i.receiveName ,
                                tel : i.receivePhone ,
                                address : i.locationAddress + i.detailedAddress ,
                                addressId : i.addressId
                            };
                            break
                        }

                        console.log('default_addr -- ',v.default_addr);
                    }
                }).catch((err) => {
                    wx.hideLoading();
                })
            },
            getOrderDetail(){//获取订单信息
                let v = this ;
                WXAJAX.POST({
                    ordersIds : v.orderId ,
                }, '', '/orders/getOrderInfo').then((data) => {
                    wx.hideLoading();
                    if(data){
                        v.total_money = 0 ;
                        data.forEach(function (item,index1) {
                            item.ordersModelList.forEach(function (item2, index2) {
                                item2.price /= 100 ;
                                let money = item2.price * item2.num;
                                v.count_money.push(money);
                            });
                            item.shopcartModelList = item.ordersModelList ;
                            item.orderPrice /= 100 ;
                            v.total_money += item.orderPrice ;
                        });
                        v.cart_lists = data ;
                    }
                    console.log(data)
                }).catch((err) => {
                    wx.hideLoading();
                })
            },
            toPay() {//订单支付

                let v = this ;

                if(!v.default_addr.addressId){
                    wx.showToast({
                        title: '请先添加地址！',
                        icon: 'none'
                    });
                }

                WXAJAX.ToPay({
                    ordersIds : v.orderId ,
                    addressId:v.default_addr.addressId,
                    remark:v.remark
                }).then((data) =>{
                    console.log(data);
                }).catch( (err) =>{
                    console.log(err);
                    setTimeout(function () {
                        wx.navigateTo({url:'../orderLists/main?status=1'})
                    })
                });

            }
        }
    }
</script>

<style>

</style>



























