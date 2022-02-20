import { InventoryItem } from '../../Models/InventoryItem'
import Utils from '../Common/Utils'
import { BeltDressingWindowActions } from './Actions'
import { BeltDressingWindowState, BeltDressingSet, BeltDressingSetPotion } from './BeltDressingWindowState'
import { Elements } from './Elements'
import SimpleAlt from '../../Scripts/simple_alt'
import { DressingFilterColor, generateRandomId } from '../Utils'
import Requests from './Requests'

type EquipedPotion = {
    id: string
    title: string
    slot: number
    variant: boolean
    image: string
}

function parsePotions(items: InventoryItem[]) {
    let potions = Object.values(items)
    potions = potions.filter((item) => item.type_id == '7' && item.kind_id != '65')
    return potions
}

function generateSetPotions(items: InventoryItem[]): BeltDressingSetPotion[] {
    return items.map((item) => {
        return {
            item: item.title,
            slot: item.slot!,
            variant: item.variant!,
            quality: item.quality,
            image: item.picture!
        }
    })
}

function copyInventoryItem(item?: InventoryItem, box?: Element): InventoryItem {
    const copyItem = Object.assign({}, item) as InventoryItem
    copyItem.slot = box?.getAttribute('slot') ?? null
    copyItem.variant = box?.getAttribute('variant') ?? null
    copyItem.cnt = null
    return copyItem
}

function copyInventoryItemWithoutBox(item: InventoryItem, potion: EquipedPotion | BeltDressingSetPotion): InventoryItem {
    const copyItem = Object.assign({}, item) as InventoryItem
    copyItem.slot = potion.slot.toString()
    copyItem.variant = potion.variant ? 'true' : null
    copyItem.cnt = null
    return copyItem
}

function disableButtons(disabled: boolean) {
    Elements.saveSetBox().disabled = disabled
    Elements.equipSetBox().disabled = disabled
    Elements.unequipBox().disabled = disabled
}

function generateSetId() {
    return 'belt_set_' + generateRandomId()
}

async function parseEquipedPotions() {
    const equipedPotionsReq = await Requests.getEquipedPotions()
    const equipedPotions: EquipedPotion[] = equipedPotionsReq.flat().filter((potion: EquipedPotion) => potion)
    for(const item of equipedPotions) {
        const res = (await Requests.fetchItem(item.id!)) as string
        const doc = res.toDocument() as Document
        const title = doc.querySelector(
            'body > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td.tbl-usi_bg > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td:nth-child(2) > h1 > b'
        )?.textContent
        item.title = title ?? ''
    }
    return equipedPotions
}

