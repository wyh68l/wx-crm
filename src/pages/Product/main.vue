<template>
    <div class="posre pt204 borderbox wrapper h100p">
        <div class="product_bg posab w100p top0 zindex-1">
            <img mode="aspectFill" :src="company_msg.company_logo" alt=" " class="w100p h214">
        </div>
        <div class="mt-18">
            <!--title begin-->

            <div class="fs18 cfff disflex pl15 pr16">
                <img :src="company_msg.admin_logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png'"
                     mode="aspectFill"
                     alt="" class="w60 h60 bradius5 mr10" />
                <div class="">
                    <b class="pb10 fbold over_1 w274">{{company_msg.company_name}}</b>
                    <div class="disflex jsbet">
                        <div class="disflex align-cen bgblue fs10 bradius5 w65 jscen lh20 ">

                            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/check_mini.png" alt="" class="w10 h10 mr5" />
                            <span>认证企业</span>

                        </div>

                        <div class="disflex align-cen">

                            <button class='w24 pr10 bgfff contentbox textr disflex align-cen ' open-type="share" hover-class="other-button-hover">
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share.png" alt="" class="w15 h15 mr7" />
                            </button>
                            <span @click="collect" v-if="isCollect" >
                              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/star.png"
                                                alt="" class="w20 h20"/>
                            </span>
                            <span @click="collect" v-if="!isCollect">
                              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/star_gray.png"
                                                alt="" class="w20 h20 posre"  />
                            </span>

                        </div>


                    </div>
                </div>

            </div>

            <!--title end-->

            <!--lists begin-->
            <div class="posre pl15 pr42">
                <scroll-view scroll-x class="nav" scroll-with-animation>
                    <div class="">
                        <div class="nav-item"
                             v-for="(navItem,idx) in menu" :key="idx"
                             :class="menu_id == navItem.goodstypeId ?'active':''"
                             @click="menu_tap(navItem.goodstypeId)">{{navItem.name}}
                        </div>
                    </div>
                </scroll-view>
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/right_2.png" alt="" class="w10 h10 menu_more posab" />
            </div>

            <div class="disflex jsbet bgf5f6 pl15 pr16 wrap pb23">
                <div class="prod_item bradius10 w168 h270 mt10 bgfff" v-for="(v,k) in prod_lists" :key="k"
                    @click="toProdDetail(v.goodsId)">
                    <img mode="aspectFill" :src="v.prodLogo" alt="" class="w100p h168">
                    <p class="fs14 c38 over_2 pl16 pr22 pt10 mb10">{{v.goodsName}}</p>
                    <p class="fs12 pl16">
                        <span class="corange pr7"><b class="disinblock">￥ </b><b class="fs20 fbold disinblock">{{v.price}}</b></span>
                        <!--<span class="ca8 line-through">￥198</span>-->
                    </p>
                </div>
            </div>
            <!--lists end-->

        </div>

        <!--右边悬浮框-->
        <div class="prod_float_right trans2 overhidden" :class="right_float_show ? 'h201' : 'h0' ">
            <RightFloat></RightFloat>
        </div>
        <div class="posfix right11 add_white bottom10 w40 h40 bg_line_blue bradius50p textc lh40" @click="right_float_show = !right_float_show">

        </div>

        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>

    </div>
</template>

