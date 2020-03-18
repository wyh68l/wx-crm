<template>
  <div class="shop-item">
    <div class="item">
      <div class="flex">
        <div class="rank">NO.{{rank}}</div>
        <img :src="info.goodsPhoto"
             class="img"
             alt="">
        <!-- <div class="img"
             :style="{background:`url(${info.goodsPhoto}) no-repeat center`}"></div> -->
        <div class="desc">
          <p class="shop-name">{{info.goodsName}}</p>
          <p class="price subtitle">￥&nbsp;{{info.goodsPrice | formatterPrice}}</p>
        </div>
      </div>
      <div class="flex">
        <div class="desc">
          <p class="title">访问次数</p>
          <p class="subtitle">{{info.visitCount}}</p>
        </div>
        <!-- <div class="desc">
          <p class="title">访问时长</p>
          <p class="subtitle">00:00:00</p>
        </div> -->
      </div>
    </div>
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    rank: {
      type: Number,
      default: 1
    }
  },
  filters: {
    formatterPrice (val) {
      if (val) {
        let price = (val / 100).toFixed(2);
        console.log(price);
        return price
      }
    }
  },
  data () {
    return {
      head:
        "https://static.xiongmaozhanggui.com/panda/backstage/uploads/20191014/15710411171479.png",
      // rank: 1,
      price: 0
    };
  },
  mounted () {
    if (this.info.goodsPrice && typeof (this.info.goodsPrice) === 'number') {
      this.price = (this.info.goodsPrice / 100).toFixed(2);
    }
  }
};
</script>
<style scoped>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 180upx;
}
.item .flex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.item .rank {
  font-size: 24upx;
  color: #00a0e9;
  font-weight: bold;
}
.item .img {
  width: 100upx;
  height: 100upx;
  border-radius: 10upx;
  flex-shrink: 0;
  margin-left: 20upx;
}
.item .desc {
  margin-left: 22upx;
}
.item .desc .title {
  font-size: 24upx;
  color: #a8a8a8;
  text-align: center;
}
.item .desc .subtitle {
  font-size: 24upx;
  margin-top: 20upx;
  color: #a8a8a8;
  text-align: center;
}
.item .desc .shop-name {
  color: #383838;
  width: 300upx;
  font-size: 24upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item .desc .price {
  color: #fd634e;
  text-align: left;
}

.line {
  width: 100%;
  height: 1upx;
  background-color: #f5f5f6;
}
</style>