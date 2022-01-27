import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import sendNotification from '../../services/Notifications'
import ChatService from '../../services/ChatService'
import eat from '../../services/FoodService'

window.addEventListener('DOMContentLoaded', async () => {
    ChatService.setupShortcut()
})

document.addEventListener('Message', (event) => {
    const message = (<CustomEvent>event).detail
    if(message.channel == 2 && message.msg_text && message.msg_text.includes('Окончен бой')) {
        eat()
    }
    sendNotification(message)
})

document.addEventListener('MessageDom', (event) => {
    const messageDom = (<CustomEvent>event).detail
    ChatService.logMessage(messageDom)
})

ipcRenderer.on(Channel.USER_PRV, function(event, nick) {
    // @ts-ignore
    userPrvTag(nick)
})