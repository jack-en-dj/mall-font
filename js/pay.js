$(function(){
    var vue = new Vue({
        el:"#pay",
        data:{
            keyword:"",
			username:"",
			cartNum:'',
			orderNo:null,
			codeImg:null,
			url:"http://www.jadeny.top"
        },
        methods:{
			inint:function(){
				this.username =localStorage.getItem("username");
				this.cartNumber();
				this.payOrder();
				this.getOrderStatus();
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
			},
			//给支付宝发送支付请求
			payOrder:function(){
				var that=this;
				var orderNos =that.getUrlParams("orderNumber");
				if(orderNos!=null){
					that.orderNo = null;
					that.orderNo = orderNos;
					$.ajax({
						url:that.url+"/order/pay.do",
						data:that.orderNo,
						dataType:"json",
						success:function(data){
							if(data.success){
								that.codeImg = data.data.qrUrl;
							}else{
								alert("亲~没有下单,请下单后在支付");
								window.location.href="../index.html";
							}
						}
					})
				}
				else{
					alert("亲~没有下单,请下单后在支付");
					window.location.href="../index.html";
				}
			},
			//查询订单状态
			getOrderStatus:function(){
				var that =this;
				$.ajax({
					url:that.url+"/order/query_order_pay_status.do",
					data:that.orderNo,
					dataType:"json",
					success:function(data){
						if(data.data){
							window.location.href="../orderList.html";
						}
					},
					error:function(err){
						alert(err.msg);
					}
				})
			}
		}
    });
    vue.inint();
})