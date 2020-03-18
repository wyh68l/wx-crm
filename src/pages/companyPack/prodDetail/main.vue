<template>
  <div class="h100p pb44">
    <!--banner-->
    <div class="w100p h375">

      <div class="edit_banner bgfff trans2" :class="changeing ? 'fade' : '' " v-if="imgUrls.length > 0">
        <swiper class="swiper-inner" indicator-dots indicator-active-color="#ffffff" indicator-color="rgba(255, 255, 255, 0.4)" :current="cur"  circular @change="swiperChange">
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

    <div class="bgfff pt13 pl13 pr18 pb15 mb10" @click="goodsNameIsFocus=true">

            <textarea class="fs14 pha8 h30"
                      :maxlength="counter"
                      @change="reset_text(this)"
                      @keydown="reset_text(this)"
                      @keyup="reset_text(this)"
                      v-model="prod_name"
                      @blur="goodsNameIsFocus=false"
                      :focus="goodsNameIsFocus"
                      placeholder="请输入商品名称"></textarea>
      <div class="textr fs12 ca8">{{prod_name.length}}/{{counter}}</div>

    </div>

    <!--产品类型-->
    <div class="bgfff fs14 ca8 mb10" v-for="(v,k) in prodSize" :key="v">
      <div class="lh44 disflex jsbet align-cen  pl16 pr15">
        <input type="text" placeholder="请输入产品类型名称" class="pha8 lh44 h44 fs14 ca8 pha8" v-model="v.specName">
        <div class="disflex align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190425173426.png"
               @click="delSize(k)"
               alt="" class="w20 h20"
          />
        </div>
      </div>

      <div class="pl16 pr15 bbf7 disflex jsbet lh44 posre" v-for="(size,index) in v.list" :key="index">
        <div class="disflex align-cen">
          <span class="mr16">规格</span>
          <input type="text" class="pha8 lh44 h44 fs14 c38 pha8 w70" placeholder="默认" v-model="size.specAttribute">
        </div>
        <div class="disflex align-cen">
          <span class="mr16">库存</span>
          <input type="digit" class="pha8 lh44 h44 fs14 c38 pha8 w40" placeholder="0"
                 v-model="size.specNum">
        </div>
        <div class="disflex align-cen">
          <span class="mr16">价格</span>
          <span class="corange">￥</span>
          <input type="digit" class="phorange lh44 h44 fs14 corange pha8 w40" placeholder="0"
                 v-model="size.price">
        </div>
        <div class="disflex align-cen flex-end w30">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/product-index/20190425173426.png"
               @click="delSize(k,index)" v-if="index > 0"
               alt="" class="w20 h20"
          />
        </div>
      </div>
      <p class="pl16 lh44" @click="addSize(k)">添加产品规格</p>

    </div>

    <p class="lh44 textc fs14 ca8 bgfff mb10" @click="addType">添加产品类型</p>

    <div class="mb10 bgfff fs14 ca8">

      <div class="disflex align-cen lh44 posre pl42">
        <label class="checkBox" :class=" online_pay ? 'active' : '' "
               @click="online_pay = !online_pay">
          <span></span>
        </label>
        <span class="c38 pl11">在线支付</span>
      </div>

      <div class="disflex align-cen lh44 posre pl42">
        <label class="checkBox" :class=" isDistribution ? 'active' : '' "
               @click="isDistribution = !isDistribution">
          <span></span>
        </label>
        <span class="c38 pl11">是否参加分销</span>
      </div>
    </div>

    <div class="bgfff textc fs14 ca8 pb36 mb44">
      <p class="lh44 pb25">产品详情</p>
      <span class="disinblock cblue bblue lh30 bradius5 pl11 pr11 mb10"
            @click="page_turn('../companyIntro' , '?type=prod')">
                {{isControlChange&&goodsId ? '修改内容' : '添加内容'}}
            </span>
      <div v-if="editOperator" v-html="editOperator">
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
        prod_name: '',
        text_length: 0,
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
        prodSize: [],//产品规格
        editOperator: '',//产品详情
        isDistribution: false, // 是否分销
        isCanSee: false,
        goodsNameIsFocus: false,
        goodsId: '',
        isControlChange: false,
      }
    },
    watch: {
      prod_name: function (newVal, oldVal) {
        if (newVal.length > 60) {
          this.intro = this.intro.slice(0, 60)
        }
      },

    },
    mounted() {

    },
    async onPullDownRefresh() {
      wx.stopPullDownRefresh();
    },
    onShow() {
      let { goodsId, type } = this.$root.$mp.query;
      this.isControlChange = wx.getStorageSync('isControlChange');

      if (this.isControlChange) {
        if (type == 'add') {
          this.prod_name = '';
          this.text_length = 0;
          this.imgUrls = [];
          this.prodSize = [];
          this.editOperator = '';
          this.isCanSee = false;
          this.goodsId = '';
        }

        if (goodsId) {
          this.goodsId = goodsId;
          this.getGoodsInfo(goodsId);
        }

        wx.removeStorageSync('isControlChange');
      }

      this.getInits();
      this.editOperator = wx.getStorageSync('editOperator') || this.editOperator || '';
    },
    methods: {
      swiperChange(e) {
        this.cur = e.target.current  //获取当前轮播图片的下标, 可以给当前指示点加样式
      },
      getInits() {
        wx.showLoading();
        WXAJAX.POST('', '', '/goods/getGoodsTypeInfo').then((data, code) => {

          wx.hideLoading();
          if(data){
            data.forEach(function (i, k) {
              i.id = i.goodstypeId;
            });
            this.prodClass = [{id:'manage', name: '管理分类'},...data];
          }else if( code != 209){
            this.prodClass = [{id:'manage', name: '管理分类'}];
          }

        }).catch((err) => {
          wx.hideLoading();
        });
      },
      getGoodsInfo(id){
        wx.showLoading();
        WXAJAX.POST({
          goodsId: id,
        }, '', '/goods/getGoodsInfo').then((data, code) => {
          wx.hideLoading();
          if (data) {
            data = data[0];
            this.prod_name = data.goodsName;
            this.choose_class_id = data.goodstypeId;
            this.editOperator = data.goodsDetails;
            this.online_pay = data.ispayment == 1;
            this.isDistribution = data.isDistribution == 1;
            this.prodChooseClass = data.goodsTypeName;
            this.prodSize = data.goodSpecModelList ? data.goodSpecModelList.map(val=>{
              return {
                specName: val.specName,
                specId: val.specId,
                list: val.goodSpecModelList ? val.goodSpecModelList.map(item=>{
                  return {
                    specAttribute: item.specAttribute,
                    specNum: item.specNum,//库存
                    price: item.price/100,
                    specId: item.specId,
                  }
                }) : []
              }
            }) : [];

            this.imgUrls = data.goodPhoto
                            ? data.goodPhoto.split(',').map(val=>{
                              return this.checkImgNameIsNumber(val) ? val : (val+'.primary.png')
                            })
                            : [];
          }
          console.log(data);
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      reset_text(_obj) {
        this.text = _obj.value.substring(0, 60);
        this.text_length = this.text.length;
      },
      page_turn(url, query) {
        if(url.includes('companyIntro')){
          wx.setStorageSync('editOperator' , this.editOperator ) ;
        }
        query = query || '';
        wx.navigateTo({url: '../' + url + '/main' + query})
      },
      bottom_tap(method) {
        if (this.imgUrls.length == 0) {
          wx.showToast({
            title: '请选择商品图片！',
            icon: 'none'
          });
          return
        }
        if (this.choose_class_id == 0) {
          wx.showToast({
            title: '请选择商品分类！',
            icon: 'none'
          });
          return
        }
        if (!this.prod_name) {
          wx.showToast({
            title: '请输入商品名称！',
            icon: 'none'
          });
          return
        }
        if (this.prodSize.length == 0 ||
          this.prodSize[0].list.length == 0 ) {
          wx.showToast({
            title: '请至少输入一种商品类型和规格！',
            icon: 'none'
          });
          return
        }

        let prodSize = JSON.parse(JSON.stringify(this.prodSize)),
          v = this;
        prodSize.forEach(function (i, k) {

          i.list.forEach(function (i2, k2) {
            i2.price = i2.price*100;
          })
        });
        let productsPhoto = v.imgUrls.map(val=>val.replace('.primary.png', '')).join(',');
        wx.showLoading();

        WXAJAX.POST({
          goodsName: this.prod_name,
          goodstypeId: this.choose_class_id,
          goodsDetails: this.editOperator,
          ispayment: this.online_pay ? 1 : 2,
          isDistribution: this.isDistribution ? 1: 0,
          goodSpecRequestList: prodSize,
          goodPhoto: productsPhoto,
          goodsId: this.goodsId || '',
        }, '', '/goods/addGoodsInfoList').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          v.isCanSee = true;
          setTimeout(function () {
            v.clearData();
            wx.navigateBack();
          }, 600);
        }).catch((err) => {
          console.log(err);
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
          this.page_turn('classifyControl');
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
      addType() {//添加产品类型
        wx.showLoading();
        this.prodSize.push({
          specName: '',
          list: [
            {
              specAttribute: '',
              specNum: '',//库存
              price: '',
            }
          ]
        });
        setTimeout(function () {
          wx.hideLoading();
        }, 200)
      },
      addSize(index1) {//添加规格

        this.prodSize[index1].list.push({
          specAttribute: '',
          specNum: '',//库存
          price: '',
        });
      },
      delSize(index1, index2) {
        if (index2 >= 0) {
          this.prodSize[index1].list.splice(index2, 1);
        } else {
          this.prodSize.splice(index1, 1);
        }

      },
      clearData() {//清空数据
        wx.showLoading();
        this.prod_name = '';
        this.text_length = 0;
        this.imgUrls = [];
        this.prodSize = [];
        this.editOperator = '';
        this.isCanSee = false;
        wx.setStorageSync('editOperator', '');
        wx.hideLoading();
      }
    }
  }
</script>

<style>

</style>


