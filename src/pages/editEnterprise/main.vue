<template>
  <div class="h100p">

    <div class="bgfff pl16 pr17 lh49 fs16 c38 mb15 company-info">
      <div class="disflex jsbet pt10 pb10">
        <span class="fbold marks pr15">企业LOGO</span>
        <div class="disflex align-cen" @click="uploadpic">
          <img :src="picchecked || logo " alt=""
                            mode="aspectFill"
                            class="w50 h50 bradius50p" />
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10 ml10" />
        </div>
      </div>

      <div class="disflex jsbet ">
        <label for="company" class="fbold marks pr15">企业名称</label>
        <input type="text" id="company" class="pha8 textr h49" placeholder="企业名称" v-model="company">
      </div>

      <div class="disflex jsbet " @click="page_turn('chooseProfession')">
        <label for="industry" class="fbold marks pr15">所属行业</label>
        <div class="disflex align-cen">
          <input type="text" id="industry" class="pha8 textr h49 pr12" placeholder="所属行业" v-model="industry.industryName" readonly
                 disabled>
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10 " />
        </div>
      </div>

      <div class="disflex jsbet ">
        <label for="company" class="fbold marks pr15">企业密令</label>
        <input type="text"
               class="pha8 textr h49 ml10"
               placeholder="设置密令其他人加入需此密令"
               style="flex-grow: 1"
               @input="filterEmoji"
               v-model="password">
      </div>

      <div class="disflex jsbet ">
        <label for="company" class="fbold pr15">推荐人ID</label>
        <input type="text" class="pha8 textr h49" placeholder="推荐人ID（选填）" v-model="agentCompanyId">
      </div>

      <div class="">
        <label for="company" class="fbold">企业公告</label>
        <div class="pb10 lh22">
            <textarea name="" v-model="companyNotice"
                      v-if="showTextarea"
                      @blur="showTextarea=false"
                      :focus="showTextarea"
                      maxlength="200"
                      class="fs16 w100p"
                      placeholder="企业公告">
                </textarea>
              <div class="textarea"
                   :class="{'has-value': companyNotice}"
                   @click="showTextarea=true"
                   v-else
              >
            {{companyNotice || "企业公告"}}
          </div>
        </div>
      </div>

    </div>

    <!--    <div class="disflex jsaround fs12 ca8 pt10 pb10 bgfff textc">-->
    <!--      <div @click="page_turn('productControl')">-->
    <!--        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/prod_blue.png" alt="" class="w30 h30">-->
    <!--        <p class="pt7">产品管理</p>-->
    <!--      </div>-->
    <!--      <div @click="page_turn('dynamicControl')">-->
    <!--        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/browser_blue.png" alt="" class="w30 h30">-->
    <!--        <p class="pt7">动态管理</p>-->
    <!--      </div>-->
    <!--      <div @click="page_turn('webSiteControl')">-->
    <!--        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/computer_blue.png" alt="" class="w30 h30">-->
    <!--        <p class="pt7">官网管理</p>-->
    <!--      </div>-->
    <!--    </div>-->

    <div class="fix_bottom lh49 bg_line_blue cfff w100p textc cfff fs18 " @click="saveEnterprise">保存</div>

    <canvas style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
            canvas-id="Canvas"></canvas>


  </div>
</template>

