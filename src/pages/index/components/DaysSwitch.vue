<template>
  <div class="days-switch query fs14">
    <span class="fs14 cblue"
          :class="{active: index ===0}"
          @click="query(0)">今日</span>
    <span class="fs14 cblue"
          :class="{active: index ===1}"
          @click="query(1)">昨日</span>
    <span class="fs14 cblue"
          :class="{active: index ===2}"
          @click="query(2)">近7天</span>
    <span class="fs14 cblue"
          :class="{active: index ===3}"
          @click="query(3)">近30天</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      index: 0
    }
  },
  methods: {
    query (index) {
      this.index = index;
      this.$emit('select', index);
    },
  }
}
</script>
<style scoped>
.query {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.query span {
  width: 134upx;
  height: 52upx;
  line-height: 52upx;
  text-align: center;
  display: inline-block;
  border-radius: 26upx;
  border: 1upx solid rgba(81, 205, 203, 0.3);
  /* padding: 7upx 0; */
}
.query .active {
  background: #00a0e9;
  color: #fff;
}
</style>