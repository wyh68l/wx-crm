<template>
  <div class="share-user bgfff">
    <Title title="分享者用户画像"
           subtitle="USER" />
    <div class="user-item">
      <div class="user">
        <img class="img"
             :src="man"
             alt="">
        <p class="cblue textc fs12 fbold">{{info.man|| '0%'}}</p>
      </div>
      <div class="user">
        <img class="img"
             :src="woman"
             alt="">
        <p class="cblue textc fs12 fbold"
           style="color:#FFA133">{{info.woman|| '0%'}}</p>
      </div>
      <div class="user">
        <img class="img"
             :src="notKnow"
             alt="">
        <p class="cblue textc fs12 fbold"
           style="color:#787878">{{info.notKnow|| '0%'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Title from '@/components/TiTleSlot'

export default {
  props: {
    info: {
      type: Object,
      default: () => ({
        man: '0%',
        woman: '0%',
        notKnow: '0%'
      })
    }
  },
  components: {
    Title
  },
  data () {
    return {
      woman:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/icon_women@2x.png",
      man:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/icon_man@2x.png",
      notKnow:
        "https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/ai-track/icon_not_know@2x.png",
      num: 45
    }
  }
}
</script>
<style scoped>
.share-user {
  padding: 40upx 32upx;
}
.share-user .img {
  width: 120upx;
  height: 120upx;
}
.share-user .user-item {
  display: flex;
  justify-content: space-between;
  padding: 60upx 44upx 0 44upx;
}
</style>
