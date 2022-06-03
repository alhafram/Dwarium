export type ChatSettingsConfig = {
    autoResponderEnabled: boolean
    floodingEnabled: boolean
    inactiveTimer: number

    privateChatResponse: string
    commonChatResponse: string
    tradeChatResponse: string
    groupChatResponse: string
    clanChatResponse: string
    allianceChatResponse: string

    commonChatFloodingMessage: string
    commonChatFloodingTimer: number
    tradeChatFloodingMessage: string
    tradeChatFloodingTimer: number
    groupChatFloodingMessage: string
    groupChatFloodingTimer: number
    clanChatFloodingMessage: string
    clanChatFloodingTimer: number
    allianceChatFloodingMessage: string
    allianceChatFloodingTimer: number

    hideAttackedMessage: boolean
    hideEndFightMessage: boolean
    hideGiftPetMessage: boolean
    hideSocialInvitesMessage: boolean
    hideMeridianVaultsMessage: boolean
    hideUpgradeMountMessage: boolean
    hideContestMessage: boolean
    hideGuardiansMessage: boolean
    hideChaoticFightMessage: boolean
    hideCrusibleFightMessage: boolean
    hideHeavenFightMessage: boolean
    hideKesariMessage: boolean
    hideNewsMessage: boolean
    hideEventsMessage: boolean
    hideBoxPrizeMessage: boolean
    hideMedalsMessage: boolean
    hideMentorsMessage: boolean
    hideBanditMessage: boolean
    hidePitMessage: boolean
    hideMirrorMessage: boolean
}
