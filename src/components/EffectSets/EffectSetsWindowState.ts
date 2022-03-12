import { EffectSet } from '../../Models/EffectSet'
import { InventoryItem } from '../../Models/InventoryItem'
import { UserConfig } from '../../Models/UserConfig'

export type EffectSetsWindowState = {
    allItems: InventoryItem[]
    currentItems: InventoryItem[]
    currentSet: EffectSet | null
    sets: EffectSet[]
    userConfig: UserConfig | null
}
