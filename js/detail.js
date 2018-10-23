$(function(){
	var vue = new Vue({
		el: "#detail",
		data : {
			imgChange:null,
			carNumber:1,
			listParam : {},
			productDetail:[],
			toCar:{},
			username:"",
			cartNum:'',
			url:"http://www.jadeny.top"
		},
		methods : {
			init:function(){
				this.listItem();
				this.getProduct();
				this.goHome();
				this.username = localStorage.getItem("username");
				this.cartNumber();
			},
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
			//加入购物车
			addToCar:function(){
				var that = this;
				this.toCar.productId =that.getUrlParams("productId");
				this.toCar.count =this.carNumber;
				$.ajax({
					type:'get',
					url:that.url+"/cart/add.do",
					xhrFields:{withCredentials:true},
					data:that.toCar,
					dataType:"json",
					success:function(data){
						console.log(data);
						if(data.success){
							alert("成功加入购物车!");
						}
					}
				});
			},
			//图片切换
			changeImage:function(pic){
				this.imgChange=pic;
			},
			//购物车数量增减
			NumberChange:function(flag){
				if (flag) {
					if (this.carNumber<this.productDetail.stock) {
						this.carNumber++;
					}
				}else {
					if (this.carNumber>0) {
						this.carNumber--;
					}else {
						alert("亲,没有商品啦~~~~~~");
					}
				}
			},
			//页面跳转
			goHome:function(){
				if (this.listParam==null) {
					window.location.href="./mall.html";
				}
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
			listItem:function(){
				var that = this;
				that.listParam.productId =this.getUrlParams("productId")  || "";
			},
			getProduct:function(){
				var that = this;
				$.ajax({
					type:'get',
					url:that.url+"/product/detail.do",
					xhrFields:{withCredentials:true},
					data:that.listParam,
					dataType:"json",
					success:function(data){
						//data.subImages =data.subImages.split(",");
						that.productDetail = data.data;
						that.productDetail.subImage = that.productDetail.subImage.split(",");
						that.imgChange = that.productDetail.mainImage;
					}
				});
			}
		}
	});
	vue.init();
	console.log(vue);
});