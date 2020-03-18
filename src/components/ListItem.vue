<template>
  <div class="item-box" @click="$emit('click', $event)">

    <slot name="img">
      <img :src="imgUrl" alt="" class="w50 h50 mr10">
    </slot>

    <div class="info-box">
      <slot name="title">
        <div class="title">{{title}}</div>
      </slot>
      <slot name="desc">
        <div class="desc">{{desc}}</div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ListItem",
    props:{
      imgUrl: {
        type: String,
        default: '',
      },
      title:{
        type: String,
        default: '',
      },
      desc: {
        type: String,
        default: '',
      }
    }
  }
</script>

<style scoped>
  .item-box{
    display: flex;
    background: white;
    padding: 17.10upx 30upx;
  }

  .info-box{
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  .title{
    color: #383838;
    font-size: 36upx;
    width: 100%;
    font-weight: bold;
  }

  .desc{
    color: #A8A8A8;
    font-size: 28upx;
  }
</style>
