<template>

    <div class="pl9 pr16 disflex h85 pt10 borderbox bgfff" @click="prod_tap(prod.id , prod.type || -1, prod.goodsId)">

        <img :src="prod.photo" alt=""
             v-if="prod.photo.length"
             mode="aspectFill"
                          class="w60 h60 bradius5 mr23"/>

        <div class="flex1">
            <p class="fs14 c38 over_2 lh22 h40">{{prod.goodsName || prod.title}}</p>

            <div class="disflex jsbet" v-if="type == 'small'">
                <span class="corange fs12">{{prod.price}}</span>
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
                     alt="" class="w16 h16"
                     @click.stop="del(prod.goodsId)"
                />
            </div>

            <div class="disflex jsbet pt2 mt5" v-if="type == 'complex'">
                <span class="cbc fs12">发表于 {{prod.createTime}}</span>
                <div class="fs14 cdeepblue disflex">
                    <div class="mr10 disflex align-cen" @click.stop="btn_tap('like',prod.id)">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/zan_select.png" alt="" class="w20 h20 mr8" />
                        {{prod.doThumbsNum}}
                    </div>
                    <div class="mr10 disflex align-cen" @click.stop="btn_tap('comment',prod.id)">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/comment_select.png" alt="" class="w20 h20 mr9" />
                        {{prod.commentNum}}
                    </div>
                </div>
            </div>

        </div>

    </div>

</template>

<script>
  import StaticResources from '@/components/StaticResources';

    export default {
        name: '',
        props:['prod','type','index1','index2'],
        components: {StaticResources},
        data() {
            return{

            }
        },
        methods: {
            btn_tap(method,id){
                this.$emit('btn_tap' , method ,id);
            },
            prod_tap(id , type, goodsId){
                this.$emit('prod_tap',id , type, goodsId)
            },
            del(goodsId){
                this.$emit('del' , goodsId , this.index1 , this.index2);
            }
        }
    }
</script>

<style>

</style>
