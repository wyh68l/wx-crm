<template>
    <div class="w100p h211">

        <div class="edit_banner trans2" :class="changeing ? 'fade' : '' " v-if="imgUrls.length > 0">
            <swiper class="swiper-inner" @change="swiperChange" :indicator-dots="indicator" :current="cur"
                    :circular="circular" :autoplay="autoplay" :interval="interval" :duration=
                            "duration">
                <block v-for="(item,index) in imgUrls" :index="index" :key="key">
                    <swiper-item>
                        <image class="banner-img" :src="item.src"  mode="widthFix" @click="swipclick(index)"></image>
                        <div class="tags">
                            <span class="w30 h30 del disflex align-cen jscen mb10" >
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png" alt="" class="w17 h17" />
                            </span>
                            <span class="posre w30 h30 add disblock" @click="uploadpic(index)"></span>
                        </div>
                    </swiper-item>
                </block>
            </swiper>
            <!--重置小圆点的样式  -->
            <view class="dots">
                <block v-for="(item,index) in imgUrls" :index="index" :key="key">
                    <view class="dot" :class="{'active':  index == cur}"></view>
                </block>
            </view>
            <!--重置小圆点的样式 end -->
        </div>

        <div v-else class="w100p h100p bgf5f6 textc pt30" @click="uploadpic(-1)">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/VR.png" alt="" class="w100 h100 mb5" />
            <p class="fs14 ca8" >点击添加图片</p>
        </div>

        <canvas style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
                canvas-id="Canvas"></canvas>

    </div>
</template>

<script>
    import util from '../utils/index'
    import StaticResources from '@/components/StaticResources';

    export default {
        name: "editBanner",
        components: {StaticResources},
        data(){
            return{

                indicator: false, //是否显示指示点
                interval: 5000,  //自动切换时间间隔
                duration: 400,  //滑动动画时长
                autoplay: true, //是否自动切换
                circular: true, //是否采用衔接滑动
                cur: 0 ,         //当前所在滑块的index

                imgUrls:[],
                changeing:false,//是否在选择切换图片
            }
        },
        mounted(){

        },
        onShow(){
            this.imgUrls = [] ;
        },
        methods:{
            //轮播图的切换事件
            swiperChange(e) {
                this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
                this.$emit('swiperChange' , this.cur);
            },
            swipclick(index) {
                this.$emit('swipclick' , index) ;
            },
            async uploadpic(str) {
                   if(this.imgUrls.length >= 5){
                       wx.showToast({
                           title: '最多选择五张！',
                           duration: 1500,
                           icon : 'none'
                       });
                       return
                   }
                let path = await util.chooseImage();


                let d = await util.getImginfo(path[0]);
                let h = 500;
                let w = 500;
                wx.showLoading();
                this.changeing = true ;

                try {
                    let bs = await util.Tobase64(path[0], h, w);
                    // this.imgurltest = bs
                    wx.hideLoading();

                    if(str == -1 ){//还未添加过图片
                        this.imgUrls.push({
                            src:bs,
                        })
                    }else{
                        //已经选择图片，再添加一张
                        this.imgUrls.push({
                            src:bs
                        })

                    }


                    this.changeing = false ;
                } catch (e) {
                    wx.hideLoading();
                }
            },
        }
    }
</script>

<style>
    .edit_banner {
        width: 100%;
        height: 100%;
        background: #fff;
        position: relative;
    }

    .edit_banner .swiper-inner {
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }

    .edit_banner .banner-img {
        height: 100%;
        width: 100%;
    }

    .edit_banner .dots {
        width: 100%;
        position: absolute;
        right: 0;
        bottom: 26upx;
        left: 0;
        display: flex;
        justify-content: center;
    }

    /*未选中时的小圆点样式 */
    .edit_banner .dot {
        width: 20upx;
        height: 20upx;
        margin-right: 20upx;
        border-radius: 200upx;
        background-color: rgba(255, 255, 255, .4);
    }

    /*选中以后的小圆点样式  */
    .edit_banner .active {
        background-color: white;
    }

    swiper-item{
        position: relative;
    }
    swiper-item .tags{
        position: absolute;
        right: 20upx;
        top: 20upx;
    }
    swiper-item .tags span{
        border-radius: 50%;
        background: rgba(0,0,0,.5);
    }
    swiper-item span.add::before,swiper-item span.add::after{
        position: absolute;
        content: '';
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        background: #a2a2a2;
    }
    swiper-item span.add::before{
        width: 30upx;
        height: 2upx;
    }
    swiper-item span.add::after{
        width: 2upx;
        height: 30upx;
    }

    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        /*初始状态 透明度为0*/
        40% {
            opacity: 0;
        }
        /*过渡状态 透明度为0*/
        100% {
            opacity: 1;
        }
        /*结束状态 透明度为1*/
    }

    @-webkit-keyframes fade-in { /*针对webkit内核*/
        0% {
            opacity: 0;
        }
        40% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

    .edit_banner.fade {
        animation: fade-in;
        animation-duration: .5s;
        /*-webkit-animation:fade-in 1.5s;*/
    }
</style>







































