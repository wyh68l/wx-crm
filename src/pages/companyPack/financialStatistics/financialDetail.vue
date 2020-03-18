<template>
  <view>
    <!--顶部日期时间、价格-->
    <view class="disflex jsbet pl15 pr15 py45 fs16" style="border-bottom: 1upx solid #f5f5f6">
      <view class="disflex align-cen">
        <text style="color: #787878;">{{date}}</text>
      </view>
      <text>{{money}}</text>
    </view>
    <view class="pl15 pr15 fs14" style="color: #A8A8A8;padding-top: 30upx">
      <text>由</text><text class="mx-2" style="color: #51CBCD">{{name}}</text><text>成交客户</text><text style="color:#51CBCD;margin-left: 4upx">{{customerName}}</text>
    </view>
    <view style="color: #383838"  class="fbold pl15 pr15 fs16 mt20 mb15">
      备注内容
    </view>
    <view class="pl15 pr15 fs16" style="color: #383838">
      {{remark}} 
    </view>
    <img v-if="photos.length > 0" v-for="(item, index) in photos" :key="index" :src="item" mode="widthFix"  class="w100p disflex" :class="{mt45: index === 0}"  />
  </view>
</template>
<script>
// ajax
import WXAJAX from '../../../utils/request'

export default {
  data() {
    return {
      money: '加载中',
      date: '加载中',
      name: '',
      customerName: '',
      photos: [],
      remark: ''
    }
  },
  onLoad(option) {
    WXAJAX.POST({inputDealId: option.id}, '', '/customer/getInputDealDetail').then(data => {
      this.money = (data.money / 100).toFixed(2)
      this.date = this.formatDate('MM/dd hh:mm', data.createTime)
      this.name = data.name
      this.customerName = data.customerName
      this.remark = data.remark
      this.photos = data.photos.split(',')
    }).catch(err => console.log(err))
  },
  methods: {

  }
}
</script>
<style>
page {
  background: #fff
}
</style>
