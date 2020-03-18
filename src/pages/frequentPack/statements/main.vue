<template>
    <div class="statements pb60">
        <div class="bgfff pl15 pr15 pt9 pb5">
            <div class="c38 fs16 fbold lh32">{{title}}</div>
            <textarea maxlength="200" v-model="statements" auto-height class="fs14 lh24 minh70 w100p">

            </textarea>
            <div class="disflex jsbet lh38">
                <div class="cblue fs14" @click="restoreDefault">还原默认</div>
                <div class="ce8 fs14">{{statements.length}}/200</div>
            </div>
        </div>
        <template v-if="type == 'share'">
            <div v-for="(item, index) in templateList" :key="index" class="bgfff mt10 pt7">
                <div class="disflex jsbet l44 align-cen">
                    <div class="h30 w80 bgblue cfff fs12 lh30 textc bra_right_15">
                        {{item.title}}
                    </div>
                    <div class="h30 w80 cblue fs14 lh30 textc" @click="clickToUse(item)">
                        点击使用
                    </div>
                </div>
                <div class="pl15 pr15 fs14 lh24 c38 pb13 pt2 minh45">
                    {{item.desc}}
                </div>
            </div>
        </template>
        <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>
    </div>
</template>
<script>
import BottomButtonSmall from '@/components/bottom_button_small'
import WXAJAX from '@/utils/request';
export default {
    components: { BottomButtonSmall },
    data(){
        return{
            type: '',
            title: '',
            statements: '',
            company: '',
            user: '',
            templateList: []
        }
    },
    mounted() {
        this.init();
    },
    methods:{
        init(){
            let cardWelcomeSpeech = wx.getStorageSync('cardWelcomeSpeech')
            this.type = this.$root.$mp.query.type;
            this.title = this.type === "welcome" ? "欢迎语编辑" : "名片分享引导语";
            wx.setNavigationBarTitle({
                title: this.type === "welcome" ? "欢迎语设置" : "分享语设置"
            });
            this.company = cardWelcomeSpeech.company;
            this.user = cardWelcomeSpeech.user;
            this.getTemplateList()
            // 通过接口获取company和user,然后调用getTemplateList(company, user);
            this.statements = this.type === "welcome"
              ? (cardWelcomeSpeech.welcomeSpeech || `您好，这是${this.company}的${this.user}，欢迎进入我的名片，有什么可以帮你的吗？你可以在这里跟我试试沟通`)
              : (cardWelcomeSpeech.shareSpeech || this.templateList[0].desc);
            this.statements  = this.statements.replace('#name#', this.user).replace('#company#', this.company);
        },
        getTemplateList(){
            let templateList = [
                {
                    title: '商务通用',
                    desc: `您好，这是${this.company}的${this.user}，这是我的电子名片，请惠存。`
                },
                {
                    title: '持之以恒',
                    desc: `贵有恒,何必三更起五更眠;最无益,只怕一日塌十日寒。我是${this.user},认识一下~`
                },
                {
                    title: '豪迈大气',
                    desc: `时人莫小池中水,浅处不妨有卧龙。我是${this.user},认识一下~`
                },
                {
                    title: '诗意婉约',
                    desc: `茫茫人海相遇即是缘分。我是${this.user}，认识一下吧~`
                },
                {
                    title: '可爱俏皮',
                    desc: `大家好,我是${this.company}的${this.user},请大家多多关照。`
                }
            ];
            this.templateList = templateList;
        },
        restoreDefault(){
            this.statements = this.type === "share" ? this.templateList[0].desc : `您好，这是${this.company}的${this.user}，欢迎进入我的名片，有什么可以帮你的吗？你可以在这里跟我试试沟通`;
        },
        clickToUse(item){
            this.statements = item.desc;
        },
        btn_tap(){
            console.log(this.type, this.statements)
            let statements = this.statements.replace(this.company, '#company#').replace(this.user, '#name#');
            let params = this.type == 'welcome' ? { welcomeSpeech: statements} : { shareSpeech: statements};
            WXAJAX.POST(params, '', '/businessCard/updateCardWelcomeSpeech').then((data) => {
                if(data){
                    wx.navigateBack({
                        delta: 2
                    })
                }
            })
        }
    }
}
</script>
<style>
page{
    background: #F5F5F6;
}
</style>
