<template>
  <div class="h100p bgfff">

    <!--lists begin-->
    <div>
      <div class="disflex jsbet pt20 pl15 pr16 pb15">
        <img :src="dynamic.companyLogo" alt="" class="w50 h50 bradius5 mr8" mode="aspectFill">
        <div class="flex1">
          <p class="disflex cdeepblue fs16 jsbet lh27">
            <span class="fbold w250 over_1">{{dynamic.companyName}}</span>
            <!--<span class="fs12">转发</span>-->
          </p>
          <p class="fs16 c38">{{dynamic.title}}</p>
          <div class="disflex pt15 picture-list">
            <div class="w93 h93"
                 v-for="(v,k) in dynamic.photos"
                 :key="k"
            >
              <img :src="v"
                   mode="aspectFill"
                   :lazy-load="true"
                   @click.stop="previewImage(v)">
            </div>
<!--            <img :src="v" alt="" class="w93 h93" v-for="(v,k) in dynamic.photos">-->
          </div>
          <div class="disflex jsbet pt15 pb15 posre">
            <span class="c80 fs12">{{dynamic.createTime}} <span class="cdeepblue fs12" @click="del">删除</span></span>
          </div>

          <div class="bgf5f6 pl10 pr10 fbold pt9 pb9 cdeepblue fs16"
               v-if="dynamic.doThumbsNum > 0 || (dynamic.commentModelList && dynamic.commentModelList.length)"
          >
            <div class="dynamic_likes "  v-if="dynamic.doThumbsNum > 0">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/zan.png" alt="" class="w20 h20 mr8 posre top4">
              <span v-for="(like_item,k2) in dynamic.doThumbsName" :key="k2"
                    class="like_name  posre">{{like_item}}</span>
            </div>
            <p v-for="(comment_item,k3) in dynamic.commentModelList"
               :key="k3"
               class="cdeepblue pt9"
               @click="addComment(comment_item)"
            >
          <span class="fbold">
            {{comment_item.userName}}
            <template v-if="comment_item.replyName">
              <span class="c38">回复</span>
              {{comment_item.replyName}}
            </template>
          </span>
              <span class="c38">：{{comment_item.text}}</span>
            </p>
            <p class="textc pt10"
               @click="getMore"
               v-if="dynamic.commentModelList && (dynamic.commentNum>dynamic.commentModelList.length)">
              查看更多
            </p>
          </div>

        </div>
      </div>
    </div>
    <div class="fix_bottom bgfff edit_input trans2" :class="input_show ? '' : 'hide' ">
      <div class="bgfff pt3 pb5 pl10 disflex jsbet pr11 borderbox align-cen">
        <input
          fixed=true
          class=" borderbox lh30 pr11 bgf5f6 bradius5 flex1 mr11 comment_input ca8 fs12 pl15"
          :focus="comment_focus"
          :placeholder="replayComment.commentId ? '回复 '+replayComment.userName +'：': '评论' "
          cursor-spacing="4"
          @focus="inputgetFocus(this,$event)"
          @confirm="inputConfirm"
          :style="{height:text_height+'px'}"
          v-model="comments"/>
<!--        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/smile.png" alt="" class="w25 h25" @click="smile_tap">-->
        <span class="bgblue cfff w50 textc lh30 fs16 bradius5 disblock ml10" @click="inputConfirm">发送</span>
      </div>

      <!--表情-->
