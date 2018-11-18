export class ApiError extends Error {
  constructor(code = 0, message = '') {
    super(message);
    this.code = code;
    this.name = this.constructor.name;
  }
}

function urlCanNotBeEmpty() {
  throw new Error('url is empty!');
}

function handleResponse(response) {
  if (response) {
    switch (response.statusCode) {
      case 200:
        if (response.data.success && response.data.data) {
          return response.data.data;
        } else {
          throw new ApiError(200, '接口返回数据为空');
        }
      case 401:
        throw new ApiError(401, '需要登录');
      case 404:
        throw new ApiError(404, '接口不存在');
      case 500:
        throw new ApiError(500, '服务器内部错误');
      default:
        throw new ApiError(response.statusCode, '抱歉出错了');
    }
  } else {
    throw new ApiError(0, '抱歉出错了');
  }
}

function GET(requestHandler) {
  return request('GET', requestHandler);
}
function POST(requestHandler) {
  return request('POST', requestHandler);
}

function request(method, requestHandler) {
  return new Promise((resolve, reject) => {
    let data = requestHandler.data;
    let url = requestHandler.url ? requestHandler.url : urlCanNotBeEmpty();
    wx.request({
      url: url,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Auth-Token': wx.getStorageSync('token')
      },
      data: data,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        resolve(handleResponse(res));
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
module.exports = {
  GET: GET,
  POST: POST
};
