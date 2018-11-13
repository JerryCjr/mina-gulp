// pages/recruit_group/group_manage.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
var page_index = 1;
var page_size = 20;
var totalPage = 1;
var ajaxFlag = true
var getChatroomMembers = function(that) {
  if ((totalPage >= page_index) && ajaxFlag) {
    wx.showLoading({
      title: '玩命加载中'
    })
    ajaxFlag = false
    ajax.GET({
      data: {
        pageIndex: page_index,
        pageSize: page_size
      },
      url: '/m/promoter/wechatroom/getchatroommembers',
      success: function(res) {
        // 隐藏加载框
        if (res.data.success) {
          var moment_list = that.data.chatroomMembers;
          totalPage = res.data.data.totalPage
          for (var i = 0; i < res.data.data.items.length; i++) {
            moment_list.push(res.data.data.items[i]);
          }
          page_index++;
          that.setData({
            chatroomMembers: moment_list,
            realityPeopleNum: res.data.data.totalCount
          });
          console.log(totalPage >= page_index, '123')
          if (totalPage >= page_index) {
            that.setData({
              hideBottom: 1,
            });
          } else {
            that.setData({
              hideBottom: 2,
            });
          }
        } else {
          app.catchFunc(res);
        }
        // 隐藏加载框
        wx.hideLoading();
        ajaxFlag = true
      },
      fail: function(err) {
        ajaxFlag = true
        wx.hideLoading();
      }
    })
  }
}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    th: 0,
    assistantStatus: -1,
    groupInfo: {
      memberCount: 0
    },
    chatroomMembers: [],
    scrollHeight: 0,
    stationNumber: '',
    realityPeopleNum: 0,
    hideBottom: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (!wx.getStorageSync('token')) {
      wx.showModal({
        title: '提示',
        content: '用户信息有误，请重试',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '/pages/login/login',
            })
          }
        }
      });
      return;
    }
    that.setData({
      assistantStatus: Number(options.assistantStatus),
      stationNumber: options.stationNumber || 0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    page_index = 1;
    page_size = 20;
    totalPage = 1;
    ajaxFlag = true;
    that.setData({
      chatroomMembers: []
    });
    if (that.data.assistantStatus === 1) {
      wx.redirectTo({
        url: '/pages/recruit_group/group_active?assistantStatus=1',
      })
      return;
    }
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          "th": res.windowHeight / 14,
          "scrollHeight": res.windowHeight
        })
      }
    });
    if (that.data.assistantStatus === 2) {
      getChatroomMembers(that);
      that.getChatroomInfoFunc()
    }
    if (that.data.stationNumber === 0) {
      that.getStationNumberFunc()
    }
  },

  // 点击立即激活
  activeFunc: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/recruit_group/group_active?assistantStatus=' + that.data.assistantStatus
    })
  },

  // 获取群组信息
  getChatroomInfoFunc: function() {
    var that = this;
    ajax.GET({
      url: '/m/promoter/wechatroom/getchatroominfo',
      success: function(res) {
        if (res.data.success) {
          res.data.data.updateTime = util.formatTime(res.data.data.updateTime, "Y年M月D日 h:m")
          that.setData({
            groupInfo: res.data.data
          })
          console.log(that.data.groupInfo)
        } else {
          app.catchFunc(res);
        }
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  
  // 获取分站号
  getStationNumberFunc: function () {
    var that = this;
    ajax.GET({
      url: '/m/promoter/wechatroom/getstationnumber',
      success: function (res) {
        if (res.data.success) {
          that.setData({
            stationNumber: res.data.data || 'babyfs'
          })
        } else {
          that.setData({
            stationNumber: 'babyfs'
          })
          app.catchFunc(res);
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    getChatroomMembers(that)
  },

  // 跳转到招生群助手页面
  navToActive: function() {
    wx.navigateTo({
      url: '/pages/recruit_group/group_active?assistantStatus=1',
    })
  },

  // 跳转到使用指南页面
  navToGuide: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/recruit_group/group_wiki?stationNumber=' + that.data.stationNumber
    })
  }
})