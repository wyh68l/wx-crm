<template>
    <div class="posre pt283 bgfff pb15">
        <img :src="card_msg.picchecked || card1_logo" alt=""  mode="aspectFill" class="w100p h375 posab left0 top0" />

        <div class="pl15 pr15 posre">
            <div class="shadow_gray bgfff pl25 pt25 pr22 pb21 disflex jsbet ">

                <div>
                    <p class="fs18 c38 fbold pb7">{{card_msg.username || '姓名'}}</p>
                    <p class="fs14 c78 pb15">{{card_msg.post || '职位'}}</p>
                    <p class="disflex align-cen">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/tel_blue.png" alt="" class="w16 h16 mr11" />
                        <span class="fs12 ca8">{{card_msg.tel || '电话'}}</span>
                    </p>
                </div>
                <div class="disflex align-cen">
                    <img :src="card_msg.company_logo || card1_company" alt="" mode="aspectFill" class="w60 h60"
                    /><!--@click.stop="uploadpic('company')"-->
                </div>


            </div>
        </div>
    </div>
</template>

<script>
  import StaticResources from '@/components/StaticResources';

    export default {
        name: "card_2",
        props:['card_msg'],
      components: {StaticResources},
        data(){
            return{
                card1_logo : 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_user.png',
                card1_company:'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_logo.png'
            }
        },
        methods:{
            uploadpic(type){
                this.$emit('uploadpic',type)
            }
        }
    }
</script>

<style>

</style>
