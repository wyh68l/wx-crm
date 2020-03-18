<template>
  <div>
      <!-- 隐藏消息 以及代码66行 -->
    <!-- <AddNoticeNum ref="noticeNum"></AddNoticeNum> -->
    <!--top-->
<!--    <div class="pl16 pt20 pb20 pr15 disflex mb10 bgfff">-->
<!--      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/yimai.png" alt=""-->
<!--           class="w50 h50 bradius5 mr10">-->
<!--      <div class="flex1">-->
<!--        <p class="disflex jsbet">-->
<!--          <span class="c38 fs18">超级CRMAI智能助手</span>-->
<!--          <span class="fs12 ca8">16:42</span>-->
<!--        </p>-->
<!--        <p class="fs14 ca8 pt7">JUSTIN正在浏览您的名片，赶紧去联系他吧</p>-->
<!--      </div>-->
<!--    </div>-->

    <!--msg lists-->
    <template v-if="msgList && msgList.imList && msgList.imList.length">
      <div v-for="(msgitem,k) in lists" :key="k" class="bbf5f6">
        <MsgBox :msg="msgitem"
                :isImMsg="true"
                :istime="msgitem.newestMessage && msgitem.newestMessage.time"
                @row_tap="row_tap(msgitem.userId||'',msgitem.cardId||'',msgitem.logo||'',msgitem.name||'',msgitem.wxCode||'', msgitem.phone||'')" >
        </MsgBox>
      </div>
    </template>
    <div v-else>
      <NoData>暂无消息</NoData>
    </div>
  </div>
</template>

<script>
  import store from '../../store/index'
  import MsgBox from '@/components/msgBox' // 订单项
  import websocket from  '../../utils/websocket'
  import NoData from '@/components/noData'
  import AddNoticeNum from '@/components/AddNoticeNum';

  export default {
    name: '',
    components: {MsgBox, NoData, AddNoticeNum},
    data() {
      return{
        msg_lists:[
        ],
        page: 1,
      }
    },
    async onPullDownRefresh() {
      websocket.sendSocketJSON("108");
      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 2*1000)
    },
    onReachBottom(){
      this.page++;
    },
    onShow(){
      if (!wx.getStorageSync('token')) {
        wx.setStorageSync('redirectPage','/pages/msg/main');
        wx.reLaunch({url:'/pages/wxLogin/main'});
        return;
      }
    //   this.$refs.noticeNum && this.$refs.noticeNum.getTotalNum();
      websocket.sendSocketJSON("108");
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "消息"
      });
//             websocket.connect(108);

//             console.log(msglist);
    },
    computed:{
      msgList(){
        // console.log("store接收的消息+++",store.state.msgList.msglist)
        this.page = 1;
        return store.state.msgList.msglist
      },
      lists(){
        let lists = JSON.parse(JSON.stringify(this.msgList.imList || []));

        return lists.splice(0, 10*this.page)
      },
    },
    methods: {
      row_tap(id,cardid,logo,name, wxCode, phone){
        wx.navigateTo({url: '../IM/main?userId='+id+'&logo='+logo+'&type=2&cardId='+cardid+'&name='+name+'&wxCode='+wxCode +'&phone='+phone})
      },

    }
  }
</script>

<style>

</style>






























