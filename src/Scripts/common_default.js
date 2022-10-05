// $Id: common.js,v 1.156 2010-02-04 08:34:34 s.ignatenkov Exp $

var undefined;
var iam_sorting_now;

if (typeof($) == 'undefined')
	document.write('<script type="text\/javascript" src="\/js\/jquery.js"><\/' + 'script>');

document.write('<script type="text\/javascript" src="\/js\/base64.js"><\/' + 'script>');

Number.prototype.toFixed = Number.prototype.toFixed || function(fractionDigits){
	return Math.floor( this * Math.pow(10, fractionDigits) + .5) / Math.pow(10, fractionDigits)
};
String.prototype.hashCode = function () {
	var hash = 0, i, c;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		c = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + c;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (obj, fromIndex) {
		if (fromIndex == null) {
			fromIndex = 0;
		} else if (fromIndex < 0) {
			fromIndex = Math.max(0, this.length + fromIndex);
		}
		for (var i = fromIndex, j = this.length; i < j; i++) {
			if (this[i] === obj)
				return i;
		}
		return -1;
	};
}

function str_trim(str) {
	return str.replace(/^\s*/, "").replace(/\s*$/, "");
}
function array_filter(arr, fun) {
	var len = arr.length;
	if (typeof fun != "function")
		throw new TypeError();
	var res = new Array();
	var thisp = arguments[1];
	for (var i = 0; i < len; i++) {
		if (i in arr) {
			var val = arr[i];
			if (fun.call(thisp, val, i, arr))
				res.push(val);
		}
	}
	return res;
}
function array_unique (arr) {
	var res = [];
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		for (var j = i + 1; j < len; j++) {
			if (arr[i] === arr[j]) {
				j = ++i;
			}
		}
		res.push(arr[i]);
	}
	return res;
}
function gebi(id){
	return document.getElementById(id) || document[id];
}

