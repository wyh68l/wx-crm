<template>
  <div class="bgf5f6 radar">
    <div class="bgblue textc posre"
         :style="{height: navHeight+'px'}">
      <p class="navgation-title cfff fs18 h44 lh44 fbold">雷达</p>
    </div>
    <FormId>
      <div class="radar_menu posre pl36 pr37 fs16 c78 bgblue">
        <div class="menu-content fs16">
          <div class="cf5f5f6 meu-item"
               @click="type1_tap(0)">
            <p class="pb9">AI追踪</p>
            <div class="textc h4"
                 :class="type1_id == 0 ? 'active' : '' ">
            </div>
          </div>
          <div class="cf5f5f6 meu-item"
               @click="type1_tap(1)">
            <p class="pb9">行为分析</p>
            <div class="textc h4"
                 :class="type1_id == 1 ? 'active' : '' ">
            </div>
          </div>
          <div class="cf5f5f6 meu-item"
               @click="type1_tap(2)">
            <p class="pb9">成交率</p>
            <div class="textc h4"
                 :class="type1_id == 2 ? 'active' : '' ">
            </div>
          </div>
        </div>
      </div>
    </FormId>
    <scroll-view
    v-if="type1_id == 0 || type1_id == 2"
    scroll-y="true"
                 :style="{height: scrollContentHeight+'px'}"
                 @scrolltolower="lower"
                 enable-back-to-top="true"
                 scroll-with-animation="true"
                 lower-threshold="100"
                 scroll-anchoring="true"
                 class="bgfff"
                 :scroll-top="scrollTop">
      <!-- <div class="content"> -->
        <!-- 暂时隐藏 -->
      <!-- <div class="h50 bgblue posre">
        <AddNoticeNum class="notice-ws-num"
                      ref="noticeNum"></AddNoticeNum>
      </div> -->
      <AI v-if="type1_id == 0"
          ref="ai"
          class="ai" />
      <!-- <Behavior v-if="type1_id == 1"
                class="behavior" /> -->
      <Closing v-if="type1_id == 2"
               class="closing" />
      <NoDataBottom />
      <!-- v-if="lists.length && nodata" -->
      <!-- </div> -->
    </scroll-view>
    <scroll-view
      v-if="type1_id == 1"
      scroll-y="true"
                 :style="{height: scrollContentHeight+'px'}"
                 @scrolltolower="lower"
                 enable-back-to-top="true"
                 scroll-with-animation="true"
                 lower-threshold="100"
                 scroll-anchoring="true"
                 class="bgfff"
                 :scroll-top="scrollTop">
      <!-- <div class="content"> -->
      <div class="h50 bgblue posre" style="display:none;">
        <AddNoticeNum class="notice-ws-num"
                      ref="noticeNum"></AddNoticeNum>
      </div>
      <Behavior  class="behavior" />
      <NoDataBottom />
      <!-- v-if="lists.length && nodata" -->
      <!-- </div> -->
    </scroll-view>
  </div>
</template>

