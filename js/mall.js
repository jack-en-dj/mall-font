$(function(){
	var vue = new Vue({
		el:'#mall',
		data:{
			keyword:"",
			username:"",
			cartNum:'',
			url:"http://www.jadeny.top"
		},
		methods:{
			inint:function(){
				this.username =localStorage.getItem("username");
				this.cartNumber();
			},
			//购物车数量
			cartNumber:function(){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/get_cart_product_count.do",
					success:function(data){
						if(data.success){
							that.cartNum = data.data;
						}
					}
				})
			},
			//退出登陆
			logout:function(){
				var that =this;
				$.ajax({
					type:'POST',
					url:that.url+"/user/logout.do",
					dataType:"json",
					success:function(data){
						if (data.success) {
							localStorage.removeItem("username");
							window.location.href="../index.html";
						}
					}
				});
			},
			//获取URL参数的值
			getUrlParams : function(name){
				var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
				var r =window.location.search.substring(1).match(reg);
				if (r!=null) {
					return decodeURI(r[2]);
				}else {
					return null;
				}
			},
			//搜索框的点击事件，输入产品的关键字，
			searchProduts:function(){
				var that = this;
				window.location.href="../list.html?keyword="+encodeURI(that.keyword);
			}
		}
	});
	vue.inint();
})