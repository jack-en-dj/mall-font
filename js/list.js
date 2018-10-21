$(function(){
	var vue = new Vue({
		el: "#app",
		data : {
			listParam : {},
			listProducts:[],
			username:'',
			cartNum:null,
			url:"http://127.0.0.1:5500"
		},
		methods : {
			init:function(){
				//this.getUrlParams("categoryId");
				this.listItem();
				this.getProduct();
				this.username = localStorage.getItem("username");
				this.cartNumber();
			},
			cartNumber:function(){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/get_cart_product_count.do",
					success:function(data){
						console.log(data);
						if(data.success){
							that.cartNum = data.data;
						}
					}
				});
			},
			// 获取URL参数的方法
			getUrlParams : function(name){
				var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				var r =window.location.search.substring(1).match(reg);
				if (r!=null) {
					return decodeURI(r[2]);
					//console.log(r[2]);
				}else {
					return null;
				}
			},
			logout:function(){
				var that =this;
				$.ajax({
					type:'POST',
					url:that.url+"/user/logout.do",
					xhrFields:{withCredentials:true},
					dataType:"json",
					success:function(data){
						if (data.success) {
							localStorage.removeItem("username");
							window.location.href="./mall.html";
						}
					}
				});
			},
			listItem:function(){
				var that = this;
				that.listParam.keyword =this.getUrlParams("keyword")  || "";
				that.listParam.categoryId = this.getUrlParams("categoryId") || "";
				that.listParam.orderBy = this.getUrlParams("orderBy")  || "default";
				that.listParam.pageNum = this.getUrlParams("pageNum")  || 1;
				that.listParam.pageSize = this.getUrlParams("pageSize")  || 20;
			},
			getProduct:function(){
				var that = this;
				$.ajax({
					type:'get',
					url:that.url+"/product/list.do",
					xhrFields:{withCredentials:true},
					data:that.listParam,
					dataType:"json",
					success:function(data){
						that.listProducts = data.data.list;
					}
				});
			}
		}
	});
	vue.init();
	console.log(vue);
	//console.log(vue.listProducts);
})