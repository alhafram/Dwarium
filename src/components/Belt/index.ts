let art_alt = null

type BeltDressingSetPotion = {
    item: string,
    slot: string,
    variant: string | null,
    image: string
}

type BeltDressingSet = {
    id: string,
    title: string,
    potions: BeltDressingSetPotion[],
    isNew: boolean
}

type EquipedPotion = {
    id: string,
    title: string,
    slot: number,
    variant: Boolean,
    image: string
}

type InventoryItem = {
    id: string
    title: string, 
    desc: any, 
    kind_id: string, 
    type_id: string,
    quality: string,
    image: string,
    cnt: string | null,
    slot: string | null,
    variant: string | null,
    picture: string
}

type BeltDressingWindowState = {
    currentEquipedItems: InventoryItem[],
    slots: number,
    variants: number,
    allItems: InventoryItem[],
    activeFilters: DressingFilterColor[],
    sets: BeltDressingSet[],
    currentSet: BeltDressingSet | null,
    warning: boolean
}

enum DressingFilterColor {
    GRAY = 'i_gray',
    GREEN = 'i_green',
    BLUE = 'i_blue',
    PURPLE = 'i_purple',
    RED = 'i_red'
}

enum BeltDressingWindowActions {
    LOAD_CONTENT,
    CREATE_NEW_SET,
    SAVE_SET,
    REMOVE_SET,
    SELECT_SET,

    UNEQUIP_ITEM,
    UNEQUIP_ALL,
    EQUIP,
    EQUIP_DND,
    EQUIP_FROM_SET,

    ADD_FILTER,
    REMOVE_FILTER
}

function getQuality(filter: DressingFilterColor): string {
    switch(filter) {
        case DressingFilterColor.GRAY:
            return '0'
        case DressingFilterColor.GREEN:
            return '1'
            case DressingFilterColor.BLUE:
            return '2'
        case DressingFilterColor.PURPLE:
            return '3'
        case DressingFilterColor.RED:
            return '4'
    }
}

function renderSlots(slotsCount: number, variantSlots: number) {
    var currentVariantSlot = 1
    for(let i = 0; i < slotsCount; i++) {
        let divBox = document.createElement('div')
        let divPotion = document.createElement('div')
        divBox.style.display = 'flex'
        divPotion.setAttribute('slot', `${i + 1}`)
        divPotion.className = 'potion'
        setupPotionListeners(divPotion)
        divBox.appendChild(divPotion)
        for(var j = 0; j < 2; j++) {
            if(currentVariantSlot <= variantSlots) {
                let divPotion = document.createElement('div')
                divPotion.setAttribute('variant', 'true')
                divPotion.className = 'potion'
                divPotion.setAttribute('slot', `${currentVariantSlot}`)
                setupPotionListeners(divPotion)
                divBox.appendChild(divPotion)
                currentVariantSlot += 1
            } else {
                break
            }
        }
        let parent = document.querySelector('#potionStaticBoxes')
        parent?.appendChild(divBox)
    }
}

function setupPotionListeners(item: HTMLElement) {
    item.ondragover = handleDragOver
    item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
}

let dragableItem: HTMLDivElement | null = null

function handleDragStartEquipableItem(this: any) {
    dragableItem = this
    this.style.opacity = '0.4'
    // @ts-ignore
    artifactAltSimple(this.getAttribute('itemid'), 0)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    this.style.opacity = '1'
}

function handleDragOver(e: Event) {
    e.preventDefault()
}

function handleDropEquipableItemOnStaticItemBox(this: any, e: Event) {
    e.stopPropagation()
    dispatch(BeltDressingWindowActions.EQUIP_DND, [dragableItem, this])
}

