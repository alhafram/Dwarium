import ConfigService from '../../services/ConfigService'
import { NotificationsWindowActions } from './Actions'
import { Elements } from './Elements'
import { NotificationsWindowState } from './NotificationsWindowState'

export default function reduce(state: NotificationsWindowState, action: NotificationsWindowActions): NotificationsWindowState {
    switch (action) {
        case NotificationsWindowActions.LOAD_CONTENT: {
            const loadedSettings = ConfigService.getSettings()
            if(Object.keys(loadedSettings).length == 0) {
                return state
            } else {
                return {
                    ...state,
                    fightNotificationsSystem: loadedSettings.fightNotificationsSystem,
                    fightNotificationsIngame: loadedSettings.fightNotificationsIngame,
                    battlegroundNotificationsSystem: loadedSettings.battlegroundNotificationsSystem,
                    battlegroundNotificationsIngame: loadedSettings.battlegroundNotificationsIngame,
                    messageNotificationsSystem: loadedSettings.messageNotificationsSystem,
                    messageNotificationsIngame: loadedSettings.messageNotificationsIngame,
                    mailNotificationsSystem: loadedSettings.mailNotificationsSystem,
                    mailNotificationsIngame: loadedSettings.mailNotificationsIngame
                }
            }
        }
        case NotificationsWindowActions.CHANGE_FIGHT_NOTIFICATIONS_SYSTEM:
            return {
                ...state,
                fightNotificationsSystem: Elements.fightNotificationsSystemInput().checked
            }
        case NotificationsWindowActions.CHANGE_FIGHT_NOTIFICATIONS_INGAME:
            return {
                ...state,
                fightNotificationsIngame: Elements.fightNotificationsIngameInput().checked
            }
        case NotificationsWindowActions.CHANGE_BATTLEGROUND_NOTIFICATIONS_SYSTEM:
            return {
                ...state,
                battlegroundNotificationsSystem: Elements.battlegroundNotificationsSystemInput().checked
            }
        case NotificationsWindowActions.CHANGE_BATTLEGROUND_NOTIFICATIONS_INGAME:
            return {
                ...state,
                battlegroundNotificationsIngame: Elements.battlegroundNotificationsIngameInput().checked
            }
        case NotificationsWindowActions.CHANGE_MESSAGE_NOTIFICATIONS_SYSTEM:
            return {
                ...state,
                messageNotificationsSystem: Elements.messageNotificationsSystemInput().checked
            }
        case NotificationsWindowActions.CHANGE_MESSAGE_NOTIFICATIONS_INGAME:
            return {
                ...state,
                messageNotificationsIngame: Elements.messageNotificationsIngameInput().checked
            }
        case NotificationsWindowActions.CHANGE_MAIL_NOTIFICATIONS_SYSTEM:
            return {
                ...state,
                mailNotificationsSystem: Elements.mailNotificationsSystemInput().checked
            }
        case NotificationsWindowActions.CHANGE_MAIL_NOTIFICATIONS_INGAME:
            return {
                ...state,
                mailNotificationsIngame: Elements.mailNotificationsIngameInput().checked
            }
        case NotificationsWindowActions.SAVE_SETTINGS: {
            const clientSettings = ConfigService.getSettings()
            clientSettings.fightNotificationsSystem = state.fightNotificationsSystem
            clientSettings.fightNotificationsIngame = state.fightNotificationsIngame
            clientSettings.battlegroundNotificationsSystem = state.battlegroundNotificationsSystem
            clientSettings.battlegroundNotificationsIngame = state.battlegroundNotificationsIngame
            clientSettings.messageNotificationsSystem = state.messageNotificationsSystem
            clientSettings.messageNotificationsIngame = state.messageNotificationsIngame
            clientSettings.mailNotificationsSystem = state.mailNotificationsSystem
            clientSettings.mailNotificationsIngame = state.mailNotificationsIngame
            ConfigService.writeData('settings', JSON.stringify(clientSettings))
            return {
                ...state
            }
        }
    }
}
