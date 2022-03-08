import { ipcRenderer } from "electron"
import { Channel } from "../../Models/Channel"
import { ChatSettingsConfig } from "../../Models/ChatSettingsConfig"
import ChatSettingsService from "../../services/ChatSettingsService"
import Utils from "../Common/Utils"
import { ChatSettingsWindowActions } from "./Actions"
import { ChatSettingsWindowState } from "./ChatSettingsWindowState"
import { Elements } from "./Elements"

function save(userConfig: ChatSettingsConfig, id: number) {
    ChatSettingsService.save(userConfig, id)
    ipcRenderer.send(Channel.CHAT_SETTINGS_CHANGED)
}

function getChatSettingsConfig(id: number) {
    return ChatSettingsService.get(id)
}

export default async function reduce(state: ChatSettingsWindowState, action: ChatSettingsWindowActions, data?: any): Promise<ChatSettingsWindowState> {
    switch(action) {
        case ChatSettingsWindowActions.LOAD_CONTENT:
            const userId = await Utils.getUserId() as number
            if(!userId) {
                console.log("Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!")
                return state
            }
            const chatSettingsConfig = getChatSettingsConfig(userId)
            state = chatSettingsConfig
            return state
        case ChatSettingsWindowActions.CHANGE_AUTO_RESPONDER_ENABLED:
            return {
                ...state,
                autoResponderEnabled: Elements.autoResponderBox().checked
            }
        case ChatSettingsWindowActions.CHANGE_FLOODING_ENABLED:
            return {
                ...state,
                floodingEnabled: Elements.floodingBox().checked
            }
        case ChatSettingsWindowActions.CHANGE_INACTIVE_TIMER:
            return {
                ...state,
                inactiveTimer: parseInt(Elements.inactiveTimerBox().value)
            }
        case ChatSettingsWindowActions.CHANGE_PRIVATE_CHAT_RESPONSE:
            return {
                ...state,
                privateChatResponse: Elements.privateChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_RESPONSE:
            return {
                ...state,
                commonChatResponse: Elements.commonChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_RESPONSE:
            return {
                ...state,
                tradeChatResponse: Elements.tradeChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_RESPONSE:
            return {
                ...state,
                groupChatResponse: Elements.groupChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_RESPONSE:
            return {
                ...state,
                clanChatResponse: Elements.clanChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_RESPONSE:
            return {
                ...state,
                allianceChatResponse: Elements.allianceChatResponseBox().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                commonChatFloodingMessage: Elements.commonChatFloodingMessageBox().value
            }
        case ChatSettingsWindowActions.CHANGE_COMMON_CHAT_FLOODING_TIMER:
            return {
                ...state,
                commonChatFloodingTimer: parseInt(Elements.commonChatFloodingTimerBox().value)
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                tradeChatFloodingMessage: Elements.tradeChatFloodingMessageBox().value
            }
        case ChatSettingsWindowActions.CHANGE_TRADE_CHAT_FLOODING_TIMER:
            return {
                ...state,
                tradeChatFloodingTimer: parseInt(Elements.tradeChatFloodingTimerBox().value)
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                groupChatFloodingMessage: Elements.groupChatFloodingMessageBox().value
            }
        case ChatSettingsWindowActions.CHANGE_GROUP_CHAT_FLOODING_TIMER:
            return {
                ...state,
                groupChatFloodingTimer: parseInt(Elements.groupChatFloodingTimerBox().value)
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                clanChatFloodingMessage: Elements.clanChatFloodingMessageBox().value
            }
        case ChatSettingsWindowActions.CHANGE_CLAN_CHAT_FLOODING_TIMER:
            return {
                ...state,
                clanChatFloodingTimer: parseInt(Elements.clanChatFloodingTimerBox().value)
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_MESSAGE:
            return {
                ...state,
                allianceChatFloodingMessage: Elements.allianceChatFloodingMessageBox().value
            }
        case ChatSettingsWindowActions.CHANGE_ALLIANCE_CHAT_FLOODING_TIMER:
            return {
                ...state,
                allianceChatFloodingTimer: parseInt(Elements.allianceChatFloodingTimerBox().value)
            }
        case ChatSettingsWindowActions.SAVE:
            const userId1 = await Utils.getUserId() as number
            if(!userId1) {
                console.log("Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!")
                return state
            }
            save(state, userId1)
            return state
    }
}