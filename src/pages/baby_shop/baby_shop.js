// pages/bindLink/bindLink.js
const app = getApp();
let util = require('../../utils/util.js');
let qrcode = require('../../utils/qrcode.js');
let tempFilePath = '', savedFilePath = '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url: '',
        src: '',
        webViewUrl: ''
    },
    previewImage: function (e) {
        console.log(tempFilePath)
        let that = this;
        let arrImg = [];
        arrImg.push(that.data.src);
        wx.previewImage({
            current: arrImg, // 当前显示图片的http链接
            urls: arrImg // 需要预览的图片http链接列表
        })
    },
    copyFun: function () {
        wx.setClipboardData({
            data: '请点击链接进入宝玩商城：' + this.data.url,
            success: function (res) {
                if (res.errMsg === 'setClipboardData:ok') {
                    wx.showToast({
                        title: '复制成功',
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },

    getImg: function () {
        let that = this;
        qrcode.api.draw(that.data.url, 'qrCode', 200, 200);
    },

    //下载二维码到手机相册
    save() {
        var that = this
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'qrCode',
            success: function (res) {
                var URL = res.tempFilePath
                wx.getSetting({
                    success(res) {
                        console.log(res)
                        if (!res['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success(res) {
                                    wx.saveImageToPhotosAlbum({
                                        filePath: URL,
                                        success(res) {
                                            wx.showToast({
                                                title: '保存成功',
                                                mask: true,
                                                duration: 1000
                                            })
                                        }
                                    })
                                },
                                fail(err) {
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
            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var url = 'https://mall.babyfs.cn'
        if (app.globalData.host !== "https://m.babyfs.cn") {
            url = 'http://mall.dev.babyfs.cn'
        }
        let webViewUrl = url + '/m_mall/pro_shop?token=' + encodeURIComponent(wx.getStorageSync('token'))
        console.log(webViewUrl)
        this.setData({
            webViewUrl: webViewUrl
        })
    }
})
