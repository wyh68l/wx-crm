<template>
  <div class="h100p">

    <div class="pb70">
      <!--产品-->
      <div v-for="(v,k) in classify" :key="k" class="bgfff ">
        <div class="disflex jsbet pr11" >
                    <span class="lh44 pl15 fbold"
                          @click="manage('edit',v.name , v.goodstypeId)">
                        {{v.name}}
                        <span v-if="v.goodsModelList">({{v.goodsModelList.length}})</span>
                    </span>
          <div class="disflex align-cen">
            <span @click="showDelTip(v.goodstypeId , k)" >
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png"
                                alt="" class="w20 h20 pr16"
                                />
            </span>
            <span @click="to_up(v.goodstypeId , k)">
              <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/toup.png"
                                alt="" class="w20 h20 pl10"
                                 />
            </span>
          </div>
        </div>
      </div>
    </div>

    <!--dialog-->
    <div v-show="dialog_show">
      <DialogBox :dialog_title="dialog_title" @btn_tap="btn_tap" :dialog_ph="dialog_ph"
                 :default="classify_name"
                 :left="'取消'"
                 :right="'保存'"
      ></DialogBox>

    </div>

    <div v-if="delDialog">
      <DialogBox dialog_title="提示" @btn_tap="del_tap" dialog_ph="确定要删除该分类吗？"
                 type="hint2"
                 :left="'取消'"
                 :right="'确定'"
      ></DialogBox>
    </div>

    <!--bottom-->
    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>

  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import StaticResources from '@/components/StaticResources';
  import DialogBox from '@/components/dialogBox' // 对话框
  import WXAJAX from '@/utils/request'

  export default {
    name: '',
    components: {BottomButtonTwo,DialogBox, StaticResources},
    data() {
      return{
        classify:[],
        bottom:{
          left :{
            text : '添加分类' , url : 'add'
          },
          right : {
            text : '保存分类' , url : 'save'
          }
        },
        delDialog: false,
        dialog_show:false,
        edit_type:'add',
        dialog_title:'添加分类',
        dialog_ph:'请输入2~6字的分类名称',
        classify_name:'',
        editId:0,
        delTmp:{},
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "分类管理"
      });
      this.getInits();
    },
    async onPullDownRefresh() {
      this.getInits();

      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 1*1000)
    },
    methods: {
      getInits(){
        wx.showLoading({mask:true}) ;
        WXAJAX.POST('', '', '/goods/getGoodsTypeInfo').then((data) => {

          wx.hideLoading();
          if(data){
            this.classify = data ;
          }
        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      showDelTip(goodTypeId , index) {
        this.delTmp = { goodTypeId, index };
        this.delDialog = true;
      },
      del_tap(method) {
        if (method == 'cancel') {
          this.delDialog = false;
        }else if (method == 'save') {
          this.delDialog = false;

          this.del(this.delTmp);
        }
      },
      page_turn(url){
        if(url == 'add'){//添加
          this.manage(url);
        }else if(url == 'save'){
          wx.showToast({
            title: '成功',
            icon: 'success'
          });
          setTimeout(function () {
            wx.navigateBack();
          },500)
        }
        // wx.navigateTo({url: '../'+ url +'/main'})
      },
      btn_tap(method,text){
        if(method == 'cancel'){

          this.dialog_show = false;

        }else if(method == 'save'){
          if(!text){
            wx.showToast({
              title: this.dialog_ph,
              duration: 2000,
              icon: 'none'
            });
            return
          }

          this.dialog_show = false;

          wx.showLoading() ;
          let params = {} ;
          if(this.edit_type == 'edit'){
            params.goodstypeId = this.editId ;
          }
          params.name = text ;
          WXAJAX.POST(params, '', '/goods/addGoodsType').then((data) => {

            wx.hideLoading();
            if(data){
              wx.showToast({
                title: '成功',
                icon: 'success'
              });
              this.getInits();
            }

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
      to_up(goodstypeId ,index){
        // if(index == 0) return ;


        wx.showLoading({mask:true}) ;
        WXAJAX.POST({
          type : 1,
          goodstypeId : goodstypeId  ,
        }, '', '/goods/moveGoodsType').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success'
          });
          this.getInits();
          // this.classify.splice(index ,1) ;

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });

      },
      manage(method,name,editId){
        if(method == 'edit'){//编辑
          this.edit_type = 'edit' ;
          this.dialog_ph = '分类名称' ;
          this.dialog_title = '修改分类';
          this.classify_name = name ;
          this.dialog_show = true ;
          this.editId = editId ;
        }else{//添加 ;
          this.edit_type = 'add';
          this.dialog_ph = '请输入2~6字的分类名称';
          this.classify_name = '' ;
          this.dialog_title = '添加分类' ;
          this.dialog_show = true ;
        }
      },
      del({goodTypeId , index}){
        wx.showLoading() ;
        WXAJAX.POST({
          goodstypeId : goodTypeId ,
        }, '', '/goods/delGoodsType').then((data) => {

          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success'
          });
          this.classify.splice(index ,1) ;
          this.delTmp = {};
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
  .prod_classify{
    transition: .2s;
    overflow: hidden;
    box-sizing: border-box;
    /*height: auto;*/
  }
  .prod_classify.close{
    height: 0;
    border-color: #fff;
  }

</style>
