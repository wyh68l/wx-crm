<template>
  <div>
    <!--动态-->
    <div v-for="(v, k) in lists" :key="k">
      <p class="fs12 ca8 pl20 lh40">{{ k }}</p>
      <div class="pl16_prod">
        <div :key="k2" v-for="(v2, k2) in v">
          <ProdItem
            :prod="v2"
            :type="'complex'"
            @btn_tap="btn_tap"
            @prod_tap="prod_tap"
          ></ProdItem>
        </div>
      </div>
    </div>
    <div v-if="addTypeShow">
      <SelectorOne
        :title="'选择添加内容'"
        :status="addTypeShow"
        :allClass="addTypes"
        @closeModal="addTypeShow = !addTypeShow"
        @choose_tap="choose_tap"
      ></SelectorOne>
    </div>
    <BottomButtonSmall
      :text="'发布'"
      :url="'confirm'"
      @btn_tap="btn_tap"
    ></BottomButtonSmall>

    <!--bottom-->
    <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">
      - 汉全科技集团出品 -
    </div>
    <div class="h99"></div>
  </div>
</template>

<script>
import BottomButtonSmall from "@/components/bottom_button_small"; // 订单项
import ProdItem from "@/components/prodItem"; // 订单项
import SelectorOne from "@/components/selectorOne"; // 订单项
import WXAJAX from "@/utils/request";
import util from "@/utils/index";

export default {
  name: "",
  components: { BottomButtonSmall, ProdItem, SelectorOne },
  data() {
    return {
      lists: {},
      addTypeShow: false,
      addTypes: [
        { name: "发布动态", id: "dynamic" },
        { name: "写原创文章", id: "article" },
        { name: "转载文章", id: "reprint" },
        { name: "取消", id: "cancel" }
      ],
      page: 1,
      isLoading: false, //是否在加载
      nodata: false //是否已经没有数据
    };
  },
  onShow() {
    this.nodata = false;
    this.lists = {};
    this.page = 1;
    this.isLoading = false;
    wx.setStorageSync("editOperator", "");
    this.dynamic();
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "动态管理"
    });
  },
  async onPullDownRefresh() {
    // to doing..
    // 下拉刷新
    wx.showNavigationBarLoading();
    this.nodata = false;
    this.lists = {};
    this.page = 1;
    this.isLoading = false;
    await this.dynamic();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
  },
  onReachBottom() {
    let v = this;
    v.dynamic();
  },
  methods: {
    btn_tap(method) {
      if (method == "confirm") {
        //发布
        this.addTypeShow = true;
      } else if (method == "like") {
        //收藏
        console.log("收藏");
      } else if (method == "comment") {
        //评论
        console.log("评论");
      }
    },
    prod_tap(id, type) {
      console.log(type)
      //type : 1 -- 文章 ， 2 -- 动态
      if (type == 1 || type == 3) {
        wx.navigateTo({ url: "../../articleDetail/index?id=" + id });
      } else {
        wx.navigateTo({ url: "../../articleDetail/main?id=" + id });
      }
    },
    choose_tap(type) {
      this.addTypeShow = false;
      switch (type) {
        case "dynamic":
          wx.navigateTo({ url: "../dynamicIssue/main?type=" + type });
          break;
        case "article":
          //发布类型
          // wx.navigateTo({ url: "../dynamicIssue/main?type=" + type });
           wx.navigateTo({ url: "../../editArticle/main" });
          break;
        case "reprint": //转载
          wx.navigateTo({ url: "../../editArticle/publicArticle" });
          break;
        case "cancel": //取消
          break;

        default:
          break;
      }
    },
    dynamic() {
      let v = this;
      if (v.isLoading || v.nodata) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      wx.showLoading();

      return WXAJAX.POST(
        {
          pageNum: v.page
        },
        "",
        "/company/selectDynamicInfo"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            let today = new Date(),
              year = today.getFullYear(),
              month = today.getMonth() + 1,
              day = today.getDate(),
              item = {};

            let tmp = JSON.parse(JSON.stringify(v.lists));

            data.forEach(function(i, k) {
              var time = new Date(i.createTime),
                fullTime =
                  time.getFullYear() +
                  "" +
                  (time.getMonth() + 1) +
                  "" +
                  time.getDate(),
                showTime = "",
                info = "";

              showTime =
                time.getFullYear() +
                "-" +
                (time.getMonth() + 1) +
                "-" +
                time.getDate();

              item = {
                fullTime: fullTime, //年月日
                titleTime: showTime,
                createTime: time.getHours() + ":" + time.getMinutes(),
                photo: i.photos ? i.photos.split(",")[0] : [],
                title: i.title,
                commentModelList: i.commentModelList,
                doThumbsNum: i.doThumbsNum,
                id: i.dynamicId,
                type: i.type,
                commentNum: i.commentNum
              };

              if (tmp[showTime]) {
                tmp[showTime].push(item);
              } else {
                tmp[showTime] = [item];
              }

              v.lists = tmp;
            });

            v.page++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {
            this.nodata = true;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    }
  }
};
</script>

<style>
.pl16_prod > div {
  padding-left: 20upx;
  border-bottom: 1upx solid #f7f7f8;
  background: white;
}
.pl16_prod > div > div {
}
</style>
