<template>
  <div class="identity-box" :style="outStyle">
    <img :src="imgUrl" class="img">
    <p class="desc">{{desc}}</p>
    <div class="choose-btn disinblock" @click="choose">{{btnText}}</div>
  </div>
</template>

<script>
  export default {
    name: "IdentityItem",
    props: {
      imgUrl: {
        type: String,
        default: '',
      },
      desc: {
        type: String,
        default: '',
      },
      btnText: {
        type: String,
        default: '',
      },
      outStyle:{
        type: String,
        default: '',
      }
    },
    data(){
      return {

      }
    },
    methods:{
      choose(){
        this.$emit('choose');
      },
    },
  }
</script>

<style scoped>
  .identity-box{
    text-align: center;
    padding: 86upx 0;
  }

  .img{
    width: 125px;
    height: 125px;
  }

  .desc{
    font-size:36upx;
    font-weight:bold;
    color: #E8E8E8;
    margin: 40upx 0;
  }

  .choose-btn{
    width: 432upx;
    height: 88upx;
    background:linear-gradient(90deg,#00a0e9,rgba(81,205,204,1));
    border-radius: 10upx;
    color: white;
    line-height: 88upx;
    font-size: 36upx;
  }
</style>
