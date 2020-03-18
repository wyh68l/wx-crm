<template>
  <div>

    <!--编辑轮播图-->
    <!--<EditBanner></EditBanner>-->
    <div class="w100p h211">

      <div class="edit_banner bgfff trans2" :class="changeing ? 'fade' : '' " v-if="imgUrls.length > 0">
        <swiper class="swiper-inner" indicator-dots indicator-active-color="#ffffff" indicator-color="rgba(255, 255, 255, 0.4)" :current="cur" @change="swiperChange" circular>
          <block v-for="(item,index) in imgUrls" :key="index">
            <swiper-item>
              <img class="banner-img" :src="item" mode="aspectFill"/>
              <div class="tags">
                            <span class="w30 h30 del disflex align-cen jscen mb10" @click="delBanner(index)">
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png" alt=""
                                     mode="aspectFill"
                                     class="w17 h17"/>
                            </span>
                <span class="posre w30 h30 add disblock" @click="uploadpic(index)"></span>
              </div>
            </swiper-item>
          </block>
        </swiper>
        <!--重置小圆点的样式  -->
        <!--<view class="dots">
          <block v-for="(item,index) in imgUrls" :index="index" :key="key">
            <view class="dot" :class="{'active':  index == cur}"></view>
          </block>
        </view>-->
        <!--重置小圆点的样式 end -->
      </div>

      <div v-else class="w100p h100p bgf5f6 textc pt30" @click="uploadpic(-1)">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/VR.png" alt=""
             class="w100 h100 mb5" />
        <p class="fs14 ca8">点击添加图片</p>
      </div>

      <canvas style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
              canvas-id="Canvas"></canvas>

    </div>


    <div class="disflex jsaround fs12 c78 pt20 textc mb10 pb10 bgfff">
      <div class="textc" @click="page_tap('companyIntro' ,  '?type=companyIntroduce')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/company_name.png" alt=""
             class="w30 h30"/>
        <p class="pt7">企业介绍</p>
      </div>
      <div @click="page_tap('companyIntro' , '?type=goodsIntroduce')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/prod_blue.png" alt=""
             class="w30 h30" />
        <p class="pt7">产品介绍</p>
      </div>
      <div @click="toCompanyVideoList">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/video.png" alt=""
             class="w30 h30" />
        <p class="pt7">企业视频</p>
      </div>
      <div @click="page_tap('companyPack/joinUs')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/joinus.png" alt=""
             class="w30 h30" />
        <p class="pt7">企业招聘</p>
      </div>
    </div>


    <div class="bgfff pl16 pr15 fs16 ca8 lh49">
      <div class="disflex jsbet" @click="page_tap('webSiteMsg')">
        <span class="c38 fbold fs16">用户反馈</span>
        <div>
          <span class="mr11">已收到{{num}}条信息</span>
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt=""
               class="w10 h10" />
        </div>
      </div>
      <div class="disflex jsbet" @click="add('tel')">
        <span class="c38 fbold fs16">联系电话</span>
        <div>
          <span class="mr11">{{tel || '暂无'}}</span>
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt=""
               class="w10 h10" />
        </div>
      </div>
      <div class="disflex jsbet" @click="page_tap('chooseAddr')"><!--companyAddr-->
        <span class="c38 fbold fs16">企业地址</span>
        <div class="disflex flex1 row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt=""
               class="w10 h10" />
          <p class="w200 over_1 textr mr11">{{address}}</p>
        </div>
      </div>
    </div>

    <!--添加视频-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="dialog_title" @btn_tap="dialog_tap" :dialog_ph="dialog_ph"
                 :default="dialog_value"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>

    </div>
  </div>
</template>

