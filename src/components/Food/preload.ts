import {
    ipcRenderer,
    contextBridge
} from 'electron'
import configService from '../../services/ConfigService'
import { FoodSettings } from '../../Models/FoodSettings'
import '../BaseAPI'

contextBridge.exposeInMainWorld('foodAPI', {
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
    save: (hpFood: FoodSettings, mpFood: FoodSettings) => void
}

declare global {
    interface Window {
        foodAPI: FoodAPI
    }
}