<template>
  <div class="bgfff" :class="iscart || isorder ? 'bradius10' : '' " @click="order_tap">
    <div class="pl15 lh44 posre disflex jsbet pr21" :class="iscart?'pl45 bbF2F3F4':isorder ? 'pl20' : 'pl15' ">
      <div class="disflex align-cen">
        <label class="checkBox"
               v-if="iscart"
               :class="label_company ? 'active' :''"
               @click.stop="choose_order('company')">
          <input type="checkbox">
          <span></span>
        </label>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/company_name.png" alt="" class="w16 h16 mr8">
        <span class="fs14 pr11">{{orderData.companyName}}</span>
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/right.png" alt="" class="w10 h10">
      </div>

      <span v-if="orderData.status==0" class="corange fs14">等待付款</span>
      <span v-if="orderData.status==1" class="cblue fs14">已完成</span>

    </div>
    <div class="disflex posre pb21"  :class="iscart?'pl45 bbF2F3F4':'pl15'" v-for="(prod_item,k) in orderData.ordersModelList" :key="k">
      <label class="checkBox" @click.stop="choose_order('prod',k)"
             :class="label_prod[k] ? 'active' :''"
             v-if="iscart">
        <input type="checkbox"  class="checkBox">
        <span ></span>
      </label>
      <div class="disflex pt20">
        <img :src="prod_item.photoUrl" alt="" mode="aspectFill" class="w70 h70 mr11 bradius5">
        <div class="w206">
          <p class="over_1 fs14 c38 w200">{{prod_item.title}}</p>

          <!--类型-->
          <div class="disflex mt8" v-if="iscart">
                        <span class="be8 pl7 pr8 lh20 fs12 ca8 mr8 bradius3"
                              v-for="(type_item , type_key) in prod_item.type"
                              :key="type_key">{{type_item.name}}</span>
          </div>

          <div class="mt8" v-else>
                                  <span class="pl7 pr8 lh20 fs12 ca8 mr8">
                            {{prod_item.specName}}；{{prod_item.specAttribute}} x {{prod_item.num}}
                        </span>
            <div>
              <span class="pl7 pr8 lh20 fs12 ca8 mr8">￥{{prod_item.price}}</span>
            </div>
          </div>


          <!--加减-->
          <div class="disflex jsbet pt7" v-if="iscart">
            <span class="cdeeporange fs14"><span>￥</span><span>{{prod_item.price}}</span></span>
            <div class="counter disflex">
                            <span class="textc be8 lh25 w25 minus ca8"
                                  @click.stop="prodChangeNum(index1,k,-1)">-</span>
              <span class="bte8 bbe8 fs12 c68 w40 lh25 textc">{{prod_item.num}}</span>
              <span class="textc be8 lh25 w25 add ca8"
                    @click.stop="prodChangeNum(index1,k,1)">+</span>
            </div>
          </div>


          <!--价格-->
          <div class="textr fs14 c38" v-if="isorder">
            ￥{{prod_item.num * prod_item.price}}
          </div>


        </div>

      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: '',
    components: {},
    props:['orderData','iscart','index1','label_company','label_prod','isorder'],
    data() {
      return{
        company_check:false,
      }
    },
    mounted() {
      // console.log('label_company----',this.label_company)
    },
    methods: {
      prodChangeNum(index1,index2,num){//改变数量
        this.$emit('prodChangeNum',index1 ,index2,num)
      },
      choose_order(method,index2){//选择
        if(method == 'company'){
          this.company_check = !this.company_check ;
        }
        this.$emit('choose_order',method,this.index1,index2 );
      },
      order_tap(){
        this.$emit('order_tap');
      }
    },
    watch: {

    }
  }
</script>

<style>

</style>

