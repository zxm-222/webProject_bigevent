$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //美化时间
    template.defaults.imports.dataFormat = function (data) {
        var time = new Date(data);

        var year = time.getFullYear();
        var month = padZero(time.getMonth() + 1);
        var day = padZero(time.getDate());
        var hour = padZero(time.getHours());
        var minute = padZero(time.getMinutes());
        var second = padZero(time.getSeconds());

        return year + '-' + month + '-' + day + ' ' + hour +':' + minute + ':' + second;
    }

    //时间补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //定义参数q
    var q = {
        pagenum: 1,  //页码值
        pagesize: 2,  //每页显示多少条数据
        cate_id: '',  //文章分类的 Id
        state: ''  //文章的状态，可选值有：已发布、草稿
    }

    initTable();
    initCate();

    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res)
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败");
                }
                var htmlStr = template('tpl-table', res);
                // console.log(htmlStr)
                $('tbody').html(htmlStr);
                //调用分页方法
                renderPage(res.total);
            }
        })
    }
    //获取文章分类 渲染所有分类下拉框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败");
                }
                var htmlStr = template('tpl-cate', res);
                //属性选择器
                $('[name=cate_id]').html(htmlStr);
                //告诉layui重新渲染
                form.render();
            }
        })
    }
    //给筛选按钮绑定提交事件
    $('#btn-search').on('submit', function (e) {
        e.preventDefault();
        //获取筛选条件的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //把获取的值赋值给q
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染
        initTable();
    })
    //定义渲染分页的方法
    function renderPage(total) {
        // laypage.render渲染分页
        laypage.render({
            elem: 'pages', //分页区id
            count: total, //总数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //默认选中的分页
            //自定义分页功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //每页条数的选择项
            //分页切换时 触发jump回调函数
            //调用jump回调函数 触发死循环的两种方式
            //1 点击页码时
            //2 调用renderPage方法时
            //可以通过first的值 判断时那种方式触发的
            //为true时 是第2种方式
            //所以可以根据first是否为true判断是否调用initTable方法 为非真时调用就不会死循环
            jump: function (obj, first) {
                //获取最新的页码值
                q.pagenum = obj.curr;
                //把最新的条目数 赋值给pagesize 重新渲染页面
                q.pagesize = obj.limit;
                //调用initTable重新渲染
                if (!first) {
                    initTable();
                }
            }
        })
    }
    //通过代理 为删除按钮绑定点击事件
    $('body').on('click', '.btn-del', function () {
        //获取删除按钮的个数
        var len = $('.btn-del').length;
        var id = $(this).attr('data-id');
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    //当删除文章之后 判断列表中是否还有数据
                    //如果没有 让页码值-1 再调用initTable方法
                    //可以根据页面中还有几个删除按钮判断还有几条数据
                    if (len === 1) {
                        //页码值最小是1
                        q.pagenum = q.pagenum ===1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})