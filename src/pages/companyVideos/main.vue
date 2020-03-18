<template>
    <div class="pt10 pb44">
        <div v-for="(videoItem, index) in videoLists" :key="index">
            <div class="disflex jsbet bgfff pl15 pr15 h49">
                <div class="fs16 fbold w100 textl h49 lh49">视频名称</div>
                <div class="pl15 pha8 fs14 lh49 h49 w100p c38 textr">{{videoItem.describes}}</div>
            </div>
            <div class="bgfff textc h49 lh49 fs16 cblue btf5f6 bbf5f6" @click="toEditVideo(videoItem)">替换视频内容</div>
            <div class="bgfff textc borderbox h212 overhidden">
                <video :id="'myVideo' + videoItem.videoId" class="w100p h212 disblock"
                    v-if="playIndex === videoItem.videoId"
                    :title="videoItem.describes"
                    objectFit="cover"
                    :src="videoItem.url"
                    enable-danmu
                    danmu-btn
                    controls
                    :autoplay="true">
                </video>
                <div class="w100p h212 posre" @click="showVideo(videoItem.videoId)" v-else>
                    <img mode="aspectFill" :src="videoItem.cover || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619324240.png'" alt="" class="w100p h212">
                    <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190604/1559619365051.png" alt="" class="w50 h50 posab top0 left0 right0 bottom0 mauto">
                </div>
            </div>
            <div class="disflex jsbet bffff mt20 pb20 pl15 pr15 h30 overhidden">
                <div class="w30 h30">
                    <img @click="deleteVideo(videoItem, index)" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_del_2.png" alt="" class="w30 h30">
                </div>
                <div class="w70 h30 disflex jsbet">
                    <img @click="moveVideo(videoItem, index, '1')" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_up.png" alt="" class="w30 h30">
                    <img @click="moveVideo(videoItem, index, '2')" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_down.png" alt="" class="w30 h30">
                </div>
            </div>
        </div>
        <BottomButtonSmall v-if="videoLists.length < 6" :text="'新增视频'" :url="'save'" @btn_tap="btn_tap"></BottomButtonSmall>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request'
import BottomButtonSmall from '@/components/bottom_button_small' //
export default {
    components: { BottomButtonSmall },
    data(){
        return{
            playIndex: '',
            videoLists: []
        }
    },
    onShow(){
        this.init();
    },
    mounted() {
    },
    methods: {
        showVideo(index){
            this.playIndex = index;
        },
        init(){
            wx.setNavigationBarTitle({
                title: '企业视频'
            });
            this.getCompanyVideosList();
        },
        getCompanyVideosList(){
            this.playIndex = '';
            this.$set(this, 'videoLists', []);
            let v = this;
            let params = {
                companyId: 6 // 传啥都行，不传不行
            };
            wx.showLoading();
            WXAJAX.POST(params , '', '/company/selectWebsiteInfo').then((data) => {
                wx.hideLoading();
                if (data) {
                    let videoLists = data.companyVideoModelList || [];
                    this.$set(this, 'videoLists', videoLists);
                    console.log(this.videoLists)
                } else {
                   
                }
            })
            .catch((err) => {
                wx.hideLoading();
            });
        },
        toEditVideo(videoItem){
            wx.setStorageSync('videoItem', videoItem);
            wx.navigateTo({
                url: '../editCompanyVideo/main?type=edit'
            })
        },
        btn_tap(){
            wx.navigateTo({
                url: '../editCompanyVideo/main?type=create'
            })
        },
        deleteVideo(videoItem, index){
            let v = this;
            let params = {
                videoId: videoItem.videoId
            }
            wx.showLoading();
            WXAJAX.POST(params , '', '/company/delCompanyVideo').then((data) => {
                wx.hideLoading();
                if (data) {
                    wx.showToast({
                        title: '删除成功',
                        duration: 2000,
                        icon: 'none'
                    });
                    v.videoLists.splice(index, 1);
                } else {
                   
                }
            })
            .catch((err) => {
                wx.hideLoading();
                wx.showToast({
                  title: err.message,
                  duration: 2000,
                  icon: 'none'
                });
            });
        },
        moveVideo(videoItem, index, type){ 
            let v = this;
            let params = {
                videoId: videoItem.videoId,
                type: type
            };
            wx.showLoading();
            WXAJAX.POST(params , '', '/company/moveCompanyVideo').then((data) => {
                wx.hideLoading();
                if (data) {
                    wx.showToast({
                        title: '移动成功',
                        duration: 2000,
                        icon: 'none'
                    });
                    // let videoLists = v.videoLists;
                    // let video = videoLists[index];
                    // if (type == 1) {
                    //     videoLists[index] = videoLists[index - 1];
                    //     videoLists[index - 1] = video;
                    // } else {
                    //     videoLists[index] = videoLists[index + 1];
                    //     videoLists[index + 1] = video;
                    // }
                    // // v.videoLists = videoLists;
                    // v.$set('videoLists', videoLists)
                    v.videoLists = []; // 苹果手机移动视频之后会转圈，先置空，再请求接口重新赋值，可以避免。有点粗暴，后续找其他解决方案；
                    v.getCompanyVideosList();
                } else {
                   
                }
            })
            .catch((err) => {
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
    page{
        background: #F5F5F6;
    }
</style>
