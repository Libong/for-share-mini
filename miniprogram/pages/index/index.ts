// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    forwardClue:'立即前往',
    forwardHiddenClue:'你好 \u00A0\u00A0欢迎光临',
    isTouched: false, // 用于标记箭头是否被触摸
    tooltipOpacity: 0, // 提示词的透明度
    tooltipY: 20 ,// 提示词的初始偏移量
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },
  // 事件处理函数
  methods: {
    //前往主页
    goToCameraPage() {
      console.log("1111")
      wx.navigateTo({
        url: '/pages/photo/index' // 拍照页面的路径
      });
    },
    // 触摸箭头时触发
    onTouchStart() {
      this.setData({
        isTouched: true, // 标记箭头被触摸
        tooltipOpacity: 1, // 显示提示词
        tooltipY: 0 // 提示词向上移动
      });

      // 2秒后隐藏提示词
      setTimeout(() => {
        this.setData({
          tooltipOpacity: 0,
          tooltipY: 20
        });
      }, 2000);
    },
    onChooseAvatar(e: any) {
      const { avatarUrl } = e.detail
      const { nickName } = this.data.userInfo
      this.setData({
        "userInfo.avatarUrl": avatarUrl,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    onInputChange(e: any) {
      const nickName = e.detail.value
      const { avatarUrl } = this.data.userInfo
      this.setData({
        "userInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
      })
    },
    getUserProfile() {
      // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    },
  },
})
