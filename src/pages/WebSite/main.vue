<template>
    <div>

        <SelfSwiper :imgUrls="company.photos" :self_class="'h211'" @swiperChange="swiperChange"></SelfSwiper>

        <!--企业介绍-->
        <div class="pl15 pr15">
            <p class="lh45 fs16 c38 fbold">企业介绍</p>

            <div class="bgfff h211 shadow_gray pl15 pt20 pb15 pr15 fs16" v-html="company.companyIntroduce"></div>

        </div>


        <!--产品介绍-->
        <div class="pl15 pr15">
            <p class="lh45 fs16 c38 fbold">产品介绍</p>

            <div class="bgfff h211 shadow_gray pl15 pt20 pb15 pr15 fs16" v-html="company.goodsIntroduce"></div>

        </div>

        <!--企业视频-->
        <div class="pl15 pr15">
            <p class="lh45 fs16 c38 fbold">企业视频</p>

            <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
            <video id="myVideo" class="bradius5"
                   :src="company.videoUrl"
                   enable-danmu
                   enable-danmu
                   danmu-btn
                   controls
            ></video>
            <!--src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"-->
            <!--:src="company.videoUrl"-->


        </div>


        <!--企业招聘-->
        <div class="pl15 pr15">
            <p class="lh45 fs16 c38 fbold">企业招聘</p>

            <div class="bgfff pt15 pl16 pr15 pb15 shadow_gray mb10 bradius5"
                 @click="page_turn('joinUsDetail' , v.recruitId)"
                 v-for="(v,k) in invites"
                 :key="k">
                <p class="disflex jsbet fs14">
                    <span class="c38 fbold">{{v.position}}</span>
                    <span class="cblue fbold">{{v.salary}}</span>
                </p>

                <div class="disflex jsbet fs12 ca8 pt13">
                    <div>
                        {{v.recruitAddress}} | {{v.education}} | {{v.experience}}
                    </div>
                </div>
            </div>

        </div>

        <!--关于我们-->
        <div class="pl15 pr15">
            <p class="lh45 fs16 c38 fbold">关于我们</p>

            <div class="bgfff pt15 pl16 pr15 pb19 shadow_gray mb10 bradius5">
                <p class="fs12 ca8 ">联系电话</p>

                <div class="disflex jsbet pt15" @click="makePhone">
                    <div class="fs14 c38 fbold">{{company.phone}}</div>

                    <div class="pl16 left_line disflex column-reverse">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_blue.png" alt=""
                             class="w16 h16"/>
                    </div>

                </div>
            </div>


            <div class="bgfff pt15 pl16 pr15 pb19 shadow_gray mb12 bradius5">
                <p class="fs12 ca8">企业地址</p>

                <div class="disflex jsbet pt15">
                    <div class="fs14 c38 fbold">{{company.address}}</div>
                    <div class="pl16 left_line disflex column-reverse" @click="openAddr">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/addr_2.png" alt=""
                             class="w16 h16" />
                    </div>
                </div>
            </div>

            <!--联系我们-->
            <div class="bgfff shadow_gray bradius5 pt25 pb25 pl25 pr25">
                <p class="under_line textc fs16 c38 fbold pb27">联系我们</p>

                <input type="text" class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb10"
                       placeholder="请填写您的姓名" v-model="form.name">
                <input type="text" class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb10"
                       placeholder="请填写您的联系电话" v-model="form.tel">
                <input type="text" class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb15"
                       placeholder="请填写您的需求" v-model="form.text">

                <div class="w100p bg_line_blue cfff textc fs18 lh44 bradius5" @click="formConfirm">立即提交</div>
            </div>

        </div>

        <!--bottom-->
        <div class="textc pb15 fs12 ca8 bgf5f6 pt15">- 汉全科技集团出品 -</div>


    </div>
</template>

