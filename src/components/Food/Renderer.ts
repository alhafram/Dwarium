import { Elements } from "./Elements"
import EventBuilder from "./EventBuilder"
import convertItemIntoDiv from './ItemBuilder'
import { FoodWindowState } from "./State"

export default function render(state: FoodWindowState): void {
    const parent = Elements.allFoodBox()
    Array.from(parent?.children ?? []).forEach(itemBox => {
        parent?.removeChild(itemBox)
    })
    state.allItems.forEach(item => {
        const divItem = convertItemIntoDiv(item)
        EventBuilder.setupEquipableItemEvents(divItem)
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
    if(state.hpItem) {
        const hpItemBox = convertItemIntoDiv(state.hpItem)
        EventBuilder.setupEquipableItemEvents(hpItemBox)
        hpParent.style.border = 'none'
        hpParent.appendChild(hpItemBox)
    }
    if(state.mpItem) {
        const mpItemBox = convertItemIntoDiv(state.mpItem)
        EventBuilder.setupEquipableItemEvents(mpItemBox)
        mpParent.style.border = 'none'
        mpParent.appendChild(mpItemBox)
    }
    Elements.hpSelectBox().value = state.hpPercentage;
    Elements.mpSelectBox().value = state.mpPercentage
}