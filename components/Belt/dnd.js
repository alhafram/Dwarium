function handleDragStartEquipableItem(e) {
    artifactAltSimple(this.getAttribute('itemid'), 0)
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
        this.childElementCount == 0) {
        potionsManager.putOnItem(state.currentElement, this)
    }
    return false
}

function handleClickEquipableItem(e) {
    if(this.getAttribute('equiped') != 'true') {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        state.currentElement = this
        potionsManager.putOnItem(this)
        return
    }
    if(this.getAttribute('equiped') == 'true') {
        potionsManager.putOffItem(this.parentElement)
        filterWithResettingArmorType()
        e.stopPropagation()
    }
}

function setupEquipableItemEvents(item) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    item.addEventListener('mouseover', function() {
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}
