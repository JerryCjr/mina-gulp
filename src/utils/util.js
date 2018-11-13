// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// module.exports = {
//   formatTime: formatTime
// }
//数据转化  
function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTime(number, format) {

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];

    var date = new Date(number);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
}

function formatTimeTwo(strtime) {
    var date = new Date(strtime.replace(/-/g, '/'));
    return date.getTime();
}

/**
 * @description 将时间戳转换成日期格式
 * @author MuNaipeng
 * @param {numver} timestamp 传入的时间戳
 * @returns
 */
function timestampToTime(timestamp, type = 's') {
    const weekArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    const timestampStr = timestamp + '';
    let date, Y, M, M1, D, D1, h, m, s;
    if (timestampStr.length == 10) {
        date = new Date((timestamp - 0) * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    } else {
        date = new Date(timestamp - 0);
    };
    console.log(date)
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    M1 = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
    D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    D1 = date.getDate() < 10 ? '0' + date.getDate() + '日' : date.getDate() + '日';
    h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    m = date.getMinutes() < 10 ? ':0' + date.getMinutes() : ':' + date.getMinutes();
    s = date.getSeconds() < 10 ? ':0' + date.getSeconds() : ':' + date.getSeconds();


    if (type == 's') {
        return Y + M + D + h + m + s;
    } else if (type == 'm') {
        return Y + M + D + h + m;
    } else if (type == 'h') {
        return Y + M + D + h + ':00';
    } else if (type == 'YMD') {
        return Y + M + D;
    } else if (type == 'hm') {
        return h + m;
    } else if (type == '月日') {
        return M1 + D1;
    } else if (type == 'week') {
        return weekArr[date.getDay()];
    }
};

/**
 * @description 检测小程序版本
 * @author MuNaipeng
 * @param ver 设置的版本（限定传入String类型,默认2.0.7）
 * @return 返回isPass[Boolean]是否通过，false代表小程序版本低于传入版本
 */
const checkVersions = (ver = '2.0.7') => {
    return new Promise((resolve, reject) => {
        wx.getSystemInfo({
            success: function (res) {
                let version = res.SDKVersion;
                version = version.replace(/\./g, "");
                let myVersion = ver.replace(/\./g, "");
                if (myVersion.length == 3) {
                    myVersion = myVersion * 10;
                }
                if (version.length == 3) {
                    version = version * 10;
                }
                if (parseInt(version) < parseInt(myVersion)) { // 小于传入的版本
                    wx.showModal({
                        title: '温馨提示',
                        content: '您的微信版本过低，请将微信升至最新版本，体验此功能',
                        showCancel: false,
                        confirmText: '知道了'
                    })
                    resolve({ isPass: false });
                } else {
                    resolve({ isPass: true });
                }
            },
            fail: function (err) {
                reject(err);
            }
        })
    });
};

module.exports = {
    formatTime: formatTime,
    formatTimeTwo: formatTimeTwo, // 时间转为时间戳
    timestampToTime: timestampToTime,
    checkVersions: checkVersions
}