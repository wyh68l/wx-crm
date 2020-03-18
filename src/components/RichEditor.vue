<template>
  <div class="page-body">
    <div class='wrapper'>
      <div class='toolbar' :style="toolBarStyleText" @tap="format">
        <span v-for="(tool, idx) in toolbars" :key="idx">
          <template v-if="toolbarMap[tool].type === 'event'">
            <i class="iconfont"
               :class="toolbarMap[tool].icon"
               @tap.stop="toolClick(toolbarMap[tool].eventName)"
            >
            </i>
          </template>
          <i class="iconfont"
             v-else
             :class="toolbarMap[tool].icon + ' '
                    + (toolbarMap[tool].key
                      ? (formats[toolbarMap[tool].key] === toolbarMap[tool].value ? 'ql-active' :'')
                       : '')
              "
             :data-name="toolbarMap[tool].name"
             :data-value="toolbarMap[tool].value"
          >
          </i>
        </span>

      </div>

      <editor id="editor"
              class="ql-container"
              :placeholder="placeholder"
              showImgSize
              showImgToolbar
              showImgResize
              @input="handlerInput"
              @statuschange="onStatusChange"
              :read-only="readOnly"
              @ready="onEditorReady">
      </editor>

    </div>
  </div>
</template>

<script>
  import WXAJAX from '@/utils/request'
  import util from '@/utils'

  export default {
    name: "RichEditor",
    props:{
      // 显示的toolbar按钮
      toolbars:{
        type: Array,
        default(){ return [] },
      },
      toolBarStyleText:{
        type: String,
        default: '',
      },
      // 初始文本内容
      initContent:{
        type: String,
        default: '',
      },
      readOnly: {
        type: Boolean,
        default: false,
      }
    },
    data(){
      return {
        formats: {},
        bottom: 0,
        placeholder: '开始输入...',
        editorCtx: null,
        toolbarMap:{
          bold: { icon: 'icon-zitijiacu', key: 'bold', name: 'bold', value: 'strong' },
          italic: { icon: 'icon-zitixieti', key: 'italic', name: 'italic', value: 'em' },
          underline: { icon: 'icon-zitixiahuaxian', key: 'underline', name: 'underline', value: true },
          strike: { icon: 'icon-zitishanchuxian', key: 'strike', name: 'strike', value: 'del' },
          alignLeft: { icon: 'icon-zuoduiqi', key: 'align', name: 'align', value: 'left' },
          alignCenter: { icon: 'icon-juzhongduiqi', key: 'align', name: 'align', value: 'center' },
          alignRight: { icon: 'icon-youduiqi', key: 'align', name: 'align', value: 'right' },
          alignJustify: { icon: 'icon-zuoyouduiqi', key: 'align', name: 'align', value: 'justify' },
          lineHeight: { icon: 'icon-line-height', key: 'lineHeight', name: 'lineHeight', value: '2' },
          letterSpacing: { icon: 'icon-Character-Spacing', key: 'letterSpacing', name: 'letterSpacing', value: '2em' },
          marginTop: { icon: 'icon-722bianjiqi_duanqianju', key: 'marginTop', name: 'marginTop', value: '40upx' },
          marginBottom: { icon: 'icon-723bianjiqi_duanhouju', key: 'marginBottom', name: 'marginBottom', value: '40upx' },
          clearedformat: { icon: 'icon-clearedformat', type: 'event', eventName: 'clearedformat' },
          fontFamily: { icon: 'icon-font', key: 'fontFamily', name: 'fontFamily', value: 'Pacifico' },
          fontSize: { icon: 'icon-fontsize', key: 'fontSize', name: 'fontSize', value: '48upx' },
          color: { icon: 'icon-text_color', key: 'color', name: 'color', value: '#0000ff' },
          backgroundColor: { icon: 'icon-fontbgcolor', key: 'backgroundColor', name: 'backgroundColor', value: '#00ff00' },
          insertDate: { icon: 'icon-date', type: 'event', eventName: 'insertDate' },
          checklist: { icon: 'icon--checklist', key: 'list', name: 'list', value: 'check' },
          orderedList: { icon: 'icon-youxupailie', key: 'list', name: 'list', value: 'ordered' },
          bulletList: { icon: 'icon-wuxupailie', key: 'list', name: 'list', value: 'bullet' },
          undo: { icon: 'icon-undo', type: 'event', eventName: 'undo'},
          redo: { icon: 'icon-redo', type: 'event', eventName: 'redo'},
          outdent: { icon: 'icon-outdent', key: '', name: 'indent', value: '-1' },
          indent: { icon: 'icon-indent', key: '', name: 'indent', value: '+1' },
          insertDivider: { icon: 'icon-fengexian', type: 'event', eventName: 'insertDivider'},
          insertImage: { icon: 'icon-charutupian', type: 'event', eventName: 'insertImage'},
          header: { icon: 'icon-format-header-1', key: 'header', name: 'header', value: '1' },
          scriptSub: { icon: 'icon-zitixiabiao', key: 'script', name: 'script', value: 'sub' },
          scriptSuper: { icon: 'icon-zitishangbiao', key: 'script', name: 'script', value: 'super' },
          clear: { icon: 'icon-shanchu', type: 'event', eventName: 'clear'},
        },
        timer: null,
      }
    },
    mounted(){
      // this.getEditCtx();
    },
    methods:{
      // 统一处理按钮事件
      toolClick(eventName){
        this[eventName]();
      },
      handlerInput(e){
        console.log(e);
        if ( this.timer ) return;

        this.timer = setTimeout(()=>{
          wx.pageScrollTo({
            scrollTop: 99999,
          });
          clearInterval(this.timer);
          this.timer = null;
        }, 1.5*1000);
      },
      onEditorReady (e) {
        wx.createSelectorQuery().in(this).select('#editor').context((res) => {
          this.editorCtx = res.context;
          this.editorCtx.setContents({
            html: this.initContent
          })
        }).exec()

      },
      // getEditCtx(){
      //   setTimeout(()=>{
      //     wx.createSelectorQuery().select('#editor').context((res) => {
      //       console.log('-----------editor',res);
      //       if (res && res.context) {
      //         this.editorCtx = res.context;
      //         this.onEditorReady();
      //       }else{
      //         this.getEditCtx();
      //       }
      //     }).exec()
      //   }, .2*1000)
      // },
      undo() {
        this.editorCtx.undo()
      },
      redo() {
        this.editorCtx.redo()
      },
      format(e) {
        let { name, value } = e.target.dataset
        if (!name) return
        this.editorCtx.format(name, value)

      },
      onStatusChange(e) {
        const formats = e.mp.detail;
        this.formats = Object.assign({}, formats);
      },
      insertDivider() {
        this.editorCtx.insertDivider({
          success: function () {
            console.log('insert divider success')
          }
        })
      },
      clear() {
        this.editorCtx.clear({
          success: function (res) {
            console.log("clear success")
          }
        })
      },
      removeFormat() {
        this.editorCtx.removeFormat()
      },
      insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
          text: formatDate
        })
      },
      async insertImage() {
        let path = await util.chooseImage('file', 9);

        if(Object.prototype.toString.call(path) !== '[object Array]') return;

        this.uploadImgFun(path)
        /**let url = await this.uploadImg(path[0]);

        if (!url) return;

        this.editorCtx.insertImage({
          src: url,
          success: function () {
            console.log('insert image success')
          },
          fail(err){
            console.log(err);
          }
        })**/
      },
      // 递归上传
      async uploadImgFun(arr, index = 0) {
        let url = await this.uploadImg(arr[index])
        if (!url) return;

        this.editorCtx.insertImage({
          src: url,
          success: function () {
            console.log('insert image success')
          },
          fail(err){
            console.log(err);
          }
        })
        if (index < arr.length - 1) {
          this.uploadImgFun(arr, index + 1)
        }
      },
      uploadImg(path) {
        wx.showLoading({
          mask:true,
          title: '上传中',
        });
        return new Promise(resolve => {
          WXAJAX.UploadImage(path).then((data) => {
            wx.hideLoading();
            data = JSON.parse(data);
            if (data.code == '200') {
              resolve(WXAJAX.imgBackUrl + data.data + '.primary.png');
            } else {
              wx.showToast({
                title: '网络异常',
                duration: 2000,
                icon: 'none'
              })
            }
          }).catch(()=>{
            wx.hideLoading();
          }).then(url=>url)
        })
      },
      getContents(){  // 获取内容

        return new Promise((resolve,reject) => {
          this.editorCtx.getContents({
            success(res){
              resolve(res.html);
            },
            fail(res){
              reject(res);
          }
          })
        })
      },
    }
  }
</script>

<style>
  page{
    background: white;
  }
</style>
<style scoped>
  .wrapper {
    padding: 10upx;
  }

  .iconfont {
    display: inline-block;
    padding: 16upx 16upx;
    width: 48upx;
    height: 48upx;
    cursor: pointer;
    font-size: 40upx;
  }

  .toolbar {
    box-sizing: border-box;
    /* border: 2upx solid #ccc; */
    border-bottom: 0;
    font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
    position: sticky;
    top: 0;
    z-index: 99;
    background: white;
    border-bottom: .10upx solid #e8e8e8;
  }


  .ql-container {
    box-sizing: border-box;
    padding: 24upx 30upx;
    width: 100%;
    min-height: 30vh;
    height: auto;
    /* border-top: 2upx solid #ccc;
    border-bottom: 2upx solid #ccc; */
    background: #fff;
    margin-top: 40upx;
    font-size: 32upx;
    line-height: 1.5;
  }

  .ql-active {
    color: #06c;
  }

</style>
