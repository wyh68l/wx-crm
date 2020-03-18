<template>
  <div class="logs pb18 bgfff">

    <div class="pl16 fs14 cb8 disflex jsbet pr16" style="align-items: center" v-if="istop != 1">
      <div class="flex1">
        <p class="c38 fbold fs16 lh1 pt15 pb5" v-if="isTopTitle!=1">
          跟进记录
          <span class="be8 lh25 pl9 pr10 bradius3 fs12 c80 floatr" v-if="!isShowAdd && isInFollowLog">
            <picker class='time-picker disinblock pr10'
              mode="date"
              fields="month"
              :value="personalDataEndTime"
              :end="personalDataEndTime"
              @change="datePickerChange">
              {{chooseMonth}}
            </picker>
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/down.png" alt="" class="w10 h10"/>
          </span>
        </p>
        <!--        <p class="c38 fbold fs16 lh1 pt15 pb5" v-if="isTopTitle==1">成交记录</p>-->
        <div v-if="firstLog" class="pt10 pb15 disflex align-cen lh30">
          {{firstLog}}
        </div>
        <div class="pt10 pb15 disflex align-cen lh30" v-else-if="logs[0] && isTopTitle!=1">
          <div class="pr10">{{logs[0].time[0]}}  {{logs[0].time[1]}}</div>

          <div v-if="type ==1 ">
            <div class="fs14 disflex">
              <span>成交金额：￥{{logs[0].money/100}} 备注：{{logs[0].remark}}</span>
            </div>
          </div>

          <!--修改-->
          <div v-if="logs[0].infoType > 3 ">

            <div class="fs14 disflex pt2">
              <span>{{logs[0].infoText}}</span>
            </div>
          </div>

          <!--添加的跟进记录-->
          <div v-else>
            <!--设置标签-->
            <div class="fs14" v-if="logs[0].infoType == 1">
              <div class="disflex align-cen">
                <span class="pr10">为客户打上标签</span>
                <div class="disflex wrap">
                  <span v-for="(v2,k2) in logs[0].infoText" class="bradius3 lh25 pl12 pr13 mr10 fs14 h25"
                        :key="k2"
                        :style="{'background' : v2.lableColor ,
                                           'color' : v2.lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff'}">
                                {{v2.lableName}}
                            </span>
                </div>
              </div>
            </div>

            <div class="fs14 disflex pt2" v-else>
              <span>{{logs[0].infoText}}</span>
            </div>

          </div>
        </div>
      </div>
      <div v-if="isShowAdd">
        <span @click.stop="page_turn('editLog' ,'?clientName='+msg.name + '&id='+msg.cardId)"
              class="lh40 bblue cblue bradius5 pl20 pr21 h40 borderbox disinblock">添加</span>
      </div>
    </div>

    <div class="follow_log disflex jsbet pl23"
         v-for="(v,k) in logs" :key="k"
         :class="k ==0 ? 'active' : ''">

      <div class="left fs10 fbold">
        <p>{{v.time[0]}}</p>
        <p>{{v.time[1]}}</p>
      </div>

      <div class="right fs15 flex1 pb30">
        <div v-if="type ==2">
                    <span>
                        正在<span class="cblue">{{v.action}}</span>你的<span class="cblue">{{v.see}}</span>
                        第<span class="corange pl6 pr5">{{v.num}}</span>次，{{v.info}}
                    </span>
        </div>
        <div v-else>
          <div v-if="type ==1 ">
            <p class="fbold">[{{v.name}}]</p>

            <div class="fs14 disflex">
              <span>成交金额：￥{{v.money/100}} 备注：{{v.remark}}</span>
            </div>

            <div class="wrap disflex">
              <div class="w30 h30 mr5 mt5"
                   v-for="(img,idx) in v.photos"
                   :key="idx"
                   @click="previewImage(img, k)">
                <img :src="img" alt="" class="w100p h100p" mode="aspectFill">
              </div>
            </div>
          </div>

          <!--修改-->
          <div v-if="v.infoType > 3 ">
            <p class="fbold">[{{v.mark}}]{{v.name || ''}}</p>

            <div class="fs14 disflex pt2">
              <span>{{v.infoText}}</span>
            </div>
          </div>



          <!--添加的跟进记录-->
          <div v-else>
            <p  v-if="type !=1 "  class="fbold">[{{v.followName}}]</p>

            <!--设置标签-->
            <div class="fs14" v-if="v.infoType == 1">
              <div class="disflex">
                <span class="pr10">为客户打上标签</span>
                <div class="disflex wrap">
                <span v-for="(v2,k2) in v.infoText" class="bradius3 lh25 pl12 pr13 mr10 fs14 h25"
                      :key="k2"
                      :style="{'background' : v2.lableColor ,
                                           'color' : v2.lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff'}">
                                {{v2.lableName}}
                            </span>
                </div>
              </div>
            </div>

            <div class="fs14 disflex pt2" v-else>
              <span>{{v.infoText}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: '',
    props:['logs', 'type', 'istop' , 'isTopTitle','isInFollowLog', 'firstLog', 'isShowAdd', 'msg'],
    components: {},
    data() {
      return{
        infoType : 0 ,
        chooseMonth: '',//本月业绩选择的时间
        personalDataEndTime: ''
      }
    },
    mounted() {
      if(this.type){
        this.infoType = this.type ;
      }
      let newDate = new Date(),
        endTime = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2);
      this.personalDataEndTime = endTime;
      this.chooseMonth = endTime;
    },
    methods: {
      previewImage(src, idx){
        let source = this.checkImgNameIsNumber(src) ? src : (src + '.primary.png');
        let sourceArr = this.logs[idx].photos.map(val=> this.checkImgNameIsNumber(val) ? val : (val + '.primary.png'));

        wx.previewImage({
          current: source,
          urls: sourceArr,
          // urls必须是数组 不然会报错
        })
      },
      page_turn(url,query){
        query = query || '' ;
        wx.navigateTo({url:'../'+url+'/main'+query});
      },
      datePickerChange(e) {//本月业绩选择时间
        let _time = e.target.value.split('-');
        _time = _time[0] + '-' + _time[1];
        this.chooseMonth = _time;
        console.log(this.chooseMonth)
        // wx.showLoading();
        this.$emit('updateLogs', this.chooseMonth)
        setTimeout(function () {
          wx.hideLoading();
        }, 1000)
      },
    }
  }
