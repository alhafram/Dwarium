let art_alt = null

// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI = {}
// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI.baseUrl = function() {
    return window.foodAPI.baseUrl()
}

type EnchantMode = {
    title: string
    value: string
}

type InventoryItem = {
    id: string
    title: string, 
    desc: any, 
    kind_id: string, 
    type_id: string,
    skills: [{ value: any, title: string }],
    quality: string,
    image: string,
    trend: string | undefined,
    enchant_mod?: EnchantMode,
    cnt: string
}

const Elements = {
    hpBox(): HTMLDivElement {
        return document.getElementById('hp') as HTMLDivElement
    },
    mpBox(): HTMLDivElement {
        return document.getElementById('mp') as HTMLDivElement
    },
    hpSelectBox(): HTMLSelectElement {
        return document.getElementById('hpSelect') as HTMLSelectElement
    },
    mpSelectBox(): HTMLSelectElement {
        return document.getElementById('mpSelect') as HTMLSelectElement
    },
    allFoodBox(): HTMLDivElement {
        return document.getElementsByClassName('allFood')[0] as HTMLDivElement
    },
    saveBox(): HTMLButtonElement {
        return document.getElementById('save') as HTMLButtonElement
    },
    staticBoxes(): HTMLDivElement[] {
        return Array.from(document.querySelectorAll('.staticBox'))
    }
}

type FoodWindowState = {
    allItems: InventoryItem[],
    hpItem: InventoryItem | null,
    mpItem: InventoryItem | null,
    hpPercentage: string,
    mpPercentage: string
}

var initialState: FoodWindowState = {
    allItems: [],
    hpItem: null,
    mpItem: null,
    hpPercentage: '',
    mpPercentage: ''
}

enum FoodWindowActions {
    LOAD_CONTENT,
    EQUIP,
    UNEQUIP,
    SAVE
}

function convertItemIntoDiv(item: InventoryItem): HTMLDivElement {
    let divItem = document.createElement('div')
    divItem.className = 'box'
    divItem.draggable = true
    if(item.image.includes(window.foodAPI.baseUrl())) {
        divItem.style.backgroundImage = `url('${item.image}')`
    } else {
        const url = `${window.foodAPI.baseUrl()}/${item.image}`
        item.image = url
        divItem.style.backgroundImage = `url('${url}')`
    }
    if(item.cnt) {  
        let span = document.createElement('div')
        span.textContent = item.cnt
        span.className = 'bpdig'
        divItem.appendChild(span)
    }
    divItem.style.backgroundRepeat = 'no-repeat'
    divItem.style.backgroundSize = 'cover'
    divItem.setAttribute('itemId', item.id)
    setupEquipableItemEvents(divItem)
    return divItem
}

// ???? BETTER SOLUTION
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
    dispatch(FoodWindowActions.EQUIP, [dragableItem, this])
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    e.stopPropagation()
    dispatch(FoodWindowActions.UNEQUIP, dragableItem)
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}