function handleClickEquipableItem(this: any, e: Event) {
    e.stopPropagation()
    if(this.getAttribute('equiped') != 'true') {
        dispatch(BeltDressingWindowActions.EQUIP, this)
    }
    if(this.getAttribute('equiped') == 'true') {
        dispatch(BeltDressingWindowActions.UNEQUIP_ITEM, this)
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}

const Elements = {
    setsBox(): HTMLDivElement {
        return document.getElementsByClassName('sets')[0] as HTMLDivElement
    },
    setTitleBox(): HTMLInputElement {
        return document.getElementById('currentSetTitle') as HTMLInputElement
    },
    saveSetBox(): HTMLInputElement {
        return document.getElementById('save') as HTMLInputElement
    },
    addSetBox(): HTMLInputElement {
        return document.getElementById('addSetButton') as HTMLInputElement
    },
    dropSetBox(): HTMLButtonElement {
        return document.getElementById('dropSetButton') as HTMLButtonElement
    },
    equipSetBox(): HTMLButtonElement {
        return document.getElementById('equip') as HTMLButtonElement
    },
    unequipBox(): HTMLButtonElement {
        return document.getElementById('unequip') as HTMLButtonElement
    },
    currentItemsBox(): HTMLDivElement {
        return document.getElementsByClassName('currentItems')[0] as HTMLDivElement
    },
    staticBoxes(): HTMLCollection {
        return document.getElementsByClassName('potion')
    },
    warningBox(): HTMLSpanElement {
        return document.getElementById('warning') as HTMLSpanElement
    }
}

var initialState: BeltDressingWindowState = {
    currentEquipedItems: [],
    slots: 0,
    variants: 0,
    activeFilters: [],
    sets: [],
    currentSet: null,
    allItems: [],
    warning: false
}

function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onchange = function() {
            dispatch(element.checked ? BeltDressingWindowActions.REMOVE_FILTER : BeltDressingWindowActions.ADD_FILTER, key)
        }
    }
}

function parsePotions(items: InventoryItem[]) {
    let potions = Object.values(items)
    potions = potions.filter(item => item.type_id == '7' && item.kind_id != '65')
    return potions
}

function generateSetId() {
    return 'belt_set_' + window.utilsAPI.generateRandomId()
}

