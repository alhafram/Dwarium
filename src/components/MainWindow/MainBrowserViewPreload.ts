// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import sendNotification, { NotificationType } from '../../services/Notifications'
import ChatService from '../../services/ChatService'
import FoodService from '../../services/FoodService'
import ScriptInjectService from '../../services/ScriptInjectedService'
import { setupCheckingItemsService } from '../../services/ExpiringItemsLoader'
import GameFlagsService from '../../services/GameFlagsService'
import ChatSettingsService from '../../services/ChatSettingsService'
import Utils from '../Common/Utils'
import DropService from '../../services/DropService'

const flags = GameFlagsService.getGameFlags()
document.gameLocationFlags = flags.gameLocationFlags
document.gameTopMenuFlags = flags.gameTopMenuFlags
document.gameRightMenuFlags = flags.gameRightMenuFlags
document.huntFlags = flags.huntFlags

window.addEventListener('DOMContentLoaded', async() => {
    ChatService.setupAutoResponder()
    ChatService.setupFlooding()
    ScriptInjectService.setupSpeed()
    setupCheckingItemsService()
    const userId = (await Utils.getUserId()) as number
    const settings = ChatSettingsService.get(userId)
    document.chatFlags = settings
})

document.addEventListener('Message', (event) => {
    const message = (<CustomEvent>event).detail
    FoodService.eat(message)
    sendNotification(message)
    ChatService.handleMessage(message)
    ChatService.handleRedirect(message)
})

document.addEventListener('DropMessage', (event) => {
    const dropmessages = (<CustomEvent>event).detail
    DropService.saveDrop([...dropmessages])
})

document.addEventListener('MessageDom', (event) => {
    const messageDom = (<CustomEvent>event).detail
    ChatService.logMessage(messageDom)
})

document.addEventListener('ResourceFarmingFinished', () => {
    sendNotification(null, NotificationType.RESOUCE_FARMING_FINISHED)
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

ipcRenderer.on(Channel.OPEN_HUNT, () => {
    callMenu('b07')
})

ipcRenderer.on(Channel.OPEN_BACKPACK, () => {
    callMenu('b02')
})

ipcRenderer.on(Channel.OPEN_LOCATION, () => {
    callMenu('b06')
})

function callMenu(command: string) {
    if(top && top[0] && top[0].processMenu) {
        top[0].processMenu(command)
    }
}
