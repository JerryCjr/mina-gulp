const app = getApp()
let mobile, password, account_type = 0, code;
let _authUserInfo = false, _authRec = false;
Page({
    data: {
        errorMsg: '',
        times: '获取验证码',
        flag: false,
        types: ''
    },
    checkMobile: function (e) {
        mobile = e.detail.value;
    },
    inputPassword: function (e) {
        password = e.detail.value
    },
    checkCode: function (e) {
        code = e.detail.value
    },
    getCode: function () {
        let that = this;
        let reg = /^1[0-9]{10}$/;
        let time = 60;
        let timer = null;
        console.log(mobile)
        console.log(22222)
        if (!reg.test(mobile)) {
            mobile = undefined;
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none',
                mask: true,
                duration: 2000
            });
            return
        }
        let para = {
            mobile: mobile
        }
        if (that.data.types === '1') {
            wx.request({
                url: app.globalData.host + '/api/user/sms_code/register',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: para,
                method: 'POST',
                success: function (res) {
                    if (res.data.success) {
                        wx.showToast({
                            title: '短信已发送，请注意接收',
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                        clearInterval(timer);
                    }
                }
            })
        } else {
            wx.request({
                url: app.globalData.host + '/api/user/sms_code/reset_pass',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: para,
                method: 'POST',
                success: function (res) {
                    if (res.data.success) {
                        wx.showToast({
                            title: '短信已发送，请注意接收',
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                        clearInterval(timer);
                    }
                }
            })
        }
        
        timer = setInterval(function() {
            time--;
            that.setData({
                times: time + '(S)',
                flag: true
            })
            if (time <= 0) {
                that.setData({
                    times: '获取验证码',
                    flag: false
                })
                clearInterval(timer);
            }
        }, 1000)
    },
    register: function () {
        let that = this;
        let regMobile = /^1[0-9]{10}$/
        let regCode = /^[0-9]{6}$/
        let regPwd = /^(\S){6,20}$/;
        let mobileFlag = regMobile.test(mobile);
        let codeFlag = regCode.test(code);
        let pwdFlag = regPwd.test(password);
        console.log(pwdFlag)
        console.log(pwdFlag)
        console.log(mobileFlag)
        if (!mobileFlag) {
            wx.showToast({
                title: "手机号格式有误",
                icon: 'none'
            })
            return;
        }
        if (!codeFlag) {
            wx.showToast({
                title: "验证码格式有误",
                icon: 'none'
            })
            return;
        }
        if (!pwdFlag) {
            wx.showToast({
                title: "密码格式有误",
                icon: 'none'
            })
            return;
        }
        let data = {
            mobile: mobile,
            password: password,
            sms_code: code
        }
        if (that.data.types === '1') {
            wx.request({
                url: app.globalData.host + '/api/user/register',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function (res) {
                    let data = res.data
                    if (data.success) {
                        wx.showToast({
                            title: '注册成功,请前往登录',
                            icon: 'success',
                            success: function () {
                                wx.redirectTo({
                                    url: '/pages/login/login',
                                })
                            }
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                    }
                }
            })
        } else {
            wx.request({
                url: app.globalData.host + '/api/user/reset_password',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function (res) {
                    let data = res.data
                    if (data.success) {
                        wx.showToast({
                            title: '修改成功,请前往登录',
                            icon: 'success',
                            success: function () {
                                wx.redirectTo({
                                    url: '/pages/login/login',
                                })
                            }
                        })
                    } else {
                        wx.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            mask: true,
                            duration: 2000
                        });
                    }
                }
            })
        }
    },
    onLoad(options) {
        this.setData({
            types: options.type
        })
    },
})