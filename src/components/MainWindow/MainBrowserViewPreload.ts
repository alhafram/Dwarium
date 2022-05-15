// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import sendNotification from '../../services/Notifications'
import ChatService from '../../services/ChatService'
import FoodService from '../../services/FoodService'
import ScriptInjectService from '../../services/ScriptInjectedService'
import { setupCheckingItemsService } from '../../services/ExpiringItemsLoader'

window.addEventListener('DOMContentLoaded', async() => {
    ChatService.setupAutoResponder()
    ChatService.setupFlooding()
    ScriptInjectService.setupSpeed()
    setupCheckingItemsService()
})

document.addEventListener('Message', (event) => {
    const message = (<CustomEvent>event).detail
    FoodService.eat(message)
    sendNotification(message)
    ChatService.handleMessage(message)
})

document.addEventListener('MessageDom', (event) => {
    const messageDom = (<CustomEvent>event).detail
    ChatService.logMessage(messageDom)
})

ipcRenderer.on(Channel.USER_PRV, function(event, nick) {
    userPrvTag(nick)
})

ipcRenderer.on(Channel.FOOD_CHANGED, () => {
    FoodService.reset()
})

ipcRenderer.on(Channel.EXPIRING_ITEMS_CHANGED, () => {
    setupCheckingItemsService()
})

function getSpells(): any[] {
    if(top && top[0] && top[0][1] && top[0][1].canvas && top[0][1].canvas.app && top[0][1].canvas.app.battle && top[0][1].canvas.app.battle.model && top[0][1].canvas.app.battle.model.spellsBow) {
        return Object.values(top[0][1].canvas.app.battle.model.spellsBow).sort(function(t, e) {
            return t.index - e.index
        })
    }
    return []
}

ipcRenderer.on(Channel.BOW_SKILL, (event, data) => {
    const spells = getSpells()
    const spellNumber = data as number
    const spell = spells[spellNumber - 1]
    if(spell) {
        top[0][1].document.game.main.mFunc.useEffect(spell.effId)
    }
})