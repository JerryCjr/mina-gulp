// eslint-disable-next-line no-unused-vars
import regeneratorRuntime from '../../utils/runtime';
import dateHelper from '../../utils/babyfs-data';
import ajax from '../../utils/babyfs-wxapp-request.js';
import wxapi from '../../utils/babyfs-wxapp-api.js';

// 全局app实例
const app = getApp();
console.log(app);
console.log(dateHelper.parse('2018-09-30 02:20:32', 'yyyy-MM-dd hh:mm:ss').getTime());
console.log(dateHelper.parse('2018-09-30 02:20:32', 'yyyy-MM-dd hh:mm:ss').getTime() === new Date(2018, 8, 30, 2, 20, 32, 123).getTime());

let delay = function () {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({
        test: 'r uuuuuuu kiding?'
      });
    }, 0);
  });
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '../../images/mine-default.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let test = {
      abc: 123
    };
    console.log(test);
    let c = Object.assign({
      bbb: 123,
      ccc: 999
    }, test);
    console.log(c);
    let cc = function () {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({
            test: 'r u kiding?'
          });
        }, 0);
      });
    };
    let bb = async function () {
      let r = await cc();
      console.log(r);
    };
    bb();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    let r = await delay();
    console.log(r);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  customData: {},

  async bindgetuserinfo(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      Object.assign(app.globalData['userInfo'], e.detail['userInfo']);
      Object.assign(app.globalData['wx_group_key'], {
        'encryptedData': e.detail.encryptedData,
        'iv': e.detail.iv
      });
      let sessionId = wx.getStorageSync('session_id');
      if (!sessionId) {
        await this.getUsSession();
      }
      this.getUsToken();
    } else {
      console.log(e.detail.errMsg);
    }
  },

  async getUsToken() {
    let params = null;
    let options = null;
    params = { ...app.globalData.wx_group_key };
    params['wx_session_id'] = wx.getStorageSync('session_id');
    options = {
      url: 'https://m.babyfs.cn/api/user/wxx_login',
      data: params
    };
    await ajax.POST(options);
  },

  async getUsSession() {
    let r = await wxapi.login();
    if (r) {
      let options = {
        url: 'https://m.babyfs.cn/api/user/wxx_session',
        data: {
          wx_js_code: r.code,
          wx_app: 'wxa_primer'
        }
      };
      let res = await ajax.POST(options);
      wx.setStorageSync('session_id', res.session_id);
    }
  }
});