<!--
<table>
                    <tr style="height:140upx; line-height:140upx; font-size:32upx;"><label><input type="checkbox"  id="zhiwuid" value="all"> 权限管理</label></tr>
                    <tr><label><input type="checkbox" name="planBox[]" id="planid" value="plan"> 生产计划</label></tr>
                    <tr>
                        <td><label><input type="checkbox" name="planBox[]" value="planlist"> 查看</label></td>
                        <td><label><input type="checkbox" name="planBox[]" value="planRelease"> 发布</label></td>
                        <td><label><input type="checkbox" name="planBox[]" value="planedit"> 编辑</label></td>
                        <td><label><input type="checkbox" name="planBox[]" value="plandel"> 删除</label></td>
                        <td><label><input type="checkbox" name="planBox[]" value="planstatus"> 审核</label></td>
                    </tr>
                    <tr><label><input type="checkbox" name="woBox[]" id="woid" value="wo"> 工单</label></tr>
                    <tr>
                        <td><label><input type="checkbox" name="woBox[]" value="wolist"> 查看</label></td>
                        <td><label><input type="checkbox" name="woBox[]" value="woRelease"> 发布</label></td>
                        <td><label><input type="checkbox" name="woBox[]" value="woedit"> 编辑</label></td>
                        <td><label><input type="checkbox" name="woBox[]" value="wodel"> 删除</label></td>
                        <td><label><input type="checkbox" name="woBox[]" value="wostatus"> 审核</label></td>
                    </tr>
                    <tr><label><input type="checkbox" name="pickingBox[]" id="picking" value="picking"> 领料</label></tr>
                    <tr>
                        <td><label><input type="checkbox" name="pickingBox[]" value="pickinglist"> 查看</label></td>
                        <td><label><input type="checkbox" name="pickingBox[]" value="pickingRelease"> 发布</label></td>
                        <td><label><input type="checkbox" name="pickingBox[]" value="pickingedit"> 编辑</label></td>
                        <td><label><input type="checkbox" name="pickingBox[]" value="pickingdel"> 删除</label></td>
                        <td><label><input type="checkbox" name="pickingBox[]" value="pickingstatus"> 审核</label></td>
                    </tr>
                    <tr><label><input type="checkbox" name="rmBox[]" id="rm" value="rm"> 退料</label></tr>
                    <tr>
                        <td><label><input type="checkbox" name="rmBox[]" value="rmlist"> 查看</label></td>
                        <td><label><input type="checkbox" name="rmBox[]" value="rmRelease"> 发布</label></td>
                        <td><label><input type="checkbox" name="rmBox[]" value="rmedit"> 编辑</label></td>
                        <td><label><input type="checkbox" name="rmBox[]" value="rmdel"> 删除</label></td>
                        <td><label><input type="checkbox" name="rmBox[]" value="rmstatus"> 审核</label></td>
                    </tr>

    </table>
</template>
<script>
    export default {
        data() {
            return {

            };
        },
        mounted: function() {
            this.getcheckall()
        },

        methods: {

            getcheckall:function(){
                var isCheckAll = false;
                var planCheckAll = false;
                var woCheckAll = false;
                var pickingCheckAll = false;
                var rmCheckAll = false;
                //总盒子
                $("#zhiwuid").click(function(){
                    if (isCheckAll) {
                        $("input[type='checkbox']").each(function() {
                            this.checked = false;
                        });
                        isCheckAll = false;
                    } else {
                        $("input[type='checkbox']").each(function() {
                            this.checked = true;
                        });
                        isCheckAll = true;
                    }
                })

                //计划盒子 all
                $("#planid").click(function(){
                    if (planCheckAll) {
                        $("input[name='planBox[]']").each(function() {
                            this.checked = false;
                        });
                        planCheckAll = false;
                    } else {
                        $("input[name='planBox[]']").each(function() {
                            this.checked = true;
                        });
                        planCheckAll = true;
                    }
                })


                $("#woid").click(function(){
                    if (woCheckAll) {
                        $("input[name='woBox[]']").each(function() {
                            this.checked = false;
                        });
                        woCheckAll = false;
                    } else {
                        $("input[name='woBox[]']").each(function() {
                            this.checked = true;
                        });
                        woCheckAll = true;
                    }
                })


                $("#picking").click(function(){
                    if (pickingCheckAll) {
                        $("input[name='pickingBox[]']").each(function() {
                            this.checked = false;
                        });
                        pickingCheckAll = false;
                    } else {
                        $("input[name='pickingBox[]']").each(function() {
                            this.checked = true;
                        });
                        pickingCheckAll = true;
                    }
                })


                $("#rm").click(function(){
                    if (rmCheckAll) {
                        $("input[name='rmBox[]']").each(function() {
                            this.checked = false;
                        });
                        rmCheckAll = false;
                    } else {
                        $("input[name='rmBox[]']").each(function() {
                            this.checked = true;
                        });
                        rmCheckAll = true;
                    }
                })

            },








        }
    }
</script>
