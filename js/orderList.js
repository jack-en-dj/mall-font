$(function () {
	var vue = new Vue({
		el: "#orderList",
		data: {
			listParam: {},
			username: '',
			cartNum: '',
			orderList:null,
			orderNo:null,
			url: "http://127.0.0.1:8080"
		},
		methods: {
			init: function () {
				this.listItem();
				this.username = localStorage.getItem("username");
                this.cartNumber();
                this.getOrderList();
            },
            //获取订单的列表
            getOrderList:function(){
                var that = this;
                $.ajax({
                    type:"POST",
                    url:that.url+"/order/list.do",
                    success:function(data){
						that.orderList = data.data.list;
                        console.log(that.orderList);
                    }
                })
			},
			//取消订单
			cancel:function(number){
				var that =this;
				that.orderNo = null;
				that.orderNo = number;
				$.ajax({
					type:"POST",
					url:that.url+"/order/cancel.do",
					data:that.orderNo,
					success:function(data){
						alert(data.msg);
						//console.log(data);
						that.getOrderList();
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
							window.location.href = "./mall.html";
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
			}
		}
	});
	vue.init();
})