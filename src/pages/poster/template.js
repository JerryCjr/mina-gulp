
const app = getApp()
let ajax = require('../../utils/ajax.js')
let util = require('../../utils/util.js')
let id = '';
let copyWritersLen = 0,
    num = 0,
    msg = '',
    scale = 1,
    urlPoster = '',
    urlQr = '',
    left, top, width, height, qrSize, savedFilePath, posterType, poster,
    btnOff = true

Page({
    data: {
        id: 'cropper',
        width: 500,
        height: 500,
        minScale: 1,
        maxScale: 2.5,
        URL: '',
        detail: {
            proQrUrl: '',
            qrSize: '',
            x: '',
            y: '',
        },
        item: {
            url: '',
            width: 0,
            height: 0,
            showMack: false,
            isShow: false,
            congratulations: false,
            btnOff: false,
            src: '',
            poster_id: '',
            copyWriters: '',
            text: '',
            downloadLoading: false,
            bolShow: true,
            posterWidth: wx.getSystemInfoSync().screenWidth,
            posterHeight: wx.getSystemInfoSync().screenHeight
        }
    },
    onReady: function () {
        var that = this
        this.setData({
            ["item.src"]: app.globalData.detailsData.img,
            ["item.poster_id"]: app.globalData.detailsData.id
        })
        wx.setNavigationBarTitle({
            title: app.globalData.detailsData.postersName
        })
        var context = wx.createCanvasContext('firstCanvas')
        if (!app.globalData.detailsData.writePhotosAlbum) {
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        that.setData({ ["item.bolShow"]: false })
                    } else {
                        that.setData({ ["item.bolShow"]: true })
                    }
                }
            })
        }
        if (posterType == 3) {
            this.setData({ ["item.showMack"]: true })
            if (id == 1) {
                ajax.GET({
                    url: "/poster/amb/mp_qrcode",
                    data: {
                        id: that.data.item.poster_id
                    },
                    success(res) {
                        if (res.data.success) {
                            console.log(res)
                            that.setData({ ["item.showMack"]: false })
                            savedFilePath = res.data.data
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                color: '#fff',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    }
                })
            }else{
                ajax.GET({
                    url: "/poster/mp_qrcode",
                    data: {
                        id: that.data.item.poster_id
                    },
                    success(res) {
                        if (res.data.success) {
                            that.setData({ ["item.showMack"]: false })
                            savedFilePath = res.data.data
                        } else {
                            wx.showToast({
                                title: res.data.msg,
                                color: '#fff',
                                icon: 'none',
                                duration: 2000
                            })
                        }

                    }
                })
            }
        }
       
        let url = '';
        if (id == 1) {
            url = '/poster/amb/detail?id=' + that.data.item.poster_id
        } else {
            url = '/poster/detail?id=' + that.data.item.poster_id
        }
        ajax.GET({
            url: url,
            success: function (res) {
                var copyWriters = JSON.parse(res.data.data.copyWriters)[0]
                if (copyWriters === undefined) {
                    copyWriters = ''
                }
                that.setData({
                    ["detail.qrSize"]: res.data.data.qrSize,
                    ["detail.x"]: res.data.data.xQrCoord,
                    ["detail.y"]: res.data.data.yQrCoord,
                    ["item.copyWriters"]: JSON.parse(res.data.data.copyWriters),
                    ["item.text"]: copyWriters
                })
                if (res.data.data.bgWidth == 1334 && res.data.data.bgHeight == 918) {
                    that.setData({ ["item.posterSizeStyleBool"]: false })
                } else {
                    // 海报适配
                    that.setData({ ["item.posterSizeStyleBool"]: true })
                    width = that.data.item.posterWidth
                    height = that.data.item.posterHeight
                    qrSize = width / 375 * (that.data.detail.qrSize / 2)
                    left = (width / 375 * that.data.detail.x) / 2
                    top = (height / 667 * that.data.detail.y) / 2

                    // 针对大屏手机
                    if (that.data.item.posterHeight >= 800) {
                        width = 375
                        height = 667
                        qrSize = that.data.detail.qrSize / 2
                        left = that.data.detail.x / 2
                        top = that.data.detail.y / 2
                    }
                }
                if (res.data.success) {
                    copyWritersLen = JSON.parse(res.data.data.copyWriters).length
                    if (res.data.data.proQrUrl) {
                        if (res.data.data.proQrUrl.indexOf('http://') != -1) {
                            var proQrUrl = res.data.data.proQrUrl.replace('http://', 'https://')
                            that.setData({ ["detail.proQrUrl"]: proQrUrl })
                        }
                    }
                    if (posterType == '0' || posterType == '1' || posterType == '5') {
                        savedFilePath = res.data.data.posterUrl
                        if (!savedFilePath) {
                            wx.showToast({
                                title: 'posterUrl为空',
                                mask: true,
                                duration: 1000
                            })
                        } 
                    }
                    msg = ''
                } else {
                    if (posterType == '0') {
                        if (res.data.code === 10012) {
                            msg = '抱歉，您的小秘书号微信二维码审核未通过，暂无法保存打卡图海报，请联系总部人员。'
                        } else if (res.data.code === 10011) {
                            msg = '抱歉，您的小秘书号微信二维码仍在审核中，暂无法保存打卡图海报，请联系总部人员。'
                        } else if (res.data.code === 10010) {
                            msg = '抱歉，您还未上传小秘书号微信二维码到推广人中心，暂无法保存打卡图海报，请先登录推广人中心上传微信二维码。。'
                        }
                    } else {
                        if (res.data.code === 10012) {
                            msg = '抱歉，你的二维码审核未通过，您可以选择手动上传二维码。'
                        } else if (res.data.code === 10011) {
                            msg = '抱歉，您的二维码仍在审核中，您可以选择手动上传二维码。'
                        } else if (res.data.code === 10010) {
                            msg = '你还没有上传二维码到推广人中心哟，您可以选择手动上传二维码。'
                        }
                    }

                }
            },
            fail: function () {
                wx.showToast({
                    title: '数据获取失败',
                    mask: true,
                    duration: 1000
                })
            }
        })
    },

    onLoad: function (options) {
        id = options.id;
        posterType = options.postersType
    },

    // 图片下载
    canvasToImage() {
        var that = this
        if (msg == '' || msg == '二维码已经生成') {
            this.generatingPoster()
        } else {
            if (posterType == '0' || posterType == '1' || posterType == '5') {
                wx.showModal({
                    title: '提示',
                    content: msg,
                    success: function (res) {
                        if (res.confirm) {

                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: msg,
                    success: function (res) {
                        if (res.confirm) {
                            that.chooseimage()
                        }
                    }
                })
            }
        }
    },
    generatingPoster() {
        var that = this
        that.setData({ ["item.downloadLoading"]: true })
        var params = {
            img_url: app.globalData.detailsData.img,
            qr_size: this.data.detail.qrSize,
            x_qr_coord: this.data.detail.x,
            y_qr_coord: this.data.detail.y
        }
        if (posterType == 0 || posterType == 1 || posterType == 3 || posterType == 5) {
            params.qr_content = savedFilePath
            params.qr_url = ''
            this.synthesisPoster(params, that)
        } else {
            params.qr_content = ''
            params.qr_url = this.data.detail.proQrUrl
            this.synthesisPoster(params, that)
        }
    },

    // 请求后端接口合成海报
    synthesisPoster(params, that) {
        if (msg == '二维码已经生成') {
            that.save()
        } else {
            wx.request({
                url: 'https://m.babyfs.cn/act/usa/merge_poster_img',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'X-Auth-Token': wx.getStorageSync('token')
                },
                data: params,
                method: 'POST',
                success: function (res) {
                    wx.downloadFile({
                        url: res.data.data,
                        success: function (res) {
                            if (res.statusCode === 200) {
                                poster = res.tempFilePath
                                that.save(posterType)
                            } else {
                                wx.showToast({
                                    title: '图片下载失败',
                                    mask: true,
                                    duration: 1000
                                })
                            }
                        }
                    })
                },
                fail: function () {
                }
            });
        }
    },

    // test 切换
    change() {
        var that = this
        num >= copyWritersLen - 1 ? num = 0 : num++
        this.setData({
            ["item.text"]: that.data.item.copyWriters[num]
        })
    },

    // close 弹窗
    close() {
        this.setData({
            ["item.congratulations"]: false
        })
    },

    // copy 文本
    copy() {
        wx.showToast({
            title: '已复制到剪贴版',
            icon: 'success',
            duration: 1000
        })
        var that = this
        wx.setClipboardData({
            data: that.data.item.text,
            success() {
            }
        })
        wx.getClipboardData({
            success(res) {
            }
        })
    },

    //调用相册
    chooseimage: function () {
        var that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var tempFilePaths = res.tempFilePaths[0]
                this.setData({ ["item.isShow"]: true })
                that.initCanvas(tempFilePaths)
            }.bind(this)
        })
    },

    // 图片提取并且保存
    save(posterType) {
        var that = this
        that.saveToAlbum(poster)
    },

    // 将图片保存到本地相册
    saveToAlbum(URL){
        var that = this
        wx.getSetting({
            success(res) {
                if (!res['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success(res) {
                            app.globalData.detailsData.writePhotosAlbum = true
                            wx.saveImageToPhotosAlbum({
                                filePath: URL,
                                success(res) {
                                    btnOff = true
                                    that.setData({ ["item.downloadLoading"]: false })
                                    wx.showToast({
                                        title: '下载成功',
                                        mask: true,
                                        duration: 1000
                                    })
                                    ajax.GET({
                                        url: `/poster/poster_make_rec?id=${app.globalData.detailsData.id}`,
                                        success: function (res) {
                                        }
                                    })
                                    setTimeout(function () {
                                        var itemText = that.data.item.copyWriters[0]
                                        if (itemText == null) {
                                            itemText = ''
                                        }
                                        that.setData({
                                            ["item.congratulations"]: true,
                                            ["item.text"]: itemText
                                        })
                                    }, 500)
                                }
                            })
                        },
                        fail(err) {
                            app.globalData.detailsData.writePhotosAlbum = false
                            that.setData({
                                ["item.bolShow"]: false,
                                ["item.downloadLoading"]: false
                            })
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

    handleSetting: function (e) {
        let that = this;
        // 对用户的设置进行判断，如果没有授权，即使用户返回到保存页面，显示的也是“去授权”按钮；同意授权之后才显示保存按钮
        wx.openSetting({
            success: function success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    btnOff = true
                    wx.showModal({
                        title: '警告',
                        content: '若不打开授权，则无法将图片保存在相册中！',
                        showCancel: false
                    })
                    that.setData({
                        saveImgBtnHidden: true,
                        openSettingBtnHidden: false,
                        ["item.bolShow"]: false
                    })
                } else {
                    btnOff = true
                    wx.showModal({
                        title: '提示',
                        content: '您已授权，赶紧将图片保存在相册中吧！',
                        showCancel: false
                    })
                    that.setData({
                        saveImgBtnHidden: false,
                        openSettingBtnHidden: true,
                        ["item.bolShow"]: true
                    })
                }
            },
            fail: function (err) {
                console.log(err)
            }
        });
        
    },

    getDevice() {
        let self = this
        !self.device && (self.device = wx.getSystemInfoSync())
        return self.device
    },

    initCanvas(src) {
        let self = this
        scale = 1
        wx.getImageInfo({
            src,
            success(res) {
                let { id, width, height } = self.data
                let device = self.getDevice()
                let aspectRatio = res.height / res.width

                self.aspectRatio = aspectRatio
                self.cropperTarget = src
                //裁剪尺寸
                self.cropperWidth = width * device.windowWidth / 750
                self.cropperHeight = height * device.windowWidth / 750
                var minRatio = res.height / self.cropperHeight
                if (minRatio > res.width / self.cropperWidth) {
                    minRatio = res.width / self.cropperWidth
                }
                //图片放缩的尺寸
                self.scaleWidth = res.width / minRatio
                self.scaleHeight = res.height / minRatio
                self.initScaleWidth = self.scaleWidth
                self.initScaleHeight = self.scaleHeight
                //canvas绘图起始点（注意原点会被移动到canvas区域的中心）
                if (self.cropperWidth < self.scaleWidth) {
                    self.startX = (self.cropperWidth - self.scaleWidth) / 2 - self.cropperWidth / 2
                    self.startY = -self.cropperHeight / 2
                } else {
                    self.startX = -self.cropperWidth / 2
                    self.startY = (self.cropperHeight - self.scaleHeight) / 2 - self.cropperHeight / 2
                }

                self.oldScale = 1
                self.rotate = 0 //单位：°

                //  画布绘制图片
                self.ctx = wx.createCanvasContext(id)
                self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
                self.ctx.drawImage(src, self.startX, self.startY, self.scaleWidth, self.scaleHeight)

                self.ctx.draw()
            }
        })
    },

    //图片手势初始监测
    uploadScaleStart(e) {
        let self = this
        let xMove, yMove
        let [touch0, touch1] = e.touches
        self.touchNum = 0 //初始化，用于控制旋转结束时，旋转动作只执行一次

        //计算第一个触摸点的位置，并参照该点进行缩放
        self.touchX = touch0.x
        self.touchY = touch0.y
        self.imgLeft = self.startX
        self.imgTop = self.startY

        // 单指手势时触发
        e.touches.length === 1 && (self.timeOneFinger = e.timeStamp)

        // 两指手势触发
        if (e.touches.length >= 2) {
            self.initLeft = self.imgLeft / self.oldScale
            self.initTop = self.imgTop / self.oldScale

            //计算两指距离
            xMove = touch1.x - touch0.x
            yMove = touch1.y - touch0.y
            self.oldDistance = Math.sqrt(xMove * xMove + yMove * yMove)
            self.oldSlope = yMove / xMove
        }
    },

    //图片手势动态缩放
    uploadScaleMove: function (e) {
        var self = this
        fn(self, e)
    },

    //确认裁切
    getCropperImage() {
        var that = this
        var { id } = that.data;
        wx.canvasToTempFilePath({
            canvasId: id,
            success(res) {
                var tempFilePath = res.tempFilePath
                var context = wx.createCanvasContext('firstCanvas')
                wx.downloadFile({
                    url: that.data.item.src,
                    success: function (res) {
                        if (res.statusCode === 200) {
                            context.drawImage(res.tempFilePath, 0, 0, width, height)
                            context.drawImage(tempFilePath, left, top, qrSize, qrSize)
                            context.draw(false, function () {
                                wx.showToast({
                                    title: '二维码已生成',
                                    mask: true,
                                    duration: 1000
                                })
                                msg = '二维码已经生成'
                                setTimeout(() => {
                                    that.setData({ ["item.isShow"]: false })
                                }, 1100)
                            })
                        }
                    }
                })
            },
            fail: function () {
                wx.showToast({
                    title: '保存失败',
                    icon: 'loading',
                    duration: 1000
                })
            }
        })
    }
})

//fn:延时调用函数
var x = 0;
var y = 0;
var throttle = function (fn, delay, mustRun) {
    var timer = null,
        previous = null;

    return function () {
        var now = +new Date(),
            context = this,
            args = arguments;
        if (!previous) previous = now;
        var remaining = now - previous;
        if (mustRun && remaining >= mustRun) {
            fn.apply(context, args);
            previous = now;
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    }
}

function drawOnTouchMove(self, e) {

    let { minScale, maxScale } = self.data
    let [touch0, touch1] = e.touches
    let xMove, yMove, newDistance, newSlope
    if (e.timeStamp - self.timeOneFinger < 100) {//touch时长过短，忽略
        return
    }
    // 单指手势时触发
    if (e.touches.length === 1) {
        //计算单指移动的距离
        xMove = touch0.x - self.touchX
        yMove = touch0.y - self.touchY

        self.imgLeft = self.startX - self.scaleWidth * 0.1 * scale + xMove
        self.imgTop = self.startY - self.scaleHeight * 0.1 * scale + yMove
        avoidCrossBorder(self)
        self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
        self.ctx.drawImage(self.cropperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
        self.ctx.draw()
    }
    // 两指手势触发
    if (e.touches.length >= 2) {
        // self.timeMoveTwo = e.timeStamp
        // 计算二指最新距离
        xMove = touch1.x - touch0.x
        yMove = touch1.y - touch0.y
        newDistance = Math.sqrt(xMove * xMove + yMove * yMove)
        self.newSlope = yMove / xMove

        //  使用0.005的缩放倍数具有良好的缩放体验
        //self.newScale = self.oldScale + 0.005 * (newDistance - self.oldDistance)
        newDistance > self.oldDistance ? scale += 0.02 : scale -= 0.02

        //  设定缩放范围
        scale <= minScale && (scale = minScale)
        scale >= maxScale && (scale = maxScale)
        self.scaleWidth = scale * self.initScaleWidth
        self.scaleHeight = scale * self.initScaleHeight
        self.imgLeft = scale * self.initLeft
        self.imgTop = scale * self.initTop

        avoidCrossBorder(self)

        self.ctx.translate(self.cropperWidth / 2, self.cropperHeight / 2)
        self.ctx.drawImage(self.cropperTarget, self.imgLeft, self.imgTop, self.scaleWidth, self.scaleHeight)
        self.ctx.draw()
    }
}

//防止图片超出canvas边界
function avoidCrossBorder(self) {
    if (self.imgLeft < -(self.scaleWidth - self.cropperWidth / 2)) {
        self.imgLeft = -(self.scaleWidth - self.cropperWidth / 2)
    } else if (self.imgLeft > -self.cropperWidth / 2) {
        self.imgLeft = -self.cropperWidth / 2
    }
    if (self.imgTop < -(self.scaleHeight - self.cropperHeight / 2)) {
        self.imgTop = -(self.scaleHeight - self.cropperHeight / 2)
    } else if (self.imgTop > -self.cropperHeight / 2) {
        self.imgTop = -self.cropperHeight / 2
    }
}
//为drawOnTouchMove函数节流
const fn = throttle(drawOnTouchMove)