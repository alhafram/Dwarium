// @ts-nocheck
// cht.js

var debugLog = function(str, lock) { }

function removeItems(array, elements) {
    for(var element of elements) {
        var index = array.indexOf(element)
        if(index != -1) {
            array.splice(index, 1)
        }
    }
    return array
}

var chatButtonState = {};
var chatButtons = {
	'party_btn'  : [CHAT.locale_path+'images/chat_btn/partyman-inact.gif', CHAT.locale_path+'images/chat_btn/partyman-act.gif', CHAT.locale_path+'images/chat_btn/partyman-wrt.gif', CHAT.locale_path+'images/chat_btn/partyman-wrt.gif'],
	'send_btn': ['images/chat_btn/send-reg.gif', 'images/chat_btn/send-roll.gif', 'images/chat_btn/send-pressed.gif'],
	'clear_btn': ['images/chat_btn/clear-reg.gif', 'images/chat_btn/clear-roll.gif', 'images/chat_btn/clear-pressed.gif'],
	'smile_btn': ['images/chat_btn/smile-reg.gif', 'images/chat_btn/smile-roll.gif', 'images/chat_btn/smile-pressed.gif'],
	'priv_btn': ['images/chat_btn/priv-reg.gif', 'images/chat_btn/priv-roll.gif', 'images/chat_btn/priv-pressed.gif', 'images/chat_btn/priv-pressed-on.gif'],
	'refresh_btn': ['images/chat_btn/refresh-reg.gif', 'images/chat_btn/refresh-roll.gif', 'images/chat_btn/refresh-pressed.gif']
};

for (let i in chatButtons) {
	for (let j in chatButtons[i]) {
		preloadImages(chatButtons[i][j]);
	}
}

preloadImages(
	'images/cht-btn-left.png',
	'images/cht-btn-center.png',
	'images/cht-btn-right.png',
	'images/cht-btn-left-act.png',
	'images/cht-btn-center-act.png',
	'images/cht-btn-right-act.png'
);

function chatSetButtonHandlers() {
	for (i in chatButtons) {
		let obj = gebi(i);
		if (!obj) continue;
		obj.onmouseout = function() {
			this.src = !chatButtonState[this.id] ? chatButtons[this.id][0]: chatButtons[this.id][3];
		};
		obj.onmouseover = function() {
			this.src = !chatButtonState[this.id] ? chatButtons[this.id][1]: chatButtons[this.id][3];
		};
		obj.onmousedown = function() {
			this.src = !chatButtonState[this.id] ? chatButtons[this.id][2]: chatButtons[this.id][3];
		};
		obj.onmouseup = function() {
			if (chatButtons[this.id][3]) {
				chatButtonState[this.id] = !chatButtonState[this.id];
				this.title = chatButtonState[this.id] ?
					 this.getAttribute('title2') || this.title :
					 this.getAttribute('title1') || this.title ;
			}
			this.src = !chatButtonState[this.id] ? chatButtons[this.id][1]: chatButtons[this.id][3];
		};
	}
};

var chatAvailChannels = 0;

var indx = null; // preset index

var chatRefreshRate = 10;
var chatUrl = '/cht_data.php';

var chatUserHtml = '';
var chatUserCount = 0;
var chatUserEnemyCount = 0;

var chatSendBlock = false;
var chatFightlog = false;

var last_fight_id = 0;

var timer = 0;

var msie7 = $.browser.msie && parseInt($.browser.version, 10) <= 7;

function chatClearMsg(msg_sent) {
	gebi('message').value = '';
	!msg_sent && chat_message_blur();
}

function chatClearText() {
	var $message = $('#message');
	if ($message.val().length && $message.val() != $message.data('dummy-text')) {
		chatClearMsg();
		return;
	}
	chatOpts[indx].data.html("");
};

function chatAddToMsg(msg, atStart, checkExists) {
	var obj = gebi('message');
	obj.focus();
	if (!msg) return;
	chat_message_focus();
	var msgOld = obj.value;
	if (checkExists && obj.value.indexOf(msg) !== -1) {
		if (checkExists instanceof Function) {
			obj.value = obj.value.replace(msg, '');
			checkExists();
		}
		return;
	}
	if (atStart) {
		return obj.value = msg+msgOld;
	}
	var cursorPosition = $(obj).getCursorPosition();
	var startPart = msgOld.substring(0, cursorPosition);
	var endPart = msgOld.substring(cursorPosition);
	obj.value = startPart+msg+endPart;
	$(obj).setCursorPosition((startPart + msg).length);
};

function chatReplaceFromMsg(/* arguments */) {
	var obj = gebi('message');
	for (var i = 0; i < arguments.length; ++i) {
		var msg = arguments[i];
		obj.value = obj.value.replace(msg, '');
	}
};

function chatPrvTag(nick) {
	if (!nick) return;
	chatReplaceFromMsg('to['+nick+'] ');
	chatAddToMsg('prv['+nick+'] ', true, function() { chatToTag(nick); });
};

function chatToTag(nick) {
	if (!nick) return;
	chatReplaceFromMsg('prv['+nick+'] ');
	chatAddToMsg('to['+nick+'] ', true, function() { chatPrvTag(nick); });
};

// submit the hidden form
function chatRequestData(msg, channelTalk, complain, crc, complain_nick, stime, report) {
	if (!chatOpts[indx]) return false;
	var data = {
		'msg_text': msg || '',
		'channel_talk': (channelTalk || chatOpts[indx]['channelTalk']),
		'loc_id': chatLocId,
		'private': chatButtonState['priv_btn'] ? 1 : 0,
		'complain': complain || '',
		'complain_nick': complain_nick || '',
		'crc': crc || CHAT.session_crc,
		'stime': stime || 0,
		'report': {
			'id': (report && report.id ? report.id : 0),
			'action': (report && report.action ? report.action : 0),
			'crc': (report && report.crc ? report.crc : 0),
			'message': report && report.msg ? {
				'type': report.msg.type,
				'user_id': report.msg.user_id,
				'msg_text': report.msg.msg_text,
				'macros_list': report.msg.macros_list,
				'msg_color': report.msg.msg_color,
				'is_mobile': report.msg.is_mobile,
				'to_user_ids': report.msg.to_user_ids,
				'channel': report.msg.channel,
				'stime': report.msg.stime
			} : {}
		}
	};
	
	entry_point_request('chat', 'send', data, function(response){
		if (response.status == DATA_OK ) {
			if (response.chat_add_to_msg) {
				chatAddToMsg(response.chat_add_to_msg);
			}
			if (response.force_reload_users) {
				chatRefreshUsers(true);
			}
		} else if (response.error) {
			showError(response.error)
		}
	});
	return true;
}

var LMTS = false;
var lastMsg = '';
var lastMsgTime = time_current();
var lastMsgMaxTimeDiff = 120; // secs
var reconnection_counter = 0;
var reconnecting = false;

function chatSysMsg(text) {
	if (lastMsg == text) return null;
	
	var all_channels = 0;
	for (var i in chatOpts) {
		all_channels |= chatOpts[i].channel;
	}
	var res = chatReceiveMessage({
		type: msg_type.system,
		urgent: true,
		msg_text: text,
		channel: all_channels, 
		stime: current_server_time()
	});
	lastMsg = text;
	return res;
}

function chatConnectionChecker() {
	if (!lastMsgTime || !LMTS || reconnecting) return false;
	if (time_current() - lastMsgTime > lastMsgMaxTimeDiff) {
		chatTotalReconnect();
		return true;
	}
	return false;
}

setInterval(chatConnectionChecker, 1000);

function chatTotalReconnect() {
	if (reconnecting || !LMTS) return false;
	if (!LMTS.ever_authorized() && time_current() - lastMsgTime <= lastMsgMaxTimeDiff) return false;
	++reconnection_counter;
	if (reconnection_counter > 5) {
		var text = CHAT.str.not_available;
		if (lastMsg != text) {
			chatSysMsg(text);
			$('#lmts_swfs').html('');
			LMTS = false;
		}
		return false;
	}
	reconnecting = true;
	return $.ajax({
		url: chatUrl,
		data: {
			login: 1
		},
		dataType: 'json',
		success: function(data) {
			if (data) {
				var lmts_swfs = $('#lmts_swfs');
				lmts_swfs.find('script').remove();
				lmts_swfs.html(lmts_swfs.html());
				CHAT.conf = data;
				checkLmtsProxyReady();
			} else {
				lastMsgTime = time_current();
				LMTS.reset_auth();
			}
			reconnecting = false;
		},
		error: function() {
			lastMsgTime = time_current();
			LMTS.reset_auth();
			reconnecting = false;
		}
	});
};

function chat_check_links(msg_text) {
	var link_regexp = new RegExp(CHAT.search_link_regexp); 
	if (!link_regexp.test(msg_text)) return true;
	var matches = msg_text.match(link_regexp);
	var domain_regexp = new RegExp(CHAT.valid_domains);
	for (var i = 0; i < matches.length; i++) {
		if (matches[i] && !domain_regexp.test(matches[i]))
			return false;
	}
	return true;
}

function chatSendMessage(msg) {
	var chat = chatOpts[indx];
	if (!LMTS || !msg) return false;

	if (msg == $('#message').data('dummy-text')) {
		return false;
	}

	if (!LMTS.isAuthorized()) {
		chatSysMsg(CHAT.str.not_connected);
		return false;
	}

	var channelTalk = chat.channelTalk;
	if (!(channelTalk & chatAvailChannels) && msg.substring(0,4) != 'prv[') {
		chatSysMsg(CHAT.str.no_channels);
		return false;
	}

	if (chatSendBlock) {
		chatSysMsg(CHAT.str.block_time.replace('%s', chat.block_interval));
		return false;
	}
	timer = chatRefreshRate;
	
	if (!chat_check_links(msg)) {
		showError(CHAT.str.links_error_msg);
		return false;
	}
	
	chatRequestData(msg);
	lastMsg = msg;
	if (!CHAT.admin && chat.block_interval) {
		chatSendBlock = true;
		setTimeout('chatSendBlock=false', chat.block_interval * 1000);
	}
	return true;
}

function chatSend() {
	var msg = gebi('message').value;
	if (!chatOpts[indx]) return false;
	gebi('message').focus();
	if (chatSendMessage(msg)){
		chatClearMsg(true);
		return true;
	}else{
		return false;
	}
}

function chatRefreshUsers(force) {
	if (!$chat_user_list) return false;
	if ($chat_user_list.find('li.area.selected').length && !force) {
		var frame = chat_get_users_frame();
		if (!frame) {
			setTimeout(chatRefreshUsers, 500);
			return false;
		}
		if ($('#chat_users_list .list_denied', frame).length) return false;
	}
	document.forms['chat_hidden_form'].action = chatUrl;
	document.forms['chat_hidden_form'].elements['user_type'].value = $chat_user_list.find('li.selected').data('type');
	document.forms['chat_hidden_form'].submit();
	return true;
}

