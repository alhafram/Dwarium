import { Elements } from './Elements'
import { EffectSetsWindowState } from './EffectSetsWindowState'
import { convertItemIntoDiv } from '../Common/ItemBuilder'
import { handleDragOver, setupAltEvents } from '../Common/EventBuilder'
import SimpleAlt from '../../Scripts/simple_alt'
import dispatch from './preload'
import { EffectSetsWindowActions } from './Actions'
import { SetElements } from '../Common/Set/Elements'
import { ListElements } from '../Common/List/Elements'
import { EffectSet } from '../../Models/EffectSet'
import Utils, { DressingFilterColor } from '../Common/Utils'

function render(state: EffectSetsWindowState): void {
    let parent = SetElements.allItemsDiv()
    Array.from(parent.children ?? []).forEach((item) => parent.removeChild(item))

    const allItemDivs = state.allItems
        .map((item) => {
            if(!state.activeFilters.includes(Utils.getFilterColor(item.quality)) && item.title.toLowerCase().includes(state.searchEffect)) {
                const foundedItem = state.currentItems.find((currentItem) => currentItem.id == item.id)
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
        if(item.disabled) {
            divItem.style.filter = 'grayscale(100%)'
        } else {
            setupEquipableItemEvents(divItem)
            divItem.setAttribute('equiped', 'true')
            divItem.ondrop = function(event) {
                event.stopPropagation()
                const replacedItemId = divItem.getAttribute('itemid')
                const draggableItemId = dragableItem?.getAttribute('itemid')
                dispatch(EffectSetsWindowActions.CHANGE_ORDER, [replacedItemId, draggableItemId])
            }
        }
        parent?.appendChild(divItem)
    })
    Array.from(ListElements.setsDiv().children)
        .filter((element) => element.id.startsWith('effect_set_'))
        .forEach((element) => ListElements.setsDiv().removeChild(element))
    for(const set of state.sets) {
        const isActive = state.currentSet?.id == set.id
        const setDiv = createNoteElement(set, isActive)
        if(isActive) {
            SetElements.setTitleInput().value = set.title
        }
        ListElements.setsDiv().appendChild(setDiv)
    }
}

function setupView() {
    Elements.currentItemsDiv().ondragover = handleDragOver
    Elements.currentItemsDiv().ondrop = function() {
        const itemId = dragableItem?.getAttribute('itemid')
        dispatch(EffectSetsWindowActions.ADD_EFFECT, itemId)
    }
    Elements.useEffectsButton().onclick = function() {
        dispatch(EffectSetsWindowActions.USE_EFFECTS)
    }
    Elements.searchEffectInput().onkeyup = function() {
        dispatch(EffectSetsWindowActions.SEARCH_EFFECT)
    }
    SetElements.saveSetButton().onclick = function() {
        dispatch(EffectSetsWindowActions.SAVE_SET)
    }
    SetElements.allItemsDiv().ondragover = handleDragOver
    SetElements.allItemsDiv().ondrop = function() {
        const itemId = dragableItem?.getAttribute('itemid')
        dispatch(EffectSetsWindowActions.REMOVE_EFFECT, itemId)
    }
    ListElements.newSetButton().onclick = function() {
        dispatch(EffectSetsWindowActions.CREATE_NEW_SET)
    }
    ListElements.removeSetDiv().ondrop = function(e) {
        e.preventDefault()
        dispatch(EffectSetsWindowActions.REMOVE_SET, dragableSet)
    }
    ListElements.removeSetDiv().ondragover = handleDragOver
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
            dispatch(EffectSetsWindowActions.REMOVE_EFFECT, item.getAttribute('itemid'))
        } else {
            dispatch(EffectSetsWindowActions.ADD_EFFECT, item.getAttribute('itemid'))
        }
    }
    setupAltEvents(item)
}

let dragableSet: HTMLElement | null = null
function createNoteElement(note: EffectSet, isActive = false) {
    const newNoteString = `
        <div id="${note.id}" draggable="true" class="hover:bg-lightMediumGrey dark:hover:bg-secondaryDark mt-3 cursor-pointer w-40 h-14 ${
    isActive ? 'bg-lightMediumGrey dark:bg-secondaryDark border-4 border-dashed border-secondaryLightDark dark:border-secondaryLight' : 'bg-light dark:bg-secondaryBlack'
} rounded-3xl">
            <p class="pl-2 pt-2 text-secondaryLightDark dark:text-secondaryLight text-ellipsis whitespace-nowrap overflow-hidden font-montserrat font-extrabold text-xss">${note.title}</p>
        </div>`
    const parser = new DOMParser()
    const newNoteDiv = parser.parseFromString(newNoteString, 'text/html').body.firstElementChild as HTMLDivElement
    newNoteDiv.ondragstart = function() {
        newNoteDiv.style.opacity = '0.4'
        dragableSet = newNoteDiv
        ListElements.removeSetDiv().classList.replace('basket', 'basketActive')
        ListElements.basketIcon().classList.replace('basketIcon', 'basketIconActive')
    }
    newNoteDiv.ondragend = function() {
        newNoteDiv.style.opacity = '1'
        dragableSet = null
        ListElements.removeSetDiv().classList.replace('basketActive', 'basket')
        ListElements.basketIcon().classList.replace('basketIconActive', 'basketIcon')
    }
    newNoteDiv.ondragover = function(e) {
        e.preventDefault()
    }
    newNoteDiv.onclick = function() {
        dispatch(EffectSetsWindowActions.SELECT_SET, note)
    }
    return newNoteDiv
}

function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onclick = function() {
            const checked = document.getElementById(key)?.getAttribute('checked') == 'true'
            if(checked) {
                document.getElementById(key)?.removeAttribute('checked')
                dispatch(EffectSetsWindowActions.REMOVE_FILTER, key)
            } else {
                document.getElementById(key)?.setAttribute('checked', 'true')
                dispatch(EffectSetsWindowActions.ADD_FILTER, key)
            }
        }
    }
}

export { render, setupView, setupFilters }
