import { DressingSet } from "../../Models/DressingSet"
import { InventoryItem } from "../../Models/InventoryItem"
import { UserConfig } from "../../Models/UserConfig"
import { DressingFilterColor } from "../Utils"

export type DressingWindowState = {
    selectedStaticItemId: string | null,
    currentEquipedItems: InventoryItem[],
    allItems: InventoryItem[],
    arcats: InventoryItem[],
    rings: InventoryItem[],
    amulets: InventoryItem[],
    activeFilters: DressingFilterColor[],
    sets: DressingSet[],
    currentSet: DressingSet | null,
    currentStyle: string | null,
    currentMagicSchool: string | null,
    arcatsCount: number,
    zikkuratId: string | null,
    userConfig: UserConfig | null
}