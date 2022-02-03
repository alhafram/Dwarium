import { app, powerMonitor, globalShortcut, getCurrentWindow } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import ConfigService from './ConfigService'
import ChatSettingsService from './ChatSettingsService'
import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'
import { ChatSettingsConfig } from '../Models/ChatSettingsConfig'
import { ChatMessage } from './Notifications'

const logsFolderPath = path.join(app.getPath ('userData'), 'logs')
const filePath = path.join(logsFolderPath, 'chat.log')

if(!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath)
    fs.openSync(filePath, 'w')
} else if(!fs.existsSync(filePath)) {
    fs.openSync(filePath, 'w')
}

enum ChatChannel {
    PRIVATE = 2,
    COMMON = 4096,
    TRADE = 8,
    GROUP = 16,
    CLAN = 4,
    ALLIANCE = 64
}

type QueueChatMessage = {
    channel: ChatChannel
    text: string
}

var logStream = fs.createWriteStream(filePath, {
    flags: 'a'
});
var isIdle = false
var messagesQueue: QueueChatMessage[] = []

let config: ChatSettingsConfig
async function loadConfig() {
    const userId = await ipcRenderer.invoke(Channel.GET_ID) as number
    config = ChatSettingsService.get(userId)
}

function setupAutoResponder() {
    setInterval(async () => {
        if(!config) {
            await loadConfig()
        }
        let idleTime = powerMonitor.getSystemIdleTime()
        isIdle = idleTime >= config.inactiveTimer * 60
    }, 1000)
    let messages_interval = setInterval(async function() {
        var message = messagesQueue[0]
        if(message) {
            // @ts-ignore
            const crc = top[1].CHAT.session_crc
            const req = await fetch(`${ConfigService.baseUrl()}/entry_point.php?object=chat&action=send&json_mode_on=1`, {
                'headers': {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest'
                },
                'referrer': `${ConfigService.baseUrl()}/cht.php`,
                'referrerPolicy': 'no-referrer-when-downgrade',
                'body': encodeURI(`json_mode_on=1&object=chat&action=send&msg_text=${message.text}&channel_talk=${message.channel}&crc=${crc}`),
                'method': 'POST',
                'mode': 'cors',
                'credentials': 'include'
            });
            const json = await req.json()
            if(!json['chat|send'].error) {
                messagesQueue.shift()
            } else {
                console.log("GOT ERROR, RESEND", message)
            }
        }
    }, 1000)
}

function getAutoResponceForChannel(channel: ChatChannel) {
    switch(channel) {
        case ChatChannel.PRIVATE:
            return config.privateChatResponse
        case ChatChannel.COMMON:
            return config.commonChatResponse
        case ChatChannel.TRADE:
            return config.tradeChatResponse
        case ChatChannel.GROUP:
            return config.groupChatResponse
        case ChatChannel.CLAN:
            return config.clanChatResponse
        case ChatChannel.ALLIANCE:
            return config.allianceChatResponse
    }
}

var prevReceivers: Set<string>[] = []

console.log(prevReceivers)

function handleMessage(message: any) {
    const chatMessage = message as ChatMessage
    if(chatMessage) {
        // @ts-ignore
        const nickname = top[0]?.canvas?.app?.avatar?.model?.login ?? ''
        if(chatMessage.to_user_nicks != undefined) {
            let toUserNicks = Object.values(chatMessage.to_user_nicks)
            let index = toUserNicks.indexOf(nickname)
            if(index != -1) {
                delete toUserNicks[index]
            } else {
                return
            }
            toUserNicks = toUserNicks.filter(a => a)
            toUserNicks.push(chatMessage.user_nick ?? '')
            if(config.autoResponderEnabled && isIdle && toUserNicks.length > 0) {
                if(chatMessage.user_nick == nickname && toUserNicks.length == 1) {
                    return
                }
                const channel = chatMessage.channel
                const autoResponse = getAutoResponceForChannel(channel)
                if(autoResponse.length != 0) {
                    const newReceiversSet = new Set(toUserNicks)
                    var exists = false
                    const filteredPrevReceivers = prevReceivers.filter(res => res.size == newReceiversSet.size)
                    for(const newReceiver of newReceiversSet) {
                        for(const receivers of filteredPrevReceivers) {
                            if(receivers.has(newReceiver)) {
                                exists = true
                                continue
                            } else {
                                exists = false
                                break
                            }
                        }
                    }
                    if(exists) {
                        return
                    }
                    prevReceivers.push(newReceiversSet)
                    console.log("ADD Receiver", newReceiversSet)
                    setTimeout(() => {
                        const index = prevReceivers.indexOf(newReceiversSet)
                        if(index != -1) {
                            console.log("REMOVE Receiver", newReceiversSet)
                            delete prevReceivers[index]
                        }
                    }, 10000)
                    const usersNeedToAnswer = toUserNicks.map(nick => `${channel == 2 ? 'prv[' : 'to['}${nick}]`).join(' ')
                    const answerText = `${usersNeedToAnswer} ${autoResponse}`
                    const newQueueMessage: QueueChatMessage = {
                        text: answerText,
                        channel: channel
                    }
                    messagesQueue.push(newQueueMessage)
                }
            }
        }
    }
}

var chatHidden = false

function logMessage(message: any) {
    let node = $(message).get()[0].cloneNode(true) as HTMLElement
    node.removeAttribute('original-msg-object')
    node.querySelectorAll('*').forEach(elem => {
        elem.removeAttribute('oncontextmenu')
        elem.removeAttribute('onmousedown')
        elem.removeAttribute('onclick')
        elem.removeAttribute('href')
    })
    let html = node.outerHTML
    html = html.replaceAll('src="images/', `src="${ConfigService.baseUrl()}/images/`).replaceAll('src="/images/', `src="${ConfigService.baseUrl()}/images/`)
    html = html.replaceAll('href="/artifact_info.php', `href="${ConfigService.baseUrl()}/artifact_info.php`)
    logStream.write(html + '\n', (error) => {
        if(error) {
            alert('Произошла ошибка, при записи в лог! Напишите в группу!')
        }
    })
}

function setupShortcut() {
    globalShortcut.unregister('F7')
    globalShortcut.register('F7', () => {
        if(chatHidden) {
            // @ts-ignore
            _top().gebi('chat_TD').height = '30%'
            // @ts-ignore
            _top().gebi('main_frame_TD').height = '70%'
            // @ts-ignore
            _top().gebi('chat_TD').style.display = 'block'
            // @ts-ignore
            _top().gebi('chat_TD').style.display = ''
            // @ts-ignore
        } else {
            // @ts-ignore
            _top().gebi('chat_TD').height = '0%'
            // @ts-ignore
            _top().gebi('main_frame_TD').height = '100%'
            // @ts-ignore
            _top().gebi('chat_TD').style.display = 'none'
        }
        chatHidden = !chatHidden
    })
}

ipcRenderer.on(Channel.CHAT_SETTINGS_CHANGED, async () => {
    await loadConfig()
})

export default {
    handleMessage,
    logMessage,
    setupShortcut,
    setupAutoResponder
}