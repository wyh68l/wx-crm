<template>
    <div class="shareOrSave w100p h100p prod_choose_class borderbox disflex column-reverse" :class="status ? 'show' : '' " @click="closeModal">
        <div class="bgfff inner textc lh44">
            <p class="fs14 ca8 ">您可以通过以下方式添加企业成员</p>
            <p class="fs16 c38 ">
                <button class='fs16 bgfff contentbox textc' open-type="share" hover-class="other-button-hover">
                    通过微信邀请
                </button>
            </p>
            <p class="fs16 c38" @click.stop="save">企业海报邀请</p>
        </div>
    </div>
</template>
<script>
export default {
    name: "shareOrSave",
    props: ['status'],
    methods: {
        closeModal(){
            this.$emit('closeModal')
        },
        save(){
            this.$emit('save')
        }
    }
}
</script>
<style>
.shareOrSave{

}
.shareOrSave {
    position: fixed;
    left: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 100;
    bottom: -100%;
    transition: .2s;
}

.shareOrSave.show {
    bottom: 0;
}

.shareOrSave .inner {
    border-radius: 10upx 10upx 0 0;
}
</style>
