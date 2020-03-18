<template>

    <div class="posfix fs10 bradius5 ca8 textc floats trans2 bottom60 right6 shadow_gray bgfff w50 pb15">

        <div class="pt16" @click="page_turn('shopCart')">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/cart_gray.png" alt="" class="w24 h24">
            <p class="pt5">购物车</p>
        </div>
        <div class="pt16 posre" @click="page_turn('IM')">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/msg_gray.png" alt="" class="w24 h24">
            <span class="right_point"></span>
            <p class="pt5">咨询</p>
        </div>
        <div class="pt16" @click="page_turn('usercenter')">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_gray.png" alt="" class="w24 h24">
            <p class="pt5">我的</p>
        </div>
    </div>

</template>

<script>
    export default {
        name: "rightFloat",
        methods:{
            page_turn(url){
                wx.navigateTo({url:'../'+url+'/main'});
            }
        }
    }
</script>

<style>
.right_point{
    position: absolute;
    width: 20upx;
    height: 20upx;
    background: #FD634E;
    border-radius: 50%;
}
    .h0 .floats{
        height: 0;
        overflow: hidden;
        padding-bottom: 0;
    }
</style>




























