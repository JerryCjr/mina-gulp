const add = getApp();
let phone = '';
let wx_id = '';
let code = '';
let ajax = require('../../utils/ajax.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        time: '发送验证码',
        flag: false
    },
    sendCode: function () {
        var that = this;
        var time = 60;
        var timer = null;
        let mobileReg = /^1[3456789]\d{9}$/;
        if (!mobileReg.test(phone)) {
            wx.showToast({
                title: '请填写正确的手机号',
                icon: 'none',
                duration: 2000
            })
            return
        }
        timer = setInterval(function () {
            time--;
            that.setData({
                time: time + '(S)',
                flag: true
            })
            if (time <= 0) {
                that.setData({
                    time: '发送验证码',
                    flag: false
                })
                clearInterval(timer);
            }
            
        }, 1000);
        
        ajax.POST({
            url: '/user/sms_code/proWx',
            data: {
                mobile: phone
            },
            success: function (res) {
                if (res.data.success) {
                    wx.showToast({
                        title: '短信发送成功，请注意接收',
                        icon: 'none',
                        duration: 2000
                    })
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        time: '发送验证码',
                        flag: false
                    })
                    clearInterval(timer);
                }
            }
        })
    },
    checkMobile: function (e) {
        phone = e.detail.value;
    },
    checkCode: function (e) {
        code = e.detail.value;
    },
    checkWx: function (e) {
        wx_id = e.detail.value;
    },
    submit: function () {
        let mobileReg = /^1[3456789]\d{9}$/;
        let smsCodeReg = /^\d{6}$/;
        let wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
        // if (!wxreg.test(wx_id)) {
        //     wx.showToast({
        //         icon: 'none',
        //         title: "请输入正确的微信号",
        //         position: 'middle',
        //         duration: 2000
        //     })
        //     return
        // }
        if (mobileReg.test(phone) && smsCodeReg.test(code)) {
            let params = {
                // wx_id: wx_id,
                mobile: phone,
                sms_code: code
            }
            ajax.POST({
                url: '/m/promoterWx/add',
                data: params,
                success: function (res) {
                    if (res.data.success) {
                        wx.showToast({
                            title: '成功添加小秘书，请返回小秘书列表查看',
                        })
                        wx.navigateBack();
                        // wx.navigateTo({
                        //     url: './checkecList'
                        // })
                    } else {
                        wx.showToast({
                            icon: 'none',
                            title: res.data.msg,
                            position: 'middle',
                            duration: 2000
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '手机号或验证码有误，请重新填写',
                icon: 'none',
                position: 'middle',
                duration: 2000
            })
        }
    },
  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {

    },

})