export default {
    namespaced: true,
     state: () => ({
        address: {},
          token: '',
           userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}')
      }),
       mutations: {
          updateAddress(state, address) {
            state.address = address
          },
              saveAddressToStorage(state) {
                uni.setStorageSync('address', JSON.stringify(state.address))
              },
                updateUserInfo(state, userinfo) {
                  state.userinfo = userinfo
                  // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
                  this.commit('m_user/saveUserInfoToStorage')
                },
                  saveUserInfoToStorage(state) {
                    uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
                  },
               updateToken(state, token) {
                  state.token = token
                  this.commit('m_user/saveTokenToStorage')
                },
                saveTokenToStorage(state) {
                  uni.setStorageSync('token', state.token)
                },
                async getToken(info) {
                  // 调用微信登录接口
                  const [err, res] = await uni.login().catch(err => err)
                  // 判断是否 uni.login() 调用失败
                  if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
                
                  // 准备参数对象
                  const query = {
                    code: res.code,
                    encryptedData: info.encryptedData,
                    iv: info.iv,
                    rawData: info.rawData,
                    signature: info.signature
                  }
                
                  // 换取 token
                  const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
                  if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
                  uni.$showMsg('登录成功')
                    this.updateToken(loginResult.message.token)
                }
        },
getters: {
  addstr(state) {
    if (!state.address.provinceName) return ''
    return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
  },

}
}
