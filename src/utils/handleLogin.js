/**
 * 用户登录授权处理
 */
import WXAJAX from './request'
import websocket from './websocket'


/**
 * 开始login
 * 小程序向微信请求code，成功后向后端发起登录请求，成功后，查询存储中是否有redirectPage，如果有，则进行跳转
 * @param callback 登录成功回调函数
 */
export function login (callback) {
    wx.showLoading();
    wx.login({
        success (res) {
            if (res.code) {
                // 登录成功，获取用户信息
                getUserInfo(res.code, callback);
                // websocket.connectWebsocket();
                let url = wx.getStorageSync('redirectPage');
                redirectPage(url);
            } else {
                // 否则弹窗显示，showToast需要封装
                showToast()
            }
        },
        fail () {
            showToast()
        }
    })
}

/**
 * 页面跳转
 * @param url 待跳转的url
 */
export function redirectPage(url){
    if(url){
        setTimeout(() => {
            wx.removeStorageSync('redirectPage');
            wx.reLaunch({url: url});
        }, 1000);
    }
}

/**
 * 向微信发起请求:获取用户信息
 * @param code
 * @param callback
 */
export function getUserInfo (code, callback) {
    wx.getUserInfo({
        // 获取成功，全局存储用户信息，开发者服务器登录
        success (msg) {
            postLogin({
                code: code,
                rawData : msg.rawData ,
                signature : msg.signature ,
                encrypteData : msg.encryptedData,
                iv : msg.iv ,
                phoneData: '',
                phoneIv : '',
            }, callback)
        },
        // 获取失败，弹窗提示一键登录
        fail (err) {
            console.error(err)
            wx.hideLoading()
            showLoginModal()
        }
    })
}

/**
 * 向后端发起请求，进行登录。登录成功后调用回调函数
 * 请求参数中
 * code: 向微信登录获取的code，不能为空
 * rawData : 微信登录返回的数据，包含微信名、头像等等
 * signature : 签名
 * encrypteData : 敏感数据
 * iv :
 * @param params 请求参数
 * @param callback 回调函数
 */
export function postLogin (params, callback) {
    WXAJAX.POST(params,'','/home/wxLogin').then((data) => {
        if(data.token){
            wx.hideLoading();
            callback && callback(data);
        } else {
            showToast(err.message);
        }
    }).catch((err) => {
        showToast(err.message);
    });
}

/**
 * 小程序端判断是否登录
 * @param callback 回调函数
 */
export function isLogin (callback) {
    if (wx.getStorageSync('token')) {
        // 如果有全局存储的登录态，暂时认为他是登录状态
        callback && callback()
    }
}

/**
 * 小程序端判断是否登录，如果没有登录，则弹出模态框，提示用户到个人中心中登录
 * @param callback 回调函数
 */
export function isLoginAndShowModal (callback) {
    let token = wx.getStorageSync('token');
    if (token) {
        // 如果有全局存储的登录态，暂时认为他是登录状态
        callback && callback()
    } else {
        // 如果没有登录态，弹窗提示一键登录
        showLoginModal()
    }
}

/**
 * 提示用户到达个人中心进行登录
 */
export function showLoginModal () {
    wx.showModal({
        title: '提示',
        content: '您还未登录，请登录后可获得完整体验。',
        confirmText: '确定',
        success (res) {
            if (res.confirm) {
                wx.navigateTo({
                    url: '/pages/wxLogin/main',
                })
            }
        }
    })
}

/**
 * 弹框显示错误信息，默认是"用户信息获取失败"
 * @param content 错误信息内容
 */
export function showToast (content = '用户信息获取失败') {
    wx.showToast({
        title: content,
        icon: 'none',
        duration: 2000
    })
}


export default {
    login,
    getUserInfo,
    postLogin,
    isLogin,
    isLoginAndShowModal,
    showLoginModal,
    showToast
}
