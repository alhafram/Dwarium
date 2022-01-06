function handleDragStartEquipableItem(this: any) {
    // @ts-ignore
    artifactAltSimple(this.getAttribute('itemid'), 0)
    this.style.opacity = '0.4'
    window.dressingAPI.state().currentElement = this
}

function handleDragEndEquipableItem(this: any) {
    this.style.opacity = '1'
}

function handleDragOver(e: Event) {
    if(e.preventDefault) {
        e.preventDefault()
    }
    return false
}

function handleDropEquipableItemOnStaticItemBox(this: any, e: Event) {
    if(!window.dressingAPI.state().currentElement) {
        return
    }
    if(e.stopPropagation) {
        e.stopPropagation()
    }
    if(window.dressingAPI.state().currentElement != this &&
        this.childElementCount == 0 &&
        window.dressingAPI.state().currentElement?.getAttribute('type') == this.getAttribute('type')) {
        // itemsManager.putOnItem(window.dressingAPI.state().currentElement)
    }
    return false
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }

    if(window.dressingAPI.state().currentElement?.getAttribute('weapon')) {
        // itemsManager.putOffWeapon(window.dressingAPI.state().currentElement)
    } else {
        // itemsManager.putOffItem(window.dressingAPI.state().currentElement?.parentElement)
    }
    filterWithResettingArmorType(window.dressingAPI.state())
    return false
}

function handleClickEquipableItem(this: any, e: MouseEvent) {
    if(e.detail == 1) {
        return
    }
    if(this.getAttribute('equiped') != 'true' && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        window.dressingAPI.state().currentElement = this
        // itemsManager.putOnItem(this)
        return
    }
    if(this.getAttribute('equiped') == 'true' && e.detail == 2) {
        if(this.getAttribute('weapon')) {
            // itemsManager.putOffWeapon(this)
        } else {
            // itemsManager.putOffItem(this.parentElement)
        }
        filterWithResettingArmorType(window.dressingAPI.state())
        e.stopPropagation()
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}
