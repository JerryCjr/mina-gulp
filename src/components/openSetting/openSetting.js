// components/open-setting/open-setting.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        
    },

    /**
     * 组件的初始数据
     */
    data: {
        flag: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handler: function () {
            wx.openSetting({
                success: function success(res) {
                    console.log(res)
                },
                fail: function (err) {
                    console.log(err)
                }
            });
            // if (e.detail.authSetting['scope.userInfo']) {
            //     this.setData({ flag: false })
            //     this.triggerEvent('flagChange', this.data.flag);
            // } else {
            //     this.setData({ flag: true })
            //     this.triggerEvent('flagChange', this.data.flag);
            // }
        }
    }
})
