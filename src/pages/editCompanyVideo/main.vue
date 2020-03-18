<template>
    <div>
        <div>
            <div class="disflex jsbet bgfff pl15 pr15 h49">
                <div class="fs16 fbold w100 textl h49 lh49">视频名称</div>
                <input type="text" v-model="videoItem.describes" class="pl15 pha8 fs14 lh49 h49 w100p c38 textr" placeholder="请输入视频名称">
            </div>
            <div class="disflex jsbet" v-if="videoItem.url == ''">
                <div class="bgfff textc h49 lh49 fs16 cblue btf5f6 bbf5f6 flex1" @click="showChooseType">添加视频内容</div>
            </div>
            <div class="disflex jsbet" v-else>
                <div class="bgfff textc h49 lh49 fs16 cblue btf5f6 bbf5f6 flex1" @click="showChooseType">变更视频内容</div>
                <div class="bgfff textc h49 lh49 fs16 cblue btf5f6 bbf5f6 flex1" @click="setCover">设置封面</div>
            </div>
            <div class="bgfff textc pt25 borderbox">
                <div v-if="videoItem.url != ''">
                    <video :id="'myVideo'" class="bradius5 w100p h212 disblock"
                        v-if="playVideo"
                        :title="videoItem.describes"
                        :src="videoItem.url"
                        objectFit="cover"
                        :poster="videoItem.cover"
                        enable-danmu
                        danmu-btn
                        controls
                        :autoplay="true">
                    </video>
                    <div v-else class="w100p h212 posre" @click="showVideo()">
                        <img :src="videoItem.cover || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619324240.png'" mode="aspectFill" alt="" class="w100p h212">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619365051.png" alt="" class="w50 h50 posab top0 left0 right0 bottom0 mauto">
                    </div>
                </div>
                <img v-else src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190522/1558493217500.png" alt="" mode="aspectFill" class="w100 h100">
                <div class="mt20 fs14 lh15 ca8 pb20">因小程序不能截取视频封面，请单独上传视频封面</div>
            </div>
        </div>
        <div v-if="chooseTypeShow">
            <SelectorOne
                :title="'选择添加方式'"
                :status="chooseTypeShow"
                :allClass="uploadVideoTypes"
                :choose_id="uploadVideoType"
                @closeModal="chooseTypeShow=false"
                @choose_tap="choose">
            </SelectorOne>
        </div>
        <div v-show="dialog_show">
            <DialogBox :dialog_title="dialog_title" @btn_tap="dialog_tap" :dialog_ph="dialog_ph"
                        :default="dialog_value"
                        :left="'取消'"
                        :right="'保存'"
            ></DialogBox>
        </div>
        <BottomButtonSmall :text="'保存'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>
    </div>
</template>
<script>
import SelectorOne from '@/components/selectorOne' 
import DialogBox from '@/components/dialogBox'
import WXAJAX from '@/utils/request'
import BottomButtonSmall from '@/components/bottom_button_small' //
import util from '../../utils/index'
export default {
    components: { DialogBox, SelectorOne, BottomButtonSmall },
    data(){
        return{
            playVideo: false,
            type: '',
            dialog_show: false,
            dialog_title: '标题',
            dialog_ph: '请输入视频链接',
            dialog_value: '',
            chooseTypeShow: false,
            uploadVideoType: 0,
            uploadVideoTypes: [
                {name: '添加链接', id: 1},
                {name: '本地视频', id: 2}
            ],
            videoItem: {
                describes: '',
                url: '',
                cover: ''
            }
        }
    },
    onShow(){
    },
    mounted() {
        this.init();
    },
    methods: {
        showVideo(){
            this.playVideo = true;
        },
        init(){
            wx.setNavigationBarTitle({
                title: '企业视频'
            });
            this.playVideo = false;
            let type = this.$root.$mp.query.type;
            if (type === 'edit') {
                let videoItem = wx.getStorageSync('videoItem');
                if (!videoItem.cover) {
                    videoItem.cover = ''
                };
                this.videoItem = videoItem ;
            } else {
                this.videoItem = {
                    describes: '',
                    url: '',
                    cover: ''
                };
            }
        },
        setCover(){
            let v = this;
            wx.showLoading();
            wx.chooseImage({
                count: 1,
                sourceType: ['album', 'camera'],
                success(res) {
                    WXAJAX.UploadImage(res.tempFilePaths[0])
                    .then(data => {
                        wx.hideLoading();
                        console.log('图片上传成功', data)
                        data = JSON.parse(data);
                        if(data.code == 200){
                            let cover = WXAJAX.imgBackUrl + data.data + '.primary.png';
                            v.videoItem.cover = cover;
                        }
                    })
                    .catch((err) => {
                        wx.hideLoading();
                        console.log(err)
                        wx.showToast({
                            title: '服务器繁忙',
                            duration: 2000,
                            icon: 'none'
                        })
                    })
                },
                fail(err) {
                    wx.hideLoading();
                }
            })
        },
        choose(id, name){
            this.chooseTypeShow = false;
            if (id == 1) {
                this.dialog_show = true;
            }
            if (id == 2) {
                util.chooseVideo().then(res => {
                  wx.showLoading({
                  title: '上传中',
                    mask: true
                  });
                  WXAJAX.UploadImage(res.tempFilePath)
                  .then(data => {
                      wx.hideLoading();
                      data = JSON.parse(data);
                      if(data.code == 200 ){
                          let url = WXAJAX.imgBackUrl + data.data;
                          this.videoItem.url = url;
                      } else {
                        wx.showToast({
                          title: '上传失败，文件过大',
                          icon: 'none'
                        })
                      }
                  })
                  .catch((err) => {
                      wx.hideLoading();
                      wx.showToast({
                          title: '服务器繁忙',
                          duration: 2000,
                          icon: 'none'
                      })
                  })
                }).catch(err => {
                  wx.showToast({
                    title: err,
                    duration: 2000,
                    icon: 'none'
                  })
                })
            }
        },
        showChooseType(){
            this.chooseTypeShow = true;
        },
        dialog_tap(str, dialog_value) {
            if (str == 'save') {
                this.videoItem.url = dialog_value
            }
            this.dialog_show = false;
        },
        btn_tap() { // 保存视频
            if (!this.videoItem.describes.trim()) {
                wx.showToast({
                    title: '请输入标题',
                    duration: 2000,
                    icon: 'none'
                });
                return ;
            }
            if (!this.videoItem.url.trim()) {
                wx.showToast({
                    title: '请添加视频',
                    duration: 2000,
                    icon: 'none'
                });
                return ;
            }
            wx.showLoading();
            let params = this.videoItem;
            WXAJAX.POST(params , '', '/company/insertCompanyVideo').then((data) => {
                wx.hideLoading();
                if (data) {
                    wx.showToast({
                        title: '添加/编辑视频成功！',
                        duration: 1000,
                        icon: 'none'
                    });
                    wx.navigateBack();
                } else {
                    wx.showToast({
                        title: '添加/编辑视频失败！',
                        duration: 2000,
                        icon: 'none'
                    });
                }
            })
            .catch((err) => {
                wx.hideLoading();
            });
        }
    }
}
</script>
<style>
    page{
        background: #F5F5F6;
    }
</style>
