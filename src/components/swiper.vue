<template>

    <div class="swiper-wrap-self " :class="self_class">
        <swiper class="swiper-inner" @change="swiperChange" :indicator-dots="indicator" :current="cur"
                :circular="circular" :autoplay="autoplay" :interval="interval" :duration="duration">
            <block v-for="(item,index) in imgUrls" :index="index" :key="index">
                <swiper-item>
                    <!-- scaleToFill widthFix -->
                    <image class="banner-img" :src="item"  mode="widthFix" @click="swipclick(index)"></image>
                    <!--<div class="w100p h100p bgbf"></div>-->
                </swiper-item>
            </block>
        </swiper>
        <!--重置小圆点的样式  -->
        <view class="dots">
            <block v-for="(item,index) in imgUrls" :index="index" :key="index">
                <view class="dot" :class="{'active':  index == cur}"></view>
            </block>
        </view>
        <!--重置小圆点的样式 end -->
    </div>

</template>

<script>
    export default {
        name: "selfswiper",
        props:['imgUrls','self_class'] ,
        data(){
            return{

                indicator: false, //是否显示指示点
                interval: 5000,  //自动切换时间间隔
                duration: 400,  //滑动动画时长
                autoplay: false, //是否自动切换
                circular: true, //是否采用衔接滑动
                cur: 0 ,        //当前所在滑块的index

                imgs : []
            }
        },
        mounted(){

        },
        methods:{
            //轮播图的切换事件
            swiperChange(e) {
                this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
                this.$emit('swiperChange' , this.cur);
            },
            swipclick(index) {
               this.$emit('swipclick' , index) ;
            }
        }
    }
</script>

<style>
    .swiper-wrap-self {
        width: 100%;
        background: #fff;
        position: relative;
        padding-top: 30upx;
    }

    .swiper-wrap-self .swiper-inner {
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }

    .swiper-wrap-self image {
        height: 100%;
        width: 100%;
    }

    .swiper-wrap-self .dots {
        width: 100%;
        position: absolute;
        right: 0;
        bottom: 26upx;
        left: 0;
        display: flex;
        justify-content: center;
    }

    /*未选中时的小圆点样式 */
    .swiper-wrap-self .dot {
        width: 20upx;
        height: 20upx;
        margin-right: 20upx;
        border-radius: 200upx;
        background-color: rgba(255, 255, 255, .4);
    }

    /*选中以后的小圆点样式  */
    .swiper-wrap-self .active {
        background-color: white;
    }
</style>









