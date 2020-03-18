<template>
  <div class="pt44 pb50">

    <div class="bgfff pl16  fs18 lh44 bbf7 fix_top borderbox h44 ">
      <!--普通-->
      <div class="disflex jsbet pr16" v-if="status == 0">
        <span class="ca8">共{{totalPerson}}人</span>
        <span class="c38" @click.stop="manage_status(isBoss ? 4 : 1)">管理</span>
      </div>

      <!--退出、移交客户-->
      <div class="disflex jsbet pr16" v-if="status == 1">
        <span class="ca8">共{{member_lists.length}}人</span>
        <span class="c38" @click.stop="manage_status(0)">完成</span>
      </div>

      <!--选择移交客户 \   移出，解散企业-->
      <div class="disflex jsbet align-cen" v-if="status == 2 || status == 4">
        <div class="ca8">
          <label class="checkBox"
                 @click.stop="choose_peo(0,'all')"
                 v-if="status == 2"
                 :class=" choose_all ? 'active' : '' ">
            <span></span>
          </label>
          <span class="pl30" v-show="choose_num == 0 && status == 2"
          >全选</span>
          <span class="pl30" v-show="choose_num > 0">选中{{choose_num}}人</span>
        </div>

        <div v-show="status == 2" class="inputOuter disflex align-cen">
          <input type="text"
                 class="lh44 h44  pl33 fs14 trans2"
                 :style="{width:inputWidth}"
                 :focus="focusTag"
                 v-model="searchkey"
                 @focus="inputFocus"
                 @confirm="search_confirm">
        </div>

        <div v-show="status == 4" class="pr16">
                    <span class="cblue pl10 pr11 disinblock lh30 borderbox bblue bradius15 fs14 mr11 "
                          @click.stop="manage_status(2)">移交客户</span>
          <span class="fs18 c38 fbold disinblock lh30" @click.stop="manage_status(0)">完成</span>
        </div>
      </div>

      <div v-if="status == 3" class="inputOuter disflex align-cen row-reverse lh44 align-cen h44">
        <input type="text"
               class="lh44 h44 pl33 fs14 trans2"
               :style="{width:inputWidth}"
               :focus="focusTag"
               v-model="searchkey"
               @focus="inputFocus"
               @confirm="search_confirm">
      </div>

    </div>
    <div v-for="(v,k) in member_lists" :key="k" :class="v.isMySelf==1 ? 'myself' : '' ">
      <PeoItem :peo="v" :status="status" :ischoose="choose_lists[v.id]"
               :index="k"
               @choose_peo="choose_peo"
               @row_tap="row_tap"></PeoItem>
    </div>

    <!--bottom-->
    <button v-show="status == 0"
      @click="showShareOrSave = true"
      class='bgblue w165 mr bg_line_blue textc cfff fs18 fix_bottom lh49'
      hover-class="other-button-hover">邀请加入企业</button>

    <div v-show="status == 1" class="textc cfff fs18 fix_bottom lh49 disflex">
      <span class="w50p ca8 bgfff" @click.stop="out('quit')">退出企业</span>
      <span class="w50p bg_line_blue " @click.stop="manage_status(2)">移交客户</span>
    </div>

    <div v-show="status == 2" class="textc cfff fs18 fix_bottom lh49 disflex">
      <span class="w50p ca8 bgfff" @click.stop="confirmMove(2)">移至共享</span>
      <span class="w50p trans1"
            :class="choose_num>0?'bg_line_blue':'bgtint_blue'"
            @click.stop="manage_status(3)">移交成员</span>
    </div>

    <div v-show="status == 4" class="textc cfff fs18 fix_bottom lh49 disflex">
      <template v-if="!isManageSelfBoss">
          <span class="w50p ca8 bgfff"
                @click="checkStaffHasClient"
                v-if="checkUserId.length"
              >
            移出企业
          </span>
            <span class="w50p ca8 bgfff"
                  v-else
                  @click.stop="out('dissolve')"
            >
            解散企业
          </span>
      </template>

      <span class="bg_line_blue" :class="isManageSelfBoss? 'w100p' : 'w50p'" @click.stop="checkSelect"
      >设置目标</span>
    </div>

    <!--dialog-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="dialog_title" @btn_tap="dialog_btn_tap" :dialog_ph="dialog_ph"
                 :dialog_ph_2="dialog_ph_2"
                 :type="'input_2'"
                 :default="months"
                 :default_2="num"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>
    </div>

    <div v-show="outHitShow">
      <DialogBox :dialog_title="'提示'"
                 @btn_tap="hitTap"
                 :dialog_ph="hitTitle"
                 :type = "'hint2'"
                 :left="'取消'"
                 :right="hitRight"
      ></DialogBox>
    </div>

    <div v-show="status == 3"
         @click="confirmMove(1)"
         class="bg_line_blue textc cfff fs18 fix_bottom lh49">
      确认移交
    </div>

    <!--bottom-->
    <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
    
    <!--分享-->
    <div v-if="showShareOrSave">
      <ShareOrSave
        :status="showShareOrSave"
        @closeModal="showShareOrSave = false"
        @save="save"
        >
      </ShareOrSave>
    </div>

    <!--全屏预览-->
    <div class="mask disflex align-cen jscen" v-if="isPreviewImg">
      <div class="disinblock">
        <div class="disflex flex-end ">
          <img @click="closePreviewImg"  src="/static/close.png" style="height: 48rpx; width: 48rpx"  />
        </div>
        <img class="img-size bradius5"  :src="maskImg"/>
        <div class="textc">
          <span @click="saveImg"  class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15" style="width: 465rpx;display: block">保存图片</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PeoItem from '@/components/peoItem' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import WXAJAX from '@/utils/request'
  import ShareOrSave from '@/components/shareOrSave'
  import { mapGetters } from 'vuex';

  export default {
    name: '',
    components: {PeoItem,DialogBox, ShareOrSave},
    data() {
      return{
        searchkey:'',
        ismanage:false ,
        member_lists:[],//成员列表
        clientList : [] , // 客户列表
        infoLists:[],//页面显示列表
        status:0,// 0 -- 普通 ， 1-- 退出、移交客户 ， 2 -- 选择移交客户 ， 3 -- 确认移交 ， 4 -- 移出，解散企业
        choose_num:0,//选择的人数
        choose_lists:{} ,
        choose_all:false ,
        dialog_show:false,
        dialog_title:'本月目标',
        dialog_ph:'月目标/元',
        dialog_ph_2:'客户独占数',
        classify_name:'',
        months:'',//月目标/元
        num:'',//客户独占数
        isBoss : false ,//是否 为Boss
        mySelf:{},
        checkUserId : [] ,//选择的用户id
        checkUserIndex : '' ,
        targetUserId:[] ,//客户归属人id
        outHitShow:false ,
        hitTitle:'退出企业需移交独占客户且此操作不可逆，是否确认退出？' ,
        hitRight : '移交客户',
        inputWidth : '0' ,
        focusTag : false ,
        canOut : false ,//是否没有客户，是否可以退出企业
        page:1,
        isLoading : false ,//是否在加载
        nodata:false ,//是否已经没有数据
        removeStaffInfo: {}, // boss移除员工时需要移交客户的成员信息
        isLeave: false,
        totalPerson: 0,
        showShareOrSave: false,
        maskImg: '',
        isPreviewImg: false
      }
    },
    mounted() {
    },
    onShow(){
      wx.setNavigationBarTitle({
        title: "企业成员"
      });
      this.isBoss = wx.getStorageSync('isBoss') || false ;
      this.removeSaffInfo = this.isBoss
        ? {}
        : {
          cardId: this.currentCompany.cardId,
          userId:  wx.getStorageSync('userId'),
        };
      this.$set(this, 'status', 0 );
      this.searchkey = '' ;
      this.outHitShow = false;
      this.dialog_show = false;
      this.isLoading = false;
      this.member_lists = [] ;
      this.page = 1 ;
      this.checkUserId = [];
      this.checkUserIndex = '';
      this.maskImg = '';
      this.isPreviewImg = false;
      this.inits();
    },
    async onPullDownRefresh() {
      // to doing..
      // 下拉刷新
      wx.showNavigationBarLoading();
      this.nodata = false ;
      this.member_lists = [] ;
      this.page = 1 ;
      this.isLoading = false ;
      this.searchkey = '' ;
      this.focusTag = false ;
      if(this.status == 2 ){
        this.inits('client');
      }else{
        this.inits();
      }
      wx.stopPullDownRefresh();
      setTimeout(function () {
        wx.hideNavigationBarLoading();
      },300)
    },
    onReachBottom() {
      let v = this ;
      if(this.status == 2 ){
        this.inits('client');
      }else{
        this.inits();
      }
    },
    methods: {
      inits(str, cardId){/*{{{*/
        let v = this ,
          url = '' ,
          params = {} ;
        if(v.isLoading){
          wx.hideLoading();
          return
        }
        v.isLoading = true ;

        if(str == 'client' || str == 'checkClient'){

          url = '/customer/getCustomer';
          params.customerState = 5;
          params.userId = v.removeSaffInfo.userId || '';
          params.cardId = cardId || v.removeSaffInfo.cardId || '';
        }else{
          url = '/businessCard/getCompanyStaffList'
        }

        if(this.searchkey){
          params.name = this.searchkey ;
        }
        params.pageNum = this.page ;
        params.type = 1 ;

        wx.showLoading();

        WXAJAX.POST(params, '', url).then((data) => {

          wx.hideLoading();
          if(data){
            let total = data.totalNumber;
            if(!this.isBoss && str == 'checkClient'){

              if(data.length == 0){//没有客户
                this.canOut = true ;
                this.hitTitle = '退出企业需移交独占客户且此操作不可逆，是否确认退出？' ;
                this.hitRight = '确定' ;
              }else{
                this.canOut = false ;
                this.hitTitle = '退出企业需移交独占客户且此操作不可逆，是否确认退出？' ;
                this.hitRight = '移交客户' ;
                this.outHitShow = true ;
                // this.manage_status(2) ;
              }
              return
            }

            !str && (data = data.list );
            let _data = [] ;
            data.forEach(function (i, k) {
              i.photo && (i.photo = i.photo.split(',')[0] );
              i.userLogo && (i.photo = i.userLogo) ;
              i.isCheck = false ;
              if(i.targetAmount){
                i.targetAmount = (i.targetAmount / 100).toFixed(2) ;
                if(i.targetAmount > 9999){
                  i.targetAmount = (i.targetAmount * 0.0001 ).toFixed(2) + '万' ;
                }
              }else{
                i.targetAmount = 0;
              }

              if(str == 'client'){
                i.userId = i.customerId ;
              }

              // if(i.isMySelf == 1){
              //   v.mySelf = i ;
              // }else{
                _data.push(i);
              // }
            });

            // if(v.status != 2 ){
            //   _data.unshift(v.mySelf) ;
            // }

            v.totalPerson = total;
            v.member_lists = v.$set(v, 'member_lists', [...v.member_lists , ..._data]) ;
            v.page ++ ;
            setTimeout(function () {
              v.isLoading = false ;
            },500);
          }else{
            if(!this.isBoss && str == 'checkClient'){
                this.$set(this, 'canOut', true);
                this.$set(this, 'outHitShow', true);
                this.$set(this, 'hitTitle', '退出企业需移交独占客户且此操作不可逆，是否确认退出？');
                this.$set(this, 'hitRight', '确定');
            }

            setTimeout(function () {
              v.isLoading = false ;
            },500);
          }
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
          if(err.code == 204){
            v.nodata = true ;
          }
          setTimeout(function () {
            v.isLoading = false ;
          },500);
        })
      },/*}}}*/
      // 关闭预览图片
      closePreviewImg() {
        this.isPreviewImg = false
        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: '#ffffff',
          animation: {
            duration: 1
          }
        })
      },
      save(){
        this.showShareOrSave = false
        if (this.maskImg !== '') {
          wx.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#848485',
            animation: {
              duration: 200
            }
          })
          this.isPreviewImg = true
          return
        }
        console.log(111)
        wx.showLoading();
        WXAJAX.POST({ignore: true}, '', '/company/invitePoster').then(data => {
          let url = WXAJAX.imgBackUrl + data;
          wx.getImageInfo({
            src: url,
            success: sres => {
              wx.hideLoading();
              this.maskImg = sres.path
              wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#848485',
                animation: {
                  duration: 200
                }
              })
              this.isPreviewImg = true
            }
          })
        }).catch((err) => {
          wx.hideLoading();
        })
      },
      // 保存图片
      saveImg() {
        wx.saveImageToPhotosAlbum({
          filePath: this.maskImg,
          success: res => {
            wx.setNavigationBarColor({
              frontColor: '#000000',
              backgroundColor: '#ffffff',
              animation: {
                duration: 1
              }
            })
            this.isPreviewImg = false
            wx.showToast({
              title: '保存成功',
              duration: 1000,
              icon: 'success',
              mask: true
            })
          }
        })
      },
      // 移出员工
      removeStaff(){
        this.checkStaffHasClient()
          .then(res=>{
            this.quitCompany({
              cardId: this.removeSaffInfo.cardId,
              userId: this.removeSaffInfo.userId,
            });
          })
          .catch(res=> {
            this.manage_status(2);
          });
      },
      // 校验员工是否有客户
      checkStaffHasClient(){
        let userId = this.checkUserId[0];
        this.removeSaffInfo = this.member_lists.find(res=>res.userId==userId);
        let cardId = this.member_lists.find(res=>res.userId==userId).cardId;

        return new Promise((resolve, reject) => {
          WXAJAX.POST({
            customerState : 5,
            userId: this.checkUserId[0],
            cardId: cardId,
            type: 1,
          }, '', '/customer/getCustomer').then((data) => {
            if(data && data.length){
              this.canOut = false ;
              this.hitTitle = '移出企业需移交独占客户且此操作不可逆，是否确认移出？' ;
              this.hitRight = '移交客户' ;
              this.outHitShow = true ;
              reject(false);
            }else {
              this.canOut = true;
              this.hitTitle = '移出企业需移交独占客户且此操作不可逆，是否确认移出？' ;
              this.hitRight = '确认移出' ;
              this.outHitShow = true ;
              resolve(true);
            }
          }).catch((err) => {
            reject(false);
          });
        })
      },
      // 退出企业
      quitCompany(param = {}){
        WXAJAX.POST(param, '', '/userTask/quitCompany').then((data) => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
          });

          if(this.isBoss){
            this.status = 0;
            this.member_lists = [] ;
            this.page = 1 ;
            this.removeSaffInfo = {};
            this.inits();
          }else{
            wx.clearStorageSync();
            setTimeout(function () {
              wx.reLaunch({url: '/pages/wxLogin/main'});
            },500);
          }

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
      checkSelect(){
        if (!this.checkUserId.length) {
          wx.showToast({
            title: '请先选择人员！',
            icon: 'none'
          });
          return;
        }

        let userId = this.checkUserId[0];
        let user = this.member_lists.find(res=>res.userId==userId);
        this.months = user.targetAmount;
        this.num = user.customerNum;
        this.dialog_show = true;
      },
      search_confirm() {
        /*        if (!this.searchkey) {
                    wx.showToast({
                        title: '请输入获取选择关键字！',
                        icon: 'none'
                    });
                    return;
                }*/

        this.member_lists = [] ;
        this.page = 1 ;
        if(this.status == 2){
          this.inits('client');
        }else{
          this.inits();
        }

      },
      manage_status(_status){//管理状态

        // if(_status ==  4 && this.choose_num == 0){
        //   wx.showToast({
        //     title: '请先选择人员！',
        //     icon: 'none'
        //   });
        //   return
        // }

        if (_status == 0) {
          this.checkUserId = [];
          this.checkUserIndex = '';
          if (this.isBoss){
            this.removeSaffInfo = {};
          }
          this.member_lists.map((val, idx)=>{
            this.$set(this.member_lists[idx] , 'isCheck' , false);
          });

        }

        if(_status ==  2){
          wx.setNavigationBarTitle({
            title: "选择客户"
          });
          //获取客户列表
          let userId = this.isBoss ? this.checkUserId[0] : this.removeSaffInfo.userId;
          userId && (this.removeSaffInfo = this.member_lists.find(res=>res.userId==userId));
          this.member_lists = [] ;
          this.searchkey = '' ;
          this.focusTag = false ;
          this.inputWidth =  0;
          this.page = 1 ;
          this.inits('client', this.removeSaffInfo.cardId);

        }else if(_status == 3){
          if(!this.checkUserId.length) {
            wx.showToast({
              title: '请选择客户！',
              icon: 'none'
            });
            return;
          }
          wx.setNavigationBarTitle({
            title: "选择接手成员"
          });
          this.member_lists = [] ;
          this.searchkey = '' ;
          this.focusTag = false ;
          this.inputWidth =  0;
          this.page = 1 ;
          this.inits();

        }else{
          wx.setNavigationBarTitle({
            title: "企业成员"
          });
          this.searchkey = '' ;
          this.focusTag = false ;
          this.inputWidth =  0;
        }
        this.status = _status ;
      },
      out(str){
        if(str == 'dissolve'){//解散
          this.removeSaffInfo = {};
          this.outHitShow = true ;
          this.hitTitle = '您确定解散该企业吗？解散后，企业内的所有数据都将会清空，且此操作不可逆。' ;
          this.hitRight = '确定' ;
        }else{//退出企业

          //查看是否还有客户
          this.page = 1 ;
          this.inits('checkClient') ;

        }
      },
      choose_peo(id , method , index){//选择成员

        let v = this ;
        if(this.status == 2){//移交成员时可以多选
          v.checkUserId = [] ;
          if(method == 'all'){//全选
            v.choose_all = !v.choose_all ;
            v.member_lists.forEach(function (i, k) {
              v.$set(v.member_lists[k] , 'isCheck' , v.choose_all );
              if(v.choose_all){
                v.checkUserId.push(i.userId) ;
              }
            });
            if(v.choose_all){
              v.choose_num = v.member_lists.length ;

            }else{
              v.choose_num = 0 ;
            }

          }else{//单选
            if(!v.member_lists[index].isCheck){
              v.$set(v.member_lists[index] , 'isCheck' , true );
            }else{
              v.$set(v.member_lists[index] , 'isCheck' , false );
            }
            let _num = 0 ;

            v.member_lists.forEach(function (i, k) {
              if(i.isCheck){
                _num ++ ;
                v.checkUserId.push(i.userId)
              }
            });
            this.choose_num = _num ;
            if(_num == this.member_lists.length){
              this.choose_all = true ;
            }else{
              this.choose_all = false ;
            }
            _num = null ;
          }
        }else{//只能单选

          v.member_lists.forEach(function (i, k) {
            v.$set(v.member_lists[k] , 'isCheck' , false );
          });
          v.$set(v.member_lists[index] , 'isCheck' , true);


          if(v.status == 3){//选择客户归属人id
            this.targetUserId = [id] ;
          }else{
            if (this.checkUserIndex === index) {
              this.checkUserId = [];
              this.checkUserIndex = '';
              v.$set(v.member_lists[index] , 'isCheck' , false);
            }else{
              this.checkUserId = [id] ;
              this.checkUserIndex = index ;
            }

          }
        }
      },
      row_tap(userId , cardId){//查看成员分析
        if(this.status == 4 || this.status == 0){
          wx.setStorageSync('memberCardId' , cardId );
          wx.setStorageSync('memberUserId' , userId);
          wx.navigateTo({url:'../memberAnalyze/main?userId='+userId + '&cardId='+cardId}) ;
        }
      },
      page_turn(url){
        wx.navigateTo({url:'../'+url+'/main'})
      },
      dialog_btn_tap(method,money,num){//设置目标点击
        if(method == 'cancel'){

          this.dialog_show = false;

        }else if(method == 'save'){
          if(!money){
            wx.showToast({
              title: '请输入月目标',
              duration: 2000,
              icon: 'none'
            });
            return
          }

          if(!num){
            wx.showToast({
              title: '请设置独占客户数',
              duration: 2000,
              icon: 'none'
            });
            return
          }

          this.dialog_show = false ;
          wx.showLoading();
          let v = this ;
          let userId = this.checkUserId[0];
          let cardId = this.member_lists.find(res=>res.userId==userId).cardId;
          WXAJAX.POST({
            userId : userId ,
            targetAmount : money * 100 ,
            customerNum : num ,
            cardId: cardId,
          }, '', '/userTask/addMoneyNum').then((data) => {
            wx.hideLoading();

            v.$set(v.member_lists[v.checkUserIndex] , 'customerNum' , num );
            v.$set(v.member_lists[v.checkUserIndex] , 'targetAmount' , money )

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
      hitTap(method){//退出企业
        this.outHitShow = false ;
        if(method == 'cancel') return ;
        if(this.status ==  4 && !this.removeSaffInfo.userId){//解散企业
          wx.showLoading();
          let v = this ;
          WXAJAX.POST('', '', '/userTask/dissolutionCompany').then((data) => {
            wx.hideLoading();
            wx.showToast({
              title: '成功',
            });
            wx.clearStorageSync();
            setTimeout(function () {
              wx.reLaunch({url: '/pages/wxLogin/main'});
            },500);
          }).catch((err) => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: err.message,
              duration: 2000,
              icon: 'none'
            });
          });
        } else {//退出企业
          if(this.canOut){
            wx.showLoading();
            let v = this ;
            this.quitCompany({
              cardId: this.removeSaffInfo.cardId,
              userId: this.removeSaffInfo.userId,
            });

          }else{
            this.isLeave = true;
            this.manage_status(2);
          }
        }
      },
      confirmMove(customerState){//确认移交客户
        wx.showLoading();
        let v = this ;
        let current = {};

        if(!v.checkUserId.length && customerState == 2) {
          wx.showToast({
            title: '请选择客户！',
            icon: 'none'
          });
          return;
        }

        if(!v.targetUserId.length && customerState == 1) {
          wx.showToast({
            title: '请选择员工！',
            icon: 'none'
          });
          return;
        }

        if (customerState == 1) {
          current = this.member_lists.find(val => val.userId == v.targetUserId[0]);
        }

        WXAJAX.POST({
          customerIds  : v.checkUserId.join(',') ,
          ascriptionId : current.cardId || '',
          customerState  : customerState , //1 -- 移至独占 ， 2 -- 移至共享
        }, '', '/userTask/moveCustomer').then((data) => {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
          });
          if (this.isLeave) {
            this.canOut = true;
            this.outHitShow = true ;
            this.hitTitle = this.isBoss ? '移交客户完成，是否继续移出？':'您的独占客户已移交完成，是否确认退出该企业？' ;
            this.hitRight = '确定' ;
            this.isLeave = false;
          }
          //clear
          setTimeout( () => {
            this.isBoss = wx.getStorageSync('isBoss') || false ;
            this.$set(this, 'status', this.isBoss ? 4 : 0 );
            this.member_lists = [] ;
            this.checkUserId = [] ;
            this.checkUserIndex = 0;
            this.targetUserId = [] ;
            this.searchkey = '' ;
            this.page = 1 ;
            this.inits();
          },400)

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
      inputFocus(){
        this.inputWidth = '220upx' ;
        this.focusTag = true ;
      }
    },
    computed: {
      ...mapGetters(['currentCompany']),
      isManageSelfBoss(){
        let userId = wx.getStorageSync('userId');
        let checkUserId = this.checkUserId[0];

        return  userId == checkUserId && this.status ==4 && this.isBoss;
      },
    },
    onShareAppMessage(){
      const { cardId, companyId } = this.currentCompany;

      return {
        // title : '转发',
        path :`/pages/companyInvite/main?cardId=${cardId}&companyId=${companyId}&goType=1`,
        success(e){
          console.log(e);
          wx.showShareMenu({
            withShareTicket : true
          })
        },
        fail(e){
          console.log('失败-- ',e);
        }
      }
    },
  }
</script>

<style>
  .myself .name{
    color: #74D9D8;
  }
  /*  .inputOuter:focus input{
        width: 200upx;
    }*/
  .inputOuter input{
    width: 0;
    position: relative;
  }
  .inputOuter input::before{
    position: absolute;
    content: '';
    background: url("https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/search.png") no-repeat center;
    background-size: 100% 100%;
    width: 32upx;
    height: 32upx;
    left: 0 ;
    top: 0;
    bottom: 0;
    margin: auto;
    line-height: 88upx;
  }
  /* .inputOuter input:focus{
       width: 200upx;
       padding-left: 50upx;
   }*/
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.img-size {
  width: 465upx;
  height: 827upx;
  margin-top: 30upx;
  margin-bottom: 60upx;
}
.d-inline-block {
  display: inline-block
}
</style>
