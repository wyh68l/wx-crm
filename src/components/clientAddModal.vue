<template>
  <div class="fix_bg_full tab_modal disflex column-reverse"
       :class="status ? '' : 'hidden' "
       @click="closeModal">

    <div class="bgfff fs12 c78 pt15 pb44">
      <div class="pl16 pr16 pb25" v-for="(v,k) in tabs" :key="k">

        <p class="fs14 pb10">{{v.title}}</p>

        <div class="disflex flex-wrap">
                    <span v-for="(tab , index) in v.child" :key="index"
                          class="bgf5f6 bradius3 pl12 pr12 lh30 mr10 mt5"
                          :class="v.choose_id == tab.id ? 'cfff bgblue' : '' "
                          @click.stop="tab_tap(k,tab.id,index)">{{tab.title}}</span>
        </div>
      </div>

      <p class="btf7 bbf7 lh45 pl16 fs14 ca8" @click.stop="edit_tabs">编辑标签组</p>

    </div>

    <!--bottom-->
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>

  </div>

</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  export default {
    name: '',
    props:['status','tabs','choose_tabs_id'],
    components: {BottomButtonTwo},
    data() {
      return{
        bottom: {
          left: {
            text: '重置', url: 'reset'
          },
          right: {
            text: '确定', url: 'confirm'
          }
        },
      }
    },
    mounted() {},
    methods: {
      page_turn(method){
        this.$emit('modal_btn_tap' , method)
      },
      tab_tap(index1,id,index2){
        this.$emit('modal_tab_tap', index1 , id , index2)
      },
      edit_tabs(){
        this.$emit('closeModal');
        wx.navigateTo({url:'../tabsEdit/main'});
      },
      closeModal(){
        this.$emit('closeModal');
      }
    }
  }
</script>

<style>
  .flex-wrap{
    flex-wrap: wrap;
  }
  .fix_bg_full{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    z-index: 100;
    transition: .2s;
  }
  .tab_modal.hidden{
    bottom: -100%;
  }
  .tab_modal .fix_bottom{
    position: absolute;
  }

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