<!--      <div class="trans2"  tabindex="0" :class="emoji_show ? 'h195' : 'h0'">-->
<!--        &lt;!&ndash; :class="emoji_show ? 'h195' : 'h0'" &ndash;&gt;-->
<!--        &lt;!&ndash;:style="{height:emoji_show ? keyboard_height: 0}"&ndash;&gt;-->
<!--        <swiper class="swiper-inner h100p" :indicator-dots="true"-->
<!--                :circular="true" >-->
<!--          <div >-->
<!--            <swiper-item class="bgf5f6 disflex align-cen">-->
<!--              <div class="disflex wrap jsbet bgf4 pl21 pr21 emoji pt15" >-->
<!--                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                     alt="" v-for="(e,k) in emojis"-->
<!--                     :key="k"-->
<!--                     class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                     v-if="k < 24">-->
<!--              </div>-->
<!--            </swiper-item>-->
<!--          </div>-->
<!--          <div >-->
<!--            <swiper-item class="bgf5f6  disflex align-cen">-->
<!--              <div class="disflex wrap jsbet bgf4 pl10 pr10 emoji pt15" >-->
<!--                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                     alt="" v-for="(e,k) in emojis"-->
<!--                     :key="k" class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                     v-if="k < 48 && k >= 23">-->
<!--              </div>-->
<!--            </swiper-item>-->
<!--          </div>-->
<!--          <div >-->
<!--            <swiper-item class="bgf5f6  disflex align-cen">-->
<!--              <div class="disflex wrap jsbet bgf4 pl10 pr10 emoji pt15" >-->
<!--                <img :src="'http://soupu.oss-cn-shanghai.aliyuncs.com/emoji/'+e.emoji+'.png'"-->
<!--                     alt="" v-for="(e,k) in emojis"-->
<!--                     :key="k"-->
<!--                     @click.stop="emoji_tap(e.char,e.emoji)"-->
<!--                     class="w25 h25 mr13 mb15 mt5 ml13"-->
<!--                     v-if="k < 72 && k >= 48">-->
<!--              </div>-->
<!--            </swiper-item>-->
<!--          </div>-->
<!--        </swiper>-->


<!--      </div>-->
    </div>
    <!--lists end-->
    <div v-if="delShow">
      <SelectorOne
        :title="'操作'"
        :status="true"
        :allClass="prodClass"
        @choose_tap="choose_tap"
      ></SelectorOne>
    </div>

  </div>

</template>

