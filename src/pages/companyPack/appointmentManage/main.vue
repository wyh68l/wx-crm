<template>
  <div>
    <ListItem imgUrl="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/img-appointment-manage-list.png"
              @click="changePage('companyPack/appointmentList')"
              title="预约列表">
      <div slot="desc">
        <span class="fs14 ca8" >
          新增 <span style="color: #FCAD3D;">{{appointmentCount}}</span> 条预约信息
        </span>
      </div>
    </ListItem>
    <ListItem imgUrl="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/img-appointment-manage-goods.png"
              @click="changePage('companyPack/appointmentProdControl')"
              title="商品管理">
      <div slot="desc">
        <span class="fs14 ca8" >
          共 <span style="color: #2BCF88;">{{productsCount}}</span> 件预约产品
        </span>
      </div>
    </ListItem>
  </div>
</template>

<script>
  import ListItem from '@/components/ListItem' // 订单项
  import DialogBox from '@/components/dialogBox' // 对话框
  import WXAJAX from '@/utils/request'

  export default {
    name: '',
    components: {ListItem,DialogBox},
    data() {
      return{
        appointmentCount: 0,
        productsCount: 0,
      }
    },
    mounted() {
      wx.setNavigationBarTitle({
        title: "预约管理"
      });

      this.getCount();
    },
    async onPullDownRefresh() {
      await this.getCount();
      wx.stopPullDownRefresh();

    },
    methods: {
      changePage(url){
        wx.navigateTo({url: `/pages/${url}/main`});
      },
      getCount(){
        return WXAJAX.POST({
          ignore: true,
        }, '', '/products/getProductsCount').then(res=>{
          this.productsCount = res.productsCount;
          this.appointmentCount = res.appointmentCount;
        })
      },
    },
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
