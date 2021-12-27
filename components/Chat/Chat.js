const fs = require('fs')
const path = require('path')
const filePath = path.join(path.resolve(), 'logs', 'chat.log')
const configService = require('../../services/ConfigService')
var logStream = fs.createWriteStream(filePath, {flags: 'a'});

var msg_max = 100

var checkLmtsProxyReady = function() {
    lastMsgTime = time_current();
    var proxyRef = top[1].document.lmts_proxy;
    if(proxyRef && typeof proxyRef.connect !== 'undefined') {
        top[1].debugLog('lmts proxy ready');
        lastMsgTime = time_current();
        top[1].LMTS = top[1].esrv(proxyRef);

        top[1].LMTS.onError = function(code, msg) {
            top[1].debugLog('esrv error code=' + code + ' msg=' + msg);
        };

        top[1].LMTS.onConnect = function() {
            top[1].debugLog('lmts connected', true);
        };

        top[1].LMTS.onAuth = function() {
            top[1].debugLog('lmts authorized');
            $.get(top[1].chatUrl, {
                subscribe: 1
            });
        };

        var lmtsRequestRef = top[1].LMTS.request;
        top[1].LMTS.request = function(data, success, fail) {
            top[1].debugLog('data send ' + vardump(data));
            lmtsRequestRef(data, success, fail);
        };
        top[1].LMTS.reconnect = top[1].chatTotalReconnect;
        top[1].LMTS.onData = function(data) {
            top[1].debugLog('data recv ' + vardump(data));
        };
        top[1].LMTS.onDisconnect = function() {
            top[1].debugLog('onDisconnect');
            top[1].LMTS.reconnect();
        };

        top[1].LMTS.connect(top[1].CHAT.conf);

        top[1].LMTS.onNotify = function(data) {
            top[1].chatReceiveMessage(data)
        }
        return;
    }
};

function setupChatTotalReconnect() {
    top[1].chatTotalReconnect = function() {
        if(top[1].reconnecting || !top[1].LMTS) return false;
        if(!top[1].LMTS.ever_authorized() && time_current() - top[1].lastMsgTime <= top[1].lastMsgMaxTimeDiff) return false;
        ++top[1].reconnection_counter;
        if(top[1].reconnection_counter > 5) {
            var text = top[1].CHAT.str.not_available;
            if(top[1].lastMsg != text) {
                top[1].chatSysMsg(text);
                $('#lmts_swfs').html('');
                top[1].LMTS = false;
            }
            return false;
        }
        top[1].reconnecting = true;
        return $.ajax({
            url: top[1].chatUrl,
            data: {
                login: 1
            },
            dataType: 'json',
            success: function(data) {
                if(data) {
                    top[1].debugLog('conn data received', data);
                    var lmts_swfs = $('#lmts_swfs');
                    lmts_swfs.find('script').remove();
                    lmts_swfs.html(lmts_swfs.html());
                    top[1].CHAT.conf = data;
                    checkLmtsProxyReady()
                } else {
                    top[1].lastMsgTime = time_current();
                    top[1].LMTS.reset_auth();
                }
                top[1].reconnecting = false;
            },
            error: function() {
                top[1].lastMsgTime = time_current();
                top[1].LMTS.reset_auth();
                top[1].reconnecting = false;
            }
        });
    };
}

function setupChatInterval() {
    var chat_interval = setInterval(async function() {
        if(Object.keys(top[1].LMTS).length > 0) {
            if(!top[1].LMTS.isConnected() || !top[1].LMTS.isAuthorized()) {
                checkLmtsProxyReady()
            }
        }
        if(top[1].LMTS == false || top[1].LMTS == true) {
            checkLmtsProxyReady()
        }
        chatConnectionChecker()
    }, 3000)

    function chatConnectionChecker() {
        if(!top[1].lastMsgTime || !top[1].LMTS || top[1].reconnecting) return false;
        if(time_current() - top[1].lastMsgTime > top[1].lastMsgMaxTimeDiff) {
            checkLmtsProxyReady()
            return true;
        }
        return false;
    }
}

