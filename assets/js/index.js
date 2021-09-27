$(function () {
    //调用getUserInfo函数获取用户的基本信息
    getUserInfo();
    //实现用户的退出功能
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            //清空token
            localStorage.removeItem('token');
            //退到登录页面
            location.href = 'http://localhost:63342/10-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/login.html?_ijt=kseasdaiaoa5bg8f754qhsijcq';
            layer.close(index);
        });
    })
})
//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: '/my/userinfo',
       success: function (res) {
           if (res.status !== 0) {
               return layui.layer.msg("获取用户信息失败")
           }
           // 调用renderAvatar函数渲染用户头像
            renderAvatar(res.data);
       },
        //控制用户的访问权限
        //不管是不是成功，都会调用complete函数
        // complete: function (res) {
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        //         //清空token
        //         localStorage.removeItem('token');
        //         //强制跳转到登录页面
        //         location.href = 'http://localhost:63342/10-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/login.html?_ijt=kseasdaiaoa5bg8f754qhsijcq';
        //     }
        // }
    })
}
//渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('.welcome').html("欢迎&nbsp;&nbsp;" + name);
    //按需渲染头像
    if (user.user_pic !== null) {
        //渲染图片
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.user_avatar').hide();
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide();
        //获取名字的第一个字母并大写
        var first = name[0].toUpperCase();
        $('.user_avatar').html(first).show();
    }
}