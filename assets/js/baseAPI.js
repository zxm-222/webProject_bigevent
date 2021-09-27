// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
  // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
  options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

  //为有权限的的接口 设置headers请求头
    //判断是否为有权限
    if(options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        };
    }

    //全局统一挂载complete函数
    options.complete = function (res) {
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
            //清空token
            localStorage.removeItem('token');
            //强制跳转到登录页面
            location.href = 'http://localhost:63342/10-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/login.html?_ijt=kseasdaiaoa5bg8f754qhsijcq';
        }
    }
})
