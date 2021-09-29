$(function () {

    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    //获取并使用模板引擎获取数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var index1 = null;
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        index1 = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '250px']
        });
    })
    //实现添加文章分类的功能
    //因为是动态添加的 所以要使用代理德 方式绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增分类失败");
                }
                initArtCateList();
                layer.msg("新增分类成功");
                //根据索引 关闭弹出层 索引index = layer.open()
                layer.close(index1);
            }
        })
    })
    //通过代理 为编辑按钮绑定点击事件
    var index2 = null;
    $("tbody").on('click', '.btn-edit', function () {
        index2 = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '250px']
        });
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })
    //通过代理 为修改表单绑定事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类信息失败");
                }
                initArtCateList();
                layer.msg("更新分类信息成功");
                layer.close(index2);
            }
        })
    })
    //删除文章的分类
    //通过代理
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        console.log(id)
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    console.log(res.status)
                    if (res.status !== 0) {
                        return layer.msg("删除分类失败");
                    }
                    layer.msg("删除分类成功");
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})