<template>
  <view  v-if="goods_info.goods_name" class="goods-detail-container ">
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i"  @click="preview(i)">
 <image :src="item.pics_big"></image>
      </swiper-item>
    </swiper>
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费 {{cart.length}}</view>
    </view>
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <view class="goods_nav">
  <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>

</template>

<script>
  import { mapState,mapMutations, mapGetters } from 'vuex'
 
  export default {
    data() {
      return {
   goods_info: {},
   options: [{
         icon: 'shop',
         text: '店铺'
       }, {
         icon: 'cart',
         text: '购物车',
         info: 2
       }],
       // 右侧按钮组的配置对象
       buttonGroup: [{
           text: '加入购物车',
           backgroundColor: '#ff0000',
           color: '#fff'
         },
         {
           text: '立即购买',
           backgroundColor: '#ffa200',
           color: '#fff'
         }
       ]
      };
    },
    onLoad(options) {
  const goods_id = options.goods_id
  this.getGoodsDetail(goods_id)
    },
      computed: {
        ...mapState('m_cart', ['cart']),
                 ...mapGetters('m_cart', ['total']),
      },
      watch:{
 total: {
      // handler 属性用来定义侦听器的 function 处理函数
      handler(newVal) {
         const findResult = this.options.find(x => x.text === '购物车')
         if (findResult) {
            findResult.info = newVal
         }
      },
      // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
      immediate: true
   }
          },
    methods:{
        ...mapMutations('m_cart', ['addToCart']),
     async getGoodsDetail(goods_id) {
       const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
       if (res.meta.status !== 200) return uni.$showMsg()
       this.goods_info = res.message
         res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
     } ,
     preview(i){
       uni.previewImage({
         current:i,
         urls:this.goods_info.pics.map(x=>x.pics_big)
       })
     },
onClick(e) {
  if (e.content.text === '购物车') {
    // 切换到购物车页面
    uni.switchTab({
      url: '/pages/cart/cart'
    })
  }
},
buttonClick(e){
    if (e.content.text === '加入购物车') {
  
        // 2. 组织一个商品的信息对象
        const goods = {
           goods_id: this.goods_info.goods_id,       // 商品的Id
           goods_name: this.goods_info.goods_name,   // 商品的名称
           goods_price: this.goods_info.goods_price, // 商品的价格
           goods_count: 1,                           // 商品的数量
           goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
           goods_state: true                         // 商品的勾选状态
        }
        this.addToCart(goods)
     }
}
    }
  }
</script>

<style lang="scss">
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
  .goods-detail-container {
    // 给页面外层的容器，添加 50px 的内padding，
    // 防止页面内容被底部的商品导航组件遮盖
    padding-bottom: 50px;
  }
}
  .goods_nav {
    // 为商品导航组件添加固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
