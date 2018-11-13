// components/componentModal/componentModal.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        config: {
            type: Object,
            value: []
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        show: false,
    },

    ready() {
        this.properties.config.confirmEvent = this.confirmEvent;
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 显示
        showModal() {
            this.setData({ show: true });
        },
        // 隐藏
        hideModal() {
            this.setData({ show: false })
        },
        /**
         * @description 确认
         * @author MuNaipeng
         * @param {*} e
         */
        confirmEvent(e) {
            console.log(e.currentTarget.dataset.config);
            const config = e.currentTarget.dataset.config;
            this.triggerEvent("confirmEvent", config);
        },

        /**
         * @description 取消
         * @author MuNaipeng
         */
        cancelEvent() {
            this.triggerEvent("cancelEvent");
            this.properties.config.show = false;
            this.hideModal();
        }
    }
})