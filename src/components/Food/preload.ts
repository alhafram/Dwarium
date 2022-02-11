import { Elements } from './Elements'
import render from './Renderer'
import EventBuilder from './EventBuilder'
import { FoodWindowState } from './State'
import { FoodWindowActions } from './Actions'
import reduce from './Reducer'

var initialState: FoodWindowState = {
    allItems: [],
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

window.addEventListener('DOMContentLoaded', async () => {
    dispatch(FoodWindowActions.LOAD_CONTENT)

    let itemsStaticBoxes = Elements.staticBoxes()
    itemsStaticBoxes.forEach(function(item) {
        item.ondragover = EventBuilder.handleDragOver
        item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    })
    Elements.saveBox().onclick = function() {
        dispatch(FoodWindowActions.SAVE)
    }
    Elements.allFoodBox().ondrop = handleDropEquipableItemIntoAllItems;
    Elements.allFoodBox().ondragover = EventBuilder.handleDragOver
    Elements.hpSelectBox().onchange = function() {
        dispatch(FoodWindowActions.CHANGE_HP_PERCENTAGE)
    }
    Elements.mpSelectBox().onchange = function() {
        dispatch(FoodWindowActions.CHANGE_MP_PERCENTAGE)
    }
})

function handleDropEquipableItemOnStaticItemBox(this: any, e: DragEvent) {
    e.stopPropagation()
    dispatch(FoodWindowActions.EQUIP, [EventBuilder.getDragableItem(), this])
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    e.stopPropagation()
    dispatch(FoodWindowActions.UNEQUIP, EventBuilder.getDragableItem())
}
