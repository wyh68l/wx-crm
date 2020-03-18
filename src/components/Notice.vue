<template>
  <cover-view class="out">
    <cover-view class="box">
      <cover-view class="title pt30 mb10">{{title}}</cover-view>
      <cover-view class="notice">{{notice}}</cover-view>
    </cover-view>
  </cover-view>
</template>

<script>
  export default {
    name: "Notice",
    props:{
      title: {
        type: String,
        default: '',
      },
      notice:{
        type: String,
        default: '',
      }
    }
  }
</script>

<style scoped>
  .out{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0,0,0, .5);
    z-index:9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40upx;
  }

  cover-view{
    pointer-events: all;
  }

  .box{
    width: 100%;
    background: white;
    border-radius: 10upx;
    padding-bottom: 60upx;
  }

  .title{
    text-align: center;
    color: #383838;
    font-size: 36upx;
    font-weight: bold;
  }

  .notice{
    text-align: justify;
    font-size:28upx;
    font-weight:400;
    color:#383838;
    line-height:48upx;
    white-space: pre-wrap;
    word-break: break-all;
    overflow-y: scroll;
    max-height: 280px;
    margin: 0 60upx;
  }
</style>
