<template>
  <div class="h100p">

    <div class="pb70" v-if="classify.length">
      <!--产品-->
      <div v-for="(v,k) in classify" :key="k"  class="bgfff ">


        <div class="disflex jsbet pr11 align-cen" @click="open_lists(k)">
          <span class="lh44 pl15 fbold">{{v.name}} <span v-if="v.goodsModelList">({{v.goodsModelList.length}})</span></span>
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/up.png" alt="" class="w10 h10" v-if="v.open" />
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt="" class="w10 h10" v-if="!v.open"/>
          <!--<span class="fs12 lh44 ca8">图标</span>-->
        </div>
        <div class="btf7 bbf7 prod_classify" :class=" v.open ? '' : 'close'"
             :style="v.open ? {height : heights[k]+'px'} : '' ">
          <div class=" h85 prod-box " v-for="(prod,k2) in v.goodsModelList" :key="k2">

            <ProdItem :prod="prod" :isdel="true"
                      :type="'small'" :index1="k"
                      :index2="k2"
                      @prod_tap="prod_tap"
                      @del="del">
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
  import StaticResources from '@/components/StaticResources';

  export default {
    name: '',
    components: {BottomButtonTwo,ProdItem, StaticResources, NoData},
    data() {
      return{
        classify:[],
        bottom:{
          left :{
            text : '分类管理' , url : 'classifyControl'
          },
          right : {
            text : '添加商品' , url : 'prodDetail'
          }
        },
        heights:[],

      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "产品管理"
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
            resolve(rect.height);
          }).exec();
        }).then((height)=>height);
      },
      page_turn(url){
        wx.setStorageSync('isControlChange', true);
        wx.navigateTo({url: '../'+ url +'/main?type=add'})
      },
      async open_lists(k){
        let height = await this.getProdHeight();
        var _status = this.classify[k].open ;
        let goodsModelList = this.classify[k].goodsModelList

        this.$set(this.heights, k, height * (goodsModelList ? goodsModelList.length : 0));
        this.$set(this.classify[k],'open',!_status);
      },
      prod_tap(id,type, goodsId){//产品详情
        wx.setStorageSync('isControlChange', true);
        wx.navigateTo({url: '../prodDetail/main?goodsId='+goodsId})
      },
      //(1)产品管理界面初始化
      productInitialization(){
        let v = this;
        v.heights = [];
        wx.showLoading() ;
        WXAJAX.POST({
        },'','/goods/getGoodsTypeInfo').then((data) => {
          wx.hideLoading();
          if(data){
            data.forEach(function(i,k){
              i.open = false;
              if(i.goodsModelList){
                i.goodsModelList.forEach(function (i2, k2) {
                  i2.price = (i2.price/100).toFixed(2) ;
                  i2.photo = i2.goodPhoto.split(',')[0];
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
      del(goodsId , index1 ,index2){
        console.log(goodsId , index1 ,index2 );
        this.classify[index1].goodsModelList.splice(index2 , 1);
        this.$set( this.heights , index1 , this.heights[index1] - 85 ) ;

        wx.showLoading() ;
        WXAJAX.POST({
          goodsId : goodsId ,
        },'','/goods/delGoodsInfo').then((data) => {
          wx.hideLoading();
          if(data){
            console.log(data)
          }
        }).catch((err) =>{
          wx.hideLoading();
          console.log(err)
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
