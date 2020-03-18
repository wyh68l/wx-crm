<template>
    <div>

        <!--top-->
        <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5">
            <div class="bgf5f6 bradius17 disflex pl15 flex1">

                <span></span>
                <input type="text" v-model="key" class="pha8 fs14 lh34 h34" placeholder="输入城市名或拼音">

            </div>

            <span class="fs16 cblue lh34 pl15">取消</span>
        </div>

        <!--addr-->
        <div class="pl16 bgfff pt15 pb15 pr16" v-show="!key">
            <p class="fs12 ca8">当前定位</p>
            <div class="disflex jsbet pt10">
                <span class="fs16 fbold c38">{{locat.city}}</span>
                <span class="cblue fs16" @click="getlocation">重新定位</span>
            </div>
        </div>


        <!--lists-->
        <div v-for="(list,index1) in citys" class="bgfff lh44 fs14 c38" :key="index1">
            <p class="pl16 fs12 ca8 bbf7">{{list.title}}</p>

            <div v-for="(city , index2) in list.child" :key="index2" class="pl25">

                <p @click="choose_city(city.city)">{{city.city}}</p>

            </div>

        </div>


    </div>
</template>

<script>
    import amapFile from '../../libs/amap-wx.js'


    export default {
        name: '',
        components: {},
        data() {
            return {
                locat: {
                    city: '成都',
                    addr: '',
                    lat: '',
                    lng: '',
                },
                myAmapFun: '',
                Mc: '',
                citys: [
                    {
                        title: 'A',
                        child: [
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                            {city: '阿坝县'},
                        ]
                    }
                ]
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "选择城市"
            });

            this.Mc = wx.createMapContext('map');
            this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'})
            this.getlocation();

        },
        methods: {
            getlocation() {//获取经纬度
                wx.showLoading({
                    title: '定位中...',
                    mask: true
                });
                var v = this;
                uni.getLocation({
                    type: 'wgs84',
                    success: function (res) {
                        v.locat.lat = res.latitude;
                        v.locat.lng = res.longitude;

                        v.getLocal();
                        wx.hideLoading();
                    },
                    fail: function (err) {
                        wx.hideLoading();
                        wx.showToast({
                            title: JSON.stringify(err),
                            icon: 'none',
                            duration: 2000
                        })
                    },
                    complete: function () {
                        wx.hideLoading();
                    }
                })
            },
            getLocal(latitude, longitude) {

                let v = this;

                v.myAmapFun.getRegeo({
                    location: '' + v.locat.lng + ',' + v.locat.lat + '', // location的格式为'经度,纬度'
                    success: function (data) {
                        let _address = data[0].regeocodeData.addressComponent,
                            _neighborhood = _address.neighborhood,
                            _street = _address.streetNumber;
                        v.locat.city = _address.city;
                        v.adcode = _address.adcode;

                        if (_neighborhood && _neighborhood.name.length > 0) {
                            v.locat.addr = _neighborhood.name;
                        } else {
                            v.locat.addr = _street.street + _street.number;
                        }

                    },
                    fail: function (info) {
                        v.locat.city = '失败';
                        v.locat.addr = '重新定位';
                        console.log(info)
                    }
                })

            },
            choose_city(city){//选择城市
                wx.setStorageSync("company_city" , city) ;
                wx.showLoading() ;
                setTimeout(()=>{
                    wx.navigateTo();
                    wx.hideLoading();
                })
            }
        }
    }
</script>

<style>

</style>
