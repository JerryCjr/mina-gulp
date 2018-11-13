const app = getApp()
var API_URL = app.globalData.host + '/act'

var url = '';
var token;
var sys;

var requestHandler = {
    url: url,
    data: {},
    success: function (res) {
        // success
    },
    fail: function () {
        // fail
    },
}

function GET(requestHandler) {
    request('GET', requestHandler);
}
function POST(requestHandler) {
    request('POST', requestHandler)
}

function storePoints(en, data) {
    app.globalData.sid = parseInt(app.globalData.sid) + 1
    let pointsPara = {
        // sid: app.globalData.sid,
        en: en,
        data: data,
        ct: +new Date()
    }
    app.globalData.pointsEvents.push(pointsPara)
    console.log(pointsPara)
    console.log(app.globalData.pointsEvents)
}
function pushPoints() {
    if (app.globalData.pointsEvents && app.globalData.pointsEvents.length) {
        var uid = wx.getStorageSync('uid')
        var para = {
            uid: uid,
            app_id: 'wxa_light',
            events: app.globalData.pointsEvents
        }
        POST({
            url: '/log/xiao_app',
            data: JSON.stringify(para),
            success: function (res) {
                console.log(res)
                app.globalData.pointsEvents = []
            },
            fail: function (res) {
                console.log(res)
                wx.setStorage({
                    key: 'pointsEvents',
                    data: app.globalData.pointsEvents
                })
                app.globalData.pointsEvents = []
            }
        })
    }
}

function request(method, requestHandler) {
    var token = wx.getStorageSync('token')
    var sys = wx.getSystemInfoSync()
    function req(token) {
        // var parseData = { token: token }
        //注意：可以对params加密等处理
        // var data = Object.assign(parseData, requestHandler.data);
        var data = requestHandler.data
        var url = API_URL + requestHandler.url
        var sysInfo = sys.system.toLowerCase()
        var plat;
        plat = sysInfo.indexOf('ios') > -1 ? 1 : sysInfo.indexOf('android') > -1 ? 2 : ''
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': token,
                'X-Static-Params': 'version=' + sys.version + '&sys_version=' + sys.SDKVersion + '&device=' + sys.system + '&deviceId=' + 'wxx' + +new Date() + Math.floor(Math.random() * 1e7) + '&platform=' + plat
            },
            data: data,
            method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
                //注意：可以对参数解密等处理
                requestHandler.success(res)
                // wx.hideLoading()
            },
            fail: function () {
                requestHandler.fail()
            },
            complete: function () {
                // complete
            }
        });
    }
    var app = getApp();
    token = token || undefined;
    if (token) {
        req(token)
    } else {
        var t = setInterval(function () {
            if (app.globalData.userInfo) {
                token = app.globalData.userInfo.token
            }
            if (token) {
                req(token)
                clearInterval(t);
            }
        }, 100)
    }

}
module.exports = {
    GET: GET,
    POST: POST,
    storePoints: storePoints,
    pushPoints: pushPoints
}