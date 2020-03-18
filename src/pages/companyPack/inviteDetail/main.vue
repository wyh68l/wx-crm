<template>
    <div>
        <div class="bgfff pt15 pl15 pr15 pb15 mt10">
            <p class="disflex jsbet fs14">
                <span class="c38">{{invite.position}}</span>
                <span class="ca8 fs12">{{invite.time}}</span>
            </p>

            <div class="disflex jsbet fs12 ca8 pt13">
                <div>
                    {{invite.recruitAddress}} | {{experienceArray[invite.experience-1].title}} | {{educatArray[invite.education-1].title}}
                </div>
                <span class="cblue fs14">{{invite.minSalary}}-{{invite.maxSalary}}</span>
            </div>

        </div>

        <div class="bgfff lh25 fs16 c38 pl16 pr17">
            <text>{{invite.requirement}}</text>
        </div>

    </div>
</template>

<script>
    import WXAJAX from '../../../utils/request'
    import util from '../../../utils'

    export default {
        name: '',
        components: {},
        data() {
            return{
                recruitId:0,
                invite:{
                    experience:1,
                    education:1,
                },
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
            }
        },
        onShow() {
            wx.setNavigationBarTitle({
                title: "招聘详情"
            });
            this.recruitId = this.$root.$mp.query.recruitId || 0;
            this.getInits() ;
        },
        methods: {
            getInits(){
                let v = this ;
                wx.showLoading();
                WXAJAX.POST({
                    recruitId:this.recruitId ,
                }, '', '/company/selectCompanyRecruit').then((data) => {

                    wx.hideLoading();
                    if(data){
                        data = data[0];
                        data.maxSalary = (data.maxSalary/1000/100)+'k';
                        data.minSalary = (data.minSalary/1000/100)+'k';
                        data.time = util.getdate( data.createTime , 'dateTime') ;
                        this.invite = data ;
                    }else{
                        setTimeout(function () {
                            v.isLoading = false ;
                        },500);
                    }
                }).catch((err) => {
                    console.log(err);
                    wx.hideLoading();
                    if(err.code == 204){
                        v.nodata = true ;
                    }
                    setTimeout(function () {
                        v.isLoading = false ;
                    },500);
                });
            },
        }
    }
</script>

<style>

</style>





















