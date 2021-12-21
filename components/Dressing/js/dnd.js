function handleDragStartEquipableItem(e) {
    this.style.opacity = '0.4'
    state.currentElement = this
}

function handleDragEndEquipableItem(e) {
    this.style.opacity = '1'
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
        state.currentElement.getAttribute('type') == this.getAttribute('type')) {
        itemsManager.putOnItem(state.currentElement)
    }
    return false
}

function handleDropEquipableItemIntoAllItems(e) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }

    if(state.currentElement.getAttribute('weapon')) {
        itemsManager.putOffWeapon(state.currentElement)
    } else {
        itemsManager.putOffItem(state.currentElement.parentElement)
    }
    filterWithResettingArmorType()
    return false
}

function handleClickEquipableItem(e) {
    if(e.detail == 1) {
        return
    }
    if(this.getAttribute('equiped') != 'true' && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        state.currentElement = this
        itemsManager.putOnItem(this)
        return
    }
    if(this.getAttribute('equiped') == 'true' && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        if(this.getAttribute('weapon')) {
            itemsManager.putOffWeapon(this)
        } else {
            itemsManager.putOffItem(itemBox)
        }
        filterWithResettingArmorType()
        e.stopPropagation()
    }
}

function setupEquipableItemEvents(item) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
}
