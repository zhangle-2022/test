/**------------------------- 公共部分 start -------------------------*/

var url = 'https://user.www.gov.cn/';
var callBackUrl = 'https://dati.www.gov.cn/dswzd/202303/choujiang.html';
var servicecode = 'dswzd';
var servicepwd = 'fYTTi7Ww';
/*var servicecode = 'hlwdc';
var servicepwd = 'TRpcTG1e';*/
var time = gettime();
var sign = hex_md5(servicecode+servicepwd+time);
$(function(){
	
	//初始化配置
	idm.config({
		debug: false, //开启调试模式,调用的所有api的返回值会在客户端alert
		url: url,//必填，idm地址
	    servicecode: servicecode,//必填，接入代码
	    time:time,
		sign: sign,	//必填，签名
		success:function(){//回调函数（成功）	
			if(deviceType()!="pc"){//pc版 app
				/*$(".phone").hide();
				$(".point-out").hide();*/
			}
			var explorer =navigator.userAgent;
			if (explorer.indexOf("hanweb") >= 0){  
				getTicket();
				if($("#login_msg")[0]){
					$("#login_msg").hide();
				}
			}else if (explorer.indexOf("AliApp") >= 0){
				if($("#login_msg")[0]){
					$("#login_msg").hide();
				}
				aliappIslogin();
			}else{				
				//islogin(false,true);
			}
		},
		fail:function(r)	{	// 回调函数(失败)
			alert("idm.config fail！");
		}
	});
	
});
//获得时间戳
function gettime(){
	var time = new Date();
	return time.getFullYear()+''+add(time.getMonth()+1)+''+add(time.getDate())+''+add(time.getHours())+''
		+add(time.getMinutes())+''+add(time.getSeconds());
}

function add(m){
	return m<10?'0'+m:m;
}
//检测设备类型
function deviceType(){
	var type = "pc";
	var explorer =navigator.userAgent;
	if (explorer.indexOf("hanweb") >= 0){
		type = "app";
	}else{
		var isMobile = (/iPad|iPhone|Android|Windows Phone|Nokia/).test(navigator.userAgent);
		if (isMobile) {
			type = "mobile";
		}
	}
	return type;
}


/**--------------------  处理PC端的业务 start  ------------------*/

	$(function(){//站内信.eq(0)
	      $(".top_row_r_icon1").click(function(i,it){
				idm.user.islogin ({
					success:function(r){
						/*var s=$('#yh_login').attr("src","https://user.www.gov.cn/sso/iframelogin?servicecode=dswzd&gourl=https://user.www.gov.cn%2fuser%2fuserCenter%3finit%3dmy-message")
						var loginUrl=$('#yh_login').attr("src");*/
					    window.location.href = "https://user.www.gov.cn/sso/login?servicecode=dswzd&gourl=https://user.www.gov.cn%2fuser%2fuserCenter%3finit%3dmy-message";
						},
					fail:function(r){
						if(deviceType()!="pc"&&deviceType()!="app"){
							//https://user.www.gov.cn//sso/login?servicecode=hlwdc&gourl=
						    window.location.href = "https://user.www.gov.cn/sso/login?servicecode=hlwdc&gourl=https://user.www.gov.cn%2fuser%2fuserCenter%3finit%3dmy-message";

						}else{
							$('#yh_login').attr("src","https://user.www.gov.cn/sso/iframelogin?servicecode=dswzd&gourl=https://user.www.gov.cn%2fuser%2fuserCenter%3finit%3dmy-message");
							easyDialog.open({
								container : 'yh_logindialog',
								callback : callFn
							});
						}
						
					}
				});
        	});
            $(".top_row_r_icon3").click(function(i,it){
            	idm.user.islogin ({
					success:function(r){
						window.location.href = "https://user.www.gov.cn/sso/login?servicecode=dswzd&gourl=https://user.www.gov.cn//user/edit";
					},
					fail:function(r){
						if(deviceType()!="pc"&&deviceType()!="app"){
							//https://user.www.gov.cn//sso/login?servicecode=hlwdc&gourl=
						    window.location.href = "https://user.www.gov.cn/sso/login?servicecode=hlwdc&gourl=https://user.www.gov.cn//user/edit";
						}else{
						$('#yh_login').attr("src","https://user.www.gov.cn/sso/iframelogin?servicecode=dswzd&gourl=https://user.www.gov.cn//user/edit");
						easyDialog.open({
							container : 'yh_logindialog',
							callback : callFn
						});
						}
					}
				});
        	});
            
            $("#choujiang").click(function(i,it){
				idm.user.islogin ({
					userinfo:true,
					getticket:true,
					success:function(r){
					  //已登陆跳到抽奖页面
				      window.location.href = "./choujiang.html";
				     },
					fail:function(r){//未登陆进行登陆登陆成功跳到抽奖页面
						if(deviceType()!="pc"&&deviceType()!="app"){
							window.location.href = "https://user.www.gov.cn/sso/login?servicecode=hlwdc&gourl="+callBackUrl;
						    //var url="";
							/*idm.user.openlogin ({
								redirect : true,
								gourl: callBackUrl,//业务地址：非必填。回调总入口将以sp参数返回
								extargs: 'a=b&c=d'//扩展参数：非必填。回调将回传
							});*/
						}else{
							$('#yh_login').attr("src",url+"/sso/iframelogin?servicecode="+servicecode+"&gourl="+callBackUrl);
							easyDialog.open({
								container : 'yh_logindialog',
								callback : callFn
							});
						}
						
					}
				});
        	});
});
	$(function(){
		//pc版重置操作
		$(".reset").click(function(event){
			event.preventDefault();
			if(window.confirm('即将清空已填写内容，请确认。')){
				$('#zlhd')[0].reset();
				islogin(true);
			}
		});
		
		$('.yh_close').click(function(){
			easyDialog.close();
			$('#yh_favorite').attr("src","");
			$('#yh_login').attr("src","");
		})
	});
	//设置弹出层关闭后执行的回调函数。
	var callFn = function(){
		idm.user.islogin ({
			success:function(r){//已登录 打开收藏页面
			
			},
			fail:function(r){//未登录打开登录界面
			
			}
		});
	};
	//回调调用，配置回调地址，解决跨域问题
	function loginCallback(){
		$('.close').click();
	}
/**--------------------  处理PC端的业务 end  ------------------*/

	 function getDatas(){
	    var answerscore="answerscore";
	    var answertime="answertime";
	    var answernum="answernum";
	    var totalScore=root.totalScore;
		var qishu=$(".qishu").text();
		var _year = new Date().getFullYear();
		var pos=qishu.indexOf('期');
       // qishu=qishu.substring(1,pos);
		if(pos>0){
			qishu=qishu.substring(1,pos);
		}else{
			qishu=qishu.substring(1,2);
		}
		// qishu='20200'+qishu;
		qishu=qishu.length<2 ? _year+'0'+qishu : _year+qishu;
		//qishu=qishu.substring(1,2);
		var timeMinute=root.time;
		if(timeMinute==undefined){
			timeMinute=0;
		}else{
			
		}
		var strScore = totalScore.toString();
		var strTime = timeMinute.toString();		
		setCookie(answerscore,idm.aes.encode(strScore,'10DB58FF7AD9C1B128EC322439915295'));
		setCookie(answertime,idm.aes.encode(strTime,'10DB58FF7AD9C1B128EC322439915295'));
		setCookie(answernum,qishu);
	 }
	//向cookie存数据
	function setCookie(name,value)
	{
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + 30*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	}




	