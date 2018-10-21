$(function(){
	var vue = new Vue({
		el: "#cart",
		data : {
			listParam : {},
			username:'',
			flag:'',
			cartDetail:'',
			productId:{},
			productIds:{},
			updateCount:{},
			cartNum:'',
			url:"http://127.0.0.1:5500"
		},
		methods : {
			init: function(){
				this.listItem();
				this.username = localStorage.getItem("username");
				this.getCartList();
				this.cartNumber();
			},
			//去结算
			goPay:function(){
				window.location.href="./orderConfirm.html";
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
			//退出登陆
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
			//单个商品的选中
			selectPro:function(productId){
				var that = this;
				that.productId.productId=productId;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/select.do",
					data:that.productId,
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				that.productId.productId =null;
			},
			//单个商品的非选中
			unselectPro:function(productId){
				var that = this;
				that.productId.productId=productId;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/un_select.do",
					data:that.productId,
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				that.productId.productId = null;
			},
			//整个购物车全部选中
			selectAll:function(event){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/select_all.do",
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				var _this =$(event.path[0]);
				if(_this.is(':checked')){
					$('#btn2').prop("checked",false);
				}
				//console.log(event.path[0]);
			},
			//个别商品数量减少
			minus:function(productId,event){
				var that = this;
				var _this = $(event.path[0]);
				var pCount =_this.siblings(".count-input").val();
				if(pCount==0){
					return;
				}
				pCount--;
				that.updateCount.productId =productId;
				that.updateCount.count=pCount;
				console.log(pCount);
				$.ajax({
					type:'POST',
					url:that.url+"/cart/update.do",
					data:that.updateCount,
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				that.updateCount.productId =null;
				that.updateCount.count = null;
			},
			//个别商品数量增加
			plus:function(productId,event){
				var that = this;
				var _this = $(event.path[0]);
				var pCount =_this.siblings(".count-input").val();
				pCount++;
				that.updateCount.productId =productId;
				that.updateCount.count=pCount;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/update.do",
					data:that.updateCount,
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				that.updateCount.productId =null;
				that.updateCount.count = null;
			},
			deletePro:function(productIds){
				var that = this;
				that.productIds.productIds = productIds;
				console.log(productIds);
				$.ajax({
					type:'POST',
					url:that.url+"/cart/delete_product.do",
					data:that.productIds,
					success:function(data){
						that.getCartList();
						console.log(data);
						that.cartNumber();
					}
				});
				that.productIds.productIds = null;
			},
			//整个购物车不选中
			unselectAll:function(event){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/un_select_all.do",
					dataType:"json",
					success:function(data){
						that.getCartList();
						that.cartNumber();
					}
				});
				var _this =$(event.path[0]);
				if(_this.is(':checked')){
					$('#btn1').prop("checked",false);
				}
				//console.log(event.path[0]);
			},
			//获取购物车的列表
			getCartList:function(){
				var that = this;
				$.ajax({
					type:'POST',
					url:that.url+"/cart/list.do",
					dataType:"json",
					success:function(data){
						if (data.success) {
							that.cartDetail = data.data;
							that.flag = true;
							console.log(that.cartDetail);
						}else{
							that.flag =false;
						}
					}
				});
			}
		}
	});
	vue.init();
})