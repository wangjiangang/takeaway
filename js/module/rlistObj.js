var rlistObj = Object.create(searchObj);
rlistObj = $.extend(rlistObj,{
	name:'餐厅列表页',
	dom:$('#rlist'),
	loading:true,
	init:function(){
		this.banner();
		this.bindEvent();
	},
	changeArea:function(hash){
		this.areaName = decodeURI(hash.split('-')[1]);
		$('#areaName').html(this.areaName);
		this.geo = hash.split('-')[2];
		this.loadOffset = 0;
		this.loadReslist();
	},
	loadReslist:function(){
		var that = this;
		var locInfo = storage('ele');
		if(!locInfo){
			$.ajax({
				url:'/v2/pois/' + this.geo,
				type:'get',
				success:function(res){
					var obj = {
						lat:res.latitude,
						lng:res.longitude
					};
					storage('ele',obj);
					that.loadInfo(obj);
				}
			})
			return;
		}
		this.loadInfo(locInfo);			
	},
	loadInfo:function(locInfo,flag){
		locInfo = locInfo || storage('ele');
		this.lati = locInfo.lat;
		this.longi = locInfo.lng;
		var that = this;
		if(!!flag === false){
			$('.list_wrap').html('');
		}
		$.ajax({
			url:'/shopping/restaurants',
			type:'get',
			data:{
				latitude:this.lati,
				longitude:this.longi,
				offset:this.loadOffset,
				limit:20,
				extras:'[activities]'
			},
			success:function(res){
				if(res.length < 20){
					$('.list_wrap').addClass('overlist');
				}else{
					$('.list_wrap').removeClass('overlist');					
				}
				var html = '';
				for(var i in res){
					var src = res[i].image_path;
					var one = src.substring(0,1);
					var two = src.substring(1,3);
					var three = src.substring(3);
					var four = src.substring(32);
					src = one + '/' + two + '/' + three + '.' + four;
					var distance = res[i].distance;
					var unit = 'm/';
					if(distance > 999){
						distance = (distance/1000).toFixed(2);
						unit = 'km/';
					}					
					var time = res[i].order_lead_time;
					if(time == 0){
						unit = unit.substring(0,unit.length-1);
						html += '<div class="list_item" data-id="'+ res[i].id +'" data-lat="'+ res[i].latitude+'" data-lng="'+ res[i].longitude+'">'+
								'<div class="left_img">'+
									'<img src="http://fuss10.elemecdn.com/'+src+'">'+
								'</div>'+
								'<div class="right_detail">'+
									'<div class="item_name">'+
										res[i].name+
									'</div>'+
									'<div class="item_salenum">'+
										'<span class="rating">'+ res[i].rating+'</span> 月销<span class="recent_order_num">'+ res[i].recent_order_num +'</span>单'+
									'</div>'+
									'<div class="item_tip">'+
										'￥<span class="start_price">'+ res[i].float_minimum_order_amount +'</span>起送/配送费￥<span class="delivery">'+ res[i].float_delivery_fee +'</span>'+
										'<span class="fr">'+
											'<span class="distance">'+ distance +'</span><span class="unit">'+ unit +'</span>'+
										'</span>'+
									'</div>'+
								'</div>'+
							'</div>';
					}else{
						html += '<div class="list_item" data-id="'+ res[i].id +'" data-lat="'+ res[i].latitude+'" data-lng="'+ res[i].longitude+'">'+
								'<div class="left_img">'+
									'<img src="http://fuss10.elemecdn.com/'+src+'">'+
								'</div>'+
								'<div class="right_detail">'+
									'<div class="item_name">'+
										res[i].name+
									'</div>'+
									'<div class="item_salenum">'+
										'<span class="rating">'+ res[i].rating+'</span> 月销<span class="recent_order_num">'+ res[i].recent_order_num +'</span>单'+
									'</div>'+
									'<div class="item_tip">'+
										'￥<span class="start_price">'+ res[i].float_minimum_order_amount +'</span>起送/配送费￥<span class="delivery">'+ res[i].float_delivery_fee +'</span>'+
										'<span class="fr">'+
											'<span class="distance">'+ distance +'</span><span class="unit">'+ unit +'</span><em class="time"><span class="lead_time">'+ res[i].order_lead_time +'</span>分钟</em>'+
										'</span>'+
									'</div>'+
								'</div>'+
							'</div>';		
					}										
				}
				
				$('.list_wrap').append(html);
				that.loading = true;
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})	
	},
	enter:function(){
		this.dom.show();
		this.bindEvent();
	},
	leave:function(){
		this.dom.hide();
		window.removeEventListener('scroll',this.scrollInfo);
	},
	scrollInfo:function(){
		//console.log('滚了吗')
		var that = rlistObj;
		if(that.loading){
			if(window.scrollY + window.innerHeight === that.dom.height()){
				//console.log('到最底部了')
				that.loading = false;
				that.loadOffset += 20;
				console.log(that.loadOffset)
				that.loadInfo(null,true);
			}	
		}		
	},
	banner:function(){
		$.ajax({
			url:'/v2/index_entry',
			type:'get',
			data:{
				geohash:'wtw3eswewp5',
				group_type:1,
				flags:['F']
			},
			success:function(res){
				var html = '';
				var html2 = '';
				for(var i = 0;i < 8;i ++){					
					html += '<a href="javascript:;">'+
								'<div class="item_img">'+
									'<img src="http://fuss10.elemecdn.com/'+ res[i].image_url +'" alt="">'+
								'</div>'+
								'<span>'+ res[i].title +'</span>'+
							'</a>'
				}
				$('.one_item').html(html);
				for(var i = 8;i < 16;i ++){					
					html2 += '<a href="javascript:;">'+
								'<div class="item_img">'+
									'<img src="http://fuss10.elemecdn.com/'+ res[i].image_url +'" alt="">'+
								'</div>'+
								'<span>'+ res[i].title +'</span>'+
							'</a>'
				}
				$('.two_item').html(html2);
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})
	},
	bindEvent:function(){
		//按需加载
		window.addEventListener('scroll',this.scrollInfo);
		//轮播图	
		var startX = 0;	
		var moveX = 0;
		var startLeft = 0;
		var ele = document.getElementsByClassName('banner')[0];
		ele.addEventListener('touchstart',function(event){
			event.preventDefault();
			startX = event.targetTouches[0].pageX;
			moveX = startX;
			startLeft = $('.goods_items').position().left;			
		},false)				
		ele.addEventListener('touchmove',function(event){
			event.preventDefault();
			var touchPoint = event.targetTouches[0].pageX;
			var move = $('.goods_items').position().left + touchPoint - moveX;
			moveX = touchPoint;
			$('.goods_items').css('left',move);
		},false)
		ele.addEventListener('touchend',function(event){
			event.preventDefault();
			var showWidth = $('.one_item').width();   //获取屏幕宽度
			var itemNum = $('.one_item').length-1;    //条目的最后一个
			var endX = event.changedTouches[0].pageX;
			var DIF = Math.abs(endX - startX);  //差值
			//console.log(endX)
			var half = showWidth/2;   //屏幕中点
			var offsetLeft = $('.goods_items').position().left;   //实际的左侧偏移量
			//console.log(startLeft)
			if(DIF <= half){    //没超过屏幕一半				
				offsetLeft = startLeft;
			}else{				
				offsetLeft = -(startLeft + showWidth);
			}
			/*if(offsetLeft >= 0){
				offsetLeft = -itemNum*showWidth
				//console.log(offsetLeft)
			}else if(offsetLeft < -itemNum*showWidth){
				offsetLeft = 0
			}*/
			$('.goods_items').css({'left':offsetLeft,'transition':'left,.5s'});
			var now = Math.abs(parseInt(offsetLeft/showWidth));
			//console.log(now)
			$('.point span').eq(now).addClass('active').siblings().removeClass('active');
			setTimeout(function(){
				$('.goods_items').css('transition','left,0s');
			},500)
		},false)
		//跳转页面
		$('.list_wrap').on('click','.list_item',function(event){
			window.location.href='#detail-' + this.dataset.id + '-' + this.dataset.lat + '-' + this.dataset.lng;
		})
	}
})