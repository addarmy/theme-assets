(function($){
    var Metron = {
        init: function(){
            var self = this;
            // 初始化
            $(document).pjax( 'a[data-pjax]', '#kt_body', {
                fragment: '#kt_body',
                timeout: 8000,
                //scrollTo: false,
            });
            $(document).pjax( '[pjax-codes] a', '#pjax-codes', {
                fragment: '#pjax-codes',
                timeout: 8000,
                scrollTo: false,
                maxCacheLength: 10
            });
            $(document).pjax( '[pjax-shops] a', '#pjax-shops', {
                fragment: '#pjax-shops',
                timeout: 8000,
                scrollTo: false,
                maxCacheLength: 10
            });
            $(document).pjax( '[pjax-subscribe-log] a', '#pjax-subscribe_log', {
                fragment: '#pjax-subscribe_log',
                timeout: 8000,
                scrollTo: false,
                maxCacheLength: 10
            });
            $(document).pjax( '[pjax-ticket] a', '#kt_body', {
                fragment: '#kt_body',
                timeout: 8000,
                scrollTo: false,
                maxCacheLength: 10
            });
            // PJAX 渲染开始时
            $(document).on('pjax:start', function() {
                $(".kt-header-menu-wrapper-overlay").remove();
                $("#kt_header_menu_wrapper").removeClass('kt-header-menu-wrapper--on');
                $("#page-body").removeClass('kt-header-menu-wrapper--on');
                $("#kt_header_mobile_toggler").removeClass('kt-header-mobile__toolbar-toggler--active');

                $("#kt_body").addClass("pjax-active");
                $(".loader").css("display", "block");
            });
            // PJAX 渲染结束时
            $(document).on('pjax:complete', function() {
                setTimeout(function(){$("#kt_body").removeClass("pjax-active");},500);
                setTimeout(function(){$(".loader").css("display", "none");},800);
                self.siteBootUp();
            });
            self.siteBootUp();
        },

        siteBootUp: function(){
            var self = this;
            self.mt_user();
            //self.mt_page_title();
            if (typeof(crisp_user_email)!='undefined') {
                self.mt_crisp_push();
            };
            if( document.getElementById("user_index") ) {
                self.mt_copy_text();
                self.mt_user_index();
            };
            if( document.getElementById("user_code") ) {
                self.mt_user_code();
            };
            if( document.getElementById("user_shop") ) {
                self.mt_user_shop();
            };
            if( document.getElementById("user_node") ) {
                self.mt_user_node();
                self.mt_copy_modal();
            };
            if( document.getElementById("user_profile") ) {
                self.mt_user_profile();
            };
            if( document.getElementById("user_ticket") ) {
                self.mt_user_ticket();
            };
            if( document.getElementById("user_invite") ) {
                self.mt_copy_text();
                self.mt_user_invite();
            };
            if( document.getElementById("user_tutorial") ) {
                self.mt_copy_text();
            };
        },

        //  user
        mt_user: function(){

        },
        //  user index
        mt_user_index: function(){
            var self = this;
            // 公告弹窗
            if( document.getElementById("index-pop-modal") ) {
                if (self.mt_ReadCookie("cnxad_lunbo") == "" || self.mt_ReadCookie("cnxad_lunbo") == null) {
                    setTimeout(function(){
                        $('#index-pop-modal').modal('show');
                        self.mt_setCookie("cnxad_lunbo", "yes");
                    },2500);
                };
            };
            //签到
            if( document.getElementById("checkin") ) {
                $("#checkin").click(function () {
                    $("#checkin").text('正在签到');
                    $('#checkin').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                    $.ajax({
                        type: "POST",
                        url: "/user/checkin",
                        dataType: "json",
                        success: function (data) {
                            setTimeout(function(){
                                $.notify({title: '<strong>签到成功</strong>',message: data.msg},{type: 'success',placement: { from: "top", align: "right"},timer: 1000,animate: {enter: 'animated zoomIn',exit: 'animated zoomOut'}});
                                $("#checkin").text('已签到');
                                $('#checkin').removeClass('btn btn-danger kt-subheader__btn-options kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').addClass('btn kt-subheader__btn-secondary disabled');
                            },1000);
                        },
                        error: function (jqXHR) {
                            setTimeout(function(){
                                $.notify({title: '<strong>发生错误</strong>',message: jqXHR.status},{type: 'danger',placement: { from: "top", align: "right"},timer: 1500,animate: {enter: 'animated zoomIn',exit: 'animated zoomOut'}});
                                $("#checkin").text('签到');
                                $('#checkin').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            },1000);
                        }
                    });
                })
            };
            //流量饼状图
            if( document.getElementById("morris-donut-chart") ) {
                Morris.Donut({
                    element: 'morris-donut-chart',
                    data: [{
                        label: "剩余流量",
                        value: traffic_c
                    }, {
                        label: "历史使用",
                        value: traffic_a
                    }, {
                        label: "今日使用",
                        value: traffic_b
                    }],
                    formatter: function (y) { return y + " %" },
                    resize: true,
                    colors:['#5867dd', '#DCE6FD', '#83A4F4']
                });
            };
        },

        // /user code
        mt_user_code: function(){
            // 充值码
            if( document.getElementById("pay_code_form") ) {
                $().ready(function() {
                    $("#code-update").click(function () {
                        var form = $(this).closest('#pay_code_form');
                        form.validate({
                            rules: {
                                pay_code: {
                                    required: true
                                }
                            },
                            messages: {
                                pay_code: "请填写充值码"
                            },
                            errorPlacement: function(error, element) {
                                error.appendTo( element.parent() ); element.addClass('is-invalid');
                                error.addClass('invalid-feedback');
                            }
                        });
                        if (!form.valid()) {
                            return;
                        }
                        $("#code-duihuan").text('正在兑换')
                        $("#code-update").addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                        setTimeout(function(){
                            $.ajax({
                                type: "POST",
                                url: "code",
                                dataType: "json",
                                data: {
                                    code: $("#pay_code").val()
                                },
                                success: function (data) {
                                    if (data.ret) {
                                        Swal.fire({ type: "success",title: data.msg,timer: 1500,showConfirmButton: false });
                                        $("#code-balance").load(location.href+" #code-balance-load");
                                        $("#code-duihuan").text('兑换')
                                        $("#code-update").removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                        //window.setTimeout("location.href=window.location.href", 1500);
                                    } else {
                                        Swal.fire({ type: "error",title: data.msg,timer: 1500,showConfirmButton: false });
                                        $("#code-duihuan").text('兑换')
                                        $("#code-update").removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                    }
                                },
                                error: function (jqXHR) {
                                    Swal.fire({ type: "error",title: '发生错误：' + jqXHR.status });
                                    $("#code-duihuan").text('兑换')
                                    $("#code-update").removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                                }
                            });
                        },1000);
                    });
                });
            };
            // tomatopay支付
            if( document.getElementById("pay_tomato_amount") ) {
                $("#tomato-alipay").click(function(){
                    var pid = 0;
                    var type = 'alipay';
                    var price = parseFloat($("#tomato-amount").val());
                    var form = $(this).closest('#pay_tomato_amount');
                    form.validate({
                        rules: {
                            tomato_amount: {
                                required: true
                            }
                        },
                        messages: {
                            tomato_amount: "请填写金额"
                        },
                        errorPlacement: function(error, element) {
                            error.appendTo( element.parent() ); element.addClass('is-invalid');
                            error.addClass('invalid-feedback');
                        }
                    });
                    if (!form.valid()) {
                        return;
                    };
                    KTApp.blockPage({
                        overlayColor: '#000000',
                        opacity: 0.3,
                        type: 'v2',
                        state: 'primary',
                        message: '正在发起支付请求'
                    });
                    setTimeout(function(){
                        $.ajax({
                            url: "/user/payment/purchase",
                            data: {
                                price: price,
                                type: type,
                            },
                            dataType: 'json',
                            type: "POST",
                            success:function(data){
                                if(data.errcode==-1){
                                    KTApp.unblockPage();
                                    Swal.fire({ type: "error",title: data.errmsg,timer: 1500,showConfirmButton: false });
                                }
                                if(data.errcode==0){
                                    pid = data.pid;
                                    setTimeout(function(){
                                        window.location.href=data.code;
                                    }, 1000);
                                }
                            },
                            error: function (jqXHR) {
                                KTApp.unblockPage();
                                Swal.fire({ type: "error",title: '发生错误 '+ jqXHR.status });
                            }
                        });
                    },1000);
                });
                $("#tomato-wxpay").click(function(){
                    var pid = 0;
                    var type = 'wxpay';
                    var price = parseFloat($("#tomato-amount").val());
                    var form = $(this).closest('#pay_tomato_amount');
                    form.validate({
                        rules: {
                            tomato_amount: {
                                required: true
                            }
                        },
                        messages: {
                            tomato_amount: "请填写金额"
                        },
                        errorPlacement: function(error, element) {
                            error.appendTo( element.parent() ); element.addClass('is-invalid');
                            error.addClass('invalid-feedback');
                        }
                    });
                    if (!form.valid()) {
                        return;
                    };
                    KTApp.blockPage({
                        overlayColor: '#000000',
                        opacity: 0.3,
                        type: 'loader',
                        state: 'primary',
                        message: '正在发起支付请求'
                    });
                    setTimeout(function(){
                        $.ajax({
                            url: "/user/payment/purchase",
                            data: {
                                price: price,
                                type: type,
                            },
                            dataType: 'json',
                            type: "POST",
                            success:function(data){
                                if(data.errcode==-1){
                                    KTApp.unblockPage();
                                    Swal.fire({ type: "error",title: data.errmsg,timer: 1500,showConfirmButton: false });
                                }
                                if(data.errcode==0){
                                    pid = data.pid;
                                    setTimeout(function(){
                                        window.location.href=data.code;
                                    }, 1000);
                                }
                            },
                            error: function (jqXHR) {
                                KTApp.unblockPage();
                                Swal.fire({ type: "error",title: '发生错误 '+ jqXHR.status });
                            }
                        });
                    },1000);
                });
            };
            // idtpay支付
            if( document.getElementById("pay_idtpay_amount") ) {
                $("#idtpay-alipay").click(function(){
                    var pid = 0;
                    var type = 'alipay';
                    var price = parseFloat($("#idtpay-amount").val());
                    var form = $(this).closest('#pay_idtpay_amount');
                    form.validate({
                        rules: {
                            idtpay_amount: {
                                required: true
                            }
                        },
                        messages: {
                            idtpay_amount: "请填写金额"
                        },
                        errorPlacement: function(error, element) {
                            error.appendTo( element.parent() ); element.addClass('is-invalid');
                            error.addClass('invalid-feedback');
                        }
                    });
                    if (!form.valid()) {
                        return;
                    };
                    
                    if(isNaN(price)){
                        Swal.fire({ type: "error",title: '非法的金额',timer: 1500,showConfirmButton: false });
                    }

                    KTApp.blockPage({
                        overlayColor: '#000000',
                        opacity: 0.3,
                        type: 'v2',
                        state: 'primary',
                        message: '正在发起支付请求'
                    });
                    
                    setTimeout(function(){
                        $.ajax({
                            url: "/user/payment/purchase",
                            data: {
                                price: price,
                                type: type
                            },
                            dataType: 'json',
                            type: "POST",
                            success:function(data){
                                console.log(data);
                                if(data.errcode==-1){
                                    KTApp.unblockPage();
                                    Swal.fire({ type: "error",title: data.errmsg,timer: 1500,showConfirmButton: false });
                                }
                                if(data.errcode==0){
                                    pid = data.pid;
                                    $("#dialog-modal").modal();
                                    $("#dialog-msg").html("正在跳转到支付宝..."+data.code);
                                }
                            },
                            error: function (jqXHR) {
                                console.log(jqXHR);
                                KTApp.unblockPage();
                                Swal.fire({ type: "error",title: '发生错误 '+ jqXHR.status });
                            }
                        });
                    },1000);
                });
                $("#idtpay-wxpay").click(function(){
                    var pid = 0;
                    var type = 'wxpay';
                    var price = parseFloat($("#idtpay-amount").val());
                    var form = $(this).closest('#pay_idtpay_amount');
                    form.validate({
                        rules: {
                            idtpay_amount: {
                                required: true
                            }
                        },
                        messages: {
                            idtpay_amount: "请填写金额"
                        },
                        errorPlacement: function(error, element) {
                            error.appendTo( element.parent() ); element.addClass('is-invalid');
                            error.addClass('invalid-feedback');
                        }
                    });
                    if (!form.valid()) {
                        return;
                    };
                    
                    if(isNaN(price)){
                        Swal.fire({ type: "error",title: '非法的金额',timer: 1500,showConfirmButton: false });
                    }

                    KTApp.blockPage({
                        overlayColor: '#000000',
                        opacity: 0.3,
                        type: 'v2',
                        state: 'primary',
                        message: '正在发起支付请求'
                    });
                    
                    setTimeout(function(){
                        $.ajax({
                            url: "/user/payment/purchase",
                            data: {
                                price: price,
                                type: type
                            },
                            dataType: 'json',
                            type: "POST",
                            success:function(data){
                                console.log(data);
                                if(data.errcode==-1){
                                    KTApp.unblockPage();
                                    Swal.fire({ type: "error",title: data.errmsg,timer: 1500,showConfirmButton: false });
                                }
                                if(data.errcode==0){
                                    pid = data.pid;
                                    $("#dialog-modal").modal();
                                    $("#dialog-msg").html("正在跳转到微信支付..."+data.code);
                                }
                            },
                            error: function (jqXHR) {
                                console.log(jqXHR);
                                KTApp.unblockPage();
                                Swal.fire({ type: "error",title: '发生错误 '+ jqXHR.status });
                            }
                        });
                    },1000);
                });
            };
        },

        // /user shop
        mt_user_shop: function(){
            //活动套餐计时
            if (typeof(shop_activity_time)!="undefined"){
                function countTime() {
                    var date = new Date();
                    var now = date.getTime();				
                    var endDate = new Date(shop_activity_time);//设置截止时间
                    var end = endDate.getTime();
                    var leftTime = end - now; //时间差                              
                    var d, h, m, s;
                    if(leftTime >= 0) {
                        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                        m = Math.floor(leftTime / 1000 / 60 % 60);
                        s = Math.floor(leftTime / 1000 % 60);
                        if(s < 10) {
                            s = "0" + s;
                        };
                        if(m < 10) {
                            m = "0" + m;
                        };
                        if(h < 10) {
                            h = "0" + h;
                        };
                        if (d>0){
                            document.getElementById("_d").innerHTML = d + " 天";
                        }else{
                            document.getElementById("_d").innerHTML = "";
                        };
                        if (d==0 && h==0){
                            document.getElementById("_h").innerHTML = "";
                        }else{
                            document.getElementById("_h").innerHTML = h + " 时";
                        };
                        if (d==0 && h==0 && m==0){
                            document.getElementById("_m").innerHTML = "";
                        }else{
                            document.getElementById("_m").innerHTML = m + " 分";
                        };
                            document.getElementById("_s").innerHTML = s + " 秒";
                    } else {
                        document.getElementById("_t").innerHTML = "活动已结束";
                        document.getElementById('buy_activity').disabled=true;
                        $("#buy_activity").text("活动已结束");
                        $("#shop_activity_no").hide('500');
                        return;
                    };
                    setTimeout(countTime, 50);
                };
                countTime();
            };
            $("#coupon_input").click(function () {
                $.ajax({
                    type: "POST",
                    url: "coupon_check",
                    dataType: "json",
                    data: {
                    coupon: $("#coupon").val(),
                    shop: shop
                    },
                    success: function (data) {
                        if (data.ret) {
                            $("#name").html("商品名称："+data.name);
                            $("#credit").html("优惠额度："+data.credit);
                            $("#total").html("总金额："+data.total);
                            $("#order_modal").modal();
                        } else {
                            Swal.fire({ type: "error",title: data.msg }); 
                        };
                    },
                    error: function (jqXHR) {
                    Swal.fire({ type: "error",title: '发生错误',html: data.msg }); 
                    }
                });
            });
            $("#order_input").click(function () {
                if(document.getElementById('autorenew').checked){
                    var autorenew=1;
                }else{
                    var autorenew=0;
                };
                if(document.getElementById('disableothers').checked){
                    var disableothers=1;
                }else{
                    var disableothers=0;
                };
                $.ajax({
                type: "POST",
                url: "buy",
                dataType: "json",
                data: {
                coupon: $("#coupon").val(),
                shop: shop,
                autorenew: autorenew,
                disableothers:disableothers
                    },
                    success: function (data) {
                        if (data.ret) {
                            Swal.fire({ type: "success",title: data.msg }); 
                            window.setTimeout("location.href='/user'", 1500);
                        } else {
                            Swal.fire({ type: "warning",title: "余额不足",html: data.msg+"<br>请充值足够余额后再来购买套餐~"}); 
                        }
                    },
                    error: function (jqXHR) {
                        Swal.fire({ type: "error",title: data.msg+"  发生了错误。" }); 
                    }
                });
            });
        },

        // /user node
        mt_user_node: function(){
            $('#ssr-tab').click(function () {
                $('#ssr-type').hide();
                $('#v2ray-page').hide();
                $('#v2ray-type').show();
                $('#ssr-page').show();
            });
            $('#v2ray-tab').click(function () {
                $('#v2ray-type').hide();
                $('#ssr-page').hide();
                $('#ssr-type').show();
                $('#v2ray-page').show();
            });
        },

        // /user profile
        mt_user_profile: function(){
            // 修改昵称
            $('#change-username').click(function() {
                $("#change-username").text('修改中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                $.ajax({
                    type: "POST",
                    url: "/user/profile/changeusername",
                    dataType: "json",
                    data: {
                        newname: $("#new-name").val()
                    },
                    success: function (data) {
                        $("#change-username").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false});
                            setTimeout(function(){ window.location.reload(); }, 1500);
                        } else {
                            Swal.fire({ type: 'error',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                        }
                    }
                })
            });
            // 修改登录密码 明文显示密码
            $('.oldpwd-password').click(function() {
                $('#oldpwd-none').toggle();$('#oldpwd-show').toggle();
                if ($('#oldpwd').attr('type') == 'password') {
                    $('#oldpwd').attr('type', 'text');
                } else {
                    $('#oldpwd').attr('type', 'password');
                };
            });
            $('.pwd-password').click(function() {
                $('#pwd-none').toggle();$('#pwd-show').toggle();
                if ($('#pwd').attr('type') == 'password') {
                    $('#pwd').attr('type', 'text');
                } else {
                    $('#pwd').attr('type', 'password');
                };
            });
            $('.repwd-password').click(function() {
                $('#repwd-none').toggle();$('#repwd-show').toggle();
                if ($('#repwd').attr('type') == 'password') {
                    $('#repwd').attr('type', 'text');
                } else {
                    $('#repwd').attr('type', 'password');
                };
            });
            // 修改登录密码
            $("#pwd-update").click(function () {
                var form = $(this).closest('#user_profile_password_update');
                form.validate({
                    rules: {
                        oldpwd: {
                            required: true
                        },
                        pwd: {
                            required: true,
                            minlength: 8
                        },
                        repwd: {
                            required: true
                        }
                    },
                    messages: {
                        oldpwd: "请填写账号的旧密码",
                        pwd: {
                            required: "请填写要设置的新密码",
                            minlength: "新密码至少需要8位"
                        },
                        repwd: "请再次输入新密码"
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo( element.parent() ); element.addClass('is-invalid');
                        error.addClass('invalid-feedback');
                    }
                });
                if (!form.valid()) {
                    return;
                };
                $.ajax({
                    type: "POST",
                    url: "password",
                    dataType: "json",
                    data: {
                        oldpwd: $("#oldpwd").val(),
                        pwd: $("#pwd").val(),
                        repwd: $("#repwd").val()
                    },
                    success: function (data) {
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: '登录密码'+data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                            window.setTimeout("location.href='/user'", 1000);
                        } else {
                            Swal.fire({ type: 'error',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                        }
                    },
                    error: function (jqXHR) {
                        Swal.fire({ type: 'error',title: '错误',html: +'     出现了一些错误。',timer: 1500,allowOutsideClick: true,showConfirmButton: false});
                    }
                });
            });
            // telegram绑定二维码
            jQuery('#telegram-qr').qrcode({
                "text": 'mod://bind/'+bind_token
            });
            // 删除账号的密码明文显示
            $('.delete_passwd-password').click(function() {
                $('#delete_passwd-none').toggle();$('#delete_passwd-show').toggle();
                if ($('#delete_passwd').attr('type') == 'password') {
                    $('#delete_passwd').attr('type', 'text');
                } else {
                    $('#delete_passwd').attr('type', 'password');
                };
            });
            // 删除账号
            $("#kill").click(function () {
                $("#kill").text('删除账号数据中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                $.ajax({
                    type: "POST",
                    url: "kill",
                    dataType: "json",
                    data: {
                        passwd: $("#delete_passwd").val(),
                    },
                    success: function (data) {
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: '销毁成功',html: data.msg,showConfirmButton: false }); 
                            window.setTimeout("location.href='/'", 2000);
                        } else {
                            $("#kill").text('确定删除').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            Swal.fire({ type: 'error',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                        }
                    },
                    error: function (jqXHR) {
                        $("#kill").text('确定删除').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        Swal.fire({ type: "error",title: "发生错误",html: jqXHR.status + data.msg,confirmButtonText: '确定' }); 
                    }
                });
            });
            // 二步验证 二维码
            jQuery('#ga-qr').qrcode({
                "text": ga_qr_text
            });
            // 开启二步验证
            $("#ga-enable-true").click(function () {
                $.ajax({
                    type: "POST",
                    url: "gacheck",
                    dataType: "json",
                    data: {
                        code: $("#ga-code").val()
                    },
                    success: (data) => {
                        if (data.ret) {
                            Swal.fire({ type: 'success', title: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false,}); 
                            $('#step2-2-modal').modal('hide');$(".modal-backdrop").remove();
                            $("#step2-card").load(location.href+" #step2-portlet");
                        } else {
                            Swal.fire({ type: 'error', title: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false}); 
                        }
                    },
                    error: (jqXHR) => {
                        Swal.fire({ type: 'error', title: '出现错误', html: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false}); 
                    }
                });
            });
            // 关闭二步验证
            $("#ga-enable-false").click(function () {
                if ($("#ga-passwd").val() == ''){
                    Swal.fire({ type: 'error', title: '请输入密码', timer: 1500, allowOutsideClick: true, showConfirmButton: false});
                    return;
                }
                $("#ga-enable-false").text('正在关闭').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                $.ajax({
                    type: "POST",
                    url: "gaset",
                    dataType: "json",
                    data: {
                        enable: 0,
                        passwd: $("#ga-passwd").val()
                    },
                    success: (data) => {
                        if (data.ret) {
                            Swal.fire({ type: 'success', title: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false}); 
                            $("#ga-enable-false").text('确定关闭').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            $('#step2-false-modal').modal('hide');$(".modal-backdrop").remove();
                            $("#step2-card").load(location.href+" #step2-portlet");
                        } else {
                            Swal.fire({ type: 'error', title: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false}); 
                            $("#ga-enable-false").text('确定关闭').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        }
                    },
                    error: (jqXHR) => {
                        Swal.fire({ type: 'error', title: '出现错误', html: data.msg, timer: 1500, allowOutsideClick: true, showConfirmButton: false}); 
                    }
                });
            });
            // 关闭二步验证的密码明文显示
            $('.ga_passwd-password').click(function() {
                $('#ga_passwd-none').toggle();$('#ga_passwd-show').toggle();
                if ($('#ga-passwd').attr('type') == 'password') {
                    $('#ga-passwd').attr('type', 'text');
                } else {
                    $('#ga-passwd').attr('type', 'password');
                };
            });
            // 每日邮件设置
            $("#user_profile_dailymail").click(function () {
                $("#user_profile_dailymail").text('设置中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                $.ajax({
                    type: "POST",
                    url: "mail",
                    dataType: "json",
                    data: {
                        mail: $("#dailymail").val()
                    },
                    success: function (data) {
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                            $("#user_profile_dailymail").text('保存设置').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            $('#dailymail-modal').modal('hide');$(".modal-backdrop").remove();
                            $("#dailymail-card").load(location.href+" #dailymail-portlet");
                            $("#dailymail-modal-body-content").load(location.href+" #dailymail-modal-body");
                        } else {
                            Swal.fire({ type: 'error',title: data.msg,timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                        }
                    },
                    error: function (jqXHR) {
                        Swal.fire({ type: 'error',title: '错误',html: data.msg+'     出现了一些错误。',timer: 1500,allowOutsideClick: true,showConfirmButton: false}); 
                    }
                });
            });
            // 重置订阅
            $("#sublink-reset").click(function () {
                Swal.fire({ 
                    type: 'info',
                    title: '请注意！',
                    html: '重置节点订阅链接后，原订阅链接将失效，并生成新的订阅链接，您需要在所有客户端重新添加新的订阅后更新节点才能使用！',
                    showCancelButton: true,
                    confirmButtonText: '确定重置',
                    cancelButtonText: '取消'
                }).then((result) => {
                    if (result.value) {
                        $("#sublink-reset").text('重置中    ').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                        var $sspasswd = autopasswd(true,8,10)
                        $.ajax({
                            type: "POST",
                            url: "sspwd",
                            dataType: "json",
                            data: {
                                sspwd: $sspasswd
                            },
                            success: function (data) {
                                if (data.ret) {
                                    Swal.fire({ type: 'success',title: '重置节点订阅链接成功！',showConfirmButton: false }); 
                                    window.setTimeout("location.href='/user/url_reset'",2000);
                                } else {
                                    Swal.fire({ type: 'error',title: '重置失败',html: '请刷新页面后重试一遍',timer: 1500,showConfirmButton: false }); 
                                }
                            },
                            error: function (jqXHR) {
                                Swal.fire({ type: 'error',title: '错误',html: jqXHR.msg,timer: 1500,showConfirmButton: false }); 
                            }
                        });
                    };
                });
            });
        },

        // /user ticket
        mt_user_ticket: function(){
            $('#ticket-create-click').click(function () {
                var form = $(this).closest('#ticket-create-text-form');
                form.validate({
                    rules: {
                        ticket_create_title_text: {
                            required: true
                        },
                        ticket_create_content_text: {
                            required: true
                        }
                    },
                    messages: {
                        ticket_create_title_text: "请填写工单标题",
                        ticket_create_content_text: "请详细填写工单内容"
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo( element.parent() );
                        element.addClass('is-invalid');
                        error.addClass('invalid-feedback');
                    }
                });
                if (!form.valid()) {
                    return;
                };
                $("#ticket-create-click").text('正在创建工单').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                KTApp.blockPage({
                    overlayColor: '#000000',
                    type: 'v2',
                    state: 'primary',
                    message: '请稍候...'
                });
                $.ajax({
                    type: "POST",
                    url: "/user/ticket",
                    dataType: "json",
                    data: {
                        content: $("#ticket-create-content-text").val(),
                        title: $("#ticket-create-title-text").val(),
                        status:status
                    },
                    success: function (data) {
                        $("#ticket-create-click").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        KTApp.unblockPage();
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: data.msg, timer:1500, showConfirmButton: false });
                            $("#user-ticket-col").load(location.href+" #user-ticket-portlet");
                            $('#ticket-create-modal').modal('hide');$(".modal-backdrop").remove();
                        } else {
                            Swal.fire({ type: 'error',title: data.msg, timer:1500, showConfirmButton: false });
                        }
                    },
                    error: function (jqXHR) {
                        $("#ticket-create-click").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        KTApp.unblockPage();
                        Swal.fire({ type: 'error',title: jqXHR.msg, timer:1500, showConfirmButton: false });
                    }
                });
            });
            $('#ticket-Reply-click').click(function () {
                var status = 1;
                var form = $(this).closest('#ticket-Reply-text-form');
                form.validate({
                    rules: {
                        ticket_Reply_content_text: {
                            required: true
                        }
                    },
                    messages: {
                        ticket_Reply_content_text: "请填写回复内容"
                    },
                    errorPlacement: function(error, element) {
                        error.appendTo( element.parent() );
                        element.addClass('is-invalid');
                        error.addClass('invalid-feedback');
                    }
                });
                if (!form.valid()) {
                    return;
                };
                $("#ticket-Reply-click").text('正在回复').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                KTApp.blockPage({
                    overlayColor: '#000000',
                    type: 'v2',
                    state: 'primary',
                    message: '请稍候...'
                });
                $.ajax({
                    type: "PUT",
                    url: $ticket_view_url,
                    dataType: "json",
                    data: {
                        content: $("#ticket-Reply-content-text").val(),
                        status:status
                    },
                    success: function (data) {
                        $("#ticket-Reply-click").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        KTApp.unblockPage();
                        if (data.ret) {
                            Swal.fire({ type: 'success',title: data.msg, timer:1500, showConfirmButton: false });
                            $("#user-ticket-view-col").load(location.href+" #user-ticket-view-portlet");
                            $('#ticket-Reply-modal').modal('hide');$(".modal-backdrop").remove();
                        } else {
                            Swal.fire({ type: 'error',title: data.msg, timer:1500, showConfirmButton: false });
                        }
                    },
                    error: function (jqXHR) {
                        $("#ticket-Reply-click").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        KTApp.unblockPage();
                        Swal.fire({ type: 'error',title: "出现错误", html: "请刷新页面后重试", timer:1500, showConfirmButton: false });
                    }
                });
            });
        },
        mt_user_ticket_off: function(tkid,status){
            KTApp.blockPage({
                overlayColor: '#000000',
                type: 'v2',
                state: 'primary',
                message: '请稍候...'
            });
            $.ajax({
                type: "PUT",
                url: '/user/ticket/'+tkid,
                dataType: "json",
                data: {
                    content: '工单已关闭',
                    status:status
                },
                success: function (data) {
                    KTApp.unblockPage();
                    if (data.ret) {
                        Swal.fire({ type: 'success',title: data.msg, timer:1500, showConfirmButton: false });
                        $("#user-ticket-col").load(location.href+" #user-ticket-portlet");
                    } else {
                        Swal.fire({ type: 'error',title: data.msg, timer:1500, showConfirmButton: false });
                    }
                },
                error: function (jqXHR) {
                    KTApp.unblockPage();
                    Swal.fire({ type: 'error',title: "出现错误", html: "请刷新页面后重试", timer:1500, showConfirmButton: false });
                }
            });
        },

        // /user invite
        mt_user_invite: function(){
            if (typeof(invite_price)!='undefined') {
                $("#buy-invite").click(function () {
                    $("#buy-invite").text('购买中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                    $.ajax({
                        type: "POST",
                        url: "/user/buy_invite",
                        dataType: "json",
                        data: {
                            num: $("#buy-invite-num").val(),
                        },
                        success: function (data) {
                            $("#buy-invite").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            if (data.ret) {
                                Swal.fire({ type: 'success',title: data.msg,timer: 1500,showConfirmButton: false });
                                $("#invite_num_re").load(location.href+" #invite_num");
                                $('#buy-invite-modal').modal('hide');$(".modal-backdrop").remove();
                            } else {
                                Swal.fire({ type: 'error',title: data.msg,timer: 1500,showConfirmButton: false });
                            }
                        },
                        error: function (jqXHR) {
                            $("#buy-invite").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            Swal.fire({ type: 'error',title: data.msg,html :'出现了一些错误',timer: 1500,showConfirmButton: false });
                        }
                    });
                });
            };
            if (typeof(custom_invite_price)!='undefined') {
                $("#custom-invite-confirm").click(function () {
                    $("#custom-invite-confirm").text('定制中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
                    $.ajax({
                        type: "POST",
                        url: "/user/custom_invite",
                        dataType: "json",
                        data: {
                            customcode: $("#custom-invite-link").val(),
                        },
                        success: (data) => {
                            $("#custom-invite-confirm").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            if (data.ret) {
                                Swal.fire({ type: 'success',title: data.msg,showConfirmButton: false });
                                setTimeout(function(){ window.location.reload(); }, 1500);
                            } else {
                                Swal.fire({ type: 'error',title: '出错啦',html: data.msg });
                            }
                        },
                        error: (jqXHR) => {
                            $("#custom-invite-confirm").text('确定').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            Swal.fire({ type: 'error',title: data.msg,html :'出现了一些错误',timer: 1500,showConfirmButton: false });
                        }
                    });
                });
            };
            $("#reset-link").click(function () {
                Swal.fire({ 
                    type: 'info',
                    title: '请注意！',
                    html: '重置邀请链接后，原邀请码和邀请链接将失效，并随机生成新的邀请码和邀请链接',
                    showCancelButton: true,
                    confirmButtonText: '确定重置',
                    cancelButtonText: '取消'
                }).then((result) => {
                    if (result.value) {
                        Swal.fire({ type: 'success',title: '重置成功',showConfirmButton: false }); 
                        window.setTimeout("location.href='/user/inviteurl_reset'", 1500);
                    };
                });
            });
        },

        // /user tutorial
        mt_user_tutorial: function(){
            
        },

        // 修改页面标题
        /*mt_page_title: function(){
            var title = document.title;
            var subtitle = title.split('—');
            $("#subtitle").text(subtitle[0]);
            导航高亮
            $("#kt_header_menu_ul .kt-menu__item").on("click",function(){
                $(".kt-menu__item").removeClass("kt-menu__item--open");
                $(this).addClass("kt-menu__item--open");
            });
             
            $("#logo").on("click",function(){
                $(".current").removeClass("current");
            });
        },*/
        // 拷贝文本
        mt_copy_text: function(){
            $(function () {
                new ClipboardJS('.copy-text');
            });
            $(".copy-text").click(function () {
                $.notify({
                    message: '<strong>已复制到剪切板</strong>'
                },{
                    type: 'success',
                    placement: { 
                        from: "top", 
                        align: "right"
                    },
                    timer: 500,
                    animate: {
                        enter: 'animated zoomIn',
                        exit: 'animated zoomOut'
                    }
                });
            });
        },
        mt_copy_modal: function(){
            $.fn.modal.Constructor.prototype._enforceFocus = function() {
                new ClipboardJS('.copy-modal');
            };
            $(".copy-modal").click(function () {
                Swal.fire({
                    type: "success",
                    title: "已复制到剪切板",
                    timer: 1000,
                    allowOutsideClick: true,
                    showConfirmButton: false
                });
            });
        },
        mt_crisp_push: function(){
            $crisp.push(["set", "user:email", crisp_user_email], ["set", "user:nickname", crisp_user_name]);
            $crisp.push(["set", "session:data", [[
            ["ID", crisp_user_id],
            ["VIP", crisp_user_class],
            ["VIP_Time", crisp_user_class_expire],
            ["Money", "¥ "+crisp_user_money],
            ["Traffic", crisp_user_Traffic],
            ["Next_Reset", crisp_user_next_reset],
            ["Last_Time", crisp_user_lastSsTime],
            ["Reg_Time", crisp_user_reg_date],
            ["Update_Time", crisp_update_time]
            ]]]);
        },
        // cookie时间
        mt_setCookie: function(name, value) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 1 * 60 * 1000*60*6);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
        },
        mt_ReadCookie: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return unescape(arr[2]);
            else return null;
        },
        //购买流量叠加包
        mt_buyTrafficPackage: function(){
            if($('input[name="traffic-package-radio"]:checked').val() == null){
                Swal.fire({ type: 'error',title: '请选择流量包',timer: 1500,showConfirmButton: false});
                return;
            }
            $(".buyTrafficPackage").text('购买中').addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            $.ajax({
                type: "POST",
                url: "/user/shop/buytrafficpackage",
                dataType: "json",
                data: {
                    shopid: $('input[name="traffic-package-radio"]:checked').val()
                },
                success: (data) => {
                    if (data.ret) {
                        $(".buyTrafficPackage").text('购买').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        Swal.fire({ type: 'success',title: data.msg,timer: 1500,showConfirmButton: false });
                        if( document.getElementById("user_shop") ) {
                            window.setTimeout("location.href='/user'",1500);
                        }else if (document.getElementById("user_index")) {
                            setTimeout(function(){ window.location.reload(); }, 1500);
                        };
                    } else {
                        $(".buyTrafficPackage").text('购买').removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        Swal.fire({ type: 'error',title: '出错啦',html: data.msg });
                    }
                }
            });
        },

    };
    window.Metron = Metron;

})(jQuery);

