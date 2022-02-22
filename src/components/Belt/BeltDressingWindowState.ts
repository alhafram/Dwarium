import { InventoryItem } from '../../Models/InventoryItem'
import { UserConfig } from '../../Models/UserConfig'
import { DressingFilterColor } from '../Utils'

export type BeltDressingSet = {
    id: string
    title: string
    potions: BeltDressingSetPotion[]
}

export type BeltDressingSetPotion = {
    item: string
    slot: string
    variant: string | null
    image: string
}

export type BeltDressingWindowState = {
    currentEquipedItems: InventoryItem[]
    slots: number
    variants: number
    allItems: InventoryItem[]
    activeFilters: DressingFilterColor[]
    sets: BeltDressingSet[]
    currentSet: BeltDressingSet | null
    warning: boolean
    userConfig: UserConfig | null
}
