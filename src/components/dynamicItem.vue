<template>
    <div class="disflex jsbet bgfff pt20 pl15 pr16 pb15 bbf5f6">
        <img :src="dynamic_item.companyLogo || 'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card1_logo.png'" alt=""
             mode="aspectFill"
             class="w50 h50 bradius5 mr8" />
        <div class="flex1">
            <p class="disflex cdeepblue fs16 jsbet lh27">
                <span class="fbold w250 over_1">{{dynamic_item.companyName}}</span>
                <!--<span class="fs12">转发</span>-->
                <button class='bgfff fs12 cdeepblue p0' open-type="share" hover-class="other-button-hover">
                    <!--转发-->
                    <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/share.png" alt="" class="w16 h16" />
                </button>
            </p>

            <div v-if="dynamic_item.type == 1">
                <p class="fs16 c38">{{dynamic_item.details}}</p>
                <div class="disflex jsbet pt15">
                    <img :src="v" alt=""
                         class="w93 h93"
                         mode="aspectFill"
                         v-for="(v,k) in dynamic_item.photos"
                         :key="k"
                         @click.stop="previewImage(v)">
                </div>
                <div class="disflex jsbet pt15 pb15 posre">
                    <span class="c80 fs12">{{dynamic_item.createTime}}</span>
                    <span class="w34 h22 bradius5 textc point_two bgf5f6" @click.stop="operate_tap(index1)"></span>
                    <div class="posab  dynamic_operate" :class="dynamic_item.operate_show ? '' : 'w0' ">
                        <div class="w178 bg38 pl25 pr28 disflex jsbet">
                            <div class=" disflex align-cen" @click.stop="zan(index1 , dynamic_item.isThumbs)">
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/zan_fff.png" alt="" class="w20 h20" />
                                <span class="fs14 cfff pl8">{{dynamic_item.isThumbs == 1 ?'已赞':'赞'}}</span>
                            </div>
                            <div class="disflex align-cen" @click.stop="addComment(index1)">
                                <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/talk.png" alt="" class="w20 h20"/>
                                <span class="fs14 cfff pl8">评论</span>
                            </div>

                        </div>
                        <span class="triangle_border_right"></span>
                    </div>
                </div>

                <div class="bgf5f6 pl10 pr10 fbold pt9 pb9 cdeepblue fs16"  v-if="dynamic_item.doThumbsNum > 0">
                    <div class="dynamic_likes ">
                        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/zan.png" alt="" class="w20 h20 mr8 posre top4" />
                        <span v-for="(like_item,k2) in dynamic_item.doThumbsName" :key="k2"
                              class="like_name  posre">{{like_item}}</span>
                    </div>
                   <!-- <p v-for="(comment_item,k3) in dynamic_item.comment" :key="k3" class="cdeepblue pt9">
                        <span class="fbold">{{comment_item.name}}</span>
                        <span class="c38">：{{comment_item.text}}</span>
                    </p>-->
                </div>
            </div>

            <div class="bgf5f6 pt10 pb10 pl10 pr15 disflex jsbet align-cen"
                 v-if="dynamic_item.type == 2"
                @click="toDetail">
                <img :src="dynamic_item.photos[0]" alt="" class="w50 h50 mr8" mode="aspectFill">
                <p class="fs14 c38 w200 over_1">{{dynamic_item.title}}</p>
            </div>

        </div>
    </div>
</template>

<script>
  import StaticResources from '@/components/StaticResources';

    export default {
        name: "dynamicItem",
        props:['dynamic_item','index1'],
      components:{StaticResources},
        methods:{
            dynamic_detail(id){
                this.$emit('dynamic_detail',id);
            },
            operate_tap(index1){
                this.$emit('operate_tap',index1)
            },
            addComment(index1){
                // this.$emit('addComment' , index1 );
            },
            zan(index1 , isThumbs){//点赞
                this.$emit('zan',index1,isThumbs , this.dynamic_item.dynamicId);
            },
            previewImage(src){
                // this.$emit('previewImage');
                wx.previewImage({
                    current: src,
                    urls: this.dynamic_item.photos
                    // urls必须是数组 不然会报错
                })
            },
            toDetail(){//查看文章详情
                let url = '../dynamicDetail/main?dynamicId=' + this.dynamic_item.dynamicId;
                wx.navigateTo({url: url})
            }

        }
    }
</script>

<style>
    .dynamic_operate {
        width: 188px;
        top: 0;
        bottom: 0;
        right: 104upx;
        margin: auto;
        transition: .2s;
        overflow: hidden;
    }

    .dynamic_operate > div {
        border-radius: 10upx;
        line-height: 40px;
        height: 40px;
        box-sizing: border-box;
    }

    .dynamic_operate.w0 {
        width: 0;
        padding: 0;
        overflow: hidden;
    }

    .triangle_border_right {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-width: 20upx 0 20upx 20upx;
        border-style: solid;
        border-color: transparent transparent transparent #383838; /*透明 透明 透明 黄*/
        top: -10upx;
        bottom: 0;
        right: 4upx;
        margin: auto;
        transition: .2s;
    }
    .w0 .triangle_border_right{
        border: 0;
    }
    .dynamic_likes .like_name::after{
        content: '，';
    }
    .dynamic_likes .like_name:last-child::after{
        content: '';
    }
</style>
