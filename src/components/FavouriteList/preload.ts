import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import FavouriteLinksService from '../../services/FavouriteLinksService'
import setupMode from '../../services/DarkModeHandler'

const Elements = {
    linksDiv(): HTMLDivElement {
        return document.getElementById('linksDiv') as HTMLDivElement
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderFavouriteLinks()
    setupMode()
})

ipcRenderer.on(Channel.FAVOURITE_UPDATED, () => {
    renderFavouriteLinks()
})

function renderFavouriteLinks() {
    Array.from(Elements.linksDiv().children).forEach(linkDiv => {
        Elements.linksDiv().removeChild(linkDiv)
    })
    const favouriteLinks = FavouriteLinksService.getLinks()
    favouriteLinks.forEach(link => {
        const title = link.title.slice(0, 18)
        const url = link.url.slice(0, 18)
        let favouriteLinkElement = `
            <div class="cursor-pointer h-9 w-full hover:bg-inputBackgroundColor dark:hover:bg-inputBackgroundColorDark">
                <div class="float-left">
                    <p class="ml-9 text-textColor dark:text-textColorDark text-sm font-medium">${title}</p>
                    <p class="ml-9 text-textColor dark:text-textColorDark text-xs font-light">${url}</p>
                </div>
                <button class="relative top-1 right-3 float-right w-6 h-6 hover:bg-disabledButton dark:hover:bg-addTabDarkHover rounded-full">
                    <svg class="buttonIcon" width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0.906428L8.09357 0L4.5 3.59357L0.906428 0L0 0.906428L3.59357 4.5L0 8.09357L0.906428 9L4.5 5.40643L8.09357 9L9 8.09357L5.40643 4.5L9 0.906428Z" />
                    </svg>
                </button>
            </div>
        `
        const node = new DOMParser().parseFromString(favouriteLinkElement, 'text/html').body.firstElementChild as HTMLDivElement
        node.onclick = function(e) {
            ipcRenderer.send(Channel.NEW_TAB_WITH_URL, link.url)
            e.stopPropagation()
        }
        const removeButton = node.lastElementChild as HTMLButtonElement
        if(removeButton) {
            removeButton.onclick = function(e) {
                FavouriteLinksService.saveFavouriteLink(link.title, link.url, null)
                e.stopPropagation()
            }
            Elements.linksDiv().appendChild(node)
        }
    })
}