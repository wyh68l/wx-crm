<template>
  <scroll-view class="share-record-details bgfff"
               scroll-y="true"
               enable-back-to-top="true"
               scroll-anchoring="true"
               scroll-with-animation>
    <shareDetailsTop :info="shareRecordsInfo" />
    <div class="line"></div>
    <div class="list"
         v-if="list">
      <shareUserItem v-for="(info, index) of list"
                     :key="index"
                     :info="info" />
    </div>
  </scroll-view>
</template>
<script>
import shareDetailsTop from "./components/shareDetailsTop";
import shareUserItem from "./components/shareUserItem";
import WXAJAX from "@/utils/request";
import { mapState } from "vuex";
export default {
  components: {
    shareDetailsTop,
    shareUserItem
  },
  data() {
    return {
      id: "", //文章id,
      list: []
    };
  },
  computed: {
    ...mapState({
      shareRecordsInfo: state => state.shareRecordsInfo
    })
  },
  mounted() {
    this.queryInfo();
  },
  methods: {
    async queryInfo() {
      try {
        let data = await WXAJAX.POST(
          { ignore: true, dynamicId: this.id },
          "",
          "/company/dynamicShardRecordDetail"
        );
        if (data) {
          this.list = data;
        }
        this.isLoading = false;
        wx.hideLoading();
      } catch (error) {
        this.isLoading = false;
        wx.hideLoading();
        this.list = [];
        console.log(".............", error);
      }
    }
  },
  onLoad(params) {
    this.id = params.id;
  }
};
</script>
<style>
.share-record-details {
  height: 100%;
}
.line {
  width: 100%;
  height: 20upx;
  background: #f8f8f8;
}
</style>