<script>
    import SelfSwiper from '@/components/swiper' //
    import StaticResources from '@/components/StaticResources';
    import WXAJAX from '../../utils/request'
    import amapFile from '../../libs/amap-wx.js'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {SelfSwiper, StaticResources},
        data() {
            return {
                img: 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/food.jpg',
                images: [],

                imgUrls: [

                ],
                COMPANYID: 0,
                myAmapFun: '',
                Mc: '',
                form: {
                    name: '',
                    tel: '',
                    text: '',
                },
                company: {
                    accuracy: '',//经度
                    dimension: '',//维度
                },
                invites: [],
                locat: {
                    lat: 30.5702,
                    lng: 104.06476
                },
                videoContext: null
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: '官网'
            });

            this.Mc = wx.createMapContext('map');
            this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'});

            //获取当前的企业
            this.COMPANYID = wx.getStorageSync('COMPANYID') || 1;

            //获取招聘信息
            this.getInvite();

            this.inits();
        },
        methods: {
            inits() {//获取官网信息

                let v = this;
                wx.showLoading();
                WXAJAX.POST({
                    companyId: v.COMPANYID,

                }, '', '/personal/getWebsiteInfo').then((data) => {
                    if (data) {
                        if (data.photos) {
                            data.photos = data.photos.split(',');
                        } else {
                            data.photos = [];
                        }
                        v.company = data;
                    }
                    setTimeout(function () {
                        v.$nextTick(function () {
                            v.videoContext = wx.createVideoContext('myVideo');
                        });
                    }, 2000);
                    wx.hideLoading();
                }).catch((err) => {
                    console.log(err)
                    wx.hideLoading();
                })
            },
            getInvite() {
                let v = this;
                wx.showLoading();
                WXAJAX.POST({
                    companyId: v.COMPANYID,

                }, '', '/personal/getCompanyRecruit').then((data) => {

                    data.forEach(function (i, k) {
                        i.salary = i.minSalary / 1000 + 'k - ' + i.maxSalary / 1000 + 'k';
                    });

                    v.invites = data;

                    wx.hideLoading();
                }).catch((err) => {
                    wx.hideLoading();
                })
            },
            //轮播图的切换事件
            swiperChange(current) {
                // console.log(current)
            },
            page_turn(url, recruitId) {
                wx.navigateTo({url: '../' + url + '/main?recruitId=' + recruitId})
            },
            openAddr() {
                /* wx.openLocation({
                     latitude :  Number(116.397428),/!*this.company.accuracy ||*!/
                     longitude :  Number(39.90923),/!*this.company.dimension ||*!/
                     scale: 18 ,
                     name : this.company.address,
                 })*/
                let v = this;
                uni.getLocation({
                    type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
                    success(res) {
                        console.log(res);
                        console.log(v.locat);
                        res = v.locat;
                        const latitude = res.lat;
                        const longitude = res.lng;
                        wx.openLocation({
                            latitude,
                            longitude,
                            scale: 18
                        })
                    }
                })
            },
            formConfirm() {//表单提交

                if (!this.form.name) {
                    wx.showToast({
                        title: '请输入您的姓名！',
                        icon: 'none'
                    });
                    return
                }
                if (!this.form.tel || !util.checkPhone(this.form.tel)) {
                    wx.showToast({
                        title: '请输入正确的电话！',
                        icon: 'none'
                    });
                    return
                }

                let v = this;
                wx.showLoading();

                WXAJAX.POST({
                    companyId: v.COMPANYID,
                    name: v.form.name,
                    phone: v.form.tel,
                    text: v.form.text,
                }, '', '/personal/addDemand').then((data) => {
                    wx.hideLoading();
                    if (data) {
                        v.form = {
                            name: '',
                            tel: '',
                            text: '',
                        };
                        wx.showToast({
                            title: '提交成功！',
                            icon: 'success'
                        });
                    }

                }).catch((err) => {
                    wx.hideLoading();
                })


            },
            makePhone() {//拨打电话
                util.MakePhone(String(this.company.phone));
            },
        }
    }
</script>

<style>
    .left_line {
        position: relative;
        padding-left: 36upx;
    }

    .left_line::before {
        content: '';
        position: absolute;
        left: 0;
        width: 2upx;
        height: 26upx;
        background: #A8A8A8;
        bottom: 4upx;
    }

    .under_line {
        position: relative;
    }

    .under_line::before {
        content: '';
        position: absolute;
        bottom: 30upx;
        width: 50upx;
        height: 4upx;
        background: #00a0e9;
        left: 0;
        right: 0;
        margin: auto;
    }

    video {
        width: 100%;
    }
</style>



















