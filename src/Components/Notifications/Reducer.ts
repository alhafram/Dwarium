import ConfigService from '../../Services/ConfigService'
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
                    fightFinishedNotificationsSystem: loadedSettings.fightFinishedNotificationsSystem,
                    fightFinishedNotificationsIngame: loadedSettings.fightFinishedNotificationsIngame,
                    battlegroundNotificationsSystem: loadedSettings.battlegroundNotificationsSystem,
                    battlegroundNotificationsIngame: loadedSettings.battlegroundNotificationsIngame,
                    messageNotificationsSystem: loadedSettings.messageNotificationsSystem,
                    messageNotificationsIngame: loadedSettings.messageNotificationsIngame,
                    mailNotificationsSystem: loadedSettings.mailNotificationsSystem,
                    mailNotificationsIngame: loadedSettings.mailNotificationsIngame,
                    expiringItemsNotificationsSystem: loadedSettings.expiringItemsNotificationsSystem,
                    expiringItemsNotificationsIngame: loadedSettings.expiringItemsNotificationsIngame,
                    resourceFarmingFinishedNotificationsSystem: loadedSettings.resourceFarmingFinishedNotificationSystem,
                    resourceFarmingFinishedNotificationsIngame: loadedSettings.resourceFarmingFinishedNotificationIngame
                }
            }
        }
        case NotificationsWindowActions.SAVE_SETTINGS: {
            const clientSettings = ConfigService.getSettings()
            clientSettings.fightNotificationsSystem = Elements.fightNotificationsSystemInput().checked
            clientSettings.fightNotificationsIngame = Elements.fightNotificationsIngameInput().checked
            clientSettings.fightFinishedNotificationsSystem = Elements.fightFinishedNotificationsSystemInput().checked
            clientSettings.fightFinishedNotificationsIngame = Elements.fightFinishedNotificationsIngameInput().checked
            clientSettings.battlegroundNotificationsSystem = Elements.battlegroundNotificationsSystemInput().checked
            clientSettings.battlegroundNotificationsIngame = Elements.battlegroundNotificationsIngameInput().checked
            clientSettings.messageNotificationsSystem = Elements.messageNotificationsSystemInput().checked
            clientSettings.messageNotificationsIngame = Elements.messageNotificationsIngameInput().checked
            clientSettings.mailNotificationsSystem = Elements.mailNotificationsSystemInput().checked
            clientSettings.mailNotificationsIngame = Elements.mailNotificationsIngameInput().checked
            clientSettings.expiringItemsNotificationsSystem = Elements.expiringItemsNotificationsSystemInput().checked
            clientSettings.expiringItemsNotificationsIngame = Elements.expiringItemsNotificationsIngameInput().checked
            clientSettings.resourceFarmingFinishedNotificationSystem = Elements.resourceFarmingFinishedNotificationsSystemInput().checked
            clientSettings.resourceFarmingFinishedNotificationIngame = Elements.resourceFarmingFinishedNotificationsIngameInput().checked
            ConfigService.writeData('settings', JSON.stringify(clientSettings))
            return {
                ...state,
                fightNotificationsSystem: clientSettings.fightNotificationsSystem,
                fightNotificationsIngame: clientSettings.fightNotificationsIngame,
                fightFinishedNotificationsSystem: clientSettings.fightFinishedNotificationsSystem,
                fightFinishedNotificationsIngame: clientSettings.fightFinishedNotificationsIngame,
                battlegroundNotificationsSystem: clientSettings.battlegroundNotificationsSystem,
                battlegroundNotificationsIngame: clientSettings.battlegroundNotificationsIngame,
                messageNotificationsSystem: clientSettings.messageNotificationsSystem,
                messageNotificationsIngame: clientSettings.messageNotificationsIngame,
                mailNotificationsSystem: clientSettings.mailNotificationsSystem,
                mailNotificationsIngame: clientSettings.mailNotificationsIngame,
                expiringItemsNotificationsSystem: clientSettings.expiringItemsNotificationsSystem,
                expiringItemsNotificationsIngame: clientSettings.expiringItemsNotificationsIngame,
                resourceFarmingFinishedNotificationsSystem: clientSettings.resourceFarmingFinishedNotificationSystem,
                resourceFarmingFinishedNotificationsIngame: clientSettings.resourceFarmingFinishedNotificationIngame
            }
        }
    }
}
