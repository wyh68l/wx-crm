<template>
  <div class="pb93 h100p borderbox bgf5f6">


    <swiper class="swiper_3d" @change="handleChange"
            :current="currentIndex"
            previous-margin="100rpx"
            next-margin="100rpx"
            circular ><!--autoplay-->
<!--      <swiper-item class="item">-->
<!--          <div :class="currentIndex ==  0 ? 'active' : '' " class="itemImg poster1 bgfff posre">-->
<!--            <div class="posab bfff2 w74 pb4 borderbox mauto textc top88 pl7 pr9 cfff left0 right0">-->
<!--              <p class="fs42 fbold bbfff ">{{time.day}}</p>-->
<!--              <p class="fs21">{{time.month}}</p>-->
<!--              <p class="fs21">{{time.year}}</p>-->
<!--            </div>-->
<!--            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/poster_1_bg.png" alt="" class="w100p h339">-->
<!--            <p class="textc fs7 cfff">-此名片海报由超级CRM小程序生成-</p>-->
<!--            <div class="pl14 pr13 disflex jsbet borderbox">-->
<!--              <div>-->
<!--                <p class="line_before_2 posre fs9 c38 pt17 pb19 mt-18 pb4" >{{poster_msg.company}}</p>-->

<!--                <div class="disflex">-->
<!--                  <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/user.jpg" alt="" class="w42 h42 bradius5 mr8">-->
<!--                  <div>-->
<!--                    <p class="fs13 c38 fbold pb2">{{poster_msg.name}}</p>-->
<!--                    <p class="fs8 c78 pb2">{{poster_msg.tel}}</p>-->
<!--                    <p class="fs8 c78">{{poster_msg.email}}</p>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->

<!--              <div class="pt9">-->
<!--                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ercode.png" alt="" class="w86 h86">-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="poster_bottom">-->
<!--              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/poster_1_text.png" alt="" >-->
<!--            </div>-->
<!--          </div>-->
<!--        </swiper-item>-->
      <div v-for="(img,idx) in imgLists">
        <swiper-item class="item">
          <div :class="currentIndex ==  idx ? 'active' : '' " class="itemImg poster2 posre" >
            <!--   widthFix-->
            <img mode="widthFix" style="width: 100%" :src="img">
          </div>
        </swiper-item>
      </div>
<!--      <div >-->
<!--        <swiper-item class="item">-->
<!--          <div :class="currentIndex ==  2 ? 'active' : '' " class="itemImg poster3 posre">-->
<!--            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/poster_2_bg.png" alt="" class="w100p h100p posab left0 top0">-->

<!--            <div class="posre pt113 textc disflex jscen">-->
<!--              <div>-->
<!--                <div class="w103 h103 bradius50p bgfff posre mb88">-->
<!--                  <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ercode.png" alt="" class="w86 h86 posab left0 right0 top0 bottom0 mauto ">-->
<!--                </div>-->
<!--                <p class="fs7 cfff textc pb40">-此名片海报由超级CRM小程序生成-</p>-->

<!--                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/user.jpg" alt="" class="w42 h42 bradius5">-->
<!--                <p class="fs13 cfff fbold pt10 pb10">{{poster_msg.name}}</p>-->
<!--                <p class="fs8 cfff pb3">{{poster_msg.tel}}</p>-->
<!--                <p class="fs8 cfff">{{poster_msg.email}}</p>-->
<!--              </div>-->
<!--            </div>-->

<!--            <div class="poster_bottom">-->
<!--              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/poster_1_text.png" alt="" >-->
<!--            </div>-->

<!--          </div>-->
<!--        </swiper-item>-->
<!--      </div>-->
    </swiper>



    <!--bottom-->
    <div class="bgfff disflex fs12 ca8 textc h93 fix_bottom pt11 borderbox">
      <div class="textc w100p" @click="shareToTimeLine">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/time_line_share.png" alt="" class="w50 h50" />
        <p>保存图片</p>

      </div>
    </div>


    <!--canvas 海报-->
    <!--<canvas canvas-id='share' style='width:750upx;height:580px;margin-bottom: 200upx'  ></canvas>&lt;!&ndash;:hidden='canvasHidden'&ndash;&gt;-->

  </div>
</template>

