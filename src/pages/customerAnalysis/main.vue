<template>
  <div class="h100p borderbox customer">
    <div class="bgblue textc posre"
         :style="{height: navHeight+'px'}">
      <!-- <span class="fs12 cfff posab top0 bottom10"
            @click="back">返回</span> -->
      <p class="navgation-title cfff fs18 h44 lh44 fbold">客户分析</p>
      <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/left-arrows%402x.png"
           alt=""
           @click="back"
           class="w20 h20 back">
    </div>
    <FormId>

      <div class=" radar_menu posre pl36 pr37 fs16 c78 bgblue pt5">
        <div class="menu-content fs16">
          <div class="cf5f5f6 mr126 meu-item"
               @click="menu_tap(0)">
            <p class="pb9">AI分析</p>
            <div class="textc h4"
                 :class="menu_id == 0 ? 'active' : '' ">
            </div>
          </div>
          <div class="cf5f5f6 meu-item"
               @click="menu_tap(1)">
            <p class="pb9">互动记录</p>
            <div class="textc h4"
                 :class="menu_id == 1 ? 'active' : '' ">
            </div>
          </div>
        </div>
      </div>
    </FormId>
    <!-- <div class="content"
         :style="{height: scrollContentHeight+'px'}"> -->
    <scroll-view scroll-y="true"
                 :style="{height: scrollContentHeight+'px'}"
                 @scrolltolower="lower"
                 enable-back-to-top="true"
                 lower-threshold="100"
                 scroll-anchoring="true"
                 :scroll-top="scrollTop">
      <div class="user-info bgblue">
        <img :src="userInfo.analysisModel.logo||'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
             class="w60 h60 bradius5"
             alt="">
        <p class="fs18 cfff fbold pt20">{{userInfo.analysisModel.name}}</p>
      </div>
      <div style="z-index:1000;position:relative;"
           v-show="menu_id == 0">
        <AI :userInfo="userInfo"></AI>
      </div>
      <div class="h100p bgfff"
           style="z-index:1000;position:relative;"
           v-show="menu_id == 1">
        <Log :userInfo="userInfo"
             :filterLogObj="filterLogObj"></Log>

        <!--bottom-->
        <!-- <div class="textc lh42 fs12 ca8 bgf5f6"
             v-if="nodata">- 汉全科技集团出品 -</div> -->
      </div>
      <!-- </div> -->
    </scroll-view>
  </div>
</template>

<script>
import AI from '@/pages/customerAnalysis/ai/index' //
import Log from '@/pages/customerAnalysis/log/index' //
import WXAJAX from '@/utils/request'
import util from '@/utils/index'

import { mapActions } from 'vuex';

