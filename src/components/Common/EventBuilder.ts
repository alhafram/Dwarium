/* eslint-disable @typescript-eslint/no-explicit-any */
import SimpleAlt from '../../Scripts/simple_alt'

function handleDragOver(e: Event) {
    e.preventDefault()
}

function setupAltEvents(item: HTMLElement) {
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

export {
    handleDragOver,
    setupAltEvents
}