$(document).ready(function()
{
    Metron.init();
});
// 全局主题js
var KTAppOptions = {
    "colors": {
        "state": {
            "brand": "#366cf3",
            "light": "#ffffff",
            "dark": "#282a3c",
            "primary": "#5867dd",
            "success": "#34bfa3",
            "info": "#36a3f7",
            "warning": "#ffb822",
            "danger": "#fd3995"
        },
        "base": {
            "label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
            "shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
        }
    }
};
// 随机生成密码
function autopasswd(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
};

/*  user index  */
// 判断是PC端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
// 判断是windows
function IsWindows() {
    var agent = navigator.userAgent.toLowerCase();
    if (agent.indexOf("win32") >= 0 || agent.indexOf("wow32") >= 0) {
        return true
    } else if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0) {
        return true
    } else {
        return false
    }
}
// 判断是mac
function IsMac() {
    var agent = navigator.userAgent.toLowerCase();
    var MAC = /macintosh|mac os x/i.test(navigator.userAgent) && !window.MSStream;
    if(MAC){
        return true
    } else {
        return false
    }
}
// 判断是Android
function IsAndroid() {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        return true
    } else {
        return false
    }
}
// 判断是ios
function IsiOS() {
    var u = navigator.userAgent;
    if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return true
    } else {
        return false
    }
}
//一键导入
function oneclickImport(client,url){
    if (client == 'ssr'){
        var url_base64=window.btoa(url);
        if (IsWindows()) {
            window.location.href = "sub://"+url_base64;
        } else {
            Swal.fire({
                title: '您的设备可能不支持',
                html: '<code>SSR</code>一键导入仅支持<code>Windows</code>端<code>SSR 5.1</code>以上版本',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续导入',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.value) {
                    window.location.href = "sub://"+url_base64;
                }
            })
        }
    } 
    if (client == 'clashr'){
        if (IsWindows() || IsMac() || IsAndroid()) {
            window.location.href = "clash://install-config?url="+url;
        } else {
            Swal.fire({
                title: '您的设备可能不支持',
                html: '<code>ClashR</code>一键导入仅支持<code>Windows</code>、<code>Mac OS</code>和<code>Android</code>',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续导入',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.value) {
                    window.location.href = "clash://install-config?url="+url;
                }
            })
        }
    }
    if (client == 'shadowrocket'){
        var url_base64=window.btoa(url);
        if (IsiOS()) {
            window.location.href = "sub://"+url_base64;
        } else {
            Swal.fire({
                title: '您的设备可能不支持',
                html: '<code>Shadowrocket</code>一键导入仅支持<code>Apple iOS</code>端设备',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续导入',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.value) {
                    window.location.href = "sub://"+url_base64;
                }
            })
        }
    }
    if (client == 'quantumult'){
        var url_base64=window.btoa(url);
        var url_base64_nes=url_base64.replace(/=/g,"");
        if (IsiOS()) {
            window.location.href = "quantumult://configuration?server="+url_base64_nes;
        } else {
            Swal.fire({
                title: '您的设备可能不支持',
                html: '<code>Quantumult</code>一键导入仅支持<code>Apple iOS</code>端设备',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续导入',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.value) {
                    window.open("quantumult://configuration?server="+url_base64_nes)
                }
            })
        }
    }
    if (client == 'quantumult_v2'){
        var url_base64=window.btoa(url);
        var url_base64_nes=url_base64.replace(/=/g,"");
        if (IsiOS()) {
            window.location.href = "quantumult://configuration?server="+url_base64_nes;
        } else {
            Swal.fire({
                title: '您的设备可能不支持',
                html: '<code>Quantumult</code>一键导入仅支持<code>Apple iOS</code>端设备',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续导入',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.value) {
                    window.location.href = "quantumult://configuration?server="+url_base64_nes;
                }
            })
        }
    }
};

