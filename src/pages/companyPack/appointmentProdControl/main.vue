<template>
  <div class="h100p">

    <div class="pb70" v-if="classify.length">
      <!--产品-->
      <div v-for="(v,k) in classify" :key="k"  class="bgfff ">


        <div class="disflex jsbet pr11 align-cen" @click="open_lists(k)">
          <span class="lh44 pl15 fbold">{{v.productsTypeName}} <span v-if="v.productsModelList">({{v.productsModelList.length}})</span></span>
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/up.png" alt="" class="w10 h10" v-if="v.open" />
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt="" class="w10 h10" v-if="!v.open"/>
          <!--<span class="fs12 lh44 ca8">图标</span>-->
        </div>
        <div class="btf7 bbf7 prod_classify" :class=" v.open ? '' : 'close'"
             :style="v.open ? {height : heights[k]+'px'} : '' ">
          <div class=" h85 prod-box " v-for="(prod,k2) in v.productsModelList" :key="k2">

            <ProdItem :prod="prod" :isdel="true"
                      :type="'small'" :index1="k"
                      :index2="k2"
                      @prod_tap="prod_tap(prod.productsId)"
                      @del="del(prod.productsId)">
            </ProdItem>

          </div>
        </div>

      </div>
    </div>
    <NoData v-else></NoData>


    <!--bottom-->
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>

  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import ProdItem from '@/components/prodItem' // 产品项
  import WXAJAX from '@/utils/request'
  import NoData from '@/components/noData'

  export default {
    name: '',
    components: {BottomButtonTwo,ProdItem, NoData},
    data() {
      return{
        classify:[],
        bottom:{
          left :{
            text : '分类管理' , url : 'companyPack/appointmentClassifyControl'
          },
          right : {
            text : '添加商品' , url : 'companyPack/appointmentProdDetail'
          }
        },
        heights:[],

      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "预约产品管理"
      });
      let v = this;
    },
    async onPullDownRefresh() {
      this.productInitialization();

      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 1*1000)
    },
    onShow(){
      //界面初始化
      this.productInitialization();
    },
    methods: {
      getProdHeight(){
        return new Promise((resolve, reject) => {
          wx.createSelectorQuery().select('.prod-box').boundingClientRect(function(rect){
            resolve(rect ? rect.height : 0);
          }).exec();
        }).then((height)=>height);
      },
      page_turn(url){
        wx.setStorageSync('isControlChange', true);
        wx.navigateTo({url: '/pages/'+ url +'/main?type=add'})
      },
      async open_lists(k){
        let height = await this.getProdHeight();
        var _status = this.classify[k].open ;
        let productsModelList = this.classify[k].productsModelList

        this.$set(this.heights, k, height * (productsModelList ? productsModelList.length : 0));
        this.$set(this.classify[k],'open',!_status);
      },
      prod_tap(productsId){//产品详情
        wx.setStorageSync('isControlChange', true);
        wx.navigateTo({url: '/pages/companyPack/appointmentProdDetail/main?productsId='+productsId})
      },
      //(1)产品管理界面初始化
      productInitialization(){
        let v = this;
        v.heights = [];
        wx.showLoading() ;
        WXAJAX.POST({
          ignore: true,
        },'','/products/selectProductsType').then((data) => {
          wx.hideLoading();
          if(data){
            data.forEach(function(i,k){
              i.open = false;
              if(i.productsModelList){
                i.productsModelList.forEach(function (i2, k2) {
                  i2.photo = i2.productsPhoto.split(',')[0];
                  i2.title = i2.productsName;
                  let price;

                  try {
                    price = JSON.parse(i2.price);
                  }catch (e) {
                    price = parseInt(i2.price) || 0;
                  }


                  if (Object.prototype.toString.call(price).toLowerCase() === '[object number]') {
                    i2.price = price.toFixed(2);
                  }else {
                    i2.price = price.map(val=>parseInt(val)).join('~');
                  }

                }) ;
                // v.heights.push(85*i.goodsModelList.length);
              }else{
                // v.heights.push(0);
              }
            });
            this.classify = data;
          }else{
            this.classify = [];
          }
        }).catch((err) =>{
          wx.hideLoading();
          console.log(err)
        });
      },
      del(productId){

        wx.showLoading() ;
        WXAJAX.POST({
          productsId : productId ,
        },'','/products/delProducts').then((data) => {
          wx.hideLoading();

          this.productInitialization();
        }).catch((err) =>{
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });

      }

    }
  }
</script>

<style>
  .prod_classify{
    transition: .2s;
    overflow: hidden;
    box-sizing: border-box;
    /*height: auto;*/
  }
  .prod_classify.close{
    height: 0;
    border-color: #fff;
  }

</style>
