<template>
  <div>

    <div class="bgfff lh49 fs16 c38 pl15 pr15 mb11">
      <div class="disflex jsbet">
        <span class="fbold pr16 marks">姓名</span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="姓名" v-model="name" >
      </div>

      <div class="disflex jsbet">
        <span class="fbold pr16">手机号  </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="手机号" v-model="tel" >
      </div>

      <div class="disflex jsbet">
        <span class="fbold pr10">微信号 </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="微信号" v-model="wx" >

      </div>

      <div class="disflex jsbet">
        <span class="fbold pr10">企业微信 </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="企业微信" v-model="company_wx" >

      </div>

      <div class="disflex jsbet">
        <span class="fbold pr10">邮箱 </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="邮箱" v-model="email" >

      </div>


    </div>


    <div class="bgfff lh49 fs16 c38  pl15 pr15 mb11">
      <div class="disflex jsbet">
        <span class="fbold pr10">职位</span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="职位" v-model="post" >
      </div>

      <div class="disflex jsbet">
        <span class="fbold pr10">企业 </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="企业名称" v-model="createCompanyName" >
      </div>

    </div>

    <div class="bgfff lh49 fs16 c38  pl15 pr15">

      <div class="disflex jsbet">
        <span class="fbold pr10">备注 </span>
        <input type="text" class="pha8 textr flex1 lh49 h49" placeholder="备注" v-model="remark" >
      </div>

      <div class="disflex jsbet" @click="editTab = !editTab">
        <span class="fbold pr10">标签</span>
        <div class="disflex row-reverse align-cen">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />

          <div class="disflex pt12 row-reverse wrap pb7">
                        <span v-for="(v,k) in choose_tab" class="bradius3 lh25 pl12 pr13 mr10 fs14 h25 mb5"
                              :key="k"
                              :style="{'background' : v.bg , 'color' : v.color}"
                              v-if="v.title">
                            {{v.title}}
                        </span>
          </div>
        </div>
      </div>

    </div>

    <p class="lh32 pl16 fs12 ca8">标签能对客户进行分类，可用于筛选和搜索</p>

    <div class="bgfff lh49 fs16 c38  pl15 pr15">

      <div class="disflex jsbet" @click="shareScopeShow = !shareScopeShow">
        <span class="fbold pr10 marks w74">共享范围</span>
        <div class="disflex row-reverse align-cen" >
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />
          <span class="pr15">{{share_scope.name}}</span>
        </div>
      </div>

    </div>

    <p class="lh32 pl16 fs12 ca8 mb10">独占客户只能自己查看，共享客户全企业可查看</p>

    <div class="pb50 lh49 fs16 c38" @click="addTradingMoneyShow">
      <div class="disflex jsbet bgfff  pl15 pr15">
        <span class="fbold pr10">成交金额</span>
        <div class="disflex row-reverse align-cen" >
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10" />
          <span class="pr15">{{tradingVolume || '请输入成交金额'}}</span>
        </div>
      </div>
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


    <!--提示弹框-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="'无法添加'" @btn_tap="hint_btn_tap" :dialog_ph="dialog_ph"
                 :memberType="addClientDialogType"
                 :memberInfo="addClientDialogTypeInfo"
                 :type = "'hint1'"
                 :left="'取消'"
                 :right="addClientDialogRightTips"
      ></DialogBox>
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

    <!--共享范围-->
    <div v-if="shareScopeShow">
      <SelectorOne
        :title="'选择共享范围'"
        :status="shareScopeShow"
        :allClass="shareScopeClass"
        :choose_id="share_scope.id"
        @choose_tap="choose_scope_tap"
        @closeModal="shareScopeShow=false"
      ></SelectorOne>
    </div>



    <!--bottom-->
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>

  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import ClientAddModal from '@/components/clientAddModal' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import SelectorOne from '@/components/selectorOne' // 订单项
  import StaticResources from '@/components/StaticResources';
  import WXAJAX from '../../utils/request'
  import util from '../../utils/index'


  export default {
    name: '',
    components: {ClientAddModal,BottomButtonTwo,DialogBox,SelectorOne, StaticResources},
    data() {
      return{
        name:'',
        tel : '' ,
        wx : '' ,
        company_wx : '' ,
        email : '' ,
        post : '' ,
        createCompanyName : '',
        company : '' ,
        remark : '' ,
        logo: '',
        tradingVolume:'',//成交金额
        choose_tab : [{},{},{}] ,
        share_scope : {
          name : '共享',
          id : 2 ,
        } , //1:独占客户，2:共享客户, 3:成单客户
        shareScopeShow:false ,
        shareScopeClass:[
          {name:'独占' , id:1},
          {name:'共享' , id:2},
        ],
        bottom: {
          left: {
            text: '取消', url: 'cancel'
          },
          right: {
            text: '保存', url: 'save'
          }
        },
        editTab:false ,
        tabs : [ ],
        dialog_show:false,
        addClientDialogRightTips: '确定',
        addClientDialogType: '',
        addClientDialogTypeInfo: '',
        memberName: '',
        /*成交金额*/
        dialog_money_show:false ,
        tradingVolume_mark:'',//成交金额备注
        dialog_money_title:'成交金额',
        dialog_money_ph:'请输入成交金额',
        dialog_money_ph_2:'备注' ,
        cardId : 0 ,//客户id
        editType : 'add' ,//
        userId:0,
        customerId:0,
        companyId:0,
      }
    },
    onShow(){
      let company = wx.getStorageSync('choose_company') || '' ,
        company_id = wx.getStorageSync('choose_company_id') || 0 ;

      this.companyId = company_id ;
      this.company = company ;

      if (wx.getStorageSync('isClearClientInfo')) {
        wx.removeStorageSync('isClearClientInfo');
        this.clearData();
      }
      this.getTabs();
    },
    onUnload(){
      wx.setStorageSync('clientDetail' , '') ;
    },
    mounted() {
      this.editType = this.$root.$mp.query.type || 'add';
      this.cardId = this.$root.$mp.query.cardId || '';
      this.userId = this.$root.$mp.query.userId || '';

      this.companyId = 0 ;
      this.company = '' ;

      let title = '添加客户';

      if(this.editType == 'edit'){//修改
        title = '修改客户' ;
        this.getClientMsg() ;
      } else if (this.editType == 'userAdd') {
        this.getClientMsg() ;
      }

      wx.setNavigationBarTitle({
        title: title
      });

    },
    methods: {
      clearData(){
        this.userId = '' ;
        this.customerId = '';
        this.companyId = '';
        this.name = '';
        this.tel = '';
        this.wx = '';
        this.company_wx = '';
        this.email = '';
        this.post = '';
        this.logo = '';
        this.company = '';
        this.remark = '';
        this.tradingVolume = '';
        this.tradingVolume_mark = '';
        this.createCompanyName = '';
        this.choose_tab = [{},{},{}] ;
      },
      getClientMsg(){//获取客户信息
        wx.showLoading();
        let v = this ;

        let url = this.editType == 'userAdd' ? '/businessCard/getCompanyUserInfo': '/customer/getCustomerInfo';

        WXAJAX.POST({
          cardId  : this.cardId ,
          userId: this.userId,
        }, '', url).then((data) => {

          wx.hideLoading();
          if(data){
            data.customerState = data.customerState || 1;
            this.userId = data.userId || '';
            this.customerId = data.customerId || '';
            this.companyId = data.companyId || '';
            this.name = data.name || '';
            this.tel = data.phone || '';
            this.wx = data.personalWx || '';
            this.company_wx = data.companyWx || '';
            this.email = data.email || '';
            this.post = data.position || '';
            this.logo = data.logo || '';
            this.company = data.companyName || '';
            this.remark = data.customerRemark || '';
            this.createCompanyName = data.companyName || '';
            this.$set(this.share_scope , 'id' , data.customerState||1 ) ;
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
            data.lableResponseList.forEach(function (i, k) {
              v.choose_tab[k] = {
                bg:i.lableColor ,
                id : i.lableId ,
                title : i.lableName ,
                parentId : i.parentId ,
                color : ''
              };
              if(i.lableColor == '#F5F5F6'){
                v.choose_tab[k].color = '#a8a8a8';
              }else{
                v.choose_tab[k].color = '#fff';
              }
            });
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

                v.choose_tab.forEach(function (i3 , k3) {
                  if (i3.id == i2.lableId){
                    v.$set(i3, 'bg', i2.lableColor);
                  }
                });
              })

            });
            v.tabs = datas;
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      page_turn(method){
        if(method == 'cancel'){//取消
          wx.reLaunch({
            url: '/pages/client/main',
          });
        }else if(method == 'save'){//保存客户

          let v = this ,
            _tabs = [] ,
            params = {} ,
            _url = '/customer/manualAdd';

          if(this.editType == 'edit'){
            _url = '/customer/updCustomer';
            params.customerId = this.customerId;
            params.cardId = this.cardId;
          }

          if(this.editType == 'userAdd') {
            params.userId = this.userId;
            params.entrance = 2;
          }

          if(!this.name.trim()){
            wx.showToast({
              title: '请输入姓名~！',
              icon: 'none'
            });
            return
          }

          if(!this.tel.trim() && !this.wx.trim()){
            wx.showToast({
              title: '请输入手机号~！',
              icon: 'none'
            });
            return
          }

          if(this.tel.trim() && !util.checkPhone(this.tel.trim())){
            wx.showToast({
              title: '请输入正确的手机号~！',
              icon: 'none'
            });
            return
          }

          v.choose_tab.forEach(function (i,k) {
            if(i.id){
              _tabs.push(i.id);
            }
          });

          wx.showLoading();
          params.name = this.name.trim() ;
          params.phone = this.tel.trim() ;
          params.companyId = this.companyId || 0;
          params.lableIds = _tabs ;
          params.logo = this.logo;
          params.customerState = v.share_scope.id ;
          if(this.wx.trim()) params.personalWx = this.wx.trim() ;
          if(this.company_wx.trim()) params.companyWx = this.company_wx.trim() ;
          if(this.email.trim()) params.email = this.email.trim() ;
          if(this.post.trim()) params.position = this.post.trim() ;
          if(this.remark.trim()) params.customerRemark = this.remark.trim() ;
          if(this.tradingVolume.trim()) params.turnoverAmount = this.tradingVolume.trim() * 100 ;
          if(this.tradingVolume_mark.trim()) params.remark = this.tradingVolume_mark.trim() ;
          if(this.createCompanyName.trim()) params.createCompanyName = this.createCompanyName.trim() ;
          WXAJAX.POST(params, '', _url, true).then((data, code) => {
            wx.hideLoading();

            if (data) {
              wx.showToast({
                title: '成功！',
                icon: 'success'
              });
              setTimeout(function () {
                wx.navigateBack();
              },800)
            }


          }).catch((err) => {
            console.log(err);

            if (err.code == 201) {
              wx.hideToast();
              let data;
              try{
                data = JSON.parse(err.message);
              }catch (e) {
                data = {};
              }

              if (data.type) {
                this.dialog_show = true;
                this.addClientDialogType = data.type;

                if (data.type == '1') {
                  this.addClientDialogRightTips = '确定';
                } else if (data.type == '2') {
                  this.addClientDialogRightTips = '确定';
                  this.addClientDialogTypeInfo = data.data;
                } else if (data.type == '3') {
                  this.addClientDialogRightTips = '抢为独占';
                  this.addClientDialogTypeInfo = data.data;
                }
              }

            }else{
              wx.showToast({
                title: err.message,
                duration: 2000,
                icon: 'none'
              });
            }

            wx.hideLoading();
          });
        }
      },
      modal_tab_tap(index1 , id ,index2){//点击标签弹框 tab
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
      modal_btn_tap(method ){//点击标签弹框按钮
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

          })
          this.choose_tab = [{},{},{}];

        }else if(method == 'confirm'){//确定

          this.editTab = false ;
          return;

          wx.showLoading();
          let v = this ,
            labelIds = [] ;
          v.choose_tab.forEach(function (i, k) {
            if(i.id){
              labelIds.push(i.id) ;
            }
          });

          WXAJAX.POST({
            customerId : v.customerId ,
            lableIds : labelIds ,

          }, '', '/customer/updCustomerLabel').then((data) => {

            wx.hideLoading();
            wx.showToast({
              title: '成功！',
              icon: 'success'
            });

          }).catch((err) => {
            console.log(err);
            wx.hideLoading();
          });


        }
      },
      hint_btn_tap(method,text){
        this.dialog_show = false ;

        if (method == 'save') {
          if (this.addClientDialogType === '3') {
            wx.navigateTo({url: '/pages/clientDetail/main?cardId='+this.addClientDialogTypeInfo});
          }
        }
      },
      trademoney_btn_tap(method , text1,text2){
        this.dialog_money_show = false ;
        this.tradingVolume = text1 ;
        this.tradingVolume_mark =  text2 ;

        if(method != 'save') {
          this.tradingVolume = '' ;
          this.tradingVolume_mark = '' ;
          return
        }
        if(this.editType == 'add') return ;

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
          customerId  : v.customerId ,
          companyId : v.companyId ,
          money : (text1 * 100).toFixed(0) ,
          remark : text2 ,
        }, '', '/customer/inputDealMoney').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });

      },
      choose_scope_tap(url , name ){//选择共享范围

        if(url == this.share_scope.id ) return ;

        if(url == -1){
          this.shareScopeShow = false ;
          return
        }
        this.$set(this.share_scope,'name' , name );
        this.$set(this.share_scope,'id' , url);
        this.shareScopeShow = false ;

        // wx.showLoading();
        // let v = this ;
        //
        // WXAJAX.POST({
        //   customerId  : v.customerId ,
        //   customerState  : url ,
        // }, '', '/customer/updCustomerState').then((data) => {
        //
        //   wx.hideLoading();
        //   this.shareScopeShow = false ;
        //   wx.showToast({
        //     title: '成功！',
        //     icon: 'success'
        //   });
        //
        // }).catch((err) => {
        //   console.log(err);
        //   wx.hideLoading();
        // });

      },
      addTradingMoneyShow(){
        this.dialog_money_show = !this.dialog_money_show ;
        this.tradingVolume = '' ;
        this.tradingVolume_mark = '' ;
      },
      toRoute(url,query){
        wx.navigateTo({url: '../' + url + '/main?type=' + query})
      }
    }
  }
</script>

<style>

</style>





















