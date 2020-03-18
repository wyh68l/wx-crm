<template>
  <div @click="row_tap">
    <div class="disflex jsbet pl15 pr15 bgfff pt15 pb15" :class="bradius">
      <div class="pr10 posre">
        <img :src="msg.logo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png'" alt=""  mode="aspectFill" class="w50 h50 bradius5" />
        <span class="disblock posab top0 right5 bradius50p bg_line_orange w10 h10" v-if="msg.newestMessage && msg.newestMessage.type== 0 && msg.newestMessage.sendId != myid"></span>
      </div>
      <div class="flex1">
        <div class="disflex jsbet ">
          <div>
            <span class="fs18 c38 pr7 over_1 username disinblock">{{msg.name || msg.nickName}}</span>
            <span class="fs12 cfff lh15 pl6 pr5 bradius3 bgblue" v-if="isusertag && isImMsg">{{isImMsg ? msg.newestMessage.type: '' }}</span>
            <span class="fs12 cfff lh15 pl6 pr5 bradius3 bgblue" v-if="isusertag && msg.num==1">{{msg.num==1 ? '新客': '' }}</span>
            <span class="fs12 c78 lh15 pl7" v-if="isport">{{msg.position}}</span>
          </div>
          <span class="fs12 ca8" v-if="istime">{{msg.hour || dateTime || ''}}</span><!--type == 1 || type == 3-->
          <span v-if="isrank && index <3 " class="textr fs12 lh25"
                :class="index == 0 ? 'corange' : index ==1 ? 'cyellow' : 'cblue' ">NO {{index+1}}</span>
        </div>
        <!--行为记录-->
        <div class="disflex jsbet cbc fs14" v-if="isaction"><!--type == 1 || type ==   5-->
          <span v-if="msg.rate || msg.entranceType == 4">
                        总计与你互动<span class="cblue">{{msg.num}}</span>次，预计成交率达<span class="corange">{{msg.rate || '0%'}}</span>，尽快把握商机
                    </span>
          <span v-else>
                        正在<span class="cblue">{{msg.action}}</span>你的<span class="cblue">{{msg.see}}</span>
                        第<span class="corange pl6 pr5">{{msg.num}}</span>次，{{msg.info}}
                    </span>
          <span class="icon">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/msg.png"
                 alt=""
                 @click.stop="toIM"
                 class="w16 h16 mt2 ml16 contact pt5 pb5" />
          </span>
        </div>

        <!--tel-->
        <div class="disflex align-cen pt6 phone" v-if="istel && !telReverse">
          <template v-if="msg.phone">
            <span class="fs14 ca8" @click.stop="makePhone(msg.phone)">{{msg.phone}}</span>
            <span class="icon"  @click.stop="makePhone(msg.phone)">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png"
                   alt="" class="w16 h16 ml16"
              />
            </span>
          </template>
          <template v-else-if="msg.personalWx">
            <span class="fs14 ca8" @click.stop="addWx(msg.personalWx)">{{msg.personalWx}}</span>
            <span class="icon"  @click.stop="addWx(msg.personalWx)">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/im_msg.png"
                   alt="" class="w16 h16 ml16"
              />
            </span>
          </template>

        </div>
        <div class="disflex align-cen pt6 phone" v-if="istel && telReverse">
          <span class="icon" @click.stop="makePhone(msg.phone)">
             <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/tel_2.png"
                  alt="" class="w16 h16"
             />
          </span>
          <span class="fs14 ca8 ml16" @click.stop="makePhone(msg.phone)">{{msg.phone}}</span>

        </div>

        <!--IM信息内容-->
        <div v-if="isImMsg" class="w267 over_1 ">
                    <span v-if="msg.newestMessage.type == 0 && msg.newestMessage.sendId==myid"
                          class="borderbox mr5 disinblock w34 lh15 fs12 textc bradius3 send">送达</span>
          <span v-if="msg.newestMessage.type == 1"
                class="borderbox mr5 disinblock w34 lh15 fs12 cgreen bgreen textc bradius3 receive">已读</span>
          <!--显示的消息内容-->
          <span v-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 2"  class="fs14 ca8 disinblock" style="font-size: 28upx">[图片]</span>
          <span v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 3" class="fs14 ca8 disinblock" style="font-size: 28upx">[语音]</span>
          <span v-else-if="msg.newestMessage.contentType && msg.newestMessage.contentType == 4" class="fs14 ca8 disinblock" style="font-size: 28upx">[视频]</span>
          <span class="fs14 ca8 disinblock" style="font-size: 28upx" v-else-if="msg.newestMessage.messageType==1">{{msg.newestMessage.message}}</span>
          <span class="fs14 ca8 disinblock" style="font-size: 28upx" v-else-if="msg.newestMessage.messageType==2">我是{{msg.newestMessage.message.companyName}}的{{msg.newestMessage.message.name}},欢迎进入我的名片，有什么可以帮到你的吗？</span>
        </div>

      </div>
      <div v-if="istags && msg.responseList" class="disflex">
        <div class="disflex column-reverse mr8">
                    <span class="ca8 textc w64 lh25 fs14 bradius3 disblock bgf5f6 over_1"
                          v-if="msg.responseList[2]"
                          :style="{ color : msg.responseList[2].lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff' ,
                          background : msg.responseList[2].lableColor } ">
                        {{msg.responseList[2].lableName}}
                    </span>
        </div>
        <div>
                    <span class="ca8 textc w64 lh25 fs14 bradius3 disblock bgf5f6 mb10 over_1"
                          v-if="msg.responseList[1]"
                          :style="{ color : msg.responseList[1].lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff' ,
                          background : msg.responseList[1].lableColor } ">
                        {{msg.responseList[1].lableName}}
                    </span>
          <span class="ca8 textc w64 lh25 fs14 bradius3 disblock bgf5f6 over_1"
                v-if="msg.responseList[0]"
                :style="{ color : msg.responseList[0].lableColor == '#F5F5F6' ? '#a8a8a8' : '#fff' ,
                          background : msg.responseList[0].lableColor } ">
                        {{msg.responseList[0].lableName}}
                    </span>
        </div>

      </div>
    </div>

    <!---->
    <div class="btf5f6 pl16 pr15 fs14 cb8 lh34 bgfff disflex jsbet"><!-- v-if="type == 2 || type == 4"-->
      <!--附加记录-->
      <div v-if="isShowFollow">
        <span>
          {{date}}
          由 <span class="cblue">{{msg.followName}}</span>
          <template v-if="msg.followType==3">
            主动加入超级CRM
          </template>
          <template v-else>
             <template v-if="msg.followType==1">
              通过<span class="cblue">电话拜访</span>
            </template>
            <template v-if="msg.followType==2">
                通过<span class="cblue">微信拜访</span>
            </template>
            <template v-if="msg.followType==4">
               通过<span class="cblue">当面拜访</span>
            </template>
            <template v-if="msg.followType==5">
              通过<span class="cblue">其他</span>
            </template>
            完成跟进
          </template>
        </span>
      </div>

      <div v-if="ismsg">
        <span>{{msg.text}}</span>
      </div>
      <span @click.stop="page_turn('editLog' ,'?clientName='+msg.name + '&id='+msg.cardId)"
            class="lh40 bblue cblue bradius5 pl20 pr21 h40 borderbox mt17"
            v-if="isaddLog">添加</span>

    </div>

    <div v-if="isShowCourse" @click.stop="">
      <addWxCourse :isShow="isShowCourse"
                   @close="isShowCourse=false"
      />
    </div>
  </div>
