import { ChatSettingsWindowActions } from './Actions'
import { ChatSettingsWindowState } from './ChatSettingsWindowState'
import reduce from './Reducer'
import setupMode from '../../services/DarkModeHandler'
import { render, setupView } from './Renderer'

let initialState: ChatSettingsWindowState = {
    autoResponderEnabled: false,
    floodingEnabled: false,
    inactiveTimer: 0,

    privateChatResponse: '',
    commonChatResponse: '',
    tradeChatResponse: '',
    groupChatResponse: '',
    clanChatResponse: '',
    allianceChatResponse: '',

    commonChatFloodingMessage: '',
    commonChatFloodingTimer: 10,
    tradeChatFloodingMessage: '',
    tradeChatFloodingTimer: 10,
    groupChatFloodingMessage: '',
    groupChatFloodingTimer: 10,
    clanChatFloodingMessage: '',
    clanChatFloodingTimer: 10,
    allianceChatFloodingMessage: '',
    allianceChatFloodingTimer: 10
}

export default async function dispatch(action: ChatSettingsWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

document.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    dispatch(ChatSettingsWindowActions.LOAD_CONTENT)
    setupView()
})
