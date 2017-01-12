function storage(nameSpace,data){
	if(data){
		localStorage.setItem(nameSpace,JSON.stringify(data));
		return;
	}
	return JSON.parse(localStorage.getItem(nameSpace));
}
var hashMap = {           //创建一个 hash值与模块 映射关系表
	search:searchObj,
	citylist:citylistObj,
	rlist:rlistObj,
	detail:detailObj
}
var cacheMap = {}; //判断模块是否初始化的映射关系表。
var prevModule;
var curModule;
function routeController(hash){
	var khash = hash;
	var module = hashMap[hash] || hashMap.search;	
	if(hash.indexOf('search') !== -1){
		module = searchObj;
		khash = 'search';
		module.changeCity(hash);
	}
	if(hash.indexOf('rlist') !== -1){
		module = rlistObj;
		module.changeArea(hash);
	}
	if(hash.indexOf('detail') !== -1){
		module = detailObj;
		khash = 'detail';
		module.loadInfo(hash);
	}
	prevModule = curModule;
	curModule = module;	
	if(prevModule){
		prevModule.leave();
	}
	curModule.enter();
	if(!cacheMap[khash]){
		curModule.init();
		cacheMap[khash] = true;
	}

}
if(location.hash){
	var hash = location.hash.slice(1);
	routeController(hash);
}else{
	routeController('search');
}
window.onhashchange = function(){
	var hash = location.hash.slice(1);
	routeController(hash);	
}