<script>
import MsgBox from "@/components/msgBox"; // 订单项
import AddNoticeNum from "@/components/AddNoticeNum";
import WXAJAX from "../../utils/request";
import FormId from "@/components/formId";
import NoData from "@/components/noData";
import DialogBox from "@/components/dialogBox"; // 对话框
import AI from "./ai/index";
import Behavior from "./behavior/index";
import Closing from "./closing/index";
import NoDataBottom from '@/components/NoDataBottom';
export default {
  data () {
    return {
      notYetLogin: false, // 暂时不登录
      type1_id: 0,
      type2_id: "0",
      type3_id: "1",
      menu: [
        [
          { title: "时间追踪", id: 0 },
          {
            title: "行为追踪",
            id: 1,
            child: [
              { title: "看名片", id: 1 },
              { title: "看产品", id: 2 },
              { title: "看动态", id: 4 },
              { title: "看官网", id: 3 }
            ]
          }
        ],
        [
          { title: "查看名片", id: 1 },
          { title: "重视产品", id: 2 },
          { title: "关注动态", id: 4 },
          { title: "关注企业", id: 3 }
        ]
      ],
      lists: [],
      ai_lists: {}, //解决AI追踪时间排序
      type: 1,
      page: 1,
      isLoading: false, //是否在加载
      nodata: false, //是否已经没有数据
      seeType: {
        1: {
          title: "名片",
          1: "现在沟通，效率更高哦",
          4: "成交有望"
        },
        2: {
          title: "产品",
          1: "尽快把握商机",
          4: "可标注为重点客户"
        },
        3: {
          title: "官网",
          1: "有望合作",
          4: "可标注为重点客户"
        },
        4: {
          title: "动态",
          1: "合作意向很强烈",
          4: "成单在望"
        }
      },
      infoText: {},
      navHeight: 0,
      scrollContentHeight: 0,
      seeTypeId: '',//业务类型  '': 全部;1:名片;2:产品;3：官网;4:查看文章;5:预约
      scrollTop: 0, //设置滚动条的位置
    };
  },

  components: {
    MsgBox,
    FormId,
    NoData,
    DialogBox,
    AddNoticeNum,
    AI,
    Behavior,
    Closing,
    NoDataBottom
  },

  async onLoad () {
    this.lists = [];
    this.ai_lists = {};
    this.page = 1;
    this.isLoading = false;
    const query = this.$root.$mp.query;
    console.log(query);
    if (query && query.notYetLogin) {
      this.notYetLogin = query.notYetLogin;
    }
    // this.getInits();
    this.calculateNavBarHeight();

  },
  onShow () {
    try {
      wx.setNavigationBarTitle({
        title: "雷达"
      });
    } catch (e) {
      // this.$refs.noticeNum && this.$refs.noticeNum.getTotalNum();
    }
    // this.$refs.noticeNum && this.$refs.noticeNum.getTotalNum();
  },
  methods: {
    //scrollview滚动到底部
    lower () {
      if (this.type1_id === 0 && this.$refs.ai) {
        this.$refs['ai'].getVisitRank(true);
      }
    },
    //计算高度
    calculateNavBarHeight () {
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度

          getApp().globalData.navHeight = navHeight;
          this.navHeight = navHeight;

          // this.mainHeight = res.windowHeight;
          this.scrollContentHeight = res.windowHeight - navHeight - 38;
        },
        fail (err) {
          console.log(err);
        }
      });
    },

    getInits () {
      if (this.notYetLogin) {
        this.notYetLogin = false;
        return;
      }

      let v = this,
        params = {};

      if (v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;

      // entranceType : 入口类型（1:时间追踪，2：行为追踪，3：ai分析,4,成交率）
      // seeType :  查看类型 1:名片，2:产品，3：官网,4:查看动态
      if (this.type1_id == 0) {
        //智能追踪
        if (this.type2_id == 0) {
          params.entranceType = 1;
        } else if (this.type2_id == 1) {
          params.entranceType = 2;
          params.seeType = this.type3_id;
        }
      } else if (this.type1_id == 1) {
        //AI分析
        params.entranceType = 3;
        params.seeType = this.type2_id;
      } else if (this.type1_id == 2) {
        //成交率
        params.entranceType = 4;
        //params.seeType = 2;
      }
      params.pageNum = v.page;
      console.log("params", params);
      wx.showLoading();
      WXAJAX.POST(
        params,
        "",
        "/seeRecord/getSeeRecordList",
        null,
        "/pages/index/main"
      )
        .then((data, code) => {
          wx.hideLoading();
          if (data) {
            let today = new Date(),
              year = today.getFullYear(),
              month = today.getMonth() + 1,
              day = today.getDate(),
              item = {},
              _datas = {},
              _length = v.lists.length,
              _lastFullTime = 0;

            if (v.type1_id == 0) {
              // 智能追踪， 分时间显示
              _length != 0 &&
                (_lastFullTime = v.lists[_length - 1][0].fullTime);
              let tmp = JSON.parse(JSON.stringify(v.ai_lists));
              data.forEach(function (i, k) {
                var time = new Date(i.createTime),
                  fullTime =
                    time.getFullYear() +
                    "" +
                    (time.getMonth() + 1) +
                    "" +
                    time.getDate(),
                  showTime = "",
                  info = "";
                if (time.getFullYear() < year) {
                  //今年之前
                  showTime =
                    time.getFullYear() +
                    "-" +
                    (time.getMonth() + 1) +
                    "-" +
                    time.getDate();
                } else {
                  //今年
                  if (time.getMonth() + 1 == month) {
                    if (time.getDate() == day) {
                      //今天
                      showTime = "今天";
                    } else if (time.getDate() + 1 == day) {
                      //昨天
                      showTime = "昨天";
                    } else {
                      showTime = time.getMonth() + 1 + "-" + time.getDate();
                    }
                  } else {
                    showTime = time.getMonth() + 1 + "-" + time.getDate();
                  }
                }

                if (i.ranking < 3) {
                  info = v.seeType[i.seeType][1];
                } else {
                  info = v.seeType[i.seeType][4];
                }

                item = Object.assign(i, {
                  fullTime: fullTime, //年月日
                  time: showTime, //页面显示时间
                  logo: i.logo,
                  see: v.seeType[i.seeType].title,
                  action: "查看",
                  num: i.num,
                  hour:
                    time
                      .getHours()
                      .toString()
                      .padStart(2, "0") +
                    ":" +
                    time
                      .getMinutes()
                      .toString()
                      .padStart(2, "0"),
                  info: info
                });

                if (tmp[showTime]) {
                  tmp[showTime].push(item);
                } else {
                  tmp[showTime] = [item];
                }
                //
                //   if(_lastFullTime == fullTime){
                //     v.lists[_length-1].push(item);
                //   }else{
                //     if (_datas[fullTime]) {
                //       _datas[fullTime].push(item);
                //     } else {
                //       _datas[fullTime] = [];
                //       _datas[fullTime].push(item);
                //     }
                //   }
              });
              v.ai_lists = tmp;

              v.lists = Object.keys(v.ai_lists);
              // console.log(_datas)

              // var newkey = Object.keys(_datas);
              // //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
              // var newObj = {};//创建一个新的对象，用于存放排好序的键值对
              // for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
              //   newObj[newkey[i]] = _datas[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
              // }

              // _datas = [];
              // for (var i in newObj) {
              //   _datas.push(newObj[i]);
              // }
              // _datas = _datas.reverse();
              // v.lists = [...v.lists, ..._datas];
            } else {
              _datas = [];
              data.forEach(function (i, k) {
                var time = new Date(i.createTime),
                  info = "";
                if (i.ranking < 3) {
                  info = v.seeType[i.seeType][1];
                } else {
                  info = v.seeType[i.seeType][4];
                }

                item = Object.assign(i, {
                  logo: i.logo,
                  see: v.seeType[i.seeType].title,
                  action: "查看",
                  num: i.num,
                  hour: time.getHours() + ":" + time.getMinutes(),
                  rate: i.rate ? (i.rate * 100).toFixed(2) + "%" : "",
                  info: info,
                  userId: i.userId,
                  entranceType: params.entranceType
                });
                // console.log(item)
                _datas.push(item);
              });
              v.lists = [...v.lists, ..._datas];
            }
            v.page++;
            setTimeout(function () {
              v.isLoading = false;
            }, 500);
          } else if (code == 209) {
          } else {
            v.nodata = true;
          }
          setTimeout(function () {
            v.isLoading = false;
          }, 500);
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
          if (err.code == 403) {
          }
          setTimeout(function () {
            v.isLoading = false;
          }, 500);
        });
    },
    type1_tap (id) {
      //设置滚动条位置, 先设置1 再延迟设置为0 是因为mpvue检测到数据没有发生变化 是不会真正去改变值，导致scrollview滚动到顶部失效
      this.scrollTop = 1;
      setTimeout(() => {
        this.scrollTop = 0;
      }, 50);
      this.type1_id = id;
      if (this.menu[id]) {
        this.type2_id = this.menu[id][0].id;
      }
      if (id == 0) {
        this.type = 1;
      } else {
        this.type = 5;
      }
      this.nodata = false;
      this.lists = [];
      this.ai_lists = {};
      this.page = 1;
      this.isLoading = false;
      this.getInits();
    },
  }
};
</script>

<style scoped>
.radar {
  height: 100%;
  overflow: hidden;
}
.navgation-title {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
}
.radar_menu .menu-content {
  display: flex;
  justify-content: space-between;
  padding-top: 38upx;
}
.radar_menu .meu-item {
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
  /* padding-bottom: 20upx;
  border-bottom: 4upx solid #fff; */
}
.notice-ws-num {
  position: absolute;
  bottom: -30upx;
  left: 30upx;
  z-index: 10;
}
.content {
  overflow: auto;
}
.ai,
.behavior,
.closing {
  position: relative;
  /* margin-top: -20upx; */
  transform: translateY(-20upx);
}
</style>