function addNewSet(): BeltDressingSet {
    let id = generateSetId()
    let newSet: BeltDressingSet = {
        id: id,
        title: 'Default set',
        potions: [],
        isNew: true
    }
    return newSet
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

async function parseEquipedPotions() {
    const equipedPotionsReq = await window.beltPotionAPI.getEquipedPotions()
    let equipedPotions: EquipedPotion[] = equipedPotionsReq.flat().filter((potion: EquipedPotion) => potion)
    for(let item of equipedPotions) {
        let res = await window.beltPotionAPI.fetchItem(item.id!)
        let doc = res.toDocument() as Document
        let title = doc.querySelector('body > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td.tbl-usi_bg > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td:nth-child(2) > h1 > b')?.textContent
        item.title = title ?? ''
    }
    return equipedPotions
}

function generateSetPotions(items: InventoryItem[]): BeltDressingSetPotion[] {
    return items.map(item => {
        return {
            item: item.title,
            slot: item.slot!,
            variant: item.variant!,
            quality: item.quality,
            image: item.picture
        }
    })
}

async function reduce(state: BeltDressingWindowState = initialState, action: BeltDressingWindowActions, data?: any): Promise<BeltDressingWindowState> {
    let newFilters: DressingFilterColor[] = []
    let sets = state.sets
    let currentEquipedItems = state.currentEquipedItems
    switch(action) {
        case BeltDressingWindowActions.LOAD_CONTENT:
            const [slots, variants] = await window.beltPotionAPI.getSlots()
            let items = await window.beltPotionAPI.loadItemsData(['allPotions'])
            let allItems = parsePotions(items.allPotions)
            // @ts-ignore
            allItems = allItems.sort((a, b) => a.quality - b.quality)
            art_alt = Object.assign({}, items.allPotions)
            const equipedPotionsAltRes = await window.beltPotionAPI.getEquipedPotionsAlt()
            art_alt = Object.assign(art_alt, equipedPotionsAltRes)
            sets = window.beltPotionAPI.loadBeltSets()

            let hasWarning = false
            if(!data) {
                const equipedPotions = await parseEquipedPotions()
                currentEquipedItems = equipedPotions.map(potion => {
                    let foundItem = allItems.find(item => item.title == potion.title && item.picture.includes(potion.image))
                    if(foundItem) {
                        return copyInventoryItemWithoutBox(foundItem, potion)
                    } else {
                        hasWarning = true
                    }
                }).filter(item => item !== undefined) as InventoryItem[]
            }

            return {
                ...state,
                slots: slots,
                variants: variants,
                allItems: allItems,
                sets: sets,
                currentEquipedItems: currentEquipedItems,
                warning: hasWarning
            }
        case BeltDressingWindowActions.EQUIP:
            const equipedItemBox = data as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            let equipedItem = state.allItems.find(item => item.id == itemId)
            const emptyBox = Array.from(Elements.staticBoxes()).find(box => box.childElementCount == 0)
            if(!equipedItem) {
                alert("ШО ТО НЕ ТАК!!! Напиши в группу")
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
            const equipedItemBox1 = data[0] as HTMLDivElement
            const equipedStaticItemBox = data[1] as HTMLDivElement
            const itemId1 = equipedItemBox1.getAttribute('itemid')
            let equipedItem1 = state.allItems.find(item => item.id == itemId1)
            if(!equipedItem1) {
                alert("ШО ТО НЕ ТАК!!! Напиши в группу")
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
            let variant = unequipedItemBox.getAttribute('variant')
            let slot = unequipedItemBox.getAttribute('slot')
            const unequipedItem = currentEquipedItems.find(item => item.variant == variant && item.slot == slot)
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
            window.beltPotionAPI.saveSet(newSet)
            sets.push(newSet)
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
            window.beltPotionAPI.saveSet(set)
            return {
                ...state,
                currentSet: set,
                sets: sets
            }
        case BeltDressingWindowActions.REMOVE_SET:
            let deletedSetBox = data as HTMLDivElement | null
            const deletedSet = sets.find(set => set.id == deletedSetBox?.id)
            if(deletedSet) {
                const isCurrentSet = deletedSet == state.currentSet
                const deletedSetId = deletedSet?.id
                sets = sets.removeItem(deletedSet)
                window.beltPotionAPI.removeSet(deletedSetId)
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
            let items1 = selectedSet.potions.map(potion => {
                let inventoryPotion = state.allItems.find(item => item.title == potion.item && item.picture.includes(potion.image))
                inventoryPotion = Object.assign({}, inventoryPotion)
                if(inventoryPotion.title) {
                    return copyInventoryItemWithoutBox(inventoryPotion, potion)
                } else {
                    return undefined
                }
            }).filter(item => item != undefined) as InventoryItem[]
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
            let needToEquip: InventoryItem[] = []
            state.currentSet.potions.forEach(setPotion => {
                let setPotionInEquipedPotions = equipedPotions.find(a => a.slot.toString() == setPotion.slot && a.variant == ((setPotion.variant == null) ? false : true))
                var needToEquipPotion = state.allItems.find(item => item.title == setPotion.item && item.picture.includes(setPotion.image))
                if(setPotionInEquipedPotions && (setPotion.item != setPotionInEquipedPotions.title || !needToEquipPotion?.picture.includes(setPotionInEquipedPotions.image))) {
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
                let item = needToUnequip[0]
                await window.beltPotionAPI.unequipRequest(item.id)
                await window.beltPotionAPI.updateSlot(item.slot.toString(), item.variant ? 'variantItems' : 'items')
                needToUnequip.removeItem(item)
            }
            while(needToEquip.length != 0) {
                let item = needToEquip[0]
                await window.beltPotionAPI.equipPotionRequest(item.id, item.slot!, item.variant ? '1' : '0')
                await window.beltPotionAPI.updateSlot(item.slot!, item.variant ? 'variantItems' : 'items')
                needToEquip.removeItem(item)
            }
            state.allItems = []
            await window.beltPotionAPI.refreshLeftMenu()
            await new Promise<void>(resolve => {
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

async function dispatch(action: BeltDressingWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render()
}

function convertNoExistsItemIntoDiv(item: EquipedPotion): HTMLDivElement {
    let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = true
        if(item.image.includes(window.beltPotionAPI.baseUrl())) {
            divItem.style.backgroundImage = `url('${item.image}')`
        } else {
            const url = `${window.beltPotionAPI.baseUrl()}/${item.image}`
            item.image = url
            divItem.style.backgroundImage = `url('${url}')`
        }
        divItem.style.backgroundRepeat = 'no-repeat'
        divItem.style.backgroundSize = 'cover'
        setupEquipableItemEvents(divItem)
        return divItem
}

function convertItemIntoDiv(item: InventoryItem): HTMLDivElement {
    let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = true
        if(item.image.includes(window.beltPotionAPI.baseUrl())) {
            divItem.style.backgroundImage = `url('${item.image}')`
        } else {
            const url = `${window.beltPotionAPI.baseUrl()}/${item.image}`
            item.image = url
            divItem.style.backgroundImage = `url('${url}')`
        }
        divItem.style.backgroundRepeat = 'no-repeat'
        divItem.style.backgroundSize = 'cover'
        divItem.setAttribute('quality', item.quality)
        divItem.setAttribute('itemId', item.id)
        if(item.cnt) {  
            let span = document.createElement('div')
            span.textContent = item.cnt
            span.className = 'bpdig'
            divItem.appendChild(span)
        }
        setupEquipableItemEvents(divItem)
        return divItem
}

let dragableSet: HTMLElement | null = null
function createSetElement(set: BeltDressingSet, active: boolean = false) {
    let article = document.createElement('article')
    article.id = set.id
    article.draggable = true
    let className = active ? 'leaderboard__profile active' : 'leaderboard__profile'
    article.className = className
    article.onclick = function(e) {
        dispatch(BeltDressingWindowActions.SELECT_SET, set)
    }
    article.ondragstart = function() {
        article.style.opacity = '0.4'
        dragableSet = article
    }
    article.ondragend = function() {
        article.style.opacity = '1'
        dragableSet = null
    }
    article.ondragover = function(e) {
        e.preventDefault()
    }
    let span = document.createElement('span')
    span.className = 'leaderboard__name'
    span.textContent = set.title
    article.appendChild(span)
    return article
}

function render(): void {
    Array.from(Elements.currentItemsBox().children ?? []).forEach(item => Elements.currentItemsBox().removeChild(item))

    let itemsStaticBoxes = Array.from(Elements.staticBoxes()) as HTMLDivElement[]
    itemsStaticBoxes.forEach(function(item) {
        item.parentElement?.removeChild(item)
    })
    Array.from(document.querySelector('#potionStaticBoxes')!.children).forEach(box => {
        box.parentElement?.removeChild(box)
    })
    renderSlots(initialState.slots, initialState.variants)
    const allItemDivs = initialState.allItems.map(item => convertItemIntoDiv(item))
    allItemDivs.forEach(item => {
        let parent = document.querySelector('.currentItems')
        parent?.appendChild(item)
    })
    for(const filter of initialState.activeFilters) {
        const filterQuality = getQuality(filter)
        let items = allItemDivs.filter(e => e.getAttribute('quality') == filterQuality)
        items.forEach(item => item.style.display = 'none')
    }
    for(let item of initialState.currentEquipedItems) {
        let potionBoxes = Array.from(document.querySelectorAll('.potion'))
        let emptyBox = potionBoxes.find(box => box.childElementCount == 0 && box.getAttribute('slot') == item.slot && box.getAttribute('variant') == item.variant) as HTMLElement
        const potionDiv = convertItemIntoDiv(item)
        potionDiv.style.borderRadius = '25px'
        potionDiv.style.visibility = 'visible'
        potionDiv.setAttribute('equiped', 'true')
        if(item.slot) {
            potionDiv.setAttribute('slot', item.slot)
        }
        if(item.variant) {
            potionDiv.setAttribute('variant', item.variant)
        }
        emptyBox.style.border = 'none'
        emptyBox.style.visibility = 'hidden'
        emptyBox.appendChild(potionDiv)
    }
    Array.from(Elements.setsBox().children).filter(element => element.id.startsWith('belt_set_')).forEach(element => Elements.setsBox().removeChild(element))
    for(const set of initialState.sets) {
        const isActive = initialState.currentSet?.id == set.id
        let setDiv = createSetElement(set, isActive)
        if(isActive) {
            Elements.setTitleBox().value = set.title
        }
        if(set.isNew) {
            Elements.setsBox().insertBefore(setDiv, Elements.setsBox().firstElementChild?.nextElementSibling!)
        } else {
            Elements.setsBox().appendChild(setDiv)
        }
    }
    Elements.warningBox().style.display = initialState.warning ? 'block' : 'none'
}

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(BeltDressingWindowActions.LOAD_CONTENT)
    setupFilters()

    Elements.addSetBox().onclick = function() {
        const newSet = addNewSet()
        dispatch(BeltDressingWindowActions.CREATE_NEW_SET, newSet)
    }
    Elements.dropSetBox().ondrop = function(e) {
        e.preventDefault()
        dispatch(BeltDressingWindowActions.REMOVE_SET, dragableSet)
    }
    Elements.dropSetBox().ondragover = function(e) {
        e.preventDefault()
    }
    Elements.unequipBox().onclick = function() {
        dispatch(BeltDressingWindowActions.UNEQUIP_ALL)
    }
    Elements.equipSetBox().onclick = function() {
        dispatch(BeltDressingWindowActions.EQUIP_FROM_SET)
    }
    Elements.saveSetBox().onclick = function() {
        dispatch(BeltDressingWindowActions.SAVE_SET)
    }
})

export {}