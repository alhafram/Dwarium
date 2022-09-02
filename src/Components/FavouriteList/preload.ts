import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import FavouriteLinksService from '../../Services/FavouriteLinksService'
import setupMode from '../../Services/DarkModeHandler'

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
    Array.from(Elements.linksDiv().children).forEach((linkDiv) => {
        Elements.linksDiv().removeChild(linkDiv)
    })
    const favouriteLinks = FavouriteLinksService.getLinks()
    favouriteLinks.forEach((link) => {
        const title = link.title
        const url = link.url.slice(0, 21)
        const favouriteLinkElement = `
            <div class="cursor-pointer h-10 w-full hover:bg-lightGrey dark:hover:bg-lightBlack">
                <div class="float-left">
                    <input class="ml-6 bg-transparent text-dark w-32 outline-none dark:text-secondaryLightGrey font-montserrat text-sm font-medium" value='${title}' type="text" />
                    <p class="ml-6 text-dark font-montserrat dark:text-secondaryLightGrey text-xs font-light">${url}</p>
                </div>
                <button class="relative top-2 right-3 float-right w-6 h-6 hover:bg-white dark:hover:bg-dark rounded-full">
                    <svg class="buttonIcon" width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0.906428L8.09357 0L4.5 3.59357L0.906428 0L0 0.906428L3.59357 4.5L0 8.09357L0.906428 9L4.5 5.40643L8.09357 9L9 8.09357L5.40643 4.5L9 0.906428Z" />
                    </svg>
                </button>
            </div>
        `
        const node = new DOMParser().parseFromString(favouriteLinkElement, 'text/html').body.firstElementChild as HTMLDivElement
        const titleInput = node.firstElementChild?.firstElementChild as HTMLInputElement | null | undefined
        if(titleInput) {
            titleInput.onkeyup = function(e) {
                if(e.key == 'Enter') {
                    const newValue = titleInput.value
                    if(newValue.length == 0) {
                        alert('Название вкладки не может быть пустым!')
                        titleInput.value = title
                    } else {
                        titleInput.blur()
                        FavouriteLinksService.updateTitle(link.id, newValue)
                    }
                }
            }
        }
        node.onclick = function(e) {
            if(e.target != titleInput) {
                ipcRenderer.send(Channel.NEW_TAB_WITH_URL, link.url)
            }
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