async function reduce(state: FoodWindowState = initialState, action: FoodWindowActions, data?: any): Promise<FoodWindowState> {
    switch(action) {
        case FoodWindowActions.LOAD_CONTENT:
            let result = await window.foodAPI.loadItemsData(['allItems', 'allPotions'])
            const allItems = Object.keys(result.allItems).map(key => result.allItems[key]) as InventoryItem[]
            const allPotions = Object.keys(result.allPotions).map(key => result.allPotions[key]) as InventoryItem[]
            
            const itemsWithFoodEnchant = allItems.filter(item => item.enchant_mod && item.enchant_mod.value.includes('сытости'))
            const foodItems = allPotions.filter(item => item.kind_id == '48')

            const allFoodItems = itemsWithFoodEnchant.concat(foodItems)

            const currentHpFoodSettings = window.foodAPI.hpFood()
            const currentMpFoodSettings = window.foodAPI.mpFood()

            let currentHpFood: InventoryItem | null = null
            let currentMpFood: InventoryItem | null = null
            let currentHpPercentage = '20'
            let currentMpPercentage = '20'
            if(currentHpFoodSettings) {
                currentHpFood = allFoodItems.find(item => item.id == currentHpFoodSettings.id) ?? null
                currentHpPercentage = currentHpFoodSettings.percentage
                if(currentHpFood) {
                    allFoodItems.removeItem(currentHpFood)
                }
            }
            if(currentMpFoodSettings) {
                currentMpFood = allFoodItems.find(item => item.id == currentMpFoodSettings.id) ?? null
                currentMpPercentage = currentMpFoodSettings.percentage
                if(currentMpFood) {
                    allFoodItems.removeItem(currentMpFood)
                }
            }

            art_alt = Object.assign(result.allItems, result.allPotions)
            return {
                ...state,
                allItems: allFoodItems,
                hpItem: currentHpFood,
                mpItem: currentMpFood,
                hpPercentage: currentHpPercentage,
                mpPercentage: currentMpPercentage
            }
        case FoodWindowActions.EQUIP:
            const equipedItemBox = data[0] as HTMLDivElement
            const equipedStaticItemBox = data[1] as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            let equipedItem = state.allItems.find(item => item.id == itemId)
            if(!equipedItem) {
                alert('Напиши в группу!!! Что то не так!!!!')
                return state
            }
            const isHp = equipedStaticItemBox.id == 'hp'
            const newItems = state.allItems.removeItem(equipedItem)
            if(isHp && state.hpItem) {
                newItems.push(state.hpItem)
            }
            if(!isHp && state.mpItem) {
                newItems.push(state.mpItem)
            }
            return {
                ...state,
                allItems: newItems,
                hpItem: isHp ? equipedItem: state.hpItem,
                mpItem: !isHp ? equipedItem : state.mpItem
            }
        case FoodWindowActions.UNEQUIP:
            let unequipedElement = data as HTMLDivElement
            const id = unequipedElement.getAttribute('itemid')!
            let hpItem = state.hpItem
            let mpItem = state.mpItem
            let allItems1 = state.allItems
            if(hpItem?.id == id) {
                allItems1.push(hpItem)
                hpItem = null
            }
            if(mpItem?.id == id) {
                allItems1.push(mpItem)
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
            const hp = {
                id: state.hpItem?.id,
                percentage: hpPercentage
            }
            const mp = {
                id: state.mpItem?.id,
                percentage: mpPercentage
            }
            window.foodAPI.save(hp, mp)
            return state
        return state
    }
}

async function dispatch(action: FoodWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render()
}

function render(): void {
    const parent = Elements.allFoodBox()
    Array.from(parent?.children ?? []).forEach(itemBox => {
        parent?.removeChild(itemBox)
    })
    initialState.allItems.forEach(item => {
        const divItem = convertItemIntoDiv(item)
        parent?.appendChild(divItem)
    })
    const hpParent = Elements.hpBox()
    hpParent.style.border = '1px solid'
    if(hpParent.firstElementChild) {
        hpParent.removeChild(hpParent.firstElementChild)
    }
    const mpParent = Elements.mpBox()
    mpParent.style.border = '1px solid'
    if(mpParent.firstElementChild) {
        mpParent.removeChild(mpParent.firstElementChild)
    }
    if(initialState.hpItem) {
        const hpItemBox = convertItemIntoDiv(initialState.hpItem)
        hpParent.style.border = 'none'
        hpParent.appendChild(hpItemBox)
    }
    if(initialState.mpItem) {
        const mpItemBox = convertItemIntoDiv(initialState.mpItem)
        mpParent.style.border = 'none'
        mpParent.appendChild(mpItemBox)
    }
    Elements.hpSelectBox().value = initialState.hpPercentage;
    Elements.mpSelectBox().value = initialState.mpPercentage
}

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(FoodWindowActions.LOAD_CONTENT)

    let itemsStaticBoxes = Elements.staticBoxes()
    itemsStaticBoxes.forEach(function(item) {
        item.ondragover = handleDragOver
        item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    })
    Elements.saveBox().onclick = function() {
        dispatch(FoodWindowActions.SAVE)
    }
    Elements.allFoodBox().ondrop = handleDropEquipableItemIntoAllItems;
    Elements.allFoodBox().ondragover = handleDragOver
})

export {}