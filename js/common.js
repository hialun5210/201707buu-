function a() {document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + "px";}window.addEventListener("resize", a, !1);a();
require.config({
	paths:{
                "jquery":["http://apps.bdimg.com/libs/jquery/1.10.2/jquery.min", "jquery"],
		"swiper":"http://m.buu-cn.com/buuportal/mportal/js/swiper.min"
	}
});


require(["jquery","swiper"],function($){
	
	
	 var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        loop: true,
        paginationClickable: true,
        spaceBetween:0,
        centeredSlides: true,
        autoplay: 1500,
        autoplayDisableOnInteraction: false
    });
	
	
	$(".question_box").on("click","h5",function(){
	    var $this = $(this);
		if ($this.hasClass("active")) {
			$this.next("p").slideUp(500);
			$this.removeClass("active");
			
		} else {
			    $(".question_box").find("h5").removeClass("active");
				$(".question_box").find("p").slideUp(500);
                $this.addClass("active");
                $this.next("p").slideDown(500);
		}
	});
	
	 $(".menumore").on("click", function(event) {
        event.stopPropagation();
        $("#panelLayer").toggleClass("on");
        $("#navCon").toggleClass("on");
        $("#navCon").toggle();
        $("#panelLayer").toggle();
    }
    );
	
	$("#panelLayer").click(function(){
		$(this).removeClass("on");
		$("#navCon,.area_list").removeClass("on");
		setTimeout(function(){
			$("#panelLayer").hide();
			$("#navCon,.area_list").hide();
		},800)
    });
	
	$(".nav li,#floatDiv_closeWrap").on("click",function(){
	    $(".orderbox").toggle();
		$(".shareLayer").toggle();
		$(".shareLayer").toggleClass("on");	
	})

    $("#show_box_hz,#hz_close").on("click",function(){
	    $(".hz_box").toggle();
		$("#hz_modal").toggle();
	})

   buuWeb = function(){
	    this.validate ={
		    email:/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
			phone:/^((1[3,5,8])|(14)|(17))\d{9}$/	
		}
		this.action=$("#input_aciton").val();
        this.data=null;
		this.showtipbox = "body";
		this.name = $("#name");
		this.tel = $("#tel");
		this.code = $("#code");
		this.email = $("#email");
		this.hz_city = $("#hz_city");
		this.hz_name = $("#hz_name");
		this.hz_code = $("#hz_code");
		this.hz_tel = $("#hz_tel");
        this.mapapi();
		this.submitOrder("#submit_yy");
		this.submitPartner("#submit_hz_btn");

		
		
}
	
