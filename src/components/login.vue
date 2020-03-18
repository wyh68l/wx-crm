<template>
    <div class="w100p h100p bggray_5 fix_top ">
        <div class="w290 h231 posab left0 top0 right0 bottom0 mauto bgfff bradius5 textc pt25">
            <div>
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/yimai_logo.png" alt="" class="w60 h60 mb15">
                <p class="fs14 c78">亲爱的用户，您好</p>
                <p class="fs14 c78 pb27">进入小程序请先登录</p>

                <!--获取手机号-->
                <button open-type="getPhoneNumber"
                        class="bggreen bradius5 w146 lh44 textc cfff fs18"
                        @getphonenumber="getPhoneNumber"
                        v-if="!phoneMsg.phoneData"
                >微信授权</button>

                <!--微信授权-->
                <button open-type="getUserInfo"
                        @getuserinfo="GetUserInfo"
                        class="bggreen bradius5 w146 lh44 textc cfff fs18"
                        v-if="phoneMsg.phoneData"
                >开始使用</button>

          <!--      <button open-type="getUserInfo"
                        @getuserinfo="GetUserInfo"
                        class="bggreen bradius10 w146  lh44 textc cfff fs18">微信登陆</button>-->
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        name: "login",
        props:['phoneMsg'],
        methods:{
            getPhoneNumber(e) {
                this.$emit('getPhoneNumber',e.target);
            },
            GetUserInfo(e){
                this.$emit('GetUserInfo',e.target);
            }
        }
    }
</script>

<style>

</style>


































