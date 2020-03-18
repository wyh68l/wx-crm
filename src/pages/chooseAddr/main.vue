<template>
    <div>

        <div class="mt10 bgfff pl16 pt15 pb15 fs16 pr16">

            <p class="fs12 ca8">详细地址</p>

            <div class="disflex jsbet pt15 align-cen">

                <input type="text" class="w100p phe8 flex1 over_1 fbold" placeholder="地址" v-model="full_address">
                <span class="cblue" @click="resetAddr">重新定位</span>

            </div>
            <input type="text" class="pt15 w100p phe8 fs16" placeholder="详细地址（楼层／门牌号" v-model="district">

        </div>



        <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="saveWebMsg"></BottomButtonSmall>



    </div>
</template>

<script>
    import BottomButtonSmall from '@/components/bottom_button_small' //
    import amapFile from '../../libs/amap-wx.js'
    import WXAJAX from '../../utils/request'
    import AuthorizeBox from '@/components/AuthorizeBox';

    export default {
        name: '',
        components: {BottomButtonSmall},
        data() {
            return {
                name : '' ,
                tel : '' ,
                full_address : '' ,
                district : '' ,
                bottom: {
                    left: {
                        text: '删除', url: 'del'
                    },
                    right: {
                        text: '保存', url: 'save'
                    }
                },
                locat: {
                    lat: '',
                    lng: '',
                },
                myAmapFun: '',
                Mc: '',
                websiteId:0,
            }
        },
        onShow(){
            let _company_address = wx.getStorageSync('company_address') || '' ;
            _company_address && (this.full_address = _company_address.street + _company_address.build) ;
        },
        onUnload(){
            wx.setStorageSync('company_address' , '');
        },
        onLoad() {
            wx.setNavigationBarTitle({
                title: '选择地址'
            });

            this.websiteId = wx.getStorageSync('websiteId') || 0 ;

            this.Mc = wx.createMapContext('map');
            this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'}) ;
            this.getlocation();
        },
        methods: {
            resetAddr(){
                wx.navigateTo({url:'../companyAddr/main'});
            },
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
                            title: '定位失败',
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

                        let _address = data[0].regeocodeData.addressComponent ,
                            _neighborhood = _address.neighborhood,
                            _street = _address.streetNumber;

                        v.full_address = _address.province + _address.city + _address.district ;
                        if(_neighborhood && _neighborhood.name.length > 0){
                            v.full_address = _neighborhood.name;
                        }else {
                            v.full_address = _street.street + _street.number;
                        }
                    },
                    fail: function (info) {
                        v.full_address = '重新定位';
                        console.log(info)
                    }
                })

            },
            saveWebMsg( str , strValue ){
                wx.showLoading();
                WXAJAX.POST({
                    address : this.full_address + this.district,
                    websiteId : this.websiteId ,
                    latitude: this.locat.lat,
                    longitude: this.locat.lng
                }, '', '/company/addWebsiteInfo').then((data) => {

                    wx.hideLoading();

                    wx.setStorageSync('webSiteAddr' , this.full_address);
                    wx.showToast({
                        title: '成功',
                        icon: 'success',
                    });
                    setTimeout(function () {
                        wx.navigateBack() ;
                    },500);
                }).catch((err) => {
                    wx.hideLoading();
                    console.log("数据请求失败")
                });
            }

        }
    }
</script>

<style>

</style>






























