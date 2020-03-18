<template>
  <div class="disflex jsbet pl15 pt15 pb15 pr15 ">
    <div>
      <span @click="edit_tap('text')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_text.png"
                          alt="" class="w30 h30"/>
      </span>
      <span @click="edit_tap('img')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_img.png"
                          alt="" class="w30 h30"/>
      </span>
      <span @click="edit_tap('banner')" v-if="isBanner">
         <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_banner.png"
                           alt="" class="w30 h30"/>
      </span>
      <span @click="edit_tap('split')">
        <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_split.png"
                          alt="" class="w30 h30" />
      </span>
    </div>

    <div>
      <span @click="edit_tap('up')">
            <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_up.png"
                              alt="" class="w30 h30" />
      </span>
      <span @click="edit_tap('down')">
         <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_down.png"
                           alt="" class="w30 h30" />
      </span>
      <span @click="edit_tap('del')">
         <img src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/crm/editor_del_2.png"
                           alt="" class="w30 h30" />
      </span>
    </div>
  </div>
</template>

<script>
  import StaticResources from '@/components/StaticResources';

  export default {
    name: "edit_operator",
    props:['index','isBanner'],
    components: {StaticResources},
    methods:{
      edit_tap(type){
        this.$emit('edit_tap',type , this.index)
      }
    }
  }
</script>

<style>

</style>





