<script>
  import util from '../../utils/index'
  import DialogBox from '@/components/dialogBox' // 对话框
  import WXAJAX from '../../utils/request'
  import StaticResources from '@/components/StaticResources';


  export default {
    name: '',
    components: {DialogBox, StaticResources},
    data() {
      return {
        address: '',
        info: {},
        indicator: false, //是否显示指示点
        interval: 5000,  //自动切换时间间隔
        duration: 400,  //滑动动画时长
        autoplay: true, //是否自动切换
        circular: true, //是否采用衔接滑动
        cur: 0,         //当前所在滑块的index

        imgUrls: [],
        changeing: false,//是否在选择切换图片

        dialog_type: 'wxLogin',
        dialog_show: false,
        dialog_title: '',
        dialog_ph: '',
        dialog_value: '',
        tel: '',
        video_link: '',
        websiteId : 0 ,//官网id
        num:0,
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "官网管理"
      });

    },
    async onPullDownRefresh() {
      await this.getWebMsg();

      wx.stopPullDownRefresh();
    },
    onShow(option) {
      this.getWebMsg();
    },
    onUnload() {

      //还原数据
      this.imgUrls = [];
      this.changeing = false;
      wx.setStorageSync('webSiteAddr' , '') ;
      wx.setStorageSync('editOperator', '');
    },
    methods: {
      //官网信息请求
      getWebMsg() {
        return WXAJAX.POST({ignore: true}, '', '/company/selectWebsiteInfo').then((data) => {

          if(data){
            this.info = data;
            this.websiteId = data.websiteId ;
            wx.setStorageSync('websiteId',this.websiteId) ;
            this.tel = data.phone ;
            this.video_link = data.videoUrl ;
            this.address = data.address ;
            this.num = data.num || 0;
            this.imgUrls = data.photos ? data.photos.split(',') : [];
          }

        }).catch((err) => {
          console.log("数据请求失败")
        })
      },
      add(type) {
        if (type == 'videos') {//添加视频的弹框
          this.dialog_type = type;
          this.dialog_title = '企业视频';
          this.dialog_ph = '请输入视频链接';
          this.dialog_show = true;
          this.dialog_value = this.video_link ;
        } else {
          this.dialog_type = type;
          this.dialog_title = '电话号码';
          this.dialog_ph = '请输入手机号';
          this.dialog_show = true;
          this.dialog_value = this.tel ;
        }
      },
      page_tap(url , query) {
        query = query || '' ;

        if (query.includes('companyIntroduce')) {
          wx.setStorageSync('editOperator', this.info.companyIntroduce)
        }

        if (query.includes('goodsIntroduce')) {
          wx.setStorageSync('editOperator', this.info.goodsIntroduce)
        }

        wx.navigateTo({url: '../' + url + '/main' + query })
      },
      swiperChange(e) {
        this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
      },
      async uploadpic(str) {
        if (this.imgUrls.length >= 5) {
          wx.showToast({
            title: '最多选择五张！',
            duration: 1500,
            icon: 'none'
          });
          return
        }
        let path = await util.chooseImage('file', 5 - this.imgUrls.length);
        if(Object.prototype.toString.call(path) !== '[object Array]') return;
        this.changeing = true;

        this.uploadImgFun(path, 0, str);
      },
      // 递归上传
      async uploadImgFun(arr, index = 0, str) {
        await this.uploadImg(arr[index], str)
        if (index < arr.length - 1) {
          this.uploadImgFun(arr, index + 1, str)
        }
      },
      uploadImg(path, str) {
        let v = this;
        wx.showLoading();
        return WXAJAX.UploadImage(path).then(async (data) => {
          wx.hideLoading();
          data = JSON.parse(data);

          if (data.code == '200') {
            this.imgUrls.push(WXAJAX.imgBackUrl + data.data + '.primary.png');
            await this.saveWebMsg('photos' , this.imgUrls.join(','))
            this.cur = this.imgUrls.length-1;
          } else {
            wx.showToast({
              title: '网络异常',
              duration: 2000,
              icon: 'none'
            })
          }

        }).catch((err) => {
          wx.hideLoading();
          console.log('err -- ', err);
        })

      },
      async delBanner(index) {//删除banner图片
        if (this.cur !== 0) this.cur -= 1
        this.changeing = true;
        let img = this.imgUrls.filter((item, position)=>position!==index);
        if(index==0) await this.saveWebMsg('photos' , 'empty');
        else await this.saveWebMsg('photos' , img.join(','));
        this.changeing = false;
        this.getWebMsg();
      },
      dialog_tap(str, value) {
        if (str == 'save') {
          if (this.dialog_type == 'videos') {
            if(!value){
              wx.showToast({
                title: '请输入有效的视频链接！',
                icon: 'none'
              });
              return
            }
            this.video_link = value;
            this.saveWebMsg( 'videoUrl' , value );

          } else {
            if(!util.checkPhone(value)){
              wx.showToast({
                title: '请输入正确的电话号码！',
                icon: 'none'
              });
              return
            }
            this.tel = value;
            this.saveWebMsg( 'phone' , value );
          }
        }

        this.dialog_show = false;
      },
      saveWebMsg( str , strValue ){
        console.log(strValue)
        wx.showLoading();
        let parmas = {} ;
        parmas[str] = strValue ;
        parmas.websiteId = this.websiteId ;
        console.log('parmas',parmas)
        return WXAJAX.POST(parmas, '', '/company/addWebsiteInfo').then((data) => {

          wx.hideLoading();
          if(data){
            wx.showToast({
              title: '成功！',
              icon: 'success'
            });
          }

        }).catch((err) => {
          wx.hideLoading();
          console.log("数据请求失败")
        });
      },
      toCompanyVideoList() {
        wx.navigateTo({
          url: '../companyVideos/main'
        })
      }
    }
  }
</script>

<style>

</style>



























