import { InventoryItem } from '../../Models/InventoryItem'
import ConfigService from '../../services/ConfigService'

function convertItemIntoDiv(item: InventoryItem, xmlFoodItem: Element | undefined): HTMLDivElement {
    const url = item.image.includes(ConfigService.getSettings().baseUrl) ? item.image : `${ConfigService.getSettings().baseUrl}/${item.image}`
    const count = xmlFoodItem?.getAttribute('cnt') ?? item.cnt
    let counterElement = ''
    if(count) {
        counterElement = parseInt(count) > 1 ? `<p class=" h-5 w-12 border text-secondaryLightDark dark:text-secondaryLight font-extrabold font-montserrat text-xs leading-normal bg-white dark:bg-dark mt-auto ml-auto mr-auto rounded-full border-lightMediumGrey dark:border-secondaryDark text-center">${count}</p>` : ''
    }
    
    const html = `
    <div class="h-20 w-20 flex flex-col bg-no-repeat rounded-3xl bg-cover" style="background-image: url(${url})" draggable="true" itemid="${item.id}">
        ${counterElement}
    </div>
    `
    const parser = new DOMParser()
    const element = parser.parseFromString(html, 'text/html')
    const itemDiv = element.body.firstElementChild as HTMLDivElement
    itemDiv.setAttribute('quality', item.quality)
    itemDiv.setAttribute('equiped', 'false')

    // Weapon attributes
    itemDiv.setAttribute('type', getType(item.kind_id))
    itemDiv.setAttribute('quality', item.quality)
    itemDiv.setAttribute('itemId', item.id)
    itemDiv.setAttribute('trend', item.trend ?? "Универсал")
    if(item.kind_id == '12') {
        itemDiv.setAttribute('weapon', '2h')
    }
    if(item.kind_id == '10' || item.kind_id == '42' || item.kind_id == '41' || item.kind_id == '51') {
        itemDiv.setAttribute('weapon', '1h')
    }
    if(item.kind_id == '44' || item.kind_id == '17') {
        itemDiv.setAttribute('weapon', 'off')
    }
    return itemDiv
}

function getType(kind_id: string): InventoryItemType {
    if(kind_id == '1') {
        return InventoryItemType.HELMET
    }
    if(kind_id == '7') {
        return InventoryItemType.SHOULDERS
    }
    if(kind_id == '5' || kind_id == '77' || kind_id == '120') {
        return InventoryItemType.BRACERS
    }
    if(kind_id == '10' || kind_id == '12' || kind_id == '42' || kind_id == '41' || kind_id == '51') {
        return InventoryItemType.MAIN_WEAPON
    }
    if(kind_id == '44' || kind_id == '17') {
        return InventoryItemType.OFFHAND_WEAPON
    }
    if(kind_id == '20' || kind_id == '3') {
        return InventoryItemType.CUIRASS
    }
    if(kind_id == '6') {
        return InventoryItemType.LEGGINGS
    }
    if(kind_id == '21' || kind_id == '4') {
        return InventoryItemType.CHAINMAIL
    }
    if(kind_id == '2') {
        return InventoryItemType.BOOTS
    }
    if(kind_id == '131') {
        return InventoryItemType.QUIVER
    }
    if(kind_id == '116') {
        return InventoryItemType.BOW
    }
    if(kind_id == '76' || kind_id == '18') {
        return InventoryItemType.RING
    }
    if(kind_id == '25') {
        return InventoryItemType.AMULET
    }
    if(kind_id == '161') {
        return InventoryItemType.ARCAT
    }
    return InventoryItemType.OTHER
}

enum InventoryItemType {
    HELMET = 'helmet',
    SHOULDERS = 'shoulders',
    BRACERS = 'bracers',
    MAIN_WEAPON = 'mainWeapon',
    OFFHAND_WEAPON = 'offhandWeapon',
    CUIRASS = 'cuirass',
    LEGGINGS = 'leggings',
    CHAINMAIL = 'chainmail',
    BOOTS = 'boots',
    BOW = 'bow',
    QUIVER = 'quiver',
    RING = 'ring',
    AMULET = 'amulet',
    ARCAT = 'arcat',
    OTHER = 'other'
}

export {
    convertItemIntoDiv,
    getType,
    InventoryItemType
}