function chatToggleChBtnStyle(name, f) {
	gebi(name+'_A').className = f ? 'tbl-main_chatchng-link': 'tbl-main_chatchng-link_inact';
	gebi(name+'_TD').className = f ? 'tbl-main_chatchng-act-c': 'tbl-main_chatchng-ina-c';
	gebi(name+'_IMGL').src = f ? 'images/cht-btn-left-act.png': 'images/cht-btn-left.png';
	gebi(name+'_IMGR').src = f ? 'images/cht-btn-right-act.png': 'images/cht-btn-right.png';
}

function chatChangePreset(i) {
	localStorage.selectedTab = i
	if (i == indx) return;
	indx = i;
	if (!chatOpts[indx]) return;
	for (var i in channel_list) {
		var $el = channel_list[i];
		if ($el.hasClass('selected')) $el.removeClass('selected');
		if ($el.data('channel') == indx) $el.addClass('selected');
	}
	chatUpdateDataAttach();
}

function chatUpdateDataAttach() {
	var obj = null;
	if (!_top().frames['chat'] || !_top().frames['chat'].frames['chat_text']) return false;
	if (_top().frames['chat'].frames['chat_text'].document) obj = _top().frames['chat'].frames['chat_text'].document.getElementById('content');
	if (!obj) {// No frame
		setTimeout(chatUpdateDataAttach, 1000);
		return false;
	}

	if (msie7) {
		obj.innerHTML = chatOpts[indx].data.html();
		return false;
	}

	obj = $(obj);
	obj.children().detach();
	chatOpts[indx].data.appendTo(obj);
	chatScrollToBottom();
	return true;
}

function chatActivateParty(settings, if_opened, leader_id) {

	if(leader_id) {
		controller_party_conf({'party|conf':{'is_party_leader': leader_id == CHAT.my_id}});
	}

	var url = 'party_iframe.php?mode=members';
	if (settings) {
		url = 'party_iframe.php?mode=settings';
	}
	var iframe = gebi('user_list');
	if (!iframe) return;
	if (if_opened && iframe.src.indexOf(url) === -1) {
		return;
	}
	$chat_user_list && $chat_user_list.find('> li').removeClass('selected').filter('.party').addClass('selected');
	iframe.src = url;
	if (settings) {
		cht_btn_select('party_settings');
	} else {
		cht_btn_select('party_members');
	}
}

function chatActivateNonparty() {
	var iframe = gebi('user_list');
	if (!iframe) return;
	var url = 'cht_iframe.php?mode=user';
	if (iframe.src.search(url) !== -1) {
		chatRefreshUsers();
	} else {
		iframe.src = url;
	}
	cht_btn_select('');
}

function exlog() {
	if (_top().js_popup) {
		tProcessMenu('b06', {url: '/fight_info.php?fight_id=' + last_fight_id, force: true});
		tUnsetFrame('main');
	} else {
		window.open('/fight_info.php?fight_id=' + last_fight_id);
	}
}
var fightLogWidth = $.jStorage.get('fightLogWidth') || 300;

function setFightLogWidth(value) {
	if (value) {
		fightLogWidth = value;
		$.jStorage.set('fightLogWidth',value);
	}
}

function chatToggleFightlog(f, fight_id) {
	if (fight_id) {
		last_fight_id = fight_id;
	} else {
		last_fight_id = _top().__lastFightId;
	}
	chatFightlog = (f != undefined ? f: !chatFightlog);
	chatToggleChBtnStyle('fightlog_but',chatFightlog);
	gebi('fightexlog').style.display = chatFightlog && last_fight_id ? '': 'none';
	//gebi('fightlog').style.display = chatFightlog ? '': 'none';
	if (_top().frames['chat'].frames['chat_text'].setBattleLogEnabled) {
		_top().frames['chat'].frames['chat_text'].setBattleLogEnabled(chatFightlog);
	}
	if (chatFightlog){
		gebi('fightlog').style.overflow = "";
		gebi('fightlog').style.width = fightLogWidth;
	}
	else{
		gebi('fightlog').style.overflow = "hidden";
		gebi('fightlog').style.width = "1px";
	}

	chatScrollToBottom();
}

// Ignore
var IGNORED=CHAT.ignored;

function chatIgnoreActionLabel(name) {
	return IGNORED[name] ? CHAT.str.stop_ignore : CHAT.str.start_ignore;
}
function chatToggleIgnore(name){
	IGNORED[name] = !IGNORED[name];
}
function chatSyncIgnore(name, status){
	IGNORED[name] = status;
}
function chatIgnoreRe(){
	var re = '';
	for(var i in IGNORED) {
		if (IGNORED[i]) {
			re += '|' + i;
		}
	}
	return re.substring(1);
};

var chat_code = CHAT.chat_code;

function restoreChatMessages() {
	chatScrollToBottom();
};

var min_msg_id = -65536;
var next_msg_id = min_msg_id;
var msg_max = 100;
function chatReceiveMessage(msg) {
	if (msg["object"] && !msg["object"]["chat|message"]) {
		chatReceiveObject(msg["object"]);
		return;
	}
	try{ msg = msg["object"] ? msg["object"]["chat|message"]["message"]["msg"] : msg; } catch(e){}
	if (!msg || msg.to_admin && !CHAT.admin) return;
	if (msg.delay) {
		var delay = 0;
		if (msg.type == msg_type.broadcast) {
			delay = _top().myId % 600;
		} else {
			delay = parseInt(msg.delay);
			if (isNaN(delay)) delay = 0;
		}
		delete msg.delay;
		setTimeout(function () {
			chatReceiveMessage(msg);
		}, delay * 1000);
		return false;
	}
	if (!chat_check_chat_text_ready(function() {chatReceiveMessage(msg);})) return false;
	msg.type = msg.type || msg_type.def;
	msg.id = ++next_msg_id;
	var originalMsgObject = jQuery.extend(true, {}, msg);
	lastMsgTime = time_current();
	reconnection_counter = 0;

	var scrollCurrent = _top().frames['chat'].frames['chat_text'].scrollY ? _top().frames['chat'].frames['chat_text'].scrollY : _top().frames['chat'].frames['chat_text'].document.body.scrollTop;
	var scrollMax = getScrollMaxY(_top().frames['chat'].frames['chat_text']);

	var mymsg = (msg.channel == channels.user || msg.user_id == session.id || (msg.to_user_ids && (msg.to_user_ids[session.id])));
	if (session.no_sys_msg && msg.type != msg_type.def && !msg.urgent && !mymsg && msg.type != msg_type.special && !msg.chaotic_request)
		return;
	if (msg.user_level_start > 0 && session.level && session.level < msg.user_level_start)
		return false;
	if (msg.user_level_end > 0 && session.level && session.level > msg.user_level_end)
		return false;
    if (msg.user_not_xserver && session.xserver)
        return false;
	if (parseInt(msg.no_premium) && parseInt(session.premium)) {
		return false;
	}
	if (parseInt(msg.chaotic_request) && parseInt(session.no_chaotic_request_msg)) {
		return false;
	}
    if (parseInt(msg.wheel_msg) && parseInt(session.wf_msg_ok)) {
        return false;
    }

	var can_hidden_view = msg.user_id == CHAT.my_id || CHAT.mentor || CHAT.admin;
	if (msg.hidden && !can_hidden_view)
		return false;

	var no_fight_id = parseInt(msg.no_fight_id);
	if (no_fight_id && (no_fight_id == parseInt(session.fight_id))) {
		return false;
	}
	if (msg.no_area_ids && msg.no_area_ids[session.loc_id]) {
		return false;
	}
	if (msg.event_id && msg.event_notify && !CHAT.track_events[msg.event_id]) {
		return false;
	}
	if (session.deaf && msg.type == msg_type.def)
		return false;

	for (var i in chatOpts) {
		var data = chatOpts[i].data;
		if (data.children().length == msg_max) {
			$(data.children()[0]).remove();
		}
	}

	if (msg.translate) {
		msg.msg_text = msg.translate[session.lang]['text'];
		msg.macros_list = msg.translate[session.lang]['macros_list'];
		if (!msg.msg_text && 'en' in msg.translate) {
			msg.msg_text = msg.translate.en.text;
			msg.macros_list = msg.translate.en.macros_list;
		}
		if (!msg.msg_text && 'ru' in msg.translate) {
			msg.msg_text = msg.translate.ru.text;
			msg.macros_list = msg.translate.ru.macros_list;
		}
		delete msg.translate;
	}
	
	if (msg.macros_list && msg.msg_text) {
		for (var macro_id in msg.macros_list) {
			msg.msg_text = common_macro_resolve(macro_id, msg.macros_list[macro_id].name, msg.macros_list[macro_id].data, msg.msg_text);
		}
	}
	
	// Dwarium - Message
	top?.document.dispatchEvent(new CustomEvent('Message', {
		detail: msg
	}))

	var msg_dom = null;
	var client_text = msg.msg_text;
	if (msg.type == msg_type.special) {
		switch(msg.code) {
			case chat_code.reset:
				parent.timer = 180;
				var txt = CHAT.str.restarting;
				txt = txt.replace('%s', '3 '+CHAT.str.minutes);
				msg_dom = $(txt);
				for (var i in chatOpts) {
					chatOpts[i].data.append(msg_dom);
				}
				return false;
			case chat_code.redirect:
				try {
					_top().frames.main_frame.frames.main[msg.param && msg.param.flag ? msg.param.flag : 'document'].location.href=msg.param.url;
				} catch(e) {};
				return false;
			case chat_code.title:
				try {
					_top().document.title = msg.param.msg_text;
				} catch(e) {};
				return false;
			case chat_code.calljs:
				msg.param.func = base64_decode(msg.param.func);
				try {
					eval('_top().frames.main_frame.frames.main.' + msg.param.func);
				} catch(e) {
					try {
						eval('_top().frames.main_frame.' + msg.param.func);
					} catch(e2) {
						try {
							eval('_top().frames.chat.' + msg.param.func);
						} catch(e3) {};
					};
				};
				return false;
		}
	} else {
		if (!msg.msg_text) return false;

		for (var i in IGNORED) {
			if (i == msg.user_nick && IGNORED[i]) return false;
		}

		msg_dom = chatFormatMessage(msg);

		if ((jQuery.inArray(msg.type, [msg_type.report, msg_type.report_answer]) != -1) && !jQuery.isEmptyObject(msg.report_msg)) {
			if (msg.report_msg.macros_list && msg.report_msg.msg_text) {
				for (var macro_id in msg.report_msg.macros_list) {
					msg.report_msg.msg_text = common_macro_resolve(macro_id, msg.report_msg.macros_list[macro_id].name, msg.report_msg.macros_list[macro_id].data, msg.report_msg.msg_text);
				}
			}

			// prepare complain message text for client
			var date = new Date((parseInt(msg.report_msg.stime) + session.time_offset + new Date().getTimezoneOffset()*60)*1000);
			var hours = date.getHours();
			var minutes = '0'+date.getMinutes();
			client_text += hours+':'+minutes.substr(minutes.length - 2);
			client_text += ' '+msg.report_msg.user_nick+' » ';
			var nicks = [];
			if (typeof(msg.report_msg.to_user_nicks) === 'object') {
				for (var to_user_id in msg.report_msg.to_user_nicks) {
					if (parseInt(to_user_id)) nicks.push(msg.report_msg.to_user_nicks[to_user_id]);
				}
			}
			if (nicks.length) client_text += nicks.join(', ')+': ';
			client_text += msg.report_msg.msg_text;


			var report_msg = $(chatFormatMessage(msg.report_msg)).css('display', 'inline');
			var original_msg = $(msg_dom).css('display', 'inline').attr('original-msg-object', JSON.stringify(msg.report_msg));
			msg_dom = $('<div class="JS-MsgContainer"></div>').append(original_msg).append(report_msg);
			if (msg.type == msg_type.report_answer) msg_dom.addClass('opacity-50');
		} else if (msg.type == msg_type.def) {
			msg_dom = $(msg_dom);
			if (originalMsgObject.channel == channels.user) {
				originalMsgObject.to_user_ids = typeof(originalMsgObject.to_user_nicks) === 'object' ? Object.keys(originalMsgObject.to_user_nicks) : originalMsgObject.to_user_ids;
			}
			msg_dom.attr('original-msg-object', JSON.stringify(originalMsgObject));
		}
	}
	
	for (var i in chatOpts) {
		var opt = chatOpts[i];
		for (var k in chatDependent) {
			if (opt.channel & k) {
				opt.channel |= chatDependent[k];
			}
		}
		// if (CHAT.channel_settings[i] && !CHAT.channel_settings[i].sys_msgs && msg.type != msg_type.def && !msg.urgent && !mymsg) continue;
		if ((msg.channel == channels.user) || opt.channel & msg.channel || msg.type == msg_type.system || msg.type == msg_type.broadcast) {
			if (msg.channel != channels.user && msg.channel != channels.aux && !(opt.channel & channels.area) && !msg.command && (msg.type == msg_type.system && !(opt.system_msgs && (msg.channel & opt.channel))) && !msg.urgent)
					continue;
			if (msg.type == msg_type.system && msg.command && !(opt.channel & msg.channel)) continue;

			if (chatButtonState['priv_btn'] && msg.chaotic_request || !chatButtonState['priv_btn'] || (msg.channel == channels.user) || !chatButtonState['priv_btn'] && (msg.type == msg_type.system) || (msg.user_id == session.id)
					|| (msg.to_user_ids && inarray(msg.to_user_ids, session.id)) || msg.type == msg_type.broadcast || (msg.type == msg_type.system && msg.event_notify) ) {
				attachMessageToChat(opt, msg_dom, msg)
			}
		}
	}

	// Dwarium - MessageDom
	top?.document.dispatchEvent(new CustomEvent('MessageDom', {
		detail: msg_dom
	}))

	let client_msg = {};
	client_msg.data = {};
	client_msg.data.msg = client_text.split('"').join('\\"');
	client_msg.data.ctime = parseInt(msg.stime + session.time_offset + new Date().getTimezoneOffset()*60);
	if (msg.user_nick)
		client_msg.data.from = msg.user_nick;
	client_msg.data.type = channels_flip[msg.channel];
	if (msg.type == msg_type.system) {
		client_msg.data.type = 'aux';
	}
	if (client_msg.data.type == 'area_subchannel') {
		client_msg.data.type = 'area';
	}
	client_msg.data.recipient_list = [];
	for (var key in msg.to_user_nicks) {
		client_msg.data.recipient_list.push(msg.to_user_nicks[key]);
	}
	_top().clientExchangePut(vardump(client_msg).replace(/<\/?[^>]+>/gi, ''));
	if (scrollCurrent >= scrollMax - 100) {
		_top().frames['chat'].frames['chat_text'].scrollTo(0, 65535);
	}
	if (msie7) chatUpdateDataAttach();
	return true;
}

