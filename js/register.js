$(function(){
	var vue = new Vue({
		el:"#register",
		data:{
			registerData:{},
			checkData:{},
			username:'',
			password:'',
			password1:'',
			passwordTip:'',
			email:'',
			phone:'',
			question:'',
			phoneTip:'',
			answer:'',
			tip:'',
			emailTip:'',
			usernameTip:'',
			url:"http://127.0.0.1:8080"
		},
		methods:{
			checkName:function(msg){
				var that =this;
				that.checkValid();
			},
			checkPass:function(){
				if (!(this.password==this.password1)) {
					this.passwordTip="两次输入密码不一致";
				}else {
					this.passwordTip="";
				}
			},
			checkPhone:function(msg){
				var that = this;
				var reg=/^1\d{10}$/;
				if (reg.test(msg)) {
					that.phoneTip="手机号码格式正确";
				}else {
					that.phoneTip="手机号码格式不正确";
				}
			},
			checkEmail:function(msg){
				var that = this;
				var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
				if (!reg.test(msg)) {
					that.emailTip="邮箱格式不正确";
				}else {
					that.emailTip="";
				}
			},
			register:function(){
				var that =this;
				this.registerData.username = this.username;
				this.registerData.password = this.password;
				this.registerData.email = this.email;
				this.registerData.phone = this.phone;
				this.registerData.question = this.question;
				this.registerData.answer = this.answer;
				if (this.username==""&&this.password==""&&this.email==""&&this.phone==""&&this.question==""&&this.answer=="") {
					return;
				}else {
					that.registerNet();
				}
			},
			registerNet:function(){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/user/register.do",
					data:that.registerData,
					dataType:"json",
					success:function(data){
						alert(data.msg);
						if (data.success) {
							setTimeout(function(){
								window.location.href="./login.html";
							},3000);
						}
					}
				})
			},
			checkValid:function(){
				var that = this;
				that.checkData.str ="username";
				that.checkData.type=that.username;
				$.ajax({
					type:'POST',
					url:that.url+"/user/check_valid.do",
					data:that.checkData,
					dataType:"json",
					success:function(data){
						that.usernameTip= data.msg;
					}
				})
			}
		}
	})
})