<script>
  const platform = wx.getSystemInfoSync().platform;

  import util from '../../utils/index'
  import WXAJAX from '../../utils/request'
  import StaticResources from '@/components/StaticResources';


  export default {
    name: '',
    components: {StaticResources},
    data() {
      return {
        logo: 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png',//头像
        company: '',
        industry:{industryId:0},//行业
        picchecked: '',
        companyNotice:'',
        password: '',
        agentCompanyId: '',
        phone: '',
        type:'add',
        showTextarea: false,
      }
    },
    onShow() {
      // if (!wx.getStorageSync('token')) {
      //   wx.redirectTo({url: '/pages/wxLogin/main'});
      // }
      let industry = wx.getStorageSync('choose_profession') || '';
      this.industry = industry;
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "编辑企业"
      });
      console.log(this.$root.$mp.query);
      this.type = this.$root.$mp.query.type ;
      if(this.type == 'edit'){
        this.getCompanyMsg();
      }else{
        this.reset();
      }
    },
    methods: {

      reset(){
        this.logo = 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/card1_user.png';
        this.company = '';
        this.industry = {industryId:0};
        this.picchecked = '';
        this.companyNotice = '';
        this.password = '';
      },
      filterEmoji(){
        this.password = util.filterEmoji(this.password);
      },
      getCompanyMsg(){//获取企业信息
        wx.showLoading();
        let v = this ;

        WXAJAX.POST({ ignore: true }, '', '/company/getCompany').then((data) => {

          wx.hideLoading();
          if(data){
            v.company = data.companyName ;
            v.password = data.password || '';
            v.industry = {
              industryName : data.industryName ,
              industryId : data.industryId ,
            };
            v.picchecked = data.companyLogo || '';
            v.companyNotice = data.companyNotice || '';

          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      async uploadpic(str) {
        let path = await util.chooseImage('file');
        if(Object.prototype.toString.call(path) !== '[object Array]') return;
        this.uploadImg(path[0], str);
      },
      uploadImg(path, str) {

        let v = this;

        wx.showLoading();

        WXAJAX.UploadImage(path).then((data) => {
          wx.hideLoading();
          data = JSON.parse(data);

          if (data.code == '200') {

            this.picchecked = WXAJAX.imgBackUrl + data.data ;

          } else {
            wx.showToast({
              title: '网络异常',
              duration: 2000,
              icon: 'none'
            })
          }

        }).catch((err) => {
          wx.hideLoading();
          console.log('err -- ', err);
        })

      },
      page_turn(url){
        wx.navigateTo({url:'../'+url+'/main'})
      },
      saveEnterprise(){//保存
        const { backNum } = this.$root.$mp.query;
        let v = this ;
        if(!v.picchecked){
          wx.showToast({
            title: '请上传头像！',
            icon: 'none'
          });
          return
        }

        if(!v.company.trim() ){
          wx.showToast({
            title: '请输入企业名称！',
            icon: 'none'
          });
          return
        }
        if(!v.industry.industryId){
          wx.showToast({
            title: '请选择企业行业！',
            icon: 'none'
          });
          return
        }

        if (!v.password.trim()) {
          wx.showToast({
            title: '请输入口令！',
            icon: 'none'
          });
          return
        }

        wx.showLoading();

        let url = '/company/addCompany' ;
        if(this.type == 'edit'){
          url = '/company/updCompany' ;
        }

        WXAJAX.POST({
          companyName:v.company.trim() ,
          phone: v.phone.trim(),
          industryId : v.industry.industryId,
          companyLogo:v.picchecked ,
          companyNotice : v.companyNotice.trim() ,
          password: v.password.trim(),
          agentCompanyId: v.agentCompanyId.trim()
        }, '', url).then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功！',
            icon: 'success'
          });
          wx.setStorageSync('isBoss' , true ) ;

          setTimeout(function () {
            if(v.type === 'chooseAdd'){
              wx.navigateTo({
                url: '/pages/editCard/main'
              });
            }else{
              wx.reLaunch({
                url: '/pages/enterprise/main'
              })
              // wx.navigateBack({
              //   delta: parseInt(backNum) || 1
              // });
            }
          },800)

          console.log(data)
        }).catch((err) => {
          // console.log(err);
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
      }
    }
  }
</script>

<style>
  .textarea{
    width:100%;
    box-sizing:border-box;
    min-height:150px;
    font-size:32upx;
    cursor:auto;
    display:block;
    position:relative;
    color: #a8a8a8;
  }

  .has-value{
    color: #333;
  }

  .company-info >div >label{
    white-space: nowrap;
  }
  .output-audio {
    width: 167px;
    height: 40px;
    position: relative;
    margin-right: 22upx;
  }

  .audio::before {
    content: '';
    display: block;
    width: 20upx;
    height: 20upx;
    background: #F5F5F6;
    position: absolute;
    border: 1upx solid #E8E8E8;
    border-radius: 8upx;
    transform: rotate(45deg);
    border-right-width: 0;
    border-top-width: 0;
    top: 0px;
    bottom: 0;
    left: -12upx;
    margin: auto;
  }

  .output-audio .audio {
    padding: 24upx 0 24upx 34upx;
    background: #F5F5F6;
    border: 1upx solid #E8E8E8;
    position: relative;
    height: 34upx;
    border-radius: 10upx;
  }

  .output-audio .audio .ico {
    width: 24upx;
    height: 34upx;
    float: left;
  }
</style>