function jsquote(str){
	return str.replace(/'/g,'&#39;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/&/g,'&amp;') //'
}

function getCoords(obj){
	var o=typeof(obj) == 'string' ? gebi(obj) : obj
	var ret={'l':o.offsetLeft,'t':o.offsetTop,'w':o.offsetWidth,'h':o.offsetHeight}
	while(o=o.offsetParent){
		ret.l+=o.offsetLeft
		ret.t+=o.offsetTop
	}
	return ret
}
var waitFuncId=0
function waitObj(id,evFunc){
	if(document.getElementById){
		if(typeof evFunc=='function'){
			window['waitFunc'+waitFuncId]=evFunc
			evFunc='waitFunc'+waitFuncId
			waitFuncId++
		}
		var obj=(id=='body')?document.body:document.getElementById(id)
		if(obj) window[evFunc]()
		else setTimeout("waitObj('"+id+"','"+evFunc+"')",100)
	}else{
		onload=evFunc
	}
}

function preloadImages() {
	var d = document;
	if(!d._prImg) d._prImg = new Array();
	var i, j = d._prImg.length, a = preloadImages.arguments;
	for (i=0; i<a.length; i++) {
		if (typeof a[i] != "string") continue;
		d._prImg[j] = new Image;
		d._prImg[j++].src = a[i];
	}
}

function checkbox_set(pfx, val) {
  var chk=document.getElementsByTagName('INPUT');
  for(var i=0;i<chk.length;i++){
    if(chk[i].name.indexOf(pfx)==0 || chk[i].getAttribute('grp')==pfx){
      chk[i].checked = (val == undefined ? !chk[i].checked: val);
    }
  }
}

// ==============================================================================

function showError(error, code) {
	var params = '';
	
	code = parseInt(code);
	
	error = error.replace(/&/g, encodeURIComponent('&'));
	error = error.replace(/#/g, encodeURIComponent('#'));
	
	if (code & 1) {
		params += '&in_bank=1';
	}
	
	return showMsg2("error.php?error=" + error + params);
}

function luckyMsg(text, url) {
	var error_div = _top().window.gebi('error_div');
	
	error_div.errorCloseCallback = function() {
		_top().frames["main_frame"].frames["main"].location.href = url;
		error_div.errorCloseCallback = null;
	}
	
	showMsg2("error.php?error="+encodeURIComponent(text), "Сообщение");

}

function error_close() {
	try {
		var win = _top().window;
		var obj = _top().gebi('error');
		var div = _top().gebi('error_div');
		if (!obj || !div) return false;
		obj.style.display = 'none';
		div.style.display = 'none';
		obj.src='';
		obj.width = 1;
		obj.height = 1;
		obj.style.left = 0;
		obj.style.top = 0;

		if (div.errorCloseCallback) {
			div.errorCloseCallback();
		}
		
	} catch(e) {}

	return true;
}

function showMsg2(url, title, w, h) {
	try {
		w=w||480;
		h=h||300;
		var win = _top().window;
		var doc = _top().document;
		var width = doc.body.clientWidth;
		var height = doc.body.clientHeight;
		var div_width = Math.max(doc.compatMode != 'CSS1Compat' ? doc.body.scrollWidth : doc.documentElement.scrollWidth,width);
		var div_height = Math.max(doc.compatMode != 'CSS1Compat' ? doc.body.scrollHeight : doc.documentElement.scrollHeight,height);
		var obj = _top().gebi('error');
		var div = _top().gebi('error_div');
		if (!obj || !div) return false;
		obj.src=url;
		
		div.style.width = div_width;
		div.style.height = div_height;
		
		obj.width = w;
		obj.height = h;
		obj.style.left = ((width-w)/2);
		obj.style.top = ((height-h)/2);
		div.style.display = 'block';
		obj.style.display = 'block';
		win.scrollTo(0,0);
//		obj = _top().gebi('artifact_alt');
//		if (obj) obj.innerHTML='';
	} catch(e) {}
	return true;
}

function showMsg(url, title, w, h, l, t) {
	var windowParams = null;

	if (typeof $ !== 'undefined' && typeof $.jStorage !== 'undefined') {
		if (url.indexOf('action_form') > -1) {
			windowParams = $.jStorage.get('actionFormParams');
			
			if (windowParams) {
				windowParams.w = w;
				windowParams.h = h;
			}
		}

		if (url.indexOf('navigator') > -1) {
			windowParams = $.jStorage.get('navigatorParams');
			
			if (windowParams) {
				windowParams.w = w;
				windowParams.h = h;
			}
		}
	}

	if (windowParams) {
		w = windowParams.w;
		h = windowParams.h;
		l = windowParams.l;
		t = windowParams.t;
	}

	w = w || 520;
	h = h || 320;
	
	if (_top().js_popup) {
		_top().createPopup({title: title, iframe: {src: url, width: w, height: h}});
	} else {
		var win = _top().window,
			newWin;

		l = l || window.screenLeft || window.screenX;
		t = t || window.screenTop || window.screenY;
		
		newWin = win.open(url, "", 'width=' + w + ',height=' + h + ',left=' + l + ',top=' + t + ',location=no,menubar=no,resizable=yes,scrollbars=no,status=no,toolbar=no');
		return newWin;
	}
}

function showMsg3(url, title, w, h) {
	w = w || 520;
	h = h || 320;

	var div = gebi('popup_styled'),
		iframe = gebi('popup_styled_iframe'),
		hider = gebi('frame_content_hider'),
		title_div = gebi('popup_styled_title');

	iframe.src = url;
	iframe.style.height = h;
	iframe.style.width = w;

	title_div.innerHTML = title;

	div.style.top = document.body.scrollTop + (document.body.clientHeight - h)/2;
	div.style.left = document.body.scrollLeft + (document.body.clientWidth - w)/2;

	hider.style.display = 'block';

	iframe.onload = function() {
		div.style.display = 'block';
	}
}

function closeMsg() {
	gebi('frame_content_hider').style.display = 'none';
	gebi('popup_styled').style.display = 'none';
}

function changeDivDisplay(div_id, display) {
	if (!div_id || !display) return false;
	div = gebi(div_id);
	if (!div) return false;
	div.style.display = display;
}

function showUserInfo(nick, server_url) {
	var url = '';
	if (server_url) url = server_url;
	else url += '/';
	url += "user_info.php?nick="+encodeURIComponent(nick);
	if (_top().js_popup) {
		tProcessMenu('b06', {url: url, force: true});
		tUnsetFrame('main');
	} else {
		window.open(url, "", "width=920,height=700,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
	}
}

function showArtifactInfo(artifact_id,artikul_id,set_id,evnt,gift_id) {
	if (typeof(iam_sorting_now) !== 'undefined' && iam_sorting_now)
		return false;
	if (evnt && evnt.shiftKey && artifact_id) {
		chat_add_artifact_macros(artifact_id);
		return false;
	}
	var url = "";
	if (gift_id) url += "?gift_id="+gift_id;
	else if (artifact_id) url += "?artifact_id="+artifact_id;
	else if (set_id) url += "?set_id="+set_id;

	if (artikul_id) {
		url += (artifact_id ? "&" : "?") + "artikul_id="+artikul_id;
	}

	if (!url) {
		return false;
	}

	window.open("/artifact_info.php" + url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showPetInfo(pet_id,artikul_id) {
	var url = "/pet_info.php";
	if (pet_id) url += "?pet_id="+pet_id;
	else if (artikul_id) url += "?artikul_id="+artikul_id;
	else return;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showSmsForm(nick) {
	var url = "/area_post.php?&mode=sms&hide=1&nick=" + nick;
	window.open(url, "", "width=920,height=500,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function dialogEventCheck(event,param,close) {
	if (!param) param = '0';
	if (!_top().dialogOn && event != 'FAQ' && event != null) return false;
	if (event) {
		var id = _top().dialogEvent[event+'_'+param];
		if (id && id.length && id.length > 0) {
			for(var i=0;i<id.length;i++) {
				if (_top().dialogShow[id[i]]) continue;
				var k = false;
				for(var j=0;j<_top().dialogNeed.length;j++) {
					if (_top().dialogNeed[j] == id[i]) {
						k = true;
						break;
					}
				}
				if (_top().showNow == id[i]) k=true;
				if (!k) _top().dialogNeed.push(id[i]);
			}
		}
	}
	try {
		var div = _top().frames['main_frame'].gebi('dialog_div');
		//var frame = _top().frames['main_frame'].gebi('dialog_frame');
		if (div.style.display == 'none' || close) {
			var id = _top().dialogNeed.shift();
			if (id) {
				div.style.display = '';
				if (id > 1) _top().dialogShow[id] = id;
				_top().showNow = id;
			} else {
				div.style.display = 'none';
				_top().showNow = 0;
			}
		}
	} catch(e) {}
}

function showFightInfo(fight_id, server_id) {
	var url = "/fight_info.php?fight_id="+fight_id;
	if (server_id) url += "&server_id="+server_id;
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
	return false;
}

function showTournamentFightInfo(fight_id) {
	var url = "/tournament_fight_info.php?id=" + fight_id;
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
	return false;
}

function showInstInfo() {
	var url = "/instance_stat.php";
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
}
function showInstanceInfo(instance_id, server_id) {
	var url = "/instance_stat.php?instance_id="+instance_id+'&outside=1&finish=1';
	if (server_id) url += "&server_id="+server_id;
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
}
function showClanBattleInfo(clan_battle_id, server_id) {
	var url = "/clan_battle_info.php?clan_battle_id="+clan_battle_id+'&server_id='+server_id;
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
}
function showClanFortInfo(url) {
	window.open(url, "", "width=990,height=700,location=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes,toolbar=yes");
	return false;
}
function showBotInfo(bot_id, artikul_id, fight_id, server_id) {
	var url = "/bot_info.php";
	if (bot_id) {
		if (fight_id) {
			url += "?fight_user_id="+bot_id+"&fight_id="+fight_id;
			if (typeof server_id != 'undefined' && server_id) {
				url += "&server_id=" + server_id;
			}
		} else {
			url += "?bot_id="+bot_id;
		}
	}	
	else if (artikul_id) url += "?artikul_id="+artikul_id;
	window.open(url, "", "width=915,height=700,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}
function showShadowInfo(nick, fight_user_id, bot_id, fight_id, server_id) {
    var url = "/companion_info.php";
    if (typeof nick != 'undefined' && nick) {
        url += "?nick=" + nick;
    } else if (typeof fight_user_id != 'undefined' && fight_user_id) {
        url += "?fight_user_id=" + fight_user_id;
		if ((typeof fight_id != 'undefined' && fight_id) && (typeof server_id != 'undefined' && server_id)) {
			url += "&fight_id=" + fight_id + "&server_id=" + server_id;
		}
    } else if (typeof bot_id != 'undefined' && bot_id) {
        url += "?bot_id=" + bot_id;
    }
    window.open(url, "", "width=915,height=700,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showPunishmentInfo(nick) {
	var url = "/punishment_info.php?nick="+nick;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showInjuryInfo(nick) {
	var url = "/injury_info.php?nick="+nick;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showEffectInfo(nick) {
	var url = "/effect_info.php?nick="+nick;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showClanInfo(clan_id) {
	var url = "/clan_info.php?clan_id="+clan_id;
	window.open(url, "", "width=730,height=650,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showFriendsInfo(buy_form) {
	var url = '/friend_list.php';
	if (buy_form) url += '?submode=buy_limits';
	window.open(url, '', "left=" + (73 + window.screenLeft) + ",top=" + (204 + window.screenTop) + ",width=930,height=500,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showAchievementInfo(achievement_id) {
	var url = "/achievement_info.php?id="+achievement_id;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function showNpcInfo(npc_id) {
	var url = "/npc_info.php?npc_id="+npc_id;
	window.open(url, "", "width=640,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

//do not edit this function without coordinating with client-developers
function userPrvTag() {
	var chatFrame = getChatFrame();
	var i = 0;
	try {
		for (i=0; i<arguments.length; i++) chatFrame.chatPrvTag(arguments[i]);
	}
	catch (e) {}
}

//do not edit this function without coordinating with client-developers
function userToTag() {
	var chatFrame = getChatFrame();
	var i = 0;
	try {
		for (i=0; i<arguments.length; i++) chatFrame.chatToTag(arguments[i]);
	}
	catch (e) {}
}


function userIgnore(name,status) {
	var chatFrame = getChatFrame();
	try {
		chatFrame.chatSyncIgnore(name,status);
	}
	catch (e) {}
}

function userAttack(nick, url_error, user_id, fight_id) {
	if (_top().attack_locked) return false;
	_top().attack_locked = true;
	var rnd = Math.floor(Math.random()*1000000000);
	var url_success = encodeURIComponent('fight.php?'+rnd);
	var urlATTACK = 'action_run.php?code=ATTACK&url_success='+url_success+'&url_error='+encodeURIComponent(url_error || 'area.php');
	if (nick) {
		urlATTACK += '&in[nick]=' + (nick ? encodeURIComponent(nick) : '');
	} else if (user_id) {
		urlATTACK += '&in[user_id]=' + user_id;
	}
	if (fight_id) {
		urlATTACK += '&in[fight_id]=' + fight_id;
	}
	tUnsetFrame('backpack');
	tProcessMenu('b07', {force: true, url: urlATTACK});
}

function confirm_front(area_id) {
    entry_point_request('front', 'fight_join', {area_id: area_id}, function(response) { if (response['status'] != 100) showError(response['error']); })
}

function front_conf(front_id) {
	var params = {};
	if (front_id) params = {'front_id': front_id};
	entry_point_request('front', 'conf', params, function(response) {
		if (response['status'] == DATA_OK) swfObject('area', response);
	});
}

function front_fight_start() {
	entry_point_request('front', 'fight_start', {}, function(response){
		if (response['status'] != DATA_OK && response['error']) {
			showError(response['error']);
		} else {
			swfObject('area', response);
		}
	});
}

function front_locations() {
	entry_point_request('front', 'locations', {}, function(response){
		if (response['status'] == DATA_OK) {
			swfObject('area', response);
			swfObject('world', response);
		}
	});
}

function show_slaughter_stat(instance_id, finish, baseurl) {
	if (baseurl+'' == 'undefined') baseurl = '';
	var url = baseurl + 'instance_stat.php?outside=1&instance_id=' + instance_id + '&finish=' + finish;
	window.open(url, "", "width=730,height=550,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
}

function getChatFrame() {
	var win = window;
	try {win = dialogArguments || window} catch(e) {};
	while (win.opener) {
		if (win === win.opener) break;
		win = win.opener;
	}
	if (win.closed) return;
	
	return win._top().frames['chat'];
}

function fightHelpRequest() {
	var chatFrame = getChatFrame();
	try {
		chatFrame.chatSendMessage('/FIGHTHELP');
	} catch(e) {}
}

//fight_id where `target_nick` need help  
function fightHelp(fight_id, target_nick, confirm_msg, title, target_team_id) {
	var doFightHelp = function(fight_id, target_nick, target_team_id) {
		try {
			var rnd = Math.floor(Math.random()*1000000000);
			var err_url = _top().frames["main_frame"].frames["main"].location;
			var url = 'action_run.php?code=FIGHT_HELP'+
				'&in[fight]=' + encodeURIComponent(fight_id) +
				'&in[target_nick]=' + target_nick +
				'&url_success=' + encodeURIComponent('fight.php?'+rnd) +
				'&url_error=' + encodeURIComponent(err_url) +
				'&' + rnd;

			if (target_team_id) {
				url += '&in[target_team_id]=' + target_team_id;
			}
			_top().frames["main_frame"].frames["main"].location.href = url;
		}
		catch (e) {}
	};

	target_team_id = parseInt(target_team_id, 10) || 0;
	if (confirm_msg != '') {
		_top().systemConfirm(title, confirm_msg, false, function () {
			doFightHelp(fight_id, target_nick, target_team_id);
		})
	} else {
		doFightHelp(fight_id, target_nick, target_team_id);
	}
}

function botAttack(bot_id, url_error, need_confirm, confirmed, tSearch, fight_id) {
	if (!bot_id) {
		return;
	}

	var params = {
		code: 'ATTACK_BOT',
		bot_id: bot_id,
		ajaxParam: {
			async: false,
			type: 'GET'
		},
		url_error: escape(url_error||'area.php'),
		"in":{
			need_confirm: (need_confirm ? 1 : 0),
			confirmed: (confirmed ? 1 : 0),
			tSearch: (tSearch ? 1 : 0)
		}
	};

	if (fight_id) {
		params['in'].fight_id = fight_id;
	}

	entry_point_request('common', 'action', params, function (action_data, raw_data) {
		if (action_data['param_confirm']) {
			_top().systemConfirm(
					action_data['param_confirm']['confirm_title'],
					action_data['param_confirm']['confirm_text'],
					false,
					function () {
						huntAttack(action_data['param_confirm']['bot_id'], true);
					}
			);
		} else if (action_data['redirect_url']) {
			var url = decodeURIComponent(action_data['redirect_url']) || '/area.php';
			if (action_data['redirect_error']) {
				url += url.indexOf("?") >= 0 ? "&error=" + action_data['redirect_error'] : "?error=" + action_data['redirect_error'];
			}
			_top().frames["main_frame"].frames["main"].location.href = url;
		} else  {
			if (raw_data['state'] && raw_data['state']['fight_id'] > 0) {
				fightRedirect(raw_data['state']['fight_id']);
				_top().__lastFightId = parseInt(raw_data['state']['fight_id'], 10);
			}
		}
	});
}

function huntAttack(bot_id, confirmed) {
	var need_confirm = _top().frames["main_frame"].frames["main"].need_hunt_confirm;
	botAttack(bot_id, 'hunt.php', need_confirm, confirmed);
}

function _background(obj, name) {
	if (obj.tagName == 'IMAGE') {
		obj.src = name;
	} else {
		obj.style.backgroundImage = 'url('+name+')'
	}
}

function artifactAlt(obj, evnt, show) {
	// Сортировка в рюкзаке
	if (typeof(iam_sorting_now) !== 'undefined' && iam_sorting_now) {
		show = 0;
	}
	
	var art_id = obj.getAttribute('div_id');
	if (!art_id) art_id = 'AA_' + obj.getAttribute('artifact_id');
	var artifact_alt = _top().gebi('artifact_alt');
	if (!artifact_alt) return;

	var tpl = obj.getAttribute('tpl');
	tpl = tpl ? tpl : 'renderArtifactAlt';

	var collection = obj.getAttribute('collection') || false;
	var act1 = obj.getAttribute('act1');
	var act2 = obj.getAttribute('act2');
	var act3 = obj.getAttribute('act3');
	var act4 = obj.getAttribute('act4') || 0;
	if (act2 === null) act2 = 0;
	if (act3 == 0 || act3 === null) act3 = '' // костыль что бы не переименовывать картинки в локализациях
	if (act4 == 0) act4 = '';
	if (act1 == null) act1 = 0;
	if (show == 2) {
		document.onmousemove=function(e) {artifactAlt(obj, e||event, 1);}
		
		if (!artifact_alt.getAttribute('art_id') || obj.getAttribute('div_id') != artifact_alt.getAttribute('art_id')) {
			if (typeof(art_alt) == "undefined") {
				console_log('art_alt is undefined', 'artifactAlt_1');//js_error_log
			} else if (!art_alt[art_id]) {
				console_log('art_alt[art_id] is empty', 'artifactAlt_2');//js_error_log
			} else if (art_alt[art_id] && art_alt[art_id] != undefined) {
				artifact_alt.innerHTML = window[tpl](art_id);
			}
			artifact_alt.setAttribute('art_id',obj.getAttribute('div_id'));
		}
		
		artifact_alt.style.display = 'block';
		if (_top().locale_path && (act1 || act2 || act3 || act4 || !collection)) {
			_background(obj, (_top().locale_path + "images/itemact-"+ act1) + act2 + (act3 + (act4 + ".gif")));
		}
		
		_top().obj = obj;
		if (_top().show_alt) {
			_top().show_alt();
		}
	}
	if (!show) {
		if (act1 || act2 || act3 || act4) {
			_background(obj, 'images/d.gif');
		}
		artifact_alt.style.display = 'none';
		document.onmousemove=function(){}
		return;
	}

	var coor = getIframeShift();
	var ex = evnt.clientX+coor.left;
	var ey = evnt.clientY+coor.top;

	if (_top().noIframeAlt) {
		ex = evnt.clientX + _top().document.body.scrollLeft;
		ey = evnt.clientY + _top().document.body.scrollTop;
	}
	if (_top().recruit) {
		ey = evnt.clientY + _top().document.body.scrollTop;
	}

	if (act1 || act2 || act3 || act4 || collection) {
		obj.style.cursor = 'pointer'
		obj.onclick = (act1 != 0 ? function(e){try{artifactAct(obj, act1, e||event)}catch(e){}} : function(e){showArtifactInfo(obj.getAttribute('aid'), obj.getAttribute('art_id'), null, e||event, obj.getAttribute('gift_id'))});
                if (!collection)
                    _background(obj, (_top().locale_path + "images/itemact-"+ act1) + act2 + (act3 + (act4 + ".gif")));
		var coord = getCoords(obj)
		var cont = gebi("item_list")
		var scroll_x = window.scrollX || window.document.body.scrollLeft;
		var scroll_y = window.scrollY || window.document.body.scrollTop;
		var rel_x = (ex + scroll_x - coord.l - coor.left);
		var rel_y = (ey + scroll_y - coord.t - coor.top);
		if (rel_x >= 40) {
			if (rel_y < 20) {
				if (obj.getAttribute('gift_id')) { // для подарков
					obj.onclick = function(e){showArtifactInfo(false, false, null, e||event, obj.getAttribute('gift_id'))};
				} else if (obj.getAttribute('store')) { // в магазине при клике на info необходимо выводить товар по артикулу
					obj.onclick = function(e){showArtifactInfo(false, obj.getAttribute('art_id'), null, e||event)};
				} else { 
					obj.onclick = function(e){showArtifactInfo(obj.getAttribute('aid'), null, null, e||event)}
				}
                                if (!collection)
                                    _background(obj, _top().locale_path + 'images/itemact_info' + act2 + (act3 + (act4 + '.gif')));
				try{obj.style.cursor = 'hand'} catch(e){}
				try{obj.style.cursor = 'pointer'} catch(e){}
			}
			if (act2 != 0 && rel_y >= 40) {
				obj.onclick = function(e){try{artifactAct(obj, act2, e||event)}catch(e){}}
                                if (!collection)
                                    _background(obj, _top().locale_path + 'images/itemact_drop' + act2 + (act3 + (act4 + '.gif')));
				try{obj.style.cursor = 'hand'} catch(e){}
				try{obj.style.cursor = 'pointer'} catch(e){}
			}
		}
		if (act3 > 0 && rel_x < 20) {
			if (rel_y < 20) {
				obj.onclick = function(e){try{artifactAct(obj, act3, e||event)}catch(e){}};
                                if (!collection)
                                    _background(obj, _top().locale_path + 'images/itemact_use' + act2 + (act3 + (act4 + '.gif')));
				try {obj.style.cursor = 'hand'} catch(e){}
				try {obj.style.cursor = 'pointer'} catch(e){}
			}
		}
		if (act4 > 0 && rel_x > 20 && rel_x <= 40) {
			if (rel_y > 40) {
				obj.onclick = function(e){try{artifactAct(obj, act4, e||event)}catch(e){}};
                                if (!collection)
                                    _background(obj, _top().locale_path + 'images/itemact_sup' + act2 + (act3 + (act4 + '.gif')));
				try {obj.style.cursor = 'hand'} catch(e){}
				try {obj.style.cursor = 'pointer'} catch(e){}
			}
		}
	}

	var top = _top(),
		iframeShift = getIframeShift(),
		bodyRect = top.document.body.getBoundingClientRect(),

		quirksIE = (top.document.documentMode && top.document.documentMode === 5) ? true : false;

	var x, y, sx, sy, prnt;

	if (evnt) {
		evnt = fixEvent(evnt);
	}

	prnt = evnt.target;
	sx = 0;
	sy = 0;

	if (navigator.userAgent.toLowerCase().indexOf('firefox') === -1) {
		while (prnt.nodeName !== 'BODY') {
			prnt = prnt.parentNode;

			if (prnt.nodeName === 'DIV' && prnt.getAttribute('id') === 'overflowFix') {
				sx = prnt.scrollLeft;
				sy = prnt.scrollTop;

				break;
			}
		}
	}

	if (quirksIE) {
		x = evnt.screenX - top.screenLeft;
		y = evnt.screenY - top.screenTop;

		if (x + artifact_alt.offsetWidth > bodyRect.right) {
			x -= artifact_alt.offsetWidth + 20;
		}

		if (x < 0 ) {
			x = (evnt.screenX - top.screenLeft) - artifact_alt.offsetWidth / 2;
		}

		if (y + artifact_alt.offsetHeight > bodyRect.bottom) {
			y -= artifact_alt.offsetHeight + 20;
		}

		if (y < 0) {
			y = evnt.screenY - top.screenTop + 10;
		}

		artifact_alt.style.position = 'absolute';
		artifact_alt.style.left = x + sx + top.document.body.scrollLeft + 10 + 'px';
		artifact_alt.style.top = y + sy + top.document.body.scrollTop + 10 + 'px';
	} else {
		x = evnt.clientX + iframeShift.left;
		y = evnt.clientY + iframeShift.top;

		if (x + artifact_alt.offsetWidth > bodyRect.right) {
			x -= artifact_alt.offsetWidth + 20;
		}

		if (x < 0 ) {
			x = (evnt.clientX + iframeShift.left) - artifact_alt.offsetWidth / 2;
		}

		if (y + artifact_alt.offsetHeight > bodyRect.bottom) {
			y -= artifact_alt.offsetHeight + 20;
		}

		if (y < 0) {
			y = evnt.clientY + iframeShift.top + 10;
		}

		artifact_alt.style.position = 'fixed';
		artifact_alt.style.left = x + sx + 10 + 'px';
		artifact_alt.style.top = y + sy + 10 + 'px';
	}

	return false;
}

function userAlt(obj, evnt, show) {
	var soc_id = obj.getAttribute('soc_id');
	var soc_user_id = obj.getAttribute('soc_user_id');
	var user_alt = _top().gebi('artifact_alt');
	if (!user_alt) return;

	if (show == 1) {
		document.onmousemove=function(e) {userAlt(obj, e||event, 1);}

		if (!user_alt.getAttribute('soc_id') || !user_alt.getAttribute('soc_user_id') || obj.getAttribute('soc_id') != user_alt.getAttribute('soc_id') || obj.getAttribute('soc_user_id') != user_alt.getAttribute('soc_user_id') ) {
			if (soc_user_alts[soc_id] && soc_user_alts[soc_id] != undefined || soc_user_alts[soc_user_id] && soc_user_alts[soc_user_id] != undefined) {
				user_alt.innerHTML = renderUserAlt(soc_id, soc_user_id);
			}
			user_alt.setAttribute('soc_id',obj.getAttribute('soc_id'));
			user_alt.setAttribute('soc_user_id',obj.getAttribute('soc_user_id'));
		}

		user_alt.style.display = 'block';

		_top().obj = obj;
		if (_top().show_alt) {
			_top().show_alt();
		}
	}
	if (!show) {
		user_alt.style.display = 'none';
		document.onmousemove=function(){}
		return;
	}

	var coor = getIframeShift();
	var ex = evnt.clientX+coor.left;
	var ey = evnt.clientY+coor.top;

	if (_top().noIframeAlt) {
		ex = evnt.clientX + _top().document.body.scrollLeft;
		ey = evnt.clientY + _top().document.body.scrollTop;
	}

	var x = ex + user_alt.offsetWidth > _top().document.body.clientWidth - 20 ? ex - user_alt.offsetWidth - 10 : ex + 10;
	var y = ey + user_alt.offsetHeight - _top().document.body.scrollTop > _top().document.body.clientHeight - 20 ? ey - user_alt.offsetHeight - 10 : ey + 10;

	if (x < 0 ) {
		x = ex - user_alt.offsetWidth/2;
	}
	if (x < 7 ) {
		x = 7;
	}
	if (x > _top().document.body.clientWidth - user_alt.offsetWidth - 20) {
		x= _top().document.body.clientWidth - user_alt.offsetWidth - 20;
	}

	user_alt.style.left = x;
	user_alt.style.top = y;

	return;
}

function renderUserAlt(soc_id, soc_user_id) {
	var a = soc_user_alts[soc_id][soc_user_id];
	var content = '';
	
	content += '<table width="200" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;">';
	content += '<tr><td width="14" class="aa-tl"><img src="images/d.gif" width="14" height="24"><br></td>';
	content += '<td class="aa-t" align="center" style="vertical-align:middle"><b>' + a.name + '</b></td>';
	content += '<td width="14" class="aa-tr"><img src="images/d.gif" width="14" height="24"><br></td></tr>';
	content += '<tr><td class="aa-l" style="padding:0;"></td><td style="padding:0;">';
	content += '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center">';
	content += '<img src="' + a.avatar + '" alt="">';
	content += '</td></tr></table>';
	content += '</td><td class="aa-r" style="padding:0px"></td></tr>';
	content += '<tr><td class="aa-bl"></td><td class="aa-b"><img src="images/d.gif" width="1" height="5"></td><td class="aa-br"></td></tr>';
	content += '</table>';
	
	return content;
}

function loadArtifactArtikulsData(artikul_ids, complete_func) {
	if (typeof(artikul_ids) != "object") {
		return;
	}

	var unloaded_artikul_ids = [],
		alt;
	for (var i = artikul_ids.length - 1; i >= 0; i--) {
		alt = get_art_alt('AA_' + artikul_ids[i]);
		if (!alt) {
			unloaded_artikul_ids.push(artikul_ids[i]);
		}
	}
	entry_point_request('info', 'alt_artikuls', {artikuls: unloaded_artikul_ids}, function(data) {
			if (data.status != 100 || !data['artikuls']) {
				if (complete_func != undefined) complete_func.call();
				return;
			}

			for (var i = data['artikuls'].length - 1; i >= 0; i--) {
				set_art_alt('AA_' + data['artikuls'][i]['id'], data['artikuls'][i]);
			}
			if (complete_func != undefined) complete_func.call();
		}
	);
}

function renderArtifactAlt(id) {
	var a = get_art_alt(id);

	if (!a) {
		console_log('art_alt[id] is empty', 'renderArtifactAlt', id, window);//js_error_log
		return '';
	}

	var bg = true;
	var i = 0;
	var content = '';

	content += '<table width="300" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;">';
	content += '<tr><td width="14" class="aa-tl aa-tl-n"><img src="/images/d.gif" width="14" height="4"></td>';
	content += '<td class="aa-t aa-t-n" align="center"><img src="/images/d.gif" width="1" height="4"></td>';
	content += '<td width="14" class="aa-tr aa-tr-n"><img src="/images/d.gif" width="14" height="4"></td></tr>';
	content += '<tr><td width="14" class="aa-tl aa-tl-n" style="background-position: 0 50%"><img src="/images/d.gif" width="14" height="16"></td>';
	content += '<td class="aa-t aa-t-n" align="center" style="vertical-align:middle; background-position: 0 50%"><b style="color:' + a.color + '">' + a.title + '</b></td>';
	content += '<td width="14" class="aa-tr aa-tr-n" style="background-position: 0 50%"><img src="/images/d.gif" width="14" height="16"></td></tr>';
	content += '<tr><td width="14" class="aa-tl-h-l"><img src="/images/d.gif" width="14" height="4"></td>';
	content += '<td class="aa-t-h-c" align="center"><img src="/images/d.gif" width="1" height="4"></td>';
	content += '<td width="14" class="aa-tr-h-r"><img src="/images/d.gif" width="14" height="4"></td></tr>';
	content += '<tr><td class="aa-l" style="padding:0;"></td><td style="padding:0;">';
	content += '<table width="275" style=" margin: 3px" border="0" cellspacing="0" cellpadding="0"><tr>';
	content += '<td align="center" valign="top" width="60">';
	content += '<table width="60" height="60" cellpadding="0" cellspacing="0" border="0" style="margin: 2px" background="' + a.image + '"><tr><td valign="bottom">';
	
	if (a.enchant_icon && a.enchant_icon != undefined) {
		content += a.enchant_icon.replace(/&quot;/g, '"');
	} else {
		if (a.kind_id != 65) {
			if (a.cnt != undefined && a.cnt > 1) {
				content += '<div class="bpdig">' + a.cnt + '</div>';
			}
		} else if (a.kind_id == 65) { // BOT ability
			if (a.cnt != undefined && (a.cnt > 1 && a.cnt <= 20)) {
				content += '<div class="bpdig">' + a.cnt + '</div>';
			}
		}
	}

	content += '</td></tr></table>';
	content += '</td><td>';
	content += '<div><img src="images/tbl-shp_item-icon.gif" width="11" height="10" align="absmiddle">&nbsp;' + a.kind + '</div>';
	if (a.dur != undefined) {
            if(a.flags2 && a.flags2.crashproof && a.flags2.crashproof != undefined) {
               content += '<div><img src="images/tbl-shp_item-iznos.gif" width="11" height="10" align="absmiddle"> <span class="red">'+a.flags2.crashproof+'</span></div>';
            }
            else
		content += '<div><img src="images/tbl-shp_item-iznos.gif" width="11" height="10" align="absmiddle"> <span class="red">' + a.dur + '</span>/' + a.dur_max + '</div>';
	}
	if (a.price && a.price != undefined) {
		content += '<div class="b red">' + a.price.replace(/&quot;/g, '"') + '</div>';
	}
	if (a.com && a.com != undefined) {
		content += '<div class="b red">' + a.com.title + ' ' + a.com.value + '</div>';
	}
	if (a.owner && a.owner != undefined) {
		content += '<div><b class="b red">' + a.owner.title + '</b>' + a.owner.value + '</div>';
	}
	content += '</td><td>';
	if (a.lev && a.lev != undefined) {
		content += '<div><img src="images/tbl-shp_level-icon.gif" width="11" height="10" align="absmiddle"> ' + a.lev.title + ' <b class="red">' + a.lev.value + '</b></div>';
	}
	if (a.trend && a.trend != undefined) {
		content += '<div><img src="images/tbl-shp_item-trend.gif" width="11" height="10" align="absmiddle">&nbsp;' + a.trend.replace(/&quot;/g, '"') + '</div>';
	}
	if (a.cls && a.cls != undefined) {
		content += '<div><img src="images/class.gif" width="11" height="10" align="absmiddle"> ';
		for (i = 0; i < a.cls.length; i++) {
			content += a.cls[i].replace(/&quot;/g, '"');
		}
		content += '</div>'
	}
	content += '</td></tr></table>';
	content += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
	if (a.exp && a.exp != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.exp.title + '</td><td class="grnn b" align="right">' + a.exp.value + '</td></tr>';
		bg = !bg;
	}
	if (a.gcd && a.gcd != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.gcd.title + '</td><td class="grnn b" align="right">' + a.gcd.value + '</td></tr>';
		bg = !bg;
	}
	if (a.skills && a.skills != undefined && a.skills.length) {
		for (i = 0; i < a.skills.length; i++) {
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.skills[i].title + '</td><td class="red" align="right">' + a.skills[i].value + '</td></tr>';
			bg = !bg;
		}
	}
	if (a.skills_e && a.skills_e != undefined && a.skills_e.length) {
		for (i = 0; i < a.skills_e.length; i++) {
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.skills_e[i].title + '</td><td class="red" align="right">' + a.skills_e[i].value.replace(/&quot;/g, '"') + '</td></tr>';
			bg = !bg;
		}
	}
	if (a.enchant && a.enchant != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant.title + '</td><td class="red" align="right">' + a.enchant.value.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
    if (a.enchant_exp && a.enchant_exp != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant_exp.title + '</td><td class="red" align="right">' + a.enchant_exp.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
	if (a.symbols && typeof(a.symbols) == "object") {
		var symbol, isDisplaySymbolLabel = false;
		
		for (i in a.symbols) {
			if (!a.symbols.hasOwnProperty(i)) {
				continue;
			}
			
			symbol = a.symbols[i];
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + (isDisplaySymbolLabel ? '&nbsp;' : symbol.title) + '</td><td class="red" align="right">' + symbol.value.replace(/&quot;/g, '"') + '</td></tr>';
			bg = !bg;
			isDisplaySymbolLabel = true;
		}
	}

	if (a.enchant_mod && a.enchant_mod != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant_mod.title + '</td><td class="red" align="right">' + a.enchant_mod.value.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
	if (a.enchant3 && a.enchant3 != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant3.title + '</td><td class="red" align="right">' + a.enchant3.value + '</td></tr>';
		bg = !bg;
	}
	if (a.enchant4 && a.enchant4 != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant4.title + '</td><td class="red" align="right">' + a.enchant4.value.replace(/&quot;/g, '"')  + '</td></tr>';
		bg = !bg;
	}
	if (a.superstructure && a.superstructure != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.superstructure.title + '</td><td class="red" align="right">' + a.superstructure.value.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
	if (a.set && a.set != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.set.title + '</td><td class="red" align="right">' + a.set.value.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
	if (a.change && a.change != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="dredd b">' + a.change + '</td></tr>';
		bg = !bg;
	}
	
	if (a.nogive && a.nogive != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="redd b">' + a.nogive + '</td></tr>';
		bg = !bg;
	}
	if (a.clan_thing && a.clan_thing != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="violet b">' + a.clan_thing + '</td></tr>';
		bg = !bg;
	}
	if (a.boe && a.boe != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="redd b">' + a.boe + '</td></tr>';
		bg = !bg;
	}
	if (a.noweight && a.noweight != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="grnn b">' + a.noweight + '</td></tr>';
		bg = !bg;
	}
	if (a.can_anonim && a.can_anonim != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="grnn b">' + a.can_anonim + '</td></tr>';
		bg = !bg;
	}
	if (!a.sell || a.sell == undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="dark b">' + a.nosell + '</td></tr>';
		bg = !bg;
	}

	if (a.flags2) {
		if (a.flags2.cant_put_in_storage && a.flags2.cant_put_in_storage != undefined) {
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2"><b style="color: #0969a2;">' + a.flags2.cant_put_in_storage + '</b></td></tr>';
			bg = !bg;
		}
		if (a.flags2.no_give_after_give && a.flags2.no_give_after_give != undefined) {
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="redd b">' + a.flags2.no_give_after_give + '</td></tr>';
			bg = !bg;
		}
		if (a.flags2.can_crashproof && a.flags2.can_crashproof != undefined) {
			content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="b" style="color: #008080">' + a.flags2.can_crashproof + '</td></tr>';
			bg = !bg;
		}
	}

	if (a.note && a.note != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.note + '</td></tr>';
		bg = !bg;
	}
    if (a.perp && a.perp != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2"><span class="grnn b">' + a.perp.title + ':</span> ' + a.perp.value + '</td></tr>';
        bg = !bg;
    }
	if (a.engrave && a.engrave != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.engrave + '</td></tr>';
		bg = !bg;
	}
	if (a.rank_min && a.rank_min != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.rank_min.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
	if (a.desc && a.desc != undefined) {
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.desc.replace(/&quot;/g, '"') + '</td></tr>';
		bg = !bg;
	}
	content += '</table>';
	content += '</td><td class="aa-r" style="padding: 0"></td></tr>';
	content += '<tr><td class="aa-bl"></td><td class="aa-b"><img src="images/d.gif" width="1" height="5"></td><td class="aa-br"></td></tr>';
	content += '</table>';

	return content;
}

function renderAchievementAlt(id) {
	var a = art_alt[id];
	var bg = true;
	var i = 0;
	var content = '';

	content += '<table width="300" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;" class="aa-table">';
	content += '<tr><td width="14" class="aa-tl"><img src="/images/d.gif" width="14" height="24"><br></td>';
	content += '<td class="aa-t" align="center" style="vertical-align:middle"><b>' + a.title + '</b></td>';
	content += '<td width="14" class="aa-tr"><img src="/images/d.gif" width="14" height="24"><br></td></tr>';
	content += '<tr><td class="aa-l" style="padding:0;"></td><td style="padding:0;">';
	content += '<table width="275" style=" margin: 3px" border="0" cellspacing="0" cellpadding="0"><tr>';
	content += '<td align="center" valign="top" width="60">';
	content += '<table width="60" height="60" cellpadding="0" cellspacing="0" border="0" style="margin: 2px" background="' + a.picture + '"><tr><td valign="bottom">';
	content += '&nbsp;';
	content += '</td></tr></table>';
	content += '</td><td>';
	content += '<div>' + a.weight.title + ' <img src="/images/achievement_icon.gif" width="11" height="10" align="absmiddle"> <b class="red">' + a.weight.value + '</b></div>';
	
	if (a.group && a.group != undefined) {
		content += '<div>' + a.group.title + ' <b class="red">' + a.group.value + '</b></div>';
	}

	content += '</td></tr></table>';
	if (a.description && a.description != undefined) {
		content += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
		content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.description + '</td></tr>';
		bg = !bg;
		content += '</table>';
	}
	content += '</td><td class="aa-r" style="padding:0px"></td></tr>';
	content += '<tr><td class="aa-bl"></td><td class="aa-b"><img src="/images/d.gif" width="1" height="5"></td><td class="aa-br"></td></tr>';
	content += '</table>';

	return content;
}

function renderAchievementAltCompare(id) {
	var a = art_alt[id];
	var bg = true;
	var i = 0;
	var content = '';

	content += '<table width="300" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;" class="aa-table">';
	content += '<tr><td width="14" class="aa-tl"><img src="/images/d.gif" width="14" height="24"><br></td>';
	content += '<td class="aa-t" align="center" style="vertical-align:middle"><b style="color:#6c382c; font-size: 13px">' + a.title + '</b></td>';
	content += '<td width="14" class="aa-tr"><img src="/images/d.gif" width="14" height="24"><br></td></tr>';
	content += '<tr><td class="aa-l" style="padding:0;"></td><td style="padding:0;">';
	content += '<table width="275" style=" margin: 3px" border="0" cellspacing="0" cellpadding="0">';
	content += '<tr><td align="center" valign="top"><div style="width: 60px; height: 60px; margin: 0 auto; background:url(' + a.picture + ');"></div></td></tr>';
	content += '<tr><td align="left" valign="top"><b class="redd">' + a.labels[0] + ': </b>' + a.group.value + '</td></tr>';
	content += '<tr><td align="left" valign="top"><b class="redd">' + a.labels[1] + ': </b>' + a.description + '</td></tr></table>';
	content += '</td><td class="aa-r" style="padding:0px"></td></tr>';
	content += '<tr><td class="aa-bl"></td><td class="aa-b"><img src="/images/d.gif" width="1" height="5"></td><td class="aa-br"></td></tr>';
	content += '</table>';

	return content;
}

function renderBotAlt(id) {
	var a = art_alt[id];
	var bg = true;
	var i = 0;
	
	var content = [
		'<table width="200" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;" class="aa-table">',
			'<tr>',
				'<td width="14" class="aa-tl"><img src="/images/d.gif" width="14" height="24"><br></td>',
				'<td class="aa-t" align="center" style="vertical-align: middle;"><b>' + a.title + '</b></td>',
				'<td width="14" class="aa-tr"><img src="/images/d.gif" width="14" height="24"><br></td>',
			'</tr>',
			'<tr>',
				'<td class="aa-l" style="padding: 0;"></td>',
				'<td style="padding: 0;">',
					'<table width="175" style="margin: 3px" border="0" cellspacing="0" cellpadding="0">',
						'<tr>',
							'<td align="center">',
								'<img src="' + a.picture + '" alt="" width="170" />',
							'</td>',
						'</tr>',
						'<tr>',
							'<td style="padding: 5px;">' + a.description + '</td>',
						'</tr>',
					'</table>',
				'</td>',
				'<td class="aa-r" style="padding: 0;"></td>',
			'</tr>',
			'<tr>',
				'<td class="aa-bl"></td>',
				'<td class="aa-b"><img src="/images/d.gif" width="1" height="5"></td>',
				'<td class="aa-br"></td>',
			'</tr>',
		'</table>'
	].join('');

	return content;
}

function updateBag() {
	var win = window
	try {win = dialogArguments ?  dialogArguments.win || dialogArguments : window} catch(e) {}
	while (win.opener) win = win.opener;
	if (win.closed) return false;
	
	try{
		var win_main = win._top().frames['main_frame'].frames['main']
		if(win_main.is_userphp) {
				win_main.location.href = win_main.urlMODE + '&update_swf=1'
			return true;	
		}
	}
	catch (e) {}
	return false;
}

function fightRedirect(fight_id, cd) {
	if (!cd || isNaN(cd)) cd = false;
	else {
		setTimeout(function(){
			fightRedirect(fight_id);
		}, cd);
		return;
	}

	if (_top().__lastFightId && _top().__lastFightId == fight_id) {
		return;
	}
	var rnd = Math.floor(Math.random()*1000000000);
	var url = 'fight.php?'+rnd;
	tProcessMenu('b06', {url: url, lock: true, force: true});
}

function fightFinished() {
	try {
		tUnlockFrame();
		tUnsetFrame('main');
	} catch (e) {}
	if (navigator.userAgent.indexOf('Client/') != -1) alert('ClientAlert:FightFinished');
}

function updatePartyLoot() {
	try {
		_top().frames['main_frame'].frames['main_hidden'].location.href = 'main_iframe.php?mode=update_party';
	} catch (e) {};
}

function fightUpdateLog(ctime, nick1, level1, nick2, level2, code, i1, i2, i3, s1) {
	try {
		_top().frames['main_frame'].frames['main'].fightUpdateLog(ctime, nick1, level1, nick2, level2, code, i1, i2, i3, s1);
	} catch (e) {};
}

function resurrect(modeId) {
	var addurl = '';
	if (modeId) {
		addurl = '&in[mode_id]=' + modeId;
	}
	tProcessMenu('b06', {url: 'action_run.php?code=RESURRECT&url_success=area.php&url_error=area.php'+addurl});
}

// =======================================================================================

function js_money_input_assemble(id_prefix) {
	var m1 = gebi(id_prefix+'1').value;
	var m2 = gebi(id_prefix+'2').value;
	var m3 = gebi(id_prefix+'3').value;

	if (m1.match(/[^0-9.]/)) m1 = m1.replace(/[^0-9].*$/, '');
	if (m2.match(/[^0-9.]/)) m2 = m2.replace(/[^0-9].*$/, '');
	if (m3.match(/[^0-9.]/)) m3 = m3.replace(/[^0-9].*$/, '');
	v = m1/100.0 + m2*1.0 + m3*100.0;
	res = (isNaN(v) || v <= 0) ? 0 : (1.0 * (1.0*v).toFixed(2)).toFixed(2);
	return res*1.0;
}

function js_money_input_fill(id_prefix, amount) {
	var m1 = gebi(id_prefix+'1');
	var m2 = gebi(id_prefix+'2');
	var m3 = gebi(id_prefix+'3');

    var str = ' ';
	var t=[];
	amount = amount * 100;
	for (i = 0; i < 2; i++) {
		t[i] = (amount % 100);
		amount = (amount - t[i]) / 100;
	}
	t[2] = amount;
	m1.value = t[0].toFixed(0);
	m2.value = t[1].toFixed(0);
	m3.value = t[2].toFixed(0);
}

// ========= swf data transfer functions ===============================================================

function getSWF(name) {
	var win = window;
	var mainFrame = win._top().frames.main_frame;
	try {win = dialogArguments || window} catch(e) {}
	//while (win.opener) win = win.opener;
	if (win.closed) return;

	win = window;
	switch (name) {
		case 'top_mnu':      
		case 'lvl':          
		case 'items':        
		case 'dialog':       
		case 'items_right': 
			win = mainFrame; 
			break; 
		case 'game':         
		case 'mem':
		case 'area':
		case 'instance':
		case 'wheel_fortune':
		case 'estate':
			win = mainFrame ? mainFrame.frames.main : null; 
			break;
		case 'inventory': 
		case 'magic':
		case 'cube':
			win = mainFrame ? mainFrame.frames.backpack : null; 
			break; 
		case 'world':
			win = win._top().opened_windows['world_map']; 
			name = 'game';
			break; 
	}
	if (navigator.appName.indexOf("Microsoft") != -1) {
		return win ? win[name] : null;
	} else {
		return win ? win.document[name] : null;
	}
}

function swfTransfer(name,tar,data) {
	try {
		getSWF(tar).swfData(name,data);
		return true;
	} catch (e) {
		var swf = getSWF(tar);
		if (swf && swf.swfData) {
			console_log("swfData ERROR: name=" + name + ", tar=" + tar + ", method=" + data.split('@')[0] + ", error=" + e);
		}
	}
	return false;
}

function swfObject(tar, object) {
	var swf;
	try {
		swf = getSWF(tar);
		swf.swfObject(object);
		return true;
	} catch (e) {
		if (swf && swf.swfObject) {
			console_log("swfObject ERROR: tar=" + tar + ", error=" + e);
		}
	}
	return false;
}

function areaSwfReload() {
	var area_frame = _top().frames.main_frame.frames.main;
	var main = _top().frames.main_frame;
	if (!main) return false;
	if ($('embed[name="area"], object[name="area"], embed[name="instance"], object[name="instance"]', area_frame.document).length) {
		area_frame.location = location.protocol + '//' + location.host + location.pathname;
	}
}

function ShowDiv(obj, evnt, show) {
	var div = gebi(obj.getAttribute('div_id'));
	if (!div) return;
	if (show == 2) {
		document.onmousemove=function(e) {artifactAlt(obj, e||event, 1)} 
		div.style.display = 'block';
	}
	if (!show) {
		div.style.display = 'none';
		document.onmousemove=function(){}
		return;
	}
	
	var ex = evnt.clientX + document.body.scrollLeft;
	var ey = evnt.clientY + document.body.scrollTop;
	
	var x = evnt.clientX + div.offsetWidth > document.body.clientWidth - 7 ? ex - div.offsetWidth - 10 : ex + 10;
	var y = evnt.clientY + div.offsetHeight > document.body.clientHeight - 7 ? ey - div.offsetHeight - 10 : ey + 10;

	if (x < 0 ) {
		x = ex - div.offsetWidth/2
	}
	if (x < 7 ) {
		x = 7
	}
	if (x > document.body.clientWidth - div.offsetWidth - 7) {
		x= document.body.clientWidth - div.offsetWidth - 7
	}

	div.style.left = x;
	div.style.top = y;
}

function refreshEvent (id) {document.location.href = 'user_event.php?mode=events&event_id='+id;}
function enterGreatFights () {document.location.href = 'area_fights.php?mode=great';}

function common_is_email_valid(email,all) {
	if (!email && !all) {
		return true;
	}
	var re = '';
	if (all) {
		re = /^([A-z0-9_\-]+\.)*[A-z0-9_\-]+@([A-z0-9][A-z0-9\-]*[A-z0-9]\.)+[A-z]{2,4}$/i;
	} else {
		re = /^([A-z0-9_\-]+\.)*[A-z0-9_\-]+(@)?([A-z0-9][A-z0-9\-]*[A-z0-9]\.)*(\.)?[A-z]{0,4}$/i;
	}
	if (!re.test(email)) {
		return false;
	}
	return true;
}

function petAlt(obj, evnt, show) {
	var div = gebi(obj.getAttribute('div_id'));
	if (!div) return;
	var act1 = obj.getAttribute('act1');
	var act2 = obj.getAttribute('act2');
	if (show == 2) {
		document.onmousemove=function(e) {petAlt(obj, e||event, 1)} 
		div.style.display = 'block';
		if (act1 || act2) {
			_background(obj, (_top().locale_path + "images/itemact-"+ act1) + (act2 +".gif"));
		}
	}
	if (!show) {
		if (act1 || act2) {
			_background(obj, 'images/d.gif');
		}
		div.style.display = 'none';
		document.onmousemove=function(){}
		return;
	}
	
	var ex = evnt.clientX + document.body.scrollLeft;
	var ey = evnt.clientY + document.body.scrollTop;

	if (act1 || act2) {
		obj.style.cursor = 'default'
		obj.onclick = (act1 != 0 ? function(){try{petAct(obj, act1)}catch(e){}} : function(){showPetInfo(obj.getAttribute('aid'), obj.getAttribute('art_id'))});
		_background(obj, (_top().locale_path + "images/itemact-"+ act1) + (act2 +".gif"));
		var coord = getCoords(obj)
		var cont = gebi("item_list")
		var rel_x = (ex + cont.scrollLeft - coord.l)
		if (rel_x >= 40) {
			var rel_y = (ey + cont.scrollTop - coord.t)
			if (rel_y < 20) {
				obj.onclick = function(){showPetInfo(obj.getAttribute('aid'))}
				_background(obj, _top().locale_path + 'images/itemact_info' + act2 +'.gif');
				try{obj.style.cursor = 'hand'} catch(e){}
				try{obj.style.cursor = 'pointer'} catch(e){}
			}
			if (act2 != 0 && rel_y >= 40) {
				obj.onclick = function(){try{petAct(obj, act2)}catch(e){}}
				_background(obj, _top().locale_path + 'images/itemact_drop' + act2 +'.gif');
				try{obj.style.cursor = 'hand'} catch(e){}
				try{obj.style.cursor = 'pointer'} catch(e){}
			}
		}
	}
	var x = evnt.clientX + div.offsetWidth > document.body.clientWidth - 7 ? ex - div.offsetWidth - 10 : ex + 10;
	var y = evnt.clientY + div.offsetHeight > document.body.clientHeight - 7 ? ey - div.offsetHeight - 10 : ey + 10;

	if (x < 0 ) {
		x = ex - div.offsetWidth/2
	}
	if (x < 7 ) {
		x = 7
	}
	if (x > document.body.clientWidth - div.offsetWidth - 7) {
		x= document.body.clientWidth - div.offsetWidth - 7
	}

	div.style.left = x;
	div.style.top = y;
}

function updateMount(mount_id) {
	_top().frames['main_frame'].mountID = mount_id;
}

function getKeyCode(e) {
	return (window.event) ? event.keyCode : e.keyCode;
}

function toggle_visibility(id) {
	var obj = gebi(id);
	if (obj) {
    	obj.style.display = obj.style.display=='' ? 'none' : '';
      	return obj.style.display=='none';
    }
	return false;
}

function explode(str, delimeter) {
	return str ? str.split(delimeter ? delimeter : '') : [];
}

function implode(array, delimeter) {
	var str = '';
	if(array) {
		var array_length = array.length ? array.length-1 : 0;
		for(var id in array)
			str = str + array[id] + (array_length-- ? delimeter : '');
	}
	return str;
}

// Применительно к объектам Array
// IE сцуко не поддерживает Array::indexOf
function indexOf(arr, value) {
	for(var id in arr)
		if(arr[id] == value) 
			return id;
	return -1;
}

function getXmlHttp(){
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (ee) {
		}
	}
	if (typeof XMLHttpRequest!='undefined') {
		return new XMLHttpRequest();
	}
}

function getUrl(url, cb) { 
	var xmlhttp = getXmlHttp();
	xmlhttp.open("GET", url);
	if (cb) {
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4) {
				cb(
				xmlhttp.status, 
				xmlhttp.getAllResponseHeaders(), 
				xmlhttp.responseText
				);
			}
		}
	}
	xmlhttp.send(null);
}

function doPost(actionUrl, params) {
	var newF = document.createElement("form");
	newF.action = actionUrl;
	newF.method = 'POST';
	var parms = params.split('&');
	for (var i=0; i<parms.length; i++) {
	  var pos = parms[i].indexOf('=');
	  if (pos > 0) {
		   var key = parms[i].substring(0,pos);
		   var val = parms[i].substring(pos+1);
		   var newH = document.createElement("input");
		   newH.name = key;
		   newH.type = 'hidden';
		   newH.value = val;
		   newF.appendChild(newH);
	  }
	}
	document.getElementsByTagName('body')[0].appendChild(newF);
	newF.submit();
}

document.write('<script src="\/js\/console_log.js"><\/' + 'script>');

function updateAltEffects(effects) {
	_top().frames['main_frame'].temp_effects = effects;
}

function updatePetEffects(effects) {
	_top().frames['main_frame'].pet_effects = effects;
}

function getClientWidth()
{
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth;
}

function getClientHeight()
{
  return document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight;
}

function chat_add_artifact_macros(id, end_space) {
	return chat_add_macros('artifact_'+id, end_space);
}

function chat_add_macros(name, end_space) {
	if (end_space === undefined)
		end_space = true;
	var text = '[['+name+']]';
	if (end_space)
		text += ' ';
	var win = window;
	if (!win._top().frames['chat']) return false;
	win._top().frames['chat'].chatAddToMsg(text);
	return true;
}

function change_select_color(element) {
	var option = element.options[element.selectedIndex];
	
	if (option.style.color != "") {
		element.style.color = option.style.color;
	} else {
		element.style.color = "";
	}
}

function check_select_color() {
	var change_select = gebi('change_select_id');

	if (change_select) {
		change_select_color(change_select);
	}
}

function user_show_prof_bag(show) {
        var pr_bag_tab = _top().frames['main_frame'].frames['main'].gebi("tab_pr_bag");
        if (show) pr_bag_tab.style.display = 'block';
        else pr_bag_tab.style.display = 'none';
}

var client_exchange_store;

function isInClient() {
	return document.cookie.indexOf("isInClient") > -1;
} 

function clientExchangePut(text) {
	if (!isInClient()) return false
	if(!client_exchange_store) {
		client_exchange_store = new Array();
	}
	return client_exchange_store.push(text);
}

function clientExchangeGet() {
	if (!isInClient()) return false;
	if(client_exchange_store && client_exchange_store.length) {
		return client_exchange_store.shift();
	}
	return null;
}

function vardump (object, maxdepth) {
	maxdepth = maxdepth || 50;
	switch (typeof(object)) {
		case 'boolean':
			return object ? 'true' : 'false';
			break;

		case 'number':
			return object.toString();
			break;

		case 'string':
			return '"' + object + '"';
			break;

		case 'object':
			if (maxdepth <= 0) {
				return "...";
			}

			maxdepth--;

			var ret = [];
			var isArray = object instanceof Array;
			for (var key in object) {
				isArray ? ret.push(vardump(object[key])) : ret.push('"'+key+'"' + ': ' + vardump(object[key], maxdepth));
			}

			maxdepth++;

			return (isArray ? '[' : '{') + ret.join(', ') + (isArray ? ']' : '}');
			break;

		case 'undefined':
			return 'undefined';
			break;

		case 'function':
			return 'function';
			break;
	}

	return '?';
};

function clientReceive(data, swf_name) {
	_top().frames['chat'].clientCallBack($.parseJSON(data));
}

function isInInstance() {
	return _top().frames['chat'].checkInInstance();
}

function confirmCenterDiv(html, options){
    var name = _top().$.Popup;
    if (_top().popup != null && _top().popup != undefined) {
         _top().popup.close();
    }
    _top().popup = new name(options);
	if (options.withoutQuotes) {
		html = html.replace(/&quot;/g, '"').replace(/&backslash;/g, '\\');
	}
    _top().popup.open(html, options.type || 'html');
}

function confirmCenterDivClose(){
	if (_top().popup != null && _top().popup != undefined) {
		_top().popup.close();
	}

	if (typeof(showNextPopupWindow) == "function") {
		showNextPopupWindow();
	}
}

function closeHeavensGift(){
   confirmCenterDivClose();
   entry_point_request('heavensgift', 'close');
}

function showAltInHeavensGift(artikul_id, p1, p2) {
    artifactAltSimple(artikul_id, p1, p2);
}
function openHeavensGift(useCanvas) {
	if (useCanvas == undefined) useCanvas = false;
	var html;
	var par = 'dice_game_controller_url=entry_point.php&locale_file='+_top().locale_file+'&width=460&height=520';
	if (useCanvas) {
		html = document.createElement("div");
		new canvas.app.CanvasDiceGame(par,html);
	} else {
		html = '<object type=\"application/x-shockwave-flash\" data=\"/images/swf/dice_game.swf\" width=\"460\" height=\"520\">\
						<param name=\"wmode\" value=\"transparent\">\
						<param name=\"movie\" value=\"/images/swf/dice_game.swf\">\
						<param name=\"FlashVars\" value=\"' + par + '\" />\
				</object>';
	}
    var options = {width:460,height:520};
    confirmCenterDiv(html, options);
}

function freeShopListRender() {
    var html = '<table width=\"100%\" height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" align=\"center\">\
		<tbody>\
			<tr style=\"height: 33px;\">\
				<td width=\"19\" valign=\"bottom\" align=\"right\"><img src=\"images/tbl-sts_corner-top-left.gif\" width=\"19\" height=\"19\"></td>\
				<td class=\"tbl-sts_top\" align=\"center\" valign=\"top\">\
					<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" height=\"39\">\
			  			<tbody>\
			  				<tr>\
								<td width=\"87\" class=\"tbl-sts_header-left\"></td>\
								<td class=\"tbl-sts_header-center-png\" nowrap=\"\">'+_top().free_shop_list_locale['title']+'</td>\
								<td width=\"87\" class=\"tbl-sts_header-right\"></td>\
			  				</tr>\
						</tbody>\
					</table>\
				</td>\
				<td width=\"19\" valign=\"bottom\"><img src=\"images/tbl-sts_corner-top-right.gif\" width=\"19\" height=\"19\"></td>\
	  		</tr>\
		  	<tr height=\"100%\">\
				<td class=\"tbl-sts_left\" valign=\"top\">\
					<table width=\"19\" height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\
			  			<tbody>\
			  				<tr>\
								<td valign=\"top\" align=\"right\"><img src=\"images/tbl-sts_left-top.gif\" width=\"19\" height=\"20\"></td>\
			  				</tr>\
			  				<tr>\
			  					<td>&nbsp;</td>\
			  				</tr>\
			  				<tr>\
								<td valign=\"bottom\" align=\"right\"><img src=\"images/tbl-sts_left-bottom.gif\" width=\"19\" height=\"16\"></td>\
			  				</tr>\
						</tbody>\
					</table>\
				</td>\
				<td class=\"bgg\" align=\"center\" valign=\"middle\">\
					<b>Доступные магазины</b>\
					<br><br>\
                                        <form method="post" target="main" action="area_store.php?source=freestore">\
                                            <input id=\"freeStoreId\" type=\"hidden\" name=\"free_store_id\" value=\"\">\
					<table border=\"0\" cellpadding=\"1\" cellspacing=\"0\" style=\"border: 0px;\">\
						<tbody>\
							<tr>\
								<td id=\"freeShopListSelect\" colspan=\"2\">\<img src=\"/images/ajaxloader.gif\"/>\</td>\
							</tr>\
							<tr>\
								<td colspan=\"2\" id=\"links\"></td>\
							</tr>\
							<tr style=\"border: 0px;\">\
								<td colspan=\"2\" align=\"center\" style=\"border: 0px;\">\
									<br><b class=\"butt1 pointer\"><b>\
										<input value=\"'+_top().free_shop_list_locale['submit']+'\" type=\"submit\" onclick=\"gebi(\'freeStoreId\').value=gebi(\'freeShopSelect\').value;confirmCenterDivClose();\" class=\"grnn\">\
									</b></b>\
								</td>\
							</tr>\
						</tbody>\
					</table>\
                                        </form>\
					<b class=\"butt1 pointer\"><b><input value=\"Отмена\" type=\"button\" onclick=\"confirmCenterDivClose();\" class=\"redd\"></b></b>\
				</td>\
				<td valign=\"top\" class=\"tbl-sts_right\">\
					<table width=\"19\" height=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\
						<tbody>\
							<tr>\
                                                            <td valign=\"top\"><img src=\"images/tbl-sts_right-top.gif\" width=\"19\" height=\"20\"></td>\
							</tr>\
							<tr>\
								<td>&nbsp;</td>\
							</tr>\
							<tr>\
								<td valign=\"bottom\"><img src=\"images/tbl-sts_right-bottom.gif\" width=\"19\" height=\"16\"></td>\
							</tr>\
						</tbody>\
					</table>\
				</td>\
			</tr>\
			<tr style=\"height: 20px\">\
				<td align=\"right\"><img src=\"images/tbl-sts_corner-bottom-left.gif\" width=\"19\" height=\"20\"></td>\
				<td class=\"tbl-sts_bottom\">&nbsp;</td>\
				<td><img src=\"images/tbl-sts_corner-bottom-right.gif\" width=\"19\" height=\"20\"></td>\
			</tr>\
			<tr>\
				<td colspan=\"0\" align=\"center\"></td>\
			</tr>\
		</tbody>\
	</table>';
    var options = {width:360,height:320};
    confirmCenterDiv(html, options);
}

function openFreeShopList() {
    freeShopListRender();
    if (_top().free_shop_list.length==0) {
        entry_point_request('store', 'freestorelist', {}, function(data) {
            if (data.list!=undefined && data.list!=null) {
                _top().free_shop_list = data.list;
                $('#freeShopListSelect').html(getSelectHtmlByIdTitleArray(_top().free_shop_list, 'freeShopSelect'));
            }
        });
    } else {
        $('#freeShopListSelect').html(getSelectHtmlByIdTitleArray(_top().free_shop_list, 'freeShopSelect'));
    }
}

function getSelectHtmlByIdTitleArray(idTitleArray, selectId) {
    var html = '<select class=\"dbgl2 b small\" id=\"'+selectId+'\">';
    for (var id in idTitleArray) {
        html+='<option value=\"'+id+'\">'+idTitleArray[id]+'</option>';
    }
    html+='</select>';
    return html;
}


var frame_content_hider = null;
function systemConfirm(title, ms,obj,func,funcCancel){
	frame_content_hider = frame_content_hider || $('#frame_content_hider');
	if (!frame_content_hider.length) {
		frame_content_hider = $('<div />').attr('id', 'frame_content_hider').appendTo('body');
	}
	if (title) {
		var confirm_title = gebi('confirm_title');
		confirm_title.innerHTML = title;
	} else {
		var confirm_title = gebi('confirm_title');
		confirm_title.innerHTML = 'Сообщение';
	}
	if (ms){
		var confirm_ms = gebi('confirm_ms');
		confirm_ms.innerHTML = '<b>'+ms+'</b>'; 
	}
	
	var div = gebi('systemConfirm_div');
	div.style.display = 'block';
	div.style.top = (document.body.clientHeight - div.offsetHeight)/2;
	div.style.left = document.body.scrollLeft + (document.body.clientWidth - div.offsetWidth)/2;
	frame_content_hider.show();
	
	$(document).on('keyup', function(e) {
		$(this).unbind('keyup');
		if (e.keyCode == 27) { // Esc
			$('#btnCancel').click();
		}
	});
	
	var  btnOk = gebi("btnOk");
	btnOk.onclick = function () {
		if(!func) {
			if (obj.href && obj.tprocmenu) {
				tProcessMenu(obj.tprocmenu, {url: obj.href});
			} else if (obj.href) {
				location.href = obj.href;
			} else if (obj.submit) {
				obj.submit();
			} 
		} else {
			func();
		}
		div.style.display = 'none';
		frame_content_hider.hide();
		return true;
	};
	btnOk.focus();

	var  btnCancel = gebi("btnCancel");
	btnCancel.onclick = function () {
		div.style.display = 'none';
		frame_content_hider.hide();
		if (funcCancel) funcCancel();
	};

	var popup_global_close_btn = gebi("popup_global_close_btn");
	popup_global_close_btn.onclick = function () {
		div.style.display = 'none';
		frame_content_hider.hide();
	};

	return false;
}

function hasClass(el, c) {
	return el.className.match(new RegExp('(^|\\s+)'+c+'($|\\s+)'));
}

function addClass(el, c) {
	if (!hasClass(el, c)) {
		el.className += ' '+c;
	}
}

function removeClass(el, c) {
	if (hasClass(el, c)) {
		el.className = el.className.replace(new RegExp('(^|\\s+)'+c+'($|\s+)', 'gi'), ' ').replace(/\s+/g, ' ').replace(/(^|$)/g, '');
	}
}

function backpack_diff(data) {
	var art_pfx = 'AA_';
	var frame_def = 3;
	var is_diff = false;

	//global alts update (left and right items)
	if (data.changed) {
		$.each(data.changed, function(index,item) {
			if (_top().frames['main_frame'].art_alt[art_pfx + item.id]) {
				_top().frames['main_frame'].art_alt[art_pfx + item.id] = item;
			}
		});
	}
	
	var $backpack = _top().$('#main_frame').contents().find('#backpack');

	if (!$backpack || $backpack.attr('data-loaded') != 1) {
		return;
	}

	var backpack_groups = _top().backpack_groups;
	var backpack_group_sub = _top().backpack_group_sub;

	var $sections = {};
	$.each($backpack.contents().find('iframe.backpack-section'), function() {
		if ($(this).attr('data-loaded')) {
			$sections[$(this).attr('data-group').toString()] = $(this);
		}
	});

	// info
	if ((typeof data.info == 'object') && (typeof data.info.amount != 'undefined') && (typeof data.info.amount_max != 'undefined')) {
		$.each($sections, function(index, item) {
			item.contents().find('#artifact_amount').text(data.info.amount);
			item.contents().find('#artifact_amount_max').text(data.info.amount_max);
		});
	}

	// money
	if ((typeof data.money == 'object')) {
		$.each($sections, function(index, item) {
			for (var i in data.money) item.contents().find('#money-type-'+i).html(data.money[i]);
		});
	}

	// info pr bag
	if ((typeof data.info_pr_bag == 'object') && (typeof data.info_pr_bag.amount != 'undefined') && (typeof data.info_pr_bag.amount_max != 'undefined')) {
		$.each($sections, function() {
			$(this).contents().find('#pr_bag_section').toggle(!!(data.info_pr_bag.amount_max > 0));
			$(this).contents().find('#pr_artifact_amount').html(data.info_pr_bag.amount);
			$(this).contents().find('#pr_artifact_amount_max').html(data.info_pr_bag.amount_max);
		});
	}

	// deleted
	if (data.deleted && data.deleted.length > 0) {
		$.each(data.deleted, function(index, id) {
			is_diff = true;
			$.each($sections, function() {
				var $c = $(this).contents();
				var $el = $c.find('#' + art_pfx + id);
				if ($el.length > 0) {
					$el.remove();
					$c.find('.bag_section').each(function() {
						if ($(this).attr('id') == 'bag_section' || $(this).attr('id') == 'pr_bag_section') {
							$(this).find('.backpack_list').find('.empty').toggle(!($(this).find('.item').length > 0));
						} else {
							$(this).toggle($(this).find('.item').length > 0);
						}
					});
					return false;
				}
			});
		});
	}

	// changed
	if (data.changed) {
		if ($.browser.msie) {
			if (typeof $backpack[0].contentWindow.__reload_if_ie__ != 'undefined') {
				$backpack[0].contentWindow.__reload_if_ie__ = true;
			}
		}
		var add = {};
		$.each(data.changed, function(index, item) {
			is_diff = true;
			var iframe_num = (backpack_groups[item.kind_id] ? backpack_groups[item.kind_id] : frame_def);
			var $iframe = $sections[iframe_num];
			if (!$iframe) {
				return true;
			}
			if (item.enchant_icon) {
				item.enchant_icon = item.enchant_icon.replace(/&quot;/g, '"');
			}
			$iframe[0].contentWindow.art_alt[art_pfx + item.id] = item;
			var $el = $iframe.contents().find('#' + art_pfx + item.id);
			var $el_new = $('<li></li>');
			var sub = null, $ul1;
			if (backpack_group_sub[iframe_num]) {
				if (backpack_group_sub[iframe_num].kinds && typeof backpack_group_sub[iframe_num].kinds[item.kind_id] != 'undefined') {
					sub = backpack_group_sub[iframe_num].kinds[item.kind_id];
				} else if (backpack_group_sub[iframe_num].types && typeof backpack_group_sub[iframe_num].types[item.type_id] != 'undefined') {
					sub = backpack_group_sub[iframe_num].types[item.type_id];
				} else if (backpack_group_sub[iframe_num].quality && typeof backpack_group_sub[iframe_num].quality[item.quality] != 'undefined') {
					sub = backpack_group_sub[iframe_num].quality[item.quality];
				} else if (backpack_group_sub[iframe_num].profession && typeof(item.profession) != 'undefined' && parseInt(item.profession, 10) != 0) {
					sub = backpack_group_sub[iframe_num].profession;
				}
				$ul1 = $iframe.contents().find('#item_list_sub_' + sub);
				if ($ul1.length == 0) {
					sub = null;
				}
			}
			
			if (sub === null) {
				$ul1 = $iframe.contents().find('#' + (parseInt(item.storage_type) == 0 ? 'item_list' : 'pr_item_list'));
				var $ul2 = $iframe.contents().find('#' + (parseInt(item.storage_type) == 0 ? 'pr_item_list' : 'item_list'));
			}
			if ($el.length > 0) { // change
				$el_new
					.attr('id', art_pfx + item.id)
					.attr('class', 'item')
					.attr('aid', 'art_' + item.id)
					.attr('ord', item.ord)
					.attr('data-id', item.id)
					.attr('data-title', item.title)
					.attr('data-kind', item.kind_id)
					.attr('data-ttl', item.time_expire)
					.attr('data-quality', item.quality)
					.html(html_artifact_slot(item));
				$el.replaceWith($el_new);
				add[iframe_num]++;
			} else { // add
				if (!add[iframe_num]) {
					add[iframe_num] = 0;
				}
				add[iframe_num]++;
				$el_new
					.attr('id', art_pfx + item.id)
					.attr('class', 'item')
					.attr('aid', 'art_' + item.id)
					.attr('ord', item.ord)
					.attr('data-id', item.id)
					.attr('data-title', item.title)
					.attr('data-kind', item.kind_id)
					.attr('data-ttl', item.time_expire)
					.attr('data-quality', item.quality)
					.html(html_artifact_slot(item));

				var $children = $ul1.children('.item');
				var $point = false;
				item.ord = parseInt(item.ord);
				$.each($children, function() {
					if (parseInt($(this).attr('ord')) > item.ord) {
						$point = $(this);
						return false;
					}
				});
				if ($point) {
					$el_new.insertBefore($point);
				} else {
					$el_new.appendTo($ul1);
				}
			}

			$ul1.find('.empty').toggle(!($ul1.find('.item').length));
			if (typeof sub == 'undefined') {
				$ul2.find('.empty').toggle(!($ul2.find('.item').length));
			} else {
				$iframe.contents().find('#bag_section_sub_'+sub).toggle($ul1.find('.item').length > 0)
			}
		});
		for (var i in add) {
			if ($sections[i][0].contentWindow.itemsFilterSync && (typeof $sections[i][0].contentWindow.itemsFilterSync == 'function')) {
				$sections[i][0].contentWindow.itemsFilterSync();
			}
		}
	}

    if (data.cnt_changed) {
        $.each(data.cnt_changed, function(index, item) {
            is_diff = true;
            var iframe_num = (backpack_groups[item.kind_id] ? backpack_groups[item.kind_id] : frame_def);
            var $iframe = $sections[iframe_num];
            if (!$iframe) return true;
            $iframe[0].contentWindow.art_alt[art_pfx + item.id].cnt = item.cnt;
            var $el = $iframe.contents().find('#' + art_pfx + item.id);
            if ($el.length <= 0) return true;
            $el.contents().find('.artifact-slot-qnt').html(item.cnt);
        });
    }

	// __reset_on_diff__
	if (is_diff) {
		var $main = _top().$('#main_frame').contents().find('#main');
		if ($main[0].contentWindow.__reset_on_diff__) {
			tUnsetFrame('main');
			$main[0].contentWindow.__reset_on_diff__ = false;
		}
	}
}

function money_backpack_update(data) {
	if (!data) {
		return;
	}

	var frame_pfx = 'user_iframe_';

	if (!_top().frames['main_frame'].gebi('backpack') || _top().frames['main_frame'].gebi('backpack').getAttribute('data-loaded') != 1) {
		return;
	}

	var f = _top().frames['main_frame'].frames['backpack'];
	var uif = [];
	for (var i = 1; i <= 6; i++) {
		if (f.gebi(frame_pfx + i) && f.gebi(frame_pfx + i).getAttribute('data-loaded') == 1) {
			uif.push(i);
		}
	}

	for (var i = 0; i < uif.length; i++) {
		for (var type_id in data) {
			f.frames[frame_pfx + uif[i]].gebi('money-type-' + type_id).innerHTML = data[type_id].replace(/&quot;/g, '"');
		}
	}
}

function updateEstate() {
	if (_top().frames['main_frame'] && _top().frames['main_frame'].frames['main'] && _top().frames['main_frame'].frames['main'].__estate_php__) {
		if (_top().iframe == 'main') {
			_top().frames['main_frame'].frames['main'].location.reload();
		} else {
			tUnsetFrame('main');
		}
	}
}

/**
 * обновить текущее открытое здание в поместье
 *
 * @return void
 */
function estateReloadCurrentBuilding() {
	var estateSwf = _top().frames.main_frame.frames.main;
	if (!estateSwf) {
		return;
	}

	estateSwf = estateSwf.document.getElementById('estate');
	if (!estateSwf) {
		return;
	}

	try {
		estateSwf.updateCurrentBuilding();
	} catch (exception) {
	}
}

function reloadArea() {
	_top().frames['main_frame'].frames['main'].location.href = 'area.php';
}

function html_artifact_slot(data) {
	var html = '';
	var action = data.action ? data.action : 'info';
	
	html += '<span class="artifact-slot"';
	html += ' artifact_id="' + data.id + '"';
	
	if (data.add_attrs) html += data.add_attrs.replace(/&quot;/g, '"');
	html += '>';

	html += '<span class="artifact-slot__action ' + action + '"></span>';
	html += '<span class="artifact-slot__ico info"></span>';
	html += '<img class="artifact-slot__picture" src="' + data.image + '" height="60" width="60" style="background: url(' + data.image + ') 50% 50% no-repeat;">';

	if (data.lootdog_badge) {
		html += '<img class="lootdog-badge" src="'+data.lootdog_badge+'" alt="lootdog pack">';
	}

	for (var i in data.icon_list) {
		html += '<span class="artifact-slot__ico ' + data.icon_list[i] + '"></span>'
	}
	
	if (data.cnt) {
		html += '<span class="artifact-slot-qnt">' + data.cnt + '</span>';
	} else {
		if (data.enchant3) {
			html += '<span class="artifact-slot__enchant enchant-oprava"></span>';
		}
		
		if (data.enchant_class) {
			html += '<span class="artifact-slot__enchant ' + data.enchant_class + '"></span>';
		}
		
	}
	
	return html;
}

function tProcessMenu(par, opt) {
	_top().frames['main_frame'].processMenu(par, opt);
}

function tSetFrameData(frame, value) {
	if (!frame)
		return;
	try {
		_top().frames['main_frame'].gebi(frame).setAttribute('data-loaded', value);
	} catch (e) {}
}

function tUnsetFrame(frame, full) {
	if (!frame)
		return;
	try {
		if (full) {
			_top().frames['main_frame'].frames[frame].location.href = 'blank.html';
		}
		var obj = _top().frames['main_frame'].gebi(frame);
		obj.setAttribute('data-loaded', 0);
		obj.setAttribute('data-par', '');
	} catch (e) {}
}

function tUnsetBackpackGroup(ids) {
	if (!ids || !ids.length || _top().frames['main_frame'].gebi('backpack').getAttribute('data-loaded') != 1) return;
	try {
		var c = 0;
		for (var i = 0; i < ids.length; i++) {
			var backpack = _top().frames['main_frame'].frames['backpack'];
			var group = _top().backpack_groups[ids[i]] ? _top().backpack_groups[ids[i]] : 3;
			if (group == 1) {
				tUnsetFrame('backpack', true);
				break;
			} else {
				if (backpack.gebi('user_iframe_' + group).getAttribute('data-loaded') != 1) continue;
				backpack.gebi('user_iframe_' + group).setAttribute('data-loaded', 0);
				backpack.gebi('user_iframe_' + group).src = '';
				c++;
			}
		}
		if (c) {
			backpack.tab_click(1);
			backpack.swUserIframes('user_iframe_1', 'user_iframe.php?group=1');
		}
	} catch (e) {}
}

function backpackTabReload(groupId, selectByDefault) {
	selectByDefault = selectByDefault || false;
	try {
		var backpack = _top().frames['main_frame'].frames['backpack'];
		if (selectByDefault) {
			backpack.tab_click(groupId);
		}
		backpack.swUserIframes('user_iframe_' + groupId, 'user_iframe.php?group=' + groupId);

	} catch (e) {}
}


function tLockFrame() {
	_top().iframe_locked = true;
}

function tUnlockFrame() {
	_top().iframe_locked = false;
}

function return_link(url) {
	try {
		if (_top().frames['main_frame'].frames['main'].__location__ || typeof url == 'undefined') {
			_top().tProcessMenu('b06');
		} else {
			_top().frames['main_frame'].frames[_top().iframe].location.href = url;
		}
	} catch(e) {}
}

window.last_top = false;
function _top() {
	if (window.last_top) return window.last_top;
	var p = window;
	while (true) {
		try {
			if (p.location.href.match(/main\.php/) || p.parent === p) { break;}
		} catch (e) {
			window.last_top = p;
			return p;
		}
		p = p.parent.window;
	}
	window.last_top = p;
	return p;
}
try {
	window.top = top = _top();
} catch (e) {}

window.close_ = window.close;
window.close = function(e, id) {
	var win = _top().window;
	if (win.js_popup && id) {
		win.destroyPopup(e, id);
	} else {
		win.close_();
	}
};

if (_top().js_popup) {
	window.open_ = window.open;
	window.open = function(url, name, params) {
		if (params) {
			var w = params.match(/width=(\d+),?/)[1];
			var h = params.match(/height=(\d+),?/)[1];
		}
		_top().createPopup({
//			title: name,
			iframe: {
				src: url,
				height: h||400,
				width: w
			}
		});
	};
}

function windowClose(event) {
	if (!event) event = null;
	_top().close(event, window.name);
}

function table_add_red_border(table) {
	$table = $(table);
	$table.find('td').each(function(i, el) {
		$el = $(el);
		if ($el.hasClass('tbl-shp-sml')) {
			$el.removeClass('tbl-shp-sml').addClass('tbl-shp-sml_0');
		} else if ($el.hasClass('tbl-shp-sides')) {
			$el.removeClass('tbl-shp-sides').addClass('tbl-shp-sides_0');
		}
	});
}

function add_green_animated_arrow(el, dont_remove) {
	var arrow = $('<div />').addClass('big_green_arrow');
	arrow.insertBefore(el);
	for (var i = 0; i < 3; i++) {
		arrow.animate({left: '-58px'}, 1000)
			.delay(100)
			.animate({left: '-48px'}, 800);
	}
	arrow.animate({left: '-58px'}, 800)
		.delay(100)
		.animate({left: '-48px'}, 800, false, function() {
			if (!dont_remove)
				arrow.remove();
		});
}


var onerror_limit = [];
function window_onerror(message, url, linenumber) {
	if (!_top().js_debug) return false;
	if (!url || !url.length) return false;
	if (url.search('resource:///') !== -1) return false;
	if (url.search('chrome://') !== -1) return false;
	if (url.search('dwar.') === -1 && url.search('rudt.') === -1) return false;
	js_error_log(message, linenumber, url);
	return false;
};

function js_error_log(message, linenumber, url) {
	url = url || document.location.href;
	var data = {
		message: message,
		url: url,
		linenumber: linenumber,
		user_agent: navigator.userAgent
	};
	if (_top().location.href.search('/admin/') !== -1) {
		data['admin'] = 1;
	}
	console_log('js_error_log', data);
	if (!_top().js_debug) return false;
	var now = time_current();
	for (var i in onerror_limit) {
		if (onerror_limit[i] <= now - 10) {
			onerror_limit.splice(i, 1);
		}
	}
	if (onerror_limit.length > 5) return false;
	onerror_limit.push(now);
	_top().$.post('/pub/js_error.php', data);
	return true;
};

if (_top().js_debug) {
	window.onerror = window_onerror;
}

function time_current() {
	return Math.round(((new Date()).getTime()) / 1000);
}

function htmlspecialchars(data) {
	data = typeof(data) == 'undefined' ? '' : data + '';
	return data
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
/**
* Функция проверяет сколько символов осталось ввести пользователю
* (для полей с ограничением по количеству символов)
*
* @param object        - объект Event
* @param string|object - ID нужного поля или его DOM-нода
* @param string|object - ID блока с информацией о количестве символов или его DOM-нода
* @param string        - текст для поля с информацией с разделителями "|" для разбивки в массив
*
* @return void
*/
function countSymbols(e, field, infoBlock, infoLabel) {
	e = e || window.event;
	var key = e.keyCode || e.which;
	var modifier = 0;

	if (document.selection || navigator.userAgent.indexOf("Opera") > -1) { // IE | Opera
		modifier = 1;

		if (key == 8) { // Backspace
			modifier = -1;
		}
	}

	if (key > 36 && key < 41) { // не обрабатываем стрелки
		return;
	}

	if (e.ctrlKey || e.altKey || e.metaKey) { // не обрабатываем спец. символы
		return;
	}

	field = (typeof field === 'string') ? document.getElementById(field) : field;
	infoBlock = (typeof infoBlock === 'string') ? document.getElementById(infoBlock) : infoBlock;
	infoLabel = infoLabel.split('|');

	if (infoBlock.style.display == 'none') {
		infoBlock.style.display = 'block';
	}

	if (field.getAttribute('maxlength')) {
		// Позиция каретки до вставки текста скриптом
		var caretPos = getCaretPosition(field);

		/*
		* на момент срабатывания keydown символ еще не введен в поле
		* чтобы обойти это используем костыль в виде setTimeout с нулевым интервалом
		*/
		setTimeout(function() {
			field.max = parseInt(field.getAttribute('maxlength'));
			field.value = field.value.substr(0, field.max);

			if (document.selection || navigator.userAgent.indexOf("Opera") > -1) { // IE | Opera
				setCaretPosition(field, caretPos + modifier);
			}

			infoBlock.innerHTML = infoLabel[0] + ' ' + (field.max - field.value.length) + ' ' + infoLabel[1] + ' ' + field.max;
		}, 0);
	}
}

/**
* Функция получает позицию каретки в input или textarea
*
* @param object - DOM-нода поля
*
* @return number
*/
function getCaretPosition(field) {
	var caretPos = 0;

	if (document.selection) { // IE
		var currentRange = document.selection.createRange();  
		var workRange = currentRange.duplicate();

		field.select();

		var allRange = document.selection.createRange();
		var len = 0;  

		while (workRange.compareEndPoints('StartToStart', allRange) > 0) {
			workRange.moveStart('character', -1);

			len++;
		}

		currentRange.select();

		caretPos = len;
	} else if (field.selectionStart || field.selectionStart == '0') { // W3C
		caretPos = field.selectionStart;
	}

	return caretPos;
}

/**
* Функция устанавливает позицию каретки в input или textarea
*
* @param object - DOM-нода поля
* @param number - позиция каретки
*
* @return void
*/
function setCaretPosition(field, caretPos) {
	if (field != null) {
		if (field.createTextRange) { // IE
			var range = field.createTextRange();

			range.move('character', caretPos);

			range.select();
		} else if (field.selectionStart) { // W3C
			field.focus();

			field.setSelectionRange(caretPos, caretPos);
		} else {
			field.focus();
		}
	}
}

/**
* Аналог функции html_period_str, реализованной на PHP
*
* @param {number} - время в секундах
* @param {array} - массив с подписями к часам, минутам, секундам и т.п.
*                  ['д', 'ч', 'мин', 'сек']
* @param {boolean} - показывать/не показывать секунды
* @param {boolean} - показывать/не показывать минуты
* @param {string} - разделитель
* @param {boolean} - использовать ли расширеный режим
*
* @return {string}
*/
function htmlPeriodStr(v, textArray, withSeconds, withMinutes, glue, extended, short) {
	withSeconds = withSeconds || false;
	withMinutes = withMinutes || true;
	glue = glue || ' ';
	extended = extended || true;
	short = false || short;

	v = Math.max(v, 0);
	var ss = parseInt(v) % 60,
		mm = parseInt(v / 60) % 60,
		hh = parseInt(v / 3600) % 24,
		dd = parseInt(v / 86400),
		t = [];

	if(extended && short) {
		if (dd) {
			t.push(dd + textArray[0]);
			if (hh || (dd && mm)) {
				t.push(hh + textArray[1]);
			}
		} else if (hh || (dd && mm)) {
			t.push(hh + textArray[1]);
			if (withMinutes && mm) {
				t.push(mm + textArray[2]);
			}
		} else if (withMinutes && mm) {
			t.push(mm + textArray[2]);
			if ((withSeconds && ss) || (v < 60)) {
				t.push(ss + textArray[3]);
			}
		} else if ((withSeconds && ss) || (v < 60)) {
			t.push(ss + textArray[3]);
		}
	} else if (extended) {
		if (dd) {
			t.push(dd + textArray[0]);
		}

		if (hh || (dd && mm)) {
			t.push(hh + textArray[1]);
		}

		if (withMinutes && mm) {
			t.push(mm + textArray[2]);
		}

		if ((withSeconds && ss) || (v < 60)) {
			t.push(ss + textArray[3]);
		}
	} else {
		t.push((hh < 10 ? '0' + hh : hh));
		
		if (withMinutes) {
			t.push((mm < 10 ? '0' + mm : mm));
		}

		if (withSeconds) {
			t.push((ss < 10 ? '0' + ss : ss));
		}
	}

	return t.join(glue);
}




/**
* Найти ближайшего родителя с заданным ID или className
*
* @param {object} - DOM-нода или её ID, начиная с которой будем подниматься вверх по дереву
* @param {string} - id или class у родителя, который ищем
*
* @return {boolean|object} - объект в случае успешного поиска и false в случае провала
*/
function findClosest(elem, parent) {
	elem = typeof elem === 'string' ? document.getElementById(elem) : elem;
	var obj = elem.parentNode;

	if (!parent || typeof parent !== 'string') {
		return false;
	}

	if (parent.indexOf('#') !== -1) {
		parent = parent.split('#')[1];

		while (obj && obj.id !== parent) {
			obj = obj.parentNode;
		}
	} else if (parent.indexOf('.') !== -1) {
		parent = parent.split('.')[1];

		while (obj && obj.className.indexOf(parent) === -1) {
			obj = obj.parentNode;
		}
	} else {
		return false;
	}

	return obj;
}

/**
* Функция обратного отсчета оставшегося времени
*
* @param {object|string} - DOM-нода или её ID
* @param {number} - время до истечения срока
* @param {array} - массив с подписями к часам, минутам, секундам и т.п.
*                  ['д', 'ч', 'мин', 'сек']
* @param {function} - коллбэк
*
* @return {void}
*/
function countdownTimer(elem, dtime, textArray, callback) {
	elem = typeof elem === 'string' ? document.getElementById(elem) : elem;
	elem.timer = setInterval(function() {
		var ctime = (new Date).getTime(),
			time = dtime - (ctime / 1000);

		elem.innerHTML = htmlPeriodStr(time, textArray);

		if (time <= 0) {
			clearInterval(elem.timer);

			if (callback) {
				callback.call(elem);
			}
		}
	}, 1000);
}

function markProccessedReport(crc) {
	if (crc) {
		var $chat = _top().$('#chat');
		$chat.contents().find('#if1').contents().find('div[report_crc="'+crc+'"]').parent('.JS-MsgContainer').addClass('opacity-50');
		$chat.contents().find('#if1').contents().find('div[crc="'+crc+'"]').parent('.JS-MsgContainer').addClass('opacity-50');
		$($chat[0].contentWindow.chatOpts[3].data).find('div[report_crc="'+crc+'"]').parent('.JS-MsgContainer').addClass('opacity-50');
	}
}

if (window.$) {
	$(document).on('click', 'span.artifact-slot', function (evnt) {
		var win;
		
		if (_top().dwar) {
			var win = _top();
		} else {
			win = window.opener || _top().dialogArguments.win;
		}

		var constants = win._top().dwar || {};
		var actionBlock = $(this).find('.artifact-slot__action').eq(0),
			action;
		
		for (var k in constants.backpack.actions) {
			action = constants.backpack.actions[k];
			
			if (actionBlock.hasClass(action)) {
				var art = actionBlock.parents('.artifact-slot:first').get(0);
				
				if (action === 'info') {
					var artifact_id = art.getAttribute('artifact_id');
					var gift_id = art.getAttribute('gift');
					var artikul_id = art.getAttribute('artikul_id');
					var set_id = art.getAttribute('set_id');

					if (gift_id !== null) {
						gift_id = artifact_id;
						artifact_id = false;
					}
					
					showArtifactInfo(artifact_id, artikul_id, set_id, evnt, gift_id);
				} else {
					if (typeof artifactAct != 'undefined') {
						artifactAct(art, action);
					}
				}
				break;
			}
		}
		// есть артефакты, для которых нет действия
	}).on('mouseenter', 'span.artifact-slot', function (e) {
		$(this).addClass('hover');
		artifactAlt(this, e, 2);
		// показать альт
	}).on('mouseleave', 'span.artifact-slot', function (e) {
		$(this).removeClass('hover');
		artifactAlt(this, e, 0);
		// скрыть альт
	}).on('mouseenter', 'span.artifact-slot__ico', function () {
		var win;

		if (_top().dwar) {
			var win = _top();
		} else {
			win = window.opener || _top().dialogArguments.win;
		}

		var constants = win._top().dwar || {};
		// изменить действие
		var classes = this.className.split(' '), actionBlock, action;
		for (var i in classes) {
			action = classes[i];

			if (inArray(action, constants.backpack.actions)) {
				actionBlock = $(this).parents('.artifact-slot:first').find('.artifact-slot__action');
				actionBlock.get(0).cache = actionBlock.eq(0).clone();
				actionBlock.removeClass(constants.backpack.actions.join(' ')).addClass(action);
				break;
			}
		}
	}).on('mouseleave', 'span.artifact-slot__ico', function () {
		var actionBlock = $(this).parents('.artifact-slot:first').find('.artifact-slot__action');
		var actionElem = actionBlock.get(0);
		actionElem.className = actionElem.cache.get(0).className;
	});
	
	jQuery.fn.extend({
		clanMngGradeTabInit: function () {
			var activeClass = 'active';
			var defaultClass = 'default';
			var e = $(this); var n = 0;
			var page_param = parse_str(location.search.split('?')[1]);
			$('.tab a').each(function(i, v) {
				$(v).click(function(e) {
					$(this).clanMngGradeDismarkTab();
					e.preventDefault();
					if (!$(v).hasClass(activeClass) && !$(v).hasClass('lock')) {
						var oldActiveTabName = $('a.' + activeClass).removeClass(activeClass).addClass(defaultClass).get(0).hash.split('=')[1];
						var oldActive = $('.' + oldActiveTabName);
						if (oldActive.length > 0) {
							var tab_e = $('#' + oldActiveTabName + '-link');
							oldActive.hide().each(function (j, h) {
								if ($(h).hasClass('not-saved')) {
									tab_e.clanMngGradeMarkTab();
									return false;
								}
							});
						}
						var newClass = '.'+$(this).removeClass(defaultClass).addClass(activeClass).get(0).hash.split('=')[1];
						$(newClass).show();
						$('#colspan-watch').attr('colspan', $(newClass).eq(0).parent().children(newClass).length);
					}
				});
				var submode = v.hash.split('=')[1];
				if ($(v).parent().get(0).id === (page_param.submode + '-link')) $(v).addClass(activeClass).removeClass(defaultClass);
				var t = $('.'+ submode);
				if (!page_param.submode && i === 0 || page_param.submode === submode) {
					n = t.show().eq(0).parent().children('.'+submode).length;
				}
			});
			$('#colspan-watch').attr('colspan', n);
			if (!page_param.submode) $('.tab:first a').removeClass(defaultClass).addClass(activeClass);
			e.parents('form:first').submit(function(event) {
				$(this).attr('action', $(this).attr('action') + '&' +$('.tab a.active').get(0).hash.split('#')[1]);
				var changed = e.find('.not-saved');
				if (changed.length > 0) {
					event.preventDefault();
					var pst = changed.length > 1 ? 's' : ''; var onlyGradeName = true;
					var change_grade = {}; var j = 1;
					changed.each(function (i, c) {
						c = $(c).find('input').get(0);
						if (c.type === 'checkbox') onlyGradeName = false;
						var grade_e = $(c).parents('tr:first').find('td:first input').get(0);
						var rowIndex = $(c).parents('tr:first').get(0).rowIndex;
						if (change_grade[rowIndex]) return true;
						var grade_title = grade_e.value;
						if (grade_e.firstVal !== grade_e.value) grade_title += ' ( ' + grade_e.firstVal + ' ) ';
						var lmsg = "<br/>" + (j++) + '. ' + grade_title;
						change_grade[rowIndex] = lmsg;
					});
					var msg = _top().dwar.lang.clan.management[(onlyGradeName ? 'confirmChangeGradeName' : 'confirmChangeGradePerm') + pst] + "<br/>";
					for (var i in change_grade) msg += change_grade[i];
					return _top().systemConfirm(null, msg, this);
				};
			});
		},
		inputSetHint: function() {
			var e = this[0]; var c = 'hint';
			var hint = e.getAttribute('rel');
			if (e.value === '') this.addClass(c).val(hint);
			this.focusin(function() {
				if (e.value === hint) $(this).removeClass(c).val('');
			}).focusout(function() {
				if (e.value === '') $(this).addClass(c).val(hint);
			});
		},
		clanManagementGradeWatch: function () {
			this.each(function(i, v) {
				$(v).find('input').each(function(j, e) {
					e.firstVal = (e.type === 'checkbox' ? e.checked : e.value);
					$(e).change(function() {
						$(this).clanMngGradeMarkCell();
						var td = $(e).parents('td:first');
						if (td.hasClass('not-saved')) return;
						var group = td[0].className;
						if ($(v).find('.' + group + '.not-saved').length === 0) {
							var tab = $('#' + group + '-link');
							if (tab.length) tab.clanMngGradeDismarkTab();
						}
					});
				});
			});
		},
		clanMngGradeMarkCell: function () {
			var f = this.get(0); var isCheckBox = (f.type === 'checkbox');
			var fv = f.firstVal; var td = this.parents('td:first');
			if (isCheckBox && fv === f.checked || !isCheckBox && fv === f.value) {
				td.removeClass('not-saved');
			} else {
				td.addClass('not-saved');
			}
		},
		clanMngGradeMarkTab: function () { if (this.find('.warn').length === 0) this.children().prepend($('<span/>').addClass('warn').attr('title', _top().dwar.lang.clan.management.notSaveWarn).html('<img src="images/warning-ico.png">')); },
		clanMngGradeDismarkTab: function() { this.find('.warn').remove(); },
		swapWith: function(to) {
			return this.each(function() {
				var copy_to = $(to).clone(true);
				var copy_from = $(this).clone(true);
				$(to).replaceWith(copy_from);
				$(this).replaceWith(copy_to);
			});
		}
	});
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

function _html_money_gold_str(o, amount) {
	var str = '<a href="'+o.url+'" target="_blank">';
	str += '<span title="'+o.alt+'"><img src="/images/'+o.picture+'" border="0" width="11" height="11" align="absmiddle" /></span></a>';
	str += '&nbsp;'+amount+'&nbsp;';
	return str;
}

function html_money_str(count, price, price_gold, price_work, price_silver, hide_empty_silver) {
	var multi = price < 0 ? -1 : 1;
	multi *= price_gold < 0 ? -1 : 1;
	multi *= price_work < 0 ? -1 : 1;
	multi *= price_silver < 0 ? -1 : 1;
	var money_info = _top().money_type_info;
	var str = '';
	
	var amount = moneyRound(Math.abs(price) * count);
	var amount_gold = moneyRound(Math.abs(price_gold) * count);
	var amount_work = moneyRound(Math.abs(price_work) * count);
	var amount_silver = moneyRound(Math.abs(price_silver) * count);
	
	var gold = Math.floor(amount/100);
	var silver = Math.floor(amount - (gold * 100));

    //работаем с int чтобы избежать проблем типа 101.1-101 = 0.09999999999999432
    amount = parseInt(amount * 100, 10);
	var bronze = Math.floor(amount - gold * 10000 - silver * 100);
	
	if (gold) str += _html_money_str(money_info.gold, gold);
	if (!hide_empty_silver && gold && bronze || silver) str += _html_money_str(money_info.silver, silver);
	if (bronze) str += _html_money_str(money_info.bronze, bronze);
	
	if (amount_gold) str += _html_money_gold_str(money_info.brilliante, parseFloat(amount_gold) ? (Math.round(amount_gold) == amount_gold ? Math.round(amount_gold) : amount_gold) : 0.00);
	if (amount_work) str += _html_money_str(money_info.work, amount_work, true);
	if (amount_silver) str += _html_money_gold_str(money_info.ruby, parseFloat(amount_silver) ? amount_silver : 0.00);
    
    if (str == '') {
        str += _html_money_str(money_info.bronze, 0);
    }

	return (multi == -1 ? ' - ' : '') + str;
}

function _html_money_str(o, amount, nospace) {
	var str = '<span title="'+o.alt+'"><img src="/images/'+o.picture+'" border=0 width=11 height=11 align=absmiddle>&nbsp;'+amount+(nospace ? '' : '&nbsp;')+'</span>';
	return str;
}

function moneyRound(num) {
    return parseFloat(num) ? num.toFixed(2) : num;
}

function artifact_calc_sell_price(e) {
	e = $(e);
	
	var price = parseFloat(e.attr('sell_price'));
	
	return {money: price};
}

function artifact_calc_repair_price(e) {
	e = $(e);
	
	return {money: parseFloat(e.attr('repair_price'))}
}

function artifact_get_color(artifact_id) {
	var artifact_alt = get_art_alt('AA_' + artifact_id);
	return artifact_alt.color;
}

function popupDialog(html, title, width, height, modal, cb) {
	var options = {};
	if (width) options.width = width;
	if (height) options.height = height;
	if (modal) options.modal = modal;
	options.closeContent = '';
	var el = $('#popup_global', _top().document).clone();
	if (!el) return;
	if (_top().popupDialogObj) _top().popupDialogObj.close();
	var name = _top().$.Popup;
	_top().popupDialogObj = new name(options);
	var popup = _top().popupDialogObj;
	var cont = el.find('.popup_global_container');
	cont.find('.popup_global_content').html(html);
	cont.find('.popup_global_title').html(title);
	popup.open(el.html(), 'html');
	_top().$('input').chStyler();
	if (typeof cb === 'function') {
		cb();
	}
}

function popupDialogClose() {
	if (_top().popupDialogObj) {
		_top().popupDialogObj.close();
	}

	if (typeof(showNextPopupWindow) == "function") {
		showNextPopupWindow();
	}
}

function current_server_time() {
	var chat = _top().chat;
	if (!chat) return false;
	var timestamp = parseInt(chat.chat_clock.getTime() / 1000);
	timestamp += chat.CHAT.timezone_diff;
	return timestamp;
}

function popup_checkbox(obj) {
	var popup_chk = $(obj);
	if (popup_chk.is(':checked')) {
			popup_chk.parent().addClass('checked');
	} else {
			popup_chk.parent().removeClass('checked');
	}
};

function popup_radio(obj) {
	var popup_radio = $(obj);
	$('.popup_radio_label').removeClass('checked');
	popup_radio.parent().addClass('checked');
};


//implement JSON.stringify serialization.
var JSON = JSON || {};

JSON.stringify = JSON.stringify || function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);
	} else {
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
			v = obj[n]; t = typeof(v);
			if (t == "string") v = '"'+v+'"';
			else if (t == "object" && v !== null) v = JSON.stringify(v);
			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};

function parse_str(str, array){	// Parses the string into variables
	// 
	// +   original by: Cagri Ekin
	// +   improved by: Michael White (http://crestidg.com)

	var glue1 = '=';
	var glue2 = '&';

	var array2 = str.split(glue2);
	var array3 = [];
	for(var x=0; x<array2.length; x++){
		if (!array2[x]) continue;
		var tmp = array2[x].split(glue1);
		array3[unescape(tmp[0])] = unescape(tmp[1] || '').replace(/[+]/g, ' ');
	}

	if(array){
		array = array3;
	} else{
		return array3;
	}
}

function html_button(title, param) {
	var html = '';

	param = param || {};
	
	var add = param.add || '';
	var addClassName = param.className || '';
	html += '<b class="butt1 pointer ' + addClassName+ '"><b>';
	html +=	'	<button class="butt1" ' + add + '>' + title + '</button>';
	html +=	'</b></b>';
	
	return html;
}

function common_macro_resolve(macro_id, macro_name, macro_data, text) {
	if (!text) return '';
	if (typeof(macro_id) == 'undefined' || !macro_name || !macro_data) return text;
	
	var addslashes = function(str) {
		return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	};
	
	var escape = function(html) {
		html = html.replace(/&/g, '&amp;');
		html = html.replace(/"/g, '&quot;');
		html = html.replace(/</g, '&lt;');
		html = html.replace(/>/g, '&gt;');
		return html;
	};
	
	var underlined = false;
	var underline = function(html) {
		if (!macro_data['under'] || underlined) return html;
		underlined = true;
		return '<span class="underline">' + html + '</span>';
	}

	var html = html_add = '';
	if (typeof(macro_data) != 'object') {
		html = macro_data;
	} else {
		try {
			switch (macro_name) {
				case 'USER':
					html = macro_data['html'];
					break;
				case 'BOT':
					html = macro_data['html'];
					break;
				case 'ARTIFACT_IMG':
					var uid_artifact = 'artifact_' + macro_data['id'] + '_' + Math.floor(Math.random() * 1000000 + 1);
					html = '';

					var attr = ' cnt="' + macro_data['num'] + '" div_id="' + uid_artifact + '"' +
					'style="cursor: pointer; position: relative; z-index: 1;"';
					html += '<table id="' + uid_artifact + '" width="60" height="60" cellpadding="0" cellspacing="0" border="0" class="artifact-table" background="' + macro_data['pic'] + '">' +
					'<tr><td ' + attr + ' onClick="showArtifactInfo(0, ' + macro_data['id'] + '); return false;">';
					if (macro_data['num'])
						html += '<div class="bpdig">' + macro_data['num'] + '</div>';
					html += '</td></tr></table>';

					break;
				case 'ARTIFACT':
					html = '<a class="artifact_info b macros_artifact_quality' + macro_data['quality'] + '" href="/artifact_info.php?artikul_id=' + macro_data['artikul_id'] + '" onClick="showArtifactInfo(false,' + macro_data['artikul_id'] + ');return false;">'
						+ htmlspecialchars(macro_data['title']) + '</a>';
					var num = parseInt(macro_data['num']);
					if (num > 0) {
						html_add += ' <b'+(macro_data['num_class'] ? ' class="'+macro_data['num_class']+'"' : '')+'>' + _top().TRANSLATE.amount_format.replace('%d', num) + '</b>';
					}
					break;
				case 'ARTIFACT2':
					html = '<a href="/artifact_info.php?artifact_id=' + macro_data['id'] + '&artikul_id='+macro_data['artikul_id']+'" onClick="showArtifactInfo(' + macro_data['id'] + ', '+macro_data['artikul_id']+');return false;"'
					+ ' class="macros_artifact macros_artifact_quality' + macro_data['quality'] + '">'
					+ htmlspecialchars(macro_data['title']) + '</a>';
					break;
				case 'GIFT':
					html = '<a href="/artifact_info.php?gift_id=' + macro_data['id'] + '" class="b macros_artifact_quality' + macro_data['quality'] + '" onClick="showArtifactInfo(false,false,false,false,' + macro_data['id'] + ');return false;">'
						+ htmlspecialchars(macro_data['title']) + '</a>';
					break;
				case 'MONEY':
					if (macro_data['money_type'] == 1) {
						html = html_money_str(1, macro_data['money'], 0, 0, 0, true);
					} else if (macro_data['money_type'] == 2) {
						html = html_money_str(1, 0, 0, 0, macro_data['money'], true);
					} else if (macro_data['money_type'] == 3) {
						html = html_money_str(1, 0, macro_data['money'], 0, 0, true);
					}
					break;
				case 'MAP':
					var onclick = 'showMsg(\'navigator.php?name=' + addslashes(macro_data['name']) + '\',\'' + 'Nav' + '\',560,423);return false;';
					html = '<a href="#" ' +
						(macro_data['under'] ? 'style="text-decoration: underline;" ' : '') +
						'onClick="' + onclick + '">' +
						macro_data['prepend_title'] + macro_data['title'] + '</a>';
					break;
				case 'RANK':
					html = '<img src="' + addslashes(macro_data['pic']) +
						'" border=0 width=13 height=13 align="absmiddle" title="' + 
						addslashes(macro_data['title']) + '">&nbsp;' +
						htmlspecialchars(macro_data['title']);
					break;
				case 'KLAN':
					html = macro_data['html'];
					break;
				case 'SMILE':
					html = '<img src="' + macro_data['pic'] + '" border="0" />';
					if (macro_data['need_link']) {
						html = '<a href="#" class="smile_tag" onClick="if (_top().chat) _top().chat.chatAddToMsg(\' '+macro_data['tag']+' \');return false;">' + html + '</a>';
					}
					break;
				case 'FIGHT_INFO':
					html = '<img src="'+macro_data['pic']+'" width="13" height="13" border="0" align="absmiddle"> ';
					html += '<a href="#" class="fight_info_lnk b" onclick="return showFightInfo(' + macro_data['id'] + ', ' + (macro_data['server_id'] || 'false') + ');">';
					html += underline(htmlspecialchars(macro_data['title']));
					html += '</a>';
					break;
				case 'TOURNAMENT_FIGHT_INFO':
					html = '<img src="'+macro_data['pic']+'" width="13" height="13" border="0" align="absmiddle"> ';
					html += '<a href="#" class="fight_info_lnk b" onclick="return showTournamentFightInfo(' + macro_data['id'] + ');">';
					html += underline(htmlspecialchars(macro_data['title']));
					html += '</a>';
					break;
				case 'FIGHT_JOIN':
					var onclick;
					if (macro_data['type'] == 'BOT') {
						onclick = "botAttack('" + macro_data['object_id'] + "', '', false, false, null, '" + macro_data['fight_id'] + "')";
					} else if (macro_data['type'] == 'USER') {
						onclick = "userAttack('', '', '" + macro_data['object_id'] + "', '" + macro_data['fight_id'] + "')";
					}
					onclick += '; return false;';
					html = '<a href="#" onClick="'+onclick+'">'+htmlspecialchars(macro_data['title'])+'</a>';
					break;
				case 'CONFIRM':
					var url = macro_data['url'] || '#';
					var js = macro_data['js'] || '';
					var target = macro_data['target'] || '_self';
					html = '<a href="' + url + '" onclick="' + js + '" target="' + target + '">' + htmlspecialchars(macro_data['title']) + '</a>';
					break;
				case 'WORK':
					html = html_money_str(1, 0, 0, macro_data['amount']);
					break;
				case 'LINK':
					html = '<a href="'+macro_data['url']+'" target="_blank" class="'+macro_data['class']+'">'+underline(macro_data['text'])+'</a>';
					break;
				case 'ACH':
					html = '<a target="_blank" class="ach_info_lnk" onclick="showAchievementInfo('+macro_data['id']+'); return false;" href="/achievement_info.php?id='+macro_data['id']+'">'+macro_data['title']+'</a>';
					break;
				case 'NPC':
					html = '<a target="_blank" onclick="showNpcInfo('+macro_data['id']+'); return false;" href="/npc_info.php?npc_id='+macro_data['id']+'">'+macro_data['title']+'</a>';
					break;
				case 'PET_ARTIKUL':
					html = '<img src="'+macro_data['pic']+'" width="13" height="13" border="0" align="absmiddle"> ';
					html += '<a href="#" onClick="showPetInfo('+macro_data['pet_id']+','+macro_data['pet_artikul_id']+'); return false;" style="color:#955C4A;" class="b">'+macro_data['title']+'</a>';
					break;
				case 'INJURY_INFO':
					html = '<img src="'+macro_data['pic']+'" width="10" height="10" border="0" align="absmiddle"> ';
					html += '<a href="#" onClick="showInjuryInfo(\''+macro_data['nick']+'\');return false;" style="color:#339900" class="b">';
					html += macro_data['nick']+' - '+macro_data['label']+'</a>';
					break;
				case 'EFFECT_INFO':
					html = '<img src="'+macro_data['pic']+'" width="10" height="10" border="0" align="absmiddle"> ';
					html += '<a href="#" onClick="showEffectInfo(\''+macro_data['nick']+'\');return false;" style="color:Navy" class="b">';
					html += macro_data['nick']+' - '+macro_data['label']+'</a>';
					break;
				case 'PUNISHMENT_INFO':
					html = '<img src="'+macro_data['pic']+'" width="10" height="10" border="0" align="absmiddle"> ';
					html += '<a href="#" onClick="showPunishmentInfo(\''+macro_data['nick']+'\');return false;" style="color:#BA0000" class="b">';
					html += macro_data['nick']+' - '+macro_data['label']+'</a>';
					break;
				case 'INSTANCE':
					html = '<img src="'+macro_data['pic']+'" width="13" height="13" border="0" align="absmiddle"> ';
					html += '<a href="#" onClick="showInstanceInfo('+macro_data['id']+', '+macro_data['server_id']+');return false;" style="color:#000000;" class="b">'+macro_data['title']+'</a>';
					if (macro_data.score_humans !== undefined && macro_data.score_magmars !== undefined) {
						html += ' (<span style="color:#00437c;" class="b">'+macro_data.score_humans+'</span>:<span style="color:#a30000;" class="b">'+macro_data.score_magmars+'</span>) ';
					}
					break;
				case 'COMPANION':
					html = '<img src="'+macro_data['pic']+'" width="13" height="13" border="0" align="absmiddle"> ';
					html += '<a href="#" style="color:Purple" class="b" onClick="showShadowInfo(\''+macro_data['nick']+'\');return false;">'+macro_data['label']+'</a>';
					break;
				case 'CLAN_BADGE_IMG':
				case 'CLAN_ENERGY_IMG':
                    html = '<img src="' + macro_data['pic'] + '" title="' + macro_data['title'] + '" width=11 height=11 /><span>' + macro_data['num'] + '</span>';
					break;
				case 'GLOBAL_SKILL':
					html = macro_data;
					break;
				case 'TEXT':
					html = macro_data;
					break;
				default:
					html = '';
					break;
			}
		} catch (e) {
			console_log(e);
			html = '';
		}
	}
	var regexp = new RegExp('\\[\\[' + macro_id + '\\]\\]', 'ig');
	return text.replace(regexp, underline(html)+html_add);
}

function get_art_alt(id, win) {
	if (win) {
		if (win.art_alt && win.art_alt[id]) return win.art_alt[id];
		for (var i = 0; i < win.frames.length; ++i) {
			var res = get_art_alt(id, win.frames[i]);
			if (res !== false) return res;
		}
		return false;
	}
	if (art_alt && art_alt[id]) return art_alt[id];
	if (_top().items_alt && _top().items_alt[id]) return _top().items_alt[id];
	return get_art_alt(id, _top().frames['main_frame']);
}

function set_art_alt(id, data, win) {
	if (win) {
		if (win.art_alt) {
			win.art_alt[id] = data;
			return;
		}
		for (var i = 0; i < win.frames.length; ++i) {
			if (win.frames[i].art_alt) {
				win.frames[i].art_alt[id] = data;
				return;
			}
		}
		return;
	}
	if (art_alt) {
		art_alt[id] = data;
		return;
	}
	if (_top().items_alt) {
		_top().items_alt[id] = data;
		return;
	}
	_top().frames['main_frame'].art_alt[id] = data;
}

function loadPuzzle(params) {
	var useCanvas = (params.useCanvas == undefined) ? false : params.useCanvas >= 1;
    var swf_params = [];
    swf_params.push("puzzle=" + params["puzzle"]);
    swf_params.push("matrix=" + params["matrix"]);
    swf_params.push("steps=" + params["steps"]);
    swf_params.push("can_breakopen=" + params["can_breakopen"]);
    swf_params.push("can_purchase=" + params["can_purchase"]);
    swf_params.push("GrPack=/images/swf/treasure_puzzle_graph.swf");
    swf_params.push("locale_file=" + _top().locale_file);
	swf_params.push("width=612");
	swf_params.push("height=500");
	swf_params = swf_params.join('&');
	var html;
	if (useCanvas) {
		html = document.createElement("div");
		if (document.treasurePuzzle) {
			document.treasurePuzzle.destroy();
		}
		document.treasurePuzzle = new canvas.app.CanvasTreasure(swf_params,html);
	} else {
		html = AC_FL_RunContent(
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,60,0',
			'width', '612',
			'height', '500',
			'src', 'images/swf/treasure_puzzle.swf',
			'quality', 'high',
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'align', 'middle',
			'play', 'true',
			'loop', 'true',
			'scale', 'showall',
			'wmode', 'transparent',
			'devicefont', 'false',
			'id', 'WohPlayer',
			'bgcolor', '#ffffff',
			'name', 'WohPlayer',
			'menu', 'true',
			'cancelwrite','true',
			'allowScriptAccess','sameDomain',
			'allowFullScreen','true',
			'movie', 'images/swf/treasure_puzzle.swf',
			'salign', '',
			'flashVars', swf_params
		);		
	}
    var options = {width:612, height:500};
    confirmCenterDiv(html, options);
}

function openPuzzle(action, steps) {
    steps = steps || "";

    switch (action) {
        case "purchase":
        case "solve":
        case "breakopen":
            entry_point_request('puzzlechest', action, {steps: steps}, function(data) {
                if (data && data["error"]) {
                    showMsg2("error.php?error="+encodeURIComponent(data["error"]), "Сообщение");
                } else {
                    confirmCenterDivClose();
                }
            });
            break;
    }
}

function closePuzzle() {
    confirmCenterDivClose();
}
function isChatLoaded() {
	var chat_frame = _top().frames['chat'];
    return chat_frame && chat_frame.LMTS && chat_frame.LMTS.isAuthorized();
}

var REQUEST_STATISTICS = "";
function DUMP_REQUEST_STATISTICS() {
	return REQUEST_STATISTICS;
}

function actionTplClanAllianceInvite(data, empty_set_str) {
    $(document).ready(function(){
        $('select[name="in[clan_id]"]').change(function(){
            var u = $('select[name="in[user_id]"]');
            u.find('option').remove();
            $('#filter').val("");
            var clan_id = $(this).val();
            for(var i in data[clan_id]){
                var member = data[clan_id][i];
				var css =  {color: "gray"};
				if (member.avail > 0) {
					css.color = "#339900";
					if (member.confirm_leader > 0) {
						css.color = "blue";
					}
				}
                u.append($('<option/>').css(css).text(member.nick).val(member.user_id))
            }
        }).change();
        $('#filter').keyup(function(){
            var clan_id = $('select[name="in[clan_id]"]').val();
            var filter_val = $(this).val().toLowerCase();
            var u = $('select[name="in[user_id]"]');
            u.find('option').remove();
            for (var i in data[clan_id]) {
                var user = data[clan_id][i];
                if (!filter_val || user.nick.toLowerCase().split(' [')[0].indexOf(filter_val) !== -1) {
                    u.append($('<option/>').text(user.nick).val(user.user_id))
                }
            }
            if (!u.find('option').length) {
                u.append($('<option/>').text(empty_set_str));
            }
        });
        $('select[name="in[user_id]"]').change(function () {
            var clan_id = $('select[name="in[clan_id]"]').val();
            var user_id = parseInt($(this).val());
            var sbmt_btn = $('input[type="submit"]');
            var avail = false;
            if (clan_id) for (var i in data[clan_id]) {
                var member = data[clan_id][i];
                if (!user_id) break;
                if (member.user_id == user_id) {
                    avail = parseInt(member.avail);
                    break;
                }
            }
            if (!user_id || !clan_id || !avail) {
                sbmt_btn.attr('disabled', 'disabled').parent().parent().addClass('disabled');
            } else {
                sbmt_btn.removeAttr('disabled').parent().parent().removeClass('disabled');
            }
        });
        $('input#filter').keypress(function(e) { if (e.which == 13) e.preventDefault(); })
    });
}

function addSavedAction(data) {
    _top().dwar.saved_actions[data['id']] = data;
}

function removeSavedAction(action_id) {
    delete _top().dwar.saved_actions[action_id];
}

function topDwar(data) {
	if (_top().dwar) {
		for (var i in data) _top().dwar[i] = data[i];
	} else if (_top().dialogArguments && _top().dialogArguments.win && _top().dialogArguments.win.dwar) {
		for (var i in data) _top().dialogArguments.win.dwar[i] = data[i];
	}
}

function toggleSavedAction(actionId) {
    entry_point_request('favorite', 'switch_action', {action_id: actionId}, function (response) {
        if (response.status == 100) {
            gebi('action_save_check').checked = (response.added == 1);
            gebi('action_err').innerHTML = '';
        } else {
            if (response.error) gebi('action_err').innerHTML = response.error + '<br/>';
            gebi('action_save_check').checked = !gebi('action_save_check').checked;
        }
    });
}

function stopAction() {
	$.ajax({
		url: '/entry_point.php',
		data: {
			json_mode_on: true,
			object: 'common',
			action: 'stopaction'
		},
		dataType: 'JSON',
		success: function (objects) {
			_top().chat.chatReceiveObject(objects);
		}
	});
}

/**
* Функция делает объект Event кроссбраузерным
*
* @param object - объект типа Event
* @param object - контекст currentTarget
*
* @return void
*/
function fixEvent(e, _this) {
	e = e || window.event;

	var docElem = document.documentElement,
		body = document.body;

	if (!e.currentTarget) e.currentTarget = _this;
	if (!e.target) e.target = e.srcElement;

	if (!e.relatedTarget) {
		if (e.type === 'mouseover') e.relatedTarget = e.fromElement;
		if (e.type === 'mouseout') e.relatedTarget = e.toElement;
	}

	if (!e.pageX && e.clientX) {
		e.pageX = e.clientX + (docElem.scrollLeft || body && body.scrollLeft || 0);
		e.pageX -= docElem.clientLeft || 0;

		e.pageY = e.clientY + (docElem.scrollTop || body && body.scrollTop || 0);
		e.pageY -= docElem.clientTop || 0;
	}

	if (!e.which && e.button) {
		e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0));
	}

	return e;
}

/**
* Функция получает сдвиг элемента, который расположен во
* фрейме, относительно области просмотра (без учёта скролла)
*
* @return object
*/
function getIframeShift() {
	var currentWindow = window,
		currentFrame = null,

		docElem = null,
		body = null,

		top = 0,
		left = 0,

		scrollTop = 0,
		scrollLeft = 0;

	while (currentFrame = currentWindow.frameElement) {
		currentWindow = currentWindow.parent;

		top += Math.round(currentFrame.getBoundingClientRect().top);
		left += Math.round(currentFrame.getBoundingClientRect().left);
	}

	return {
		top: top,
		left: left
	};
}
var advanced_controllers = {
    'clan|building_action': ['building_type_id', 'building_action'],
    'estate|building': ['type_id', 'building_action']
};
var DATA_OK = 100;
function session_update_init(ttl) {
	if (!ttl) return false;
	setInterval(function() {
		entry_point_request('common', 'dummy');
	}, ttl * 0.3 * 1000); //90sec
	return true;
}

function entry_point_request(object, action, params, callback, error_callback) {
    params = params || {};
    params = $.extend({
        json_mode_on: 1,
        object: object,
        action: action
    }, params);

    var send_data = {
        url: '/entry_point.php?object='+object+'&action='+action+'&json_mode_on=1',
        dataType: 'json', cache: false, type: "POST"
    };
    if (params.ajaxParam) {
        send_data = $.extend(send_data, params.ajaxParam);
        delete params.ajaxParam;
    }

    send_data.data = params;

    return $.ajax(send_data)
	.done(function(data) {
		var key = object + '|' + action;
		if (advanced_controllers[key]) {
			var key_vals = advanced_controllers[key];
			for (var i in key_vals) key += '|'+params[key_vals[i]];
		}
		var action_data = data[key] || data;
		if (callback instanceof Function) {
			callback.call(this, action_data, data);
		}
		
		if (_top().chat && _top().chat.chatReceiveObject) {
			_top().chat.chatReceiveObject(data);
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown) {
		if (error_callback instanceof Function) {
			error_callback.call(this, textStatus);
		}
	});
}

function single_top_redirect(url) {
	if (!_top().already_redirected) {
		_top().already_redirected = true;
		_top().location.href = url;
	}
}

function is_touch_device() {
	return (('ontouchstart' in window)
		|| (navigator.MaxTouchPoints > 0)
		|| (navigator.msMaxTouchPoints > 0));
}

function chaoticConfirm(chaoticId) {
	entry_point_request('battleground', 'chaotic_confirm', {chaotic_id: chaoticId}, function(response) {
		if (response['status'] != 100) {
			showError(response['error']);
		} else {
			_top().frames["main_frame"].frames["main"].location.href = 'area.php';
		}
	});
}

function getScrollMaxY(win) {
	var innerh;
	if (win.innerHeight){
		innerh = win.innerHeight;
	} else {
		innerh = win.document.body.clientHeight;
	}

	if (win.innerHeight && win.scrollMaxY){
		// Firefox
		yWithScroll = win.innerHeight + win.scrollMaxY;
	} else if (win.document.body.scrollHeight > win.document.body.offsetHeight){
		// all but Explorer Mac
		yWithScroll = win.document.body.scrollHeight;
	} else {
		// works in Explorer 6 Strict, Mozilla (not FF) and Safari
		yWithScroll = win.document.body.offsetHeight;
	}
	return yWithScroll - innerh;
}

function openMap() {
	var top = _top();
	if (top.js_popup) {
		tProcessMenu('b06', {url: 'world_map.php', force: true});
		tUnsetFrame('main');
	} else {
		top.opened_windows = top.opened_windows || {};
		top.opened_windows['world_map'] = window.open("world_map.php", "world_map", "location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
	}
}

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
	Object.keys = (function () {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

// birthday window
function initBirthdayWindow(useCanvas) {
	var lastUserId = parseInt($.jStorage.get('birthdayWindowLastUser', 0), 10);
	if (lastUserId > 0) {
		if (useCanvas) {
			loadBirthdayWindowCanvas(lastUserId);
		} else {
			loadBirthdayWindowFlash(lastUserId);
		}
		// посе загрузки окна, сбросим последнего выбранного пользователя
		$.jStorage.set('birthdayWindowLastUser', 0);
	}
}

function loadBirthdayWindowFlash(lastUserId) {
	loadBirthdayWindow(lastUserId,false);
}

function loadBirthdayWindowCanvas(lastUserId) {
	loadBirthdayWindow(lastUserId,true);
}

function loadBirthdayWindow(lastUserId,useCanvas) {
	var swf_params = [];
	lastUserId = lastUserId || 0;

	swf_params.push("userId=" + lastUserId);
	swf_params.push("GrPack=images/swf/birthday_graph.swf?ux=");
	swf_params.push("preloaderLink=images/swf/preloader.swf?ux=");
	swf_params.push("commonGraph=images/swf/common_graph.swf?ux=");
	swf_params.push("packsURL=images/swf/packs_sh/");
	var html;
	if (useCanvas) {
			var par = swf_params.join('&') + "&width=720&height=444";
			html = document.createElement("div");
			new canvas.app.CanvasBirthday(swf_params.join('&') + "&width=720&height=444",html);
	} else {
		html = AC_FL_RunContent(
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,60,0',
			'width', '720',
			'height', '444',
			'src', 'images/swf/birthday.swf',
			'quality', 'high',
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'align', 'middle',
			'play', 'true',
			'loop', 'true',
			'scale', 'showall',
			'wmode', 'transparent',
			'devicefont', 'false',
			'id', 'WohPlayer',
			'bgcolor', '#ffffff',
			'name', 'WohPlayer',
			'menu', 'true',
			'cancelwrite','true',
			'allowScriptAccess','sameDomain',
			'allowFullScreen','true',
			'movie', 'images/swf/birthday.swf',
			'salign', '',
			'flashVars', swf_params.join('&')
		);
	}

	var options = {width:720, height: 444};

	confirmCenterDiv(html, options);
}

function closeBirthdayWindow(userId) {
	userId = userId || 0;
	$.jStorage.set('birthdayWindowLastUser', userId);
	confirmCenterDivClose();
}

/**
 * open premium store location
 */
function openPremiumStore(category) {
	category = category || '';
	
	var opt = {};
	switch (category) {
		case "gifts":
			opt.premium_add_url = "category_id=19";
			break;
	}
	
	tProcessMenu('premium_store', opt);
}

function sortTable(table, colIndex, sortType, reverse) {
	var tbody = table.tBodies[0],
		tr = Array.prototype.slice.call(tbody.rows, 0),
		i;

	reverse = parseInt(reverse) || 1;

	switch (sortType) {
		case 'string':
			tr = tr.sort(function(a, b) {
				return reverse * a.cells[colIndex].getAttribute('data-sort').localeCompare(b.cells[colIndex].getAttribute('data-sort'));
			});

			break;

		default: /* sort as number */
			tr = tr.sort(function(a, b) {
				return reverse * (parseFloat(a.cells[colIndex].getAttribute('data-sort')) - parseFloat(b.cells[colIndex].getAttribute('data-sort')));
			});
	}

	for (i = 0; i < tr.length; i++) {
		tbody.appendChild(tr[i]);
	}
}

function setTransformImage(select) {
	var selectedOption = select.options[select.selectedIndex],

		slotBefore = $('span[data-slot="transformBefore"]')[0],
		slotAfter = $('span[data-slot="transformAfter"]')[0],

		innerSlotBefore = slotBefore.firstChild,
		innerSlotAfter = slotAfter.firstChild,

		slotEnchantFrame = selectedOption.getAttribute('data-enchant3'),
		slotEnchant = selectedOption.getAttribute('data-enchant-class'),

		itemBefore,
		itemAfter;

	innerSlotBefore.innerHTML = '';
	innerSlotBefore.setAttribute('div_id', '');
	innerSlotBefore.style.backgroundImage = 'none';
	innerSlotBefore.onmouseover = function(e) {};
	innerSlotBefore.onmouseout = function(e) {};

	innerSlotAfter.setAttribute('div_id', '');
	innerSlotAfter.style.backgroundImage = 'none';
	innerSlotAfter.onmouseover = function(e) {};
	innerSlotAfter.onmouseout = function(e) {};

	if (art_alt) {
		itemBefore = art_alt['AA_' + selectedOption.value];
		itemAfter = art_alt['AA_' + selectedOption.getAttribute('data-transform-artikul')];

		if (itemBefore) {
			innerSlotBefore.setAttribute('div_id', itemBefore.artifact_alt_id);
			innerSlotBefore.style.backgroundImage = 'url(' + itemBefore.image + ')';
			innerSlotBefore.onmouseover = function(e) {
				artifactAlt(this, e, 2);
			};
			innerSlotBefore.onmouseout = function(e) {
				artifactAlt(this, e, 0);
			};

			if (slotEnchantFrame) {
				innerSlotBefore.innerHTML += '<span class="artifact-slot__enchant enchant-oprava"></span>';
			}

			if (slotEnchant) {
				innerSlotBefore.innerHTML += '<span class="artifact-slot__enchant ' + slotEnchant + '"></span>';
			}
		}

		if (itemAfter) {
			innerSlotAfter.setAttribute('div_id', itemAfter.artifact_alt_id);
			innerSlotAfter.style.backgroundImage = 'url(' + itemAfter.image + ')';
			innerSlotAfter.onmouseover = function(e) {
				artifactAlt(this, e, 2);
			};
			innerSlotAfter.onmouseout = function(e) {
				artifactAlt(this, e, 0);
			};
		}
	}
}

function gui_styled(input, textarea) {
	input = input || false;
	textarea = textarea || false;

	if (input) {
		var w = '';
		
		$('.' + input).each(function() {
			if ($(this).attr('width')) {
				w = $(this).attr('width');
			} else {
				w = '';
			}

			$(this).wrap('<div class="ff__input-wrap" style="width: ' + w + '"><div class="ff__input-wrap-inner"><div class="ff__input-wrap-input"></div></div></div>');
		})
	}

	if (textarea) {
		var w = '';
		
		$('.' + textarea).each(function() {
			if ($(this).attr('width')) {
				w = $(this).attr('width');
			} else {
				w = '';
			}

			$(this).wrap('<div class="textarea-styled" style="width: ' + w + '"></div>');
		})
	}
	
	$('.textarea-styled').append('<div class="textarea-styled__right-top"></div><div class="textarea-styled__right-bottom"></div><div class="textarea-styled__left-bottom"></div><div class="textarea-styled__left-top"></div><div class="textarea-styled__top"></div><div class="textarea-styled__right"></div><div class="textarea-styled__bottom"></div><div class="textarea-styled__left"></div>');

	$('.ff__input-wrap')
		.on('mouseenter', function() {
			$(this).addClass('hover');
		})
		.on('mouseleave', function() {
			$(this).removeClass('hover');
		})
		.on('click', function() {
			$(this).children('input').focus();
		});

	$('.ff__input-wrap input')
		.on('focus', function() {
			$(this).parents('.ff__input-wrap').addClass('focus');
		})
		.on('blur', function() {
			$(this).parents('.ff__input-wrap').removeClass('focus');
		});

	$('.textarea-styled')
		.on('mouseenter', function() {
			$(this).addClass('hover');
		})
		.on('mouseleave', function() {
			$(this).removeClass('hover');
		});

	$('.textarea-styled textarea')
		.on('focus', function() {
			$(this).parents('.textarea-styled').addClass('focus');
		})
		.on('blur', function() {
			$(this).parents('.textarea-styled').removeClass('focus');
		});
}

function startPuzzle(params) {
	var useCanvas = (params.useCanvas == undefined) ? false : params.useCanvas >= 1;
	var swf_params = [];
	swf_params.push("pictureURI=" + params["pictureURI"]);
	swf_params.push("segmentsOnSide=" + params["segmentsOnSide"]);
	swf_params.push("quickStart=" + params["quickStart"]);
	swf_params.push("locale_file=" + _top().locale_file);

	var html;
	if (useCanvas) {
		html = document.createElement("div");
		if (document.puzzle) {
			document.puzzle.destroy();
		}
		document.puzzle = new canvas.app.CanvasPuzzle(params,html);
	} else {
		html = AC_FL_RunContent(
			'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,60,0',
			'width', params['width'],
			'height', params['height'],
			'src', 'images/swf/puzzle.swf',
			'quality', 'high',
			'pluginspage', 'http://www.macromedia.com/go/getflashplayer',
			'align', 'middle',
			'play', 'true',
			'loop', 'true',
			'scale', 'showall',
			'wmode', 'transparent',
			'devicefont', 'false',
			'id', 'WohPlayer',
			'bgcolor', '#ffffff',
			'name', 'WohPlayer',
			'menu', 'true',
			'cancelwrite','true',
			'allowScriptAccess','sameDomain',
			'allowFullScreen','true',
			'movie', 'images/swf/puzzle.swf',
			'salign', '',
			'flashVars', swf_params.join('&')
		);
	}

	var options = {width:params['width'], height:params['height']};

	confirmCenterDiv(html, options);
}

document.addEventListener("keyup",itemsRight);
document.addEventListener("keydown",keyDownHandler);

function itemsRight(e) {
	var input = $(e.target).attr('contentEditable');
	switch (e.target.tagName) {
		case 'INPUT': 
		case 'TEXTAREA': 
			input = true;
			break;
	}
	if (!input) {
		if (e.shiftKey || e.ctrlKey || e.altKey) {	
			var swf = getSWF('items_right');
			if (swf && swf.externalKey) swf.externalKey({shiftKey : e.shiftKey, ctrlKey : e.ctrlKey, altKey : e.altKey, keyCode : e.keyCode, code : e.code});
		}
	}
}

function keyDownHandler(e) {
	var input = $(e.target).attr('contentEditable');
	switch (e.target.tagName) {
		case 'INPUT': 
		case 'TEXTAREA': 
			input = true;
			break;
	}
	if (!input) {
		var swf = getSWF('game');
		if (swf && swf.externalKey) swf.externalKey(e);
	}
}

function canvasIsSupported() {
    var result = /Chrome\/(\d+)/.exec(navigator.userAgent);
    if (result && result[1] && parseInt(result[1]) < 30) {
      return false;
    }
    return true;
}

function jailExit() {
	if (window.jailExitStarted) return;
	window.jailExitStarted = true;
	entry_point_request('common', 'jailExit', {}, function(response){
		if (response['status'] != DATA_OK && response['error']) {
			showError(response['error']);
			window.jailExitStarted = false;
		} else {
			location.reload();
		}
	});	
}

function copyToClipboard(str) {
	const el = document.createElement('textarea');
	el.value = str;
	el.setAttribute('readonly', '');
	el.style.position = 'absolute';
	el.style.left = '-9999px';
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

function openPremium() {
	tProcessMenu("b36",  {url: '/area_banks.php?mode=premium'});
}

function openLocator() {
	window.open('/friend_list.php?mode=located', "", "width=920,height=700,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
	
}

function isWebGLSupported() {
    var contextOptions = { stencil: true, failIfMajorPerformanceCaveat: true };
    try {
        if (!window.WebGLRenderingContext) {
            return false;
        }
        var canvas = document.createElement('canvas');
        var gl = canvas.getContext('webgl', contextOptions) || canvas.getContext('experimental-webgl', contextOptions);
        var success = !!(gl && gl.getContextAttributes().stencil);
        if (gl) {
            var loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
                loseContext.loseContext();
            }
        }
        gl = null;
        return success;
    } catch (e) {
        return false;
    }
}

function redButtonClickConfirm(title, text) {
	_top().systemConfirm(title, text, false, function () {
		redButtonClick();
	});
}

function redButtonClick() {
	entry_point_request('user', 'redbutton_click', {}, function (action_data, raw_data) {
		if (action_data['redirect_url']) {
			var url = decodeURIComponent(action_data['redirect_url']);
			if (url) window.open(url,"_blank");
		} else if (action_data['error']) {
			showError(action_data['error']);
		}
	});
}

var oauth = (function() {
	var self = function(result, state) {
			var callback = callbacks[state];
			if (callback) {
				delete callbacks[state];
				return callback(result);
			}
		},
		callbacks  = [];

	function hash(len) {
		var arr = new Uint8Array(len / 2);
		window.crypto.getRandomValues(arr);
		return Array.prototype.map.call(arr, function(dec) { return ('0' + dec.toString(16)).slice(-2); }).join('');
	}
	self.redirect = function(opener, redirect_url) {
		var state = hash(40);
		setCookie('oauth_state_' + state, redirect_url, new Date((new Date().getTime() + 600000)), '/', location.hostname, true);
		return [opener, state].join(':');
	}
	self.callback = function(opener, callback) {
		var state = hash(40);
		callbacks[state] = callback;
		return [opener, state].join(':');
	}
	return self;
})();
