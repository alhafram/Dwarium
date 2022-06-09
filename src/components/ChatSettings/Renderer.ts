import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import dispatch from './preload'
import { ChatSettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { ChatSettingsConfig } from '../../Models/ChatSettingsConfig'

function render(initialState: ChatSettingsConfig) {
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

    Elements.hideAttackedMessageInput().checked = initialState.hideAttackedMessage
    Elements.hideEndFightMessageInput().checked = initialState.hideEndFightMessage
    Elements.hideGiftPetMessageInput().checked = initialState.hideGiftPetMessage = Elements.hideSocialInvitesMessageInput().checked = initialState.hideSocialInvitesMessage
    Elements.hideMeridianVaultsMessageInput().checked = initialState.hideMeridianVaultsMessage
    Elements.hideUpgradeMountMessageInput().checked = initialState.hideUpgradeMountMessage
    Elements.hideContestMessageInput().checked = initialState.hideContestMessage
    Elements.hideGuardiansMessageInput().checked = initialState.hideGuardiansMessage
    Elements.hideChaoticFightMessageInput().checked = initialState.hideChaoticFightMessage
    Elements.hideCrusibleFightMessageInput().checked = initialState.hideCrusibleFightMessage
    Elements.hideHeavenFightMessageInput().checked = initialState.hideHeavenFightMessage
    Elements.hideKesariMessageInput().checked = initialState.hideKesariMessage
    Elements.hideNewsMessageInput().checked = initialState.hideNewsMessage
    Elements.hideEventsMessageInput().checked = initialState.hideEventsMessage
    Elements.hideBoxPrizeMessageInput().checked = initialState.hideBoxPrizeMessage
    Elements.hideMedalsMessageInput().checked = initialState.hideMedalsMessage
    Elements.hideMentorsMessageInput().checked = initialState.hideMentorsMessage
    Elements.hideBanditMessageInput().checked = initialState.hideBanditMessage
    Elements.hidePitMessageInput().checked = initialState.hidePitMessage
    Elements.hideMirrorMessageInput().checked = initialState.hideMirrorMessage

    Elements.newLootSystemInput().checked = initialState.newLootSystem
}

function setupView() {
    Elements.inactiveTimerInput().onkeyup = () => {
        const value = parseInt(Elements.inactiveTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.inactiveTimerInput().value = '0'
        }
    }
    Elements.commonChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.commonChatFloodingTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.commonChatFloodingTimerInput().value = '1'
        }
    }
    Elements.tradeChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.tradeChatFloodingTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.tradeChatFloodingTimerInput().value = '1'
        }
    }
    Elements.groupChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.groupChatFloodingTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.groupChatFloodingTimerInput().value = '1'
        }
    }
    Elements.clanChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.clanChatFloodingTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.clanChatFloodingTimerInput().value = '1'
        }
    }
    Elements.allianceChatFloodingTimerInput().onkeyup = () => {
        const value = parseInt(Elements.allianceChatFloodingTimerInput().value)
        if(value <= 1 || isNaN(value)) {
            Elements.allianceChatFloodingTimerInput().value = '1'
        }
    }
    Elements.saveButton().onclick = () => {
        if(confirm('При включении автоответчика/флудилки, рекомендуем использовать UserAgent 4-й версии клиента. Открыть настройки клиента?')) {
            ipcRenderer.send(Channel.OPEN_SETTINGS)
        }
        dispatch(ChatSettingsWindowActions.SAVE)
        ipcRenderer.send(Channel.RELOAD)
    }
}

export { render, setupView }