</script>

<style>
  .follow_log{
    /*min-height: 140upx;*/
  }

  .logs .follow_log:last-child{
    min-height: auto;
  }

  .follow_log .left {
    position: relative;
    color: #959595;
    padding-right: 70upx;
  }

  .follow_log .right{
    color: #A8A8A8;
  }

  .follow_log.active .left {
    color: #00a0e9;
  }

  .follow_log.active .right {
    color: #383838;
  }

  .follow_log .left::after {
    content: '';
    width: 10upx;
    height: 10upx;
    border: 6upx solid #fff;
    background: #E8E8E8;
    border-radius: 50%;
    position: absolute;
    right: 22upx;
    top: 14upx;
    z-index: 99;
  }

  .follow_log .right {
    position: relative;
  }

  .follow_log .right::before {
    position: absolute;
    content: '';
    width: 2upx;
    height: 100%;
    left: -34upx;
    top: 26upx;
    background: #E8E8E8;
  }

  .follow_log.active .left::after{
    width: 20upx;
    height: 20upx;
    background:#00a0e9 ;
    border: none;
    top: 10upx;
    right: 22upx;
    z-index: 2;
  }

  .follow_log.active .left::before{
    content: '';
    position: absolute;
    top: 0;
    right: 12upx;
    background: rgba(81, 205, 203, .5);
    width: 40upx;
    height: 40upx;
    border-radius: 50%;
    z-index: 1;
  }

  .follow_log.active .right::before{
    top: 46upx;
  }

  .logs .follow_log:last-child .right::before{
    background: #fff;
  }
</style>
