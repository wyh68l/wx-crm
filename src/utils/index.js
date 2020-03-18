import upng from '../../node_modules/upng-js/UPNG'
let extJSON = wx.getExtConfigSync()

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function getdate(time, k) {
  // 获取当前日期
  let d
  d = new Date(time) || new Date()
  if (k == 1) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
  } else if (k == 'dateTime' || k == 'monthTime') {
    let s = d.getFullYear(),
      month = ('0' + (d.getMonth() + 1)).slice(-2),
      day = ('0' + d.getDate()).slice(-2),
      hour = ('0' + d.getHours()).slice(-2),
      second = ('0' + d.getSeconds()).slice(-2),
      m = ('0' + d.getMinutes()).slice(-2)

    // s = s + '-' + month + '-' + day + ' ' + hour + ':' + second ;
    m = month + '-' + day + ' ' + hour + ':' + m
    s = s + '-' + m

    if (k == 'dateTime') {
      return s
    } else {
      return m
    }
  } else if (k == '年月日') {
    return (
      d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日'
    )
  } else {
    let s = d.getFullYear()
    if (d.getMonth() >= 9) {
      s = s + '-' + (d.getMonth() + 1)
    } else {
      s = s + '-0' + (d.getMonth() + 1)
    }
    if (d.getDate() + 1 >= 10) {
      s = s + '-' + d.getDate()
    } else {
      s = s + '-0' + d.getDate()
    }
    return s
  }
}

/* 小程序选择图片 */
function chooseImage(methods, count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        /* console.log(res);
         console.log(res.tempFiles);*/
        let types = res.tempFilePaths[0].split('.'),
          type = types[types.length - 1],
          all_type = ['jpg', 'png', 'jpeg', 'PNG', 'JPG', 'JPEG']
        if (all_type.indexOf(type) < 0) {
          wx.showToast({
            title: '请选择jpg/jpeg/png格式的图片！',
            icon: 'none'
          })
          reject('err')
          return
        }

        if (methods == 'files') {
          resolve(res.tempFiles)
        } else {
          resolve(res.tempFilePaths)
        }
      },
      fail: function(err) {
        if (err.errMsg != 'chooseImage:fail cancel') {
          wx.showToast({
            title: '获取图片失败',
            icon: 'none'
          })
          resolve('err')
        }
      }
    })
  })
}

// 小程序选择视频
function chooseVideo() {
  return new Promise((resolve, reject) => {
    wx.chooseVideo({
      maxDuration: 60,
      success: res => {
        if (res.size >= 31457280) {
          reject('文件大小超出限制, 最大30M')
          return
        }
        resolve(res)
      },
      fail: err => {
        //reject('请选择视频')
      }
    })
  })
}

export function Tobase64(imgPath, h, w) {
  return new Promise((resolve, reject) => {
    let canvas = wx.createCanvasContext('Canvas'),
      v = this
    canvas.drawImage(imgPath, 0, 0, w, h)

    canvas.draw(false, () => {
      wx.canvasGetImageData({
        canvasId: 'Canvas',
        x: 0,
        y: 0,
        width: w,
        height: h,
        success(res) {
          /*   if (platform === 'ios') {
                 // 兼容处理：ios获取的图片上下颠倒
                 res = v.reverseImgData(res)
             }*/
          let pngData = upng.encode([res.data.buffer], res.width, res.height)
          let base64 = wx.arrayBufferToBase64(pngData)
          resolve('data:image/jpeg;base64,' + base64)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  })
}

export function getImginfo(path) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: path,
      success(data) {
        resolve(data)
      },
      fail(res) {
        console.log(err)
      }
    })
  })
}

export function reverseImgData(res) {
  //IOS拍照转向
  var w = res.width
  var h = res.height
  let con = 0
  for (var i = 0; i < h / 2; i++) {
    for (var j = 0; j < w * 4; j++) {
      con = res.data[i * w * 4 + j]
      res.data[i * w * 4 + j] = res.data[(h - i - 1) * w * 4 + j]
      res.data[(h - i - 1) * w * 4 + j] = con
    }
  }
  return res
}

export function getlocation(mc) {
  return new Promise((resolve, reject) => {
    mc.getCenterLocation({
      success: function(res) {
        resolve(res)
        // console.log(res.longitude)
        // console.log(res.latitude)
      }
      // uni.getLocation({
      //   type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
      //   success: function (res) {
      //     resolve(res)
      //     // var latitude = res.latitude//维度
      //     // var longitude = res.longitude//经度
      //     // console.log(res);
      //     // that.loadCity(latitude,longitude);
      //   }
    })
  })
}

