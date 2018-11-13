/*
 * @Author: MuNaipeng 
 * @Date: 2018-09-26 17:56:03 
 * @Last Modified by: MuNaipeng
 * @Last Modified time: 2018-09-29 19:44:20
 */
// pages/train/timetable/timetable.js
const app = getApp();
const ajax = require('../../../utils/ajax.js');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        itemObj: {},
        modalConfig: {},
        link: '',
        isHaveCourse: false,
        isNoneCourse: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        const itemIndex = JSON.parse(options.itemIndex);
        this.init(itemIndex);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //获得modal组件
        this.modal = this.selectComponent("#modal");
    },

    /**
     * @description 初始化
     * @author MuNaipeng
     */
    init(itemIndex) {
        console.log(itemIndex);
        const _this = this;
        // -------------------------------
        ajax.GET({
            url: '/promoter/apply/train/info',
            success: function (res) {
                if (res.data.success) {
                    let itemObj = res.data.data.couseList[itemIndex];
                    console.log(itemObj);
                    itemObj.entity.chinaTime = util.timestampToTime(itemObj.entity.showTime, '月日');
                    itemObj.entity.weekDay = util.timestampToTime(itemObj.entity.showTime, 'week');
                    const nowTimeStamp = new Date().getTime();
                    if (!itemObj.parsed.courseItems || itemObj.parsed.courseItems.length == 0) {
                        _this.setData({ isHaveCourse: false, isNoneCourse: true });
                    } else {
                        itemObj.parsed.courseItems.forEach(el => {
                            el.st = el.startTime == 0 ? '00:00' : util.timestampToTime(el.startTime, 'hm');
                            el.et = el.endTime == 0 ? '23:59' : util.timestampToTime(el.endTime, 'hm');
                            el.isCourse = el.startTime < nowTimeStamp ? true : false;
                        });
                        _this.setData({ isHaveCourse: true, isNoneCourse: false });
                    };
                    _this.setData({ itemObj: itemObj })
                    wx.setNavigationBarTitle({
                        title: res.data.data.trainRangeName //页面标题为路由参数
                    });
                } else {

                }
            }
        })
        // -------------------------------

    },

    /**
     * @description 进入课程
     * @author MuNaipeng
     */
    goStudyEvent(e) {
        console.log(e.currentTarget.dataset.item);
        const _this = this;
        const item = e.currentTarget.dataset.item;
        if (item.type == 0) {
            console.log('link');
            const modalConfig = {
                label: '您的上课地址为：',
                link: item.link,
                type: 'rabbit',
                content: '请将上述地址粘贴至微信对话窗口后打开，授权后即可上课',
                redText: `密码：${item.passwd}`,
                confirmText: '复制地址'
            };
            this.setData({ modalConfig: modalConfig, link: item.link });
            this.modal.showModal();
        } else {
            console.log('wiki');
            wx.navigateTo({ url: '/pages/repository/repository?id=' + item.wikiId });
        }

    },

    /**
     * @description 确认回调
     * @author MuNaipeng
     */
    confirmEvent() {
        const _this = this;
        wx.setClipboardData({
            data: _this.data.link,
            success: function (res) {
                wx.showToast({
                    title: '复制成功',
                    icon: 'none',
                    duration: 2000
                });
                _this.modal.hideModal();
            }
        });
    },
    /**
     * @description 去复习
     * @author MuNaipeng
     */
    goBackEvent() {
        wx.redirectTo({ url: '/pages/train/trainList/trainList' });
    }
})