const Elements = {
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

type ChatSettingsWindowState = {
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

var initialState: ChatSettingsWindowState = {
    autoResponderEnabled: false,
    floodingEnabled: false,
    inactiveTimer: 0,

    privateChatResponse: "",
    commonChatResponse: "",
    tradeChatResponse: "",
    groupChatResponse: "",
    clanChatResponse: "",
    allianceChatResponse: "",

    commonChatFloodingMessage: "",
    commonChatFloodingTimer: 10,
    tradeChatFloodingMessage: "",
    tradeChatFloodingTimer: 10,
    groupChatFloodingMessage: "",
    groupChatFloodingTimer: 10,
    clanChatFloodingMessage: "",
    clanChatFloodingTimer: 10,
    allianceChatFloodingMessage: "",
    allianceChatFloodingTimer: 10
}

enum ChatSettingsWindowActions {
    LOAD_CONTENT,

    CHANGE_AUTO_RESPONDER_ENABLED,
    CHANGE_FLOODING_ENABLED,
    CHANGE_INACTIVE_TIMER,

    CHANGE_PRIVATE_CHAT_RESPONSE,
    CHANGE_COMMON_CHAT_RESPONSE,
    CHANGE_TRADE_CHAT_RESPONSE,
    CHANGE_GROUP_CHAT_RESPONSE,
    CHANGE_CLAN_CHAT_RESPONSE,
    CHANGE_ALLIANCE_CHAT_RESPONSE,

    CHANGE_COMMON_CHAT_FLOODING_MESSAGE,
    CHANGE_COMMON_CHAT_FLOODING_TIMER,

    CHANGE_TRADE_CHAT_FLOODING_MESSAGE,
    CHANGE_TRADE_CHAT_FLOODING_TIMER,

    CHANGE_GROUP_CHAT_FLOODING_MESSAGE,
    CHANGE_GROUP_CHAT_FLOODING_TIMER,

    CHANGE_CLAN_CHAT_FLOODING_MESSAGE,
    CHANGE_CLAN_CHAT_FLOODING_TIMER,

    CHANGE_ALLIANCE_CHAT_FLOODING_MESSAGE,
    CHANGE_ALLIANCE_CHAT_FLOODING_TIMER,
    
    SAVE
}

async function reduce(state: ChatSettingsWindowState = initialState, action: ChatSettingsWindowActions, data?: any): Promise<ChatSettingsWindowState> {
    switch(action) {
        case ChatSettingsWindowActions.LOAD_CONTENT:
            const userId = await window.chatSettingsAPI.getUserId() as number
            if(!userId) {
                console.log("Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!")
                return state
            }
            const chatSettingsConfig = window.chatSettingsAPI.getChatSettingsConfig(userId)
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
            const userId1 = await window.chatSettingsAPI.getUserId() as number
            if(!userId1) {
                console.log("Не найден user id пользователя, попробуйте авторизоваться и заново открыть настройки чата!")
                return state
            }
            console.log(state)
            window.chatSettingsAPI.save(state, userId1)
            return state
    }
}

async function dispatch(action: ChatSettingsWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render()
}

function render(): void {
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

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(ChatSettingsWindowActions.LOAD_CONTENT)
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
            window.chatSettingsAPI.openSettings()
        }
        dispatch(ChatSettingsWindowActions.SAVE)
    }
})

export {}