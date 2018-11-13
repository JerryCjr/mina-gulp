// pages/salary/salary.js
const app = getApp();
let ajax = require('../../utils/ajax.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        group: [],
        myself: [],
        flag: false,
        data: [],
        dateRangeName: '',
        id: 0, // 身份类型
        parsed: []
    },
    getData: function (id) {
        wx.showLoading({
            title: '加载中…',
        });
        let that = this;
        let url = '';
        let para = {
            id: app.globalData.salaryId
        }
        if (id === '2') {
            url = '/m/promoter/salary/info';
        } else {
            url = '/m/ambassador/salary/info';
        }
        ajax.GET({
            url: url,
            data: para,
            success: function (res) {
                if (res.data.success) {
                    wx.hideLoading();
                    let data = res.data.data;
                    that.setData({
                        data: data.entity ? data.entity : [],
                        dateRangeName: app.globalData.salaryDate ? app.globalData.salaryDate : '',
                        parsed: data.parsed ? data.parsed : ''
                    })
                    if (data.entity.stat === 1) {
                        if (data.parsed && data.parsed.groupLeaderSalary) {
                            let group = that.commonFun(data.parsed.commonProSalary);
                            that.setData({
                                group: group,
                                flag: true
                            })
                        } else if (data.parsed && data.parsed.commonProSalary) {
                            let myself = that.commonFun(data.parsed.commonProSalary);
                            that.setData({
                                myself: myself,
                                flag: false
                            })
                        }
                        // 大使
                        if (data.parsed) {
                            let parsed = that.commonFun(data.parsed);
                            that.setData({
                                parsed: parsed
                            })
                        }
                    }
                } else {
                    wx.hideLoading();
                    app.catchFunc(res);
                }
            },
            fail: function (err) {
                wx.hideLoading();
                wx.showModal({
                    title: '错误',
                    content: err.errMsg,
                    showCancel: false
                })
                console.log(err);
            }
        })
    },

    /**
     * 公用遍历函数
     * @function
     */
    commonFun: function (obj) {
        let parsed = {};
        // 遍历对象
        Object.keys(obj).forEach((key) => {
            parsed[key] = (obj[key] / 100).toFixed(2);
        })
        return parsed;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id ? options.id : 1;
        this.setData({ id: id });
        this.getData(options.id);
    },
})