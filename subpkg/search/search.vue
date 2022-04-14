<template>
  <view >
    

  <view class="search-box">
    <uni-search-bar @confirm="search" @input="input"></uni-search-bar>
    <view class="sugg-list">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
  </view>
  <view class="history-box">
    <!-- 标题区域 -->
    <view class="history-title">
      <text>搜索历史</text>
      <uni-icons type="trash" size="17"></uni-icons>
    </view>
    <!-- 列表区域 -->
    <view class="history-list">
      <uni-tag :text="item" v-for="(item, i) in historyList" :key="i"></uni-tag>
    </view>
  </view>
    </view>
</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        kw: '',
        searchResults: [],
           historyList: ['a', 'app', 'apple']
      };
    },
    methods: {
      input(e) {
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把 timerId 赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
          this.kw = e.value
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if (this.kw === '') {
          this.searchResults = []
          return
        }
        const {
          data: res
        } = await uni.request({
          url:'https://www.escook.cn/api/public/v1/goods/qsearch',
              data: {
             query: this.kw
              },
        }) 
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .sugg-list {
    padding: 0 5px;
  
    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
  
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后，使用 ... 代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  .history-box {
    padding: 0 5px;
  
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
  
    .history-list {
      display: flex;
      flex-wrap: wrap;
  
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
