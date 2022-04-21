import { Elements } from './Elements'
import { ExpiringItemsSettingsWindowState } from './ExpiringItemsSettingsWindowState'
import { convertItemIntoDiv } from '../Common/ItemBuilder'
import { handleDragOver, setupAltEvents } from '../Common/EventBuilder'
import SimpleAlt from '../../Scripts/simple_alt'
import dispatch from './preload'
import { ExpiringItemsSettingsWindowActions } from './Actions'
import { SetElements } from '../Common/Set/Elements'
import Utils, { DressingFilterColor } from '../Common/Utils'
import { InventoryItem } from '../../Models/InventoryItem'

function render(state: ExpiringItemsSettingsWindowState): void {
    let parent = SetElements.allItemsDiv()
    Array.from(parent.children ?? []).forEach((item) => parent.removeChild(item))

    const allItemDivs = state.allItems
        .map((item) => {
            if(!state.activeFilters.includes(Utils.getFilterColor(item.quality)) && item.title.toLowerCase().includes(state.searchEffect)) {
                const foundedItem = state.currentItems.find(currentItem => currentItem.id == item.id)
                const divItem = convertItemIntoDiv(item, undefined)
                if(foundedItem) {
                    divItem.style.opacity = '0.2'
                }
                return divItem
            }
        })
        .filter((div) => div) as HTMLDivElement[]

    allItemDivs.forEach((divItem) => {
        setupEquipableItemEvents(divItem)
        parent?.appendChild(divItem)
    })
    parent = Elements.currentItemsDiv()
    Array.from(parent?.children ?? []).forEach((itemBox) => {
        parent?.removeChild(itemBox)
    })
    state.currentItems.forEach((item) => {
        const divItem = convertItemIntoDiv(item, undefined)
        setupBurningItemBorder(item, divItem)
        divItem.setAttribute('equiped', 'true')
        setupEquipableItemEvents(divItem)
        parent?.appendChild(divItem)
    })
}

function setupBurningItemBorder(item: InventoryItem, element: HTMLElement) {
    const burningItem = (item.time_expire ?? '') < '432000'
    if(burningItem) {
        element.style.border = '3px dashed red'
    }
}

function setupView() {
    Elements.currentItemsDiv().ondragover = handleDragOver
    Elements.currentItemsDiv().ondrop = function() {
        const itemId = dragableItem?.getAttribute('itemid')
        dispatch(ExpiringItemsSettingsWindowActions.ADD_ITEM, itemId)
    }
    Elements.searchEffectInput().onkeyup = function() {
        dispatch(ExpiringItemsSettingsWindowActions.SEARCH_EFFECT)
    }
    SetElements.allItemsDiv().ondragover = handleDragOver
    SetElements.allItemsDiv().ondrop = function() {
        const itemId = dragableItem?.getAttribute('itemid')
        dispatch(ExpiringItemsSettingsWindowActions.REMOVE_ITEM, itemId)
    }
    Elements.saveItemsButton().onclick = function() {
        dispatch(ExpiringItemsSettingsWindowActions.SAVE_ITEMS)
    }
}

let dragableItem: HTMLDivElement | null = null

function handleDragStartEquipableItem(this: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    dragableItem = this
    this.style.opacity = '0.4'
    SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, this)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    this.style.opacity = '1'
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.ondragover = handleDragOver
    item.onclick = function() {
        const isEquipedItem = item.getAttribute('equiped') == 'true'
        if(isEquipedItem) {
            dispatch(ExpiringItemsSettingsWindowActions.REMOVE_ITEM, item.getAttribute('itemid'))
        } else {
            dispatch(ExpiringItemsSettingsWindowActions.ADD_ITEM, item.getAttribute('itemid'))
        }
    }
    setupAltEvents(item)
}

function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onclick = function() {
            const checked = document.getElementById(key)?.getAttribute('checked') == 'true'
            if(checked) {
                document.getElementById(key)?.removeAttribute('checked')
                dispatch(ExpiringItemsSettingsWindowActions.REMOVE_FILTER, key)
            } else {
                document.getElementById(key)?.setAttribute('checked', 'true')
                dispatch(ExpiringItemsSettingsWindowActions.ADD_FILTER, key)
            }
        }
    }
}

export { render, setupView, setupFilters }
