// @ts-nocheck
import ConfigService from "../Services/ConfigService";

var art_alt = null

function gebi(id) {
    return document.getElementById(id) || document[id];
}

function setupArtAlt(items) {
    art_alt = items
}

function artifactAltSimple(artifact_id, show, evnt) {
    var artifact_alt = gebi('artifact_alt')

    if(!artifact_alt) return 0;

    if(show == 2) {
        artifact_alt.innerHTML = renderArtifactAlt('AA_' + artifact_id);

        document.onmousemove = function(e) {
            artifactAltSimple(artifact_id, 1, e || window.event);
        };
    }

    if(!show) {
        artifact_alt.style.display = 'none';
        artifact_alt.innerHTML = '';

        document.onmousemove = function() {};

        return 1;
    }

    if((show == 1) && (artifact_alt.style.display != 'block')) {
        artifact_alt.style.display = 'block';
    }

    var x, y, sx, sy, prnt,

        top = _top(),
        iframeShift = getIframeShift(),
        bodyRect = top.document.body.getBoundingClientRect(),

        quirksIE = (top.document.documentMode && top.document.documentMode === 5) ? true : false;

    sx = 0;
    sy = 0;

    if(evnt) {
        prnt = evnt.target;
        x = evnt.clientX + iframeShift.left;
        y = evnt.clientY + iframeShift.top;

        if(x + artifact_alt.offsetWidth > bodyRect.right) {
            x -= artifact_alt.offsetWidth + 20;
        }

        if(x < 0) {
            x = (evnt.clientX + iframeShift.left) - artifact_alt.offsetWidth / 2;
        }

        if(y + artifact_alt.offsetHeight > bodyRect.bottom) {
            y -= artifact_alt.offsetHeight + 20;
        }

        if(y < 0) {
            y = evnt.clientY + iframeShift.top + 10;
        }

        artifact_alt.style.position = 'fixed';
        artifact_alt.style.left = x + sx + 10 + 'px';
        artifact_alt.style.top = y + sy + 10 + 'px';
    }

    return 1;
}

export default {
    artifactAltSimple,
    setupArtAlt
}

