import { InventoryItem } from '../../Models/InventoryItem'
import ConfigService from '../../services/ConfigService'

export default function convertItemIntoDiv(item: InventoryItem): HTMLDivElement {
    const divItem = document.createElement('div')
    divItem.className = 'box'
    divItem.draggable = true
    if(item.image.includes(ConfigService.getSettings().baseUrl)) {
        divItem.style.backgroundImage = `url('${item.image}')`
    } else {
        const url = `${ConfigService.getSettings().baseUrl}/${item.image}`
        item.image = url
        divItem.style.backgroundImage = `url('${url}')`
    }
    if(item.cnt) {
        const span = document.createElement('div')
        span.textContent = item.cnt
        span.className = 'bpdig'
        divItem.appendChild(span)
    }
    divItem.style.backgroundRepeat = 'no-repeat'
    divItem.style.backgroundSize = 'cover'
    divItem.setAttribute('itemId', item.id)
    return divItem
}
