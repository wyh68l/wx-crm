<template>
  <div class="trans2 h100p borderbox saleRanking" :style="{paddingTop:pt+'px'}">

    <!--选择-->
    <div class="saleRanking_top w100p bgf5f6 pb5">
      <!--type1-->
      <div class="disflex jsaround fs14 ca8 lh26 bgfff pt15">
            <div :class="type1_id == v.id ? 'bblue cblue bradius3' : '' "
                  v-for="(v,k) in type_text"
                  :key="k"
                  class="borderbox pl11 pr11 bfff"
                  @click="type_tap(1,v.id)">{{v.name}}</div>
      </div>
      <!--type2-->
      <div class="disflex pl14 fs12  ca8 pt16 bgfff" v-if="type_text[type1_id].child">
            <div v-for="(v,k) in type_text[type1_id].child"
                  class="pr27"
                  :key="k"
                  @click="type_tap(2,v.id)"
                  :class="type2_id == v.id ? 'cblue' : '' ">{{v.name}}</div>
      </div>
      <!--type3-->
      <div class="disflex pl14 fs12  ca8 pb15 pt20 bgfff" v-show="type1_id != 0 && type1_id!=3">
                <div v-for="(v,k) in type_time"
                      :key="k"
                      class="pr25"
                      @click="type_tap(3,v.id)"
                      :class="type3_id == v.id ? 'cblue' : '' ">{{v.name}}</div>
      </div>


      <!--排名-->
      <div class="disflex jsbet pl16 pr15 pt15 pb15 bgfff fs16 lh50">
        <div class="disflex">
          <span class="corange fs18 fbold pr15">{{myRanking.sort}}</span>
          <img :src="myRanking.userPhoto" alt=""
               mode="aspectFill"
                            class="w50 h50 bradius5 mr10" />
          <p class="lh50 c38 fbold">{{myRanking.userName}}</p>
        </div>
        <span>{{myRanking.data || 0}}{{type1_id == '3' ? '%' : ''}}</span>
      </div>
    </div>

    <div class="disflex jsbet pl16 pr15 pt15 pb15 bgfff fs16 lh50"
         v-for="(v,k) in ranking_lists" :key="k">
      <div class="disflex ranking_order" :class="k == 0 ? 'active' : '' ">
        <span class="corange fs18 fbold pr15">{{v.sort}}</span>
        <img :src="v.userPhoto" alt=""
             mode="aspectFill"
                          class="w50 h50 bradius5 mr10 posre"/>
        <p class="lh50 c38 fbold">{{v.userName}}</p>
      </div>
      <span>{{v.data || 0}}{{type1_id == '3' ? '%' : ''}}</span>
    </div>

  </div>
</template>

<script>
  import WXAJAX from '../utils/request'
  import StaticResources from '@/components/StaticResources';

  export default {
    name: '',
    components: {StaticResources},
    props: ['menu_id'],
    data() {
      return {
        type_text: [
          {
            name: '客户人数',
            id: 0,
            child: [
              {name: '客户总数', id: 0},
              {name: '新增客户', id: 1}
            ]
          },
          {
            name: '订单量',
            id: 1,
            child: [
              {name: '订单总数', id: 2},
              {name: '成交金额', id: 3}
            ]
          },
          {
            name: '互动频率',
            id: 2,
            child: [
              {name: '跟进总数', id: 4},
              {name: '咨询总数', id: 5}
            ]
          },
          {
            name: '成交率区间',
            id: 3,
            child: null
          },
        ],
        type_time: [
          {name: '全部', id: 0},
          {name: '近7天', id: 7},
          {name: '近15天', id: 15},
          {name: '近30天', id: 30},
        ],
        type1_id: 0,
        type2_id: 0,
        type3_id: 0,
        ranking_lists: [
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
          {logo: '', name: '王先生'},
        ],
        pt: 206 ,
        myRanking:{} ,
      }
    },
      mounted(){
          this.getTitleHeight();
      },
    watch: {
      'menu_id': function (newVal, oldVal) {
        if (newVal == 1) {
          this.getInits();
        }
      },
      'type1_id': function (newVal, oldVal) {
        this.$nextTick(()=>{
          this.getTitleHeight();
        })
      }
    },
    methods: {
      getTitleHeight(){
        wx.createSelectorQuery().selectAll('.enterprise_menu, .saleRanking_top').boundingClientRect((rects)=>{
          let pt = 0;
          rects.map(val=>{
            pt += val.height || 0;
          });

          this.pt = pt;
        }).exec();
      },
      type_tap(size, id) {
        if (size == 1) {
          this.type1_id = id;
          this.type_text[id].child && (this.type2_id = this.type_text[id].child[0].id);
        } else if (size == 2) {
          this.type2_id = id;
        } else {
          this.type3_id = id;
        }
        this.getInits();

      },
      getInits() {//销售排行
        console.log(this.type1_id, this.type2_id, this.type3_id);
        let url = '',
          params = {ignore: true};

        switch (this.type1_id) {
          case 0 : //客户人数
            url = '/finance/selectCustomerNum';
            if (this.type2_id != 0) {
              params = {
                whereDate: 1,
              }
            }
            break;
          case 1 ://订单量
            url = '/finance/selectOrderNum';
            params.type = this.type2_id - 1;
            if (this.type3_id != 0) {
              params.days = this.type3_id;
            }

            break;
          case 2 ://互动频率
            url = '/finance/selectInteractionNum';
            params.type = this.type2_id - 3;
            if (this.type3_id != 0) {
              params.days = this.type3_id;
            }

            break;
          case 3 ://成交率区间
            url = '/finance/selectDelNum';
            if (this.type3_id != 0) {
              params.days = this.type3_id;
            }
            break;
        }


        wx.showLoading();
        let v = this;
        WXAJAX.POST(params, '', url).then((data) => {

          wx.hideLoading();
          if(data){
            if (this.type1_id==1 && this.type2_id==3){
              data.data.map(val=>{
                val.data = (val.data/100).toFixed(2);
              })

              data.my.data = (data.my.data/100).toFixed(2);
            }
            this.myRanking = data.my ;
            this.ranking_lists = data.data ;
          }

        }).catch((err) => {
          console.log(err);
          wx.hideLoading();
        });
      }
    }
  }
</script>

<style>
  .saleRanking_top {
    /*position: fixed;*/
    /*top: 88upx;*/
    /*left: 0;*/
    /*z-index: 9;*/
  }

  .ranking_order.active p {
    color: #FFA133;
  }

  .ranking_order.active img::before {
    content: '';
    position: absolute;
    width: 28upx;
    height: 42upx;
    border-radius: 0 0 10upx 10upx;
    background: #FFA133;
    top: 0;
    left: 12upx;
  }
</style>






