export function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

export function DeviceOrientation(cb) {
  //获取手机旋转方向
  let v = this
  wx.onAccelerometerChange(function(res) {
    let _x = judgeSign(res.x),
      _y = judgeSign(res.y),
      _z = judgeSign(res.z),
      _direction = ''
    /*   console.log('x --- ', res.x , _x) ;
       console.log('y --- ', res.y , _y) ;
       console.log('z --- ', res.z , _z) ;*/
    if (_z === 'minus' && _x === 'plus' && _y === 'plus') {
      _direction = 'minus'
    } else {
      _direction = 'plus'
    }

    cb(_direction)
  })
}

function judgeSign(num) {
  var reg = new RegExp('^-?[0-9]*.?[0-9]*$')
  if (reg.test(num)) {
    var absVal = Math.abs(num)
    return num == absVal ? 'plus' : 'minus'
  } else {
    return 'not'
  }
}

function checkPhone(str) {
  //
  if (
    !/(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^((\(\d{3}\))|(\d{3}\-))?(1[3456789]\d{9})$)|(^(400)-(\d{3})-(\d{4})(.)(\d{1,4})$)|(^(400)-(\d{3})-(\d{4}$))/.test(
      str
    )
  ) {
    return false
  } else {
    return true
  }
}

function MakePhone(phone) {
  //打电话
  if (phone) {
    wx.makePhoneCall({
      phoneNumber: phone
    })
  } else {
    wx.showToast({
      title: '还没有添加电话呢！',
      duration: 2000,
      icon: 'none'
    })
  }
}