/*  user shop  */
//购买套餐入口传参
function nobuy(id,auto,userclass) {
    if(auto==0){
        document.getElementById('autor').style.display="none";
    }else{
        document.getElementById('autor').style.display="";
    }
    shop=id;
    Swal.fire({
        title: '请注意',
        html: '您当前会员等级为 <code>Lv.'+userclass+'</code>，与将要 <code>购买的套餐等级价值不同</code>，无法自助升级；继续购买将导致您的会员时长清零并按新套餐重新计算！如有需要请联系客服升级！',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '继续购买',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.value) {
        $("#coupon_modal").modal();
        }
    })
}
function buy(id,auto) {
    if(auto==0){
        document.getElementById('autor').style.display="none";
    }else{
        document.getElementById('autor').style.display="";
    }
    shop=id;
    $("#coupon_modal").modal();
}

/*  user node  */
//  ssr节点配置
function urlChange(id, is_mu, rule_id) {
    var site = './node/' + id + '?ismu=' + is_mu + '&relay_rule=' + rule_id;
    if (id == 'guide') {
        var doc = document.getElementById('infoifram').contentWindow.document;
        doc.open();
        doc.write('<img src="../images/node.gif" style="width: 100%;height: 100%; border: none;"/>');
        doc.close();
    }
    else {
        document.getElementById('infoifram').src = site;
    }
    $("#nodeinfo").modal();
}
function UserClassinsufficient(){
    Swal.fire({ type: "error",title: '等级不足',html: '您当前套餐等级不支持使用此节点' });
}
