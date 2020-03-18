<template>
  <form report-submit @submit="submitOrder" :report-submit="true">
    <label for="btn">
      <slot></slot>
      <button form-type="submit" id="btn" style="display: none"></button>
    </label>
  </form>
</template>

<script>
  import WXAJAX from '../utils/request'

  export default {
    name: "formId",
    methods:{
      submitOrder(e) {
        if ('the formId is a mock one' == e.mp.detail.formId) return;

      }
    }
  }
</script>

<style scoped>

</style>
