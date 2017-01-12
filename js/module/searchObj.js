
var searchObj = {
	name:'地区搜索页',
	dom:$('#search'),
	init:function(){
		this.bindEvent();
	},
	changeCity:function(hash){     //改变城市		
		var cityname = hash.split('-')[1] || '上海';
		cityname = decodeURI(cityname);
		$('#cname').html(cityname);
		this.cityID = hash.split('-')[2];    //饿了么城市ID
		this.bdid = hash.split('-')[3];		//百度城市ID
	},
	bindEvent:function(){
		var that = this;
		var elm = $('#elm');
		var baidu = $('#baidu');
		var ul = $('#list');
		elm.click(function(){
			var word = $('#keyword').val();
			$.ajax({
				url:'/v1/pois',
				type:'get',
				data:{
					city_id: that.cityID || 1,
					keyword: word,
					type: 'search'
				},
				success:function(res){
					var html = '';
					for(var i = 0 ;i < res.length; i ++){
						var name = encodeURI(res[i].name);
						html += '<li><a data-geo="'+res[i].geohash+'" data-lng="'+res[i].longitude+'" data-lat="'+res[i].latitude+'" data-name="'+res[i].name+'" href="#rlist">'+res[i].name+'</a><a>'+ res[i].address +'</a></li>';
					}
					ul.html(html);
				},
				error:function(){
					console.log('后台数(ren)据(yuan)错(de)误(guo)');
				}
			})

		})
		baidu.click(function(){			
			var word = $('#keyword').val();
			$.ajax({
				url: '/waimai',
				dataType: 'json',
				data: {
					qt:'poisug',
					wd: word,
					cb:'suggestion_1483600579740',
					cid: that.bdid || 289,
					b:'',
					type:0,
					newmap:1,
					ie:'utf-8'
				},
				success:function(res){					
					var html = '';
					for(var i = 0 ;i < res.s.length; i ++){
						html += '<li>'+res.s[i]+'</li>';
					}					
					ul.html(html);
				},
				error:function(){
					console.log('后台数(ren)据(yuan)错(de)误(guo)');
				}
			})
		})
		$('#list').on('click','a',function(event){
			event.preventDefault();
			var locInfo = {
				lat:this.dataset.lat,
				lng:this.dataset.lng
			}
			storage('ele',locInfo);
			var name = encodeURI(this.dataset.name);
			location.href="#rlist-" + name + '-' + this.dataset.geo;
		})

	},
	enter:function(){
		this.dom.show();
	},
	leave:function(){
		this.dom.hide();
	}
}
