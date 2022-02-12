import { Elements } from './Elements'
import render from './Renderer'
import EventBuilder from '../Common/EventBuilder'
import { FoodWindowState } from './FoodWindowState'
import { FoodWindowActions } from './Actions'
import reduce from './Reducer'

let initialState: FoodWindowState = {
    allItems: [],
    hpItem: null,
    mpItem: null,
    hpPercentage: '',
    mpPercentage: '',
    userConfig: null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function dispatch(action: FoodWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render(initialState)
}

window.addEventListener('DOMContentLoaded', async() => {
    dispatch(FoodWindowActions.LOAD_CONTENT)

    const itemsStaticBoxes = Elements.staticBoxes()
    itemsStaticBoxes.forEach(function(item) {
        item.ondragover = EventBuilder.handleDragOver
        item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    })
    Elements.saveBox().onclick = function() {
        dispatch(FoodWindowActions.SAVE)
    }
    Elements.allFoodBox().ondrop = handleDropEquipableItemIntoAllItems
    Elements.allFoodBox().ondragover = EventBuilder.handleDragOver
    Elements.hpSelectBox().onchange = function() {
        dispatch(FoodWindowActions.CHANGE_HP_PERCENTAGE)
    }
    Elements.mpSelectBox().onchange = function() {
        dispatch(FoodWindowActions.CHANGE_MP_PERCENTAGE)
    }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleDropEquipableItemOnStaticItemBox(this: any, e: DragEvent) {
    e.stopPropagation()
    dispatch(FoodWindowActions.EQUIP, [EventBuilder.getDragableItem(), this])
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    e.stopPropagation()
    dispatch(FoodWindowActions.UNEQUIP, EventBuilder.getDragableItem())
}
