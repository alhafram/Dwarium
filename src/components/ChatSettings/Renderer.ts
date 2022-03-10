import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import dispatch from './preload'
import { ChatSettingsWindowActions } from './Actions'
import { ChatSettingsWindowState } from './ChatSettingsWindowState'
import { Elements } from './Elements'

function render(initialState: ChatSettingsWindowState) {
    Elements.autoResponderInput().checked = initialState.autoResponderEnabled
    Elements.floodingInput().checked = initialState.floodingEnabled
    Elements.inactiveTimerInput().value = initialState.inactiveTimer.toString()

    Elements.privateChatResponseInput().value = initialState.privateChatResponse.toString()
    Elements.commonChatResponseInput().value = initialState.commonChatResponse.toString()
    Elements.tradeChatResponseInput().value = initialState.tradeChatResponse.toString()
    Elements.groupChatResponseInput().value = initialState.groupChatResponse.toString()
    Elements.clanChatResponseInput().value = initialState.clanChatResponse.toString()
    Elements.allianceChatResponseInput().value = initialState.allianceChatResponse.toString()

    Elements.commonChatFloodingMessageInput().value = initialState.commonChatFloodingMessage.toString()
    Elements.commonChatFloodingTimerInput().value = initialState.commonChatFloodingTimer.toString()
    Elements.tradeChatFloodingMessageInput().value = initialState.tradeChatFloodingMessage.toString()
    Elements.tradeChatFloodingTimerInput().value = initialState.tradeChatFloodingTimer.toString()
    Elements.groupChatFloodingMessageInput().value = initialState.groupChatFloodingMessage.toString()
    Elements.groupChatFloodingTimerInput().value = initialState.groupChatFloodingTimer.toString()
    Elements.clanChatFloodingMessageInput().value = initialState.clanChatFloodingMessage.toString()
    Elements.clanChatFloodingTimerInput().value = initialState.clanChatFloodingTimer.toString()
    Elements.allianceChatFloodingMessageInput().value = initialState.allianceChatFloodingMessage.toString()
    Elements.allianceChatFloodingTimerInput().value = initialState.allianceChatFloodingTimer.toString()
}

function setupView() {
    Elements.autoResponderInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_AUTO_RESPONDER_ENABLED)
    }
    Elements.floodingInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_FLOODING_ENABLED)
    }
    Elements.inactiveTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER)
    }
    Elements.inactiveTimerInput().onkeyup = () => {
        const value = parseInt(Elements.inactiveTimerInput().value)
        if(value >= 0 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER)
        } else {
            Elements.inactiveTimerInput().value = '0'
        }
    }

    Elements.privateChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_PRIVATE_CHAT_RESPONSE)
    }
    Elements.commonChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_RESPONSE)
    }
    Elements.tradeChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_RESPONSE)
    }
    Elements.groupChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_RESPONSE)
    }
    Elements.clanChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_RESPONSE)
    }
    Elements.allianceChatResponseInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_RESPONSE)
    }

    Elements.commonChatFloodingMessageInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_MESSAGE)
    }
    Elements.commonChatFloodingTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER)
    }
    Elements.commonChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.commonChatFloodingTimerInput().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER)
        } else {
            Elements.commonChatFloodingTimerInput().value = '1'
        }
    }
    Elements.tradeChatFloodingMessageInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_MESSAGE)
    }
    Elements.tradeChatFloodingTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER)
    }
    Elements.tradeChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.tradeChatFloodingTimerInput().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER)
        } else {
            Elements.tradeChatFloodingTimerInput().value = '1'
        }
    }
    Elements.groupChatFloodingMessageInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_MESSAGE)
    }
    Elements.groupChatFloodingTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER)
    }
    Elements.groupChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.groupChatFloodingTimerInput().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER)
        } else {
            Elements.groupChatFloodingTimerInput().value = '1'
        }
    }
    Elements.clanChatFloodingMessageInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_MESSAGE)
    }
    Elements.clanChatFloodingTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER)
    }
    Elements.clanChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.clanChatFloodingTimerInput().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER)
        } else {
            Elements.clanChatFloodingTimerInput().value = '1'
        }
    }
    Elements.allianceChatFloodingMessageInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_MESSAGE)
    }
    Elements.allianceChatFloodingTimerInput().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER)
    }
    Elements.allianceChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.allianceChatFloodingTimerInput().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER)
        } else {
            Elements.allianceChatFloodingTimerInput().value = '1'
        }
    }
    Elements.saveButton().onclick = () => {
        if(confirm('При включении автоответчика/флудилки, рекомендуем использовать UserAgent 4-й версии клиента. Открыть настройки клиента?')) {
            ipcRenderer.send(Channel.OPEN_SETTINGS)
        }
        dispatch(ChatSettingsWindowActions.SAVE)
    }
}

export { render, setupView }
