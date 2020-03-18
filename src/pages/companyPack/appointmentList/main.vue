<template>
  <div>
    <div class="conditions shadow_gray">
      <picker :range="typeLists"
              range-key="productsTypeName"
              @change="chooseCondition($event, 'conditionTypeIdx')">
        {{typeLists[conditionTypeIdx].productsTypeName}}
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon-arrow-blue.png" alt="" class="w10 h10">
      </picker>
      <picker :range="stateLists"
              range-key="label"
              @change="chooseCondition($event, 'conditionStateIdx')">
        {{stateLists[conditionStateIdx].label}}
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon-arrow-blue.png" alt="" class="w10 h10">
      </picker>
      <picker mode="date"
              @change="chooseCondition($event, 'conditionTime')">
        {{conditionTime}}
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/icon-arrow-blue.png" alt="" class="w10 h10">
      </picker>
    </div>
    <div class="pl15 pr15" v-if="lists.length">
      <OrderItem v-for="item in lists"
                 :key="item.appointmentId"
                 :orderInfo="item"
                 @confirmUse="showTips(item, 'use')"
                 @cancelOrder="showTips(item, 'cancel')"
      />
      <div class="textc lh42 fs12 ca8 bgf5f6" v-if="nodata">- 汉全科技集团出品 -</div>
    </div>
    <NoData v-else>暂无预约</NoData>

    <div v-if="isShowCancelOrderBox">
      <DialogBox :dialog_title="'提示'" @btn_tap="dialogTap" :dialog_ph="tipsTitle"
                 :type="dialogType"
                 :left="'取消'"
                 :right="'确定'"
      ></DialogBox>
    </div>
  </div>
</template>

<script>
  import OrderItem from './components/OrderItem' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import NoData from '@/components/noData'
  import WXAJAX from '@/utils/request'

  export default {
    name: '',
    components: {OrderItem,DialogBox,NoData},
    data() {
      return{
        pageNum: 1,
        lists: [],
        isLoading: false,
        nodata: false,
        isShowCancelOrderBox: false,
        currentOrder: {},
        tipsTitle: '',
        dialogType: 'hint2',  // 弹框类型
        currentOperationType: '',
        stateLists: [
          { id:1,  label: "待确认"},
          { id:2,  label: "已确认"},
          { id:3,  label: "已完成"},
          { id:4,  label: "已取消"},
          { id:5,  label: "已过期"},
        ],
        typeLists: [{productsTypeName: '全部', productsId: ''}],
        conditionTypeIdx: 0,
        conditionStateIdx: 0,
        conditionTime: '',
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "预约列表"
      });

      this.conditionTime = this.formatDate('yyyy-MM-dd', Date.now());
    },
    onShow(){
      this.reset();
      this.getTypes();
      this.getList();
    },
    onUnload(){
      this.conditionTypeIdx = 0;
      this.conditionStateIdx = 0;
      this.conditionTime = this.formatDate('yyyy-MM-dd', Date.now());
    },
    async onPullDownRefresh() {
      this.reset();
      this.getTypes();
      await this.getList();

      wx.stopPullDownRefresh();
    },
    onReachBottom(){
      this.getList();
    },
    methods: {
      chooseCondition(e, key){
        this.$set(this, key, e.mp.detail.value);

        this.reset();
        this.getList();
      },
      // 获取预约分类
      getTypes(){
        WXAJAX.POST({
          ignore: true
        }, '', '/products/selectProductsTypeList').then(res=>{
          this.typeLists = [{productsTypeName: '全部', productsId: ''},...res];
        }).catch(()=>{
          this.typeLists = [{productsTypeName: '全部', productsId: ''}];
        });
      },
      showTips(orderInfo, type){
        if (type === 'cancel') {
          this.tipsTitle = '请输入取消原因';
          this.dialogType = 'input_1';
        } else {
          this.tipsTitle = '是否确认接受该预约订单？';
          this.dialogType = 'hint2';
        }

        this.currentOperationType = type;
        this.currentOrder = orderInfo;
        this.isShowCancelOrderBox = true;
      },
      dialogTap(method, remark){
        if (method === 'cancel') {
          this.isShowCancelOrderBox = false;
        }else{
          this.changeOrder(this.currentOperationType, remark);
        }
      },
      changeOrder(type,remark='') {//订单操作
        let _url = '/products/updAppointmentState';
        let params = {
          appointmentId: this.currentOrder.appointmentId,
        };
        switch (type) {
          case 'cancel' :// 取消订单
            params.state = 4;
            params.applyRemark = remark;
            break;
          case 'use' :// 确认订单
            params.state = 2;
            break;
        }
        wx.showLoading({mask: true});
        let v = this;
        WXAJAX.POST(params, '', _url).then((data) => {
          this.isShowCancelOrderBox = false;
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: '操作成功！',
              icon: 'success',
              duration: 1000,
            });

            setTimeout(function () {
              v.reset();
              v.inits();
            }, 800)
          }
        }).catch((err) => {
          wx.hideLoading();
          console.log(err)
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: 'none'
          });
        })
      },
      getList(){
        if (this.isLoading) return ;

        wx.showLoading({mask: true});

        this.isLoading = true;
        return WXAJAX.POST({
          pageNum: this.pageNum,
          state: this.stateLists[this.conditionStateIdx].id,
          productsTypeId: this.typeLists[this.conditionTypeIdx].productsTypeId,
          appointmentTime: this.conditionTime,
        }, '', '/products/selectAppointmentPage').then(res=>{
          this.isLoading = false;
          wx.hideLoading();
          if(res){
            let _datas = [];
            res.pageInfo.list.forEach(i => {
              let price;

              try{
                price = JSON.parse(i.price);
              }catch (e) {
                price = parseInt(i.price) || 0;
              }

              if (Object.prototype.toString.call(price).toLowerCase() === '[object number]') {
                i.price = price.toFixed(2);
              }else {
                i.price = price.map(val=>parseInt(val)).join('~');
              }

              i.typeName = i.serviceType == '1' ? '到店' : '上门';
              i.appointmentTime = `${this.formatDate('yyyy-MM-dd hh:mm',i.startTime)} - ${this.formatDate('hh:mm', i.endTime)}`;
              i.createTime = this.formatDate('yyyy-MM-dd hh:mm',i.createTime);
              i.cancellationTime = this.formatDate('yyyy-MM-dd hh:mm',i.cancellationTime);
              i.completionTime = this.formatDate('yyyy-MM-dd hh:mm',i.completionTime);

              _datas.push(i);

            });

            this.lists = [...this.lists, ..._datas];
            this.pageNum++;
          }else{
            this.nodata = true;
          }
        }).catch(()=>{
          this.isLoading = false;
          wx.hideLoading();
        });
      },
      reset(){
        this.pageNum = 1;
        this.lists = [];
        this.nodata = false;
        this.isLoading = false;
      },
    }
  }
</script>

<style>
  .conditions{
    display: flex;
    justify-content: space-between;
    padding: 30upx 40upx;
    font-size: 32upx;
    color: #51CBCD;
    background: white;
    position: sticky;
    top: 0;
  }
</style>
