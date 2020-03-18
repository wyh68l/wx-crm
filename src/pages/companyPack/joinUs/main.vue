<template>
    <div class="pl15 pr15">

        <template v-if="lists.length">
          <div v-for="(v,k) in lists" :key="k" class="bgfff pt15 pl15 pr15 pb15 mt10 bradius5"
               @click="btn_tap('inviteDetail' , '?recruitId='+v.recruitId)">
            <p class="disflex jsbet fs14">
              <span class="c38">{{v.position}}</span>
              <span class="cblue">{{v.minSalary}}-{{v.maxSalary}}</span>
            </p>

            <div class="disflex jsbet fs12 ca8 pt13">

              <div>
                {{v.recruitAddress}} | {{experienceArray[v.experience-1].title}} | {{educatArray[v.education-1].title}}
              </div>
              <span @click.stop="del(v.recruitId  , k)">
                  <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png"
                       alt=""  class="w15 h15"
                  />
                </span>
            </div>

          </div>
        </template>
        <div v-else>
          <NoData>暂无招聘岗位</NoData>
        </div>
        <!--dialog-->
        <div v-show="dialog_show">
            <DialogBox :dialog_title="dialog_title" @btn_tap="dialog_btn_tap" :dialog_ph="dialog_ph"
                       :default="HRtel"
                       :left="'取消'"
                       :right="'保存'"
            ></DialogBox>

        </div>

        <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>
    </div>
</template>

<script>
    import BottomButtonSmall from '@/components/bottom_button_small' // 订单项
    import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
    import StaticResources from '@/components/StaticResources';
    import NoData from '@/components/noData'
    import DialogBox from '@/components/dialogBox' // 对话框
    import WXAJAX from '../../../utils/request'
    import utils from '@/utils';

    export default {
        name: '',
        components: {BottomButtonSmall,BottomButtonTwo,DialogBox,StaticResources,NoData},
        data() {
            return{
                lists:[
                  /*  {
                        title : '职位名称',
                        salary : '15K-30K' ,
                        city : '成都市',
                        year : '2-5年',
                        education : '本科'
                    },
                    {
                        title : '职位名称',
                        salary : '15K-30K' ,
                        city : '成都市',
                        year : '2-5年',
                        education : '本科'
                    },
                    {
                        title : '职位名称',
                        salary : '15K-30K' ,
                        city : '成都市',
                        year : '2-5年',
                        education : '本科'
                    },
                    {
                        title : '职位名称',
                        salary : '15K-30K' ,
                        city : '成都市',
                        year : '2-5年',
                        education : '本科'
                    }*/
                ],
                bottom: {
                    left: {
                        text: 'HR电话', url: 'tel'
                    },
                    right: {
                        text: '添加职位', url: 'inviteEdit'
                    }
                },
                dialog_show:false,
                dialog_title:'HR电话',
                dialog_ph:'HR联系电话',
                HRtel:'',
                page:1,
                isLoading : false ,//是否在加载
                nodata:false ,//是否已经没有数据
                /*学历*/
                educatArray:[
                    {title:'全部',id:1},{title:'初中及以下',id:2},{title:'中专/中技',id:3},
                    {title:'高中',id:4},{title:'大专',id:5},{title:'本科',id:6},
                    {title:'硕士',id:7},{title:'博士',id:8}
                ],
                /*经验*/
                experienceArray:[
                    {title:'应届生',id:1},{title:'1年以内',id:2},
                    {title:'1-3年',id:3},{title:'3-5年',id:4},{title:'5-10年',id:5},
                    {title:'10年以上',id:6}, {title:'全部',id:7},
                ],
                isShow:false ,
            }
        },
        mounted() {
            wx.setNavigationBarTitle({
                title: "企业招聘"
            });
            this.isShow = false ;
            this.getInits();
        },
        onShow(){
            if(!this.isShow){return}
            this.nodata = false ;
            this.lists = [] ;
            this.page = 1 ;
            this.isLoading = false ;
            this.getInits();
        },
        async onPullDownRefresh() {
            // to doing..
            // 下拉刷新
            wx.showNavigationBarLoading();
            this.nodata = false ;
            this.lists = [] ;
            this.page = 1 ;
            this.isLoading = false ;
            this.getInits();
            wx.stopPullDownRefresh();
            setTimeout(function () {
                wx.hideNavigationBarLoading();
            },300)
        },
        onReachBottom() {
            let v = this ;
            v.getInits();

        },
        methods: {
            getInits(){
                let v = this ;
                if(v.isLoading){
                    return
                }
                v.isLoading = true ;
                wx.showLoading();
                WXAJAX.POST({
                    ppageNum : this.page ,
                }, '', '/company/selectCompanyRecruit').then((data) => {

                    wx.hideLoading();

                    if(data){
                        data.forEach(function (i, k) {
                            i.maxSalary = (i.maxSalary/1000/100)+'k';
                            i.minSalary = (i.minSalary/1000/100)+'k';
                        });

                        v.lists = [...v.lists ,...data];

                        v.page ++ ;
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }else{
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }
                    this.isShow = true ;

                }).catch((err) => {
                    console.log(err);
                    wx.hideLoading();
                    this.isShow = true ;
                    if(err.code == 204){
                        v.nodata = true ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);
                });
            },
            btn_tap(url , query){
                query = query || '' ;
                wx.navigateTo({url:'../'+url+'/main' + query});
            },
            page_turn(method) {
                if(method == 'tel'){
                    this.dialog_show = !this.dialog_show ;
                }else if(method == 'inviteEdit'){
                    this.btn_tap(method , '?type=edit');
                }
            },
            dialog_btn_tap(method,text){
                if(method == 'cancel'){

                    this.dialog_show = false;

                }else if(method == 'save'){
                    if(!text){
                        wx.showToast({
                            title: '请输入HR电话',
                            icon: 'none'
                        });
                        return
                    }
                    if(!utils.checkPhone(text.trim())){
                      wx.showToast({
                        title: '请输入正确的电话',
                        icon: 'none'
                      });
                      return
                    }

                    this.dialog_show = false ;
                    wx.showLoading();
                    WXAJAX.POST({
                        recruitPhone   : text  ,
                    }, '', '/company/addHrPhone').then((data) => {

                        wx.hideLoading();
                        wx.showToast({
                            title: '成功',
                            icon: 'success'
                        });
                    }).catch((err) => {
                        console.log(err);
                        wx.hideLoading();
                        wx.showToast({
                          title: err.message,
                          duration: 2000,
                          icon: 'none'
                        });
                    });
                }
            },
            del(recruitId ,index){
                wx.showLoading();
                WXAJAX.POST({
                    recruitId  : recruitId  ,
                }, '', '/company/delCompanyRecruit').then((data) => {

                    wx.hideLoading();
                    this.lists.splice(index ,1);
                    wx.showToast({
                        title: '成功',
                        icon: 'success'
                    });
                }).catch((err) => {
                    console.log(err);
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
    height: auto;
  }
</style>

