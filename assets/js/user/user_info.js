$(function () {
    //校验规则
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度必须在1~6个字符之间";
            }
        }
    })

    initUserInfo();

    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败');
                }
                // console.log(res)
                form.val('formUserInfo', res.data);
            }
        })
    }
    //实现表单的重置效果
    $('#reBtn').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })
    //发送请求更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败");
                }
                layer.msg("更新用户信息成功");
                //调用父页面中的方法，重新渲染用户的信息和头像
                //注意：<iframe> 中的子页面，如果想要调用父页面中的方法，使用 window.parent 即可。
                window.parent.getUserInfo();
            }
        })
    })
})