function setupReceiver() {

    top[1].chatReceiveMessage = function(msg) {
        if(msg["object"] && !msg["object"]["chat|message"]) {
            top[1].chatReceiveObject(msg["object"]);
            return;
        }
        try {
            msg = msg["object"] ? msg["object"]["chat|message"]["message"]["msg"] : msg;
        } catch (e) {}
        if(!msg || msg.to_admin && !top[1].CHAT.admin) return;
        if(msg.delay) {
            var delay = 0;
            if(msg.type == top[1].top[1].msg_type.broadcast) {
                delay = _top().myId % 600;
            } else {
                delay = parseInt(msg.delay);
                if(isNaN(delay)) delay = 0;
            }
            delete msg.delay;
            setTimeout(function() {
                top[1].chatReceiveMessage(msg);
            }, delay * 1000);
            return false;
        }
        if(!top[1].chat_check_chat_text_ready(function() {
                top[1].chatReceiveMessage(msg);
            })) return false;
        msg.type = msg.type || top[1].msg_type.def;
        msg.id = ++top[1].next_msg_id;
        var originalMsgObject = jQuery.extend(true, {}, msg);
        top[1].lastMsgTime = time_current();
        top[1].reconnection_counter = 0;
    
        var scrollCurrent = _top().frames['chat'].frames['chat_text'].scrollY ? _top().frames['chat'].frames['chat_text'].scrollY : _top().frames['chat'].frames['chat_text'].document.body.scrollTop;
        var scrollMax = getScrollMaxY(_top().frames['chat'].frames['chat_text']);
    
        var mymsg = (msg.channel == top[1].channels.user || msg.user_id == top[1].session.id || (msg.to_user_ids && (msg.to_user_ids[top[1].session.id])));
        if(top[1].session.no_sys_msg && msg.type != top[1].msg_type.def && !msg.urgent && !mymsg && msg.type != top[1].msg_type.special && !msg.chaotic_request)
            return;
        if(msg.user_level_start > 0 && top[1].session.level && top[1].session.level < msg.user_level_start)
            return false;
        if(msg.user_level_end > 0 && top[1].session.level && top[1].session.level > msg.user_level_end)
            return false;
        if(msg.user_not_xserver && top[1].session.xserver)
            return false;
        if(parseInt(msg.no_premium) && parseInt(top[1].session.premium)) {
            return false;
        }
        if(parseInt(msg.chaotic_request) && parseInt(top[1].session.no_chaotic_request_msg)) {
            return false;
        }
        if(parseInt(msg.wheel_msg) && parseInt(top[1].session.wf_msg_ok)) {
            return false;
        }
    
        var can_hidden_view = msg.user_id == top[1].CHAT.my_id || top[1].CHAT.mentor || top[1].CHAT.admin;
        if(msg.hidden && !can_hidden_view)
            return false;
    
        var no_fight_id = parseInt(msg.no_fight_id);
        if(no_fight_id && (no_fight_id == parseInt(top[1].session.fight_id))) {
            return false;
        }
        if(msg.no_area_ids && msg.no_area_ids[top[1].session.loc_id]) {
            return false;
        }
        if(msg.event_id && msg.event_notify && !top[1].CHAT.track_events[msg.event_id]) {
            return false;
        }
        if(top[1].session.deaf && msg.type == top[1].msg_type.def)
            return false;
    
        for(var i in top[1].chatOpts) {
            var data = top[1].chatOpts[i].data;
            if(data.children().length == msg_max) {
                $(data.children()[0]).remove();
            }
        }
    
        if(msg.translate) {
            msg.msg_text = msg.translate[top[1].session.lang]['text'];
            msg.macros_list = msg.translate[top[1].session.lang]['macros_list'];
            if(!msg.msg_text && 'en' in msg.translate) {
                msg.msg_text = msg.translate.en.text;
                msg.macros_list = msg.translate.en.macros_list;
            }
            if(!msg.msg_text && 'ru' in msg.translate) {
                msg.msg_text = msg.translate.ru.text;
                msg.macros_list = msg.translate.ru.macros_list;
            }
            delete msg.translate;
        }
    
        if(msg.macros_list && msg.msg_text) {
            for(var macro_id in msg.macros_list) {
                msg.msg_text = common_macro_resolve(macro_id, msg.macros_list[macro_id].name, msg.macros_list[macro_id].data, msg.msg_text);
            }
        }
    
        var msg_dom = null;
        var client_text = msg.msg_text;
        if(msg.type == top[1].msg_type.special) {
            switch (msg.code) {
                case top[1].chat_code.reset:
                    top[1].parent.timer = 180;
                    var txt = top[1].CHAT.str.restarting;
                    txt = txt.replace('%s', '3 ' + top[1].CHAT.str.minutes);
                    msg_dom = $(txt);
                    for(var i in top[1].chatOpts) {
                        top[1].chatOpts[i].data.append(msg_dom);
                    }
                    return false;
                case top[1].chat_code.redirect:
                    try {
                        _top().frames.main_frame.frames.main[msg.param && msg.param.flag ? msg.param.flag : 'document'].location.href = msg.param.url;
                    } catch (e) {};
                    return false;
                case top[1].chat_code.title:
                    try {
                        _top().document.title = msg.param.msg_text;
                    } catch (e) {};
                    return false;
                case top[1].chat_code.calljs:
                    msg.param.func = base64_decode(msg.param.func);
                    try {
                        eval('_top().frames.main_frame.frames.main.' + msg.param.func);
                    } catch (e) {
                        try {
                            eval('_top().frames.main_frame.' + msg.param.func);
                        } catch (e2) {
                            try {
                                eval('_top().frames.chat.' + msg.param.func);
                            } catch (e3) {};
                        };
                    };
                    return false;
            }
        } else {
            if(!msg.msg_text) return false;
    
            for(var i in top[1].IGNORED) {
                if(i == msg.user_nick && top[1].IGNORED[i]) return false;
            }
    
            msg_dom = top[1].chatFormatMessage(msg);
    
            if((jQuery.inArray(msg.type, [top[1].msg_type.report, top[1].msg_type.report_answer]) != -1) && !jQuery.isEmptyObject(msg.report_msg)) {
                if(msg.report_msg.macros_list && msg.report_msg.msg_text) {
                    for(var macro_id in msg.report_msg.macros_list) {
                        msg.report_msg.msg_text = common_macro_resolve(macro_id, msg.report_msg.macros_list[macro_id].name, msg.report_msg.macros_list[macro_id].data, msg.report_msg.msg_text);
                    }
                }
    
                // prepare complain message text for client
                var date = new Date((parseInt(msg.report_msg.stime) + top[1].session.time_offset + new Date().getTimezoneOffset() * 60) * 1000);
                var hours = date.getHours();
                var minutes = '0' + date.getMinutes();
                client_text += hours + ':' + minutes.substr(minutes.length - 2);
                client_text += ' ' + msg.report_msg.user_nick + ' » ';
                var nicks = [];
                if(typeof(msg.report_msg.to_user_nicks) === 'object') {
                    for(var to_user_id in msg.report_msg.to_user_nicks) {
                        if(parseInt(to_user_id)) nicks.push(msg.report_msg.to_user_nicks[to_user_id]);
                    }
                }
                if(nicks.length) client_text += nicks.join(', ') + ': ';
                client_text += msg.report_msg.msg_text;
    
                var report_msg = $(top[1].chatFormatMessage(msg.report_msg)).css('display', 'inline');
                var original_msg = $(msg_dom).css('display', 'inline').attr('original-msg-object', JSON.stringify(msg.report_msg));
                msg_dom = $('<div class="JS-MsgContainer"></div>').append(original_msg).append(report_msg);
                if(msg.type == top[1].msg_type.report_answer) msg_dom.addClass('opacity-50');
            } else if(msg.type == top[1].msg_type.def) {
                msg_dom = $(msg_dom);
                if(originalMsgObject.channel == top[1].channels.user) {
                    originalMsgObject.to_user_ids = typeof(originalMsgObject.to_user_nicks) === 'object' ? Object.keys(originalMsgObject.to_user_nicks) : originalMsgObject.to_user_ids;
                }
                msg_dom.attr('original-msg-object', JSON.stringify(originalMsgObject));
            }
        }
    
        for(var i in top[1].chatOpts) {
            var opt = top[1].chatOpts[i];
            for(var k in top[1].chatDependent) {
                if(opt.channel & k) {
                    opt.channel |= top[1].chatDependent[k];
                }
            }
            // if (top[1].CHAT.channel_settings[i] && !top[1].CHAT.channel_settings[i].sys_msgs && msg.type != top[1].msg_type.def && !msg.urgent && !mymsg) continue;
            if((msg.channel == top[1].channels.user) || opt.channel & msg.channel || msg.type == top[1].msg_type.system || msg.type == top[1].msg_type.broadcast) {
                if(msg.channel != top[1].channels.user && msg.channel != top[1].channels.aux && !(opt.channel & top[1].channels.area) && !msg.command && (msg.type == top[1].msg_type.system && !(opt.system_msgs && (msg.channel & opt.channel))) && !msg.urgent)
                    continue;
                if(msg.type == top[1].msg_type.system && msg.command && !(opt.channel & msg.channel)) continue;
    
                if(top[1].chatButtonState['priv_btn'] && msg.chaotic_request || !top[1].chatButtonState['priv_btn'] || (msg.channel == top[1].channels.user) || !top[1].chatButtonState['priv_btn'] && (msg.type == top[1].msg_type.system) || (msg.user_id == top[1].session.id) ||
                    (msg.to_user_ids && inarray(msg.to_user_ids, top[1].session.id)) || msg.type == top[1].msg_type.broadcast || (msg.type == top[1].msg_type.system && msg.event_notify)) {
                    opt.data.append($(msg_dom).clone());
                }
            }
        }

        // Message DOM handler
        let node = $(msg_dom).get()[0].cloneNode(true)
        node.removeAttribute('original-msg-object')
        node.querySelectorAll("*").forEach(elem => {
            elem.removeAttribute('oncontextmenu')
            elem.removeAttribute('onmousedown')
            elem.removeAttribute('onclick')
            elem.removeAttribute('href')
        })
        let html = node.outerHTML
        html = html.replaceAll('src="images/', `src="${configService.baseUrl()}/images/`).replaceAll('src="/images/', `src="${configService.baseUrl()}/images/`)
        html = html.replaceAll('href="/artifact_info.php', `href="${configService.baseUrl()}/artifact_info.php`)
        logStream.write(html + '\n');
    
        client_msg = {};
        client_msg.data = {};
        client_msg.data.msg = client_text.split('"').join('\\"');
        client_msg.data.ctime = parseInt(msg.stime + top[1].session.time_offset + new Date().getTimezoneOffset() * 60);
        if(msg.user_nick)
            client_msg.data.from = msg.user_nick;
        client_msg.data.type = top[1].channels_flip[msg.channel];
        if(msg.type == top[1].msg_type.system) {
            client_msg.data.type = 'aux';
        }
        if(client_msg.data.type == 'area_subchannel') {
            client_msg.data.type = 'area';
        }
        client_msg.data.recipient_list = [];
        for(var key in msg.to_user_nicks) {
            client_msg.data.recipient_list.push(msg.to_user_nicks[key]);
        }
        _top().clientExchangePut(vardump(client_msg).replace(/<\/?[^>]+>/gi, ''));
        console.log(client_msg.data)
        top[1].chatScrollToBottom();
        if(top[1].msie7) top[1].chatUpdateDataAttach();
        return true;
    }
}

module.exports = { checkLmtsProxyReady, setupChatTotalReconnect, setupChatInterval, setupReceiver }