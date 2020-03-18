<template>
    <div class="h100p bgfff pl16 pr15 pt8 borderbox">
        <div class="disflex jsbet">
            <p class="fs18 c38 fbold pb15">{{invites.position}}</p>
            <p class="fs12 ca8">{{invites.createTime}}</p>
        </div>

        <div class="disflex jsbet fs12 ca8">
            <div>
                {{invites.recruitAddress}} | {{invites.education}} | {{invites.experience}}
            </div>
            <span class="cblue fs14">{{invites.salary}}</span>
        </div>

        <div class="pl15 pt20 pb10 pr15 fs16 c38">{{invites.requirement}}</div>

        <BottomButtonSmall :text="'联系HR'" :url="'tel'" @btn_tap="btn_tap"></BottomButtonSmall>

    </div>
</template>

<script>
    import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {BottomButtonSmall},
        data() {
            return{
                recruitId : 0,
                invites:{},
                COMPANYID:0
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: '招聘详情'
            });
            //获取当前的企业
            this.COMPANYID = wx.getStorageSync('COMPANYID') || 0 ;

            this.recruitId = this.$root.$mp.query.recruitId ;
            this.inits();
        },
        methods: {
            btn_tap(){
                let phone = '' ;
                if(this.invites.hrPhone){
                    phone = String(this.invites.hrPhone);
                }
                util.MakePhone(phone);
            },
            inits(){
                let v = this ;
                wx.showLoading();
                WXAJAX.POST({
                    companyId  : v.COMPANYID,
                    recruitId : v.recruitId
                }, '', '/personal/getCompanyRecruit').then((data) => {

                    data = data[0];
                    data.createTime = util.getdate(data.createTime,'dateTime') ;
                    data.salary = data.minSalary / 1000 + 'k - ' + data.maxSalary/1000 + 'k';

                    v.invites = data ;

                    wx.hideLoading();
                }).catch((err) => {
                    wx.hideLoading();
                })
            }
        }
    }
</script>

<style>

</style>