var lastFightMessages: string[] = []
var lastFightMessageIds: Number[] = []
var fightStarted = false
var fightStartedTimeout: NodeJS.Timeout | null = null

function parseArtifactMacro(macro_name, macro_data) {
	var html = html_add = '';
	switch(macro_name) {
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
		case 'MONEY':
		if (macro_data['money_type'] == 1) {
			html = html_money_str(1, macro_data['money'], 0, 0, 0, true);
		} else if (macro_data['money_type'] == 2) {
			html = html_money_str(1, 0, 0, 0, macro_data['money'], true);
		} else if (macro_data['money_type'] == 3) {
			html = html_money_str(1, 0, macro_data['money'], 0, 0, true);
		}
		break;
	}
	return html + html_add
}

function attachMessageToChat(opt, msg_dom, msg) {
	const attackMessage = 'Вы совершили нападение на'
	if(top?.document.chatFlags?.hideAttackedMessage == true && msg.msg_text.includes(attackMessage) && msg.channel == 2 && !msg.user_id) {
		return
	}
	const fightStartedMessage = 'Начался бой'
	if(msg.msg_text.includes(fightStartedMessage) && msg.channel == 2 && !msg.user_id) {
		if(opt.channel == chatOpts.fight.channel) {
			clearTimeout(fightStartedTimeout)
			fightStarted = true
		}
		if(top?.document.chatFlags?.hideFightStartedMessage == true) {
			return
		}
	}
	const interruptFightMessage = 'Прерван бой'
	if(msg.msg_text.includes(interruptFightMessage) && !msg.user_id) {
		clearTimeout(fightStartedTimeout)
		fightStarted = false
	}
	const giftPetMessage = 'вручил персонажу'
	if(top?.document.chatFlags?.hideGiftPetMessage == true && msg.msg_text.includes(giftPetMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const socialInvitesMessage = 'Приглашаем вас посетить наши группы в социальных'
	if(top?.document.chatFlags?.hideSocialInvitesMessage == true && msg.msg_text.includes(socialInvitesMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const meridianVaultsMessage = 'Началось формирование команд из бойцов'
	if(top?.document.chatFlags?.hideMeridianVaultsMessage == true && msg.msg_text.includes(meridianVaultsMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const upgradeMountMessage = 'воспользовавшись помощью кузнеца'
	if(top?.document.chatFlags?.hideUpgradeMountMessage == true && msg.msg_text.includes(upgradeMountMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const contestMessage = 'Конкурс:'
	if(top?.document.chatFlags?.hideContestMessage == true && msg.msg_text.includes(contestMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const guardiansMessage = 'Опасайтесь стать жертвой мошенников!'
	if(top?.document.chatFlags?.hideGuardiansMessage == true && msg.msg_text.includes(guardiansMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const chaoticFightMessage = 'Начинается подготовка к сражению «Хаотичная битва»'
	if(top?.document.chatFlags?.hideChaoticFightMessage == true && msg.msg_text.includes(chaoticFightMessage) && msg.chaotic_request == 1 && !msg.user_id) {
		return
	}
	const crusibleFightMessage = 'Начинается подготовка к сражению «Горнило войны»'
	if(top?.document.chatFlags?.hideCrusibleFightMessage == true && msg.msg_text.includes(crusibleFightMessage) && msg.chaotic_request == 1 && !msg.user_id) {
		return
	}
	const heavenFight = 'за Длань'
	if(top?.document.chatFlags?.hideHeavenFightMessage == true && msg.msg_text.includes(heavenFight) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const kesariMessage = 'ниспослал благословение'
	if(top?.document.chatFlags?.hideKesariMessage == true && msg.msg_text.includes(kesariMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const newsMessage = '<b>Новость</b>:'
	if(top?.document.chatFlags?.hideNewsMessage == true && msg.msg_text.includes(newsMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const disableEventMessages = true
	if(top?.document.chatFlags?.hideEventsMessage == true && msg.event_id && msg.channel == 1 && !msg.user_id && disableEventMessages) {
		return
	}
	const boxPrizeMessages = ['Открыв один из особых драгоценных сундучков, купленных на Городской ярмарке', 'Открыв один из сундучков, купленных на Городской ярмарке', 'с интересом продолжил  исследовать содержимое сундука']
	let prizeMessageIncludes = false
	for(const boxPrizeMessage of boxPrizeMessages) {
		if(msg.msg_text.includes(boxPrizeMessage)) {
			prizeMessageIncludes = true
			break
		}
	}
	if(top?.document.chatFlags?.hideBoxPrizeMessage == true && prizeMessageIncludes && msg.channel == 1 && !msg.user_id) {
		return
	}
	const medalMessage = 'Медаль «Поклонения»'
	if(top?.document.chatFlags?.hideMedalsMessage == true && msg.msg_text.includes(medalMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const mentorMessage = 'Если у вас есть вопросы по игре'
	if(top?.document.chatFlags?.hideMentorsMessage == true && msg.msg_text.includes(mentorMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const banditMessages = ['выиграл у Однорукого Бандита', 'сорвал Джекпот', 'Бриллиантового Бандита', 'Золотого Бандита', 'бандит']
	let isBanditMessage = false
	banditMessages.forEach(message => {
		if(msg.msg_text.includes(message)) {
			isBanditMessage = true
		}
	})
	if(top?.document.chatFlags?.hideBanditMessage == true && isBanditMessage && msg.channel == 1 && !msg.user_id) {
		return
	}
	const pitMessage = 'Пожертвовав горсть монет высшим силам, притаившимся в Колодце удачи'
	if(top?.document.chatFlags?.hidePitMessage == true && msg.msg_text.includes(pitMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const mirrorMessage = 'Обыграв духов Зазеркалья'
	if(top?.document.chatFlags?.hideMirrorMessage == true && msg.msg_text.includes(mirrorMessage) && msg.channel == 1 && !msg.user_id) {
		return
	}
	const endFightMessage = 'Окончен бой'
	if(top?.document.chatFlags?.newLootSystem && !msg.user_id && fightStarted) {
		if(msg.msg_text.startsWith('<a href="#" onClick="userPrvTag(') || msg.msg_text.includes('Вашей группой найдено:') || msg.msg_text.includes('Вашей группой получено')) {
			return
		}
		if (msg.msg_text.startsWith('Игрок <a href=\"#\" onClick=\"userPrvTag(') && msg.msg_text.includes('получил')) {
            return;
        }
		if(!msg.msg_text.includes(endFightMessage)) {
			if(lastFightMessageIds.includes(msg.id)) {
				return
			}
			const dropMessages = ['Вами получено', 'Вы получили', 'Получено:', 'Благодаря магическим эффектам']
			let neededMessage = false
			dropMessages.forEach(message => {
				if(msg.msg_text.includes(message)) {
					neededMessage = true
				}
			})
			if(!msg.user_id && neededMessage || (msg.msg_text.startsWith('<a class="artifact_info') && msg.msg_text.endsWith('шт</b>'))) {
				if(top?.document.chatFlags?.hideSatiety && msg.msg_text.includes('Сытость')) {
					return
				}
				lastFightMessages.push(msg)
				lastFightMessageIds.push(msg.id)
				return
			}
		}
		if(msg.msg_text.includes(endFightMessage)) {
			setTimeout(() => {
				if(lastFightMessages.length == 0) {
					clearLastFightInfo()
					return
				}
				const moneyMessages = lastFightMessages.filter(r => {
					let keys = Object.keys(r.macros_list)
					if(keys.length > 0) {
						let isGold = r.macros_list[keys[0]].name == 'MONEY'
						return isGold
					}
					return false
				})
				lastFightMessages = removeItems(lastFightMessages, moneyMessages)
				const energyMessage = lastFightMessages.find(message => message.msg_text.includes('энергии'))
				if(energyMessage) {
					lastFightMessages = removeItems(lastFightMessages, [energyMessage])
					lastFightMessages = moneyMessages.concat([energyMessage]).concat(lastFightMessages)
				} else {
					lastFightMessages = moneyMessages.concat(lastFightMessages)
				}

                for (const message of lastFightMessages) {
					const isAdditionalShadow = message.msg_text.includes("<STRONG>Магический") && message.msg_text.includes('помог вам получить дополнительные предметы.')
					if(isAdditionalShadow) {
						const artKey = Object.keys(message.macros_list).find(key => message.macros_list[key].data.title == ' артефакт')
                        delete message.macros_list[artKey];
					}
                    for(const key of Object.keys(message.macros_list)) {
                        let data = parseArtifactMacro(message.macros_list[key].name, message.macros_list[key].data);
                        if(message.macros_list[key].name == 'MONEY' && lastFightMessages.indexOf(message) > 0) {
                            data = `+ ( ${data})`
                        }
                        if(data && data != '') {
                            if(isAdditionalShadow) {
                                message.msg_text = '<span>' + data + ' <img src="images/data/artifacts/shadow_seek_ring_red.gif" width="15" height="15"></span>'; 
                            } else {
                                message.msg_text = data;
                            }
                        }
                    }
                }
				for(var lastFightMessage of lastFightMessages) {
					if(lastFightMessage.msg_text.includes('Вы получили') && lastFightMessage.msg_text.includes('энергии')) {
						lastFightMessage.msg_text = '<span>' + lastFightMessage.msg_text.replace(/\D/g, '') + ' <img src="images/work.gif" width="7" height="8"></span>'
					}
				}
				top?.document.dispatchEvent(new CustomEvent('DropMessage', {
					detail: {
						fightId: _top().__lastFightId,
						dropInfo: lastFightMessages
					}
				}))
				let lootMessage = lastFightMessages.map(msg => msg.msg_text).join(' ')
				lootMessage += ` <b><a href='javascript:void(0)' onclick='showFightInfo(${_top().__lastFightId})'>Бой</a><b>`
				
				var all_channels = 0;
				for (var i in chatOpts) {
					all_channels |= chatOpts[i].channel;
				}
				var res = {
					type: msg_type.system,
					urgent: true,
					msg_text: lootMessage,
					channel: all_channels, 
					stime: current_server_time()
				}
				const domMessage = chatFormatMessage(res)
				
				for (var i in chatOpts) {
					if(i != 'fight') {
						continue
					}
					var opt = chatOpts[i];
					for (var k in chatDependent) {
						if (opt.channel & k) {
							opt.channel |= chatDependent[k];
						}
					}
					opt.data.append($(domMessage).clone())
					_top().frames['chat'].frames['chat_text'].scrollTo(0, 65535);
				}
				clearLastFightInfo()
				return
			}, 2500)
			if(opt.channel == chatOpts.fight.channel) {
				fightStartedTimeout = setTimeout(() => {
                    if (!top[0][1].canvas?.app?.battle?.model || top[0][1].canvas?.app?.battle?.model.fightResult == 1) {
                        fightStarted = false;
                    }
                }, 5000)
			}
		}
	}
	if(top?.document.chatFlags?.hideEndFightMessage == true && msg.msg_text.includes(endFightMessage) && msg.channel == 2 && !msg.user_id) {
		return
	}
	opt.data.append($(msg_dom).clone())
}

function clearLastFightInfo() {
	lastFightMessages = []
	lastFightMessageIds = []
}

var scrollLock = false;
function chat_check_chat_text_ready(fnc) {
	if (!_top().frames['chat'] || !_top().frames['chat'].frames['chat_text'] || !_top().frames['chat'].frames['chat_text'].loaded) {
		setTimeout(fnc, 500);
		return false;
	}
	return true;
}
function chatScrollToBottom() {
	if (!_top().frames['chat'] || !_top().frames['chat'].frames['chat_text'])
		return false;
	if (_top().frames['chat'].frames['chat_text'].loaded) {
		setTimeout(function() {
			_top().frames['chat'].frames['chat_text'].scrollTo(0, 65535);
		}, 500);
	} else if (!scrollLock) {
		setTimeout(function() {
			scrollLock = false;
			chatScrollToBottom();
		}, 100);
		scrollLock = true;
	}
}

var chatUpdateUsersTimer = null;
// Feedback function
function chatUpdateUsers() {
	var obj = false;
	if (_top().frames['chat'].frames['chat_user'].document) {
		obj = _top().frames['chat'].frames['chat_user'].document.getElementById('content');
	}

	if (!obj) {   // No frame
		setTimeout(chatUpdateUsers, 500);
		return;
	}
	chatUserHtml = chatUserHtml.replace(/\$(\d+)\$/g,shablon_substitution);
	obj.innerHTML = chatUserHtml;
	chatUpdateUsersCounters();
	if (chatUpdateUsersTimer) {
		clearTimeout(chatUpdateUsersTimer);
	}
	chat_users_sort(chat_get_users_frame());
	chatUpdateUsersTimer = setTimeout(chatRefreshUsers, CHAT.auto_refresh_users * 1000);

	var $searchValue = $("#filterField");
	if ($searchValue.length > 0) {
		highlightFoundNicks(obj, $searchValue.val());
	}
}

function chatUpdateUsersCounters() {
	gebi('chat_user_count').innerHTML = chatUserCount;
	if (chatUserEnemyCount) {
		gebi('chat_user_enemy_count').innerHTML = chatUserEnemyCount;
		gebi('chat_user_brother_count').innerHTML = chatUserCount - chatUserEnemyCount;
		gebi('chat_user_count_detail').style.display = 'inline';
	} else {
		gebi('chat_user_count_detail').style.display = 'none';
	}
}

function highlightFoundNicks(frame, searchValue) {
	if (!frame) {
		return;
	}
	if (searchValue == '') {
		return;
	}
	var chat_users = $('#chat_users_list div.chat_user_item', frame);

	var foundMatches = 0;
	chat_users.each(function() {
		var $el = $(this);
		if ($el.data('nick').toLowerCase().indexOf(searchValue) < 0) {
			$el.removeClass('search-highlight-nick');
		} else {
			$el.addClass('search-highlight-nick');
			foundMatches++;
		}
	});

	$('span.input-2__matches').html(foundMatches);
}

function clientCallBack(data) {
	if (data.code == 101) {
		var obj = gebi('message');
		obj.focus();
		if (/^to\[/i.test(data.data) || /^prv\[/i.test(data.data)) {
			obj.value = data.data + obj.value;
		} else {
			obj.value += data.data;
		}
	}

	if (data.code == 100) {
		if (data.data['recipient_list']) {
			var private_nicks = '';
			for (var i in data.data['recipient_list']) {
				private_nicks += 'prv[' + data.data['recipient_list'][i] + '] ';
			}
			data.data['msg'] = private_nicks + data.data['msg'];
		}
		chatRequestData(data.data['msg'], channels[data.data['type']]);
	}
}

function checkInInstance() {
	return session.loc_id > 1000000;
}

// =========== Smiles functions ============

function chat_load_smiles_callback(data, page) {
	if (!data || !data.html) return;
	var smile_div = $('#smile_div', _top().document);
	var $content = smile_div.find('.content');
	var $pages = smile_div.find('.footer .pages');
	$content.html(data.html);
	$pages.html(data.pages_html);
	if (typeof page != 'undefined') CHAT.smiles.by_page[page] = data;
	$('#smile_div_bg', _top().document).add(smile_div).show();
};

function chat_load_smiles(page) {
	CHAT.smiles.current_page = page;
	if (CHAT.smiles.by_page[page]) {
		chat_load_smiles_callback(CHAT.smiles.by_page[page]);
		return false;
	}
	var param = {
			page: page
	};
	if (CHAT.smiles.settings_on) {
		param.favorite = 1;
	}
	$.getJSON('/pub/smiles.php', param, function(data) { chat_load_smiles_callback(data, page); });
	return false;
};

function chat_load_emos_callback(data, page) {
	var smile_div = $('#smile_div', _top().document);
	var $content = smile_div.find('.content');
	var $pages = smile_div.find('.footer .pages');
	$content.html(data.html);
	$pages.html(data.pages_html);
	if (typeof page != 'undefined') CHAT.smiles.emos_by_page[page] = data;
	$('#smile_div_bg', _top().document).add(smile_div).show();
};

function chat_load_emos(page) {
	if (CHAT.smiles.emos_by_page[page]) {
		chat_load_emos_callback(CHAT.smiles.emos_by_page[page]);
		return false;
	}
	var param = {
		page: page,
		emo: 1
	};
	$.getJSON('/pub/smiles.php', param, function(data) { chat_load_emos_callback(data, page); });
	return false;
};

function chatShowSmiles(_obj) {
	if (CHAT.smiles.settings_on) {
		CHAT.smiles.by_page = {};
	}
	CHAT.smiles.settings_on = false;
	CHAT.smiles.emo_on = false;
	chat_load_smiles(CHAT.smiles.current_page);
};

var inarray = function(where, what) {
	for (var i in where) {
		if (where.hasOwnProperty(i) && where[i] === what) {
			return true;
		}
	}
	return false;
};

function dateformat(stime, seconds, local_time) {
	if (typeof local_time === 'undefined') {
		local_time = CHAT.locale_timezone;
	}
	if (!local_time) {
		stime = stime - CHAT.timezone_diff;
	}
	var date = new Date(stime * 1000);
	var h = date.getHours();
	var m = date.getMinutes();
	if (h < 10) h = '0' + h.toString();
	if (m < 10) m = '0' + m.toString();
	var str = h + ":" + m;
	if (seconds) {
		seconds = date.getSeconds();
		if (seconds < 10) seconds = '0' + seconds.toString();
		str += ':' + seconds;
	}
	return str;
};

function chat_get_class(channel) {
	var t_cl = '';
	if (channel == channels.area || channel == channels.area_subchannel) t_cl = 'cml_loc';
	else if (channel == channels.user) t_cl = 'cml_prv';
	else if (channel == channels.clan) t_cl = 'cml_cln';
	else if (channel == channels.trade) t_cl = 'cml_trd';
	else if (channel == channels.party) t_cl = 'cml_pty';
	else if (channel == channels.fight) t_cl = 'cml_fgt';
	else if (channel == channels.raid) t_cl = 'cml_rd';
	else if (channel == channels.ally) t_cl = 'cml_all';
	else if (channel == channels.aux) t_cl = 'cml_aux';
	else if (channel == channels.find_party) t_cl = 'cml_fpty';
	return t_cl;
};

function chatFormatMessage(msg) {
	msg.type = msg.type || msg_type.def;

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

	var ctlMnu = function(nick, level, kind, team, fightId) {
		team = team || 0;
		fightId = fightId || 0;
		
		var args_1 = 'this,event,\'' + addslashes(nick) + '\',' + level + ',' + kind + ',1,' + team + ',' + fightId + ',' + msg.id;
		var args_2 = 'this,event,\'' + addslashes(nick) + '\',' + level + ',' + kind + ',2,' + team + ',' + fightId + ',' + msg.id;
		return ' oncontextmenu="return mnu(' + args_1 + ')" onmousedown="return mnu(' + args_2 + ')"';
	};

	var enemy = false;
	if ((msg.user_kind && msg.user_kind != session.kind && !('user_kind_f' in msg)) || (msg.raid_team_num && session.raid && msg.raid_team_num != session.raid.substr(session.raid.length - 1))) enemy = true;
	var mymsg = false;
	var talkfree_enemy = false;
	if (session.talkfree) {
		if (enemy) talkfree_enemy = true;
		enemy = false;
	}
	if (!enemy && ((msg.channel == channels.user) || (msg.user_id == session.id) || (msg.to_user_ids && inarray(msg.to_user_ids, session.id)))) mymsg = true;

	msg.to_user_nicks = msg.to_user_nicks || {};
	msg.to_user_kinds = msg.to_user_kinds || {};
	msg.to_user_levels = msg.to_user_levels || {};
	if (enemy) {
		msg.to_user_nicks = {};
		msg.to_user_kinds = {};
		msg.to_user_levels = {};
	}
	
	var t_cl = '';
	if (enemy) t_cl = 'cml_enm';
	else if (talkfree_enemy) t_cl = 'cml_tkf';
	else t_cl = chat_get_class(msg.channel);

	var t_nickfnc = msg.channel & channels.user ? 'userPrvTag' : 'userToTag';
	var t_nickalt = msg.channel & channels.user ? CHAT.str.private_msg : CHAT.str.personal_msg;

	var t_add = '';
	if (msg.type == msg_type.def || msg.type == msg_type.report) t_add += ' oncontextmenu="return timeMnu(this,event,' + msg.id + ',1)" onmousedown="return timeMnu(this,event,' + msg.id + ',2)"';
	var empty_user_nicks = false;
	
	var count_nicks = 0;
	for (var i in msg.to_user_nicks) {
		count_nicks++;
		i;
	}
	if (!enemy && (msg.user_id > 0) && (count_nicks == 0) && msg.user_id != session.id && msg.channel == channels.user) {
		msg.to_user_nicks[msg.user_id] = msg.user_nick;
		empty_user_nicks = true;
	}

	if (msg.to_user_nicks) {
		var nicks = [];
		if ((msg.user_id != session.id) && msg.user_nick) {
			var nick = addslashes(msg.user_nick);
			if (!inarray(nicks, nick)) {
				nicks.push(nick);
			}
		}
		for (var i in msg.to_user_nicks) {
			if (i == session.id) continue;
			var nick = addslashes(msg.to_user_nicks[i]);
			if (inarray(nicks, nick)) continue;
			nicks.push(nick);
		}
		
		if (nicks.length > 0) {
			nicks = nicks.join('\',\'');
			t_add += ' onclick="'+t_nickfnc+'(\''+nicks+'\'); return false;" title="'+CHAT.str.answer_group+'"';
		}
	}

	if (empty_user_nicks) {
		msg.to_user_nicks = {};
	}

	if (t_add) {
		t_add += ' style="cursor: pointer; text-decoration: none;"' + t_add;
	} else {
		t_add = ' style="cursor: pointer; text-decoration: none;"'
	}
	
	var html = '';
	var complain_channel = msg.channel;
	for (var i in chatDependent) {
		if (complain_channel & chatDependent[i]) {
			complain_channel = i;
			break;
		}
	}
	html += '<span class="' + t_cl + '" data-channel="' + complain_channel + '"><a' + t_add + ' class="timestamp" data-ts="'+msg.stime+'">' + dateformat(msg.stime) + '</a>&nbsp;&nbsp;';
	if (msg.is_mobile && parseInt(msg.is_mobile)) {
		var mobile_client_url = _top().mobile_client_url || '#" onclick="return false;"';
		html += '<a href="'+mobile_client_url+'" target="_blank" title="'+_top().TRANSLATE.use_mobile+'"><img src="/images/mobile.png" width="13" height="13" /></a>&nbsp;';
	}
	if (msg.user_nick) {
		if (mymsg) html += '<b>';
		html += '<a style="cursor:pointer; text-decoration: none;" ' + ctlMnu(msg.user_nick, msg.user_level, msg.user_kind) + ' onclick="' + t_nickfnc + '(\'' + escape(msg.user_nick) + '\'); return false;" ' +
				'title="' + t_nickalt + '">' + escape(msg.user_nick) + "</a>";
		if (msg.to_user_nicks) {
			var t = [];
			for (var i in msg.to_user_nicks) {
				var v = (msg.to_user_nicks[i]);
				t.push('<a style="cursor: pointer; text-decoration: none;" ' + ctlMnu(v, msg.to_user_levels[i], msg.to_user_kinds[i]) + ' onclick="'+t_nickfnc+'(\''+addslashes(v)+'\'); return false;" title="'+t_nickalt+'">'+escape(v)+'</a>');
			}
			if (t.length > 0) {
				html += '&nbsp;&raquo;&nbsp;' + t.join(', ');
			}
		}
		if (mymsg) html += '</b>';
		html += ':&nbsp;';
	}
	html += '</span>';
	
	var text = '<span class="msgtxt" style="' + (msg.msg_color ? 'color:' + msg.msg_color + ';' : '') + '">' + msg.msg_text + '</span>';
	text = $(text);
	chat_timestamp_process(text);
	html += text.get(0).outerHTML;

	var d_cl = 'cml_def';
	if (msg.type != msg_type.def) {
		html = '<img src="' + (msg.type == msg_type.system ? 'images/msys.gif' : 'images/mbrc.gif') + '" width=7 height=8>' + html;
		d_cl = 'cml_spc';
	}
	if (msg.type == msg_type.report_answer) {
		d_cl += ' opacity-50';
	}

	html = '<div event_id="' + (msg.event_id || 0) + '" nick="'
			+ addslashes(msg.user_nick || '') + '" id="msg' + msg.id
			+ '" crc="' + (msg.crc || '') + '"'
			+ (msg.report_id ? ' report_id="' + msg.report_id + '"' : '')
			+ ' report_crc="' + (msg.report_crc || '') + '"'
			+ (msg.report_nick ? ' report_nick="' + msg.report_nick + '"' : '')
			+ ' stime="' + msg.stime + '" class="' + d_cl + '">' + html
			+ '</div>';

	return html;
}

var session = null
var chatLocId = null
function sessionUpdate(data) {
	session = data;

	chatAvailChannels = data.avail;
	chatLocId = data.loc_id;

	if (!CHAT.ready) setTimeout(function () {sessionUpdate(data) }, 10);
	if ($channel_tabs === null) $channel_tabs = $('#channel_tabs');
	var visible_channels_count = $channel_tabs.find('li.channel').not('.hid').length;
	$channel_tabs.find('li.channel').each(function(i, el) {
		var $el = $(el);
		var channel = $el.data('channel');
		if (channel == 'main') return;
		var channel_code = $el.data('channel-code');
		if (channel_code & chatAvailChannels) $el.removeClass('hid');
		else $el.addClass('hid');
		if (channel == 'party' || channel == 'clan') {
			if (channel == 'party') {
				var settings = $('.cht-btn-settings');
				if (channel_code & chatAvailChannels ? true : false) {//user in party
					settings.show();
				} else if (settings.css('display') != 'none') {
					$('.cht_buttons_state').removeClass('selected');
					var iframe = gebi('user_list');
					if (iframe && iframe.src.search('cht_iframe.php?mode=user') === -1) {
						$chat_user_list && $chat_user_list.find('> li').removeClass('selected').filter('.area').addClass('selected');
						chatActivateNonparty();
					}
					settings.hide();
				}
			}
			if (!chat_user_list) return;
			if (!chat_user_list[channel]) return;
			if (channel_code & chatAvailChannels) {
				chat_user_list[channel].removeClass('hid');
			} else {
				chat_user_list[channel].addClass('hid');
			}
		}
	});
	if ($channel_tabs.find('li.channel.selected.hid').length) {
		chatChangePreset('main');
	}
	if (visible_channels_count != $channel_tabs.find('li.channel').not('.hid').length) {
		cht_settings_carousel_width();
	}

	if (session['no_update_bg_state']) {
		swfObject('top_mnu', {"bgFilledState": 0});
	}
	if (!session['update_auc_state']) {
		swfObject('top_mnu', {"auctionFilledState": 0});
	}
}

var checkLmtsProxyReady = function() {
	lastMsgTime = time_current();
	var proxyRef = document.lmts_proxy;
	if (proxyRef && typeof proxyRef.connect !== 'undefined') {
		lastMsgTime = time_current();
		LMTS = esrv(proxyRef);

		LMTS.onError = function(code, msg) { };

		LMTS.onConnect = function() { };

		LMTS.onAuth = function() {
			$.get(chatUrl, {subscribe: 1});
		};

		var lmtsRequestRef = LMTS.request;
		LMTS.request = function(data, success, fail) {
			lmtsRequestRef(data, success, fail);
		};
		LMTS.reconnect = chatTotalReconnect;
		LMTS.onData = function(data) { };
		LMTS.onDisconnect = function() {
			LMTS.reconnect();
		};

		LMTS.connect(CHAT.conf);

		LMTS.onNotify = function(data) {
			chatReceiveMessage(data);
		};
		return;
	}
	setTimeout(checkLmtsProxyReady, 100);
};

function chat_resizer_init() {
	$('#change_chat_size').draggable({
		axis: 'y',
		revert: true,
		distance: 10,
		grid: [0, 10],
		handler: '.cht_arrows',
		stop: function(e, ui) {
			var val = ui.helper[0].offsetTop - ui.offset.top;
			_top().cht_resize(val, true);
		}
	}).disableSelection();
};

var $channel_tabs = null;
var channel_list = {};
function chat_channel_init() {
	if ($channel_tabs === null) $channel_tabs = $('#channel_tabs');
	$channel_tabs.find('li.channel').each(function(i, el) {
		var $el = $(el);
		var channel = $el.data('channel');
		$el.attr('channel-serialize', 'channel=' + channel);
		channel_list[channel] = $el;
	});
	$channel_tabs.sortable({
		items: "li.moveable",
		revert: 10,
		update: function(e, ui) {
			var serialized = $(e.target).sortable('serialize', {
				attribute: 'channel-serialize',
				expression: /(.+)=(.+)/
			});
			serialized += '&action=tabs_sort';
			$.ajax({
				url: '/pub/cht_data_save.php',
				cache: false,
				type: 'POST',
				data: serialized,
				success: function(data) {},
				error: function() {
					alert(CHAT.str.sort_error);
					$(e.target).sortable('cancel');
				}
			});
		}
	}).disableSelection();
	$channel_tabs.find('li').on('click', chat_channel_click);
	$channel_tabs.find('li .settings').on('click', chat_channel_settings_click);
	chatChangePreset(localStorage.selectedTab ? localStorage.selectedTab : 'main');
	chat_content_init();
	chat_message_blur();
};

function chat_content_init() {
	if (!_top().chat.chat_text || !_top().chat.chat_text.document || !_top().chat.chat_text.document.body || !_top().chat.chat_text.loaded) {
		setTimeout(chat_content_init, 1000);
		return;
	}
	for (var current_channel in CHAT.channel_settings) {
		chat_update_channel_settings(CHAT.channel_settings[current_channel], current_channel);
	}
	chat_update_text_size(CHAT.text_size);
};

function chat_timestamp_process(obj) {
	$(obj).find('.timestamp').each(function(i, el) {
		var $el = $(el);
		var seconds = ($el.data('seconds') == 'on');
		$el.html(dateformat($el.data('ts'), seconds));
	});
};

function chat_timezone_init() {
	if (!session || !session.time_offset && session.time_offset !== 0 || !document.chat_clock || !document.chat_clock.time_shift) {
		setTimeout(chat_timezone_init, 1000);
		return false;
	}
	CHAT.timezone_diff = - new Date().getTimezoneOffset() * 60 - session.time_offset;
	var diff = CHAT.locale_timezone ? CHAT.timezone_diff : 0;
	for (var i in chatOpts) {
		chat_timestamp_process(chatOpts[i].data);
	}
	if (diff) chat_clock_time_shift(diff);
	else chat_clock_time_shift(-time_shifted);
	return true;
}

var time_shifted = 0;
function chat_clock_time_shift(time) {
	time_shifted += time;
	document.chat_clock.time_shift(time / 60);//minutes
};

function chat_channel_click(e) {
	var channel = $(this).data('channel');
	return chatChangePreset(channel);
};

function chat_channel_settings_click(e) {
	var $el = $(this);
	var $parent = $el.parent('.channel');
	var channel = $parent.data('channel');
	var title = CHAT.str.tab_settings.replace('%s', $parent.find('.text').html());
	$.ajax({
		url: '/pub/cht_data_load.php',
		cache: false,
		type: 'POST',
		data: 'mode=channel_settings&channel=' + channel
	}).done(function(data) {
		popupDialog(data, title, 365);
		$('.chat_popup_channel_settings .text_size', _top().document).each(function(i, el) {
			_top().chat.shop_change_counter(el);
		});
	});
	return false;
};

function chat_channel_settings_save(form, current_channel) {
	_top().popupDialogObj.close();
	$.ajax({
		url: '/pub/cht_data_save.php',
		cache: false,
		type: 'POST',
		data: $(form).serialize()
	}).done(function(json) {
		if (!json) return;
		eval('var chat_data = ' + json);
		CHAT.channel_settings = chat_data.channel_settings;
		CHAT.text_size = chat_data.text_size;
		chat_update_channel_settings(CHAT.channel_settings[current_channel], current_channel);
		chat_update_text_size(CHAT.text_size);
	});
	return false;
};

function chat_update_channel_settings(channel_settings, current_channel) {
	var $el = channel_list[current_channel];
	if (!$el) return false;
	$el.find('span.settings-color').css('background-color', channel_settings.text_color);
	var channel = $el.data('channel-code');
	var t_cl = chat_get_class(channel);
	var style = $('<style>.'+t_cl+', .'+t_cl+' * {color: '+channel_settings.text_color+' !important; }</style>');
	$('html > head', _top().chat.chat_text.document).append(style);
	chatOpts[current_channel].channel = channel_settings.channels;
};

function chat_update_text_size(text_size, just_user_list) {
	var style = $('<style>* {font-size: ' + text_size + 'px; }</style>');
	if (!just_user_list) $('html > head', _top().chat.chat_text.document).append(style.clone());
	$('html > head', _top().chat.chat_user.document).append(style);
};

function chat_change_timezone() {
	if (CHAT.timezone_diff == 0) return false;
	var $ctz = $('#chat_popup_change_timezone');
	if (!$ctz.length) return false;
	var times = $ctz.find('.server_time, .locale_time');
	times.removeClass('selected');
	times.filter(CHAT.locale_timezone ? '.locale_time' : '.server_time').addClass('selected');
	var server_time = current_server_time();
	if (!server_time) return false;
	times.filter('.server_time').find('.time').html('('+dateformat(server_time, false, false)+')');
	times.filter('.locale_time').find('.time').html('('+dateformat(server_time, false, true)+')');
	popupDialog($ctz.html(), CHAT.str.change_timezone);
	return true;
};
var chat_change_time_zone = chat_change_timezone;

function chat_change_timezone_confirm(locale) {
	if (CHAT.locale_timezone != locale) {
		$.ajax({
			url: '/pub/cht_data_save.php',
			cache: false,
			type: 'POST',
			data: 'action=locale_timezone&locale=' + (locale ? 1 : 0),
			success: function(data) {},
			error: function() {}
		});
	}
	CHAT.locale_timezone = locale ? 1 : 0;
	chat_timezone_init();
	_top().popupDialogObj.close();
};

var $chat_user_list = {}
var chat_user_list = $chat_user_list = null;
function chat_user_list_init() {
	chat_user_list = {};
	$chat_user_list = $('#chat_user_list');
	$chat_user_list.find(' > li').each(function(i, el) {
		var $el = $(el);
		var type = $el.data('type');
		chat_user_list[type] = $el;
	}).click(function(e) {
		_top().$('#menutablediv').html('').remove();
		var $el = $(this);
		if (!$el.hasClass('selected')) {
			$el.parent().find('> li.selected').removeClass('selected');
			$el.addClass('selected');
		}
		if ($el.data('type') == 'party') {
			chatActivateParty();
		} else {
			chatActivateNonparty();
		}
		var tab = $('#chat_user_list').find('li.selected').data('type');
		var default_filter = {field: 'nick', order: 'asc'};
		if (tab == 'clan') default_filter.field = 'clanid';
		var sortChatUsers = $.jStorage.get('sortChatUsers_'+tab, default_filter);
		userListSortFilter.sortField = sortChatUsers.field;
		userListSortFilter.sortOrder = sortChatUsers.order;
	});
};

function chat_browser_init() {
	var rsz = null;
	var gecko = navigator.userAgent.match(/Gecko/i);
	var opera = navigator.userAgent.match(/Opera/i);
	if (opera || gecko) {
		gebi('if1').scrolling='auto';
		gebi('if2').scrolling='auto';
		gebi('user_list').scrolling='auto';
		var rsz = function(a) {
			gebi('if1').style.height='10px';
			gebi('if2').style.height='10px';
			gebi('user_list').style.height='10px';
			gebi('t1').style.height='99%';
			var h=document.body.offsetHeight - 98;
			h = h < 46 ? 46 : h;
			gebi('if1').style.height=(h+18)+'px';
			gebi('if2').style.height=(h+18)+'px';
			gebi('user_list').style.height=h+'px';
			gebi('t1').style.height='100%';
		};
	} else {
		var rsz = function(a) {
			gebi('if1').style.height='1px';
			gebi('if2').style.height='1px';
			gebi('user_list').style.height='1px';
			
			gebi('if1').style.height='100%';
			gebi('if2').style.height='100%';
			gebi('user_list').style.height='100%';
		};
	}
	onresize = rsz;
	setTimeout(onresize, 200);
};

function chat_message_focus() {
	var $message = $('#message');
	if ($message.val() == $message.data('dummy-text')) {
		$message.removeClass('dummy').val('');
	}
};

function chat_message_blur() {
	var $message = $('#message');
	if (!$.trim($message.val()).length) {
		$message.addClass('dummy').val($message.data('dummy-text'));
	}
};

function chat_smiles_emo_toggle() {
	if (CHAT.smiles.emo_on) {
		CHAT.smiles.emo_on = false;
		chat_load_smiles(CHAT.smiles.current_page);
	} else {
		CHAT.smiles.emo_on = true;
		chat_load_emos(0);
	}
	return false;
};

function chat_smiles_emo_reset() {
	CHAT.smiles.by_page = {};
	CHAT.smiles.emos_by_page = {};
	CHAT.smiles.current_page = 0;
};

function chat_smiles_settings_toggle() {
	if (CHAT.smiles.settings_on) {
		CHAT.smiles.settings_on = false;
		CHAT.smiles.by_page = {};
		CHAT.smiles.current_page = 0; 
		chat_load_smiles(0);
	} else {
		CHAT.smiles.settings_on = true;
		CHAT.smiles.by_page = {};
		chat_load_smiles(0);
	}
	return false;
};

function chat_smile_favorite(el) {
	var $el = $(el);
	var id = $el.data('id');
	if ($el.hasClass('favorite')) {
		$el.removeClass('favorite');
	} else {
		$el.addClass('favorite');
	}
	$.ajax({
		url: '/pub/cht_data_save.php',
		cache: false,
		type: 'POST',
		data: 'action=favorite_smiles&id='+id,
		success: function(data) {},
		error: function() {}
	});
};

function cht_btn_select(btn) {
	$('.cht_buttons_state').removeClass('selected').filter('#cht_'+btn+'_btn').addClass('selected');
}

function cht_settings_carousel_width() {
	var parent_w = $('.channel-tabs-container').parent().outerWidth(true),
		child_w = 0;

	$('li.channel').not('.hid').each(function() {
		child_w += $(this).outerWidth(true);
	});

	if (child_w > (parent_w - 38)) {
		if ((parent_w - 38) <= 282) {
			$('.channel-tabs-container').css({
				'width': 282 + 'px'
			})
			$('.cht-arr').css({
				'display' : 'inline-block'
			});
		} else {
			$('.channel-tabs-container').css({
				'width': (parent_w - 38) + 'px'
			})
			$('.cht-arr').css({
				'display' : 'inline-block'
			});
		}
	} else {
		$('.channel-tabs-container').css({
			'width': '100%'
		})
		$('.cht-arr').css({
			'display' : 'none'
		});
	}

	cht_settings_arrows();
}

function cht_settings_arrows() {
	if($('#channel_tabs__left').data('current') == 0) {
		$('#channel_tabs__left').css({
			'background-position' : '0 0'
		})
	} else {
		$('#channel_tabs__left').css({
			'background-position' : '0 -30px'
		});
	}
	if ($('#channel_tabs__left').data('current') == $('li.channel').not('.hid').length - 1) {
		$('#channel_tabs__right').css({
			'background-position' : '-16px 0'
		});
	} else {
		$('#channel_tabs__right').css({
			'background-position' : '-16px -30px'
		});
	}
}

$(function() {

	$('#channel_tabs__left').data('current', 0);
	$('#channel_tabs__left').data('shift', 0);

	cht_settings_arrows();

	$('#channel_tabs__left').on('click', function() {
		if ($('#channel_tabs__left').data('current') != 0) {
			$('#channel_tabs__left').data('shift', $('#channel_tabs__left').data('shift') + $('li').not('.hid').eq($('#channel_tabs__left').data('current') - 1).outerWidth(true));
			$('#channel_tabs__left').data('current', $('#channel_tabs__left').data('current') - 1);
			$('#channel_tabs').css({
				'position': 'relative',
				'left': $('#channel_tabs__left').data('shift') + 'px'
			});
		}
		if($('#channel_tabs__left').data('current') == 0) {
			$('#channel_tabs__left').css({
				'background-position' : '0 0'
			})
		}
		if ($('#channel_tabs__left').data('current') == $('li.channel').not('.hid').length - 1) {
			$('#channel_tabs__right').css({
				'background-position' : '-16px 0'
			});
		} else {
			$('#channel_tabs__right').css({
				'background-position' : '-16px -30px'
			});
		}
	});

	$('#channel_tabs__right').on('click', function() {
		var container_w = $('.channel-tabs-container').outerWidth(true);
		var child_w = 0;
		$('li.channel').not('.hid').each(function() {
			child_w += $(this).outerWidth(true);
		});
		if(container_w > (child_w + $('#channel_tabs__left').data('shift'))) {
			return;
		} else if ($('#channel_tabs__left').data('current') < $('li.channel').not('.hid').length - 1) {
			$('#channel_tabs__left').data('shift', $('#channel_tabs__left').data('shift') - $('li').not('.hid').eq($('#channel_tabs__left').data('current')).outerWidth(true));
			$('#channel_tabs__left').data('current', $('#channel_tabs__left').data('current') + 1);
			$('#channel_tabs').css({
				'position': 'relative',
				'left': $('#channel_tabs__left').data('shift') + 'px'
			});
			if(container_w > (child_w + $('#channel_tabs__left').data('shift'))) {
				$('#channel_tabs__right').css({
					'background-position' : '-16px 0'
				});
			}
		}
		if($('#channel_tabs__left').data('current') > 0) {
			$('#channel_tabs__left').css({
				'background-position' : '0 -30px'
			});
		}
	});
});

$(window).resize(function() {
	cht_settings_carousel_width();
});

function chat_users_sort(frame, user_html) {
	var chat_users_list = $('#chat_users_list', frame);
	var chat_users = chat_users_list.find('div.chat_user_item');
	var i;

	var sortField = userListSortFilter.sortField ? userListSortFilter.sortField : 'nick';
	var sortOrder = userListSortFilter.sortOrder ? userListSortFilter.sortOrder : 'asc';

	var returnOrder = sortOrder == 'asc' ? 1 : -1;

	if (user_html) {
		var data = $(user_html);
		var res_i = null;
		var found = 0;
		for (i = 0; i < chat_users.length; ++i) {
			found = chat_user_sort_compare_items(data[0], chat_users[i], sortField, returnOrder);
			if (found < 0) {
				res_i = i;
				break;
			}
		}
		if (res_i === null) {
			chat_users_list.append(data);
		}
		else {
			chat_users.eq(res_i).before(data);
		}
		return;
	}

	// full sort
	chat_users.sort(function(a, b) {
		return chat_user_sort_compare_items(a, b, sortField, returnOrder);
	});

	chat_users.detach().appendTo(chat_users_list);
}

function chat_user_sort_compare_items(a, b, sortField, returnValue) {
    var tmp1 = parseInt(a.getAttribute('data-located')),
        tmp2 = parseInt(b.getAttribute('data-located'));
    if (tmp1 != tmp2) return tmp2 - tmp1;

	tmp1 = a.getAttribute('data-' + sortField),
	tmp2 = b.getAttribute('data-' + sortField);
	if (userListSortFieldTypes[sortField] && userListSortFieldTypes[sortField] == 'i') {
		tmp1 = parseInt(tmp1, 10);
		tmp2 = parseInt(tmp2, 10);
	}

	if ($.inArray(sortField, ['profession', 'clanid', 'marks', 'injuryweight']) != -1) {
		//вот такой костыль (
		if (tmp1 == 0 && tmp2 != 0) {
			return 1;
		}

		if (tmp2 == 0 && tmp1 != 0) {
			return -1;
		}
	}
	if (sortField == 'profession' && tmp1 == 0 && tmp2 == 0) {
		//вот такой костыль (
		tmp1 = a.getAttribute('data-nick').toLowerCase();
		tmp2 = b.getAttribute('data-nick').toLowerCase();
		returnValue = 1;
	}
	if (tmp1 == tmp2) {
		//вот такой костыль (
		if (sortField == 'profession') {
			tmp1 = parseInt(a.getAttribute('data-profession_skill'), 10);
			tmp2 = parseInt(b.getAttribute('data-profession_skill'), 10);
		} else {
			tmp1 = a.getAttribute('data-nick').toLowerCase();
			tmp2 = b.getAttribute('data-nick').toLowerCase();
			returnValue = 1;
		}
	}
	return tmp1 < tmp2 ? -returnValue : returnValue;
}

function chat_show_user_sort_modes(obj, e) {
	for (var i  = userListSortMenu.length - 1; i >= 0 ; i--) {
		if (userListSortMenu[i].data && userListSortFilter.sortField == userListSortMenu[i].data) {
			userListSortMenu[i].picture = 'url(/images/cell-arr-'+userListSortFilter.sortOrder+'.png) 7px 50% no-repeat';
		} else {
			userListSortMenu[i].picture = 'url(images/blank.gif) no-repeat';
		}
	}

	$(obj).toggleClass('selected');

	gmnu(obj, e, userListSortMenu, {window: true, offsetLeft: -25, className: 'help_menu'});
}

function chat_show_user_search(obj, e) {
	gmnu(obj, e, userListSearchMenu, {window: true, offsetTop: 23, position: 'fixed', keep: true, className: 'help_menu'});
}

function chat_users_update_counters(frame) {
	var chat_users = $('#chat_users_list .chat_user_item', frame);
	chatUserCount = chat_users.not('.ghost').length;
	chatUserEnemyCount = chat_users.filter('.enemy').not('.ghost').length;
	chatUpdateUsersCounters();
}

function chat_get_users_frame() {
	var obj = null;
	if (!_top().chat || !_top().chat.chat_user) return false;
	if (_top().chat.chat_user.document && _top().chat.chat_user.loaded) obj = _top().chat.chat_user.document;
	return obj;
}

function chat_users_can_change(frame) {
	if (frame) {
		if ($('#chat_users_list .list_denied', frame).length) return false;
	} else {
		if ($chat_user_list && !$chat_user_list.find('.area.selected').length) return false;
		if (session.deaf) return false;
	}
	return true;
}

function chat_users_add(id, kind, raid, user_html_friend, user_html_enemy, force) {
	if (!chat_users_can_change()) return;
	var frame = chat_get_users_frame();
	if (!frame) {
		setTimeout(function() {chat_users_add(id, kind, raid, user_html_friend, user_html_enemy);}, 500);
		return;
	}
	if (!chat_users_can_change(frame)) return;
	if (!force && id == CHAT.my_id && $('#chat_users_list #chat_user_'+id, frame).length) return;
	var user_html = '';
	raid = parseInt(raid);
	if (raid && raid == parseInt(session.raid)) user_html = user_html_friend;
	else if (raid) user_html = user_html_enemy;
	else if (kind == session.kind) user_html = user_html_friend;
	else user_html = user_html_enemy;
	user_html = user_html.replace(/\$(\d+)\$/g, shablon_substitution);
	$('#chat_users_list #chat_user_'+id, frame).remove();
	chat_users_sort(frame, user_html);
	var is_after = chat_users_scrolled_after(frame, id, true);
	if (is_after) {
		var height = $('#chat_users_list #chat_user_'+id, frame).height();
		frame.defaultView.scrollBy(0, height);
	}
	chat_users_update_counters(frame);
}

function chat_users_update(id, kind, raid, user_html_friend, user_html_enemy) {
	if (!chat_users_can_change()) return;
	var frame = chat_get_users_frame();
	if (!frame) {
		setTimeout(function() {chat_users_update(id, kind, raid, user_html_friend, user_html_enemy);}, 500);
		return;
	}
	if (!chat_users_can_change(frame)) return;
	if (!$('#chat_users_list #chat_user_'+id, frame).length) return;
	var user_html = '';
	raid = parseInt(raid);
	if (raid && raid == parseInt(session.raid)) user_html = user_html_friend;
	else if (raid) user_html = user_html_enemy;
	else if (kind == session.kind) user_html = user_html_friend;
	else user_html = user_html_enemy;
	user_html = user_html.replace(/\$(\d+)\$/g, shablon_substitution);
	$('#chat_users_list #chat_user_'+id, frame).remove();

	chat_users_sort(frame, user_html);
}

function chat_users_remove(id) {
	if (!chat_users_can_change()) return;
	if (id == CHAT.my_id) return;
	var frame = chat_get_users_frame();
	if (!frame) {
		setTimeout(function() {chat_users_remove(id);}, 500);
		return;
	}
	if (!chat_users_can_change(frame)) return;
	var is_after = chat_users_scrolled_after(frame, id);
	var el = $('#chat_users_list #chat_user_'+id, frame);
	var height = el.height();
	el.remove();
	if (is_after) {
		frame.defaultView.scrollBy(0, -height);
	}
	chat_users_update_counters(frame);
};

function chat_users_fight_update(id, fight_id) {
	if (!chat_users_can_change()) return;
	var frame = chat_get_users_frame();
	if (!frame) {
		setTimeout(function() {chat_users_fight_update(id, fight_id);}, 500);
		return;
	}
	if (!chat_users_can_change(frame)) return;
};

function chat_users_scrolled_after(frame, id, or_next) {
	var win = frame.defaultView;
	var y = win.scrollY ? win.scrollY : win.document.body.scrollTop;
	var chat_user_items = $('#chat_users_list .chat_user_item', frame);
	for (var i = 0; i < chat_user_items.length; ++i) {
		var el = chat_user_items.eq(i);
		if (or_next && chat_user_items.eq(i + 1).data('id') == id) {
			return true;
		} else if (el.data('id') == id) {
			return true;
		} else if (el.offset().top >= y) {
			return false;
		}
	}
	return false;
};

function chatReceiveObject(objects) {
	for (var i in objects) {
		var fnc, fnc_name = 'controller_' + i.replace('|', '_');
		try {
			fnc = eval(fnc_name);
			if (typeof fnc == 'function') {
				var object = {};
				object[i] = objects[i];
				fnc.call(this, object);
			}
		} catch (e) {}
	}
}

function controller_party_conf(data){
	if(_top && _top().frames['chat']) _top().frames['chat']['party_leader'] = (data['party|conf'].is_party_leader);
}

function controller_chat_area_population_diff(object) {
	//обрабаотываем данные только если включена вкладка area
	if ($chat_user_list.find('li.selected').data('type') != 'area') {
		return;
	}

	object = object['chat|area_population_diff'] || null;
	if (!object || typeof(object) != 'object') return;
	object.replace = object.replace || false;
	object['delete'] = object['delete'] || {};
	object.update = object.update || {};
	object.add = object.add || {};

	if (object.replace && replace_chat_users(object.replace)) {
		chat_users_update_counters(chat_get_users_frame());
		return;
	}
	var i;
	for (i in object['delete']) {
		chat_users_remove(object['delete'][i].id);
	}
	for (i in object.update) {
		var user = object.update[i];
		chat_users_update(user.id, user.kind, user.raid_id, user.html_friend, user.html_enemy);
	}
	for (i in object.add) {
		var user = object.add[i];
		chat_users_add(user.id, user.kind, user.raid_id, user.html_friend, user.html_enemy);
	}
	chat_users_update_counters(chat_get_users_frame());
}

function replace_user_list(users) {
	if (!users) return;
	var user_html = '';
	for (var i in users) {
		var user = users[i];
		var raid = parseInt(user['raid_id']);
		var kind = parseInt(user['kind']);
		var html = '';
		if (raid && raid == parseInt(session.raid)) html = user['html_friend'];
		else if (raid) html = user['html_enemy'];
		else if (kind == session.kind) html = user['html_friend'];
		else html = user['html_enemy'];
		user_html += html;
	}
	user_html = user_html.replace(/\$(\d+)\$/g, shablon_substitution);
	var frame = chat_get_users_frame();
	$('#chat_users_list ', frame).eq(0).html(user_html);
	chat_users_sort(frame);
}

function replace_chat_users(users) {
	var frame = chat_get_users_frame(),
		user_list = $('#chat_users_list .chat_user_item', frame),
		scrolled_users = [],
		replaced_users_count = 0,
		current_scroll = 0,
		last_visible_user_scroll = 0;

	user_list.each(function () {
		var id = $(this).data('id');
		if (chat_users_scrolled_after(frame, id)) {
			scrolled_users.push(id);
		}
	});

	replace_user_list(users);
	user_list.each(function () {
		var id = parseInt($(this).data('id'));
		if ($.inArray(id, scrolled_users) != -1) {
			last_visible_user_scroll = current_scroll;
		}
		current_scroll += $('#chat_users_list #chat_user_'+id, frame).height();
		replaced_users_count++;
	});
	frame.defaultView.scrollTo(0, last_visible_user_scroll);
	
	return replaced_users_count;
}

function controller_chat_area_population(object) {
	if ($chat_user_list.find('li.selected').data('type') != 'area') {
		return;
	}

	object = object['chat|area_population'] || null;
	if (!object || !object.users) return;
	replace_user_list(object.users);
	chat_users_update_counters(chat_get_users_frame());
}

function controller_common_debug(object) {
	object = object['common|debug'] || null;
	if (object.request_statistics) {
		var str_stat = '';
		for (var i in object.request_statistics) {
			if (i == 0) {
				object.request_statistics[i] = '['+object.server_time + '] ' + object.request_statistics[i];
				console_group(object.request_statistics[i], true);
			}
			else console_log(object.request_statistics[i]);

			str_stat += object.request_statistics[i]+'|';
		}
		console_groupEnd();
		_top().REQUEST_STATISTICS += "\n" + str_stat;
	}
	if (object.vardump) {
		for (var i in object.vardump) {
			console_log(object.vardump[i]);
		}
	}
}

function controller_user_bag_kinds_diff(object) {
	object = object['user|bag_kinds_diff'] || null;
	if (!object || typeof(object) != 'object' || !object.kind_ids) return;
	var kind_ids = [];
	for (var i in object.kind_ids) kind_ids.push(object.kind_ids[i])
	_top().tUnsetBackpackGroup(kind_ids);
}

function controller_front_conf(object) {
	swfTransfer('small', 'area', 'from_small@front_conf=1');//temporary
	swfObject('area', object);
}

function controller_pet_rename_success(object) {
	object = object['pet|rename_success'] || null;
	if (typeof(_top().frames.main_frame.frames.backpack.updatePetInList) == "function") {
		_top().frames.main_frame.frames.backpack.updatePetInList(object['pet_id'], {title: object['new_name']});
	}
}

function controller_pet_new_pet(object) {
	if (typeof(_top().frames.main_frame.frames.backpack) != "undefined") {
		var $top_menu_pet = $(_top().frames.main_frame.frames.backpack.document).find(".tbl-sts_top a.menu-pets");
		if (!$top_menu_pet.length) {
			return;
		}

		if (!$top_menu_pet.hasClass("tbl-shp_menu-center-noact")) {
			return;
		}

		$top_menu_pet
			.removeClass("tbl-shp_menu-center-noact")
			.addClass("tbl-shp_menu-center-inact")
			.attr({href: "?mode=pets", title: "", target:"_self"});
	}
}

function controller_user_view(object) {
	try {
		if (typeof(_top().frames['main_frame'].frames['main'].external_controller_queue) != "undefined") {
			if (!object['user|view'].skip_external) {
				object['user|view'].skip_external = true;
				_top().frames['main_frame'].frames['main'].external_controller_queue.push(object);
				return;
			}
		}
		
		swfObject('lvl', object);
		swfObject('inventory', object);

		var user_view = object['user|view'] || false;
		if (!user_view) return;
		
		if (typeof(user_view['is_mount']) != "undefined" && typeof(user_view['mount_id']) != "undefined") {
			swfObject('items_right', {
				'user|mount': {
					'status': DATA_OK,
					'is_mount': user_view['is_mount'],
					'mount_id': user_view['mount_id']
				}
			});
		}

		var artifact_alts = user_view['artifact_alts'] || false;
		if (!artifact_alts) return;
		_top().main_frame.backpack = _top().main_frame.backpack || {};
		_top().main_frame.backpack.art_alt = _top().main_frame.backpack.art_alt || {};
		for (var i = 0; i < artifact_alts.length; i++) {
			var alt = artifact_alts[i];
			_top().main_frame.backpack.art_alt[alt.artifact_alt_id] = alt;
		}
		if (isInClient()) {
			var url = 'main_iframe.php?mode=update_swf&tar[]=lvl';
			_top().frames['main_frame'].frames['main_hidden'].location.href = url;
		}
		updateAltEffects(user_view.temp_effects);
		updatePetEffects(user_view.pet_effects);
	} catch (e) {}
}

function controller_user_effects(object) {
	swfObject('items', object);
}

function controller_instance_conf(object) {
	swfObject('instance', object);
}

function controller_common_event_conf(object) {
	swfObject('area', object);
}

function controller_fight_count(object) {
	swfObject('area', object);
}

function controller_common_area_conf(object) {
	try {
		swfObject('area', object);
		var area_conf = object['common|area_conf'] || null;
		if (!area_conf) return;
		var set_cookie = area_conf['set_cookie'] || null;
		if (!set_cookie) return;
		for (var i in set_cookie) {
			_top().setCookie(i, set_cookie[i]);
		}
	} catch(e) {}
}

function controller_common_top_menu(object) {
	swfObject('top_mnu', object);
}

function controller_common_current_slot(object) {
	swfObject('items', object);
}

function controller_common_resurrection_modes(object) {
	swfObject('area', object);
}

function controller_magic_mirror_end_time(object) {
	swfObject('area', object);
}

function controller_common_action(object) {
	object = object['common|action'] || null;
	if (!object) return;
	if (object['redirect_error'] && !object['redirect_url']) {
		showError(object['redirect_error']);
	}
}

function controller_common_action_complete(object) {
	swfObject('area', object);
    swfObject('items_right', {'instapockets|init': true});
}

function controller_common_payment_complete(object) {
	if (_top().frames['main_frame'] && _top().frames['main_frame'].frames['main'] && _top().frames['main_frame'].frames['main'].__bank_buy_php__) {
		if (_top().iframe == 'main') {
			_top().frames['main_frame'].frames['main'].location.reload();
		} else {
			tUnsetFrame('main');
		}
	}
}

function controller_chat_session_state(obj) {
	if (obj['chat|session_state']['session_state']) {
		sessionUpdate(obj['chat|session_state']['session_state']);
	}
}

function controller_bg_update_daystate(obj) {
	if (typeof(session) != "object") {
		swfObject('top_mnu', {"bgFilledState": 0});
		return;
	}

	if (session['no_update_bg_state']) {
		swfObject('top_mnu', {"bgFilledState": 0});
		return;
	}

	var states = obj['bg|update_daystate']['states'];
	if (typeof(states) != "object") {
		swfObject('top_mnu', {"bgFilledState": 0});
		return;
	}

	var state_keys = Object.keys(states),
		state_data,
		bg_state = 0;
	for (var i = state_keys.length - 1; i >= 0; i--) {
		state_data = state_keys[i].split('_');
		if (parseInt(state_data[1] ,10) != parseInt(session.kind, 10)) {
			continue;
		}

		if (parseInt(state_data[2] ,10) < parseInt(session.level, 10)) {
			continue;
		}

		if (parseInt(state_data[3] ,10) > parseInt(session.level, 10)) {
			continue;
		}
		
		bg_state = parseInt(states[state_keys[i]], 10);
		break;
	}
	
	swfObject('top_mnu', {"bgFilledState": bg_state});
}

function controller_offauction_new_lot(obj) {
	if (typeof(session) != "object") {
		getSWF('top_mnu').blinkButton(9, false);
		return;
	}
	if (obj['offauction|new_lot'].user_kind && session.kind != obj['offauction|new_lot'].user_kind ) {
		getSWF('top_mnu').blinkButton(9, false);
		return;
	}
	if (session['update_auc_state']) {
		getSWF('top_mnu').blinkButton(9, true);
		return;
	}
}

function controller_cube_puton(obj) {
	swfObject('cube', obj);
}

function controller_cube_putoff(obj) {
	swfObject('cube', obj);
}

function controller_cube_craft(obj) {
	swfObject('cube', obj);
}

function controller_cube_use_recipe(obj) {
	swfObject('cube', obj);
}

function controller_wheelfortune_init(obj) {
	swfObject('wheel_fortune', obj);
}

function controller_wheelfortune_new_game(obj) {
	swfObject('wheel_fortune', obj);
}

function controller_wheelfortune_spin(obj) {
	swfObject('wheel_fortune', obj);
}

function controller_user_puzzle_start(obj) {
	var params = obj['user|puzzle_start'];
	if (!params) {
		return;
	}
	startPuzzle({
		pictureURI: params['picture'], 
		segmentsOnSide: params['complexity'], 
		width: parseInt(params['width'], 10) + 42, 
		height: parseInt(params['height'], 10) + 100, 
		quickStart: params['quickStart'],
		useCanvas: params['useCanvas']
	});
}