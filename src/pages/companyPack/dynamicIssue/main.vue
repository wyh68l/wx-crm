<template>
  <div class="pb40">

    <div v-if="type == 'dynamic'">
      <div class="textarea_box pl13 pt13 pr17 pb15 fs14 ca8 bgfff mb10">
                <textarea name="" rows="2"
                          maxlength="200"
                          v-model="text"
                          class="h50 w100p"
                          placeholder="请输入动态内容">
                </textarea>
        <div class="textr">{{text.length}}/200</div>
      </div>

      <!--imgs-->
      <div class="pl14 disflex wrap">
        <div class="w100 h100 mr7 mb10 posre" v-for="(v,k) in dynamic_imgs" :key="k">
          <img :src="v" alt="" class="w100 h100 mr7 mb10" mode="aspectFill">
          <span @click="del(k)">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png" alt=""
                              class="w20 h20 posab right0 top0"/>
          </span>
        </div>
        <div class="bgf5f6 bdash_a8 w100 h100 add_img mr7 mb10" @click="uploadpic('dynamic')"></div>
      </div>

    </div>

    <div v-else>
      <div class="w100p h375 textc mb10 bgfff borderbox" @click="uploadpic('article')">
        <div v-if="!article_img" class="pt123">
          <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/VR.png" alt=""
               class="w100 h100" />
          <p class="fs14  ca8">点击添加文章封面</p>
        </div>
        <img :src="article_img" alt="" v-else class="w100p h100p" mode="aspectFill">
      </div>

      <div class="textarea_box pl13 pt13 pr17 pb15 fs14 ca8 bgfff mb10">
                <textarea name="" id="" rows="2"
                          maxlength="200"
                          v-model="text"
                          class="h50 w100p"
                          placeholder="请输入文章标题">
                </textarea>
        <div class="textr">{{text.length}}/200</div>
      </div>

      <div class="bgfff textc pb25">
        <p class="fs14 ca8 pt16 pb40">文章详情</p>


        <span class="disinblock bblue cblue fs14 lh30 bradius5  pl11 pr11"
              @click="page_turn('../companyIntro' , '?type=article')">
                    添加内容
                </span>

        <div v-html="editOperator"></div>

      </div>
    </div>

    <BottomButtonSmall :text="'发布'" :url="'confirm'" @btn_tap="btn_tap"></BottomButtonSmall>
    <canvas style="width: 500px;height: 500px;position: fixed;bottom: -4000px;z-index: -100"
            canvas-id="Canvas"></canvas>
  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
  import StaticResources from '@/components/StaticResources';
  import util from '@/utils'
  import WXAJAX from '@/utils/request'

  export default {
    name: '',
    components: {BottomButtonSmall, StaticResources},
    data() {
      return {
        text_length: 0,
        counter: '200',
        text: '',
        type: '',
        dynamic_imgs: [],
        article_img: '',
        editOperator: '',
      }
    },
    watch: {
      'text': function (newVal, oldVal) {
        if (newVal.length > 200) {
          this.text = this.intro.slice(0, 200)
        }
      }
    },
    onShow() {
      this.editOperator = wx.getStorageSync('editOperator') || '';
    },
    onUnload() {
      wx.setStorageSync('editOperator', '');
    },
    mounted() {

      this.type = this.$root.$mp.query.type;
      let title = '发布文章';
      if (this.type == 'dynamic') {
        title = '发布动态';
      }
      wx.setNavigationBarTitle({
        title: title
      });

    },
    methods: {
      btn_tap(method) {

        console.log(this.text);

        let _url = '/company/addDynamicInfo',
          params = {};

        params.type = this.type == 'dynamic' ? 2 : 1;
        params.title = this.text.trim();

        if (this.type == 'dynamic') {//发布动态
          if (!this.text.trim()) {
            wx.showToast({
              title: '请输入动态内容！',
              duration: 1500,
              icon: 'none'
            });
            return
          }
          params.photos = this.dynamic_imgs.join(',');
          params.details = this.editOperator;
        } else {
          if (!this.article_img) {
            wx.showToast({
              title: '请选择文章封面图片！',
              icon: 'none'
            });
            return
          }

          if (!this.text.trim()) {
            wx.showToast({
              title: '请输入文章标题！',
              duration: 1500,
              icon: 'none'
            });
            return
          }

          if (!this.editOperator.trim()) {
            wx.showToast({
              title: '还未添加内容，不能发布哦！',
              duration: 1500,
              icon: 'none'
            });
            return
          }

          params.photos = this.article_img;
          params.details = this.editOperator;
        }

        WXAJAX.POST(params, '', '/company/addDynamicInfo').then((data) => {
          wx.showToast({
            title: '成功！',
          });
          this.text = '' ;
          this.dynamic_imgs = [] ;
          this.article_img = '' ;

          setTimeout(function () {
            wx.navigateBack() ;
          },500)
        }).catch((err) => {
          console.log(err)
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });

      },
      reset_text(_obj) {
        this.text = _obj.value.substring(0, 200);
        this.text_length = this.text.length;
      },

      async uploadpic(str) {
        if (str == 'dynamic' && this.dynamic_imgs.length >= 9) {
          wx.showToast({
            title: '最多选择九张！',
            duration: 1500,
            icon: 'none'
          });
          return
        }
        let path = await util.chooseImage('file', str === 'dynamic' ? 9 - this.dynamic_imgs.length : 1);
        if(Object.prototype.toString.call(path) !== '[object Array]') return;
        this.uploadImgFun(path, 0, str);
      },
      // 递归上传
      async uploadImgFun(arr, index = 0, str) {
        wx.showLoading({title: '上传中', mask: true})
        await this.uploadImg(arr[index], str)
        if (index < arr.length - 1) {
          this.uploadImgFun(arr, index + 1, str)
        }
      },
      uploadImg(path, str) {
        let v = this;
        wx.showLoading();

        return WXAJAX.UploadImage(path).then((data) => {
          wx.hideLoading();
          data = JSON.parse(data);
          if (data.code == '200') {
            if (str == 'dynamic') {
              this.dynamic_imgs.push(WXAJAX.imgBackUrl + data.data);
            } else {
              this.article_img = WXAJAX.imgBackUrl + data.data;
            }

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
      del(index) {//删除图片
        this.dynamic_imgs.splice(index, 1);
      },
      page_turn(url, query) {
        query = query || '';
        wx.navigateTo({url: '../' + url + '/main' + query});
      }
    }
  }
</script>

<style>
  .pl16_prod > div {
    padding-left: 40upx;
  }
</style>



















