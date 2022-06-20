import { ChatSettingsWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../services/DarkModeHandler'
import { render, setupView } from './Renderer'
import { ChatSettingsConfig } from '../../Models/ChatSettingsConfig'

let initialState: ChatSettingsConfig = {
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
    allianceChatFloodingTimer: 10,

    hideAttackedMessage: false,
    hideFightStartedMessage: false,
    hideEndFightMessage: false,
    hideGiftPetMessage: false,
    hideSocialInvitesMessage: false,
    hideMeridianVaultsMessage: false,
    hideUpgradeMountMessage: false,
    hideContestMessage: false,
    hideGuardiansMessage: false,
    hideChaoticFightMessage: false,
    hideCrusibleFightMessage: false,
    hideHeavenFightMessage: false,
    hideKesariMessage: false,
    hideNewsMessage: false,
    hideEventsMessage: false,
    hideBoxPrizeMessage: false,
    hideMedalsMessage: false,
    hideMentorsMessage: false,
    hideBanditMessage: false,
    hidePitMessage: false,
    hideMirrorMessage: false,

    newLootSystem: false
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
