import { app, powerMonitor, globalShortcut, getCurrentWindow } from '@electron/remote'
import fs from 'fs'
import path from 'path'
import ConfigService from './ConfigService'

const logsFolderPath = path.join(app.getPath ('userData'), 'logs')
const filePath = path.join(logsFolderPath, 'chat.log')

if(!fs.existsSync(logsFolderPath)) {
    fs.mkdirSync(logsFolderPath)
    fs.openSync(filePath, 'w')
} else if(!fs.existsSync(filePath)) {
    fs.openSync(filePath, 'w')
}

var logStream = fs.createWriteStream(filePath, {
    flags: 'a'
});
var isIdle = false

function setupAutoResponder() {
    setInterval(() => {
        let idleTime = powerMonitor.getSystemIdleTime()
        isIdle = idleTime > 0 // TODO: - 
    }, 1000)
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

export default {
    logMessage,
    setupShortcut,
    setupAutoResponder
}