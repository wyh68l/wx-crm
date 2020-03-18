<template>
  <div>

    <!--top-->
    <div class="disflex jsbet bgfff lh30 pl16 pr15 pt5 pb5">
      <div class="bgf5f6 bradius17 disflex pl15 flex1">

        <span></span>
        <input type="text" v-model="key" @focus="onFocus" class="pha8 fs14 lh34 h34 w100p" :placeholder="ph">

      </div>
      <span class="fs16 cblue lh34 pl15" v-if="type=='company' && showCreateCopmany">搜索</span>
      <span class="fs16 cblue lh34 pl15" v-else @click="cancle">取消</span>
    </div>

    <!--addr-->
    <div class="pl16 bgfff pt15 pb15 pr16 bbf5f6">
      <div v-if="choose.title">
        <p class="fs12 ca8">{{activeitem}}</p>
        <div class="disflex jsbet pt10">
          <span class="fs16 fbold c38">{{choose.title}}</span>
          <span class="cblue fs16" @click="getlocation" v-if="type != 'company'">{{reset}}</span>
          <span class="cblue fs16" @click="toCreateCompany" v-if="type == 'company'">{{reset}}</span>
        </div>
      </div>
      <div v-else-if="type != 'company'" class="fs12 ca8">
        还未选择
        <span class="cblue fs16"
              v-if="type == 'company'"
              @click="toCreateCompany"
              style="float: right">
          {{reset}}
        </span>
      </div>
    </div>


    <!--lists-->
    <div v-for="(list,index1) in searchCity" class="bgfff lh44 fs14 c38" :key="index1" v-if="type=='city'">
      <p class="pl16 fs12 ca8 bbf7">{{list.name}}</p>

      <div v-for="(city , index2) in list.citys" :key="index2" class="pl25">

        <p @click="choose_item(city.region_name)">{{city.region_name}}</p>

      </div>

    </div>

    <div class="bgfff lh44 fs14 c38" :key="index1" v-if="type=='company' || type == 'client'">

      <div v-for="(item , index2) in lists" :key="index2" class="pl25">
        <p @click="choose_item(item.companyName || item.name , item.companyId || item.cardId ,item.companyLogo)">{{item.companyName || item.name }}</p>
      </div>

    </div>
    <div v-if="type=='company' && showCreateCopmany" class="create-company bgfff">
      <div class="pt80 textc">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com//one-www/photo/20190520/1558319783804.png" alt="" class="w170 h170">
        <div class="create-company-prompt fs12 lh32 ca8">请在上方搜索企业加入</div>
        <div class="create-company-prompt fs12 ca8">或返回选择我是BOSS创建企业</div>
<!--        <div class="create-company-btn bradius5 cfff textc lh44 h44 w290 ml50p mt10" @click="toCreateCompany">创建企业</div>-->
      </div>
    </div>
  </div>
</template>

