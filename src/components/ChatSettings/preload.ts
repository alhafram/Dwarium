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
    },
    getUserId: async () => {
        return await ipcRenderer.invoke(Channel.GET_ID)
    },
    getChatSettingsConfig: (id: number) => {
        return ChatSettingsService.get(id)
    }
})

export interface ChatSettingsAPI {
    save: (userConfig: ChatSettingsConfig, id: number) => void
    getUserId: () => any
    getChatSettingsConfig: (id: number) => ChatSettingsConfig
}

declare global {
    interface Window {
        chatSettingsAPI: ChatSettingsAPI
    }
}