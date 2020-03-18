<template>
    <div class="posre pt196 borderbox ">
        <div class="posab top0 w100p zindex-1 h241 bgfff"  @click="tap_all">
            <img :src="company_msg.company_logo" alt=" " class="w100p h211" mode="aspectFill">
        </div>
        <div class="mt-15">
            <!--title begin-->

            <div class="fs18 cfff disflex pl15 pr16 row-reverse">
                <img :src="company_msg.admin_logo" mode="aspectFill" alt="" class="w60 h60 bradius5 ml10">
                <div class="row-reverse">
                    <b class="fbold">{{company_msg.company_name}}</b>
                </div>
            </div>

            <!--title end-->


            <!--lists begin-->
            <div v-for="(dynamic_item , k1) in dynamic_lists" :key="k1">
                <DynamicItem :dynamic_item="dynamic_item"
                             @operate_tap="operate_tap"
                             @addComment="addComment"
                             @zan="zan"
                             :index1="k1"></DynamicItem>
            </div>


            <!--lists end-->
        </div>
        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>

        <!--评论输入框-->
        <div class="fix_bottom bgfff edit_input trans2" :class="input_show ? '' : 'hide' "><!--:class="input_show ? '' : 'hide' "-->
            <div class="bgfff pt3 pb5 pl10 disflex jsbet pr11 borderbox align-cen">
                <input
                        fixed=true
                        class=" borderbox lh30 pr11 bgf5f6 bradius5 flex1 mr11 comment_input ca8 fs12 pl15"
                        :focus="comment_focus"
                        placeholder="评论"
                        cursor-spacing="4"
                        @focus="inputgetFocus(this,$event)"
                        @confirm="inputConfirm"
                        :style="{height:text_height+'px'}"
                        v-model="comments"/>
                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/smile.png" alt="" class="w25 h25" @click="smile_tap">
               <!-- <textarea
                        :auto-height="true"
                        fixed=true
                        class=" borderbox pt8 pr11 bgf5f6 bradius5 flex1 mr11 comment_input ca8 fs12 pl15"
                        :focus="comment_focus"
                        placeholder="评论"
                        cursor-spacing="4"
                        @focus="inputgetFocus(this,$event)"
                        @confirm="inputConfirm"
                        style="max-height: 200upx;min-height: 60upx;line-height: 56upx;"
                        v-model="comments">
                </textarea>-->
            </div>

            <!--表情-->
<!--            <div class="trans2"  tabindex="0" :class="emoji_show ? 'h195' : 'h0'">-->
<!--                &lt;!&ndash; :class="emoji_show ? 'h195' : 'h0'" &ndash;&gt;-->
<!--                &lt;!&ndash;:style="{height:emoji_show ? keyboard_height: 0}"&ndash;&gt;-->
<!--                <swiper class="swiper-inner h100p" :indicator-dots="true"-->
<!--                        :circular="true" >-->
<!--                    <div >-->
<!--                        <swiper-item class="bgf5f6 disflex align-cen">-->
<!--                            <div class="disflex wrap jsbet bgf4 pl21 pr21 emoji pt15" >-->
<!--                                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                                     alt="" v-for="(e,k) in emojis"-->
<!--                                     :key="k"-->
<!--                                     class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                                     v-if="k < 24">-->
<!--                            </div>-->
<!--                        </swiper-item>-->
<!--                    </div>-->
<!--                    <div >-->
<!--                        <swiper-item class="bgf5f6  disflex align-cen">-->
<!--                            <div class="disflex wrap jsbet bgf4 pl10 pr10 emoji pt15" >-->
<!--                                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                                     alt="" v-for="(e,k) in emojis"-->
<!--                                     :key="k" class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                                     v-if="k < 48 && k >= 23">-->
<!--                            </div>-->
<!--                        </swiper-item>-->
<!--                    </div>-->
<!--                    <div >-->
<!--                        <swiper-item class="bgf5f6  disflex align-cen">-->
<!--                            <div class="disflex wrap jsbet bgf4 pl10 pr10 emoji pt15" >-->
<!--                                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                                     alt="" v-for="(e,k) in emojis"-->
<!--                                     :key="k"-->
<!--                                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                                     class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                                     v-if="k < 72 && k >= 48">-->
<!--                            </div>-->
<!--                        </swiper-item>-->
<!--                    </div>-->
<!--                </swiper>-->


<!--            </div>-->
        </div>

      <div class="textc disflex w60 h60 bradius50p bgblue disinblock goToUserCenter" @click="page_turn('mine')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_add.png" alt="" class="w30 h30 mt15">
      </div>
    </div>
</template>

