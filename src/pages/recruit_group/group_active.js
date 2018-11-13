// pages/recruit_group/group_active.js
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    assistantStatus: -1,
    activityInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      assistantStatus: Number(options.assistantStatus)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (that.data.assistantStatus === 1) {
      ajax.GET({
        url: '/m/promoter/wechatroom/getassistantrobotinfo',
        success: function(res) {
          if (res.data.success) {
            that.setData({
              activityInfo: res.data.data,
              assistantStatus: 1
            })
          } else {
            app.catchFunc(res);
          }
        },
        fail: function(err) {

        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  gainFucn: function() {
    var that = this
    ajax.GET({
      url: '/m/promoter/wechatroom/generateactivationcode',
      success: function(res) {
        if (res.data.success) {
          that.setData({
            activityInfo: res.data.data,
            assistantStatus: 1
          })
        } else {
          app.catchFunc(res);
        }
      },
      fail: function(err) {

      }
    })
  },
  copyFunc: function(e) {
    console.log();
    wx.setClipboardData({
      data: e.currentTarget.dataset.copyTest,
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})