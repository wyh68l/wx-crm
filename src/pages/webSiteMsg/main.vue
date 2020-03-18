<template>
    <div class="website_msg">
        <p class="lh30 fs14 cb8 pl14">已收到{{lists.length}}条信息</p>


        <!--列表-->
        <div v-for="(msgitem,k) in lists" :key="k" class="mb10 phone-reverse">
            <MsgBox :msg="msgitem"
                    type="2"
                    @row_tap="row_tap"
                    :istel="true"
                    :telReverse="true"
                    :ismsg="true">
            </MsgBox>
        </div>
      <div class="textc disflex w60 h60 bradius50p bgblue disinblock goToUserCenter" @click="page_turn('mine')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png" alt="" class="w30 h30 mt15">
      </div>
    </div>
</template>

<script>
    import MsgBox from '@/components/msgBox' //
    import WXAJAX from '../../utils/request'

    export default {
        name: '',
        components: {MsgBox},
        data() {
            return{
                lists:[]
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "表单信息"
            });
            this.getInits() ;
        },
      async onPullDownRefresh() {
        await this.getInits();
        wx.stopPullDownRefresh();
      },
        methods: {
          page_turn(url){
            wx.reLaunch({url:'../'+url+'/main'});
          } ,
            getInits(){
                wx.showLoading() ;

                return WXAJAX.POST({ignore: true}, '', '/company/selectDemand').then((data) => {
                  wx.hideLoading() ;
                  if(data){
                    data.forEach(function (i, k) {
                      i.logo = i.log ;
                    });
                    this.lists = data ;
                  }

                }).catch((err) => {
                  wx.hideLoading() ;
                  console.log("数据请求失败")
                });
            },
            row_tap() {//选择客户
                // wx.navigateTo({url: '../clientAdd/main'});

            },
        }
    }
</script>

<style>
.website_msg img.bradius5{
    border-radius: 50%;
}
.goToUserCenter{
  position: fixed;
  right: 20upx;
  bottom: 102upx;
  z-index: 99;
  box-sizing: border-box;
  text-align: center;
}
</style>