<script>
  import amapFile from '../../libs/amap-wx.js'
  import WXAJAX from '../../utils/request'
  import Citys from '../../libs/choose-city'

  export default {
    name: '',
    components: {},
    data() {
      return {
        showCreateCopmany: true,
        choose: {
          title: '',
          addr: '',
          lat: '',
          lng: '',
        },
        myAmapFun: '',
        Mc: '',
        lists: [],
        ph: '',
        activeitem: '当前定位',
        reset: '重新定位',
        type: '',
        key: '',
        searchLists: '',
        searchList: [],
      }
    },
    onShow() {
      let title = '';
      this.type = this.$root.$mp.query.type;

      this.key = '' ;

      this.choose = {
        title: '',
        addr: '',
        lat: '',
        lng: '',
      }

      if (this.type == 'company') {//选择企业
        title = '选择企业';
        this.ph = '输入企业名称';
        this.activeitem = '当前企业';
        this.reset = '创建企业';
        this.init();

      } else if (this.type == 'city') {
        this.ph = '输入城市名或拼音';
        this.Mc = wx.createMapContext('map');
        this.myAmapFun = new amapFile.AMapWX({key: 'e11026819b6d300fda6a2c680fbd2fef'});
        this.lists = Citys ;
        this.searchList = [];
        Citys.map(val=>{
          this.searchList.push(...val.citys);
        });

        this.getlocation();
      }else if(this.type == 'client'){
        title = '选择客户';
        this.ph = '输入客户名字';
        this.activeitem = '当前客户';
        this.init();
      }
      wx.setNavigationBarTitle({
        title: title
      });


    },
    async onPullDownRefresh() {
      if (this.type == 'company') {//选择企业
        this.init();
      }

      setTimeout(()=>{
        wx.stopPullDownRefresh();
      }, 1.5*1000)
    },
    watch: {
      'key': function (newVal, oldVal) {
        if (this.type == 'company') {
          if (newVal){
            this.showCreateCopmany = false;
            this.searchItem(newVal);
          }else{
            this.lists = [];
            this.showCreateCopmany = true;
          }
        }
        // console.log(newVal);
      }
    },
    computed:{
      searchCity() {
        if (this.type != 'city') return [];

        let result;

        if(this.key){
          let citys = this.searchList.filter(val=>{
            return val.region_name.includes(this.key);
          });
          result = [
            {
              name: '',
              citys: citys,
            }
          ];
        } else {
          result = this.lists;
        }

        return result
      },
    },
    methods: {
      onFocus() {
        // if (this.type == 'company') {
        //   this.showCreateCopmany = false;
        //   this.searchItem();
        // }
      },
      toCreateCompany(){
        wx.navigateTo({
          url: `/pages/editEnterprise/main?type=add&backNum=2`, // 跳转的目标页面
          success(res) {

          },
          fail(res) {
            console.log(res)
          }
        })
      },
      init() {//获取lists列表
        let v = this ,
          url = '/company/getCompanyAllInfo' ;

        if(this.type == 'client'){
          url = '/customer/getCustomerList';
        }

        v.lists = [];
        if(this.type == 'client'){
          WXAJAX.POST({ignore: true}, '', url).then((data) => {
            this.lists = data ;
          }).catch((err) => {

          })
        }
      },
      searchItem() {//搜索
        WXAJAX.POST({
          companyName: this.key
        }, '', '/company/getCompanyAllInfo').then((data) => {
          this.lists = data ? data : [] ;
        }).catch((err) => {

        })
      },
      getlocation() {//获取经纬度
        wx.showLoading({
          title: '定位中...',
          mask: true
        });
        var v = this;
        uni.getLocation({
          type: 'wgs84',
          success: function (res) {
            v.choose.lat = res.latitude;
            v.choose.lng = res.longitude;

            v.getLocal();
            wx.hideLoading();
          },
          fail: function (err) {
            wx.hideLoading();
            wx.showToast({
              title: JSON.stringify(err),
              icon: 'none',
              duration: 2000
            })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
      },
      getLocal(latitude, longitude) {

        let v = this;

        v.myAmapFun.getRegeo({
          location: '' + v.choose.lng + ',' + v.choose.lat + '', // location的格式为'经度,纬度'
          success: function (data) {
            let _address = data[0].regeocodeData.addressComponent,
              _neighborhood = _address.neighborhood,
              _street = _address.streetNumber;
            v.choose.title = _address.city;
            v.adcode = _address.adcode;

            if (_neighborhood && _neighborhood.name.length > 0) {
              v.choose.addr = _neighborhood.name;
            } else {
              v.choose.addr = _street.street + _street.number;
            }

          },
          fail: function (info) {
            v.choose.title = '失败';
            v.choose.addr = '重新定位';
          }
        })

      },
      choose_item(itemname , itemid ,itemlogo) {//选择
        if (this.type == 'city') {
          wx.setStorageSync("company_city", itemname);
        } else if (this.type == 'company') {
          wx.setStorageSync("choose_company", itemname);
          wx.setStorageSync("choose_company_id", itemid);
          wx.setStorageSync("choose_company_logo", itemlogo);
          wx.navigateTo({
            url: '/pages/editCard/main?type=add'
          });
          return;
        }else if(this.type == 'client'){
          wx.setStorageSync("clientName", itemname);
          wx.setStorageSync("clientId", itemid);
        }
        this.$set(this.choose, 'title', itemname);
        wx.showLoading();
        setTimeout(() => {
          wx.navigateBack();
          wx.hideLoading();
        }, 200);

      },
      cancle() {//取消
        this.showCreateCopmany = true;
        this.key = '';
        this.lists = [];
      }
    }
  }
</script>

<style>
  page {
    background: #fff;
  }
  .create-company{
    height:calc(100vh - 150upx);
  }
  .create-company>div>.create-company-btn{
    background:linear-gradient(90deg,#00a0e9,rgba(81,205,204,1));
    transform:translateX(-50%);
  }
</style>
