var citylistObj = Object.create(searchObj);
citylistObj = $.extend(citylistObj,{
	name:'城市列表页',
	dom:$('#citylist'),
	init:function(){
		this.bindEvent();
		this.loadPositionCity();				
		this.loadBaiduCity();
	},
	loadPositionCity:function(){
		var position_city = $('.city-name').children('a').html();	
		$('.position-city').find('span').html(position_city);
	},
	loadHotCity:function(){
	var that = this;			
		var hotList = $('.hot-list');
		$.ajax({
			url:'/v1/cities',
			type:'get',
			data:{
				type:'hot'
			},
			success:function(res){
				var html = '';
				for(var i = 0; i < res.length ;i ++){
					var code = encodeURI(res[i].name);
					var bdid = that.baiduCityMap[res[i].name];
					html += '<a href="#search-'+ code +'-'+ res[i].id +'-'+ bdid +'">'+res[i].name+'</a>'
				}
				hotList.html(html);
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})
	},
	loadSingleList:function(){
		$.ajax({
			url:'/v1/cities?type=group',
			type:'get',
			success:function(res){
				var html = '';
				var keyArr = [];
				for(var key in res){					
					keyArr.push(key);
				}
				keyArr.sort();
				for(var i = 0;i < keyArr.length;i ++){
					html += '<span>'+ keyArr[i] +'</span>'
				}
				$('.find').html(html);
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})
	},
	loadGroupCity:function(){
		var that = this;
		var allCity = $('.all-city');
		$.ajax({
			url:'/v1/cities',
			type:'get',
			data:{
				type:'group'
			},
			success:function(res){
				//console.log(res['A'])
				var keyArr = [];
				for(var key in res){
					keyArr.push(key);													
				}				
				keyArr.sort();
				var html = '';
				for(var i = 0 ;i < keyArr.length;i ++){
					html += '<div class="rank"><p data-city="'+keyArr[i]+'">'+keyArr[i]+'</p><div class="all-list">'+that.grouplist(res[keyArr[i]])+'</div></div>'
				}
				allCity.html(html);
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})
	},
	grouplist:function(arr){
		var that = this;
		var cityname = '';
		for(var i = 0;i < arr.length;i ++){
			//console.log(arr[i].id)
			var code = encodeURI(arr[i].name);
			var bdid = that.baiduCityMap[arr[i].name];
			cityname += '<a href="#search-'+ code +'-'+ arr[i].id +'-'+ bdid +'">'+arr[i].name+'</a>';
		}
		return cityname;
	},
	bindEvent:function(){
		$('.find').on('click','span',function(){			
			var selector = '[data-city="'+ this.innerHTML +'"]';
			window.scrollTo(0,$(selector).offset().top);
		})
	},
	loadBaiduCity:function(){
		var that = this;
		$.ajax({
			url:'/waimai?qt=getcitylist&format=1&t=1483686354642',
			type:'get',
			dataType:'json',
			success:function(res){			
				var map = res.result.city_list;
				var arr = [];
				for(var kay in map){
					arr = arr.concat(map[kay]);
				}
				//console.log(arr)    //arr是有所有地区对象的一个数组。
				that.baiduCityMap = {};
				for(var i in arr){
					that.baiduCityMap[arr[i].name] = arr[i].code;
				}
				//console.log(that.baiduCityMap)   //对象中的地名与城市ID相对于.
				that.loadHotCity();
				that.loadSingleList();
				that.loadGroupCity();			
			},
			error:function(){
				console.log('后台数(ren)据(yuan)错(de)误(guo)');
			}
		})
	}
})