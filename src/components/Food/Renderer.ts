import { Elements } from './Elements'
import { FoodWindowState } from './FoodWindowState'
import { setupAltEvents } from '../../Components/Common/EventBuilder'
import SimpleAlt from '../../Scripts/simple_alt'
import { FoodType } from '../../Models/InventoryItem'
import { convertItemIntoDiv } from '../Common/ItemBuilder'

let currentState: FoodWindowState
function render(state: FoodWindowState): void {
    currentState = state
    const parent = Elements.allFoodDiv()
    Array.from(parent?.children ?? []).forEach((itemBox) => {
        parent?.removeChild(itemBox)
    })
    state.allItems.forEach((item) => {
        const xmlFoodItem = state.xmlFoodItems.find((xmlItem) => item.id == xmlItem.id)
        const divItem = convertItemIntoDiv(item, xmlFoodItem)
        setupEquipableItemEvents(divItem)
        parent?.appendChild(divItem)
    })
    const hpParent = Elements.hpDiv()
    if(hpParent.childElementCount > 1) {
        const equipedHpItem = hpParent.lastElementChild
        if(equipedHpItem) {
            hpParent.removeChild(equipedHpItem)
            hpParent.style.borderWidth = '4px'
            Elements.hpIconSvg().style.display = 'block'
        }
    }
    if(state.hpItem) {
        const xmlFoodItem = state.xmlFoodItems.find((xmlItem) => state.hpItem?.id == xmlItem.id)
        const hpItemBox = convertItemIntoDiv(state.hpItem, xmlFoodItem)
        hpParent.appendChild(hpItemBox)
        setupEquipableItemEvents(hpItemBox)
        Elements.hpIconSvg().style.display = 'none'
        hpParent.style.borderWidth = '0px'
    }

    const mpParent = Elements.mpDiv()
    if(mpParent.childElementCount > 1) {
        const equipedMpItem = mpParent.lastElementChild
        if(equipedMpItem) {
            mpParent.removeChild(equipedMpItem)
            mpParent.style.borderWidth = '4px'
            Elements.mpIconSvg().style.display = 'block'
        }
    }
    if(state.mpItem) {
        const xmlFoodItem = state.xmlFoodItems.find((xmlItem) => state.mpItem?.id == xmlItem.id)
        const mpItemBox = convertItemIntoDiv(state.mpItem, xmlFoodItem)
        mpParent.appendChild(mpItemBox)
        setupEquipableItemEvents(mpItemBox)
        Elements.mpIconSvg().style.display = 'none'
        mpParent.style.borderWidth = '0px'
    }
    Elements.hpPercentageP().textContent = state.hpPercentage + '%'
    Elements.mpPercentageP().textContent = state.mpPercentage + '%'
}

let dragableItem: HTMLDivElement | null = null

function handleDragStartEquipableItem(this: any) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    dragableItem = this
    this.style.opacity = '0.4'
    SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, this)
    const item = currentState.allItems.find((item) => item.id == this.getAttribute('itemid'))
    if(item) {
        switch (item.foodType) {
            case FoodType.HP:
                highlightFoodBox(FoodType.HP)
                break
            case FoodType.MP:
                highlightFoodBox(FoodType.MP)
                break
            case FoodType.BOTH:
                highlightFoodBox(FoodType.HP)
                highlightFoodBox(FoodType.MP)
                break
        }
    }
}

function highlightFoodBox(foodType: FoodType) {
    if(foodType == FoodType.HP) {
        Elements.hpDiv().classList.replace('foodBox', 'foodBoxHighlighted')
        Elements.hpBg().classList.replace('foodBoxBg', 'foodBoxBgHighlighted')
    }
    if(foodType == FoodType.MP) {
        Elements.mpDiv().classList.replace('foodBox', 'foodBoxHighlighted')
        Elements.mpBg().classList.replace('foodBoxBg', 'foodBoxBgHighlighted')
    }
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    this.style.opacity = '1'
    const item = currentState.allItems.find((item) => item.id == this.getAttribute('itemid'))
    if(item) {
        Elements.hpDiv().classList.replace('foodBoxHighlighted', 'foodBox')
        Elements.hpBg().classList.replace('foodBoxBgHighlighted', 'foodBoxBg')
        Elements.mpDiv().classList.replace('foodBoxHighlighted', 'foodBox')
        Elements.mpBg().classList.replace('foodBoxBgHighlighted', 'foodBoxBg')
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    setupAltEvents(item)
}

function getDragableItem() {
    return dragableItem
}
export { render, getDragableItem, setupEquipableItemEvents }
