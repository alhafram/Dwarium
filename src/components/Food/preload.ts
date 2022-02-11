import {
    ipcRenderer,
    contextBridge
} from 'electron'
import ConfigService from '../../services/ConfigService'
import '../BaseAPI'

contextBridge.exposeInMainWorld('foodAPI', {
    baseUrl: () => {
        return ConfigService.baseUrl()
    },
    loadItemsData: async (types: string[]) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    fetchFood: async () => {
        let req = `fetch('${ConfigService.baseUrl()}/user_conf.php?mode=food').then(resp => resp.text())`
        return await ipcRenderer.invoke('MakeWebRequest', req)
    }
})

export interface FoodAPI {
    baseUrl: () => string,
    loadItemsData: (types: string[]) => any,
    fetchFood: () => any,
}

declare global {
    interface Window {
        foodAPI: FoodAPI
    }
}