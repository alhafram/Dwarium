import { DressingSet } from '../../Models/DressingSet'
import { InventoryItem } from '../../Models/InventoryItem'
import { getType, InventoryItemType } from '../Common/ItemBuilder'
import Utils, { DressingFilterColor } from '../Common/Utils'
import { DressingWindowActions } from './Actions'
import { DressingWindowState } from './DressingWindowState'
import { Elements } from './Elements'
import Requests from './Requests'
import { StyleHelper } from './StyleHelper'
import parse from './InventoryParser'
import SimpleAlt from '../../Scripts/simple_alt'
import { disableButtons, SetElements } from '../Common/Set/Elements'

export default async function reduce(state: DressingWindowState, action: DressingWindowActions, data?: any): Promise<DressingWindowState> {
    let newFilters: DressingFilterColor[] = []
    let sets = state.sets
    let currentEquipedItems = state.currentEquipedItems
    const arcats = state.arcats
    const rings = state.rings
    const amulets = state.amulets
    const parsedItemTypes = [
        'helmets',
        'shoulders',
        'bracers',
        'mainWeapons',
        'offhandWeapons',
        'cuirasses',
        'leggings',
        'chainmails',
        'boots',
        'bows',
        'quivers',
        'rings',
        'amulets',
        'arcats',
        'profWeapons'
    ]
    switch (action) {
        case DressingWindowActions.LOAD_CONTENT: {
            const result = await Utils.loadItemsData(['allItems', 'wearedItems'])
            const parsedAllItems = parse(result.allItems)
            const parsedWearedItems = parse(result.wearedItems)
            let allItems = Object.keys(parsedAllItems)
                .filter((key) => parsedItemTypes.includes(key))
                .map((key) => parsedAllItems[key])
                .flat() as InventoryItem[]
            currentEquipedItems = Object.keys(parsedWearedItems)
                .filter((key) => parsedItemTypes.includes(key))
                .map((key) => parsedWearedItems[key])
                .flat() as InventoryItem[]
            const repeatableItems = parse(currentEquipedItems)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            allItems = allItems.concat(currentEquipedItems).sort((a, b) => a.kind_id - b.kind_id)
            allItems.forEach((item) => {
                item.cnt = null
            })
            let currentMagicSchool: string | null = null
            let zikkuratId = null
            if(parsedAllItems.zikkurat.length != 0) {
                zikkuratId = parsedAllItems.zikkurat[0].id
                const res = await Requests.getMagicSchools(zikkuratId)
                currentMagicSchool = parseMagicSchools(res)
            }
            const bracelet = parsedWearedItems.bracelets[0]
            let arcatsCount = 0
            if(bracelet) {
                arcatsCount = bracelet.skills.find((s) => s.title === 'Слоты для аркатов')?.value.slice(4, 5) as number
            }
            const userId = (await Utils.getUserId()) as number
            if(!userId) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть переодевалку!')
                return state
            }
            const userConfig = Utils.getUserConfig(userId)
            const loadedSets = userConfig.sets
            const preselectSet =
                loadedSets.find(
                    (set) =>
                        difference(
                            currentEquipedItems.map((item) => item.id),
                            set.ids
                        ).size == 0 &&
                        difference(
                            set.ids,
                            currentEquipedItems.map((item) => item.id)
                        ).size == 0
                ) || null
            const art_alt = Object.assign(result.allItems, result.wearedItems)
            SimpleAlt.setupArtAlt(art_alt)
            return {
                ...state,
                allItems: allItems,
                currentEquipedItems: currentEquipedItems,
                currentMagicSchool: currentMagicSchool,
                arcatsCount: arcatsCount,
                sets: loadedSets,
                currentStyle: getStyle(currentEquipedItems),
                zikkuratId: zikkuratId,
                currentSet: preselectSet,
                arcats: repeatableItems.arcats,
                rings: repeatableItems.rings,
                amulets: repeatableItems.amulets,
                userConfig: userConfig
            }
        }
        case DressingWindowActions.SELECT_PLACEHOLDER: {
            const selectedBox = data as HTMLDivElement
            return {
                ...state,
                selectedStaticItemId: selectedBox.id
            }
        }
        case DressingWindowActions.DESELECT_PLACEHOLDER: {
            return {
                ...state,
                selectedStaticItemId: null
            }
        }
        case DressingWindowActions.EQUIP: {
            const equipedItemBox = data as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            const equipedItem = state.allItems.find((item) => item.id == itemId)
            if(!equipedItem) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return {
                    ...state
                }
            }
            const type = getType(equipedItem.kind_id)
            switch (type) {
                case InventoryItemType.ARCAT: {
                    const powerArcatTypeIds = ['153', '154', '155'] // 153 - мощь, 154 - вамп, 155 - кровь
                    if(arcats.find(arcat => powerArcatTypeIds.includes(arcat.type_id)) && powerArcatTypeIds.includes(equipedItem.type_id)) {
                        alert('Кажется, вы хотите надеть 2 боевых арката')
                        return state
                    }
                    if(arcats.length >= state.arcatsCount) {
                        currentEquipedItems = currentEquipedItems.removeItem(arcats.pop()!)
                    }
                    arcats.push(equipedItem)
                    break
                }
                case InventoryItemType.RING:
                    if(rings.length >= 2) {
                        currentEquipedItems = currentEquipedItems.removeItem(rings.pop()!)
                    }
                    rings.push(equipedItem)
                    break
                case InventoryItemType.AMULET:
                    if(amulets.length >= 2) {
                        currentEquipedItems = currentEquipedItems.removeItem(amulets.pop()!)
                    }
                    amulets.push(equipedItem)
                    break
                default: {
                    const alreadyEquipedItem = currentEquipedItems.find((item) => getType(item.kind_id) == type)
                    if(alreadyEquipedItem) {
                        currentEquipedItems = currentEquipedItems.removeItem(alreadyEquipedItem)
                    }
                    const weapon = equipedItemBox.getAttribute('weapon')
                    if(weapon) {
                        if(weapon == '2h') {
                            const offhandWeaponBox = Elements.offhandWeaponDiv().firstElementChild
                            const offhandWeaponId = offhandWeaponBox?.getAttribute('itemid')
                            const offhandWeaponItem = currentEquipedItems.find((item) => item.id == offhandWeaponId)
                            if(offhandWeaponItem) {
                                currentEquipedItems = currentEquipedItems.removeItem(offhandWeaponItem)
                            }
                        }
                        const mainWeapon = Elements.mainWeaponDiv().firstElementChild
                        if(weapon == 'off' && mainWeapon?.getAttribute('weapon') == '2h') {
                            const mainWeaponId = mainWeapon.getAttribute('itemid')
                            const mainWeaponItem = currentEquipedItems.find((item) => item.id == mainWeaponId)
                            if(mainWeaponItem) {
                                currentEquipedItems = currentEquipedItems.removeItem(mainWeaponItem)
                            }
                        }
                    }
                    break
                }
            }
            currentEquipedItems.push(equipedItem)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems,
                currentStyle: getStyle(currentEquipedItems),
                selectedStaticItemId: null,
                arcats: arcats,
                rings: rings,
                amulets: amulets
            }
        }
        case DressingWindowActions.UNEQUIP_ITEM: {
            const unequipedElement = data as HTMLDivElement
            const unequipedItem = state.allItems.find((item) => item.id == unequipedElement.getAttribute('itemid'))
            if(!unequipedItem) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return {
                    ...state
                }
            }
            const type1 = getType(unequipedItem.kind_id)
            switch (type1) {
                case InventoryItemType.ARCAT:
                    arcats.removeItem(unequipedItem)
                    break
                case InventoryItemType.RING:
                    rings.removeItem(unequipedItem)
                    break
                case InventoryItemType.AMULET:
                    amulets.removeItem(unequipedItem)
                    break
                default:
                    break
            }
            currentEquipedItems = currentEquipedItems.removeItem(unequipedItem)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems,
                currentStyle: getStyle(currentEquipedItems),
                selectedStaticItemId: null,
                arcats: arcats,
                rings: rings,
                amulets: amulets
            }
        }
        case DressingWindowActions.ADD_FILTER:
            newFilters = state.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case DressingWindowActions.REMOVE_FILTER:
            newFilters = state.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case DressingWindowActions.CREATE_NEW_SET: {
            if(!state.userConfig) {
                return state
            }
            const newSet = data as DressingSet
            sets.push(newSet)
            state.userConfig.sets = sets
            Utils.save(state.userConfig)

            return {
                ...state,
                currentSet: newSet,
                sets: sets,
                currentEquipedItems: [],
                currentStyle: null,
                arcats: [],
                rings: [],
                amulets: []
            }
        }
        case DressingWindowActions.SAVE_SET: {
            if(!state.userConfig) {
                return state
            }
            let set = state.currentSet
            const equipmentItemIds = state.currentEquipedItems.map((item) => item.id)
            const setMagicSchool = StyleHelper.getSchool(state.currentStyle, state.currentMagicSchool)
            if(set) {
                set.title = SetElements.setTitleInput().value
                set.ids = equipmentItemIds
                set.style = state.currentStyle
                set.magicSchool = setMagicSchool
                sets[sets.indexOf(set)] = set
            } else {
                set = {
                    id: generateSetId(),
                    title: SetElements.setTitleInput().value,
                    ids: equipmentItemIds,
                    style: state.currentStyle,
                    magicSchool: setMagicSchool
                }
                sets.push(set)
            }
            state.userConfig.sets = sets
            Utils.save(state.userConfig)
            return {
                ...state,
                currentSet: set,
                sets: sets
            }
        }
        case DressingWindowActions.REMOVE_SET: {
            if(!state.userConfig) {
                return state
            }
            const deletedSetBox = data as HTMLDivElement | null
            const deletedSet = sets.find((set) => set.id == deletedSetBox?.id)
            if(deletedSet) {
                const isCurrentSet = deletedSet == state.currentSet
                sets = sets.removeItem(deletedSet)
                state.userConfig.sets = sets
                Utils.save(state.userConfig)
                currentEquipedItems = isCurrentSet ? [] : state.currentEquipedItems
                const currentSet = isCurrentSet ? null : state.currentSet
                return {
                    ...state,
                    sets: sets,
                    currentEquipedItems: currentEquipedItems,
                    currentStyle: getStyle(currentEquipedItems),
                    currentSet: currentSet
                }
            } else {
                return {
                    ...state
                }
            }
        }
        case DressingWindowActions.SELECT_SET: {
            const selectedSet = data as DressingSet
            const items = selectedSet.ids.map((id) => state.allItems.find((item) => item.id == id)).filter((item) => item != undefined) as InventoryItem[]
            const repeatableItems1 = parse(items)
            return {
                ...state,
                currentSet: selectedSet,
                currentEquipedItems: items,
                currentStyle: getStyle(items),
                arcats: repeatableItems1.arcats,
                rings: repeatableItems1.rings,
                amulets: repeatableItems1.amulets
            }
        }
        case DressingWindowActions.EQUIP_FROM_SET: {
            if(!state.currentSet) {
                return state
            }
            disableButtons(true)
            const currentSet = state.currentSet
            if(currentSet.magicSchool && state.currentMagicSchool && state.currentMagicSchool != currentSet.magicSchool) {
                if(state.zikkuratId) {
                    const styleId = StyleHelper.getStyleId(currentSet.magicSchool)
                    await Requests.changeStyle(state.zikkuratId, styleId)
                    state.currentMagicSchool = currentSet.magicSchool
                }
            }
            const res = await Utils.loadItemsData(['wearedItems'])
            const parsedRes = parse(res.wearedItems)
            let arr: InventoryItem[] = []
            for(const type of parsedItemTypes) {
                arr = arr.concat(parsedRes[type])
            }
            const needToPutOn = difference(
                currentSet.ids,
                arr.map((item) => item.id)
            )
            const needToPutOff = difference(
                arr.map((item) => item.id),
                currentSet.ids
            )

            for(const id of needToPutOff) {
                await Requests.unequipRequest(id)
            }
            for(const id of needToPutOn) {
                await Requests.equipRequest(id)
            }
            const repeatableItems2 = parse(currentEquipedItems)
            disableButtons(false)
            return {
                ...state,
                arcats: repeatableItems2.arcats,
                rings: repeatableItems2.rings,
                amulets: repeatableItems2.amulets
            }
        }
        case DressingWindowActions.UNEQUIP_ALL:
            return {
                ...state,
                currentStyle: null,
                currentEquipedItems: [],
                arcats: [],
                rings: [],
                amulets: []
            }
        default:
            return state
    }
}

function parseMagicSchools(result: any): string {
    const doc = result.toDocument() as Document
    const magicSchoolsElements = doc.querySelector('body > table > tbody > tr:nth-child(2) > td.bgg > table > tbody > tr:nth-child(1) > td:nth-child(2) > select')
    if(magicSchoolsElements) {
        const schools = Array.from(magicSchoolsElements.children).map((e) => e.textContent ?? '')
        let currentStyle = difference(StyleHelper.magmarSchools, schools)
        if(currentStyle.size == StyleHelper.magmarSchools.length) {
            currentStyle = difference(StyleHelper.humanSchools, schools)
        }
        return Array.from(currentStyle)[0]
    }
    return ''
}

function getStyle(items: InventoryItem[]): string | null {
    const styles = items.map((item) => item.trend)
    const uniqueStyles = new Set(styles)
    uniqueStyles.delete('Универсал')
    uniqueStyles.delete(undefined)
    return uniqueStyles.size == 0 ? null : Array.from(uniqueStyles as Set<string>)[0]
}

function difference(setA: string[], setB: string[]): Set<string> {
    const _difference = new Set(setA)
    for(const elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function generateSetId() {
    return 'set_' + Utils.generateRandomId()
}
