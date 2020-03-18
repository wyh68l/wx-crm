<template>
  <div class="phrases-item">
    <div class="content">
      {{content}}
    </div>
    <div class="operations mt20">
      <div class="edit-btn" @click="handlerEdit">
        编辑
      </div>
      <div class="other-btn">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_up.png"
             alt="" class="w30 h30" @click="handlerUp"/>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_down.png"
             alt="" class="w30 h30" @click="handlerDown"/>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_del_2.png"
             alt="" class="w30 h30" @click="handlerDel"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PhrasesItem",
    props:{
      content:{
        type: String,
        default: '',
      }
    },
    data(){
      return {};
    },
    methods: {
      handlerEdit(e) {
        this.$emit('edit', e);
      },
      handlerUp(e) {
        this.$emit('moveUp', e);
      },
      handlerDown(e){
        this.$emit('moveDown', e);
      },
      handlerDel(e){
        this.$emit('del', e);
      }
    },
  }
</script>

<style scoped>
  .phrases-item{
    background: white;
    padding: 40upx;
    border-radius:10upx;
    margin-bottom: 16upx;
  }

  .content{
    color: #383838;
    font-size: 28upx;
  }

  .operations{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .edit-btn{
    color: #00a0e9;
    font-size: 28upx;
  }

  .other-btn img{
    margin-right: 20upx;
  }

  .other-btn img:last-child{
    margin-right: 0;
  }
</style>
