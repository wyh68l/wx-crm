import { clearLoginInfo, createBase64 } from './index';

// var baseUrl = 'http://192.168.5.25:8763/crmApi';/*192.168.1.7:8766*/
// var baseUrl ='https://api.youdomain.com/crmApi';
// var baseUrl = 'https://192.168.5.33/crmApi';
// var baseUrl = 'http://24795tz835.zicp.vip/crmApi';
// var baseUrl = 'http://api.youdomain.com/crmApi';
let extJSON = wx.getExtConfigSync();
let base64 = createBase64();

let { companyKey, uploadUrl, baseUrl, ossUrl } = extJSON;
baseUrl = baseUrl + '/crmApi';
uploadUrl = uploadUrl + '/file/uploadObjectOSS';

var imgBackUrl = ossUrl;

function gettoken() {
  return wx.getStorageSync('token') || '';
}
function getcookie() {
  // var cookie = wx.getStorageSync('cookies') || '';
  return wx.getStorageSync('cookies') || '';
}

/**
 *
 * @param request 参数
 * @param method 请求方式
 * @param service 请求地址
 * @param isShowErrToast  是否自定义错误显示
 * @param unLoginRedirectUrl  取消登录跳转的地址
 * @returns {Promise<any>}
 * @constructor
 */
export function POST(
  request,
  method,
  service,
  isShowErrToast,
  unLoginRedirectUrl
) {
  // wx.setStorageSync('token','ulbrvtpvyt');

  var contentType = '',
    url = '';
  if (method == 'json') {
    contentType = 'multipart/form-data';
    url = baseUrl + service;
  } else {
    contentType = 'application/x-www-form-urlencoded';
    url = baseUrl + service;
  }

  let data = request;

  if (Object.keys(request).length) {
    data = {
      data: base64.encode(JSON.stringify(request))
    };
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      header: {
        'content-type': contentType,
        token: gettoken(),
        cookie: 'PHPSESSID=' + getcookie(),
        companyKey: companyKey,
        time: Date.now()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (
          data.data.code == 200 ||
          data.data.code == 209 ||
          data.data.code == 204
        ) {
          resolve(data.data.data, data.data.code);
        } else if (data.data.code == 401) {
          unLoginHandler(unLoginRedirectUrl, url);
        } else if (data.data.code == 403) {
          reject(data.data);
        } else {
          reject(data.data);
          let { message } = data.data;
          message = message
            ? message === 'GENERAL'
              ? '网络异常'
              : message
            : '网络异常';

          if (isShowErrToast) {
            console.info('isShowErrToast 不为空 ');
            return;
          }

          wx.showToast({
            title: message,
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        reject(err);
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    });
  });
}

var isUnLogin = 0;
/**
 * 获取接口数据返回401 没有登录的处理
 * @param unLoginRedirectUrl 暂时不登录跳转的地址
 */
export function unLoginHandler(unLoginRedirectUrl, url) {
  wx.hideLoading();
  if (
    url.indexOf('/seeRecord/timeStatistics') > -1 ||
    url.indexOf('/seeRecord/getVisitRankingList') > -1 ||
    url.indexOf('/seeRecord/situationStatistics') > -1
  ) {
    if (isUnLogin > 0) return;
  }
  isUnLogin++;
  clearLoginInfo();
  wx.showToast({
    title: '请登录',
    duration: 2000,
    icon: 'none'
  });
  setTimeout(function() {
    let url = '/pages/wxLogin/main';
    if (unLoginRedirectUrl) {
      url += '?unLoginRedirectUrl=' + unLoginRedirectUrl;
    }
    console.info('未登录跳转的地址：', url);
    wx.redirectTo({ url: url });
  }, 1000);
}

export function GET(request, successed, service, unLoginRedirectUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        'content-type': 'application/json', // 默认值
        token: gettoken(),
        companyKey: companyKey,
        cookie: 'PHPSESSID=' + getcookie()
      },
      url: baseUrl + service,
      data: request,
      success: function(data) {
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(data.data.data);
        } else if (data.data.code == 401) {
          unLoginHandler(unLoginRedirectUrl);
        } else {
          wx.showToast({
            title: data.data.msg || '网络异常',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        reject(err);
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    });
  });
}

