import { ipcRenderer } from "electron"
import { Channel } from "../../Models/Channel"
import { FoodType, InventoryItem } from "../../Models/InventoryItem"
import { UserConfig } from "../../Models/UserConfig"
import ConfigService from "../../services/ConfigService"
import UserConfigService from "../../services/UserConfigService"
import { FoodWindowActions } from "./Actions"
import { FoodWindowState } from "./State"
import SimpleAlt from './simple_alt'
import { FoodSettings } from "../../Models/FoodSettings"
import { Elements } from './Elements'

async function loadItemsData(types: string[]) {
    return await ipcRenderer.invoke('LoadSetItems', types)
}
async function fetchFood() {
    let req = `fetch('${ConfigService.baseUrl()}/user_conf.php?mode=food').then(resp => resp.text())`
    return await ipcRenderer.invoke('MakeWebRequest', req)
}

async function getUserId() {
    return await ipcRenderer.invoke(Channel.GET_ID)
}
function getUserConfig(id: number) {
    return UserConfigService.get(id)
}
function save(userConfig: UserConfig) {
    ipcRenderer.send(Channel.FOOD_CHANGED)
    UserConfigService.save(userConfig)
}

export default async function reduce(state: FoodWindowState, action: FoodWindowActions, data?: any): Promise<FoodWindowState> {
    let allItems = state.allItems
    switch(action) {
        case FoodWindowActions.LOAD_CONTENT:
            let result = await loadItemsData(['allItems', 'allPotions', 'wearedItems', 'otherItems'])
            let foodResult = await fetchFood()
            const parser = new DOMParser()
            const doc = parser.parseFromString(foodResult, "application/xml")
            const xmlFoodItems = Array.from(doc.documentElement.children)
            
            const items = Object.keys(result.allItems).map(key => result.allItems[key]) as InventoryItem[]
            const potions = Object.keys(result.allPotions).map(key => result.allPotions[key]) as InventoryItem[]
            const wearedItems = Object.keys(result.wearedItems).map(key => result.wearedItems[key]) as InventoryItem[]
            const otherItems = Object.keys(result.otherItems).map(key => result.otherItems[key]) as InventoryItem[]
            allItems = allItems.concat(items).concat(potions).concat(wearedItems).concat(otherItems)
            
            const allFoodItems = xmlFoodItems.map(xmlFoodItem => {
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
                let item = allItems.find(item => item.id == xmlFoodItem.id)!
                item!.foodType = type
                return item
            })
            const userId = await getUserId() as number
            if(!userId) {
                console.log("Не найден user id пользователя, попробуйте авторизоваться и заново открыть автопоедалку!")
                return state
            }
            const userConfig = getUserConfig(userId)

            let currentHpFood: InventoryItem | null = null
            let currentMpFood: InventoryItem | null = null
            let currentHpPercentage = '20'
            let currentMpPercentage = '20'
            const hpFood = userConfig.hpFood
            if(hpFood) {
                currentHpFood = allFoodItems.find(item => item.id == hpFood.id) ?? null
                currentHpPercentage = hpFood.percentage
                if(currentHpFood && currentHpFood.foodType != FoodType.BOTH) {
                    allFoodItems.removeItem(currentHpFood)
                }
            }
            const mpFood = userConfig.mpFood
            if(mpFood) {
                currentMpFood = allFoodItems.find(item => item.id == mpFood.id) ?? null
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
                hpItem: currentHpFood,
                mpItem: currentMpFood,
                hpPercentage: currentHpPercentage,
                mpPercentage: currentMpPercentage,
                userConfig: userConfig
            }
        case FoodWindowActions.EQUIP:
            const equipedItemBox = data[0] as HTMLDivElement
            const equipedStaticItemBox = data[1] as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            let equipedItem = allItems.find(item => item.id == itemId)
            
            if(!equipedItem) {
                return state
            }
            switch(equipedItem.foodType) {
                case FoodType.HP:
                    if(equipedStaticItemBox.id == 'hp') {
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
                case FoodType.MP:
                    if(equipedStaticItemBox.id == 'mp') {
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
                case FoodType.BOTH:
                    if(equipedStaticItemBox.id == 'hp') {
                        const equipedHpItem = allItems.find(item => item.id == equipedStaticItemBox.firstElementChild?.getAttribute('itemid'))
                        if(!equipedHpItem && state.hpItem) {
                            allItems.push(state.hpItem)
                        }
                        return {
                            ...state,
                            hpItem: equipedItem,
                            allItems: allItems
                        }
                    } else {
                        const equipedMpItem = allItems.find(item => item.id == equipedStaticItemBox.firstElementChild?.getAttribute('itemid'))
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
        case FoodWindowActions.UNEQUIP:
            let unequipedElement = data as HTMLDivElement
            const id = unequipedElement.getAttribute('itemid')!
            let hpItem = state.hpItem
            let mpItem = state.mpItem
            if(hpItem?.id == id && unequipedElement?.parentElement?.id == 'hp') {
                if(!allItems.includes(hpItem)) {
                    allItems.push(hpItem)
                }
                hpItem = null
            }
            if(mpItem?.id == id && unequipedElement?.parentElement?.id == 'mp') {
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
        case FoodWindowActions.SAVE:
            const hpPercentage = Elements.hpSelectBox().value
            const mpPercentage = Elements.mpSelectBox().value

            let hpSetting: FoodSettings = {
                id: state.hpItem?.id,
                percentage: hpPercentage
            }
            let mpSetting: FoodSettings = {
                id: state.mpItem?.id,
                percentage: mpPercentage
            }
            state.userConfig!.hpFood = hpSetting
            state.userConfig!.mpFood = mpSetting
            save(state.userConfig!)
            return state
        case FoodWindowActions.CHANGE_HP_PERCENTAGE:
            return {
                ...state,
                hpPercentage: Elements.hpSelectBox().value
            }
        case FoodWindowActions.CHANGE_MP_PERCENTAGE:
            return {
                ...state,
                mpPercentage: Elements.mpSelectBox().value
            }
    }
}