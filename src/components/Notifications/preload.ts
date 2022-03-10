import setupMode from '../../services/DarkModeHandler'
import { NotificationsWindowActions } from './Actions'
import { NotificationsWindowState } from './NotificationsWindowState'
import reduce from './Reducer'
import { render, setupView } from './Renderer'

let initialState: NotificationsWindowState = {
    fightNotificationsSystem: false,
    fightNotificationsIngame: false,
    battlegroundNotificationsSystem: false,
    battlegroundNotificationsIngame: false,
    messageNotificationsSystem: false,
    messageNotificationsIngame: false,
    mailNotificationsSystem: false,
    mailNotificationsIngame: false
}

export default async function dispatch(action: NotificationsWindowActions) {
    initialState = reduce(initialState, action)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    dispatch(NotificationsWindowActions.LOAD_CONTENT)
    setupView()
})
