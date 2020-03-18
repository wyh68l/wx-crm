<template>

    <div class="statements pb60 pt7">
        <div class=" pl15 pr15 pt9 pb5 bgfff im-item">
            <!-- <view class="floatl">小程序内咨询功能</view>
            {{messageChecked?"开启中":"关闭"}}<switch class="floatr" :checked="messageChecked" @change="switchChange"></switch>
            <view class="clearBoth" ></view> -->
            <span class="fs16 fblod">小程序内咨询功能</span>
            <div class="right">
                <span class="fs14 ca8 mr10">{{messageChecked?"开启中":"关闭"}}</span><switch :checked="messageChecked" @change="switchChange"></switch>
            </div>
        </div>

        <!-- <view class="bgfff fs14 lh24 minh70 w100p">
            提示：当选择关闭聊天功能时。商城中的商品支付方式不能选择 “其他”，只能选择 “线上支付或拨打电话”。
        </view> -->
    </div>
</template>

<script>
    import WXAJAX from '@/utils/request';
    import PhrasesItem from '@/components/PhrasesItem'
    import BottomButtonSmall from '@/components/bottom_button_small'
    import DialogBox from '@/components/dialogBox' // 对话框

    export default {
        components: {PhrasesItem, BottomButtonSmall, DialogBox},
        data () {
            return {
                companyId: wx.getStorageSync("COMPANYID") || 0,
                messageChecked: true,
            }
        },
        onUnload () {
        },
        mounted () {
            wx.setNavigationBarTitle({
                title: "IM咨询设置"
            });

        },
        onShow () {
            const companyModuleConfig = wx.getStorageSync("companyModuleConfig");
            console.log('111111', companyModuleConfig);
            if(!companyModuleConfig || companyModuleConfig['message'] === undefined) {
                // 如果企业的配置模块存在，且message的配置没有，则初始化该消息配置，且为打开
                this.updateMessageConfig(false);
                this.messageChecked = true;
            } else {
                this.messageChecked = !companyModuleConfig['message'];
            }
        },
        methods: {
            switchChange (e) {
                this.messageChecked = e.target.value;
                if(!this.companyId){
                    this.findCompanyInfo((data) => {
                        this.companyId = data.companyId;
                        this.updateMessageConfig(this.companyId, !e.target.value);
                    });
                    return;
                }
                this.updateMessageConfig(this.companyId, this.messageChecked);
            },

            updateMessageConfig(companyId, close){
                console.log("message是否关闭： ", close);
                WXAJAX.POST({
                    companyId: companyId,
                    moduleName: 'message',
                    close: !close
                }, '', '/companyModuleConfig/updateCompanyModuleConfig').then(res => {
                    let companyModuleConfig = wx.getStorageSync("companyModuleConfig");
                    if(!companyModuleConfig){
                        companyModuleConfig = {}
                    }
                    companyModuleConfig.message = !close;
                    wx.setStorageSync("companyModuleConfig", companyModuleConfig);
                }).catch((err) => {
                    this.messageChecked = close;
                    wx.hideLoading();
                    wx.showToast({
                        title: err.message,
                        icon: 'none',
                        duration: 2000
                    });
                });
            },


            findCompanyInfo(callback){
                WXAJAX.POST({ ignore: true }, '', '/company/getCompany').then((data, code) => {
                    if(data){
                        wx.setStorageSync('COMPANYID',data.companyId) ;
                        wx.setStorageSync('USERNAME',data.name) ;
                        this.setCurrentCompany(data);
                        callback && callback(data);
                    }
                }).catch((err) => {
                });
            }

        }
    }
</script>
<style>
    .clearBoth {
        clear: both
    }

    .floatl {
        float: left
    }
    .fblod {
        font-weight: bold;
    }
    .im-item {
        display: flex;
        justify-content: space-between;
        text-align: center;
    }
    .wx-switch-input {
        background: #00a0e9 !important;
        border: none; 
    }
    .wx-switch-input::after {
        border: none !important; 
    }


</style>
