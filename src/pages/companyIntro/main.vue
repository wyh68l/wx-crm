<template>
  <div class="">
    <RichEditor :toolbars="toolbars"
                ref="rich"
                v-if="isShowEditor"
                :initContent="richText"/>
    <div class="minh45"></div>
    <BottomButtonSmall :text="'保存'" :url="'confirm'" @btn_tap="save"></BottomButtonSmall>
  </div>
</template>

<script>
  import BottomButtonSmall from '@/components/bottom_button_small' //
  import Edit_operator from '@/components/edit_operator' //
  import StaticResources from '@/components/StaticResources';
  import RichEditor from '@/components/RichEditor';

  import util from '../../utils/index'
  import WXAJAX from '@/utils/request'


  export default {
    name: '',
    components: {BottomButtonSmall, Edit_operator, StaticResources, RichEditor},
    data() {
      return {
        type : '' ,
        title : {
          'prod' : '产品介绍' ,
          'companyIntroduce' : '企业介绍' ,
          'goodsIntroduce' : '产品介绍',
          'article' : '文章详情'
        },
        websiteId:0 ,
        imgBackUrl: WXAJAX.imgBackUrl,
        toolbars: ['bold', 'italic', 'underline', 'alignLeft',
          'alignCenter', 'alignRight', 'alignJustify',
          "fontSize","checklist","orderedList",
          "bulletList","outdent","indent","insertDivider","insertImage","undo","redo", "clear"],
        richText: '',
        isShowEditor: false,
      }
    },
    mounted() {
      this.richText = wx.getStorageSync('editOperator');
      this.type = this.$root.$mp.query.type || '' ;
      this.websiteId = wx.getStorageSync('websiteId') || 0 ;
      wx.setNavigationBarTitle({
        title: this.title[this.type]
      });

      this.$nextTick(()=>{
        this.isShowEditor = true;
      })
    },
    onUnload(){
      this.isShowEditor = false;
    },
    methods: {
      async save() {
        let result = await this.$refs.rich.getContents();
        result = result.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block" ');

        if(this.type == 'prod' || this.type == 'article'){
          wx.setStorageSync('editOperator' , result ) ;
          wx.showLoading();
          setTimeout(function () {
            wx.hideLoading();
            wx.navigateBack();
          },600) ;
        }else {
          wx.showLoading() ;
          let params = {} ;

          params[this.type] = result ;
          params.websiteId = this.websiteId ;
          WXAJAX.POST(params , '', '/company/addWebsiteInfo').then((data) => {

            wx.hideLoading();
            if(data){
              wx.showToast({
                title: '成功！',
                icon: 'success'
              });
              setTimeout(function () {
                wx.navigateBack() ;
              },500)
            }

          }).catch((err) => {
            wx.hideLoading();
            console.log(err)
            wx.showToast({
              title: err.message,
              duration: 2000,
              icon: 'none'
            });
          });
        }
      },
    }
  }
</script>

<style>

</style>

