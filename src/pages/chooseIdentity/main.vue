<template>
  <div class="chooseIdentity">
    <IdentityItem
      outStyle="padding-top:0"
      imgUrl="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/photo/20190528/20190528155343.png"
      desc="我是员工，想要加入已有企业"
      btnText="我是员工"
      @choose="chooseIdentity(1)"
    />
    <p class="cut-line">或者</p>
    <IdentityItem
      outStyle="padding-bottom:0"
      imgUrl="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/one-stand/photo/20190528/20190528155350.png"
      desc="我是BOSS，想要创建自己的企业"
      btnText="我是BOSS"
      @choose="chooseIdentity(2)"
    />
  </div>
</template>

<script>
  import IdentityItem from '@/components/IdentityItem'

  export default {
    name: "chooseIdentity",
    components:{
      IdentityItem,
    },
    data(){
      return {

      }
    },
      onShow() {
          if (!wx.getStorageSync('token')) {
              this.toLogin();
          }
      },
    methods:{
      chooseIdentity(type){
          if (!wx.getStorageSync('token')) {
              this.toLogin();
              return;
          }
        let url = type == 1 ? '/pages/searchChooseItem/main?type=company' : '/pages/editEnterprise/main?type=chooseAdd';
        wx.navigateTo({
          url
        });
      },
        toLogin(){
            let url = '/pages/wxLogin/main?unLoginRedirectUrl=/pages/chooseIdentity/main';
            wx.navigateTo({url});
        }
    },
  }
</script>

<style>
  page{
    background: white;
  }

  .chooseIdentity{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 580px;
    margin: auto;
    padding: 0 30upx;
  }

  .cut-line{
    position: relative;
    text-align: center;
    color: #787878;
    font-size: 24upx;
  }
  .cut-line:before,
  .cut-line:after{
    content: '';
    position: absolute;
    bottom: 0;
    top: 0;
    margin: auto;
    width: 44%;
    height: 2upx;
    background: #E8E8E8;
  }

  .cut-line:before{
    left: 0;
  }
  .cut-line:after{
    right: 0;
  }
</style>
