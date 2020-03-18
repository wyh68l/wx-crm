<template>
  <div class="h100p pb44">
    <!--banner-->
    <div class="w100p h375">
      <div class="edit_banner bgfff trans2" :class="changeing ? 'fade' : '' " v-if="imgUrls.length > 0">
        <swiper @change="swiperChange"  indicator-dots indicator-active-color="#ffffff" indicator-color="rgba(255, 255, 255, 0.4)" :current="cur" class="swiper-inner"  circular>
            <swiper-item v-for="(item,index) in imgUrls" :key="key">
              <img class="banner-img" :src="item" mode="aspectFill"/>
              <div class="tags">
                            <span class="w30 h30 del disflex align-cen jscen mb10" @click="delBanner(index)">
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png" alt=""
                                     class="w17 h17" />
                            </span>
              <span class="posre w30 h30 add disblock" @click="uploadpic(index)"></span>
              </div>
            </swiper-item>
        </swiper>
        <!--重置小圆点的样式  -->
        <!--<view class="dots">
          <block v-for="(item,index) in imgUrls" :index="index" :key="key">
            <view class="dot" :class="{'active':  index == cur}"></view>
          </block>
        </view>-->
        <!--重置小圆点的样式 end -->
      </div>

      <div v-else class="w100p h100p bgfff borderbox  textc pt123" @click="uploadpic(-1)">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/VR.png" alt=""
             class="w100 h100 mb5" />
        <p class="fs14 ca8">点击添加图片</p>
      </div>

      <canvas style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
              canvas-id="Canvas"></canvas>

    </div>


    <div class="mb10 bgfff pl15 pr15 disflex jsbet" @click="choose_class_show_tap">
      <div class="disflex align-cen">
        <span class="corange posre pr8 top3">*</span>
        <span class="fs14 c38">商品分类</span>
      </div>
      <div class="disflex align-cen">
        <input type="text" disabled class="fs14 pha8 textr pr12 lh44 h44" v-model="prodChooseClass"
               placeholder="请选择商品分类">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt=""
             class="w10 h10" />
      </div>
    </div>

    <div class="bgfff pt13 pl13 pr18 pb15 mb10">

            <textarea class="fs14 pha8 h30"
                      :maxlength="counter"
                      v-model="productsName"
                      placeholder="请输入商品名称"></textarea>
      <div class="textr fs12 ca8">{{productsName.length}}/{{counter}}</div>

    </div>

    <div class="bgfff pt13 pl13 pr18 pb15 mb10">

            <textarea class="fs14 pha8 h30"
                      maxlength="100"
                      v-model="describe"
                      placeholder="请输入商品简述"></textarea>
      <div class="textr fs12 ca8">{{describe.length}}/100</div>

    </div>

    <!--产品类型-->
    <div class="bgfff fs14 ca8 mb10">

      <div class="pl16 pr15 bbf7 lh44 posre" >
        <div class="bbe8" >
          <span class="mr16">商品价格</span>

          <div class="disflex align-cen posre pl42" @click="priceType = 1">
            <label class="checkBox" :class=" priceType===1 ? 'active' : '' ">
              <span></span>
            </label>
            <span class="c38 mr10">具体金额</span>
            <input type="digit" class="pha8 lh44 h44 fs14 c38 flex1" placeholder="如：99.00" v-model="specificPrice">
          </div>

          <div class="disflex align-cen posre pl42" @click="priceType = 2">
            <label class="checkBox" :class=" priceType===2 ? 'active' : '' ">
              <span></span>
            </label>
            <span class="c38 mr10">区间金额</span>
            <input type="number" class="pha8 lh44 h44 fs14 c38 w80" placeholder="如：99" v-model="areaPrice[0]">
            <div class="mr10 ml10">~</div>
            <input type="number" class="pha8 lh44 h44 fs14 c38 w80" placeholder="如：99" v-model="areaPrice[1]">
          </div>

        </div>

        <div>
          <span class="mr16">服务类型</span>
          <div class="mb10 bgfff fs14 ca8 disflex">

            <div class="disflex align-cen lh44 posre pl42 mr15" @click="serverType.shop = !serverType.shop">
              <label class="checkBox" :class=" serverType.shop ? 'active' : '' ">
                <span></span>
              </label>
              <span class="c38 pl11">到店</span>
            </div>

            <div class="disflex align-cen lh44 posre pl42" @click="serverType.door = !serverType.door">
              <label class="checkBox" :class=" serverType.door ? 'active' : '' ">
                <span></span>
              </label>
              <span class="c38 pl11">上门</span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <div class="bgfff textc fs14 ca8 pb36 mb44">
      <p class="lh44 pb25">产品详情</p>
      <span class="disinblock cblue bblue lh30 bradius5 pl11 pr11 mb10"
            @click="page_turn('companyIntro' , '?type=prod')">
                {{isControlChange&&productsId ? '修改内容' : '添加内容'}}
            </span>
      <div class="textl" v-if="editOperator" v-html="editOperator">
        <!--<div v-for="(v,k) in editOperator" v-html="v"></div>-->
      </div>


    </div>

    <!--添加商品分类-->
    <div v-if="chooseClassShow">
      <SelectorOne
        :title="'选择商品分类'"
        :status="chooseClassShow"
        :allClass="prodClass"
        :choose_id="choose_class_id"
        @closeModal="chooseClassShow=false"
        @choose_tap="choose_tap"></SelectorOne>
    </div>

    <!--bottom-->
    <!--    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="bottom_tap"></BottomButtonTwo>-->
    <div class="disflex fs18 textc lh45 fix_bottom">
      <span class="w100p ca8 bgblue cfff" @click.stop="bottom_tap">保存</span>
    </div>
  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import SelectorOne from '@/components/selectorOne' // 订单项
  import StaticResources from '@/components/StaticResources';

  import util from '@/utils'
  import WXAJAX from '@/utils/request'
  var app = getApp();
  export default {
    name: '',
    components: {StaticResources, BottomButtonTwo, SelectorOne},
    data() {
      return {
        productsName: '',
        counter: 60,
        online_pay: true,
        bottom: {
          left: {
            text: '预览', url: 'preview'
          },
          right: {
            text: '保存', url: 'save'
          }
        },
        chooseClassShow: false,
        prodClass: [{id:'manage', name: '管理分类'}],
        prodChooseClass: '',
        choose_class_id: 0,
        /*banner*/
        indicator: false, //是否显示指示点
        interval: 5000,  //自动切换时间间隔
        duration: 400,  //滑动动画时长
        autoplay: true, //是否自动切换
        circular: true, //是否采用衔接滑动
        cur: 0,         //当前所在滑块的index
        imgUrls: [],
        changeing: false,//是否在选择切换图片
        editOperator: '',//产品详情
        productsId: '',
        isControlChange: false,
        describe: '', // 商品简述
        priceType: 1,  // 金额类型， 1：具体金额， 2：区间金额
        specificPrice: '', // 具体金额值
        areaPrice: ['', ''], // 区间金额
        serverType:{
          shop: false,
          door: false,
        },
        isLoading: false, // 是否请求中
      }
    },
    mounted() {

    },
    async onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
    onShow() {
      let { productsId, type } = this.$root.$mp.query;
      this.isControlChange = wx.getStorageSync('isControlChange');

      if (this.isControlChange) {
        if (type == 'add') {
          this.productsName = '';
          this.imgUrls = [];
          this.editOperator = '';
          this.productsId = '';
        }

        if (productsId) {
          this.productsId = productsId;
          this.getProductInfo(productsId);
        }

        wx.removeStorageSync('isControlChange');
      }

      this.getInits();
      this.editOperator = wx.getStorageSync('editOperator') || this.editOperator || '';
    },
    onUnload(){
      this.clearData();
    },
    methods: {
      swiperChange(e) {
        this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
      },
      getInits() {
        wx.showLoading();
        WXAJAX.POST({ignore: true}, '', '/products/selectProductsTypeList').then((data, code) => {

          wx.hideLoading();
          if(data){
            data.forEach(function (i, k) {
              i.id = i.productsTypeId;
              i.name = i.productsTypeName;
            });
            this.prodClass = [{id:'manage', name: '管理分类'},...data];
          }else if( code != 209){
            this.prodClass = [{id:'manage', name: '管理分类'}];
          }

        }).catch((err) => {
          wx.hideLoading();
        });
      },
      getProductInfo(id){
        wx.showLoading();
        WXAJAX.POST({
          productsId: id,
        }, '', '/products/getProductsInfo').then((data, code) => {
          wx.hideLoading();

          if (data) {
            let price;

            this.productsName = data.productsName;
            this.choose_class_id = data.productsTypeId;
            this.editOperator = data.productsDetails;
            this.prodChooseClass = data.productsTypeName;
            this.describe = data.describe;

            try{
              price = JSON.parse(data.price);
            }catch (e) {
              price = parseInt(data.price) || 0;
            }

            if (Object.prototype.toString.call(price).toLowerCase() === '[object number]') {
              this.priceType = 1;
              this.specificPrice = data.price;
            }else {
              this.priceType = 2;
              this.areaPrice = price;
            }

            this.imgUrls = data.productsPhoto
                          ? data.productsPhoto.split(',').map(val=>{
                            return this.checkImgNameIsNumber(val) ? val : (val+'.primary.png')
                          })
                          : [];

            this.serverType = {
              shop: data.serviceType == 1 || data.serviceType == 3,
              door: data.serviceType == 2 || data.serviceType == 3,
            };
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      page_turn(url, query) {
        if(url.includes('companyIntro')){
          wx.setStorageSync('editOperator' , this.editOperator ) ;
        }
        query = query || '';
        wx.navigateTo({url: '/pages/' + url + '/main' + query})
      },
      checkField(){
        if (this.imgUrls.length == 0) {
          wx.showToast({
            title: '请选择商品图片！',
            icon: 'none'
          });
          return false;
        }
        if (this.choose_class_id == 0) {
          wx.showToast({
            title: '请选择商品分类！',
            icon: 'none'
          });
          return false;
        }
        if (!this.productsName) {
          wx.showToast({
            title: '请输入商品名称！',
            icon: 'none'
          });
          return false;
        }

        if (this.priceType === 1 && this.specificPrice <=0){
          wx.showToast({
            title: '请输入具体金额！',
            icon: 'none'
          });
          return false;
        }

        if (this.priceType === 2){
          let [ start, end ] = this.areaPrice;
          start = parseFloat(start);
          end = parseFloat(end);

          if (start <= 0) {
            wx.showToast({
              title: '请输入最小金额！',
              icon: 'none'
            });
            return false;
          }

          if (end <= 0) {
            wx.showToast({
              title: '请输入最大金额！',
              icon: 'none'
            });
            return false;
          }

          if (end < start) {
            wx.showToast({
              title: '最大金额不能小于最小金额！',
              icon: 'none'
            });
            return false;
          }
        }

        if (!this.serverType.shop && !this.serverType.door) {
          wx.showToast({
            title: '至少选择一种服务方式！',
            icon: 'none'
          });
          return false;
        }

        return true;
      },
      bottom_tap(method) {
        if (this.isLoading) return;
        if (!this.checkField()) return;

        let v = this;
        let price = this.priceType === 1 ? this.specificPrice : JSON.stringify(this.areaPrice);
        let shop = this.serverType.shop ? 1 : 0;
        let door = this.serverType.door? 2 : 0;
        let serviceType = shop + door;
        let productsPhoto = v.imgUrls.map(val=>val.replace('.primary.png', '')).join(',')

        wx.showLoading({mask:true});

        this.isLoading = true;
        WXAJAX.POST({
          productsName: this.productsName,
          productsTypeId: this.choose_class_id,
          productsDetails: this.editOperator,
          ispayment: this.online_pay ? 1 : 2,
          productsPhoto: productsPhoto,
          describe: this.describe,
          productsId: this.productsId || '',
          serviceType: serviceType,
          price: price,
        }, '', '/products/insertProducts').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });

          setTimeout(function () {
            v.clearData();
            wx.navigateBack();
            v.isLoading = false;
          }, 600);
        }).catch((err) => {
          console.log(err);
          v.isLoading = false;
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });

      },
      choose_class_show_tap() {
        this.chooseClassShow = !this.chooseClassShow;
      },
      choose_tap(id, i) {
        if(id == 'manage'){
          this.page_turn('companyPack/appointmentClassifyControl');
          return;
        }

        if (id == -1) return;
        this.choose_class_id = id;
        this.prodChooseClass = i;
        this.chooseClassShow = !this.chooseClassShow;
      },
      delBanner(index) {//删除banner图片
        if (this.cur !== 0) this.cur -= 1
        this.changeing = true;
        this.imgUrls.splice(index, 1);
        this.changeing = false;
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

        if(Object.prototype.toString.call(path) === '[object Array]'){
          this.uploadImgFun(path, 0, str);
        }
      },
      // 递归上传
      async uploadImgFun(arr, index = 0, str) {
        wx.showLoading({title: '上传中', mask: true})
        await this.uploadImg(arr[index], str)
        if (index < arr.length - 1) {
          this.uploadImgFun(arr, index + 1, str)
        }
      },
      uploadImg(path, str) {
        let v = this;
        wx.showLoading();

        return WXAJAX.UploadImage(path).then((data) => {
          wx.hideLoading();
          data = JSON.parse(data);

          if (data.code == '200') {
            this.imgUrls.push(WXAJAX.imgBackUrl + data.data + '.primary.png');
            this.changeing = false;
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
      clearData() {//清空数据
        this.productsName = '';
        this.imgUrls = [];
        this.editOperator = '';
        this.describe= '';
        this.priceType= 1;
        this.specificPrice= '';
        this.areaPrice= ['', ''];
        this.serverType={
          shop: false,
          door: false,
        };
        wx.setStorageSync('editOperator', '');
        wx.hideLoading();
      }
    }
  }
</script>

<style>

</style>


