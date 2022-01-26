import {
    ipcRenderer,
    contextBridge
} from 'electron'
import configService from '../../services/ConfigService'
import { FoodSettings } from '../../Models/FoodSettings'
import '../BaseAPI'

contextBridge.exposeInMainWorld('foodAPI', {
    loadItem: async (id: string) => {
        let req = `fetch(
            '${configService.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${id}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1', {
                'method': 'GET',
                'mode': 'cors',
                'credentials': 'include'
            }).then(resp => resp.text())`
        return ipcRenderer.invoke('MakeWebRequest', req)
    },
    baseUrl: () => {
        return configService.baseUrl()
    },
    loadItemsData: async (types: string[]) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    hpFood: () => {
        return configService.hpFood() as FoodSettings
    },
    mpFood: () => {
        return configService.mpFood() as FoodSettings
    },
    save: (hpFood: FoodSettings, mpFood: FoodSettings) => {
        configService.writeData('hpFood', hpFood.id == null ? null : hpFood)
        configService.writeData('mpFood', mpFood.id == null ? null : mpFood)
    }
})

export interface FoodAPI {
    baseUrl: () => string,
    loadItemsData: (types: string[]) => any,
    hpFood: () => FoodSettings | null,
    mpFood: () => FoodSettings | null,
    save: (hpFood: FoodSettings, mpFood: FoodSettings) => void,
    loadItem: (id: string) => string
}

declare global {
    interface Window {
        foodAPI: FoodAPI
    }
}