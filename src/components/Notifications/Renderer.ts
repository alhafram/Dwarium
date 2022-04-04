import { NotificationsWindowActions } from './Actions'
import { Elements } from './Elements'
import { NotificationsWindowState } from './NotificationsWindowState'
import dispatch from './preload'

export function setupView() {
    Elements.fightNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_FIGHT_NOTIFICATIONS_SYSTEM)
    }
    Elements.fightNotificationsIngameInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_FIGHT_NOTIFICATIONS_INGAME)
    }
    Elements.battlegroundNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_BATTLEGROUND_NOTIFICATIONS_SYSTEM)
    }
    Elements.battlegroundNotificationsIngameInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_BATTLEGROUND_NOTIFICATIONS_INGAME)
    }
    Elements.messageNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_MESSAGE_NOTIFICATIONS_SYSTEM)
    }
    Elements.messageNotificationsIngameInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_MESSAGE_NOTIFICATIONS_INGAME)
    }
    Elements.mailNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_MAIL_NOTIFICATIONS_SYSTEM)
    }
    Elements.mailNotificationsIngameInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_MAIL_NOTIFICATIONS_INGAME)
    }
    Elements.mailNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_MAIL_NOTIFICATIONS_SYSTEM)
    }
    Elements.expiringItemsNotificationsSystemInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_EXPIRING_ITEMS_NOTIFICATIONS_SYSTEM)
    }
    Elements.expiringItemsNotificationsIngameInput().onchange = () => {
        dispatch(NotificationsWindowActions.CHANGE_EXPIRING_ITEMS_NOTIFICATIONS_INGAME)
    }
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
}
