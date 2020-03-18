<template>
	<div>
		<div>
			<input class="title-input" placeholder="请输入文章标题"  v-model="title"/>
		</div>
 		<editor
			id="editors"
      class="ql-container"
      placeholder="请输入文章正文..."
      showImgSize
      showImgToolbar
      showImgResize
      :adjust-position="false"
      @input="handlerInput"
      @statuschange="onStatusChange"
      :read-only="false"
      @focus="onEditorFocus"
      @blur="isBottom = 49"
      @ready="onEditorReady">
    </editor>

		<div>
      <div class='toolbar' :style="{position: isAndroid ? 'fixed' : 'absolute', bottom: isAndroid ? '47px' : `${isBottom}px`}"  @click="format">
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
		</div>
		<BottomButtonSmall :text="'下一步'"  @btn_tap="save" />
	</div>
</template>
<script>
import BottomButtonSmall from '@/components/bottom_button_small';
import WXAJAX from '@/utils/request';
import util from '@/utils';
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {BottomButtonSmall},
	data() {
		return {
			// 多行编辑器上下文
			editorCtx: null,
			toolbars: ['bold', 'italic', 'underline', 'alignLeft','alignCenter', 'alignRight', 'alignJustify',"fontSize","checklist","orderedList", "bulletList","outdent","indent","insertDivider","insertImage","undo","redo", "clear"
			],
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
      formats: {},
			isShowEditor: true,
			initContent: '',

			title: '',
			isBottom: 49, // 距离底部高度
      isAndroid: false
		}
	},
  computed: {
    ...mapGetters(['article'])
  },
	onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        console.log(res)
        if (res.platform.toLocaleUpperCase() === 'ANDROID') {
          this.isAndroid = true
        } else {
          this.isAndroid = false
        }
      }
    })
	},
	methods: {
    ...mapActions(['setArticle']),
    // 保存文章
		save() {
      if (this.title === '') {
        uni.showToast({
          title: '文章标题不能为空',
          icon: 'none'
        })
        return
      }
      this.editorCtx.getContents({
        success: res => {
          let data = {
            details: res.html.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:block" '),
            title: this.title
          };

          this.setArticle(data)
          uni.navigateTo({
            url: `./articleImg?saveType=${1}`
          })
        }
      })
		},
		// 键盘弹出
		onEditorFocus() {
			uni.onKeyboardHeightChange(res => {
        console.log(res)
        if (this.isAndroid) {
          return
        }
				this.isBottom = res.height
			})
		},
		format(e) {
			let { name, value } = e.target.dataset
      if (!name) return
      this.editorCtx.format(name, value)
    },
    // 多行编辑器上下文获取
    onEditorReady() {
  	  uni.createSelectorQuery().in(this).select('#editors').context((res) => {
        console.log(res)
        this.editorCtx = res.context;
        this.editorCtx.setContents({
          html: this.initContent
        })
      }).exec()
  	},
  	onStatusChange(e) {
      this.formats = Object.assign({}, e.mp.detail);
    },
    // 多行编辑器输入状态
    handlerInput(e){
        if ( this.timer ) return;

        this.timer = setTimeout(()=>{
          wx.pageScrollTo({
            scrollTop: 99999,
          });
          clearInterval(this.timer);
          this.timer = null;
        }, 1.5*1000);
      },
    // 统一处理按钮事件
    toolClick(eventName){
      this[eventName]();
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({
        text: formatDate
      })
    },
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log('insert divider success')
        }
      })
    },
    async insertImage() {
      let path = await util.chooseImage('file', 9);
      if(Object.prototype.toString.call(path) !== '[object Array]') return;
      this.uploadImgFun(path)
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
    clear() {
      this.editorCtx.clear({
        success: function (res) {
          console.log("clear success")
        }
      })
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
    }
	}
}
</script>
<style>
  page{
    background: white;
  }
</style>
<style scoped>
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
  z-index: 99;
  background: white;
  border-bottom: .10upx solid #e8e8e8;
}


.ql-container {
  box-sizing: border-box;
  padding: 24upx 30upx;
  width: 100%;
  min-height: 20vh;
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
.title-input {
	padding: 30upx;
	font-weight:bold;
	font-size:36upx;
	border-bottom: 1upx solid #F5F5F6;
}
</style>
