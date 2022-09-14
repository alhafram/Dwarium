import { Elements } from './Elements'
import dispatch, { ShopLoaderState } from './preload'
import '../Common/Utils'
import { ShopLoaderWindowActions } from './Actions'

async function render(initialState: ShopLoaderState) {
    Array.from(Elements.energyItemsDiv().children).forEach(element => Elements.energyItemsDiv().removeChild(element))
    initialState.energyItems.forEach(energyItem => {
        const htmlStr = `<button id=${energyItem.id} style="width: 300px; color: ${energyItem.color}" class="defaultButton mt-3" id="saveButton">${energyItem.title}</button>`
        const child = document.createElementFromString(htmlStr) as HTMLButtonElement
        child.onclick = function() {
            dispatch(ShopLoaderWindowActions.BUY, energyItem)
        }
        Elements.energyItemsDiv().appendChild(child)
    })
}
export { render, }
