import { contextBridge, ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'
import { UserConfig } from '../Models/UserConfig'
import ConfigService from '../services/ConfigService'
import UserConfigService from '../services/UserConfigService'

export interface baseAPI {
    baseUrl: () => string
    getUserId: () => any,
    getUserConfig: (id: number) => UserConfig
    save: (userConfig: UserConfig) => void
}

declare global {
    interface Window {
        baseAPI: baseAPI
    }
}

window.addEventListener('DOMContentLoaded', () => {
    contextBridge.exposeInMainWorld('baseAPI', {
        baseUrl: () => {
            return ConfigService.baseUrl()
        },
        getUserId: async () => {
            return await ipcRenderer.invoke(Channel.GET_ID)
        },
        getUserConfig: (id: number) => {
            return UserConfigService.get(id)
        },
        save: (userConfig: UserConfig) => {
            ipcRenderer.send(Channel.FOOD_CHANGED)
            UserConfigService.save(userConfig)
        },
    })
})