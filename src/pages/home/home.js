// pages/home/index/index.js
const app = getApp();
let ajax = require('../../utils/ajax.js');
let util = require('../../utils/util.js');
let userName = '';
let codeImg = '';
let bindTime = '';
let qrCodeURL = '';
let staNumber = '';
let authSetting = '';
let id = '';
let c_id = '';
let _entryQrcodeImgUrl = '';
let RouterList = []
let leader = -1;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userName: '',
        userPhoto: '',
        loginFlag: false,
        tokenFlag: false,
        positionName: '',
        stationNumber: '',
        batch: '',
        promoter: '',
        flag: true,
        contactDialogIsShow: false,
        entryNewProIsShow: false,
        modalFlag: false,
        hasValidRobot: 0,
        assistantStatus: -1,
        originalUid: 0,
        appUid: 0,
        appPageIndex: -1,
        appUt: '',
        isCheckoutToken: false,
        replaceIdentityDialog: false,
        userProfile: {},
        skipPageName: '回到主页',
        promoterType: 0
    },

    getAuthSetting: function () {
        let that = this;
        if (wx.getStorageSync('token')) {
            that.getManager()
        } else { 
            wx.getSetting({
              success: function success(res) {
                if (res.authSetting['scope.userInfo']) {
                  that.setData({
                      loginFlag: false,
                      modalFlag: false
                  })
                  that.getUserInfo();
                } else {
                  that.setData({
                    loginFlag: true,
                  })
                }
              }
            });
        }
    },

    linkToPersonal: function () {
        var that = this;
        wx.getSetting({
            success: function success(res) {
                authSetting = res.authSetting;
                console.log(authSetting)
                if (authSetting['scope.userInfo'] === false) {
                    that.setData({ modalFlag: true })
                    // wx.showModal({
                    //     title: '用户未授权',
                    //     content: '请点击“确定”并在授权管理中开启“用户信息”后，返回即可正常参加活动',
                    //     showCancel: false,
                    //     success: function (res) {
                    //         if (res.confirm) {
                    //             wx.openSetting({
                    //                 success: function success(res) {
                    //                     if (res.authSetting['scope.userInfo']) {
                    //                         that.getUserInfo(that.getManager);
                    //                     }
                    //                 }
                    //             });
                    //         }
                    //     }
                    // })
                } else {
                    that.setData({ modalFlag: false })
                    that.getUserInfo(that.getManager);
                }
            }
        })
    },

    getUserInfo: function (callback) {
        var that = this;
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                app.globalData.iv = res.iv;
                app.globalData.encryptedData = res.encryptedData;
                that.loginBabyfs(that.getManager);
            }
        })  
    },

    loginBabyfs: function (callback) {
        var that = this;
        if (wx.getStorageSync('token')) {
            if (callback) {
                callback();
            }
        } else {
            var data = {
                wx_session_id: wx.getStorageSync('session_id'),
                wx_encrypted_data: app.globalData.encryptedData,
                wx_iv: app.globalData.iv
            }
            wx.request({
                url: app.globalData.host + '/api/user/wxx_login',
                header: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: data,
                method: 'POST',
                success: function (res) {
                    var data = res.data
                    if (data.success) {
                        wx.setStorageSync('token', data.data.token);
                        wx.setStorageSync('uid', data.data.user.id);
                        that.judgeNewPro();
                        if (callback) {
                            callback();
                        }
                    } else {
                        wx.showModal({
                            title: '失败:' + data.code,
                            content: data.msg,
                            showCancel: false
                        })
                    }
                },
                fail: function (res) {
                    wx.hideLoading();
                    wx.showModal({
                        title: '错误',
                        content: res.data.msg,
                    })
                }
            })
        }
    },

    getManager: function () {
        let that = this;
        ajax.GET({
            url: '/user/profile',
            success: function (res) {
                if (res.data.success) {
                    if (res.data.data.user.mobile) {
                        that.getInfo();
                    } else {
                        wx.navigateTo({
                            url: '/pages/login/bindMobile',
                        })
                    }
                } else {
                    app.catchFunc(res);
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },

    getInfo: function () {
        let that = this;
        ajax.GET({
            url: '/promoter/center/info_v2',
            success: function (res) {
                if (res.data.success) {
                    that.setData({
                        promoterType: res.data.data || 0
                    })
                    app.globalData.promoterType = res.data.data || 0
                    if (res.data.data == 5) {
                        that.getDashi();
                    } else if (res.data.data == 0) {
                        wx.redirectTo({
                            url: '/pages/invite_page/invite_page?c_id=' + c_id,
                        })
                    } else if (res.data.data == 6) {
                        that.getDashi();
                    } else {
                        that.getGuwen();
                    }
                } else {
                    app.catchFunc(res);
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },

    getDashi: function () {
        let that = this;
        this.setData({flag: false});
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/ambassador/info',
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    var user = res.data.data.user;
                    that.setData({
                        // userName: user.weChatName,
                        userPhoto: user.photo
                    });
                    if (res.data.data.ambassador) {
                        staNumber = res.data.data.ambassador.stationNumber;
                        if (res.data.data.ambassador.name) {
                            userName = res.data.data.ambassador.name;
                            that.setData({
                                userName: userName,
                                stationNumber: staNumber,
                                batch: res.data.data.ambassador.batch,
                                positionName: '推广大使',
                            })
                        } else {
                            userName = res.data.data.user.name;
                            that.setData({
                                userName: userName,
                                stationNumber: staNumber,
                            })
                        }
                    }
                    
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },

    getGuwen: function () {
        var that = this;
        this.setData({ flag: true });
        wx.showLoading({
            title: '加载中...',
        })
        ajax.GET({
            url: '/m/promoter/info3',
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    var user = res.data.data.user;
                    var promoter = res.data.data.promoter;
                    that.setData({
                        // userName: user.weChatName,
                        userPhoto: user.photo
                    });
                    if (res.data.data.user.mobile) { } else {
                        wx.redirectTo({
                            url: '/pages/login/bindMobile'
                        })
                        return;
                    }
                    if (promoter) {
                        codeImg = promoter.mpParamImgUrl;
                        bindTime = promoter.mpParamExpire;
                        qrCodeURL = promoter.qrCodeURL;
                        staNumber = promoter.stationNumber;
                        leader = promoter.leaderType;
                        let pn = '';
                        if (promoter.positionName == '见习推广人') {
                            pn = '见习启蒙顾问';
                        } else if (promoter.positionName == '新推广人') {
                            pn = '新启蒙顾问';
                        } else if (promoter.positionName == '老推广人') {
                            pn = '老启蒙顾问';
                        }   
                        that.setData({
                            positionName: pn,
                            stationNumber: res.data.data.promoter.stationNumber,
                            batch: res.data.data.promoter.batch,
                            // userName: res.data.data.promoter.name,
                            promoter: res.data.data.promoter,
                            assistantStatus: res.data.data.assistantStatus,
                            hasValidRobot: res.data.data.hasValidRobot
                        })
                        if (res.data.data.promoter.leaderType === 1) {
                            userName = res.data.data.promoter.groupName;
                            that.setData({
                                userName: res.data.data.promoter.groupName,
                            })
                        } else {
                            if (res.data.data.promoter.name) {
                                userName = res.data.data.promoter.name;
                                that.setData({
                                    userName: res.data.data.promoter.name,
                                })
                            } else {
                                userName = res.data.data.user.name;
                                that.setData({
                                    userName: res.data.data.user.name,
                                })
                            }
                        }
                    } else {
                        if (res.data.data.apply) {
                            wx.redirectTo({
                                url: '/pages/login/statPage'
                            })
                        } else {
                            wx.redirectTo({
                                url: '/pages/login/completeInfo'
                            })
                        }
                    }
                } else {
                    wx.hideLoading();
                    wx.showModal({
                        title: '提醒',
                        content: res.data.msg,
                        showCancel: false
                    })
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showModal({
                    title: '错误',
                    content: res.data.msg,
                })
            }
        })
    },

    navTo: function (e) {
        var name = e.currentTarget.dataset.name;
        if (!userName) {
            wx.showModal({
                title: '失败',
                content: '请先登录',
                showCancel: false
            })
        } else {
            app.globalData.linkCode = codeImg;
            app.globalData.bindTime = bindTime;
            app.globalData.qrCodeURL = qrCodeURL;
            app.globalData.staNumber = staNumber;
            app.globalData.shop_url = this.data.promoter.retailerUrl;
            switch (name) {
                case '工资查询':
                    // wx.showToast({
                    //     title: '此功能还没开放，尽请期待哦~',
                    //     icon: 'none',
                    //     mask: true,
                    //     duration: 2000
                    // });
                    wx.navigateTo({
                        url: '../salary/salary?id=2',
                    })
                    break;
                case '学员管理':
                    wx.navigateTo({
                        url: '../personal/personal',
                    })
                    break;
                case '课程链接':
                    wx.navigateTo({
                        url: '../training/training',
                    })
                    break;
                case '绑定链接':
                    
                    wx.navigateTo({
                        url: '../bindLink/bindLink',
                    })
                    break;
                case '业务报表':
                    wx.navigateTo({
                        url: '../business/business',
                    })
                    break;
                case '海报小程序':
                    wx.navigateTo({
                        url: '../poster/poster',
                    })
                    break;
                case '打卡图':
                    wx.navigateTo({
                        url: '../punch_card/punch_card',
                    })
                    break;
                case '知识库':
                    wx.navigateTo({
                        // url: '../knowledge/knowledge',
                        url: '/pages/knowledge/knowledgeWeb?stationNumber=' + staNumber + '&type=' + 1,
                    })
                    break;
                case '入门课二维码':
                    wx.navigateTo({
                        url: '../primerCode/primerCode?url=' + this.data.promoter.miniAppImgUrl,
                    })
                    break;
                case '宝玩商城':
                    wx.navigateTo({
                        url: '../baby_shop/baby_shop?src=' + this.data.promoter.retailerQrcodeUrl,
                    })
                    break;
            }
        }
    },

    proNavTo: function (e) {
        var name = e.currentTarget.dataset.name;
        var id = e.currentTarget.dataset.id;
        if (!userName) {
            wx.showModal({
                title: '失败',
                content: '请先登录',
                showCancel: false
            })
        } else {
            switch (name) {
                case '工资查询':
                    wx.navigateTo({
                        url: '../salary/salary?id=1',
                    })
                    break;
                case '学员管理':
                    wx.navigateTo({
                        url: '../pro_personal/pro_personal',
                    })
                    break;
                case '招生海报':
                    wx.navigateTo({
                        url: '../pro_poster/pro_poster',
                    })
                    break;
                case '邀请管理':
                    wx.navigateTo({
                        url: '../pro_invite_manage/pro_invite_manage?id=' + id + '&activeIdx=0',
                    })
                    break;
                case '邀请好友':
                    wx.navigateTo({
                        url: '../pro_invite_f/pro_invite_f?invite_id=' + wx.getStorageSync('uid') + '&id=' + id + '&leader=' + leader,
                    })
                    break;
                case '收益说明':
                    wx.navigateTo({
                        url: '../pro_explain/pro_explain',
                    })
                    break;
                case '知识库':
                    wx.navigateTo({
                        url: '/pages/knowledge/knowledgeWeb?stationNumber=' + staNumber + '&type=' + 2,
                    })
                    break;
            }
        }
    },

    myInfo: function (e) {
        let that = this;
        let name = e.currentTarget.dataset.name;
        if (name) {
            wx.navigateTo({
                url: '/pages/myInfo/myInfo?flag=' + that.data.flag,
            })
        } else {
            wx.showModal({
                title: '失败',
                content: '请先登录',
                showCancel: false
            })
        }

    },

    logoutFun: function () {
        wx.showModal({
            title: '提示',
            content: '您确定要注销登录吗？',
            success: function (res) {
                if (res.confirm) {
                    ajax.GET({
                        url: '/user/logout',
                        success: function (res) {
                            if (res.data.success) {
                                // wx.clearStorageSync();
                                wx.redirectTo({
                                    url: '/pages/login/login'
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '注销失败，请重试'
                                })
                            }
                        }
                    })
                }
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },

    loginFun: function () {
        wx.redirectTo({
            url: '/pages/login/login',
        })
    },

    // 调出客服弹窗
    junpContactDialog: function() {
        wx.navigateTo({
            url: '../new_pro_enter/new_pro_enter?qrcodeImg=' + _entryQrcodeImgUrl
        })
    },

    // 判断新人必进入口是否显示
    judgeNewPro: function() {
        let that = this;
        ajax.GET({
            url: '/m/promoter/batch_qrcode',
            success: function(res) {
                let entryNewProIsShow = false;
                if(res.data.success) {
                    entryNewProIsShow = true;
                    _entryQrcodeImgUrl = res.data.data;
                } else {
                    entryNewProIsShow = false;
                }
                that.setData({
                    entryNewProIsShow: entryNewProIsShow,
                })
            },
            fail: function(err) {
              console.log(err)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     * pages/index/index?uid=12345&pIndex=1&ut=xxxxx(token uriencode)
     */
    onLoad: function (options) {
        id = options.id;
        let appUid = options.uid || 0;
        let appPageIndex = options.pIndex || -1;
        let appUt = options.ut ? decodeURIComponent(options.ut) : '';
        if (appUid > 0 && appUt) {
            this.setData({
                appUid: appUid,
                appPageIndex: appPageIndex,
                appUt: appUt,
                isCheckoutToken: true
            })
        }
        if (options.scene) {
            let scene = decodeURIComponent(options.scene).split(',');
            scene.map(item => {
                if (item.indexOf('c') >= 0) {
                    c_id = item.split('=')[1]
                }
            })
        }
        if (id == 1) {
            this.setData({flag: false})
        } else {
            this.setData({ flag: true})
        }
    },

    /**
     * 生命周期函数--监听页面展示
     */
    onShow: function () {
        let that = this;
        if (that.data.isCheckoutToken) {
            // 校验token
            let originalUid = wx.getStorageSync('uid');
            wx.setStorageSync('token', that.data.appUt);
            wx.setStorageSync('uid', that.data.appUid);
            ajax.GET({
              url: '/user/profile',
              success: function (res) {
                if (res.data.success) {
                  if (res.data.data.user.mobile) {
                    that.replaceIdentity(originalUid)
                    that.setData({
                      isCheckoutToken: false,
                      userProfile: res.data.data.user
                    })
                  } else {
                    wx.navigateTo({
                      url: '/pages/login/bindMobile',
                    })
                  }
                } else {
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
                }
              },
              fail: function (err) {
                wx.showModal({
                  title: '提示',
                  content: '用户信息有误，请重试',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/login/login?from=' + url,
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                });
              }
            })
        } else {
            that.getAuthSetting();
            that.judgeNewPro();
        }
    },

    // 进入招生群管理页面
    junpRecruitGroup: function() {
        var that = this;
        if (!userName) {
            wx.showModal({
                title: '失败',
                content: '请先登录',
                showCancel: false
            })
            return;
        }
        if (that.data.hasValidRobot === 1) {
            wx.navigateTo({
              url: '/pages/recruit_group/group_manage?assistantStatus=' + that.data.assistantStatus + '&hasValidRobot=' + that.data.hasValidRobot + "&stationNumber=" + that.data.stationNumber
           })
        } else {
            wx.showToast({
                title: '此功能还没开放，尽请期待哦~',
                icon: 'none',
                mask: true,
                duration: 2000
            });
        }
    },

    // 从app进入小程序替换身份的回调
    replaceIdentity: function(originalUid) {
        let that = this;
        if(originalUid && (originalUid !== wx.getStorageSync('uid'))) {
            var skipPageName = ''
            // id不匹配用户不相等提示替换
            switch (that.data.appPageIndex) {
              case '1':
                skipPageName = '跳转到学员管理'
                break;
              case '2':
                skipPageName = '跳转到工资查询'
                break;
              case '3':
                skipPageName = '跳转到邀请收益'
                break;
              case '4':
                skipPageName = '跳转到邀请好友'
                break;
              default:
                skipPageName = '回到主页'
            }
            that.setData({
                skipPageName: skipPageName,
                replaceIdentityDialog: true
            })
        } else {
            that.skipFromApp()
        }
    },

    // app进入小程序跳转路径
    skipFromApp: function() {
        var that = this;
        switch (that.data.appPageIndex) {
          case '1':
            wx.navigateTo({
              url: '../pro_personal/pro_personal',
            })
            break;
          case '2':
            wx.navigateTo({
              url: '../salary/salary?id=1',
            })
            break;
          case '3':
            wx.navigateTo({
              url: '../pro_invite_manage/pro_invite_manage?id=1&activeIdx=0',
            })
            break;
          case '4':
            wx.navigateTo({
              url: '../pro_invite_f/pro_invite_f?invite_id=' + wx.getStorageSync('uid') + '&id=1',
            })
            break;
          default:
            
        }
        that.setData({
            replaceIdentityDialog: false
        })
    }
})