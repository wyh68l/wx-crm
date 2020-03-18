<template>
  <div class="logs bgfff pt15 pl30 pr30">
    <div class=" textc h4 pb32">
      <span class="short-line w50"></span>
    </div>
    <ul class="ul fs14">
      <!-- <li>
        <div class="circle solid shadow"></div>
        <div class="content">
          <p class="desc">总计与你互动<span class="cblue">{{info.num||0}}</span> 次，预计成交率达<span class="cblue">{{rate||0}}%</span>，尽快把握商机</p>
        </div>
      </li> -->
      <template v-for="(item, index) of filterLogObj">
        <li :key="index">
          <div class="circle solid"></div>
          <div class="content">
            <p class="desc fs18 fbold day">{{item.time | formatterTime}}</p>
          </div>
        </li>
        <template v-for="(children, i) of item.children">
          <li :key="i"
              :class='{"no-left-border": i==item.children.length-1 && index == Object.keys(filterLogObj).length-1}'>
            <div class="circle border-circle"></div>
            <div class="content">
              <div class="time fs12 lh12"
                   :class="{cblue: i==0 }">{{children.time}}</div>
              <p class="desc fs14 mt10">正在查看你的{{children.seeType|formatterSeeType}}第<span class="cblue">{{children.ranking}}</span>次，{{children| formatterDesc}} </p>
            </div>
          </li>
        </template>

      </template>
    </ul>
    <NoDataBottom></NoDataBottom>
    <BottomConnect :cardMsg="userInfo" />
  </div>
</template>

<script>
import BottomConnect from '@/components/BottomConnect'
import util from '@/utils/index'
import NoDataBottom from '@/components/NoDataBottom';

export default {
  name: '',
  props: ['userInfo', 'filterLogObj'],
  components: { BottomConnect, NoDataBottom },
  data () {
    return {
      infoType: 0,
      dataList: [{
        name: '23',
        children: [{ name: 21 }, { name: 5 }]
      }]
    }
  },
  filters: {
    formatterTime (logTime) {
      // let nowDay = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      let daySeconds = 1000 * 60 * 60 * 24; //1天
      let date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      let nowTime = date.getTime();
      if (nowTime - logTime < 0) {
        return '今天';
      } else if (nowTime - logTime < daySeconds) {
        return '昨天'
      } else if (nowTime - logTime < daySeconds * 2) {
        return '前天'
      }
      let logDate = new Date(logTime);
      let logYear = logDate.getFullYear();
      if (date.getFullYear() === logYear) {
        return `${logDate.getMonth() + 1}月${logDate.getDate()}日`
      } else {
        return `${logDate.getFullYear()}年${logDate.getMonth() + 1}月${logDate.getDate()}日`
      }
      return '';
    },
    formatterSeeType (id) {
      let typeName = '';
      switch (id) {
        case 1:
          typeName = "名片";
          break;
        case 2:
          typeName = "产品";
          break;
        case 3:
          typeName = "官网";
          break;
        case 4:
          typeName = "动态";
          break;
      }
      return typeName;
    },
    formatterDesc (info) {
      let desc = '';
      switch (info.seeType) {
        case 1:
          if (info.num < 4) {
            desc = "现在沟通，效率更高哦";
          } else {
            desc = "成交有望";
          }
          break;
        case 2:
          if (info.num < 4) {
            desc = "尽快把握商机";
          } else {
            desc = "可标注为重点客户";
          }
          break;
        case 3:
          if (info.num < 4) {
            desc = "有望合作";
          } else {
            desc = "可标注为重点客户";
          }
          break;
        case 4:
          if (info.num < 4) {
            desc = "合作意向很强烈";
          } else {
            desc = "成单在望";
          }
          break;
      }
      return desc;
    },

  },
  mounted () {
  },
  methods: {

  }
}
</script>

<style>
.logs {
  /*min-height: 140upx;*/
  /* height: 100%; */
  border-radius: 20upx 20upx 0 0;
  min-height: 140upx;
}
.logs .short-line {
  display: inline-block;
  height: 8upx;
  background-color: #f5f5f6;
}
.ul {
  position: relative;
}
.ul::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: #e8e8e8;
  width: 1upx;
}
.ul > li {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding-bottom: 80upx;
}

.ul > li .content {
  padding-left: 30upx;
}
.ul > li .content .day {
  transform: translateY(-25%);
}
.circle {
  width: 20upx;
  height: 20upx;
  border-radius: 20upx;
  background-color: #00a0e9;
  display: inline-block;
  /* position: absolute; */
  transform: translateX(-50%);
  box-shadow: 0 0 6upx 6upx rgb(255, 255, 255);
}
.border-circle {
  width: 16upx;
  height: 16upx;
  border-radius: 20upx;
  border: 2upx solid #00a0e9;
  background-color: #fff;
  box-shadow: 0 0 6upx 6upx #fff;
}
.shadow {
  box-shadow: 0 0 10upx 10upx #00a0e980;
}
.no-left-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: -2upx;
  bottom: 0;
  right: 20;
  width: 20upx;
  height: 100%;
  background-color: #fff;
}
</style>
