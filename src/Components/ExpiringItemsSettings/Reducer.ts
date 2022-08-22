import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import SimpleAlt from '../../Scripts/simple_alt'
import { loadExpiringItems } from '../../services/ExpiringItemsLoader'
import UserConfigService from '../../services/UserConfigService'
import Utils from '../Common/Utils'
import { ExpiringItemsSettingsWindowActions } from './Actions'
import { Elements } from './Elements'
import { ExpiringItemsSettingsWindowState } from './ExpiringItemsSettingsWindowState'

export default async function reduce(state: ExpiringItemsSettingsWindowState, action: ExpiringItemsSettingsWindowActions, data?: any): Promise<ExpiringItemsSettingsWindowState> {
    switch (action) {
        case ExpiringItemsSettingsWindowActions.LOAD_CONTENT: {
            const expiringItemsContainer = await loadExpiringItems()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const expiringItems = expiringItemsContainer.allItems.sort((a, b) => a.quality - b.quality)
            SimpleAlt.setupArtAlt(expiringItemsContainer.altItems)

            const userId = (await Utils.getUserId()) as number
            if(!userId) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть автопоедалку!')
                return state
            }
            const userConfig = Utils.getUserConfig(userId)
            const currentItems = expiringItems.filter((item) => (userConfig.expiringItemIds ?? []).includes(item.id))

            return {
                ...state,
                allItems: expiringItems,
                userConfig: userConfig,
                currentItems
            }
        }
        case ExpiringItemsSettingsWindowActions.ADD_ITEM: {
            const itemid = data as string
            const item = state.allItems.find((item) => item.id == itemid)
            if(!item) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return state
            }
            if(state.currentItems.includes(item)) {
                alert('Такой предмет уже есть в наборе')
                return state
            }
            state.currentItems.push(item)
            return {
                ...state
            }
        }
        case ExpiringItemsSettingsWindowActions.REMOVE_ITEM: {
            const itemid = data as string
            const item = state.allItems.find((item) => item.id == itemid)
            if(!item) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return state
            }
            const currentItems = state.currentItems.removeItem(item)
            return {
                ...state,
                currentItems: currentItems
            }
        }
        case ExpiringItemsSettingsWindowActions.ADD_FILTER: {
            const newFilters = state.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        }
        case ExpiringItemsSettingsWindowActions.REMOVE_FILTER: {
            let newFilters = state.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        }
        case ExpiringItemsSettingsWindowActions.SAVE_ITEMS: {
            state.userConfig!.expiringItemIds = state.currentItems.map((item) => item.id)
            UserConfigService.save(state.userConfig!)
            ipcRenderer.send(Channel.EXPIRING_ITEMS_CHANGED)
            return state
        }
        case ExpiringItemsSettingsWindowActions.SEARCH_EFFECT: {
            const searchString = Elements.searchEffectInput().value
            return {
                ...state,
                searchEffect: searchString
            }
        }
    }
}