export default async function reduce(state: BeltDressingWindowState, action: BeltDressingWindowActions, data?: any): Promise<BeltDressingWindowState> {
    let newFilters: DressingFilterColor[] = []
    let sets = state.sets
    let currentEquipedItems = state.currentEquipedItems
    switch (action) {
        case BeltDressingWindowActions.LOAD_CONTENT:
            const [slots, variants] = await Requests.getSlots()
            const items = await Requests.loadItemsData(['allPotions'])
            let allItems = parsePotions(items.allPotions)
            // @ts-ignore
            allItems = allItems.sort((a, b) => a.quality - b.quality)
            const equipedPotionsAltRes = await Requests.getEquipedPotionsAlt()
            SimpleAlt.setupArtAlt(Object.assign(items.allPotions, equipedPotionsAltRes))

            const userId = (await Utils.getUserId()) as number
            if(!userId) {
                console.log('Не найден user id пользователя, попробуйте авторизоваться и заново открыть автопоедалку!')
                return state
            }
            const userConfig = Utils.getUserConfig(userId)
            sets = userConfig.beltSets

            let hasWarning = false
            if(!data) {
                const equipedPotions = await parseEquipedPotions()
                currentEquipedItems = equipedPotions
                    .map((potion) => {
                        const foundItem = allItems.find((item) => item.title == potion.title && item.picture!.includes(potion.image))
                        if(foundItem) {
                            return copyInventoryItemWithoutBox(foundItem, potion)
                        } else {
                            hasWarning = true
                        }
                    })
                    .filter((item) => item !== undefined) as InventoryItem[]
            }
            return {
                ...state,
                slots: slots,
                variants: variants,
                allItems: allItems,
                sets: sets,
                currentEquipedItems: currentEquipedItems,
                warning: hasWarning,
                userConfig: userConfig
            }
        case BeltDressingWindowActions.EQUIP:
            const equipedItemBox = data as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            let equipedItem = state.allItems.find((item) => item.id == itemId)
            const emptyBox = Array.from(Elements.staticBoxes()).find((box) => box.childElementCount == 0)
            if(!equipedItem) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return {
                    ...state
                }
            }
            if(!emptyBox) {
                return state
            }
            equipedItem = copyInventoryItem(equipedItem, emptyBox)
            currentEquipedItems.push(equipedItem)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems
            }
        case BeltDressingWindowActions.EQUIP_DND:
            console.log(data)
            const equipedItemBox1 = data[0] as HTMLDivElement
            const equipedStaticItemBox = data[1] as HTMLDivElement
            const itemId1 = equipedItemBox1.getAttribute('itemid')
            let equipedItem1 = state.allItems.find((item) => item.id == itemId1)
            if(!equipedItem1) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return {
                    ...state
                }
            }
            equipedItem1 = copyInventoryItem(equipedItem1, equipedStaticItemBox)
            currentEquipedItems.push(equipedItem1)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems
            }
        case BeltDressingWindowActions.UNEQUIP_ITEM:
            const unequipedItemBox = data as HTMLDivElement
            const variant = unequipedItemBox.getAttribute('variant')
            const slot = unequipedItemBox.getAttribute('slot')
            const unequipedItem = currentEquipedItems.find((item) => item.variant == variant && item.slot == slot)
            if(!unequipedItem) {
                return {
                    ...state
                }
            }
            currentEquipedItems = currentEquipedItems.removeItem(unequipedItem)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems
            }
        case BeltDressingWindowActions.ADD_FILTER:
            newFilters = state.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case BeltDressingWindowActions.REMOVE_FILTER:
            newFilters = state.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case BeltDressingWindowActions.CREATE_NEW_SET:
            const newSet = data as BeltDressingSet
            sets.push(newSet)
            state.userConfig!.beltSets = sets
            Utils.save(state.userConfig!)
            return {
                ...state,
                currentSet: newSet,
                sets: sets,
                currentEquipedItems: []
            }
        case BeltDressingWindowActions.SAVE_SET:
            let set = state.currentSet
            if(set) {
                set.title = Elements.setTitleBox().value
                set.potions = generateSetPotions(state.currentEquipedItems)
                sets[sets.indexOf(set)] = set
                set.isNew = false
            } else {
                set = {
                    id: generateSetId(),
                    title: Elements.setTitleBox().value,
                    potions: generateSetPotions(state.currentEquipedItems),
                    isNew: true
                }
                sets.push(set)
            }
            state.userConfig!.beltSets = sets
            Utils.save(state.userConfig!)
            return {
                ...state,
                currentSet: set,
                sets: sets
            }
        case BeltDressingWindowActions.REMOVE_SET:
            const deletedSetBox = data as HTMLDivElement | null
            const deletedSet = sets.find((set) => set.id == deletedSetBox?.id)
            if(deletedSet) {
                const isCurrentSet = deletedSet == state.currentSet
                sets = sets.removeItem(deletedSet)

                state.userConfig!.beltSets = sets
                Utils.save(state.userConfig!)

                currentEquipedItems = isCurrentSet ? [] : state.currentEquipedItems
                const currentSet = isCurrentSet ? null : state.currentSet
                return {
                    ...state,
                    sets: sets,
                    currentEquipedItems: currentEquipedItems,
                    currentSet: currentSet
                }
            } else {
                return {
                    ...state
                }
            }
        case BeltDressingWindowActions.SELECT_SET:
            const selectedSet = data as BeltDressingSet
            const items1 = selectedSet.potions
                .map((potion) => {
                    let inventoryPotion = state.allItems.find((item) => item.title == potion.item && item.picture!.includes(potion.image))
                    inventoryPotion = Object.assign({}, inventoryPotion)
                    if(inventoryPotion.title) {
                        return copyInventoryItemWithoutBox(inventoryPotion, potion)
                    } else {
                        return undefined
                    }
                })
                .filter((item) => item != undefined) as InventoryItem[]
            return {
                ...state,
                currentSet: selectedSet,
                currentEquipedItems: items1
            }
        case BeltDressingWindowActions.UNEQUIP_ALL:
            return {
                ...state,
                currentEquipedItems: []
            }
        case BeltDressingWindowActions.EQUIP_FROM_SET:
            if(!state.currentSet) {
                return state
            }
            disableButtons(true)
            const equipedPotions = await parseEquipedPotions()
            let needToUnequip: EquipedPotion[] = []
            const needToEquip: InventoryItem[] = []
            state.currentSet.potions.forEach((setPotion) => {
                const setPotionInEquipedPotions = equipedPotions.find((a) => a.slot.toString() == setPotion.slot && a.variant == (setPotion.variant == null ? false : true))
                let needToEquipPotion = state.allItems.find((item) => item.title == setPotion.item && item.picture!.includes(setPotion.image))
                if(setPotionInEquipedPotions && (setPotion.item != setPotionInEquipedPotions.title || !needToEquipPotion?.picture!.includes(setPotionInEquipedPotions.image))) {
                    needToUnequip.push(setPotionInEquipedPotions)
                    if(needToEquipPotion) {
                        needToEquipPotion = Object.assign({}, needToEquipPotion)
                        needToEquipPotion.slot = setPotion.slot
                        needToEquipPotion.variant = setPotion.variant
                        needToEquip.push(needToEquipPotion)
                    }
                }
                if(!setPotionInEquipedPotions) {
                    if(needToEquipPotion) {
                        needToEquipPotion = Object.assign({}, needToEquipPotion)
                        needToEquipPotion.slot = setPotion.slot
                        needToEquipPotion.variant = setPotion.variant
                        needToEquip.push(needToEquipPotion)
                    }
                }
                equipedPotions.removeItem(setPotionInEquipedPotions!)
            })
            needToUnequip = needToUnequip.concat(equipedPotions)
            if(needToEquip.length == 0 && needToUnequip.length == 0) {
                disableButtons(false)
                return state
            }
            while(needToUnequip.length != 0) {
                const item = needToUnequip[0]
                await Requests.unequipRequest(item.id)
                await Requests.updateSlot(item.slot.toString(), item.variant ? 'variantItems' : 'items')
                needToUnequip.removeItem(item)
            }
            while(needToEquip.length != 0) {
                const item = needToEquip[0]
                await Requests.equipPotionRequest(item.id, item.slot!, item.variant ? '1' : '0')
                await Requests.updateSlot(item.slot!, item.variant ? 'variantItems' : 'items')
                needToEquip.removeItem(item)
            }
            state.allItems = []
            await Requests.refreshLeftMenu()
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })
            state = await reduce(state, BeltDressingWindowActions.LOAD_CONTENT, true)
            disableButtons(false)
            return {
                ...state
            }
        default:
            return state
    }
}
