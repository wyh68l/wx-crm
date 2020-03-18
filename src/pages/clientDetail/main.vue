<template>
  <div class="pb44">

    <!--top-->
    <div class="mt10">
      <MsgBox :msg="msgitem"
              :istel="true"
              :issppend_record="true"
              :islogtitle="true"
              :isport="true"
      >
      </MsgBox>
    </div>

    <p class="pl16 bgfff fs16 c38 fbold pt12">客户信息</p>

    <scroll-view scroll-x class="nav" scroll-with-animation>
      <div class="bgfff disflex fs12 pt14 pb15 pl14 nowrap">
        <div class="shadow_gray textc pt15 pl15 pr15 borderbox h65 mr10" @click="makePhone">
          <p class="disflex align-cen fs12">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png" alt="" class="w16 h16"/>
            <span class="pl9">拨打电话</span>
          </p>
          <p class="c78 fbold pt10 minw75">{{msgitem.phone || '未添加'}}</p>
        </div>

        <div class="shadow_gray textc pt15 pl15 pr15 borderbox h65 mr10" @click="addWx">
          <p class="disflex align-cen fs12">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/im_msg.png" alt="" class="w16 h16" />
            <span class="pl9">添加微信</span>
          </p>
          <p class="c78 fbold pt10 minw75">{{msgitem.personalWx || '未添加'}}</p>
        </div>

        <div class="shadow_gray textc pt15 pl15 pr15 borderbox h65 mr10" @click="copyText(msgitem.email || '')">
          <p class="disflex align-cen fs12">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/email.png" alt="" class="w16 h16" />
            <span class="pl9">邮箱</span>
          </p>
          <p class="c78 fbold pt10 minw50">{{msgitem.email || '未添加'}}</p>
        </div>

        <div class="pr10">
          <div class="shadow_gray  pt15 pl15 pr15 borderbox h65 mr10" @click="copyText(msgitem.createCompanyName|| '')">
            <p class="disflex align-cen fs12">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/company_3.png" alt=" " class="w16 h16" />
              <span class="pl9">企业</span>
            </p>
            <p class="c78 fbold pt10 minw50" style="white-space: nowrap">{{msgitem.createCompanyName|| '未添加'}}</p>
          </div>
        </div>

      </div>

    </scroll-view>

    <!--记录-->
    <div class="bgfff mb10 pb23">
      <Log :logs="followLogs"
           :msg="msgitem"
           :firstLog="firstLog"
           :isShowAdd="bottom.right.url!=='editLog'"
      >
      </Log>
      <p class="disflex align-cen jscen fs14 cb8" @click="page_turn('followLog','?cardId='+cardId)">
        <span class="pr8">查看更多</span>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10 "/>
      </p>
    </div>


    <div class="bgfff lh49 fs16 c38  pl15 pr15">

      <div class="disflex jsbet" @click="editTab=true">
        <span class="fbold pr10">标签</span>
        <div class="disflex row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10"/>
          <div class="disflex pt12 row-reverse wrap pb7 pr15">
                        <span class="ca8 textc pl12 pr13 lh25 fs14 bradius3 disblock bgf5f6 ml10"
                              v-for="(v,k) in msgitem.lableResponseList" :key="k"
                              :style="{ color : v.lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff' ,
                              background : v.lableColor } ">
                              {{v.lableName}}
                        </span>

          </div>
        </div>
      </div>

      <div class="disflex jsbet" @click="shareScopeShow=true">
        <span class="fbold pr10 w123">共享范围</span>
        <div class="disflex row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10"/>
          <span class="pr10 cblue">{{share_scope.name}}</span>
        </div>
      </div>

    </div>

    <div class="bgfff pt10 pb15">
      <div class=" pl42 pr43">
                <span class="disinblock  lh44 w290 textc cblue bblue bradius5 fs18 mb10 borderbox h44"
                      @click="addInputMoney"
                >录入成交金额</span>

        <div class="disflex align-cen jscen" @click="logs_open_tap" v-if="tradingVolumeLists.length > 0">
          <span class="fs14 ca8">成交记录</span>
          <span v-show="!logs_show">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt=""  class="w10 h10 ml7"/>
          </span>
          <span v-show="logs_show">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/up.png" alt=""  class="w10 h10 ml7" />
          </span>
        </div>
      </div>


      <!--记录-->
      <div class=" bgfff  overhidden pl14 pr23 client_detail_log trans2"
           v-if="tradingVolumeLists.length > 0"
           :style="{height : log_height + 'px' }">
        <p class="fs14 cb8 pb25 pt7">成交总额：{{msgitem.turnoverAmount/100}}元</p>
        <div class="moneyLog">
          <Log :logs="tradingVolumeLists" :type="'1'" :isTopTitle="'1'" :hideFirst="true"></Log>
        </div>
      </div>

    </div>

    <div class="bgfff lh49 fs16 c38  pl15 pr15 mb10">

      <div class="disflex jsbet">
        <span class="fbold pr10">{{msgitem.customerRemark  || '备注'}} </span>
        <!--<input type="text" class="pha8 textr flex1 lh49 h49" placeholder="备注" v-model="remark">-->
      </div>

    </div>

    <!--成交金额-->
    <div v-show="dialog_money_show">
      <DialogBox :dialog_title="dialog_money_title" @btn_tap="trademoney_btn_tap" :dialog_ph="dialog_money_ph"
                 :dialog_ph_2="dialog_money_ph_2"
                 :type="'input_2'"
                 :default="tradingVolume"
                 :default_2="tradingVolume_mark"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>

    </div>

    <!--提示弹框-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="'无法添加'" @btn_tap="hint_btn_tap" :dialog_ph="dialog_ph"
                 :type = "'hint1'"
                 :default="classify_name"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>

    </div>

    <!--标签弹框-->
    <div v-if="editTab">
      <ClientAddModal :status="editTab"
                      :tabs="tabs"
                      @modal_tab_tap="modal_tab_tap"
                      @modal_btn_tap="modal_btn_tap"
                      @closeModal="editTab = !editTab"
      ></ClientAddModal>
    </div>

    <!--共享范围-->
    <div v-if="shareScopeShow">
      <SelectorOne
        :title="'选择共享范围'"
        :status="shareScopeShow"
        :allClass="shareScopeClass"
        :choose_id="share_scope.id"
        @choose_tap="choose_tap"
        @closeModal="shareScopeShow=false"
      ></SelectorOne>
    </div>

    <div v-if="isShowCourse">
      <addWxCourse :isShow="isShowCourse"
                   @close="isShowCourse=false"
      />
    </div>

    <!--bottom-->
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>

  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import ClientAddModal from '@/components/clientAddModal' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import MsgBox from '@/components/msgBox' // 订单项
  import Log from '@/components/log' //
  import StaticResources from '@/components/StaticResources';
  import SelectorOne from '@/components/selectorOne' // 订单项
  import AddWxCourse from '@/components/addWxCourse'

  import WXAJAX from '../../utils/request'
  import util from '../../utils/index'

  export default {
    name: '',
    components: {BottomButtonTwo,DialogBox,MsgBox,Log, ClientAddModal, SelectorOne, AddWxCourse, StaticResources},
    data() {
      return{
        msgitem:  { },
        tel : '' ,
        wx : '' ,
        company_wx : '' ,
        email : '' ,
        post : '' ,
        company : '' ,
        remark : '' ,
        choose_tab : [{}, {}, {}] ,
        share_type:{
          1 : '独占',
          2 : '共享' ,
          3 : '成单'
        },
        bottom: {
          left: {
            text: '修改', url: 'edit'
          },
          right: {
            text: '抢为独占', url: 'oneself'
          }
        },
        /*成交金额*/
        tradingVolumeLists:[],//成交记录
        dialog_money_show:false ,
        tradingVolume_mark:'',//成交金额备注
        dialog_money_title:'成交金额',
        dialog_money_ph:'请输入成交金额',
        dialog_money_ph_2:'备注' ,
        dialog_show:false,
        logs_show:false ,//是否显示成交记录
        log_height:'0',//成交记录div的高度
        _default_height : 0 ,
        shared_scope_show:false ,//共享范围显示
        shareClass:[
          {name:'独占' , id:'oneself'},
          {name:'共享' , id:'shared'},
        ],
        shared_id:0,
        cardId:0,//用户id
        customerId:0,
        companyId:0,
        followLogs:[],//跟进记录
        tabs : [ ],
        editTab: false,
        share_scope : {
          name : '共享',
          id : 2 ,
        } ,
        shareScopeShow:false ,
        shareScopeClass:[
          {name:'独占' , id:1},
          {name:'共享' , id:2},
        ],
        isShowCourse: false,
        firstLog: '', // 第一条记录
      }
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: "客户详情"
      });

      let v = this ;
      this.bottom.right = {
        text: '抢为独占', url: 'oneself'
      };
      this.tradingVolumeLists = [] ;
      this.msgitem = {} ;
      this._default_height = 0 ;
      this.logs_show = false;
      this.log_height = '0' ;
      this.cardId = this.$root.$mp.query.cardId ;

      if(this.cardId !=0 ){
        this.getClientMsg() ;
        this.getFollowLog() ;
      }
      this.getTabs();
    },
    onUnload(){
      this.cardId = 0 ;
    },
    async onPullDownRefresh() {
      this.tradingVolumeLists = [] ;
      this.msgitem = {} ;
      this._default_height = 0 ;

      if(this.cardId !=0 ){
        this.getClientMsg() ;
        this.getFollowLog() ;

      }
      this.getTabs();
      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 2*1000)
    },
    mounted() {

    },
    methods: {
      getClientMsg(){//获取客户信息
        wx.showLoading();
        WXAJAX.POST({
          cardId  : this.cardId ,
        }, '', '/customer/getCustomerInfo').then((data) => {

          wx.hideLoading();
          if(data){
            data.userLogo = data.logo || '';
            this.msgitem = data ;
            this.$set(this.share_scope , 'id' , data.customerState ) ;
            this.firstLog = data.createTime+ '由 '+ data.followName+' 主动加入';
            switch (data.customerState) {
              case 1 :
                this.$set(this.share_scope , 'name' ,'独占' ) ;
                break ;
              case 2 :
                this.$set(this.share_scope , 'name' ,'共享' ) ;
                break ;
              case 3 :
                this.$set(this.share_scope , 'name' ,'成单' ) ;
                break ;
            }
            wx.setStorageSync('clientDetail' , data ) ;

            if(this.msgitem.customerState == 1){//独占客户
              this.$set(this.bottom.right , 'text' , '添加跟进记录');
              this.$set(this.bottom.right , 'url' , 'editLog');
            }
            this.getMoneyLog();

            this.choose_tab = [...data.lableResponseList.map(i=>{
              return {
                bg:i.lableColor ,
                id : i.lableId ,
                title : i.lableName ,
                parentId : i.parentId ,
                color : i.lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff',
              }
            }), {}, {}];
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      getTabs(){//获取标签数据
        wx.showLoading();
        let v = this ;
        WXAJAX.POST('', '', '/companyCustomerLable/getTree').then((data) => {
          wx.hideLoading();
          if(data){
            v.lists = [] ;
            let datas = [] ;
            data.forEach(function (i1, k1 ) {

              let choose_id = 0 ;
              if(v.choose_tab[0].parentId){

                v.choose_tab.forEach(function (i3 , k3) {
                  if(i1.lableId == i3.parentId){
                    choose_id = i3.id ;
                  }
                });
              }

              datas.push({
                title : i1.lableName ,
                id : i1.lableId ,
                choose_id:choose_id,
                choose_title:'',
                child : [] ,
              });
              i1.lableResponses && i1.lableResponses.forEach(function (i2,k2) {
                datas[k1].child.push({
                  id : i2.lableId ,
                  title : i2.lableName ,
                  color : i2.lableColor ,
                  labelId : 0
                })
              })

            });
            v.tabs = datas;
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      getMoneyLog(isShow){//获取成交金额记录
        wx.showLoading();
        let v = this ;
        WXAJAX.POST({
          customerId   : this.msgitem.customerId  ,
        }, '', '/customer/getInputDealList').then((data) => {

          wx.hideLoading();
          if(data){
            data.forEach(function (i, k) {
              i.time = util.getdate( i.createTime , 'monthTime') ;
              i.time = i.time.split(' ');
              i.photos = i.photos ? i.photos.split(','): [];
            });
            v.tradingVolumeLists = data ;

            if(isShow) v.logs_open_tap(isShow);
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      getFollowLog(){//获取跟进记录
        wx.showLoading();
        WXAJAX.POST({
          cardId  : this.cardId ,
        }, '', '/followRecord/getFollowList').then((data) => {

          wx.hideLoading();
          if(data){
            data = data.splice(0,3);
            data.forEach(function (i, k) {
              i.followRemark = JSON.parse(i.followRemark) ;
              i.infoText = i.followRemark.data ;
              i.time = util.getdate( i.createTime , 'monthTime') ;
              i.time = i.time.split(' ');
              // 1 -- 设置标签
              // 2 -- 修改客户共享范围
              // 3 -- 手动添加为客户
              // >= 4 -- 直接显示数据( 1 -- 电话 ， 2 -- 微信 ， 3 -- 手动添加 ， 4 -- 当面拜访 ， 5 -- 其他)
              if(i.followType){
                switch (i.followType) {
                  case 1 :
                    i.mark = '电话拜访' ;
                    i.name = i.followName ;
                    break;
                  case 2 :
                    i.mark = '微信拜访' ;
                    i.name = i.followName ;
                    break;
                  case 3 :
                    i.mark = i.followName ;
                    i.name = '' ;
                    break;
                  case 4 :
                    i.mark = '当面拜访' ;
                    i.name = i.followName ;
                    break;
                  case 5 :
                    i.mark = i.followName ;
                    break;
                }
                i.infoType = 3 + i.followType;
              }else{
                i.infoType = i.followRemark.type ;
              }
            });
            this.followLogs = data;
            console.log(this.followLogs) ;
          }
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      page_turn(method , query){
        query = query || '' ;
        if(method == 'edit'){//修改独占客户详情
          // this.editTab = true ;
          wx.navigateTo({url:'../clientAdd/main?type=edit&cardId='+this.cardId});
        }else{
          if(method == 'oneself'){
            this.toMyClient();//抢为独占客户
            return
          }
          if(method == 'editLog'){
            query = '?clientName='+this.msgitem.name + '&id='+this.msgitem.cardId ;
          }
          wx.navigateTo({url:'../'+method+'/main'+query});

        }
      },
      addInputMoney(){
        wx.navigateTo({
          url: `/pages/inputMoney/main?customerId=${this.msgitem.customerId}`,
        });
      },
      modal_tab_tap(index1 , id, index2){//点击标签弹框 tab
        this.$set(this.tabs[index1] , 'choose_id' , id);
        let item = this.tabs[index1].child[index2];

        this.$set(this.choose_tab[index1] , 'bg',item.color);
        this.$set(this.choose_tab[index1] , 'id' , id ) ;
        this.$set(this.choose_tab[index1] , 'title' , item.title ) ;

        if(item.color == '#F5F5F6'){
          this.$set(this.choose_tab[index1] , 'color' , '#A8A8A8')
        }else{
          this.$set(this.choose_tab[index1] , 'color' , '#fff')
        }
      },
      modal_btn_tap(method){//点击标签弹框按钮
        if(method == 'reset'){//重置

          let v = this ;

          v.tabs.forEach(function (item,index) {

            v.$set(v.tabs[index] , 'choose_id' , '');

            v.$set(v.choose_tab[index] , 'bg',item.child[0].color);
            v.$set(v.choose_tab[index] , 'id' , item.child[0].id ) ;
            v.$set(v.choose_tab[index] , 'title' , item.child[0].title ) ;

            if(item.color == '#F5F5F6'){
              v.$set(v.choose_tab[index] , 'color' , '#A8A8A8')
            }else{
              v.$set(v.choose_tab[index] , 'color' , '#fff')
            }

          });
          this.choose_tab = [{},{},{}];
        }else if(method == 'confirm'){//确定
          this.editTab = false ;

          wx.showLoading();
          let v = this ,
            labelIds = [] ;
          v.choose_tab.forEach(function (i, k) {
            if(i.id){
              labelIds.push(i.id) ;
            }
          });

          WXAJAX.POST({
            customerId : v.msgitem.customerId ,
            lableIds : labelIds ,

          }, '', '/customer/updCustomerLabel').then((data) => {

            wx.hideLoading();
            wx.showToast({
              title: '成功！',
              icon: 'success'
            });
            setTimeout(()=>{
              this.getClientMsg();
              this.getFollowLog();
            }, 1.5*1000);
          }).catch((err) => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: err.message,
              duration: 2000,
              icon: 'none'
            });
          });

        }
      },
      hint_btn_tap(method,text){
        this.dialog_show = false ;

      },
      logs_open_tap(state){
        this.logs_show = typeof state === 'object' ? !this.logs_show : state;

        let v = this;

        if(this.logs_show){
          v.$nextTick(function () {
            setTimeout(function () {
              wx.createSelectorQuery().select('.moneyLog').boundingClientRect(function(rects){
                v.log_height = rects.height + 59;
              }).exec();
            },100)
          })

        }else{
          this.log_height = 0;
        }

      },
      choose_tap(url , name){
        this.shareScopeShow = false ;

        wx.showLoading();
        let v = this ;

        WXAJAX.POST({
          customerId  : v.msgitem.customerId ,
          customerState  : url ,
        }, '', '/customer/updCustomerState').then((data) => {

          wx.hideLoading();
          this.shareScopeShow = false ;
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          this.getClientMsg();
          this.getFollowLog();
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
      makePhone(){//拨打电话
        util.MakePhone(this.msgitem.phone || '');

      },
      copyText(text){
        if ( !text ) return;

        wx.setClipboardData({
          data: text,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                });
              }
            })
          }
        })
      },
      addWx(){//添加微信
        if (!this.msgitem.personalWx) {
          wx.showToast({
            title: '未绑定微信号',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        let v = this ;
        wx.setClipboardData({
          data: this.msgitem.personalWx,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
                v.isShowCourse=true;
              }
            })
          }
        })
      },
      trademoney_btn_tap(method , text1,text2){
        this.dialog_money_show = false ;

        if(method != 'save') return ;

        let v = this ,
          reg = /^[1-9]+[0-9]*]*$/ ;
        if(!reg.test(text1)){
          wx.showToast({
            title: '请输入正确的金额！',
            icon: 'none'
          });
        }

        wx.showLoading();

        WXAJAX.POST({
          customerId  : v.msgitem.customerId ,
          // companyId : v.msgitem.companyId ,
          money : (text1 * 100).toFixed(0),
          remark : text2 ,
        }, '', '/customer/inputDealMoney').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          this.getClientMsg();
          this.getFollowLog();
          this.getMoneyLog(true);
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
      toMyClient(){
        wx.showLoading();
        let v = this ;

        WXAJAX.POST({
          customerId  : v.msgitem.customerId ,
          customerState  : 1 ,

        }, '', '/customer/updCustomerState').then((data) => {

          wx.hideLoading();
          this.getClientMsg();

          wx.showToast({
            title: '成功！',
            icon: 'success'
          });

        }).catch((err) => {
          console.log(err);
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
  .client_detail_log .follow_log{
    padding-left: 16upx;
  }
  scroll-view{
    background: #fff;
    box-sizing: border-box;
  }
</style>





















