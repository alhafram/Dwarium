/* eslint-disable @typescript-eslint/no-explicit-any */
import SimpleAlt from '../../Scripts/simple_alt'

let dragableItem: HTMLDivElement | null = null

function getDragableItem(): HTMLDivElement | null {
    return dragableItem
}

function handleDragStartEquipableItem(this: any) {
    dragableItem = this
    this.style.opacity = '0.4'
    SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, this)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    this.style.opacity = '1'
}

function handleDragOver(e: Event) {
    e.preventDefault()
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener(
        'mouseover',
        function(event) {
            SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 2, event)
        },
        false
    )
    item.addEventListener(
        'mouseout',
        function(event) {
            SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, event)
        },
        false
    )
}

export default {
    setupEquipableItemEvents,
    handleDragOver,
    getDragableItem
}