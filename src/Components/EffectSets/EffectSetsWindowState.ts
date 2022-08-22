import { EffectSet } from '../../Models/EffectSet'
import { InventoryItem } from '../../Models/InventoryItem'
import { UserConfig } from '../../Models/UserConfig'
import { DressingFilterColor } from '../Common/Utils'

export type EffectSetsWindowState = {
    allItems: InventoryItem[]
    currentItems: InventoryItem[]
    currentSet: EffectSet | null
    sets: EffectSet[]
    userConfig: UserConfig | null
    activeFilters: DressingFilterColor[]
    searchEffect: string
}
