/*
 * @Author: MuNaipeng 
 * @Date: 2018-09-26 17:55:57 
 * @Last Modified by: MuNaipeng
 * @Last Modified time: 2018-09-29 19:35:36
 */
// pages/train/trainList/trainList.js
const app = getApp();
const ajax = require('../../../utils/ajax.js');
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        a: false,
        modalConfig: {
            title: '恭喜您参加完本期宝玩招募培训课程！',
            content: '请点击“确认”，开始真正的启蒙推广工作吧',
            confirmText: '确认'
        },
        dataObj: {},
        isUsual: false,
        isUnUsual: false,
        isClick: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.init();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onReady() {
        //获得modal组件
        this.modal = this.selectComponent("#modal");
    },

    /**
     * @description init
     * @author MuNaipeng
     */
    init() {
        console.log('init');
        const _this = this;
        ajax.GET({
            url: '/promoter/apply/train/info',
            success: function (res) {
                if (res.data.success) {
                    console.log(res.data)
                    const nowTimeStamp = new Date().getTime();
                    if (!res.data.data.trainRangeStartTime || res.data.data.trainRangeStartTime > nowTimeStamp || res.data.data.trainRangeEndTime < nowTimeStamp) {
                        _this.setData({ isUsual: false, isUnUsual: true });
                    } else {
                        _this.setData({ isUsual: true, isUnUsual: false });
                    };
                    if (!res.data.data.buttonShowTime || res.data.data.buttonShowTime == 0) {
                        _this.setData({ isClick: false });
                    } else {
                        _this.setData({ isClick: res.data.data.buttonShowTime <= nowTimeStamp ? true : false });
                    };
                    if (res.data.data.couseList) {
                        if (res.data.data.couseList.length > 0) {
                            res.data.data.couseList.forEach((el, index) => {
                                el.index = index;
                                el.entity.unwind = false;
                                el.entity.unwindImg = '../../../images/train/train_down.png';
                                el.entity.timeShow = util.timestampToTime(el.entity.showTime, 'YMD');
                                if (!el.parsed.courseItems || el.parsed.courseItems.length == 0) {
                                    el.disabled = true;
                                } else {
                                    el.disabled = false;
                                    el.title = res.data.data.trainRangeName;
                                    el.parsed.courseItems.forEach(ele => {
                                        ele.st = ele.startTime == 0 ? '00:00' : util.timestampToTime(ele.startTime, 'hm');
                                        ele.et = ele.endTime == 0 ? '23:59' : util.timestampToTime(ele.endTime, 'hm');
                                    });
                                };
                            })
                        }
                    };
                    _this.setData({ dataObj: res.data.data });
                    wx.setNavigationBarTitle({
                        title: res.data.data.trainRangeName //页面标题为路由参数
                    });
                } else {

                }
            }
        })
    },

    /**
     * @description 查看
     * @author MuNaipeng
     */
    searchEvent(e) {
        console.log(e);
        const disabled = e.currentTarget.dataset.disabled,
            id = e.currentTarget.dataset.id,
            itemObj = e.currentTarget.dataset.item;
        if (disabled) return;
        wx.navigateTo({ url: '../timetable/timetable?itemIndex=' + itemObj.index });
    },

    /**
     * @description 点击展开
     * @author MuNaipeng
     */
    unwindEvent(e) {
        const disabled = e.currentTarget.dataset.disabled,
            index = e.currentTarget.dataset.index;
        const unwind = `dataObj.couseList[${index}].entity.unwind`,
            unwindImg = `dataObj.couseList[${index}].entity.unwindImg`;
        if (disabled) {
            this.setData({
                [unwind]: false
            });
            return;
        };

        this.setData({
            [unwind]: !this.data.dataObj.couseList[index].entity.unwind
        });
        this.setData({
            [unwindImg]: this.data.dataObj.couseList[index].entity.unwind ? '../../../images/train/train_up.png' : '../../../images/train/train_down.png'
        });
    },

    /**
     * @description 加入宝玩
     * @author MuNaipeng
     */
    joinUsEvent() {
        if (this.data.isClick) this.modal.showModal();
    },

    /**
     * @description 确认按钮回调
     * @author MuNaipeng
     */
    confirmEvent(e) {
        console.log(e.detail);
        const _this = this;
        ajax.POST({
            url: '/promoter/apply/train/confirm',
            success: function (res) {
                if (res.data.success) {
                    _this.modal.hideModal();
                    wx.redirectTo({ url: '/pages/home/home' });
                } else {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });

    }
})