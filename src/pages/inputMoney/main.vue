<template>
  <div>

    <div class="bgfff lh49 fs16 c38 pl16 pr15 mb10">
      <div class="disflex jsbet">
        <span class="fbold pr10 marks">成交金额</span>
        <div>
          <input type="digit" class="pha8 textr flex1 lh49 h49"
                 placeholder="请输入成交金额"
                 v-model="money">
        </div>
      </div>
    </div>

    <div class="bgfff pt15 pl15 pr15 pb15 h99 mb10">
      <p class="fs16 c38 pb10 fbold">成交结果/备注</p>
      <textarea name="" id="" v-model="remark" class="fs14 pha8 h70 c68" placeholder="请输入你的成交结果"></textarea>
    </div>

    <div class="pt15 pl15 pr15 disflex wrap">
      <div class="bgfff bdash_a8 w100 h100 mr7 mb7 posre" v-for="(v,k) in photos" :key="k">
        <img :src="v" alt="" class="w100p h100p" mode="aspectFill">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/del.png"
             alt="" class="w20 h20 posab right2 top2"
             @click="delImg(k)">
      </div>
      <div v-if="photos.length<9" class="bdash_a8 w100 h100 add_img mr7 mb7" @click="chooseImg"></div>
    </div>

    <!--bottom-->
    <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>


  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import WXAJAX from '../../utils/request'
  import utils from '@/utils'


  export default {
    name: 'inputMoney',
    components: {BottomButtonSmall},
    data() {
      return{
        name : '' ,
        remark : '' ,
        money:'' ,
        customerId: '',
        photos: [],
        isLoading: false,
      }
    },
    onShow(){
      this.customerId = this.$root.$mp.query.customerId
    },
    onUnload(){
      this.isLoading = false;
      this.reset();
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "录入成交金额"
      });
      this.customerId = this.$root.$mp.query.customerId
    },
    methods: {
      reset(){
        this.remark  =  '' ;
        this.money = '' ;
        this.customerId =  '';
        this.photos =  [];
      },
      delImg(idx){
        this.photos.splice(idx, 1);
      },
      async chooseImg(){
        if (this.photos.length>9) {
          wx.showToast({
            title: '最多只能上传9张图片',
            duration: 2000,
            icon: 'none'
          });

          return;
        }

        let path = await utils.chooseImage('file', 9);

        if(!(path instanceof Array)) return;
        this.uploadImgFun(path, 0)
      },
      // 递归上传
      async uploadImgFun(arr, index = 0) {
        await this.uploadImg(arr[index])
        if (index < arr.length - 1) {
          this.uploadImgFun(arr, index + 1)
        }
      },
      uploadImg(path) {
        wx.showLoading();
        return WXAJAX.UploadImage(path).then((data) => {
          wx.hideLoading();
          try{
            data = JSON.parse(data);
          }catch (e) {

          }
          let fullPath = WXAJAX.imgBackUrl + data.data;
          this.photos.push(fullPath);
        }).catch((err) => {
          wx.hideLoading();
          console.log('err -- ', err);
        })
      },
      btn_tap() {
        if (this.isLoading) return;

        let v = this ,
          reg = /^[1-9]+[0-9]*]*$/ ;
        if(!this.money.trim()){
          wx.showToast({
            title: '请输入金额！',
            icon: 'none'
          });
          return;
        }
        if(!reg.test(this.money)){
          wx.showToast({
            title: '请输入正确的金额！',
            icon: 'none'
          });
          return;
        }

        wx.showLoading();
        this.isLoading = true;
        WXAJAX.POST({
          customerId  : this.customerId ,
          // companyId : v.msgitem.companyId ,
          money : (this.money * 100).toFixed(0),
          remark : this.remark ,
          photos: this.photos.join(','),
        }, '', '/customer/inputDealMoney').then((data) => {
          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          setTimeout(()=>{
            wx.navigateBack();
          }, 1*1000);
        }).catch((err) => {
          this.isLoading = false;
          console.log(err);
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
      },
    }
  }
</script>

