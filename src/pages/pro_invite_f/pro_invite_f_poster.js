// pages/pro_invite_f/pro_invite_f_poster.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let qrcode = require('../../utils/qrcode.js');
let util = require('../../utils/util.js');
let options = '';
let savedFilePath = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        top: '',
        h: '',
        url: '',
        flag: true,
        btnFlag: false
    },

    handleSetting: function (e) {
        let that = this;
        // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
        wx.openSetting({
            success: function (res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    that.setData({ btnFlag: true });
                    wx.showModal({
                        title: '警告',
                        content: '若不打开授权，则无法将图片保存在相册中！',
                        showCancel: false
                    })
                } else {
                    that.setData({ btnFlag: false });
                    wx.showModal({
                        title: '提示',
                        content: '您已授权，赶紧将图片保存在相册中吧！',
                        showCancel: false
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        })
        
    },

    posterFun: function () {
        this.saveToAlbum(savedFilePath);
    },

    // 将图片保存到本地相册
    saveToAlbum(URL) {
        var that = this;
        wx.getSetting({
            success(res) {
                console.log(res)
                if (!res['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success(res) {
                            that.setData({ btnFlag: false });
                            app.globalData.detailsData.writePhotosAlbum = true
                            wx.saveImageToPhotosAlbum({
                                filePath: URL,
                                success(res) {
                                    wx.showToast({
                                        title: '下载成功',
                                        mask: true,
                                        duration: 1000
                                    })
                                }
                            })
                        },
                        fail(err) {
                            that.setData({ btnFlag: true });
                            app.globalData.detailsData.writePhotosAlbum = false;
                            wx.showToast({
                                title: '保存失败',
                                mask: true,
                                duration: 1000
                            })
                        }
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        if (options.url.indexOf('http://') != -1) {
            var img = options.url.replace('http://', 'https://')
        }
        this.setData({ url: img})
        console.log(options)
        options = options;
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    onReady: function () {
        // this.getImg();
        let that = this;
        var ctx = wx.createCanvasContext('firstCanvas');
        wx.downloadFile({
            url: that.data.url,
            success(temp) {
                let tempUrl = temp.tempFilePath
                wx.downloadFile({
                    url: 'https://i.s.babyfs.cn/op/1/517a64e9f814451697500d5f17b025e4.jpg',
                    success(res) {
                        let resUrl = res.tempFilePath
                        console.log('resUrl' + resUrl)
                        console.log('tempUrl' + tempUrl)
                        ctx.drawImage(resUrl, 0, 0, 750, 1220)
                        ctx.drawImage(tempUrl, 200, 484, 340, 340)
                        ctx.draw(true, function () {
                            // wx.canvasToTempFilePath这个一定要写在ctx.draw里面的回调里面，是坑勿跳
                            wx.canvasToTempFilePath({
                                canvasId: 'firstCanvas',
                                destWidth: 750,
                                destHeight: 1220,
                                // quality: 1,
                                success: function (res) {
                                    let tempP = res.tempFilePath;
                                    console.log(res.tempFilePath)
                                    console.log('tempFilePath')
                                    // callback(res.tempFilePath)
                                    savedFilePath = tempP;
                                },
                                fail: function (res) {
                                    console.log(res)
                                }
                            })
                        })
                    }
                })
            }
        })
    }

})