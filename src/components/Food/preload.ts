import {
    ipcRenderer,
    contextBridge
} from 'electron'
import ConfigService from '../../services/ConfigService'
import { FoodSettings } from '../../Models/FoodSettings'
import '../BaseAPI'
import { Channel } from '../../Models/Channel'

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
    },
    hpFood: () => {
        return ConfigService.hpFood() as FoodSettings
    },
    mpFood: () => {
        return ConfigService.mpFood() as FoodSettings
    },
    save: (hpFood: FoodSettings, mpFood: FoodSettings) => {
        ConfigService.writeData('hpFood', hpFood.id == null ? null : hpFood)
        ConfigService.writeData('mpFood', mpFood.id == null ? null : mpFood)
        ipcRenderer.send(Channel.FOOD_CHANGED)
    }
})

export interface FoodAPI {
    baseUrl: () => string,
    loadItemsData: (types: string[]) => any,
    hpFood: () => FoodSettings | null,
    mpFood: () => FoodSettings | null,
    save: (hpFood: FoodSettings, mpFood: FoodSettings) => void,
    fetchFood: () => any
}

declare global {
    interface Window {
        foodAPI: FoodAPI
    }
}