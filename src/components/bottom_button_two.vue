<template>
    <div class="disflex fs18 textc lh49 fix_bottom">
        <span class="w50p ca8 bgfff" @click.stop="page_turn(left.url)">{{left.text}}</span>
        <span class="w50p bg_line_blue cfff" @click.stop="page_turn(right.url)">{{right.text}}</span>
    </div>
</template>

<script>

    export default {
        name: '',
        props:['left' , 'right'],
        components: {},
        mounted() {

        },
        methods: {
            page_turn(url){
                this.$emit('page_turn',url);
                this.$emit('aaa', url);
            }
        }
    }
</script>

<style>

</style>