export function DELETE(request, successed, service, unLoginRedirectUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
        token: gettoken(),
        companyKey: companyKey,
        cookie: 'PHPSESSID=' + getcookie()
      },
      method: 'DELETE',
      url: baseUrl + service,
      data: request,
      success: function(data) {
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(data.data.data);
        } else if (data.data.code == 401) {
          unLoginHandler(unLoginRedirectUrl);
        } else {
          wx.showToast({
            title: data.data.msg || '网络异常',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        reject(err);
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    });
  });
}

/**
 * 上传图片不加权限，
 * @param imgPath
 * @param method
 * @param service
 * @returns {Promise<any>}
 * @constructor
 */
export function UploadImage(imgPath, method, service) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: uploadUrl, //
      // https://api.youdomain.com/file/uploadObjectOSS
      //https://192.168.1.130/file/uploadObjectOSS
      filePath: imgPath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success(data) {
        if (data.statusCode == 200 || data.data.code == 209) {
          resolve(data.data);
        } else {
          wx.showToast({
            title: data.data.msg || '网络异常',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail(err) {
        console.log(err);
        reject(err);
        wx.showToast({
          title: '网络异常',
          duration: 2000,
          icon: 'none'
        });
      }
    });
  });
}

export function checkCollect(request, service, unLoginRedirectUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + '/personal/getIsCollection',
      data: request,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: gettoken()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          if (data.data.data) {
            if (data.data.data) {
              resolve({
                status: true,
                collectionId: data.data.data.collectionId
              });
            } else {
              resolve({ status: false });
            }
          } else {
            resolve({ status: false });
          }
        } else if (data.data.code == 401) {
          unLoginHandler(unLoginRedirectUrl);
        } else {
          resolve({ status: false });
        }
      },
      fail: function(err) {
        reject(false);
        wx.showModal({
          title: '提示',
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    });
  });
}

export function changeCollect(request, service, unLoginRedirectUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + service,
      data: request,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        token: gettoken()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          resolve(true);
        } else if (data.data.code == 401) {
          unLoginHandler(unLoginRedirectUrl);
        } else {
          resolve(false);
          wx.showToast({
            title: data.data.message || '网络异常',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        resolve(true);
        wx.showModal({
          title: '提示',
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    });
  });
}

export function ToPay(request, service, unLoginRedirectUrl) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + '/orders/goPay',
      data: request,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        companyKey: companyKey,
        token: gettoken()
      },
      success: function(data) {
        /*
        *   SUCCESS(200,"成功"),
            ERROR(500,"系统异常"),
            FAULT_TOLERANT(501,"容错"),
            FAIL(201,"操作失败"),
            NO_LOGIN(401,"未登陆"),
            NO_ROLE(403,"无权限"),
            NO_PARAM(202,"参数缺失"),
            PARAM_CHECK(203,"参数校验失败"),
            NO_DATA(204,"无数据"),
            TEST(999999,"TEST")
        * */
        if (data.data.code == 200 || data.data.code == 209) {
          //data.data.data
          if (data.data.data) {
            let _data = data.data.data;
            wx.requestPayment({
              timeStamp: _data.timeStamp,
              nonceStr: _data.nonce_str,
              package: 'prepay_id=' + _data.prepay_id,
              signType: 'MD5',
              paySign: _data.paySign,
              success(res) {
                console.log(res);
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                });
                resolve(true);
                setTimeout(() => {
                  let url = '../orderLists/main';
                  wx.navigateTo({ url: url });
                }, 800);
              },
              fail(err) {
                console.log(err);
                reject(false);
                if (err.errMsg === 'requestPayment:fail cancel') {
                  wx.showToast({
                    title: '支付已取消',
                    icon: 'none'
                  });
                } else {
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none'
                  });
                }
              }
            });
          } else {
            reject(false);
          }
        } else if (data.data.code == 401) {
          unLoginHandler('../cardCase/main');
        } else {
          resolve(false);
          wx.showToast({
            title: data.data.message || '网络异常',
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        resolve(false);
        wx.showModal({
          title: '提示',
          content: JSON.stringify(err),
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    });
  });
}

export default {
  POST,
  GET,
  DELETE,
  UploadImage,
  imgBackUrl,
  checkCollect,
  changeCollect,
  ToPay,
  unLoginHandler
};
