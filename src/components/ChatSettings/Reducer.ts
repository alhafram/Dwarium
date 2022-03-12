import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { ChatSettingsConfig } from '../../Models/ChatSettingsConfig'
import ChatSettingsService from '../../services/ChatSettingsService'
import Utils from '../Common/Utils'
import { ChatSettingsWindowActions } from './Actions'
import { ChatSettingsWindowState } from './ChatSettingsWindowState'
import { Elements } from './Elements'

function save(userConfig: ChatSettingsConfig, id: number) {
    ChatSettingsService.save(userConfig, id)
    ipcRenderer.send(Channel.CHAT_SETTINGS_CHANGED)
}

function getChatSettingsConfig(id: number) {
    return ChatSettingsService.get(id)
}

export default async function reduce(state: ChatSettingsWindowState, action: ChatSettingsWindowActions, data?: any): Promise<ChatSettingsWindowState> {
    switch (action) {
        case ChatSettingsWindowActions.LOAD_CONTENT: {
            const userId = (await Utils.getUserId()) as number
            if(!userId) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!')
                return state
            }
            const chatSettingsConfig = getChatSettingsConfig(userId)
            state = chatSettingsConfig
            return state
        }
        case ChatSettingsWindowActions.CHANGE_AUTO_RESPONDER_ENABLED:
            return {
                ...state,
                autoResponderEnabled: Elements.autoResponderInput().checked
            }
        case ChatSettingsWindowActions.CHANGE_FLOODING_ENABLED:
            return {
                ...state,
                floodingEnabled: Elements.floodingInput().checked
            }
        case ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER:
            return {
                ...state,
                inactiveTimer: parseInt(Elements.inactiveTimerInput().value)
            }
        case ChatSettingsWindowActions.CHANGE_PRIVATE_CHAT_RESPONSE:
            return {
                ...state,
                privateChatResponse: Elements.privateChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_RESPONSE:
            return {
                ...state,
                commonChatResponse: Elements.commonChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_RESPONSE:
            return {
                ...state,
                tradeChatResponse: Elements.tradeChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_RESPONSE:
            return {
                ...state,
                groupChatResponse: Elements.groupChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_RESPONSE:
            return {
                ...state,
                clanChatResponse: Elements.clanChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_RESPONSE:
            return {
                ...state,
                allianceChatResponse: Elements.allianceChatResponseInput().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                commonChatFloodingMessage: Elements.commonChatFloodingMessageInput().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER:
            return {
                ...state,
                commonChatFloodingTimer: parseInt(Elements.commonChatFloodingTimerInput().value)
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                tradeChatFloodingMessage: Elements.tradeChatFloodingMessageInput().value
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER:
            return {
                ...state,
                tradeChatFloodingTimer: parseInt(Elements.tradeChatFloodingTimerInput().value)
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                groupChatFloodingMessage: Elements.groupChatFloodingMessageInput().value
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER:
            return {
                ...state,
                groupChatFloodingTimer: parseInt(Elements.groupChatFloodingTimerInput().value)
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                clanChatFloodingMessage: Elements.clanChatFloodingMessageInput().value
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER:
            return {
                ...state,
                clanChatFloodingTimer: parseInt(Elements.clanChatFloodingTimerInput().value)
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                allianceChatFloodingMessage: Elements.allianceChatFloodingMessageInput().value
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER:
            return {
                ...state,
                allianceChatFloodingTimer: parseInt(Elements.allianceChatFloodingTimerInput().value)
            }
        case ChatSettingsWindowActions.SAVE: {
            const userId1 = (await Utils.getUserId()) as number
            if(!userId1) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!')
                return state
            }
            save(state, userId1)
            return state
        }
    }
}
