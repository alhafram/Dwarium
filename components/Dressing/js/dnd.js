function handleDragStartEquipableItem(e) {
    this.style.opacity = "0.4"
    state.currentElement = this
}

function handleDragEndEquipableItem(e) {
    this.style.opacity = "1"
}

function handleDragOver(e) {
    if(e.preventDefault) {
        e.preventDefault()
    }
    return false
}

function handleDropEquipableItemOnStaticItemBox(e) {
    if(!state.currentElement) {
        return
    }
    if(e.stopPropagation) {
        e.stopPropagation()
    }
    if(state.currentElement != this &&
        this.childElementCount == 0 &&
        state.currentElement.attributes.type.value == this.attributes.type.value) {
        itemsManager.putOnItem(state.currentElement, false)
    }
    return false
}

function handleDropEquipableItemIntoAllItems(e) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }

    if(state.currentElement.attributes.weapon) {
        itemsManager.putOffWeapon(state.currentElement, false)
    } else {
        itemsManager.putOffItem(state.currentElement.parentElement, false, false)
    }
    filterWithResettingArmorType()
    return false
}

function handleClickEquipableItem(e) {
    if(e.detail == 1) {
        return
    }
    if(this.attributes.equiped.value != "true" && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.attributes.type.value}Box`)
        state.currentElement = this
        itemsManager.putOnItem(this, false)
        return
    }
    if(this.attributes.equiped.value == "true" && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.attributes.type.value}Box`)
        if(this.attributes.weapon) {
            itemsManager.putOffWeapon(this, false)
        } else {
            itemsManager.putOffItem(itemBox, false, false)
        }
        filterWithResettingArmorType()
        e.stopPropagation()
    }
}

function setupEquipableItemEvents(item) {
    item.addEventListener("dragstart", handleDragStartEquipableItem, false)
    item.addEventListener("dragend", handleDragEndEquipableItem, false)
    item.addEventListener("click", handleClickEquipableItem, false)
}
