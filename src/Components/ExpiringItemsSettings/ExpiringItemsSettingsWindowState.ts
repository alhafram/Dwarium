import { InventoryItem } from '../../Models/InventoryItem'
import { UserConfig } from '../../Models/UserConfig'
import { DressingFilterColor } from '../Common/Utils'

export type ExpiringItemsSettingsWindowState = {
    allItems: InventoryItem[]
    currentItems: InventoryItem[]
    activeFilters: DressingFilterColor[]
    userConfig: UserConfig | null
    searchEffect: string
}