<script>
    import DynamicItem from '@/components/dynamicItem' // 订单项
    //import Img from './../../../static/images/about.jpg'

    import WXAJAX from '../../utils/request'
    import util from '../../utils/index'


    let httpImg = 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551961574244&di=8729881910dc1f229760af2da633dad5&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201401%2F22%2F20140122194030_JBjii.jpeg';


    export default {
        name: '',
        components: {DynamicItem},
        data() {
            return {
                prevImg:[httpImg,httpImg,httpImg],
                dynamic_operate_show: false,
                dynamic_lists: [/*
                    {
                        id: '0',
                        operate_show: false,
                        likes: ['无风起浪', '谁谁是恶', '谁谁'],
                        comment: [
                            {
                                name: '无风起浪',
                                text: '请问壹立科技小程序源码多少钱？'
                            },
                            {
                                name: '无风起浪',
                                text: '请问源码多少钱？'
                            }
                        ]
                    },
                    {
                        id: '0',
                        operate_show: false,
                        likes: ['无风起浪', '谁谁是恶', '谁谁', '谁谁', '谁谁', '谁谁', '谁谁'],
                        comment: [
                            {
                                name: '无风起浪',
                                text: '请问壹立科技小程序源码多少钱？'
                            },
                            {
                                name: '无风起浪',
                                text: '请问源码多少钱？'
                            }
                        ]
                    },
                    {
                        id: '0',
                        operate_show: false,
                        likes: ['无风起浪', '谁谁是恶', '谁谁'],
                        comment: [
                            {
                                name: '无风起浪',
                                text: '请问壹立科技小程序源码多少钱？'
                            },
                            {
                                name: '无风起浪',
                                text: '请问源码多少钱？'
                            }
                        ]
                    }
                */],
                emojiArray: [['😠', '😩', '😲', '😞', '😵', '😰', '😒', '😍',
                              '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳',
                              '😃', '😅', '😆', '😁', '😂', '😊', '☺', '😄',
                              '😢', '😭', '😨', '😣', '😡', '😡', '😖', '😔', ],
                             ['😱', '😪', '😏', '😓', '😥', '😫', '😉']],
                emoji_show:false,
                comment_focus:false ,
                comments:'',
                input_show:false ,
                add_comments_index:0,//当前点击的哪条动态
                text_height:30,
                emojiChar: "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
                emoji: [
                    "60a", "60b", "60c", "60d", "60f",
                    "61b", "61d", "61e", "61f",
                    "62a", "62c", "62e",
                    "602", "603", "605", "606", "608",
                    "612", "613", "614", "615", "616", "618", "619", "620", "621", "623", "624", "625", "627", "629", "633", "635", "637",
                    "63a", "63b", "63c", "63d", "63e", "63f",
                    "64a", "64b", "64f", "681",
                    "68a", "68b", "68c",
                    "344", "345", "346", "347", "348", "349", "351", "352", "353",
                    "414", "415", "416",
                    "466", "467", "468", "469", "470", "471", "472", "473",
                    "483", "484", "485", "486", "487", "490", "491", "493", "498", "6b4"
                ],
                emojis: [], //qq、微信原始表情
                keyboard_height:0,
                COMPANYID : 0 ,
                company_msg:{
                    admin_logo:'',
                    company_logo:'',
                    company_name:''
                },
                page:1,
                isLoading : false ,//是否在加载
                nodata:false ,//是否已经没有数据
            }
        },
        onHide(){
            this.clearPage();
        },
        onShow() {


           /* v.page = 1 ;
            if(v.COMPANYID!=0){
                v.inits();
            }*/
        },
        onPageScroll:function(e){
            this.comment_focus = false ;
            this.input_show = false ;
        },
        watch:{
          /*  comment_focus(newVal,oldVal){
                console.log(newVal);

            }*/
        },
        mounted(){
            let v = this ;
            //获取当前的企业
            v.COMPANYID = wx.getStorageSync('COMPANYID') || 0 ;
            v.getcompany();
            v.inits();

        },
        methods: {
            getcompany(){//获取企业信息

                let v = this ;

                var em = {},
                    emChar = v.emojiChar.split("-");
                var emojis = [];

                v.dynamic_lists = [] ;

                v.emoji.forEach(function(v, i) {
                    em = {
                        char: emChar[i],
                        emoji: "0x1f" + v
                    };
                    emojis.push(em)
                });
                v.emojis = emojis ;


                WXAJAX.POST({
                    companyId  : v.COMPANYID,

                }, '', '/goods/getCompanyInfo').then((data) => {
                    v.company_msg = {
                        admin_logo:data.userLogo,
                        company_logo:data.companyLogo,
                        company_name:data.companyName
                    }

                }).catch((err) => {

                })
            },
            inits(){//动态

                let v = this ;
                if(v.isLoading){
                    wx.hideLoading();
                    return
                }
                v.isLoading = true ;
                wx.showLoading();
                WXAJAX.POST({
                    companyId  : v.COMPANYID,
                    pageNum: v.page ,

                }, '', '/personal/getDynamicInfo').then((data) => {

                    if(data){
                        let nowTime = + new Date(),
                            addTime = '' ,
                            diff = 0 ;

                        data.forEach(function (i,k) {
                            i.photos = i.photos.split(',');
                            i.createTime = util.getdate(i.createTime,'dateTime');
                            if(i.doThumbsName){
                                i.doThumbsName = i.doThumbsName.split(',');
                            }else{
                                i.doThumbsName = [];
                            }
                            /*addTime = +new Date(i.createTime);
                            diff = nowTime - addTime ;
                            if( diff < 60*60*1000){
                                console.log('超出一小时');
                                i.createTime = diff / 1000 / 60 ;
                                i.createTime = i.createTime +'分钟前' ;
                            }*/


                        });
                        v.dynamic_lists = [...v.dynamic_lists , ...data] ;
                        v.page ++ ;
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }else{
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }
                    wx.hideLoading();

                }).catch((err) => {
                    console.log(err) ;
                    wx.hideLoading();
                    if(err.code == 204){
                        v.nodata = true ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);

                })
            },
            operate_tap(index) {//显示点赞或者评论
                let status = !this.dynamic_lists[index].operate_show;
                this.$set(this.dynamic_lists[index], 'operate_show', status);
            },
            addComment(index1) {//添加评论
                this.input_show = true ;
                // this.comment_focus = true ;
                this.add_comments_index = index1 ;
                let v = this ;
                setTimeout(function () {
                    v.$set(v.dynamic_lists[index1] , 'operate_show' , false );
                    v.comment_focus = true ;
                },200)
            },
            smile_tap(){//显示关闭emoji
            /*    this.emoji_show = !this.emoji_show ;
                let v = this ;
                v.comment_focus = !v.comment_focus ;*/

             /*   if(!this.emoji_show){
                    this.emoji_show = true ;
                    this.comment_focus = false ;
                }else{
                    this.emoji_show = false ;
                    setTimeout(()=>{
                        this.comment_focus = true ;
                    },200)
                }*/

                if (!this.emoji_show) {
                    this.emoji_show = true;
                    this.comment_focus = false;
                    // this.height_class = 'h195'
                } else {
                    this.comment_focus = false;
                }

            },
            inputgetFocus(that,e){//input框focus时
                let v = this ;
/*
                if(v.keyboard_height == 0) {
                    wx.getSystemInfo({
                        success(res) {
                            let tabbar = res.screenHeight - res.windowHeight ;
                            v.keyboard_height = e.target.height - tabbar + 'px';
                        }
                    });
                }*/
             /*   v.comment_focus = false ;
                setTimeout(function () {
                    v.comment_focus = true ;
                },100)*/
                    /*   this.emoji_show = false ;
                   let v= this ;
                   console.log('commentFocus')
                   v.comment_focus = false ;
                   setTimeout(function () {
                       // v.comment_focus = true ;
                   },100)*/
            },
            emoji_tap(char){//点击表情时
                this.comments = this.comments + char;
            },
            emoji_del(){
                console.log('del');
                this.comments.substr(0,this.comments.length-1);
                console.log(this.comments)
            },
            tap_all(){
                this.input_show = false ;
                this.comment_focus = false ;
                this.$set(this.dynamic_lists[this.add_comments_index] , 'operate_show' , false )
            },
            clearPage(){//页面还原
                console.log('clearpage');
                this.input_show = false ;
                this.comment_focus = false ;
                this.comments = '' ;
                this.$set(this.dynamic_lists[this.add_comments_index] , 'operate_show' , false )
            },
            inputConfirm(){//输入完成
                this.emoji_show = false ;
                this.comment_focus = false ;
            },
            zan(index1,isThumbs ,dynamicId){//点赞
                let v = this ;

                wx.showLoading() ;

                WXAJAX.POST({
                    dynamicId  : dynamicId,

                }, '', '/personal/doDynamicThumbs').then((data) => {
                    wx.hideLoading() ;
                    console.log(data);
                    if(data){//点赞

                        v.dynamic_lists[index1].doThumbsName.push(data);//添加人名
                        v.$set(v.dynamic_lists[index1],'isThumbs' , 1 );
                        v.$set(v.dynamic_lists[index1],'doThumbsNum' , ++v.dynamic_lists[index1].doThumbsNum );

                    }else {
                        v.dynamic_lists[index1].doThumbsName.pop();
                        v.$set(v.dynamic_lists[index1],'isThumbs' , 0 );
                        v.$set(v.dynamic_lists[index1],'doThumbsNum' , --v.dynamic_lists[index1].doThumbsNum );
                    }

                    let status = !v.dynamic_lists[index1].operate_show;
                    v.$set(v.dynamic_lists[index1], 'operate_show', status);


                }).catch((err) => {
                    console.log(err);
                    wx.hideLoading() ;
                })
            }
        },
        onReachBottom() {
            let v = this ;
            v.inits();

        },
        async onPullDownRefresh() {
            // to doing..
            // 停止下拉刷新
            wx.showNavigationBarLoading();
            this.page = 1 ;
            this.dynamic_lists = [] ;
            this.nodata = false ;
            this.isLoading = false ;
            this.inits();
            wx.stopPullDownRefresh();
            setTimeout(function () {
                wx.hideNavigationBarLoading();
            },300)
        },
    }
</script>

<style>
    .edit_input.hide{
        height: 0;
    }
    .goToUserCenter{
      position: fixed;
      right: 20upx;
      bottom: 102upx;
      z-index: 99;
      box-sizing: border-box;
      text-align: center;
    }
</style>

























