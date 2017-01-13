var detailObj = Object.create(searchObj);
detailObj = $.extend(detailObj,{
	name:'餐厅详情页',
	dom:$('#detail'),
	carshowPrice:$('.det_price').find('p').eq(0).find('span'),
	goodsNum:$('.det_car').find('span'),
	init:function(){		
		this.bindEvent();
		//this.shoppingCart();
	},
	loadInfo:function(hash){
		this.totalArr = [];
		this.carshowPrice.text('0');
		this.goodsNum.text('0');
		this.id = hash.split('-')[1];
		this.lat = hash.split('-')[2];
		this.lng = hash.split('-')[3];
		this.loadHeaderInfo();
		this.loadMenuInfo();
	},
	imageDeal:function(src){
		var path = src || '0655ba29ddf1721f49246cc60eceb7b6jpeg';
		var one = path.substring(0,1);
		var two = path.substring(1,3);
		var three = path.substring(3);
		var four = path.substring(32);
		return (one + '/' + two + '/' + three + '.' + four);
	},
	loadHeaderInfo:function(){
		var that = this;
		$.ajax({
			url:'/shopping/restaurant/'+ this.id,
			type:'get',
			data:{
				extras:['activities','album','license','identification','statistics'],
				latitude:this.lat,
				longitude:this.lng
			},
			success:function(res){
				var html = '';
				var src = that.imageDeal(res.image_path);
				var desc = '暂无活动';
				if(res.activities[0]){
					desc = res.activities[0].description;
				}				
				html += 
						'<div class="hea_wrap">'+
							'<div class="hea_left">'+
								'<img src="//fuss10.elemecdn.com/'+ src +'">'+
							'</div>'+
							'<div class="hea_right">'+
								'<h2>'+ res.name +'</h2>'+
								'<div class="hea_tip">'+
									'<span>商家配送</span><em>/</em><span>'+ res.order_lead_time +'分钟送达</span><em>/</em><span>'+ res.piecewise_agent_fee.description +'</span>'+
								'</div>'+
								'<div class="hea_active">'+
									'<em>新</em>'+
									'<span>'+ desc +'</span>'+
								'</div>'+
							'</div>'+
						'</div>';
				$('.det_head').css('background-image','url(//fuss10.elemecdn.com/'+ src +'?imageMogr/quality/80/format/webp/thumbnail/!40p/blur/50x40/)')
				$('.det_head').html(html);
				$('.arrivePrice').html(res.piecewise_agent_fee.description);
			},
			error:function(){
				console.log('failed');
			}
		})
	},
	loadMenuInfo:function(){
		var that = this;
		$.ajax({
			url:'/shopping/v2/menu?restaurant_id=' + this.id,
			type:'get',
			success:function(res){
				that.loadMenuLeftPane(res);
				that.loadMenuRightPane(res);
			},
			error:function(){
				console.log('failed');
			}
		})
	},
	loadMenuLeftPane:function(res){
		var html = '<ul class="lef_con">';
		for(var i in res){
			html += '<li>'+ res[i].name+'</li>';				
		}
		html += '</ul>';
		$('.men_left').html(html);
		window.leftScroll = new IScroll('.men_left', {
			scrollbars: true,
			probeType: 2,//设置滚动条的灵敏度,监听滚动的事件
			preventDefault: false, //不阻止点击事件
			bounce: true,
			hideScrollbar:true,
			fadeScrollbar:true
		})
	},
	loadMenuRightPane:function(res){
		var that = this;
		var html = '<div class="rig_wrap">';
		for(var i in res){
			html += 
				'<div class="men_goods">'+
					'<h2 data-title="'+ res[i].name +'">'+ res[i].name +'</h2>'+		
					this.loadRightPaneInfo(res[i].foods)+
				'</div>'
		}
		html += '</div>';
		$('.men_right').html(html);
		//设置滚动条
		window.rightScroll = new IScroll('.men_right', {
			scrollbars: true,
			probeType: 2,//设置滚动条的灵敏度,监听滚动的事件
			preventDefault: false, //不阻止点击事件
			bounce: true,
			hideScrollbar:true,
			fadeScrollbar:true
		});
		//设置位置高亮
		this.heightArr = [];
		var sum = 0;
		$('.men_goods').each(function(index,elem){
			//console.log($(elem).height())
			sum += $(elem).height();
			that.heightArr.push(sum);
		});
		var leftItem = $('.lef_con').find('li');
		rightScroll.on('scroll',function(event){
			for(var i = 0;i < that.heightArr.length;i ++){
				if(Math.abs(rightScroll.y) <= that.heightArr[i]){
					leftItem.removeClass('left_active');
					leftItem.eq(i).addClass('left_active');
					break;
				}
			}
		})
	},
	loadRightPaneInfo:function(res){
		//console.log(res)
		var html = '';
		for(var i = 0;i < res.length;i ++){
			var src = this.imageDeal(res[i].image_path) || '8/37/66ad60945dcef6984fcc0fe6fd9f0jpeg.ipeg';
			html += 								
					'<div class="goo_con">'+
						'<div class="goo_left">'+
							'<img src="https://fuss10.elemecdn.com/'+ src +'">'+
						'</div>'+
						'<div class="goo_right">'+
							'<div class="goo_name" data-itemID="'+ res[i].item_id +'">'+ res[i].name +'</div>'+
							'<div class="goo_tip">'+ res[i].description +'</div>'+
							'<div class="goo_well">'+
								'<span class="goo_salenum">月销'+ res[i].month_sales +'份</span>'+
								'<span class="goo_eval"> 好评率'+ res[i].satisfy_rate +'%</span>'+
							'</div>'+							
							'<div class="goo_imp">'+
								'<div class="goo_price">￥<span data-price="'+ res[i].specfoods[0].price +'">'+ res[i].specfoods[0].price +'</span></div>'+
								'<div class="goo_num">'+
									'<a class="minus" href="javascript:;">-</a>'+
									'<span class="show_num">0</span>'+
									'<a class="plus" href="javascript:;">+</a>'+
								'</div>'+
							'</div>'+
						'</div>'+
					'</div>'				
		}
		return html;
	},
	
	bindEvent:function(){		
		var that = this;
		$('.men_left').on('click','li',function(){
			$(this).addClass('left_active').siblings().removeClass('left_active');
			var selector = '[data-title="'+ this.innerHTML +'"]';
			var curelem = $(selector).get(0);
			rightScroll.scrollToElement(curelem,400);
		});
		$('.men_right').on('click','.plus',function(){
			var curShowNum = $(this).closest('.goo_num').find('.show_num');
			var curPrice = $(this).closest('.goo_imp').find('.goo_price').children('span');
			var curMinus = $(this).closest('.goo_num').find('.minus');
			curShowNum.css('display','inline-block');
			curMinus.css('display','inline-block');
			var curNum = +curShowNum.text();
			var curOnePrice = +curPrice.attr('data-price');
			curNum++;
			curShowNum.text(curNum);
			that.totalArr.push(curOnePrice);
			that.carPrice();







			/*var $name = $(this).closest('.goo_con').find('.goo_name').text();
			var $ID = $(this).closest('.goo_con').find('.goo_name').get(0).dataset.itemid;
			console.log($ID)
			var total = curOnePrice*curNum;
			if(parseInt(total) != total){
				total = total.toFixed(1)				
			}
			total = +total;
			var $li = $(
			            '<li>'+
							'<div class="car_name">'+ $name +'</div>'+
							'<div class="car_price">￥<span>'+ total +'</span></div>'+
							'<div class="goo_num car_pm">'+
								'<a href="javascript:;">-</a>'+
								'<span>'+ curNum +'</span>'+
								'<a href="javascript:;">+</a>'+
							'</div>'+
						'</li>');
			$('.carInfo').append($li);*/
		})
		$('.men_right').on('click','.minus',function(){
			var curShowNum = $(this).closest('.goo_num').find('.show_num');
			var curPrice = $(this).closest('.goo_imp').find('.goo_price').children('span');			
			var curMinus = $(this).closest('.goo_num').find('.minus');
			var curNum = +curShowNum.text();
			var curOnePrice = -curPrice.attr('data-price');
			curNum--;
			curShowNum.text(curNum);
			if(curNum == 0){
				curShowNum.css('display','none');
				curMinus.css('display','none');
			}
			that.totalArr.push(curOnePrice);
			that.carPrice();
		})
	},
	carPrice:function(){		
		var priceSum = 0;
		var goodsSum = 0;
		for(var i = 0;i < this.totalArr.length;i ++){
			priceSum += this.totalArr[i];
		}
		priceSum = +priceSum.toFixed(1);
		this.carshowPrice.text(priceSum);
		//console.log($('.show_num'))
		var $span = $('.show_num');
		for(var i = 0;i < $span.length;i ++){
			goodsSum += Number($span.eq(i).text());
		}
		this.goodsNum.text(goodsSum);
		if(this.carshowPrice.text() != 0){
			$('.det_car').css({
				'background-color':'#3190e8',
				'background-image': 'url(../img/2.png)'
			});
			$('.det_rigth').find('a').css('background','#4cd964');
		}else{
			$('.det_car').css({
				'background-color':'#363636',
				'background-image': 'url(../img/1.png)'
			});
			$('.det_rigth').find('a').css('background','#535356');
		}
	}
	
})