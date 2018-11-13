import env from './npm/wxapp-env/babyfs-wxapp-env/index.js';
// app.js
let wx_group_key = {};
let host = 'https://m.babyfs.cn';
// let host = 'http://m.bvt.babyfs.cn';
// let host = 'http://m.dev.babyfs.cn';
// let host = 'http://127.0.0.1:36742';
// let host = 'http://10.10.60.11';
// let host = 'http://10.10.61.167';
// let host = 'http://emily.test.babyfs.cn';
// let host = 'http://10.10.20.66:36742';
App({
  onShow: function (ops) {
    let _this = this;
    if (ops.scene === 1044) {
      wx.getShareInfo({
        shareTicket: ops.shareTicket,
        success(res) {
          if (res.encryptedData && res.iv) {
            wx_group_key = {
              encryptedData: res.encryptedData,
              iv: res.iv
            };
            _this.globalData.wx_group_key = wx_group_key;
          }
        }
      });
    }
  },
  onLaunch: function () {
    env.init('/pages/index/index');
    this.globalData.host = env.host;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: host + '/api/user/wxx_session',
          data: {
            wx_js_code: res.code,
            wx_app: 'wxa_pro'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            if (res.data.success) {
              console.log(res.data.data.session_id);
              wx.setStorageSync('session_id', res.data.data.session_id);
            }
          },
          fail: function (res) {},
          complete: function (res) {}
        });
      }
    });
  },
  globalData: {
    userInfo: null,
    // host: host,
    wx_group_key: null,
    pointsEvents: wx.getStorageSync('pointsEvents') ? wx.getStorageSync('pointsEvents') : [],
    sid: +new Date() + '000000',
    lessonId: null,
    linkId: null,
    linkCode: null,
    bindTime: null,
    qrCodeURL: null,
    staNumber: null,
    leaderType: null,
    dateRangeId: null,
    types: null,
    dateTime: null,
    flag: false,
    detailsData: {
      img: '',
      id: '',
      postersName: '',
      posterType: '',
      writePhotosAlbum: true,
      shop_url: ''
    },
    salaryId: '',
    salaryDate: '',
    promoterType: 0
  },
  /**
   * @description 捕获错误方法
   * @author MuNaipeng
   * @param {*} catchRes
   */
  catchFunc(catchRes, url) {
    console.log('catchFunc');
    console.log(catchRes);
    if (catchRes.statusCode === 404) {
      wx.showToast({
        title: '请检查网络是否连接',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    } else if (catchRes.statusCode === 400) {
      wx.showToast({
        title: '网络忙，请稍后再试',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    } else if (catchRes.statusCode === 409) {
      wx.showToast({
        title: '当前状态超出设备限制',
        icon: 'none',
        mask: true,
        duration: 2000
      });
    } else if (catchRes.statusCode === 401) {
      console.log('进入401');
      wx.showModal({
        title: '提示',
        content: '用户信息有误，请重试',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // selfLogin();
            wx.redirectTo({
              url: '/pages/login/login?from=' + url
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    } else {
      wx.showToast({
        title: catchRes.data.msg,
        icon: 'none',
        mask: true,
        duration: 2000
      });
    }
  }
});
