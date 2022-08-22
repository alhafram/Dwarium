import { NotificationsWindowActions } from './Actions'
import { Elements } from './Elements'
import { NotificationsWindowState } from './NotificationsWindowState'
import dispatch from './preload'

export function setupView() {
    Elements.saveButton().onclick = () => {
        dispatch(NotificationsWindowActions.SAVE_SETTINGS)
    }
}

export function render(initialState: NotificationsWindowState) {
    Elements.fightNotificationsSystemInput().checked = initialState.fightNotificationsSystem
    Elements.fightNotificationsIngameInput().checked = initialState.fightNotificationsIngame
    Elements.battlegroundNotificationsSystemInput().checked = initialState.battlegroundNotificationsSystem
    Elements.battlegroundNotificationsIngameInput().checked = initialState.battlegroundNotificationsIngame
    Elements.messageNotificationsSystemInput().checked = initialState.messageNotificationsSystem
    Elements.messageNotificationsIngameInput().checked = initialState.messageNotificationsIngame
    Elements.mailNotificationsSystemInput().checked = initialState.mailNotificationsSystem
    Elements.mailNotificationsIngameInput().checked = initialState.mailNotificationsIngame
    Elements.expiringItemsNotificationsSystemInput().checked = initialState.expiringItemsNotificationsSystem
    Elements.expiringItemsNotificationsIngameInput().checked = initialState.expiringItemsNotificationsIngame
    Elements.resourceFarmingFinishedNotificationsSystemInput().checked = initialState.resourceFarmingFinishedNotificationsSystem
    Elements.resourceFarmingFinishedNotificationsIngameInput().checked = initialState.resourceFarmingFinishedNotificationsIngame
}
