const app = getApp();
let ajax = require('../../utils/ajax.js');
let phone = '';
let code = '';
let options1 = '';
Page({
    data: {
        phone: ''
    },
    checkMobile: function (e) {
        phone = e.detail.value;
    },
    checkCode: function (e) {
        code = e.detail.value;
    },
    getCode: function () {
        if (/^1[3456789]\d{9}$/.test(phone)) {
            ajax.POST({
                url: '/user/sms_code/mobile_new',
                data: {
                    mobile: phone
                },
                success: function (res) {
                    if (res.data.success) {
                        wx.showToast({
                            title: '短信发送成功',
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (res) {
                    wx.showToast({
                        title: res.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
            
        } else {
            wx.showToast({
                title: '手机号格式不对',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
        }
        // if (phone === '') {
        //     wx.showToast({
        //         title: '手机号不能为空哦',
        //         color: '#fff',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // } else {
        //     if (!/^1[3456789]\d{9}$/.test(phone)) {
        //         wx.showToast({
        //             title: '手机号格式不对',
        //             color: '#fff',
        //             icon: 'none',
        //             duration: 2000
        //         })
        //     } else {
        //         ajax.POST({
        //             url: '/user/sms_code/mobile_new',
        //             data: {
        //                 mobile: phone
        //             },
        //             success: function (res) {
        //                 if (res.data.success) {
        //                     wx.showToast({
        //                         title: '短信发送成功',
        //                         color: '#fff',
        //                         icon: 'none',
        //                         duration: 2000
        //                     })
        //                 } else {
        //                     wx.showToast({
        //                         title: res.data.msg,
        //                         color: '#fff',
        //                         icon: 'none',
        //                         duration: 2000
        //                     })
        //                 }
        //             },
        //             fail: function (res) {
        //                 wx.showToast({
        //                     title: res.errMsg,
        //                     color: '#fff',
        //                     icon: 'none',
        //                     duration: 2000
        //                 })
        //             }
        //         })
        //     }
        // }
    },
    submit: function () {
        console.log(options1);
        let mobileReg = /^1[3456789]\d{9}$/;
        let smsCode = /^\d{6}$/;
        if (mobileReg.test(phone) && smsCode.test(code)) {
            let parms = {
                mobile: phone,
                sms_code: code
            };
            ajax.POST({
                url: '/m/wx/bind_mobile',
                data: parms,
                success: function (res) {
                    if (res.data.success) {
                        if (options1) {
                            wx.redirectTo({
                                url: '/pages/invite_page/invited_page?types=' + options1.types + '&invite_id=' + options1.invite_id + '&pt=' + options1.pt + '&c_id=' + options1.c_id,
                            })
                        } else {
                            wx.redirectTo({
                                url: '/pages/home/home',
                            })
                        }
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            color: '#fff',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                fail: function (res) {
                    wx.showToast({
                        title: res.errMsg,
                        color: '#fff',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        } else {
            wx.showToast({
                title: '手机号或验证码有误，请重新填写',
                color: '#fff',
                icon: 'none',
                duration: 2000
            })
        }

    },
    onLoad(options) {
        options1 = options;
        console.log(options);
    },
    onShow() {
    },
})