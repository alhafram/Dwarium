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
}