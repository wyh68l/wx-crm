<template>
  <div class="fix_top h100p dialog_box">
    <div class="dialog_con bgfff bradius5" >
      <p class="textc fs18 c38 pt25 pb25 ">提示</p>


      <div class="fs14 c78 pl35 pr31 pb36">
        {{desc}}
      </div>

      <div class="disflex fs18 textc lh44 btf5f6 dialog_bottom">
        <span class="w50p ca8 bgfff" @click="$emit('close')">取消</span>
        <label class="w50p bg_line_blue cfff">
          <button open-type="openSetting" style="display: none"></button>
          去授权
        </label>
      </div>
    </div>

  </div>
</template>

<script>

  export default {
    name: 'AuthorizeBox',
    props: {
      desc:{
        type: String,
        default: '暂无权限，请手动设置',
      }
    },
    components: {},
    data() {
      return{
      }
    },
    mounted() {

    },
    methods: {
      btn_tap(method){
        this.$emit('btn_tap',method,this.text , this.text_2 );
        this.text = '' ;
        this.text_2 = '' ;
      }
    },
  }
</script>

<style>
  .dialog_box {
    background: rgba(0, 0, 0, .5);
    z-index: 100;
  }

  .dialog_con {
    width: 580upx;
    position: absolute;
    left: 0;
    right: 0;
    top: 30%;
    margin: auto;
    overflow: hidden;
  }

  .dialog_con input{
    width: 100%;
    line-height: 78upx;
    height: 78upx;
    background: #f5f5f6;
    font-size: 28upx;
    color: #A8A8A8;
    padding-left: 22upx;
    margin-bottom: 20upx;
  }
  .dialog_con input:last-child{
    margin-bottom: 60upx;
  }

  .dialog_bottom{
    border-radius: 0 0 10upx 10upx;
  }
</style>
