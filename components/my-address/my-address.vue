<template>
<view>
<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
  <button type="primary" size="mini" class="btnChooseAddress"  @click="chooseAddress">请选择收货地址+</button>
</view>
<view class="address-info-box" v-else  @click="chooseAddress">
  <view class="row1">
    <view class="row1-left">
      <view class="username">收货人：<text>{{address.userName}}</text></view>
    </view>
    <view class="row1-right">
      <view class="phone">电话：<text>{{address.telNumber}}</text></view>
      <uni-icons type="arrowright" size="16"></uni-icons>
    </view>
  </view>
  <view class="row2">
    <view class="row2-left">收货地址：</view>
    <view class="row2-right">{{addstr}}</view>
  </view>
</view>

  <!-- 底部的边框线 -->
  <image src="/static/cart_border@2x.png" class="address-border"></image>
</view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
           //   address: {},
      };
    },
    computed:{
      ...mapState('m_user', ['address']),
      // 将 m_user 模块中的 addstr 映射到当前组件中使用
      ...mapGetters('m_user', ['addstr']),
    },
    methods:{
         ...mapMutations('m_user', ['updateAddress']),
       async chooseAddress() {
          const [err, succ] = await uni.chooseAddress().catch(err => err)
          if (err === null && succ.errMsg === 'chooseAddress:ok') {
             this.updateAddress(succ)
          }
        }
      }
    }
  
</script>

<style lang="scss">
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}

// 选择收货地址的盒子
.address-choose-box {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>
