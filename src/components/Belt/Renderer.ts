import { DressingFilterColor, generateRandomId, getFilterColor } from '../Utils'
import { BeltDressingWindowActions } from './Actions'
import { BeltDressingSet, BeltDressingWindowState } from './BeltDressingWindowState'
import { Elements } from './Elements'
import { ListElements } from '../Common/List/Elements'
import dispatch from './preload'
import { handleDragOver, setupAltEvents, dismissAlt } from '../Common/EventBuilder'
import { convertItemIntoDiv } from '../Common/ItemBuilder'

function createNoteElement(note: BeltDressingSet, isActive = false) {
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
        dispatch(BeltDressingWindowActions.SELECT_SET, note)
    }
    return newNoteDiv
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    setupAltEvents(item)
}

let dragableItem: HTMLDivElement | null = null
function handleDragStartEquipableItem(this: any) {
    dragableItem = this
    this.style.opacity = '0.4'
    dismissAlt(this)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    this.style.opacity = '1'
}

function setupPotionListeners(item: HTMLElement) {
    item.ondragover = handleDragOver
    item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
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

function renderSlots(slotsCount: number, variantSlots: number) {
    let currentVariantSlot = 1
    for(let i = 0; i < slotsCount; i++) {
        const potionRowDiv = document.createElement('div')
        potionRowDiv.style.display = 'flex'
        potionRowDiv.style.marginTop = '10px'

        const divPotionString = createDivPotionStr(false)
        const parser = new DOMParser()
        const divPotion = parser.parseFromString(divPotionString, 'text/html').body.firstElementChild as HTMLElement | null
        if(divPotion) {
            divPotion.classList.add('potion')
            divPotion.setAttribute('slot', `${i + 1}`)
            setupPotionListeners(divPotion)
            potionRowDiv.appendChild(divPotion)
        }
        for(let j = 0; j < 2; j++) {
            if(currentVariantSlot <= variantSlots) {
                const divPotionString = createDivPotionStr(true)
                const divPotion = parser.parseFromString(divPotionString, 'text/html').body.firstElementChild as HTMLElement | null
                if(divPotion) {
                    divPotion.classList.add('potion')
                    divPotion.setAttribute('variant', 'true')
                    divPotion.setAttribute('slot', `${currentVariantSlot}`)
                    setupPotionListeners(divPotion)
                    potionRowDiv.appendChild(divPotion)
                }
                currentVariantSlot += 1
            } else {
                break
            }
        }
        Elements.potionStaticBoxesDiv().appendChild(potionRowDiv)
    }
}

function generateSetId() {
    return 'belt_set_' + generateRandomId()
}

function createDivPotionStr(variant: boolean) {
    return `<button class="potionBox ${variant ? 'ml-5' : ''}">
                <svg class="m-auto" width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path class="foodBoxBg" d="M3.88618 37.375H24.1138C24.2451 37.1636 28 33.7382 28 27.6133C28 21.9485 24.5684 16.8489 19.3846 14.6894V11.4634H21.5385V4.93164H19.3846V0.625H8.61539V4.93164H6.46154V11.4634H8.61539V14.6894C3.43157 16.8489 0 21.9485 0 27.6133C0 33.7242 3.75913 37.17 3.88618 37.375ZM10.7692 2.77832H17.2308V4.93164H10.7692V2.77832ZM10.0513 16.4438L10.7692 16.19V9.31006H8.61539V7.08496H19.3846V9.31006H17.2308V16.19L17.9487 16.4438C22.6726 18.1129 25.8462 22.6015 25.8462 27.6133C25.8462 30.4176 24.8879 33.1009 23.1381 35.2217H4.86186C3.11214 33.1009 2.15385 30.4176 2.15385 27.6133C2.15385 22.6015 5.3274 18.1129 10.0513 16.4438Z" />
                    <path class="foodBoxBg" d="M5.91599 33.0684H22.0839L22.3949 32.5309C23.2315 31.0849 23.6922 29.3385 23.6922 27.6133C23.6922 24.4739 22.2218 22.5454 22.0839 22.23H14.8918C14.447 20.9767 13.25 20.0767 11.8461 20.0767C10.4422 20.0767 9.2452 20.9767 8.80041 22.23H5.91599C5.78614 22.5269 4.30762 24.4868 4.30762 27.6133C4.30762 30.8015 5.80157 32.8034 5.91599 33.0684ZM11.8461 22.23C12.4398 22.23 12.923 22.7131 12.923 23.3066C12.923 23.9002 12.4398 24.3833 11.8461 24.3833C11.2524 24.3833 10.7692 23.9002 10.7692 23.3066C10.7692 22.7131 11.2524 22.23 11.8461 22.23ZM7.18698 24.3833H8.80041C9.2452 25.6366 10.4422 26.5366 11.8461 26.5366C13.25 26.5366 14.447 25.6366 14.8918 24.3833H20.8129C21.2891 25.3871 21.5384 26.492 21.5384 27.6133C21.5384 28.7567 21.2826 29.9079 20.8109 30.915H7.18895C6.71723 29.9079 6.46146 28.7567 6.46146 27.6133C6.46146 26.492 6.71078 25.3871 7.18698 24.3833Z" />
                    <path class="foodBoxBg" d="M17.231 26.5366H19.3843V28.6899H17.231V26.5366Z" />
                    <path class="foodBoxBg" d="M15.0771 17.9233H17.2305V20.0767H15.0771V17.9233Z" />
                    <path class="foodBoxBg" d="M12.9229 11.4634H15.0762V13.6167H12.9229V11.4634Z" />
                </svg>
            </button>`
}

export function render(state: BeltDressingWindowState): void {
    Array.from(Elements.allItemsDiv().children ?? []).forEach((item) => Elements.allItemsDiv().removeChild(item))

    const itemsStaticBoxes = Array.from(Elements.potionDivs()) as HTMLDivElement[]
    itemsStaticBoxes.forEach(function(item) {
        item.parentElement?.removeChild(item)
    })
    Array.from(Elements.potionStaticBoxesDiv().children).forEach((box) => {
        box.parentElement?.removeChild(box)
    })
    renderSlots(state.slots, state.variants)
    const allItemDivs = state.allItems
        .map((item) => {
            if(!state.activeFilters.includes(getFilterColor(item.quality))) {
                return convertItemIntoDiv(item, undefined)
            }
        })
        .filter((div) => div) as HTMLDivElement[]
    allItemDivs.forEach((item) => {
        setupEquipableItemEvents(item)
        const parent = Elements.allItemsDiv()
        parent?.appendChild(item)
    })
    for(const item of state.currentEquipedItems) {
        const potionBoxes = Array.from(Elements.potionDivs())
        const emptyBox = potionBoxes.find((box) => box.childElementCount == 1 && box.getAttribute('slot') == item.slot && box.getAttribute('variant') == item.variant) as HTMLElement
        const potionDiv = convertItemIntoDiv(item, undefined)
        setupEquipableItemEvents(potionDiv)
        potionDiv.classList.replace('h-20', 'h-70px')
        potionDiv.classList.replace('w-20', 'w-70px')
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
        const icon = emptyBox.firstElementChild as HTMLElement | null
        if(icon) {
            icon.style.display = 'none'
        }
    }
    Array.from(ListElements.setsDiv().children)
        .filter((element) => element.id.startsWith('belt_set_'))
        .forEach((element) => ListElements.setsDiv().removeChild(element))
    for(const set of state.sets) {
        const isActive = state.currentSet?.id == set.id
        const setDiv = createNoteElement(set, isActive)
        if(isActive) {
            Elements.setTitleInput().value = set.title
        }
        ListElements.setsDiv().appendChild(setDiv)
    }
    Elements.warningSpan().style.display = state.warning ? 'block' : 'none'
}

let dragableSet: HTMLElement | null = null
function addNewSet(): BeltDressingSet {
    const id = generateSetId()
    const newSet: BeltDressingSet = {
        id: id,
        title: 'Default set',
        potions: []
    }
    return newSet
}

export function setupView() {
    ListElements.newSetButton().onclick = function() {
        const newSet = addNewSet()
        dispatch(BeltDressingWindowActions.CREATE_NEW_SET, newSet)
    }
    ListElements.removeSetDiv().ondrop = function(e) {
        e.preventDefault()
        dispatch(BeltDressingWindowActions.REMOVE_SET, dragableSet)
    }
    ListElements.removeSetDiv().ondragover = handleDragOver
    Elements.unequipButton().onclick = function() {
        dispatch(BeltDressingWindowActions.UNEQUIP_ALL)
    }
    Elements.equipSetButton().onclick = function() {
        dispatch(BeltDressingWindowActions.EQUIP_FROM_SET)
    }
    Elements.saveSetButton().onclick = function() {
        dispatch(BeltDressingWindowActions.SAVE_SET)
    }
    Elements.allItemsDiv().ondragover = handleDragOver
    Elements.allItemsDiv().ondrop = function() {
        dispatch(BeltDressingWindowActions.UNEQUIP_ITEM, dragableItem)
    }
}

export function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onclick = function() {
            const checked = document.getElementById(key)?.getAttribute('checked') == 'true'
            if(checked) {
                document.getElementById(key)?.removeAttribute('checked')
                dispatch(BeltDressingWindowActions.REMOVE_FILTER, key)
            } else {
                document.getElementById(key)?.setAttribute('checked', 'true')
                dispatch(BeltDressingWindowActions.ADD_FILTER, key)
            }
        }
    }
}
