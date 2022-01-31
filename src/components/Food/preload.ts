import {
    ipcRenderer,
    contextBridge
} from 'electron'
import ConfigService from '../../services/ConfigService'
import { FoodSettings } from '../../Models/FoodSettings'
import UserConfigService from '../../services/UserConfigService'
import { UserConfig } from '../../Models/UserConfig'
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
    // Refactor 1.0.15
    hpFood: () => {
        return ConfigService.hpFood()
    },
    mpFood: () => {
        return ConfigService.mpFood()
    },
    saveOld: (hpFood: FoodSettings, mpFood: FoodSettings) => {
        ConfigService.writeData('hpFood', hpFood.id == null ? null : hpFood)
        ConfigService.writeData('mpFood', mpFood.id == null ? null : mpFood)
        ipcRenderer.send(Channel.FOOD_CHANGED)
    },
    saveNew: (userConfig: UserConfig) => {
        UserConfigService.save(userConfig)
    },
    getUserId: async () => {
        const id = await ipcRenderer.invoke(Channel.GET_ID)
        return id
    },
    getUserConfig: (id: number) => {
        return UserConfigService.get(id)
    }
})

export interface FoodAPI {
    baseUrl: () => string,
    loadItemsData: (types: string[]) => any,
    hpFood: () => FoodSettings | null,
    mpFood: () => FoodSettings | null,
    saveOld: (hpFood: FoodSettings, mpFood: FoodSettings) => void,
    saveNew: (userConfig: UserConfig) => void,
    fetchFood: () => any,
    getUserId: () => any,
    getUserConfig: (id: number) => UserConfig
}

declare global {
    interface Window {
        foodAPI: FoodAPI
    }
}