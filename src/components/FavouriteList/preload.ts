import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import FavouriteLinksService from '../../services/FavouriteLinksService'

const Elements = {
    linksDiv(): HTMLDivElement {
        return document.getElementById('linksDiv') as HTMLDivElement
    }
}

type FavouriteLink = {
    url: string
    title: string
}

window.addEventListener('DOMContentLoaded', () => {
    renderFavouriteLinks()
    handleMode()
})

ipcRenderer.on(Channel.SWITCH_MODE, () => {
    handleMode()
})

ipcRenderer.on(Channel.FAVOURITE_UPDATED, () => {
    renderFavouriteLinks()
})

function handleMode() {
    if(localStorage.darkMode == 'true') {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}

function renderFavouriteLinks() {
    Array.from(Elements.linksDiv().children).forEach(linkDiv => {
        Elements.linksDiv().removeChild(linkDiv)
    })
    const savedLinks = FavouriteLinksService.getLinks()
    const favouriteLinks = Object.keys(savedLinks).map(key => {
        return {
            url: key,
            title: savedLinks[key].title
        }
    }) as FavouriteLink[]
    console.log(favouriteLinks)
    favouriteLinks.forEach(link => {
        const title = link.title.slice(0, 18)
        const url = link.url.slice(0, 20)
        let favouriteLinkElement = `<div class=" h-9 w-full hover:bg-inputBackgroundColor dark:hover:bg-inputBackgroundColorDark">
                <div class="float-left">
                    <p class="ml-9 text-textColor dark:text-textColorDark text-sm font-medium">${title}</p>
                    <p class="ml-9 text-textColor dark:text-textColorDark text-xs font-light">${url}</p>
                </div>
                <button style="right: 9px; margin-top: 5px;" class="relative float-right w-5.5 h-5.5 hover:bg-disabledButton dark:hover:bg-addTabDarkHover rounded-full">
                    <svg class="buttonIcon" width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 0.906428L8.09357 0L4.5 3.59357L0.906428 0L0 0.906428L3.59357 4.5L0 8.09357L0.906428 9L4.5 5.40643L8.09357 9L9 8.09357L5.40643 4.5L9 0.906428Z" />
                    </svg>
                </button>
            </div>`
        const node = new DOMParser().parseFromString(favouriteLinkElement, 'text/html').body.firstElementChild as HTMLDivElement
        node.onclick = function(e) {
            ipcRenderer.send(Channel.NEW_TAB_WITH_URL, link.url)
            e.stopPropagation()
        }
        const removeButton = node.lastElementChild as HTMLButtonElement
        if(removeButton) {
            removeButton.onclick = function(e) {
                FavouriteLinksService.saveFavouriteLink('', link.url, null)
                e.stopPropagation()
            }
            Elements.linksDiv().appendChild(node)
        }
    })
}