</template>

<script>
  import util from '../utils/index'
  import StaticResources from '@/components/StaticResources';
  import AddWxCourse from '@/components/addWxCourse'

  import { mapActions } from 'vuex';

  export default {
    name: '',
    props: ['msg', 'type', 'bradius','isaddLog','isrightpoint','ismsg','isrank',
      'istime','istel','isaction','issppend_record','istags','isImMsg',
      'islogtitle','isport','isusertag','actionType','index' ,'telReverse', 'isShowFollow'],
    // type :  1 -- 显示信息 ， 2 -- 不显示信息
    components: {StaticResources, AddWxCourse},
    data() {
      return{
        isShowCourse: false,
        myid: wx.getStorageSync('userId'),
      }
    },
    mounted() {
    },
    computed:{
      date(){
        return this.formatDate('MM/dd hh:mm', this.msg.createTime);
      },
      dateTime() {
        //console.log(util.dateFormat(this.istime));
        return this.istime ? util.dateFormat(this.istime) : '';
      }
    },
    methods: {
      ...mapActions(['setCurrentClient']),
      toIM(){
        const { cardId, logo, userId, name, phone, personalWx } = this.msg;
        wx.navigateTo({
          url: '../IM/main?userId=' + userId + '&logo=' + logo + '&type=2&cardId=' + cardId + '&name=' + name + '&wxCode=' + personalWx + '&phone=' + phone
        });
      },
      addWx(personalWx){//添加微信
        if (!personalWx) {
          wx.showToast({
            title: '未绑定微信号',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        let v = this ;
        wx.setClipboardData({
          data: personalWx,
          success: function (res) {
            wx.getClipboardData({
              success: function (res) {
                wx.showToast({
                  title: '复制成功'
                })
                v.isShowCourse=true;
              }
            })
          }
        })
      },
      row_tap() {
        this.setCurrentClient(this.msg);
        this.$emit('row_tap' , this.msg.cardId , this.msg.userId)
      },
      page_turn(url,query){
        query = query || '' ;
        wx.navigateTo({url:'../'+url+'/main'+query});
      },
      makePhone(tel){
        util.MakePhone(tel || '');
      }
    }
  }
</script>

<style scoped>
  .icon{
    flex: 0 0 32upx;
  }
  .send{
    color: #00a0e9;
    border:1upx solid #00a0e9;
  }
  .receive{
    color: #2BCF88;
    border: 1upx solid #2BCF88;
  }
  .contact{
    flex: 0 0 32upx;
  }
  .username{
    max-width: 150px;
    vertical-align: middle;
  }
</style>