<script>
  import WXAJAX from '../../utils/request';
  import StaticResources from '@/components/StaticResources';

  export default {
    name: '',
    components: {StaticResources},
    data() {
      return {
        imgUrls: [
          {
            img: this.img,
            url: '/_pages/common/webview/main?url=https://wechat.benmu-health.com/mobile/app/common/material/render/17'
          },
          {
            img: this.img,
            url: '/pages/checkup/filterPackage/index?category=PARENTS_CHECKUP'
          }
        ],

        currentIndex: 0,
        bgColor:'',
        poster_msg:{
          company:'成都壹立科技有限企业',
          name:'付鑫',
          code:'',
          tel:'17318989819',
          email:'yiliit@foxmail.com',
          userlogo:'',
          post:'商务经理'
        },
        shareImgSrc:'',
        screenWidth:'',
        shareTempFilePath:'',
        time:{
          day:'',
          month:'',
          year:''
        },
        months:{
          '1':'Jan',
          '2':'Feb',
          '3':'Mar',
          '4':'Apr',
          '5':'May',
          '6':'Jun',
          '7':'Jul',
          '8':'Aug',
          '9':'Sept',
          '10':'Oct',
          '11':'Nov',
          '12':'Dec'
        },
        imgLists:[],
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "名片海报"
      });

      let d = new Date();
      this.time = {
        day:('0'+d.getDate()).slice(-2),
        month:this.months[d.getMonth() + 1],
        year:d.getFullYear()
      }

      this.getCardPoster();
    },
    methods: {
      handleChange(e) {
        this.currentIndex = e.target.current ;
        // this.bgColor = getRandomColor();

      },
      // 获取名片海报
      getCardPoster(){
        wx.showLoading() ;
        WXAJAX.POST({
          cardId: this.$root.$mp.query.cardId
        }, '', '/businessCard/getCardPoster')
          .then(res=>{
            wx.hideLoading() ;
            this.imgLists = res;
          });
      },
      shareToTimeLine(){//分享到朋友圈
        let v = this ;

        wx.getImageInfo({
          src: this.imgLists[this.currentIndex],
          success: function (sres) {
            wx.saveImageToPhotosAlbum({
              filePath: sres.path,
              success: function (fres) {
                wx.showToast({
                  title: '保存成功!',
                  icon: 'none'
                });
                console.log(fres);
              },
              fail(err){
                wx.showToast({
                  title: '保存失败!',
                  icon: 'none'
                });
                console.log(err)
              }
            })
          }

        })

      }

    }
  }
</script>

<style>
  .swiper_3d {
    width: 100%;
    height: 940upx;
    background: #F5F5F6;
    counter-reset: wangxiaoer;
    position: absolute;
    top: 0;
    bottom: 200upx;
    margin: auto;
    /*transform: translateY();*/
  }

  .swiper_3d .item {
    height: 100%;
    /*padding: 24upx;*/
    box-sizing: border-box;

  }

  .swiper_3d .itemImg:before {
    /*    content: counters(wangxiaoer, '') '. ';
        counter-increment: wangxiaoer;
        position: relative;
        display: block;
        top: 50%;
        transform: translateY(-50%);
        background-color: #fff;
        width: 120upx;
        height: 120upx;
        border-radius: 60upx;
        margin: 0 auto;
        text-align: center;*/
  }

  .swiper_3d .itemImg {
    width: 528upx;
    transform: scale(.8);
    z-index: 5;
    opacity: 0.7;
    margin: auto;
    background-color: #fff;
    text-align: center;
  }

  .swiper_3d .active {
    opacity: 1;
    z-index: 10;
    transform: scale(1);
    /*height:470px;*/
    /*width: 314px;*/
    transition: all 0.2s ease-in 0s;
    background-color: #fff;
  }

  .swiper_3d .active img{
    width: 528upx;
  }

  .share_wx{
    background: none;
    color: #A8A8A8;
    font-size: 24upx;
    line-height: 1;
  }

  .share_wx::after{
    border:0;
    background: none;

  }

  .poster_bottom{
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    bottom: 10upx;
    text-align: center;
  }

  .poster_bottom>img{
    width: 231px;
    height: 14upx;
  }

  .line_before_2::before,.line_before_2::after{
    position: absolute;
  }

  canvas{
    background: #fff;
  }
</style>





















































