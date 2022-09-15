import { InventoryItem } from '../../Models/InventoryItem'
import { UserConfig } from '../../Models/UserConfig'

export type FoodWindowState = {
    allItems: InventoryItem[]
    xmlFoodItems: Element[]
    hpItem: InventoryItem | null
    mpItem: InventoryItem | null
    hpPercentage: string
    mpPercentage: string
    userConfig: UserConfig | null
}