<script>
    import RightFloat from '@/components/rightFloat' // 订单项
    import WXAJAX from '../../utils/request'
    import StaticResources from '@/components/StaticResources';

    export default {
        name: '',
        components: {RightFloat, StaticResources},
        data() {
            return {
                menu: [ ],
                menu_id: 0,
                prod_lists:[],
                nodata:false ,//是否已经没有数据
                COMPANYID : 0 ,
                company_msg:{
                    admin_logo:'',
                    company_logo:'',
                    company_name:''
                },
                currentPage:1,
                isCollect : false ,//是否收藏
                collectionId:0,
                page:1,
                isLoading : false ,//是否在加载
                right_float_show:false ,//右边悬浮框

            }
        },
        onShow() {

            //获取当前的企业
            this.COMPANYID = wx.getStorageSync('COMPANYID') || 0 ;
            this.prod_lists = [] ;
            this.page = 1;
            if(this.menu_id!=0){
                wx.showLoading();
                this.getProds();
            }

        },
        mounted(){

            this.checkCollect();
            this.getcompany();
            this.getMeuns();
        },
        onPageScroll(){
            this.right_float_show = false ;
        },
        async onPullDownRefresh() {
            // to doing..
            // 停止下拉刷新
            wx.showNavigationBarLoading();
            this.page = 1 ;
            this.prod_lists = [] ;
            this.nodata = false ;
            this.isLoading = false ;
            this.getProds();
            wx.showLoading();
            wx.stopPullDownRefresh();
            setTimeout(function () {
                wx.hideNavigationBarLoading();
            },300)
        },
        methods: {
            getcompany(){//获取企业信息

                let v = this ;

                WXAJAX.POST({
                    companyId  : v.COMPANYID,

                }, '', '/goods/getCompanyInfo').then((data) => {
                    v.company_msg = {
                        admin_logo:data.userLogo,
                        company_logo:data.companyLogo,
                        company_name:data.companyName
                    }

                }).catch((err) => {

                })
            },
            getMeuns(){//获取所有的分类

                let v = this ;

                wx.showLoading();
                WXAJAX.POST({
                    companyId : v.COMPANYID,

                }, '', '/goods/getGoodsType').then((data) => {
                    // wx.hideLoading();
                    if(data){
                        v.menu_id = data[0].goodstypeId ;
                        v.menu = data ;
                        //获取分类下的产品
                        v.getProds();
                    }else{
                        wx.hideLoading();
                        v.menu = [] ;
                    }
                }).catch((err) => {
                    wx.hideLoading();
                    v.menu = [];
                })
            },
            checkCollect(){//
                WXAJAX.checkCollect({
                    itemType : 3 ,
                    itemId : this.COMPANYID ,
                }).then((data)=>{
                    this.isCollect = data.status ;
                    this.collectionId = data.collectionId || 0 ;
                }).catch((err)=>{

                })
            },
            getProds(){//获取产品
                let v = this ;
                if(v.isLoading){
                    wx.hideLoading();
                    return
                }
                v.isLoading = true ;
                WXAJAX.POST({
                    goodstypeId : v.menu_id,
                    pageNum: v.page ,
                }, '', '/goods/getGoodsList').then((data) => {
                    wx.hideLoading();
                    if(data){
                        data.forEach(function (i,k) {
                            if(i.goodPhoto){
                                i.prodLogo = i.goodPhoto.split(',')[0];
                            }else{
                                i.prodLogo = '' ;
                            }
                            if(i.price){
                                i.price /= 100 ;
                            }else{
                                i.price = '' ;
                            }
                        });
                        v.prod_lists = [...v.prod_lists , ...data] ;
                        v.page ++ ;
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }else{
                        // v.prod_lists = [] ;
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }
                }).catch((err) => {
                    console.log(err);
                    wx.hideLoading();
                    if(err.code == 204){
                        v.nodata = true ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);
                })


            },

            menu_tap(id) {
                this.menu_id = id;
                this.page = 1 ;
                this.nodata = false ;
                this.isLoading = false ;
                this.prod_lists = [] ;
                wx.showLoading() ;
                this.getProds() ;
            },
            toProdDetail(id){//进入详情
                wx.navigateTo({url:'../prodDetail/main?goodId='+id});
            },
            collect(){//收藏企业
                wx.showLoading();
                let _url = '' ,
                    _request = {} ;
                if(this.isCollect){//取消收藏
                    _url = '/personal/delCollection' ;
                    _request = {
                        itemType : 3 ,
                        itemId : this.COMPANYID ,
                    }
                }else{//添加收藏
                    _url = '/personal/addCollection' ;
                    _request = {
                        itemType : 3 ,
                        itemId : this.COMPANYID ,
                    }
                }

                WXAJAX.changeCollect(_request , _url ).then((data)=>{

                    console.log(data);
                    if(data){
                        this.isCollect = !this.isCollect ;
                    }
                    wx.hideLoading() ;

                }).catch((err)=>{
                    wx.hideLoading() ;
                });

            }
        },
        onReachBottom() {
            wx.showLoading({
                title : '加载中...',
            });
            let v = this ;
            v.getProds();

        },
    }
</script>

<style>
    .product_bg {
        height: 295px;
        background: #fff;
    }

    .menu_more {
        right: 32upx;
        top: 0;
        bottom: 0;
        margin: auto;
    }

    .nav {
        height: 90upx;
        width: 100%;
        line-height: 88upx;
        font-size: 28upx;
        white-space: nowrap;
        /*   position: fixed;
           top: 0;
           left: 0;
           z-index: 99;*/
    }

    .nav-item {
        /*width: 20%;*/
        display: inline-block;
        text-align: center;
        margin-right: 48upx;
    }

    .nav-item.active {
        border-bottom: 4upx solid #00a0e9;
        color: #00a0e9;
    }

    .prod_float_right>div{
        bottom: 120upx;
    }
</style>





























