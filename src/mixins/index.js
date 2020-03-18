export default {
  methods:{
    formatDate(fmt, date){
      date = date instanceof Date ? date : new Date(date);

      let o = {
        "M+" : date.getMonth()+1,                 //月份
        "d+" : date.getDate(),                    //日
        "h+" : date.getHours(),                   //小时
        "m+" : date.getMinutes(),                 //分
        "s+" : date.getSeconds(),                 //秒
        "q+" : Math.floor((date.getMonth()+3)/3), //季度
        "S"  : date.getMilliseconds()             //毫秒
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(let k in o)
        if(new RegExp("("+ k +")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      return fmt;
    },
    toCreatePage(){
      let isBoss = wx.getStorageSync('isBoss');

      isBoss
        ? wx.navigateTo({url: '/pages/editCard/main?type=add'})
        : wx.navigateTo({url: '/pages/chooseIdentity/main'})
    },
    // 校验图片名称是否是数字，主要为区别增加的缩略图
    checkImgNameIsNumber(imgUrl){
      let urlImg = imgUrl.split(/\/|\./g);

      if (/^-?\d+$/.test(urlImg[urlImg.length - 2])) {
        return true;
      }else {
        return false;
      }
    },
  },
}
