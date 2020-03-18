<template>
  <div>

    <div class="bgfff lh49 fs16 c38 pl16 pr15 mb10">
      <div class="disflex jsbet"  @click="page_turn('searchChooseItem','?type=client')">
        <span class="fbold pr10 marks">跟进客户</span>
        <div class="disflex row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />
          <input type="text" class="pha8 textr flex1 lh49 h49 cblue pr15" placeholder="跟进客户" v-model="name"
                 disabled>
        </div>
      </div>

      <div class="disflex jsbet" @click="chooseClassShow = !chooseClassShow">
        <span class="fbold pr10 marks">跟进方式</span>

        <div class="disflex row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />
          <input type="text" class="pha8 textr pr15 flex1 lh49 h49 ca8" placeholder="请选择" v-model="method" disabled>
        </div>
      </div>
    </div>

    <div class="bgfff pt15 pl15 pr15 pb15">
      <p class="fs16 c38 pb10 fbold">跟进结果/备注</p>
      <textarea name="" id="" v-model="text" class="fs14 pha8" placeholder="请输入你的跟进结果"></textarea>
    </div>
    <div v-if="chooseClassShow">
      <SelectorOne
        :title="'选择跟进方式'"
        :status="chooseClassShow"
        :allClass="types"
        :choose_id="choose_class_id"
        @choose_tap="choose_tap"
      ></SelectorOne>
    </div>


    <!--bottom-->
    <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>


  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import SelectorOne from '@/components/selectorOne' // 订单项
  import StaticResources from '@/components/StaticResources';
  import WXAJAX from '../../utils/request'


  export default {
    name: '',
    components: {BottomButtonSmall,SelectorOne, StaticResources},
    data() {
      return{
        name : '' ,
        method : '' ,
        text:'' ,
        clientId : 0,
        types : [//1电话拜访 ,2微信拜访,3手动添加,4当面拜访,5其它
          {name:'电话拜访' , id:'1'},
          {name:'微信拜访' , id:'2'},
          {name:'手动添加' , id:'3'},
          {name:'当面拜访' , id:'4'},
          {name:'其它' , id:'5'},
        ],
        chooseClassShow:false,
        prodClass:[
          {name:'添加客户' , id:'clientAdd'},
          {name:'添加跟进记录' , id:'editLog'},
        ],
        choose_class_id:0,
        isChoose : false ,
      }
    },
    onShow(){
      this.name = wx.getStorageSync('clientName') || '' ;
      this.clientId = wx.getStorageSync('clientId') || '' ;
    },
    onUnload(){
      this.name = '' ;
      this.clientId = 0 ;
      this.choose_class_id = 0 ;
      this.text = '' ;
      this.method = '' ;
      this.chooseClassShow=false;
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "编辑跟进记录"
      });
      this.name = this.$root.$mp.query.clientName || '' ;
      this.clientId = this.$root.$mp.query.id || 0 ;
      if(!this.clientId){
        this.isChoose = true
      }else{
        this.isChoose = false ;
      }
    },
    methods: {
      btn_tap(url) {

        if(this.clientId == 0){
          wx.showToast({
            title: '请选择跟进客户！',
            icon: 'none'
          });
          return
        }

        if(this.choose_class_id == 0){
          wx.showToast({
            title: '请选择跟进方式！',
            icon: 'none'
          });
          return
        }

        wx.showLoading();
        let v = this ;
        WXAJAX.POST({
          cardId  : this.clientId,
          followType : this.choose_class_id ,
          followRemark : this.text.trim() ,
        }, '', '/followRecord/addFollow').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          wx.navigateBack()

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
          if(err.code == 204){
            v.nodata = true ;
          }
          setTimeout(function () {
            v.isLoading = false ;
          },500);
        });
      },
      page_turn(url,query){
        if(!this.isChoose) return ;
        query = query || '' ;
        wx.navigateTo({url: '../' + url + '/main' + query});

      },
      choose_tap(url , name ){
        this.chooseClassShow = false ;
        if(url == -1) return ;
        this.choose_class_id = url ;
        this.method  = name ;
      },
    }
  }
</script>





















