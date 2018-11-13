// pages/pro_invite_f/pro_invite_f.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let id = '';
let invite_id = '';
let pt = '';
let c_id = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info_top: 0,
        bottom: 0,
        flag: true,
        id: 0,
        leader: -1
    },

    inviteCode: function (e) {
        let types = e.target.dataset.types;
        pt = e.currentTarget.dataset.pt;
        wx.showLoading({
            title: '正在跳转',
        })
        let t = e.currentTarget.dataset.t;
        let scene = '';
        // let para = {
        //     t: t,
        //     pt: pt,
        //     c: c_id,
        //     page: 'pages/invite_page/invited_page'
        // }
        if (pt) {
            scene = 't=' + types + ',pt=' + pt + ',c=' + c_id + ',i=' + invite_id;
        } else {
            scene = 't=' + types + ',c=' + c_id + ',i=' + invite_id;
        }
        console.log(scene)

        let para = {
            wx_app: 'wxa_pro',
            scene: scene,
            page: 'pages/invite_page/invited_page'
        }
        console.log(para)
        if(app.globalData.host === 'https://m.babyfs.cn') {
          ajax.POST({
            // url: '/promoter/invite/get/urlCode',
            url: '/wx/getwxacodeunlimit',
            data: para,
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    wx.hideLoading();

                    wx.navigateTo({
                        url: '/pages/pro_invite_f/pro_invite_f_poster?url=' + res.data.data,
                    })
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            }   
          })
        } else {
          wx.hideLoading();

          wx.navigateTo({
            url: '/pages/pro_invite_f/pro_invite_f_poster?url=http://i.s.babyfs.cn/wx/code/miniprogram/wxa_pro/a502b22330c74e2dd70e24ddfcd1715f3aaee3a7.jpg',
          })
        }
    },

    getChannel: function () {
        ajax.GET({
            url: '/promoter/invite/get/channelCode',
            success: function (res) {
                console.log(res)
                if (res.data.success) {
                    c_id = res.data.data;
                } else {
                    app.catchFunc(res);
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        console.log(options)
        id = options.id;
        invite_id = options.invite_id;
        let leader = options.leader || -1
        this.setData({ id: options.id, leader: leader })
        wx.getSystemInfo({
            success: function (res) {
                console.log(res);
                // 可使用窗口宽度、高度
                console.log('height=' + res.windowHeight);
                console.log('width=' + res.windowWidth);
                if (res.windowHeight >= 724 && res.windowHeight < 960) {
                    that.setData({
                        info_top: 782,
                        bottom: 135
                    })
                } else if (res.windowHeight == 677) {
                    that.setData({
                        info_top: 550,
                    })
                } else if (res.windowHeight <= 724) {
                    that.setData({
                        info_top: 650,
                        bottom: 135
                    })
                } else {
                    that.setData({
                        info_top: 490,
                        bottom: 100
                    })
                }
            }
        })
    },

    closeFun: function () {
        this.setData({ flag: true })
    },

    inviteFun: function () {
        if (id == 0) {
            this.setData({ flag: false })
        } else {
            // wx.navigateTo({
            //     url: '/pages/pro_invite_f/pro_invite_f_poster',
            // })
        }
    },

    navFun: function () {
        wx.navigateTo({
            url: '/pages/pro_invite_manage/pro_invite_manage?id=' + id,
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getChannel();
    },

    onShareAppMessage: function (e) {
        console.log(e)
        let types = e.target.dataset.types;
        pt = e.target.dataset.pt;
        console.log(pt)
        return {
            title: '推广人小程序',
            path: '/pages/invite_page/invited_page?types=' + types + '&invite_id=' + invite_id + '&pt=' + pt + '&c_id=' + c_id,
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
            },
            fail: function (res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }

    },
})