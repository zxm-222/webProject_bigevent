$(function () {
    //校验规则
    layui.form.verify({
        pwd: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return "新旧密码不能相同";
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return "两次密码不一致";
            }
        }
    })
    //发起请求 实现重置密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("修改密码失败");
                }
                layui.layer.msg("修改密码成功");
                //重置表单 jQuery对象转化为dom对象
                $(".layui-form")[0].reset();
            }
        })
    })
})