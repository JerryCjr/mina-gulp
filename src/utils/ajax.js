const app = getApp()
var API_URL = app.globalData.host + '/api'

var url = '';
var token;

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

function request(method, requestHandler) {
    var token = wx.getStorageSync('token')
    function req(token) {
        // var parseData = { token: token }
        //注意：可以对params加密等处理
        // var data = Object.assign(parseData, requestHandler.data);
        var data = requestHandler.data
        var url = API_URL + requestHandler.url;
        wx.request({
            url: url,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-Auth-Token': token
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
                requestHandler.fail ? requestHandler.fail() : console.log('fail')
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
    POST: POST
}