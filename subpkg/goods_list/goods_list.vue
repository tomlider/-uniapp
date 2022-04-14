<template>
<view>
<view class="goods-list">
  <view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
    <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
    <my-goods :goods="item"></my-goods>
  </view>
</view>
</view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
          queryObj: {
              query: '',
              cid: '',
              pagenum: 1,
              pagesize: 10
            },
                goodsList: [],
                total: 0,
              isloading: false
                  
      };
    },
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || '',
        this.getGoodsList()
    },
    methods:{
    async getGoodsList(cb) {
   this.isloading = true
      const { data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
      if (res.meta.status !== 200) return uni.$showMsg()
      this.goodsList = [...this.goodsList, ...res.message.goods]
      this.total = res.message.total
      this.isloading = false
    },
    gotoDetail(item) {
      console.log(item)
      uni.navigateTo({
        url:'../goods-detail/goods-detail?goods_id='+ item.goods_id
      })
    },
    },
    onReachBottom() {
       if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')

        if (this.isloading) return
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },

    onPullDownRefresh() {
      // 1. 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
     cb && cb()
      // 2. 重新发起请求
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>
<style lang="scss">

</style>
