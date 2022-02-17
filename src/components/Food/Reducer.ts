import { ipcRenderer } from 'electron'
import { FoodType, InventoryItem } from '../../Models/InventoryItem'
import ConfigService from '../../services/ConfigService'
import { FoodWindowActions } from './Actions'
import { FoodWindowState } from './FoodWindowState'
import SimpleAlt from '../../Scripts/simple_alt'
import { FoodSettings } from '../../Models/FoodSettings'
import { Elements } from './Elements'
import Utils from '../Common/Utils'

async function fetchFood() {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/user_conf.php?mode=food').then(resp => resp.text())`
    return await ipcRenderer.invoke('MakeWebRequest', req)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function reduce(state: FoodWindowState, action: FoodWindowActions, data?: any): Promise<FoodWindowState> {
    let allItems = state.allItems
    switch (action) {
        case FoodWindowActions.LOAD_CONTENT: {
            const result = await Utils.loadItemsData(['allItems', 'allPotions', 'wearedItems', 'otherItems'])
            const foodResult = await fetchFood()
            const parser = new DOMParser()
            const doc = parser.parseFromString(foodResult, 'application/xml')
            const xmlFoodItems = Array.from(doc.documentElement.children)

            const items = Object.keys(result.allItems).map((key) => result.allItems[key]) as InventoryItem[]
            const potions = Object.keys(result.allPotions).map((key) => result.allPotions[key]) as InventoryItem[]
            const wearedItems = Object.keys(result.wearedItems).map((key) => result.wearedItems[key]) as InventoryItem[]
            const otherItems = Object.keys(result.otherItems).map((key) => result.otherItems[key]) as InventoryItem[]
            allItems = allItems.concat(items).concat(potions).concat(wearedItems).concat(otherItems)

            const allFoodItems = xmlFoodItems
                .map((xmlFoodItem) => {
                    let type: FoodType
                    if(xmlFoodItem.getAttribute('add_hp') != '0' && xmlFoodItem.getAttribute('add_mp') != '0') {
                        type = FoodType.BOTH
                    } else if(xmlFoodItem.getAttribute('add_hp') == '0') {
                        type = FoodType.MP
                    } else if(xmlFoodItem.getAttribute('add_mp') == '0') {
                        type = FoodType.HP
                    } else {
                        alert('Странная еда! Напишите в группу')
                        type = FoodType.HP
                    }
                    const item = allItems.find((item) => item.id == xmlFoodItem.id)
                    if(item) {
                        item.foodType = type
                    }
                    return item
                })
                .filter((item): item is InventoryItem => !!item)
            const userId = await Utils.getUserId()
            if(!userId) {
                console.log('Не найден user id пользователя, попробуйте авторизоваться и заново открыть автопоедалку!')
                return state
            }
            const userConfig = Utils.getUserConfig(userId)

            let currentHpFood: InventoryItem | null = null
            let currentMpFood: InventoryItem | null = null
            let currentHpPercentage = '20'
            let currentMpPercentage = '20'
            const hpFood = userConfig.hpFood
            if(hpFood) {
                currentHpFood = allFoodItems.find((item) => item.id == hpFood.id) ?? null
                currentHpPercentage = hpFood.percentage
                if(currentHpFood && currentHpFood.foodType != FoodType.BOTH) {
                    allFoodItems.removeItem(currentHpFood)
                }
            }
            const mpFood = userConfig.mpFood
            if(mpFood) {
                currentMpFood = allFoodItems.find((item) => item.id == mpFood.id) ?? null
                currentMpPercentage = mpFood.percentage
                if(currentMpFood && currentMpFood.foodType != FoodType.BOTH) {
                    allFoodItems.removeItem(currentMpFood)
                }
            }

            const art_alt = Object.assign(result.allItems, result.allPotions, result.wearedItems, result.otherItems)
            SimpleAlt.setupArtAlt(art_alt)
            
            return {
                ...state,
                allItems: allFoodItems,
                xmlFoodItems: xmlFoodItems,
                hpItem: currentHpFood,
                mpItem: currentMpFood,
                hpPercentage: currentHpPercentage,
                mpPercentage: currentMpPercentage,
                userConfig: userConfig
            }
        }
        case FoodWindowActions.EQUIP: {
            const equipedItemBox = data[0] as HTMLDivElement
            const equipedStaticItemBox = data[1] as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            const equipedItem = allItems.find((item) => item.id == itemId)

            if(!equipedItem) {
                return state
            }
            switch (equipedItem.foodType) {
                case FoodType.HP: {
                    if(equipedStaticItemBox.id == 'hpDiv') {
                        if(state.hpItem && !state.allItems.includes(state.hpItem)) {
                            allItems.push(state.hpItem)
                        }
                        allItems = allItems.removeItem(equipedItem)
                        return {
                            ...state,
                            hpItem: equipedItem,
                            allItems: allItems
                        }
                    } else {
                        return state
                    }
                }
                case FoodType.MP: {
                    if(equipedStaticItemBox.id == 'mpDiv') {
                        if(state.mpItem && !state.allItems.includes(state.mpItem)) {
                            allItems.push(state.mpItem)
                        }
                        allItems = allItems.removeItem(equipedItem)
                        return {
                            ...state,
                            mpItem: equipedItem,
                            allItems: allItems
                        }
                    } else {
                        return state
                    }
                }
                case FoodType.BOTH: {
                    if(equipedStaticItemBox.id == 'hpDiv') {
                        const equipedHpItem = allItems.find((item) => item.id == equipedStaticItemBox.lastElementChild?.getAttribute('itemid'))
                        if(!equipedHpItem && state.hpItem) {
                            allItems.push(state.hpItem)
                        }
                        return {
                            ...state,
                            hpItem: equipedItem,
                            allItems: allItems
                        }
                    } else {
                        const equipedMpItem = allItems.find((item) => item.id == equipedStaticItemBox.lastElementChild?.getAttribute('itemid'))
                        if(!equipedMpItem && state.mpItem) {
                            allItems.push(state.mpItem)
                        }
                        return {
                            ...state,
                            mpItem: equipedItem,
                            allItems: allItems
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line no-fallthrough
        case FoodWindowActions.UNEQUIP: {
            const unequipedElement = data as HTMLDivElement
            const id = unequipedElement.getAttribute('itemid')
            let hpItem = state.hpItem
            let mpItem = state.mpItem
            if(hpItem?.id == id && unequipedElement?.parentElement?.id == 'hpDiv' && hpItem) {
                if(!allItems.includes(hpItem)) {
                    allItems.push(hpItem)
                }
                hpItem = null
            }
            if(mpItem?.id == id && unequipedElement?.parentElement?.id == 'mpDiv' && mpItem) {
                if(!allItems.includes(mpItem)) {
                    allItems.push(mpItem)
                }
                mpItem = null
            }
            return {
                ...state,
                hpItem: hpItem,
                mpItem: mpItem
            }
        }
        case FoodWindowActions.SAVE: {
            if(!state.userConfig) {
                return state
            }
            let hpPercentage = Elements.hpPercentageP().textContent as string
            hpPercentage = hpPercentage.replace('%', '')
            let mpPercentage = Elements.mpPercentageP().textContent as string
            mpPercentage = mpPercentage.replace('%', '')

            const hpSetting: FoodSettings = {
                id: state.hpItem?.id,
                percentage: hpPercentage
            }
            const mpSetting: FoodSettings = {
                id: state.mpItem?.id,
                percentage: mpPercentage
            }
            state.userConfig.hpFood = hpSetting
            state.userConfig.mpFood = mpSetting
            Utils.save(state.userConfig)
            return state
        }
        case FoodWindowActions.MINUS_HP_PERCENTAGE: {
            let hpPercentage = parseInt(state.hpPercentage) - 10
            if(hpPercentage < 10) {
                hpPercentage = parseInt(state.hpPercentage)
            }
            return {
                ...state,
                hpPercentage: hpPercentage.toString()
            }
        }
        case FoodWindowActions.PLUS_HP_PERCENTAGE: {
            let hpPercentage = parseInt(state.hpPercentage) + 10
            if(hpPercentage > 100) {
                hpPercentage = parseInt(state.hpPercentage)
            }
            return {
                ...state,
                hpPercentage: hpPercentage.toString()
            }
        }
        case FoodWindowActions.MINUS_MP_PERCENTAGE: {
            let mpPercentage = parseInt(state.mpPercentage) - 10
            if(mpPercentage < 10) {
                mpPercentage = parseInt(state.mpPercentage)
            }
            return {
                ...state,
                mpPercentage: mpPercentage.toString()
            }
        }
        case FoodWindowActions.PLUS_MP_PERCENTAGE: {
            let mpPercentage = parseInt(state.mpPercentage) + 10
            if(mpPercentage > 100) {
                mpPercentage = parseInt(state.mpPercentage)
            }
            return {
                ...state,
                mpPercentage: mpPercentage.toString()
            }
        }
    }
}
