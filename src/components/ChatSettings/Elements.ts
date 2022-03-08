export const Elements = {
    autoResponderBox(): HTMLInputElement {
        return document.getElementById('autoResponderEnabled') as HTMLInputElement
    },
    floodingBox(): HTMLInputElement {
        return document.getElementById('floodingEnabled') as HTMLInputElement
    },
    inactiveTimerBox(): HTMLInputElement {
        return document.getElementById('inactiveTimer') as HTMLInputElement
    },
    privateChatResponseBox(): HTMLInputElement {
        return document.getElementById('privateChatResponse') as HTMLInputElement
    },
    commonChatResponseBox(): HTMLInputElement {
        return document.getElementById('commonChatResponse') as HTMLInputElement
    },
    tradeChatResponseBox(): HTMLInputElement {
        return document.getElementById('tradeChatResponse') as HTMLInputElement
    },
    groupChatResponseBox(): HTMLInputElement {
        return document.getElementById('groupChatResponse') as HTMLInputElement
    },
    clanChatResponseBox(): HTMLInputElement {
        return document.getElementById('clanChatResponse') as HTMLInputElement
    },
    allianceChatResponseBox(): HTMLInputElement {
        return document.getElementById('allianceChatResponse') as HTMLInputElement
    },
    commonChatFloodingMessageBox(): HTMLInputElement {
        return document.getElementById('commonChatFloodingMessage') as HTMLInputElement
    },
    commonChatFloodingTimerBox(): HTMLInputElement {
        return document.getElementById('commonChatFloodingTimer') as HTMLInputElement
    },
    tradeChatFloodingMessageBox(): HTMLInputElement {
        return document.getElementById('tradeChatFloodingMessage') as HTMLInputElement
    },
    tradeChatFloodingTimerBox(): HTMLInputElement {
        return document.getElementById('tradeChatFloodingTimer') as HTMLInputElement
    },
    groupChatFloodingMessageBox(): HTMLInputElement {
        return document.getElementById('groupChatFloodingMessage') as HTMLInputElement
    },
    groupChatFloodingTimerBox(): HTMLInputElement {
        return document.getElementById('groupChatFloodingTimer') as HTMLInputElement
    },
    clanChatFloodingMessageBox(): HTMLInputElement {
        return document.getElementById('clanChatFloodingMessage') as HTMLInputElement
    },
    clanChatFloodingTimerBox(): HTMLInputElement {
        return document.getElementById('clanChatFloodingTimer') as HTMLInputElement
    },
    allianceChatFloodingMessageBox(): HTMLInputElement {
        return document.getElementById('allianceChatFloodingMessage') as HTMLInputElement
    },
    allianceChatFloodingTimerBox(): HTMLInputElement {
        return document.getElementById('allianceChatFloodingTimer') as HTMLInputElement
    },
    saveBox() {
        return document.getElementById('save') as HTMLButtonElement
    }
}