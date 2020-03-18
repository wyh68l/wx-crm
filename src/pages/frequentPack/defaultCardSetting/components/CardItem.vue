<template>
  <div class="card_item disflex align-cen h80 bgfff"
       @click="checkedItem">

    <label v-if="isEdit"
           class="checkBox posre w20 h20 ml15"
           :class="info.checked ? 'active' :''">
      <span></span>
    </label>
    <div class="content disflex align-cen ml15">
      <!-- <img :src="info.logo||'https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/user_gray_circle.png'"
           alt=""
           class="w50 h50 bradius5 header"> -->
      <div class="header w50 h50 bradius5 "
           :style="{'background-image':`url(${info.logo})`}"></div>
      <div class="desc ml11">
        <p class="fs16 fbold mb10 lh15"
           :class="currentActive?'cblue': ''">{{info.name}}</p>
        <p class="fs14 c78 lh15">{{info.position || '暂无'}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentActive: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => ({ name: '', position: '', checked: false, cardId: '11' })
    }
  },
  data () {
    return {
      active: true
    }
  },
  methods: {
    checkedItem () {
      this.$emit('checkedItem', this.info.cardId);
    }
  }
}
</script>
<style scoped>
.checkBox span {
  left: 0;
}
.header {
  object-fit: contain;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
