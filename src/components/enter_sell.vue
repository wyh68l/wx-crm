<template>
    <div>

        <!--top-->
        <div class="disflex jsaround fs14 c38 lh44 bgfff">
            <span :class="page_id == 0 ? 'bbblue_2 cblue' : ''" @click="page_tap(0)">个人总览</span>
            <span :class="page_id == 1 ? 'bbblue_2 cblue' : ''" @click="page_tap(1)">销售排行</span>
            <span :class="page_id == 2 ? 'bbblue_2 cblue' : ''" @click="page_tap(2)">AI分析</span>
        </div>


        <!--个人总览-->


        <!--销售排行-->
        <SalesRanking ></SalesRanking>



        <!--AI分析-->

    </div>
</template>

<script>
    import SalesRanking from '@/components/salesRanking' // 订单项

    export default {
        name: '',
        components: {SalesRanking},
        data() {
            return{
                page_id:1,//0--个人总览 ， 1-- 销售排行 ， 2-- AI分析
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "企业"
            });
        },
        methods: {
            page_tap(id){
                this.page_id = id ;
            }
        }
    }
</script>

<style>

</style>




























