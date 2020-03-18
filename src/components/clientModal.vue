<template>
    <div class="client_modal btf5f6" :class="isshow? '' : 'h0' ">

       <div class="pl15 pr15 bgfff pb25 bbf5f6">
           <!--客户属性-->
           <div class="fs14 ca8 ">
               <p class="lh38">客户属性</p>

               <div class="disflex lh30 fs12">
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="attr_id == 0 ? 'bgblue cfff' : '' "
                         @click="choose_tap(0,0)"   >全部</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="attr_id == 1 ? 'bgblue cfff' : '' "
                         @click="choose_tap(0,1)"   >源码买断</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="attr_id == 2 ? 'bgblue cfff' : '' "
                         @click="choose_tap(0,2)"   >系统租用</span>
               </div>

           </div>

           <!--客户类型-->
           <div class="fs14 ca8">
               <p class="lh38">客户类型</p>

               <div class="disflex lh30 fs12">
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="type_id == 0 ? 'bgblue cfff' : '' "
                         @click="choose_tap(1,0)"   >全部</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="type_id == 1 ? 'bgblue cfff' : '' "
                         @click="choose_tap(1,1)"   >重要</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="type_id == 2 ? 'bgblue cfff' : '' "
                         @click="choose_tap(1,2)"   >紧急</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="type_id == 3 ? 'bgblue cfff' : '' "
                         @click="choose_tap(1,3)"   >一般</span>
                   <span class="bgf5f6 pl12 pr12 mr10 bradius3" :class="type_id == 4 ? 'bgblue cfff' : '' "
                         @click="choose_tap(1,4)"   >潜在</span>
               </div>

           </div>
       </div>

        <p class="lh44 fs14 ca8 bgfff pl16 " @click="btn_tap('tabsEdit')">编辑标签组</p>

        <div class="disflex textc fs18 ca8 lh44 bgfff">
            <span class="w50p">重置</span>
            <span class="w50p bg_line_blue cfff">确定</span>
        </div>

    </div>
</template>

<script>

    export default {
        name: '',
        props:['isshow'],
        components: {},
        data() {
            return{
                attr_id:0,//属性
                type_id:0,//类型id
            }
        },
        mounted() {},
        methods: {
            choose_tap(type , id){//选择类型
                if(type == 0 ){
                    this.attr_id = id ;
                }else{
                    this.type_id = id;
                }
            },
            btn_tap(method){
                this.$emit('btn_tap' , method)
            }
        }
    }
</script>

<style>
    .client_modal{
        position: fixed;
        top: 168upx;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.5);
        z-index: 99;
        transition: .3s;
        overflow: hidden;
    }
    .client_modal.h0{
        height: 0;
        border-top: 0;
    }
</style>






























