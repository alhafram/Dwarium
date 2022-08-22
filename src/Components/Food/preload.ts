import { Elements } from './Elements'
import { render, getDragableItem } from './Renderer'
import { handleDragOver } from '../Common/EventBuilder'
import { FoodWindowState } from './FoodWindowState'
import { FoodWindowActions } from './Actions'
import reduce from './Reducer'
import setupMode from '../../services/DarkModeHandler'

let initialState: FoodWindowState = {
    allItems: [],
    xmlFoodItems: [],
    hpItem: null,
    mpItem: null,
    hpPercentage: '',
    mpPercentage: '',
    userConfig: null
}

async function dispatch(action: FoodWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

window.addEventListener('DOMContentLoaded', async() => {
    setupMode()
    dispatch(FoodWindowActions.LOAD_CONTENT)
    Elements.hpDiv().ondragover = handleDragOver
    Elements.hpDiv().addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)

    Elements.mpDiv().ondragover = handleDragOver
    Elements.mpDiv().addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)

    Elements.saveButton().onclick = function() {
        dispatch(FoodWindowActions.SAVE)
    }
    Elements.allFoodDiv().ondrop = handleDropEquipableItemIntoAllItems
    Elements.allFoodDiv().ondragover = handleDragOver

    Elements.hpMinusButton().onclick = function() {
        dispatch(FoodWindowActions.MINUS_HP_PERCENTAGE)
    }
    Elements.hpPlusButton().onclick = function() {
        dispatch(FoodWindowActions.PLUS_HP_PERCENTAGE)
    }
    Elements.mpMinusButton().onclick = function() {
        dispatch(FoodWindowActions.MINUS_MP_PERCENTAGE)
    }
    Elements.mpPlusButton().onclick = function() {
        dispatch(FoodWindowActions.PLUS_MP_PERCENTAGE)
    }
})

function handleDropEquipableItemOnStaticItemBox(this: any, e: DragEvent) {
    e.stopPropagation()
    dispatch(FoodWindowActions.EQUIP, [getDragableItem(), this])
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    e.stopPropagation()
    dispatch(FoodWindowActions.UNEQUIP, getDragableItem())
}
