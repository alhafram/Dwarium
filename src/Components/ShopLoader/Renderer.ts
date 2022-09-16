import { Elements } from './Elements'
import dispatch, { ShopLoaderState } from './preload'
import '../Common/Utils'
import { ShopLoaderWindowActions } from './Actions'

async function render(initialState: ShopLoaderState) {
    Array.from(Elements.energyItemsDiv().children).forEach((element) => Elements.energyItemsDiv().removeChild(element))
    initialState.energyItems.forEach((energyItem) => {
        const htmlStr = `<button id=${energyItem.id} style="color: ${energyItem.color}" class="h-8 w-80 bg-white rounded-full border-2 border-lightMediumGrey font-montserrat text-xss font-extrabold text-secondaryLightDark hover:bg-lightMediumGrey disabled:border-light disabled:text-lightMediumGrey disabled:hover:bg-transparent dark:border-secondaryDark dark:text-secondaryLight dark:disabled:border-secondaryBlack dark:disabled:text-secondaryDark dark:disabled:hover:bg-transparent; mt-3" id="saveButton">${energyItem.title}</button>`
        const child = document.createElementFromString(htmlStr) as HTMLButtonElement
        child.onclick = function() {
            dispatch(ShopLoaderWindowActions.BUY, energyItem)
        }
        Elements.energyItemsDiv().appendChild(child)
    })
}
export { render }
