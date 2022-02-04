import {
    ipcRenderer,
    contextBridge
} from 'electron'
import { Channel } from '../../Models/Channel'
import { ChatSettingsConfig } from '../../Models/ChatSettingsConfig'
import ChatSettingsService from '../../services/ChatSettingsService'

contextBridge.exposeInMainWorld('chatSettingsAPI', {
    save: (userConfig: ChatSettingsConfig, id: number) => {
        ChatSettingsService.save(userConfig, id)
        ipcRenderer.send(Channel.CHAT_SETTINGS_CHANGED)
    },
    getUserId: async () => {
        return await ipcRenderer.invoke(Channel.GET_ID)
    },
    getChatSettingsConfig: (id: number) => {
        return ChatSettingsService.get(id)
    },
    openSettings: () => {
        ipcRenderer.send(Channel.OPEN_SETTINGS)
    }
})

export interface ChatSettingsAPI {
    save: (userConfig: ChatSettingsConfig, id: number) => void
    getUserId: () => any
    getChatSettingsConfig: (id: number) => ChatSettingsConfig
    openSettings: () => void
}

declare global {
    interface Window {
        chatSettingsAPI: ChatSettingsAPI
    }
}