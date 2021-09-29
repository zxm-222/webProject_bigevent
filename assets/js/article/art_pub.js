$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();

    //获取文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章类别失败");
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    }
    //实现文章封面的剪裁效果
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //点击选择封面
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //将选择的图片放到裁剪区域
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        //判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0]);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })
    var art_state = '已发布';
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    })

    //基于form表单创建FormData对象
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //创建formData对象
        var fd = new FormData($(this)[0]);
        // 将文章的状态存入fd中
        fd.append('state', art_state);
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                                           // 得到文件对象后，进行后续的操作
                //将图片也存入fd中
                fd.append('cover_img', blob)
                //发起请求添加文章
                publishArticle(fd);
            })
    })

    //发起Ajax请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: '/my/article/add',
            data: fd,
            //提交FormData格式的数据 这两个属性必须写
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("文章发布失败");
                }
                layer.msg("文章发布成功");
                location.href = "http://localhost:63342/10-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80%E7%BB%83%E4%B9%A0/article/art_list.html?_ijt=tbj3nunus4gmuoie8isis6j56m"
            }
        })
    }
})