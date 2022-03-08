import { ipcRenderer } from "electron"
import { Channel } from "../../Models/Channel"
import dispatch from "./preload"
import { ChatSettingsWindowActions } from "./Actions"
import { ChatSettingsWindowState } from "./ChatSettingsWindowState"
import { Elements } from "./Elements"

function render(initialState: ChatSettingsWindowState) {
    Elements.autoResponderBox().checked = initialState.autoResponderEnabled
    Elements.floodingBox().checked = initialState.floodingEnabled
    Elements.inactiveTimerBox().value = initialState.inactiveTimer.toString()

    Elements.privateChatResponseBox().value = initialState.privateChatResponse.toString()
    Elements.commonChatResponseBox().value = initialState.commonChatResponse.toString()
    Elements.tradeChatResponseBox().value = initialState.tradeChatResponse.toString()
    Elements.groupChatResponseBox().value = initialState.groupChatResponse.toString()
    Elements.clanChatResponseBox().value = initialState.clanChatResponse.toString()
    Elements.allianceChatResponseBox().value = initialState.allianceChatResponse.toString()

    Elements.commonChatFloodingMessageBox().value = initialState.commonChatFloodingMessage.toString()
    Elements.commonChatFloodingTimerBox().value = initialState.commonChatFloodingTimer.toString()
    Elements.tradeChatFloodingMessageBox().value = initialState.tradeChatFloodingMessage.toString()
    Elements.tradeChatFloodingTimerBox().value = initialState.tradeChatFloodingTimer.toString()
    Elements.groupChatFloodingMessageBox().value = initialState.groupChatFloodingMessage.toString()
    Elements.groupChatFloodingTimerBox().value = initialState.groupChatFloodingTimer.toString()
    Elements.clanChatFloodingMessageBox().value = initialState.clanChatFloodingMessage.toString()
    Elements.clanChatFloodingTimerBox().value = initialState.clanChatFloodingTimer.toString()
    Elements.allianceChatFloodingMessageBox().value = initialState.allianceChatFloodingMessage.toString()
    Elements.allianceChatFloodingTimerBox().value = initialState.allianceChatFloodingTimer.toString()
}

function setupView() {
    Elements.autoResponderBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_AUTO_RESPONDER_ENABLED)
    }
    Elements.floodingBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_FLOODING_ENABLED)
    }
    Elements.inactiveTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER)
    }
    Elements.inactiveTimerBox().onkeyup = () => {
        const value = parseInt(Elements.inactiveTimerBox().value)
        if(value >= 0 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER)
        } else {
            Elements.inactiveTimerBox().value = '0'
        }
    }

    Elements.privateChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_PRIVATE_CHAT_RESPONSE)
    }
    Elements.commonChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_RESPONSE)
    }
    Elements.tradeChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_RESPONSE)
    }
    Elements.groupChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_RESPONSE)
    }
    Elements.clanChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_RESPONSE)
    }
    Elements.allianceChatResponseBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_RESPONSE)
    }

    Elements.commonChatFloodingMessageBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_MESSAGE)
    }
    Elements.commonChatFloodingTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER)
    }
    Elements.commonChatFloodingTimerBox().onkeyup = () => {
        const value = parseInt(Elements.commonChatFloodingTimerBox().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER)
        } else {
            Elements.commonChatFloodingTimerBox().value = '1'
        }
    }
    Elements.tradeChatFloodingMessageBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_MESSAGE)
    }
    Elements.tradeChatFloodingTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER)
    }
    Elements.tradeChatFloodingTimerBox().onkeyup = () => {
        const value = parseInt(Elements.tradeChatFloodingTimerBox().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER)
        } else {
            Elements.tradeChatFloodingTimerBox().value = '1'
        }
    }
    Elements.groupChatFloodingMessageBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_MESSAGE)
    }
    Elements.groupChatFloodingTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER)
    }
    Elements.groupChatFloodingTimerBox().onkeyup = () => {
        const value = parseInt(Elements.groupChatFloodingTimerBox().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER)
        } else {
            Elements.groupChatFloodingTimerBox().value = '1'
        }
    }
    Elements.clanChatFloodingMessageBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_MESSAGE)
    }
    Elements.clanChatFloodingTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER)
    }
    Elements.clanChatFloodingTimerBox().onkeyup = () => {
        const value = parseInt(Elements.clanChatFloodingTimerBox().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER)
        } else {
            Elements.clanChatFloodingTimerBox().value = '1'
        }
    }
    Elements.allianceChatFloodingMessageBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_MESSAGE)
    }
    Elements.allianceChatFloodingTimerBox().onchange = () => {
        dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER)
    }
    Elements.allianceChatFloodingTimerBox().onkeyup = () => {
        const value = parseInt(Elements.allianceChatFloodingTimerBox().value)
        if(value >= 1 && !isNaN(value)) {
            dispatch(ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER)
        } else {
            Elements.allianceChatFloodingTimerBox().value = '1'
        }
    }
    Elements.saveBox().onclick = () => {
        if(confirm('При включении автоответчика/флудилки, рекомендуем использовать UserAgent 4-й версии клиента. Открыть настройки клиента?')) {
            ipcRenderer.send(Channel.OPEN_SETTINGS)
        }
        dispatch(ChatSettingsWindowActions.SAVE)
    }
}

export {
    render,
    setupView
}