function renderArtifactAlt(id) {
    var a = get_art_alt(id);

    if(!a) {
        return '';
    }

    var bg = true;
    var i = 0;
    var content = '';

    content = `<head><style>#artifact_alt {
        font-family: Tahoma, Geneva, sans-serif;
        font-size: 11px;
    }</style><head>`
    content += '<table width="300" border="0" cellspacing="0" cellpadding="0" style="background-color:#FBD4A4;">'
    content += `<tr><td width="14" class="aa-tl aa-tl-n"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="4"></td>`
    content += `<td class="aa-t aa-t-n" align="center"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="1" height="4"></td>`
    content += `<td width="14" class="aa-tr aa-tr-n"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="4"></td></tr>`
    content += `<tr><td width="14" class="aa-tl aa-tl-n" style="background-position: 0 50%"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="16"></td>`
    content += '<td class="aa-t aa-t-n" align="center" style="vertical-align:middle; background-position: 0 50%"><b style="color:' + a.color + '">' + a.title + '</b></td>';
    content += `<td width="14" class="aa-tr aa-tr-n" style="background-position: 0 50%"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="16"></td></tr>`
    content += `<tr><td width="14" class="aa-tl-h-l"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="4"></td>`
    content += `<td class="aa-t-h-c" align="center"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="1" height="4"></td>`
    content += `<td width="14" class="aa-tr-h-r"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="14" height="4"></td></tr>`
    content += '<tr><td class="aa-l" style="padding:0;"></td><td style="padding:0;">';
    content += '<table width="275" style=" margin: 3px" border="0" cellspacing="0" cellpadding="0"><tr>';
    content += '<td align="center" valign="top" width="60">';
    if(!a.image.includes(ConfigService.getSettings().baseUrl)) {
        a.image = ConfigService.getSettings().baseUrl + a.image
    }
    content += '<table width="60" height="60" cellpadding="0" cellspacing="0" border="0" style="margin: 2px" background="' + a.image + '"><tr><td valign="bottom">';

    if(a.enchant_icon && a.enchant_icon != undefined) {
        if(!a.enchant_icon.includes(ConfigService.getSettings().baseUrl)) {
            a.enchant_icon = a.enchant_icon.replaceAll("/images/", `${ConfigService.getSettings().baseUrl}/images/`)
        }
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
    content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/tbl-shp_item-icon.gif" width="11" height="10" align="absmiddle">&nbsp;` + a.kind + `</div>`
    if(a.dur != undefined) {
        if(a.flags2 && a.flags2.crashproof && a.flags2.crashproof != undefined) {
            content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/tbl-shp_item-iznos.gif" width="11" height="10" align="absmiddle"> <span class="red">` + a.flags2.crashproof + `</span></div>`
        } else
            content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/tbl-shp_item-iznos.gif" width="11" height="10" align="absmiddle"> <span class="red">` + a.dur + '</span>/' + a.dur_max + `</div>`
    }
    if(a.com && a.com != undefined) {
        content += '<div class="b red">' + a.com.title + ' ' + a.com.value + '</div>';
    }
    if(a.owner && a.owner != undefined) {
        content += '<div><b class="b red">' + a.owner.title + '</b>' + a.owner.value + '</div>';
    }
    content += '</td><td>';
    if(a.lev && a.lev != undefined) {
        content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/tbl-shp_level-icon.gif" width="11" height="10" align="absmiddle"> ` + a.lev.title + ` <b class="red">` + a.lev.value + `</b></div>`;
    }
    if(a.trend && a.trend != undefined) {
        content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/tbl-shp_item-trend.gif" width="11" height="10" align="absmiddle">&nbsp;` + a.trend.replace(/&quot;/g, '"') + `</div>`
    }
    if(a.cls && a.cls != undefined) {
        content += `<div><img src="${ConfigService.getSettings().baseUrl}/images/class.gif" width="11" height="10" align="absmiddle">`;
        for(i = 0; i < a.cls.length; i++) {
            if(!a.cls[i].includes(ConfigService.getSettings().baseUrl)) {
                a.cls[i] = a.cls[i].replace('/images/', `${ConfigService.getSettings().baseUrl}/images/`)
            }
            content += a.cls[i].replace(/&quot;/g, '"');
        }
        content += '</div>'
    }
    content += '</td></tr></table>';
    content += '<table width="100%" cellpadding="0" cellspacing="0" border="0">';
    if(a.skills && a.skills != undefined && a.skills.length) {
        for(i = 0; i < a.skills.length; i++) {
            content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.skills[i].title + '</td><td class="red" align="right">' + a.skills[i].value + '</td></tr>';
            bg = !bg;
        }
    }
    if(a.skills_e && a.skills_e != undefined && a.skills_e.length) {
        for(i = 0; i < a.skills_e.length; i++) {
            content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.skills_e[i].title + '</td><td class="red" align="right">' + a.skills_e[i].value.replace(/&quot;/g, '"') + '</td></tr>';
            bg = !bg;
        }
    }
    if(a.enchant && a.enchant != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant.title + '</td><td class="red" align="right">' + a.enchant.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.symbols && typeof(a.symbols) == "object") {
        var symbol, isDisplaySymbolLabel = false;

        for(i in a.symbols) {
            if(!a.symbols.hasOwnProperty(i)) {
                continue;
            }

            symbol = a.symbols[i];
            content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + (isDisplaySymbolLabel ? '&nbsp;' : symbol.title) + '</td><td class="red" align="right">' + symbol.value.replace(/&quot;/g, '"') + '</td></tr>';
            bg = !bg;
            isDisplaySymbolLabel = true;
        }
    }

    if(a.enchant_mod && a.enchant_mod != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant_mod.title + '</td><td class="red" align="right">' + a.enchant_mod.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.enchant3 && a.enchant3 != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant3.title + '</td><td class="red" align="right">' + a.enchant3.value + '</td></tr>';
        bg = !bg;
    }
    if(a.enchant4 && a.enchant4 != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.enchant4.title + '</td><td class="red" align="right">' + a.enchant4.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.superstructure && a.superstructure != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.superstructure.title + '</td><td class="red" align="right">' + a.superstructure.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.set && a.set != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td>' + a.set.title + '</td><td class="red" align="right">' + a.set.value.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.change && a.change != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="dredd b">' + a.change + '</td></tr>';
        bg = !bg;
    }

    if(a.nogive && a.nogive != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="redd b">' + a.nogive + '</td></tr>';
        bg = !bg;
    }
    if(a.clan_thing && a.clan_thing != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="violet b">' + a.clan_thing + '</td></tr>';
        bg = !bg;
    }
    if(a.boe && a.boe != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="redd b">' + a.boe + '</td></tr>';
        bg = !bg;
    }
    if(a.noweight && a.noweight != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="grnn b">' + a.noweight + '</td></tr>';
        bg = !bg;
    }
    if(a.can_anonim && a.can_anonim != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2" class="grnn b">' + a.can_anonim + '</td></tr>';
        bg = !bg;
    }

    if(a.note && a.note != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.note + '</td></tr>';
        bg = !bg;
    }
    if(a.perp && a.perp != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2"><span class="grnn b">' + a.perp.title + ':</span> ' + a.perp.value + '</td></tr>';
        bg = !bg;
    }
    if(a.engrave && a.engrave != undefined) {
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.engrave + '</td></tr>';
        bg = !bg;
    }
    if(a.rank_min && a.rank_min != undefined) {
		if(!a.rank_min.includes(ConfigService.getSettings().baseUrl)) {
			a.rank_min = a.rank_min.replace('/images/', `${ConfigService.getSettings().baseUrl}/images/`)
		}
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.rank_min.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    if(a.desc && a.desc != undefined) {
        if(!a.desc.includes(ConfigService.getSettings().baseUrl)) {
			a.desc = a.desc.replaceAll('/images/', `${ConfigService.getSettings().baseUrl}/images/`)
		}
        content += '<tr class="skill_list ' + (bg ? 'list_dark' : '') + '"><td colspan="2">' + a.desc.replace(/&quot;/g, '"') + '</td></tr>';
        bg = !bg;
    }
    content += '</table>';
    content += '</td><td class="aa-r" style="padding: 0"></td></tr>';
    content += `<tr><td class="aa-bl"></td><td class="aa-b"><img src="${ConfigService.getSettings().baseUrl}/images/d.gif" width="1" height="5"></td><td class="aa-br"></td></tr>`
    content += '</table>';
	
    return content;
}

function get_art_alt(id, win) {
    if(win) {
        if(win.art_alt && win.art_alt[id]) return win.art_alt[id];
        for(var i = 0; i < win.frames.length; ++i) {
            var res = get_art_alt(id, win.frames[i]);
            if(res !== false) return res;
        }
        return false;
    }
    if(art_alt && art_alt[id]) return art_alt[id];
    if(_top().items_alt && _top().items_alt[id]) return _top().items_alt[id];
    return get_art_alt(id, _top().frames['main_frame']);
}

function _top() {
    if(window.last_top) return window.last_top;
    var p = window;
    while(true) {
        try {
            if(p.location.href.match(/main\.php/) || p.parent === p) {
                break;
            }
        } catch (e) {
            window.last_top = p;
            return p;
        }
        p = p.parent.window;
    }
    window.last_top = p;
    return p;
}

function getIframeShift() {
    var currentWindow = window,
        currentFrame = null,

        docElem = null,
        body = null,

        top = 0,
        left = 0,

        scrollTop = 0,
        scrollLeft = 0;

    while(currentFrame = currentWindow.frameElement) {
        currentWindow = currentWindow.parent;

        top += Math.round(currentFrame.getBoundingClientRect().top);
        left += Math.round(currentFrame.getBoundingClientRect().left);
    }

    return {
        top: top,
        left: left
    };
}