buuWeb.prototype={
        sendcode:function(obj,input,type,callback){
		var that = this;
		var time = 60, $submit = $(obj),$input=$(input), timer = null;
        $submit.click(function () {
	    that.showtipbox=type==1?"body":"body";	//1 表示下单提示  2表示 加盟提示	
        if(that.isPhone($input)){
			return ;
		}
        else{
		var $this = $(this);
        if (!$this.attr("disabled")) { 
		 if(callback!=undefined&&typeof callback=="function")
		 {
		       callback();	 
		 } 
            timer = setInterval(function () {
                if (time == 0) {
                    $this.removeAttr("disabled").val("获取验证码");
					$(obj).css("background-color","hsl(27, 100%, 46%)");
                    time = 60;
                    clearInterval(timer);
                }
                else {
                    $this.attr("disabled", true).val("重新发送(" + time + ")");
					$(obj).css("background","#ccc");
                    time--;
                }
            }, 1000)
        }
		}
		
		
    });
},isValEmpty: function(e,text) { //text 跟 文本框属性 tip 必须选填一个；
			var that = this;
			that.tip = text == null ? e.attr("tip"):text; //以text 为主
            return ((e.val()=="")||(e.val()==" ")) ? (text == null ? (that.showTip(that.tip+"不能为空哦"),e.focus(),1):that.showTip(text)) :0;
},isPhone: function(e) {
            var that = this,r = $.trim(e.val())
              , t=that.validate.phone; 
            if(!this.isValEmpty(e)){
				return t.test(e.val()) ? 0 : (that.showTip("手机号码格式不正确"),e.focus(),1);
			}
			else 
			{
			   return 1;
			}
			
 },isEmail: function(e) {
            var that = this,r = $.trim(e.val())
              , t=that.validate.email; 
            if(!this.isValEmpty(e)){
				return t.test(e.val()) ? 0 : (that.showTip("邮箱输入格式不正确"),e.focus(),1);
			}
			else 
			{
			   return 1;
			}
			
   }
,showTip:function(text,cb){
          /* if (g_tips) {
		   window.clearTimeout(g_tips);
		   $(".showtips").remove();
		   g_tips = false;
	      }*/
	      var newTips = $("<div>");
	      $(this.showtipbox).append(newTips);
          newTips.addClass('showtips');
	      newTips.text(text);
/*	      window.setTimeout(function() {
		      newTips.addClass('active');
	      }, 10);*/
	      g_tips = window.setTimeout(function() {
		  $(".showtips").remove();
		  if(cb){
			cb();
		  }
	      }, 1000);	
			
		}
,sendMsgCode:function(telphone){
			
		//发送验证码  
		 
	  $.post(
			  input_aciton+'/pcportalJson/sendPhoneVerlification.action',
				{
					//verificationCode:$("#verificationCode").val(),
					cellphone:$(telphone).val()
				},
				function(data){
					
					if(data.success){
						this.showTip("验证码已发送到手机！","");	
					}else{
						this.showTip("验证码发送失败！");
					}
				}.bind(this)
			); 	
			
			
	},
	submitOrder:function(obj){ //提交订单
		var that = this;
		$(obj).on("click",function(){
		      
			  if(that.isValEmpty(that.name)||that.isPhone(that.tel)||that.isValEmpty(that.code)){return}
			  else{
				  
				  
				   $.post(input_aciton+'/pcportalJson/saveOrder.action',//服务器要接受的url  
	         {
					phone:that.tel.val(),
                    contact:that.name.val(),
                    checkCode:that.code.val(),
					cityid:that.data.cityid,
					prvid:that.data.prvid,
					province:that.data.prvname,
					city:that.data.cityname,
					preorderdate:datepick(1)
					
					
					
	         },     //传递的参数       
	         function(data){ //服务器返回后执行的函数 参数 data保存的就是服务器发送到客户端的数据
	        	 that.showTip(data.message,function(){
	        		 if(data.success){
	        		     setTimeout(function() {
	        			     $(".orderBox").removeClass("slideInLeft").after(function() {
	                         $(".orderOut").addClass("slideInLeft"); 
	                     })
	        		 }, 500);
	        	     }else{}
	        	 });
	        	
	         },   
	         'json'  //数据传递的类型  json  
     );  
			  }	
			
		})
	     	
	},
	submitPartner:function(obj){
	   	var that = this;
		$(obj).on("click",function(){
		      that.showtipbox=".form_box_hz";
			  if(that.isValEmpty(that.hz_city)||that.isValEmpty(that.hz_name)||that.isPhone(that.hz_tel)||that.isValEmpty(that.hz_code)||that.isEmail(that.email)){}
			  else{
				  $.post(input_aciton+'/pcportalJson/displayPcParthnerSendEmailByAjax.action',//服务器要接受的url  
			         {
				            city:that.hz_city.val(),
				            contact:that.hz_name.val(),
				            phone:that.hz_tel.val(),
				            email:that.email.val(),
				            checkCode:that.hz_code.val(),
			         },     //传递的参数       
			         function(data){ //服务器返回后执行的函数 参数 data保存的就是服务器发送到客户端的数据
			        		 that.showTip(data.message,function(){
			        			 if(data.success){
			        				 $("#hz_modal").fadeOut("fast");
				        		     $(".hz_box").fadeOut("slow");
					        	 }else{
					        		 
					        	 }
			        		 }); 
			         },   
			         'json'  //数据传递的类型  json  
		     );  
			  }	
			
		})
	},
	mapapi:function(){
		
	  $.post(this.input_aciton+'/mportalJson/displaypositionApi.action',{},function(data){
		 
		/*$("#input_mapapi").val(data.cityname);*/
		/* alert($("#input_mapapi").val());   */
		/*distcitylist();*/
		/*  debugger; */
		/* searchByCityid(data.cityid,data.cityname);*/
		 
		$(".area_a").html(data.cityname); 
		this.data = data;
		console.log(data); 
		console.log(this.data.cityid)
		 
	 }.bind(this)); 	
	}
}


buuWeb = new buuWeb();
buuWeb.sendcode("#btn_yzm","#tel",2,function(){
	buuWeb.sendMsgCode("#tel");		
});

})
