$(function(){
	var vue = new Vue({
		el:"#login",
		data:{
			username:"",
			password:"",
			user:"",
			pass:"",
			loginData:{},
			url:"http://www.jadeny.top"
		},
		methods:{
			init:function(){
			},
			checkName:function(){
				if (this.username=="") {
					this.user="用户名不能为空";
				}else {
					this.user ="";
				}
			},
			checkPass:function(){
				if (this.password=="") {
					this.pass="密码不能为空";
				}else {
					this.pass="";
				}
			},
			login:function(){
				var that = this;
				if (that.username!=""&&that.password!="") {
					that.loginData.username =that.username;
					that.loginData.password =that.password;
					$.ajax({
						type:'POST',
						url:that.url+"/user/login.do",
						data:that.loginData,
						dataType:"json",
						success:function(data){
							if (data.success) {
								localStorage.setItem("username", data.data.username);
								window.location.href="./index.html";
							}
						}
					})
				}
				return;
			}
		}
	});
	vue.init();
})