function AddWX(wx) {
  if (wx) {
    wx.setClipboardData({
      data: wx,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  } else {
    wx.showToast({
      title: '还没有添加微信呢！',
      duration: 2000,
      icon: 'none'
    })
  }

  return true
}

export function clearLoginInfo() {
  wx.removeStorageSync('loginMsg')
  wx.removeStorageSync('token')
}

export function dateFormat(str) {
  var year = new Date(str).getFullYear()
  var month = new Date(str).getMonth() + 1
  var day = new Date(str).getDate()
  var h =
    new Date(str).getHours() - 10 < 0
      ? '0' + new Date(str).getHours()
      : new Date(str).getHours()
  var m =
    new Date(str).getMinutes() - 10 < 0
      ? '0' + new Date(str).getMinutes()
      : new Date(str).getMinutes()
  var s =
    new Date(str).getSeconds() - 10 < 0
      ? '0' + new Date(str).getSeconds()
      : new Date(str).getSeconds()

  var newDate = new Date()
  var year1 = newDate.getFullYear()
  var month1 = newDate.getMonth() + 1
  var day1 = newDate.getDate()

  if (year == year1 && month == month1 && day == day1) {
    return h + ':' + m
  } else if (year == year1 && month == month1 && day + 1 == day1) {
    return '昨天'
  } else if (year != year1 || month != month1 || day + 1 != day1) {
    return month + '月' + day + '日'
  }
}

/**
 * 过滤 emoji表情
 * @param name
 * @returns {void|*|string|never}
 */
function filterEmoji(name) {
  var str = name.replace(
    /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi,
    ''
  )

  return str
}

/**
 * 小程序跳转
 * @param url
 * @param appId
 */
export function toMiniProgram(url, appId) {
  return new Promise((resolve, reject) => {
    wx.navigateToMiniProgram({
      appId: appId || extJSON.jumpAppId || 'wx1c06c4e49bf6040e', // 要跳转的小程序的appid
      path: url, // 跳转的目标页面
      extarData: {
        open: 'auth'
      },
      success(res) {
        resolve(res)
      },
      fail(res) {
        reject(res)
      }
    })
  })
}

export function createBase64() {
  'use strict'
  var version = '2.1.9'
  // if node.js, we use Buffer
  var buffer
  if (typeof module !== 'undefined' && module.exports) {
    try {
      buffer = require('buffer').Buffer
    } catch (err) {}
  }
  // constants
  var b64chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  var b64tab = (function(bin) {
    var t = {}
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i
    return t
  })(b64chars)
  var fromCharCode = String.fromCharCode
  // encoder stuff
  var cb_utob = function(c) {
    if (c.length < 2) {
      var cc = c.charCodeAt(0)
      return cc < 0x80
        ? c
        : cc < 0x800
        ? fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))
        : fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) +
          fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
          fromCharCode(0x80 | (cc & 0x3f))
    } else {
      var cc =
        0x10000 +
        (c.charCodeAt(0) - 0xd800) * 0x400 +
        (c.charCodeAt(1) - 0xdc00)
      return (
        fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) +
        fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) +
        fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) +
        fromCharCode(0x80 | (cc & 0x3f))
      )
    }
  }
  var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g
  var utob = function(u) {
    return u.replace(re_utob, cb_utob)
  }
  var cb_encode = function(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
      ord =
        (ccc.charCodeAt(0) << 16) |
        ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) |
        (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
      chars = [
        b64chars.charAt(ord >>> 18),
        b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
      ]
    return chars.join('')
  }
  var btoa = function(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode)
  }
  var _encode = buffer
    ? function(u) {
        return (u.constructor === buffer.constructor
          ? u
          : new buffer(u)
        ).toString('base64')
      }
    : function(u) {
        return btoa(utob(u))
      }
  var encode = function(u, urisafe) {
    return !urisafe
      ? _encode(String(u))
      : _encode(String(u))
          .replace(/[+\/]/g, function(m0) {
            return m0 == '+' ? '-' : '_'
          })
          .replace(/=/g, '')
  }
  var encodeURI = function(u) {
    return encode(u, true)
  }
  // decoder stuff
  var re_btou = new RegExp(
    [
      '[\xC0-\xDF][\x80-\xBF]',
      '[\xE0-\xEF][\x80-\xBF]{2}',
      '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'),
    'g'
  )
  var cb_btou = function(cccc) {
    switch (cccc.length) {
      case 4:
        var cp =
            ((0x07 & cccc.charCodeAt(0)) << 18) |
            ((0x3f & cccc.charCodeAt(1)) << 12) |
            ((0x3f & cccc.charCodeAt(2)) << 6) |
            (0x3f & cccc.charCodeAt(3)),
          offset = cp - 0x10000
        return (
          fromCharCode((offset >>> 10) + 0xd800) +
          fromCharCode((offset & 0x3ff) + 0xdc00)
        )
      case 3:
        return fromCharCode(
          ((0x0f & cccc.charCodeAt(0)) << 12) |
            ((0x3f & cccc.charCodeAt(1)) << 6) |
            (0x3f & cccc.charCodeAt(2))
        )
      default:
        return fromCharCode(
          ((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1))
        )
    }
  }
  var btou = function(b) {
    return b.replace(re_btou, cb_btou)
  }
  var cb_decode = function(cccc) {
    var len = cccc.length,
      padlen = len % 4,
      n =
        (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) |
        (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) |
        (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) |
        (len > 3 ? b64tab[cccc.charAt(3)] : 0),
      chars = [
        fromCharCode(n >>> 16),
        fromCharCode((n >>> 8) & 0xff),
        fromCharCode(n & 0xff)
      ]
    chars.length -= [0, 0, 2, 1][padlen]
    return chars.join('')
  }
  var atob = function(a) {
    return a.replace(/[\s\S]{1,4}/g, cb_decode)
  }
  var _decode = buffer
    ? function(a) {
        return (a.constructor === buffer.constructor
          ? a
          : new buffer(a, 'base64')
        ).toString()
      }
    : function(a) {
        return btou(atob(a))
      }
  var decode = function(a) {
    return _decode(
      String(a)
        .replace(/[-_]/g, function(m0) {
          return m0 == '-' ? '+' : '/'
        })
        .replace(/[^A-Za-z0-9\+\/]/g, '')
    )
  }

  return {
    VERSION: version,
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode
  }
}

/**
 * 防抖函数
 * @param fn
 * @param gapTime
 * @returns {Function}
 */
function throttle(fn, gapTime = 1500) {
  let _lastTime = null
  return function() {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}

export default {
  clearLoginInfo,
  formatNumber,
  formatTime,
  getdate,
  chooseImage,
  getImginfo,
  Tobase64,
  getlocation,
  compareVersion,
  DeviceOrientation,
  checkPhone,
  MakePhone,
  dateFormat,
  AddWX,
  createBase64,
  filterEmoji,
  toMiniProgram,
  extJSON,
  throttle,
  chooseVideo
}
