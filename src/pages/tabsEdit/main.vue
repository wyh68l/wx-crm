<template>
  <div class="h100p pb70">

    <!--lists-->
    <div class="pb54">
      <div class="bgfff mt10 pl17 pr15 fs16 ca8 lh44" v-for="(v,k) in lists" :key="k">

        <div class="disflex jsbet align-cen">
          <input type="text" class="lh44 h44 fs16 c38 fbold pha8"
                 placeholder="请输入标签组名" v-model="v.lableName">
          <div class="disflex">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del.png"
                 @click="del(0,k,0)"
                 alt="" class="w15 h15 enlarge-range"
            />
          </div>
        </div>

        <div v-for="(item,index) in v.list" :key="index" class="disflex jsbet">
          <input type="text" class="lh44 h44 fs16 ca8 pha8"
                 placeholder="请输入子标签名" v-model="item.lableName">
          <div class="disflex align-cen">
                    <span class="w15 h15 bradius50p label" :style="{background : item.lableColor}"
                          @click="color_show_tap(this,$event,item.id , k ,index)"></span>
            <img @click="del(1,k,index)" src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/del_2.png"
                 alt="" class="w16 h16 enlarge-range"
            />
          </div>
        </div>
        <!--添加子标签-->
        <div class="disflex jsbet" @click="add(1,k)">
          <span>添加子标签</span>
        </div>
      </div>
    </div>


    <!--choose  color-->
    <div class="posab shadow_gray  bradius5 textc choose_color disflex"
         v-if="color_modal"
         :style="{top:fix_y + 'px'}">
      <div class="bgfff color-select bradius5 pb25">
        <b @click="choose_color('#FD634E')" class="w15 h15 bradius50p bgorange"></b>
        <b @click="choose_color('#FFA133')" class="w15 h15 bradius50p bgyellow"></b>
        <b @click="choose_color('#2BCF88')" class="w15 h15 bradius50p bggreen"></b>
        <b @click="choose_color('#00a0e9')" class="w15 h15 bradius50p bgblue"></b>
        <b @click="choose_color('#566C84')" class="w15 h15 bradius50p bg55"></b>
        <b @click="choose_color('#F5F5F6')" class="w15 h15 bradius50p bgf5f6"></b>
      </div>

      <span class="triangle_border_right shadow_gray mt5">

            </span>
    </div>

    <BottomButtonTwo :left="bottom.left" :right="bottom.right" @page_turn="page_turn"></BottomButtonTwo>
    <!--bottom-->
<!--    <div class="disflex fs18 textc lh45 fix_bottom">-->
<!--      <span class="w100p ca8 bgblue cfff" @click.stop="page_turn(bottom.left.url)">{{bottom.left.text}}</span>-->
<!--    </div>-->


  </div>
</template>

<script>
  import BottomButtonTwo from '@/components/bottom_button_two' // 订单项
  import WXAJAX from '../../utils/request'
  import StaticResources from '@/components/StaticResources';

  export default {
    name: '',
    components: {BottomButtonTwo, StaticResources},
    data() {
      return {
        lists: [
        ],
        bottom: {
          left: {
            text: '添加标签组', url: 'edit'
          },
          right: {
            text: '保存', url: 'saveall'
          }
        },
        fix_y: 52,
        color_modal: false,
        choose_color_id: 0 ,
        active_id1:0,//当前选择的一级分类id
        active_id2:0//当前选择的二级分类的id
      }

    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "编辑标签组"
      });
      this.color_modal = false;
      this.inits();
    },
    methods: {
      inits(){//获取标签数据
        wx.showLoading();
        let v = this ;

        WXAJAX.POST('', '', '/companyCustomerLable/getTree').then((data) => {

          wx.hideLoading();
          if(data){
            v.lists = [] ;
            let datas = [] ;
            data.forEach(function (i1, k1 ) {
              datas.push({
                lableId: i1.lableId,
                lableName : i1.lableName ,
                list : [] ,
              });
              i1.lableResponses && i1.lableResponses.forEach(function (i2,k2) {
                datas[k1].list.push({
                  lableId: i2.lableId,
                  lableName : i2.lableName ,
                  lableColor : i2.lableColor ,
                })
              })

            });
            v.lists = datas ;
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      },
      page_turn(method) {
        if(method == 'edit'){
          this.add(0)
        }else{
          this.color_modal = false ;
          this.saveTags();
        }
      },
      saveTags(){
        wx.showLoading();

        WXAJAX.POST({
          list: this.lists,
        }, '', '/companyCustomerLable/addLableList').then(res=>{
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            duration: 2000,
            icon: 'none'
          });
          setTimeout(()=>{
            wx.navigateBack();
          }, 1*1000)
        }).catch(err=>{
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        });
      },
      color_show_tap(obj, dom, id , index1 ,index2) {
        let v = this;
        if (index2 == v.active_id2 && index1 == v.active_id1) {
          v.color_modal = !v.color_modal;
          v.fix_y = dom.pageY - 21;
          return
        }

        v.fix_y = dom.pageY - 21;
        v.color_modal = true;
        v.choose_color_id = id;
        v.active_id1 = index1 ;
        v.active_id2 = index2 ;
      },
      del(method , index1 , index2 , lableId){//删除标签
        // method ： 0 --  标签组 ， 1 -- 单个 ，
        // index1 : 一级分类的index ， index2 ： 二级分类 index
        this.color_modal = false ;
        if(method == 0){
          this.lists.splice(index1,1);
        }else if(method == 1){
          this.lists[index1].list.splice(index2,1)
        }

      },
      add(method,index1){//添加标签
        //method : 0 -- 标签组 ， 1 -- 子标签
        // index1 ： 一级分类index
        if(method == 0){
          if(this.lists.length >= 3){
            wx.showToast({
              title: '最多只能添加3组标签！',
              duration: 2000,
              icon: 'none'
            });
            return
          }

          this.lists.push(
            {
              title: '',
              list: [
                { lableName: '', lableColor: '#F5F5F6'},
                { lableName: '', lableColor: '#F5F5F6'},
              ]
            }
          )

        }else if(method == 1){
          if(this.lists[index1].list.length >= 6){
            wx.showToast({
              title: '最多只能添加6个子标签！',
              duration: 2000,
              icon: 'none'
            });
            return
          }
          let childs = this.lists[index1].list.length ;
          this.lists[index1].list.push(
            { lableName: '', collableColoror: '#F5F5F6'},
          )
        }

      },
      choose_color(color){//选择颜色
        this.color_modal = false;
        this.$set(this.lists[this.active_id1].list[this.active_id2],'lableColor' , color)
      }
    }
  }
</script>

<style>
  .enlarge-range{
    padding: 10upx;
    margin-left: 20upx;
  }
  .label{
    border: 10upx solid white;
  }
  .color-select{
    padding: 20upx 0;
    text-align: center;
  }
  .color-select > b{
    border: 40upx solid white;
    border-top-width: 20upx;
    border-bottom-width: 20upx;
  }
  .choose_color {
    width: 100upx;
    right: 170upx;
    transition: .2s;
  }

  .choose_color.w0 {
    width: 0;
    overflow: hidden;
  }

  .triangle_border_right {
    display: block;
    width: 20upx;
    height: 20upx;
    background: #fff;
    transform: rotate(45deg);
    position: absolute;
    right: -12upx;
    top: 24upx;
  }

</style>






























