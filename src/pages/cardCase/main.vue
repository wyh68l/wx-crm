<template>
    <div class="w100p minh117p bgf5f6">

        <!--搜索-->
        <div class="bgfff pl15 pb10 pr15">
            <div class="bgf5f6 bradius17 textc lh34 disflex align-cen pl25 search trans2"
                 :class="isfocus ? 'focus' : '' ">
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/search.png" alt="" class="w16 h16">
                <input type="text" v-model="searchkey" placeholder="搜索姓名/电话号码"
                       class="ca8 fs14 lh34 h34 textl pl10 w160 trans2"
                       @focus="search_focus"
                       @confirm="search_confirm">
            </div>
        </div>

        <div class="bgf5f6 pt15 pl16 pr15">
            <!--我的 / 默认 名片-->
            <div class="bradius10 bgfff " v-if="card_msg">
                <Card1 :card_msg="card_msg"
                       :type="'plus'"
                       :hasCard="hasCard"
                       :isdel="false"
                       :index="1"
                       @page_turn="toIndex"
                       @moreTap="moreTap"></Card1>
            </div>

            <!--看过的，名片-->

            <div v-if="lists.length>0">
                <div class="bradius10" v-for="(v,k) in lists" :key="k">
                    <p class="fs12 ca8 pb15">{{v.createTime}} 收入</p>
                    <div class="bgfff bradius10">
                        <Card1 :card_msg="v"
                               :type="'plus'"
                               :hasCard="false"
                               :isdel="true"
                               :index="k+2"
                               @moreTap="moreTap"
                               @page_turn="toIndex"
                               @shareApp="shareApp"
                        ></Card1>
                    </div>
                </div>
            </div>

            <!--bottom-->
            <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>



            <!--创建-->

            <!--添加-->
            <div class="add_card">

                <div class="disflex overhidden jsbet bgblue trans2 bradius30 cfff fs18 lh60 pl21 pr22 mb10" @click="page_turn('editCard')"
                    :class="addInfo ? 'h60' : 'h0' ">
                    <div class="disflex align-cen">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/add.png" alt="" class="w30 h30 mr11">
                        <span>我的智能名片</span>
                    </div>
                    <span class="fbold ">立即创建</span>
                </div>


                <div class="textc disflex w60 h60 bradius50p bgblue disinblock" @click="addInfo = !addInfo" v-if="!hasCard">
                    <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/add.png"
                         alt="" class="w30 h30 mt15 ">
                </div>

                <div class="textc disflex w60 h60 bradius50p bgblue disinblock" @click="page_turn('usercenter')" v-else>
                    <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png" alt="" class="w30 h30 mt15">
                </div>
            </div>



        </div>
      <div v-if="operateShow">
        <SelectorOne
          :title="'操作'"
          :status="operateShow"
          :allClass="operateTypes"
          @closeModal="operateShow = !operateShow"
          @choose_tap="choose_tap"></SelectorOne>
      </div>



        <!--初次登录-->
        <div v-if="!islogin">
            <Login @GetUserInfo="GetUserInfo" @getPhoneNumber="getPhoneNumber" :phoneMsg="phoneMsg"></Login>
        </div>


    </div>


</template>

