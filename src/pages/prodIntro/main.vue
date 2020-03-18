<template>
    <div>

        <div class="bgfff pb25">

            <textarea name="" id="" class="h50 pl15 lh44 fs14 ca8 pb25" placeholder="请输入产品介绍" v-model="text"></textarea>

            <div class="textc">
                <span class="disinblock bblue cblue fs14 lh30 bradius5  pl11 pr11">添加内容</span>
            </div>

        </div>

        <BottomButtonSmall :text="'保存'" :url="'confirm'" @btn_tap="btn_tap"></BottomButtonSmall>

    </div>
</template>

<script>
    import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
    import WXAJAX from '@/utils/request'

    export default {
        name: '',
        components: {BottomButtonSmall},
        data() {
            return{
                text:''
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "产品介绍"
            });
        },
        methods: {
            btn_tap(){
                console.log('保存')
                console.log(this.text)
                WXAJAX.POST({
                    goodsIntroduce:this.text
                },'','/company/addWebsiteInfo').then((data) => {
                    console.log(this.text)
                    console.log(this.dynamic_imgs)
                    console.log("发布成功")
                }).catch((err) =>{
                    console.log("发布失败")
                });
            }
        }
    }
</script>

<style>

</style>
