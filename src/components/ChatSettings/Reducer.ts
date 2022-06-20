import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { ChatSettingsConfig } from '../../Models/ChatSettingsConfig'
import ChatSettingsService from '../../services/ChatSettingsService'
import Utils from '../Common/Utils'
import { ChatSettingsWindowActions } from './Actions'
import { Elements } from './Elements'

function save(userConfig: ChatSettingsConfig, id: number) {
    ChatSettingsService.save(userConfig, id)
    ipcRenderer.send(Channel.CHAT_SETTINGS_CHANGED)
}

function getChatSettingsConfig(id: number) {
    return ChatSettingsService.get(id)
}

export default async function reduce(state: ChatSettingsConfig, action: ChatSettingsWindowActions, data?: any): Promise<ChatSettingsConfig> {
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
        case ChatSettingsWindowActions.SAVE: {
            const userId1 = (await Utils.getUserId()) as number
            if(!userId1) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!')
                return state
            }
            state.autoResponderEnabled = Elements.autoResponderInput().checked
            state.floodingEnabled = Elements.floodingInput().checked
            state.inactiveTimer = parseInt(Elements.inactiveTimerInput().value)
            state.privateChatResponse = Elements.privateChatResponseInput().value
            state.commonChatResponse = Elements.commonChatResponseInput().value
            state.tradeChatResponse = Elements.tradeChatResponseInput().value
            state.groupChatResponse = Elements.groupChatResponseInput().value
            state.clanChatResponse = Elements.clanChatResponseInput().value
            state.allianceChatResponse = Elements.allianceChatResponseInput().value
            state.commonChatFloodingMessage = Elements.commonChatFloodingMessageInput().value
            state.commonChatFloodingTimer = parseInt(Elements.commonChatFloodingTimerInput().value)
            state.tradeChatFloodingMessage = Elements.tradeChatFloodingMessageInput().value
            state.tradeChatFloodingTimer = parseInt(Elements.tradeChatFloodingTimerInput().value)
            state.groupChatFloodingMessage = Elements.groupChatFloodingMessageInput().value
            state.groupChatFloodingTimer = parseInt(Elements.groupChatFloodingTimerInput().value)
            state.clanChatFloodingMessage = Elements.clanChatFloodingMessageInput().value
            state.clanChatFloodingTimer = parseInt(Elements.clanChatFloodingTimerInput().value)
            state.allianceChatFloodingMessage = Elements.allianceChatFloodingMessageInput().value
            state.allianceChatFloodingTimer = parseInt(Elements.allianceChatFloodingTimerInput().value)

            state.hideAttackedMessage = Elements.hideAttackedMessageInput().checked
            state.hideFightStartedMessage = Elements.hideFightStartedMessageInput().checked
            state.hideEndFightMessage = Elements.hideEndFightMessageInput().checked
            state.hideGiftPetMessage = Elements.hideGiftPetMessageInput().checked
            state.hideSocialInvitesMessage = Elements.hideSocialInvitesMessageInput().checked
            state.hideMeridianVaultsMessage = Elements.hideMeridianVaultsMessageInput().checked
            state.hideUpgradeMountMessage = Elements.hideUpgradeMountMessageInput().checked
            state.hideContestMessage = Elements.hideContestMessageInput().checked
            state.hideGuardiansMessage = Elements.hideGuardiansMessageInput().checked
            state.hideChaoticFightMessage = Elements.hideChaoticFightMessageInput().checked
            state.hideCrusibleFightMessage = Elements.hideCrusibleFightMessageInput().checked
            state.hideHeavenFightMessage = Elements.hideHeavenFightMessageInput().checked
            state.hideKesariMessage = Elements.hideKesariMessageInput().checked
            state.hideNewsMessage = Elements.hideNewsMessageInput().checked
            state.hideEventsMessage = Elements.hideEventsMessageInput().checked
            state.hideBoxPrizeMessage = Elements.hideBoxPrizeMessageInput().checked
            state.hideMedalsMessage = Elements.hideMedalsMessageInput().checked
            state.hideMentorsMessage = Elements.hideMentorsMessageInput().checked
            state.hideBanditMessage = Elements.hideBanditMessageInput().checked
            state.hidePitMessage = Elements.hidePitMessageInput().checked
            state.hideMirrorMessage = Elements.hideMirrorMessageInput().checked

            state.newLootSystem = Elements.newLootSystemInput().checked
            save(state, userId1)
            return state
        }
    }
}