<script>
  import WXAJAX from '@/utils/request'
  import util from '@/utils/index'
  import SelectorOne from '@/components/selectorOne' // 订单项

  export default {
    name: '',
    components: {SelectorOne},
    data() {
      return {
        dynamic_operate_show: false,
        dynamic: {
          id: '0',
          likes: ['无风起浪', '谁谁是恶', '谁谁'],
          comment: []
        },
        dynamicId : 0 ,
        delShow : false,
        delCommentId:0,
        delCommentIndex:0,
        prodClass:[
          {name:'删除' , id:'del'},
        ],
        input_show: false,
        replayComment: {},
        comment_focus: false,
        emoji_show: false,
        comments:'',
        emojiArray: [['😠', '😩', '😲', '😞', '😵', '😰', '😒', '😍',
          '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳',
          '😃', '😅', '😆', '😁', '😂', '😊', '☺', '😄',
          '😢', '😭', '😨', '😣', '😡', '😡', '😖', '😔', ],
          ['😱', '😪', '😏', '😓', '😥', '😫', '😉']],
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
        emojis: []
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "动态详情"
      });
      this.dynamicId = this.$root.$mp.query.id || 2 ;
      this.getInits() ;
      this.initEmoji();
    },
    methods: {
      addComment(replayComment){
        if((replayComment.userName&&!replayComment.commentId) || (replayComment.commentId && replayComment.userId == wx.getStorageSync('userId'))) {
          return;
        }

        this.input_show = true ;
        this.replayComment = replayComment;
        let v = this ;
        setTimeout(function () {
          v.$set(v, 'dynamic_operate_show' , false );
          v.comment_focus = true ;
        },200)
      },
      inputConfirm(){//输入完成
        this.emoji_show = false ;
        this.comment_focus = false ;

        WXAJAX.POST({
          dynamicId: this.dynamic.dynamicId,
          parentId: this.replayComment.commentId || 0,
          text: this.comments,
        }, '', '/company/doComment')
          .then(res=>{
            let comments = this.dynamic;
            comments.commentModelList = comments.commentModelList ? comments.commentModelList : [];
            if(comments.commentModelList.length<10 || comments.commentNum>comments.commentModelList.length){
              this.dynamic.commentModelList.push({
                text: this.comments,
                replyName: this.replayComment.userName || '',
                userName: wx.getStorageSync('USERNAME'),
              });
              this.$set(this, 'dynamic', JSON.parse(JSON.stringify(this.dynamic)));
              console.log(this.dynamic);
            }
            this.input_show = false;
            this.comments = '' ;
          });
      },
      inputgetFocus(){

      },
      emoji_tap(char){//点击表情时
        this.comments = this.comments + char;
      },
      smile_tap(){//显示关闭emoji
        if (!this.emoji_show) {
          this.emoji_show = true;
          this.comment_focus = false;
          // this.height_class = 'h195'
        } else {
          this.emoji_show=false;
          this.comment_focus = false;
        }
      },
      initEmoji(){
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
      },
      operate_tap() {//显示点赞或者评论
        this.dynamic_operate_show = !this.dynamic_operate_show;
      },
      getInits(){
        wx.showLoading() ;

        WXAJAX.POST({
          dynamicId  : this.dynamicId  ,
        }, '', '/company/getDynamicInfo').then((data) => {

          wx.hideLoading();
          if(data){
            data = data[0] ;
            data.photos = data.photos ? data.photos.split(',') : [];
            data.createTime = util.getdate(data.createTime , 'dateTime') ;
            if(data.commentModelList){
              data.commentModelList.forEach(function (i, k) {
                i.createTime = util.getdate(i.createTime , 'dateTime') ;
              })
            }
            if(data.doThumbsName){
              data.doThumbsName = data.doThumbsName.split(',');
            }
            this.dynamic = data ;
          }
          console.log(data);
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      del(){
        wx.showLoading() ;

        WXAJAX.POST({
          dynamicId  : this.dynamicId  ,
        }, '', '/company/delDynamicInfo').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon : 'success'
          });
          setTimeout(function () {
            wx.navigateBack() ;
          },600);
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      delComment(delComment , index ){//删除评论
        this.delCommentIndex = index ;
        this.delCommentId = delComment ;
        this.delShow = !this.delShow ;
      },
      choose_tap(str){
        if(str == -1){
          this.delShow = !this.delShow ;
          return
        }

        wx.showLoading() ;

        WXAJAX.POST({
          commentId  : this.delCommentId   ,
        }, '', '/company/delComment').then((data) => {

          wx.hideLoading();
          this.dynamic.commentModelList.splice(this.delCommentIndex ,1) ;
          this.delShow = !this.delShow ;
          wx.showToast({
            title:'成功'
          });
          setTimeout(()=> {
            this.getInits();
          },500)
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      }
    }
  }
</script>

<style>

  .picture-list{
    flex-wrap: wrap;
  }
  .picture-list div{
    overflow: hidden;
    margin-right: 6upx;
    margin-top: 6upx;
  }
  .picture-list img{
    width: 100%;
    height: 100%;
  }
  .picture-list div:nth-child(3n){
    margin-right: 0;
  }

  .picture-list div:nth-child(1),
  .picture-list div:nth-child(2),
  .picture-list div:nth-child(3)
  {
    margin-top: 0;
  }
  .edit_input.hide{
    height: 0;
  }

  .product_bg {
    height: 134px;
  }

  .dynamic_operate {
    width: 188px;
    top: 0;
    bottom: 0;
    right: 104upx;
    margin: auto;
    transition: .2s;
    overflow: hidden;
  }

  .dynamic_operate > div {
    border-radius: 10upx;
    line-height: 40px;
    box-sizing: border-box;
  }

  .dynamic_operate.w0 {
    width: 0;
    padding: 0;
    overflow: hidden;
  }

  .triangle_border_right {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-width: 20upx 0 20upx 20upx;
    border-style: solid;
    border-color: transparent transparent transparent #383838; /*透明 透明 透明 黄*/
    top: -10upx;
    bottom: 0;
    right: 4upx;
    margin: auto;
    transition: .2s;
  }

  .w0 .triangle_border_right {
    border: 0;
  }

  .dynamic_likes .like_name::after {
    content: '，';
  }

  .dynamic_likes .like_name:last-child::after {
    content: '';
  }
</style>





























