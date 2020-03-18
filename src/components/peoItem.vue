<template>
    <div class="disflex jsbet pl15 pr16 pt15 pb15 bgfff posre" @click="row_tap(peo.userId , peo.cardId)">
        <label class="checkBox pl30" v-if="status == 2 || status == 4 || status == 3"
               @click.stop="choose_peo(peo.userId)"
               :class=" peo.isCheck ? 'active' : '' ">
            <span></span>
        </label>
        <img :src="peo.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'"
             mode="aspectFill"
             alt=""
             class="w50 h50 bradius5 mr10">
        <div class="flex1 disflex jsbet">
            <div class="fs16 c38 lh50 fbold name">{{peo.name}}</div>
            <div v-if="status == 0 || status == 1 || status == 4" class="disflex textc pt6">
                <div class="fs14 ca8 pr25">
                    <span>{{peo.num || 0}}人</span><br>
                    <span>独占数</span>
                </div>
                <div class="fs14 ca8">
                    <span>￥{{peo.targetAmount}}</span><br>
                    <span>月目标</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: '',
        props:['peo','status','ischoose','index'],
        components: {},
        data() {
            return{

            }
        },
        mounted() {
            // console.log('status---',this.status);
        },
        methods: {
            choose_peo(id){
                // if(this.peo.isMySelf == 1) return
                this.$emit('choose_peo',id,'',this.index)
            },
            row_tap(userId , cardId){
                this.$emit('row_tap' , userId , cardId);
            }
        }
    }
</script>

<style>

</style>


























