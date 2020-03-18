<template>
    <div class="fs18 textc lh49 fix_bottom bg_line_blue cfff" @click="btn_tap(url)">
        {{text}}
    </div>
</template>

<script>

    export default {
        name: '',
        props:['text' , 'url'],
        components: {},
        mounted() {

        },
        methods: {
            btn_tap(url){
                this.$emit('btn_tap',url);
            }
        }
    }
</script>

<style>

</style>
