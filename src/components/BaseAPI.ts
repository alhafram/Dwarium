import { contextBridge } from 'electron'
import configService from '../services/ConfigService'

export interface baseAPI {
    baseUrl: () => string
}

declare global {
    interface Window {
        baseAPI: baseAPI
    }
}

window.addEventListener('DOMContentLoaded', () => {
    contextBridge.exposeInMainWorld('baseAPI', {
        baseUrl: () => {
            return configService.baseUrl()
        }
    })
})