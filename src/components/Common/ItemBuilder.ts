import { InventoryItem } from '../../Models/InventoryItem'
import ConfigService from '../../services/ConfigService'

export default function convertItemIntoDiv(item: InventoryItem, xmlFoodItem: Element | undefined): HTMLDivElement {
    const url = item.image.includes(ConfigService.getSettings().baseUrl) ? item.image : `${ConfigService.getSettings().baseUrl}/${item.image}`
    const count = xmlFoodItem?.getAttribute('cnt')
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
    return element.body.firstElementChild as HTMLDivElement
}
