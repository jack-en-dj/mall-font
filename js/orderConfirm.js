$(function () {
	var vue = new Vue({
		el: "#orderConfirm",
		data: {
			listParam: {},
			username: '',
			flag: '',
			cartDetail: '',
			productId: {},
			productIds: {},
			updateCount: {},
			OrderList: null,
			OrderAddress: {},
			cartNum: '',
			shippingId: null,
			receiverInfo: {},
			url: "http://www.jadeny.top"
		},
		methods: {
			init: function () {
				this.listItem();
				this.username = localStorage.getItem("username");
				this.getCartList();
				this.cartNumber();
				this.getAddressList();
				this.getOrderList();
			},
			//选中地址
			selectAdd: function (id, event) {
				var _this = $(event.path[0]);
				_this.addClass("actives").siblings(".address-item").removeClass("actives");
				this.shippingId = id;
			},
			//删除某个地址
			deleteShip:function(id){
				var that = this;
				that.shippingId=null;
				that.shippingId=id;
				$.ajax({
					type:"POST",
					url:that.url+"/shipping/del.do",
					data:{
						shippingId: that.shippingId
					},
					success:function(data){
						that.getAddressList();
					}
				})
			},
			//订单提交
			orderSubmit: function () {
				var that = this;
				//console.log(this.shippingId);
				if (that.shippingId) {
					$.ajax({
						type: 'POST',
						url: that.url + "/order/create.do",
						data: {
							shippingId: that.shippingId
						},
						success: function (data) {
							//console.log(data);
							window.location.href = "./payment.html?orderNumber=" + data.data.orderNo;
						}
					})
				} else {
					alert("请选择地址后,在下单");
				}
			},
			//获取订单的地址
			getAddressList: function () {
				var that = this;
				$.ajax({
					type: 'POST',
					url: that.url + "/shipping/list.do",
					data: {
						pageSize: 50
					},
					success: function (data) {
						that.OrderAddress = data.data.list;
						console.log(that.OrderAddress);
					}
				})
			},
			//获取地址表单的信息
			getRecevierInfo: function () {
				this.receiverInfo.receiverName = $.trim($("#re-name").val());
				this.receiverInfo.receiverProvince = $.trim($("#addr-input").val());
				this.receiverInfo.receiverCity = $.trim($("#addr-input1").val());
				this.receiverInfo.receiverPhone = $.trim($("#re-phone").val());
				this.receiverInfo.receiverAddress = $.trim($("#re-addr").val());
				this.receiverInfo.receiverZip = $.trim($("#youzheng").val());
				console.log($("#re-name").val());
				if ((this.receiverInfo.receiverName == null) && (this.receiverInfo.receiverName == "")) {
					alert("地址信息不能为空")
				}
				if ((this.receiverInfo.receiverProvince == null) && (this.receiverInfo.receiverPhone == "")) {
					alert("地址信息不能为空")
				}
				if ((this.receiverInfo.receiverCity == null) && (this.receiverInfo.receiverCity == "")) {
					alert("地址信息不能为空")
				}
				if ((this.receiverInfo.receiverPhone == null) && (this.receiverInfo.receiverPhone == "")) {
					alert("地址信息不能为空")
				}
				if ((this.receiverInfo.receiverAddress == null) && (this.receiverInfo.receiverAddress == "")) {
					alert("地址信息不能为空")
				}
				if ((this.receiverInfo.receiverZip == null) && (this.receiverInfo.receiverZip == "")) {
					alert("地址信息不能为空")
				}
			},
			updateShip:function(id){
				var that = this;
				that.shippingId = null;
				that.shippingId = id;
				$.ajax({
					type:"POST",
					url:that.url+"/shipping/select.do",
					data:that.shippingId,
					success:function(data){
						//console.log(data);
					}
				})
				console.log(that.shippingId);
			},
			closeBox:function(){
					$(".jumbotron").removeClass("show").addClass("hidden").fadeIn("slow");
			},
			show:function(){
				$(".jumbotron").removeClass("hidden").addClass("show").fadeIn("slow");
			},
			//增加地址信息
			saveShipping: function () {
				var that = this;
				that.getRecevierInfo();
					$.ajax({
						type: "POST",
						url: that.url + "/shipping/add.do",
						data: that.receiverInfo,
						success: function (data) {
							if (data.success) {
								that.getAddressList();
							} else {
								that.getAddressList();
								alert("地址添加失败");
							}
							//console.log(data);
							$(".jumbotron").removeClass("show").addClass("hidden").fadeIn("slow");
						}
					})
			},
			//获取订单商品信息
			getOrderList: function () {
				var that = this;
				$.ajax({
					type: 'POST',
					url: that.url + "/order/get_order_cart_product.do",
					success: function (data) {
						//console.log(data);
						that.OrderList = data.data;
					}
				})
			},
			//购物车的数量显示
			cartNumber: function () {
				var that = this;
				$.ajax({
					type: 'POST',
					url: that.url + "/cart/get_cart_product_count.do",
					success: function (data) {
						if (data.success) {
							that.cartNum = data.data;
						}
					}
				})
			},
			// 获取URL参数的方法
			getUrlParams: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substring(1).match(reg);
				if (r != null) {
					return decodeURI(r[2]);
					//console.log(r[2]);
				} else {
					return null;
				}
			},
			//退出登陆
			logout: function () {
				var that = this;
				$.ajax({
					type: 'POST',
					url: that.url + "/user/logout.do",
					xhrFields: { withCredentials: true },
					dataType: "json",
					success: function (data) {
						if (data.success) {
							localStorage.removeItem("username");
							window.location.href = "./index.html";
						}
					}
				});
			},
			listItem: function () {
				var that = this;
				that.listParam.keyword = this.getUrlParams("keyword") || "";
				that.listParam.categoryId = this.getUrlParams("categoryId") || "";
				that.listParam.orderBy = this.getUrlParams("orderBy") || "default";
				that.listParam.pageNum = this.getUrlParams("pageNum") || 1;
				that.listParam.pageSize = this.getUrlParams("pageSize") || 20;
			},
			//获取购物车的列表
			getCartList: function () {
				var that = this;
				$.ajax({
					type: 'POST',
					url: that.url + "/cart/list.do",
					dataType: "json",
					success: function (data) {
						if (data.success) {
							that.cartDetail = data.data;
							that.flag = true;
						} else {
							that.flag = false;
						}
					}
				});
			}
		}
	});
	vue.init();
})