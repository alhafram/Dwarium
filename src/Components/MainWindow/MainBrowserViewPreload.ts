// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import sendNotification, { NotificationType } from '../../Services/Notifications'
import ChatService from '../../Services/ChatService'
import FoodService from '../../Services/FoodService'
import { setupCheckingItemsService } from '../../Services/ExpiringItemsLoader'
import GameFlagsService from '../../Services/GameFlagsService'
import ChatSettingsService from '../../Services/ChatSettingsService'
import Utils from '../Common/Utils'
import DropService from '../../Services/DropService'
import ConfigService from '../../Services/ConfigService'

const flags = GameFlagsService.getGameFlags()
document.gameLocationFlags = flags.gameLocationFlags
document.gameTopMenuFlags = flags.gameTopMenuFlags
document.gameRightMenuFlags = flags.gameRightMenuFlags
document.huntFlags = flags.huntFlags
document.fightFlags = flags.fightFlags

window.addEventListener('DOMContentLoaded', async() => {
    const userId = (await Utils.getUserId()) as number
    if(userId) {
        ChatService.setupAutoResponder()
        ChatService.setupFlooding()
        setupCheckingItemsService()
    }
    const settings = ChatSettingsService.get(userId)
    document.chatFlags = settings
    const animationSpeedType = ConfigService.getSettings().animationSpeedType
    let fps = undefined
    switch (animationSpeedType) {
        case 'gameSpeed': {
            break
        }
        case 'x2Speed': {
            fps = 40
            break
        }
        case 'x3Speed': {
            fps = 60
            break
        }
    }
    document.animationFPS = fps
})

document.addEventListener('Message', (event) => {
    const message = (<CustomEvent>event).detail
    FoodService.eat(message)
    sendNotification(message)
    ChatService.handleMessage(message)
    ChatService.handleRedirect(message)
})

document.addEventListener('DropMessage', (event) => {
    const fightDetails = (<CustomEvent>event).detail as FightDetails
    DropService.saveFightDetails(JSON.parse(JSON.stringify(fightDetails)))
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