<script>
    import Login from '@/components/login' //
    import Card1 from '@/components/card_1' //
    import SelectorOne from '@/components/selectorOne' //

    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'

    export default {
        name: '',
        components: {Login,Card1,SelectorOne},
        data() {
            return {
                searchkey: '',
                isfocus: false,
                mine_card:{},
                lists:[],
                hasCard:false ,//是否已经有名片
                islogin:true ,//是否已经登录
                wxCode:'',
                addInfo:false ,//显示添加的按钮
                loginMsg:{
                    rawData : '' ,
                    signature : '' ,
                    encryptedData : '' ,
                    iv : '' ,
                },
                card_msg: {
                    picchecked: '',
                    username: '',
                    tel: '',
                    wx: '',
                    company_wx: '',
                    email: '',
                    post: '',
                    company: '',
                    company_logo: ''
                },
                phoneMsg:{
                    phoneData:'',
                    iv:'',
                },
                //名片操作
                operateID:0,
                operateShow:false,
                operateTypes:[
                    {name:'置顶' , id:'top'},
                    {name:'删除' , id:'del'},
                ],
                cardId:0,//删除时使用
                isfresh:false ,
                page:1,
                isLoading : false ,//是否在加载
                nodata:false ,//是否已经没有数据
            }
        },
        onReachBottom() {
            let v = this ;
            v.getAllCard();

        },
        onShareAppMessage(e){
            var companyId = e.target.dataset.companyId ,
                cardId = e.target.dataset.cardId ;
            return {
                // title : '转发',
                path :'/pages/index/main?cardId='+cardId+'&companyId='+companyId ,
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
        async onPullDownRefresh() {
            // to doing..
            // 停止下拉刷新
            wx.showNavigationBarLoading();
            this.page = 1 ;
            this.card_msg = {} ;
            this.lists = [] ;
            this.nodata = false ;
            this.isLoading = false ;
            this.getAllCard();
            wx.stopPullDownRefresh();
            setTimeout(function () {
                wx.hideNavigationBarLoading();
            },300)
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: '名片夹'
            });
            if(!this.hasCard){
                this.lists = [] ;
            }

            this.isfresh = true ;


            /*获取登录信息*/

            //登录
            var v = this;

            wx.showLoading() ;
            if(wx.getStorageSync('token')){
                this.getAllCard();
            }else{
                v.islogin = false ;
            }
            this.loginMsg = wx.getStorageSync('loginMsg');

        },
        methods: {
            shareApp(companyId,cardId){
                this.onShareAppMessage(companyId,cardId)
            },
            search_focus() {
                this.isfocus = true;
            },
            search_confirm() {
                if (!this.searchkey) {
                    wx.showToast({
                        title: '请输入姓名或电话！',
                        icon: 'none'
                    });
                    return;
                }
                wx.showLoading() ;
                this.page = 1 ;
                this.card_msg = {} ;
                this.lists = [] ;
                this.nodata = false ;
                this.isLoading = false ;
                this.getAllCard();
            },
            page_turn(url){
                // wx.clearStorageSync('choose_company');
                // wx.clearStorageSync('choose_company_id');
                this.addInfo = false ;
                wx.navigateTo({url:'../'+url+'/main'})
            } ,
            toIndex(url,companyid,cardid){//进入首页
                wx.setStorageSync('COMPANYID',companyid);/*id*/
                wx.setStorageSync('CARDID',cardid);/*id*/
                this.addInfo = false ;
                wx.switchTab({url:'../'+url+'/main?cardId='+cardid+'&companyId+'+companyid});
            },
            getLoginStatus(){
                let v = this ;
                wx.login({
                    success: (data) => {
                        wx.hideLoading();
                        if (data.code) {
                            //保存code
                            v.wxCode = data.code;
                            v.login() ;
                        } else {
                            wx.showToast({
                                title: '获取登录态失败！',
                                duration: 2000,
                                icon: 'none'
                            });
                            // console.log('获取用户登录态失败！' + data.errMsg)
                        }
                    },
                    fail(res) {
                        wx.hideLoading() ;
                    }

                });
            },
            getPhoneNumber(e) {
                this.phoneMsg.phoneData = e.encryptedData ;
                this.phoneMsg.iv = e.iv ;
            },
            GetUserInfo(msg){//获取用户信息
                this.islogin = true ;
                this.loginMsg = {
                    rawData : msg.rawData ,
                    signature : msg.signature ,
                    encryptedData : msg.encryptedData ,
                    iv : msg.iv ,
                };
                this.getLoginStatus();
                // this.login(msg) ;
            },
            login(msg){
                wx.showLoading() ;
                WXAJAX.POST({
                    code: this.wxCode,
                    rawData:this.loginMsg.rawData,
                    signature : this.loginMsg.signature,
                    encrypteData : this.loginMsg.encryptedData,
                    iv:this.loginMsg.iv,
                    phoneData:this.phoneMsg.phoneData ,
                    phoneIv : this.phoneMsg.iv ,
                },'','/home/wxLogin').then((data) => {
                    if(data.token){
                        wx.setStorageSync('token', data.token);
                        wx.setStorageSync('avatarUrl' , data.avatarUrl) ;
                        wx.setStorageSync('USERNAME',data.userName) ;
                        //获取所有的名片
                        this.getAllCard();
                    }

                    wx.setStorageSync('loginMsg',this.loginMsg)
                }).catch((err) => {
                    wx.hideLoading();
                });
            },
            getAllCard(){

                let v = this ;
                if(v.isLoading){
                    return
                }
                v.isLoading = true ;
                WXAJAX.POST({
                    name : this.searchkey ,
                    pageNum: v.page ,
                },'','/businessCard/seeDetail','1').then((data) => {

                    // state : 1 -- 默认 ， 2 -- 浏览记录 ， 3 -- 自己的
                    if(data){
                        let datas = [] ;
                        data.forEach(function (i,k) {
                            if(i.state == 1 || i.state == 3){//默认名片

                                if(i.state == 1){
                                    v.hasCard = false ;
                                }else{
                                    v.hasCard = true ;
                                }
                                v.card_msg = {
                                    picchecked: i.logo || '',
                                    username: i.name || '',
                                    tel: i.phone || '',
                                    wx: i.personalWx || '',
                                    company_wx: i.companyWx || '',
                                    email: i.email || '',
                                    post: i.position || '',
                                    company: i.companyName,
                                    company_logo: i.companyLogo ,
                                    cardId : i.cardId,
                                    companyId:i.companyId ,
                                    recordId:i.recordId
                                };

                            }else{
                                v.lists.push({
                                    picchecked: i.logo || '',
                                    username: i.name || '',
                                    tel: i.phone || '',
                                    wx: i.personalWx || '',
                                    company_wx: i.companyWx || '',
                                    email: i.email || '',
                                    post: i.position || '',
                                    company: i.companyName,
                                    company_logo: i.companyLogo,
                                    createTime:util.getdate(i.createTime , 'dateTime'),
                                    cardId : i.cardId,
                                    companyId:i.companyId ,
                                    recordId : i.recordId
                                });
                            }
                        });

                        v.page ++ ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);

                    wx.hideLoading();
                }).catch((err) => {
                    wx.hideLoading();
                    if(err.code == 204){
                        v.nodata = true ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);
                });


            },
            moreTap(recordId,cardId , isdel ){//更多操作
                this.operateID = recordId ;
                this.cardId = cardId ;
                if(isdel){
                    this.operateTypes = [
                        {name:'置顶' , id:'top'},
                        {name:'删除' , id:'del'},
                    ];
                }else{
                    this.operateTypes = [
                        {name:'置顶' , id:'top'},
                    ];
                }
                this.operateShow = true ;
            },
            choose_tap(type){//名片操作
                this.operateShow = false ;

                wx.showLoading();

                let _url = '' ,
                    id = 0 ;
                if(type == 'top'){
                    _url = '/businessCard/isTop' ;
                    id = this.operateID ;
                }else{
                    _url = '/businessCard/delSeeCard' ;
                    id = this.cardId ;
                }

                WXAJAX.POST({
                    recordId : id
                },'',_url ,).then((data) => {

                    wx.hideLoading();
                    wx.showToast({
                        title: '操作成功！',
                        duration: 2000,
                        icon: 'none'
                    });
                    this.getAllCard() ;

                }).catch((err) => {
                    wx.hideLoading();
                });

            }
        }
    }
</script>

<style>
    .search {
        justify-content: center
    }

    .search.focus {
        justify-content: flex-start;
    }

    .search.focus input {
        width: auto;
    }
    page{
        width: 100%;
        height: 100%;
    }
    .add_card{
        width: 100%;
        position: fixed;
        right: 0;
        bottom: 102upx;
        z-index: 99;
        padding-right: 30upx;
        padding-left: 30upx;
        box-sizing: border-box;
        text-align: right;
    }
</style>




