export default {
  name: '',
  components: { AI, Log },
  data () {
    return {
      menu_id: 0,
      loaded: false,
      acitveRecord: [{ time: [] }],//互动记录
      head:
        "https://static.xiongmaozhanggui.com/cdn/wechat/images/share_icon_newcomer.png",
      seeType: {
        1: {
          title: '名片',
          1: '现在沟通，效率更高哦',
          4: '成交有望'
        },
        2: {
          title: '产品',
          1: '尽快把握商机',
          4: '可标注为重点客户',
        },
        3: {
          title: '官网',
          1: '有望合作',
          4: '可标注为重点客户',
        },
        4: {
          title: '动态',
          1: '合作意向很强烈',
          4: '成单在望',
        }
      },
      page: 1,
      isLoading: false,//是否在加载
      nodata: false,//是否已经没有数据

      //客户信息
      userInfo: {},
      navHeight: 0,
      scrollContentHeight: 0,
      scrollTop: 0,
      keysArray: [], //来作为唯一值的key数组
      filterLogObj: {}, //清洗过后的日志对象
    }
  },
  mounted () {
    wx.setNavigationBarTitle({
      title: "客户分析"
    });

  },
  onLoad (query) {
    let userId = query.userId;
    this.calculateNavBarHeight();
    this.getCardMsg(userId);
  },
  onShow () {
    setTimeout(() => {
      this.loaded = true;
    }, 3 * 1000);
  },
  onUnload () {
    wx.setStorageSync('AIUserId', 0);
    this.loaded = false;
    this.acitveRecord = [{ time: [] }];
    this.menu_id = 0;
    this.page = 1;
  },
  onHide () {
  },
  methods: {
    ...mapActions(['setCurrentClient']),
    calculateNavBarHeight () {
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight = statusBarHeight + (menuButtonBounding.top - statusBarHeight) * 2 + menuButtonBounding.height; //导航高度

          getApp().globalData.navHeight = navHeight;
          this.navHeight = navHeight;

          // this.mainHeight = res.windowHeight;
          this.scrollContentHeight = res.windowHeight - navHeight - 93; //93是减去人物头像和昵称 加上AI分析和互动记录这块的高度
        },
        fail (err) {
          console.log(err);
        }
      });
    },
    //scrollview滚动到底部
    lower () {
      if (this.menu_id === 0) return; //AI分析页面
      //日志页面
      if (this.isLoading) {
        return
      }
      this.page++;
      this.getSeeRecordList();

    },
    back () {
      wx.navigateBack()
    },
    //客户信息
    getCardMsg (userId) {//获取名片信息
      let v = this;
      wx.showLoading();
      WXAJAX.POST({
        userId
      }, '', '/seeRecord/customerAnalysis').then((data) => {

        wx.hideLoading();
        if (data) {
          data.analysisModel.rate = ((data.analysisModel.rate || 0) * 100).toFixed(2);
          this.userInfo = data;
        }
      }).catch((err) => {
        console.log(err);
        wx.hideLoading();

      });
    },
    menu_tap (id) {
      //设置滚动条位置, 先设置1 再延迟设置为0 是因为mpvue检测到数据没有发生变化 是不会真正去改变值，导致scrollview滚动到顶部失效
      this.scrollTop = 1;
      setTimeout(() => {
        this.scrollTop = 0;
      }, 50);
      this.menu_id = id;
      if (id == 1 && this.acitveRecord[0].time.length == 0) {
        this.page = 1;
        this.getSeeRecordList();
      }
      wx.showLoading();
      setTimeout(function () {
        wx.hideLoading();
      }, 1500);
    },
    getSeeRecordList () {//互动记录

      if (this.isLoading) {
        return
      }
      this.isLoading = true;

      WXAJAX.POST({
        // entranceType: 1,
        pageNum: this.page,
        pageSize: 10,
        userId: wx.getStorageSync('AIUserId')
      }, '', '/seeRecord/getSeeRecordHistory').then((data) => {
        wx.hideLoading();
        
        if (data) {
            let bool = false;
          data.forEach((i, k) => {
            //通过时间数组,将时间存入数组,如果是同一天的,只能放入一份,不是同一天的push到数组里
            let day = util.getdate(i.createTime, '年月日');  //得到的day 是 年-月-日 这种格式
            //先查找数组里面是否已经有这个时间段了
            let position = this.keysArray.indexOf(day);
            if (position > -1) { //position大于-1 说明数组里面已经有这个时间了, 这个position作为对象的key, 从存放数据的对象里面找到对应的数据,把遍历得到的数据,存入这个对象
              let item = this.handlerLogData(i);
              for(let item1 of this.filterLogObj[position].children){
                  if(item1.recordId == item.recordId){
                        bool = true;
                        break;
                  }
              }
              if(!bool) this.filterLogObj[position].children.push(item);
              
            } else { //position 等于 -1, 则说明这是新的一个日期,需要构建一个新的对象,将数据放入过滤后的日志对象里, 将存放keys的数组的长度-1来作为key
              this.keysArray.push(day);
              let item = this.handlerLogData(i);
              this.filterLogObj[this.keysArray.length - 1] = {
                time: i.createTime,
                children: [item]
              }
            }
          });
        } else {
          if(this.page>1) this.page--;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }).catch((err) => {
        if(this.page>1) this.page--;
        wx.hideLoading();
        if (err.code == 204) {
          this.nodata = true;
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    },
    handlerLogData (log) {
      let time = util.getdate(log.createTime, 'monthTime');
      return {
        time,
        nickName: log.nickName,
        seeType: log.seeType,
        ranking: log.ranking,
        recordId:log.recordId
      }
    }
  }
}
</script>

<style scoped>
.customer {
  height: 100%;
  overflow: hidden;
}
.navgation-title {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.radar_menu {
  /* height: 86upx; */
}
.radar_menu .menu-content {
  display: flex;
  justify-content: center;
  padding-top: 32upx;
}
.radar_menu .menu-content .meu-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.radar_menu .active {
  background-color: #fff;
  width: 32upx;
  height: 8upx;
  flex-grow: 1;
}
.content {
  /* overflow: auto; */
  padding-top: 286upx;
  background: transport;
  margin-top: -296rpx;
}
.user-info {
  height: 286upx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: sticky;
  top: 0;
}
.back {
  position: absolute;
  /* transform: rotate(180deg); */
  left: 30upx;
  bottom: 30upx;
}
</style>
