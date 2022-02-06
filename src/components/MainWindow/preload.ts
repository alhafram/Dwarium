import { ipcRenderer } from 'electron'
import configService from '../../services/ConfigService'
import { Channel } from '../../Models/Channel'
import { generateRandomId } from '../Utils'

const Elements = {
    backButton(): HTMLButtonElement {
        return document.getElementById('backButton') as HTMLButtonElement
    },
    forwardButton(): HTMLButtonElement {
        return document.getElementById('forwardButton') as HTMLButtonElement
    },
    reloadButton(): HTMLButtonElement {
        return document.getElementById('reloadButton') as HTMLButtonElement
    },
    urlInput(): HTMLInputElement {
        return document.getElementById('urlInput') as HTMLInputElement
    },
    favouriteButton(): HTMLButtonElement {
        return document.getElementById('favouriteButton') as HTMLButtonElement
    },
    nicknameInput(): HTMLInputElement {
        return document.getElementById('nicknameInput') as HTMLInputElement
    },
    userTagButton(): HTMLButtonElement {
        return document.getElementById('userTagButton') as HTMLButtonElement
    },
    userInfoButton(): HTMLButtonElement {
        return document.getElementById('userInfoButton') as HTMLButtonElement
    },
    findEffectsBox(): HTMLButtonElement {
        return document.getElementById('userEffectsButton') as HTMLButtonElement
    },
    foodButton(): HTMLButtonElement {
        return document.getElementById('foodButton') as HTMLButtonElement
    },
    screenshotButton(): HTMLButtonElement {
        return document.getElementById('screenshotButton') as HTMLButtonElement
    },
    notesButton(): HTMLButtonElement {
        return document.getElementById('notesButton') as HTMLButtonElement
    },
    dressingSetsButton(): HTMLButtonElement {
        return document.getElementById('dressingSetsButton') as HTMLButtonElement
    },
    beltSetsButton(): HTMLButtonElement {
        return document.getElementById('beltSetsButton') as HTMLButtonElement
    },
    chatLogButton(): HTMLButtonElement {
        return document.getElementById('chatLogButton') as HTMLButtonElement
    },
    settingsButton(): HTMLButtonElement {
        return document.getElementById('settingsButton') as HTMLButtonElement
    },
    notificationsButton(): HTMLButtonElement {
        return document.getElementById('notificationsButton') as HTMLButtonElement
    },
    updateApplicationButton(): HTMLButtonElement {
        return document.getElementById('updateApplicationButton') as HTMLButtonElement
    },
    modeSwitcherButton(): HTMLButtonElement {
        return document.getElementById('modeSwitcherButton') as HTMLButtonElement
    },
    mainTab(): HTMLButtonElement {
        return document.getElementById('main') as HTMLButtonElement
    },
    addTabButton(): HTMLButtonElement {
        return document.getElementById('addTabButton') as HTMLButtonElement
    },
    tabsDiv(): HTMLDivElement {
        return document.getElementById('tabsDiv') as HTMLDivElement
    },
    serverSwitcher(): HTMLInputElement {
        return document.getElementById('serverSwitcher') as HTMLInputElement
    },
    serverName(): HTMLSpanElement {
        return document.getElementById('serverName') as HTMLSpanElement
    }
}

window.addEventListener('DOMContentLoaded', () => {
    Elements.mainTab().onclick = makeActive

    Elements.serverSwitcher().onchange = function() {
        if(Elements.serverSwitcher().checked) {
            ipcRenderer.send(Channel.LOAD_URL, 'w2')
            Elements.serverName().textContent = 'W2'
        } else {
            ipcRenderer.send(Channel.LOAD_URL, 'w1')
            Elements.serverName().textContent = 'W1'
        }
    }
    Elements.reloadButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.RELOAD)
    })
    Elements.backButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.BACK)
    })
    Elements.forwardButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.FORWARD)
    })
    Elements.dressingSetsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_DRESSING_ROOM)
    })
    Elements.beltSetsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_BELT_POTION_ROOM)
    })
    Elements.chatLogButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_CHAT_LOG)
    })
    // REMAKE NO ICON
    document.getElementById('chatSettings')?.addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_CHAT_SETTINGS)
    })
    Elements.settingsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_SETTINGS)
    })
    document.addEventListener('make_active', (evt) => {
        makeActive(evt)
        ipcRenderer.send(Channel.MAKE_ACTIVE, (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('close_tab', (evt) => {
        ipcRenderer.send(Channel.CLOSE_TAB, (<CustomEvent>evt).detail.id)
    })
    Elements.urlInput().addEventListener('keyup', (e: KeyboardEvent) => {
        if(e.key == 'Enter') {
            ipcRenderer.send(Channel.GO_URL, Elements.urlInput().value)
        }
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send(Channel.GO_URL, (<CustomEvent>evt).detail)
    })
    Elements.updateApplicationButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.UPDATE_APPLICATION)
    })
    Elements.userInfoButton().addEventListener('click', () => {
        const nick = Elements.nicknameInput().value
        if(nick.length != 0) {
            if(configService.windowOpenNewTab()) {
                const tab = createNewTab()
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${configService.baseUrl()}/user_info.php?nick=${nick}`)
            } else {
                ipcRenderer.send(Channel.FIND_CHARACTER, nick)
            }
        }
    })
    Elements.nicknameInput().onkeyup = function(e) {
        if(e.key == 'Enter') {
            Elements.userInfoButton().click()
        }
    }
    Elements.userTagButton().onclick = function() {
        const nick = Elements.nicknameInput().value
        if(nick.length > 0) {
            ipcRenderer.send(Channel.USER_PRV, nick)
        }
    }
    Elements.findEffectsBox().onclick = function() {
        const nick = Elements.nicknameInput().value
        if(nick.length > 0) {
            if(configService.windowOpenNewTab()) {
                const tab = createNewTab()
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${configService.baseUrl()}/effect_info.php?nick=${nick}`)
            } else {
                ipcRenderer.send(Channel.FIND_EFFECTS, nick)
            }
        }
    }
    Elements.notesButton().onclick = function() {
        ipcRenderer.send(Channel.OPEN_NOTES)
    }
    Elements.screenshotButton().onclick = function() {
        ipcRenderer.send(Channel.TAKE_SCREENSHOT)
    }
    Elements.foodButton().onclick = function() {
        ipcRenderer.send(Channel.OPEN_FOOD)
    }
    let mode = false
    Elements.modeSwitcherButton().onclick = function() {
        if(mode) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
        mode = !mode
    }

    Elements.addTabButton().onclick = function() {
        const tab = createNewTab()
        ipcRenderer.send(Channel.NEW_TAB, tab.id)
    }
})

function createNewTab(id?: string, title?: string) {
    const newTabString = `
        <button style="min-width: 150px;" class="shrink-0 w-150px h-10 activeTab">
            <span>New tab</span>
            <button style="right: 10px;" class="relative float-right bg-center closeButtonActiveTab">
                <svg class="buttonIcon" width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 0.906428L8.09357 0L4.5 3.59357L0.906428 0L0 0.906428L3.59357 4.5L0 8.09357L0.906428 9L4.5 5.40643L8.09357 9L9 8.09357L5.40643 4.5L9 0.906428Z" />
                </svg>
            </button>
        </button>
    `
    const newTab = createTabButton(newTabString) as HTMLButtonElement
    if(!id) {
        id = generateRandomId()
    }
    newTab.id = id
    newTab.onclick = makeActive
    const closeButton = newTab.children[1] as HTMLButtonElement
    closeButton.onclick = closeTab

    document.querySelectorAll('.activeTab').forEach(item => {
        item?.firstElementChild?.classList.replace('separatorActiveTab', 'separatorInactiveTab')
        item?.lastElementChild?.classList.replace('closeButtonActiveTab', 'closeButtonInactiveTab')
        item.classList.replace('activeTab', 'inactiveTab')
    })
    Elements.tabsDiv().insertBefore(newTab, Elements.addTabButton())
    drawDividers()
    Elements.tabsDiv().scrollTo({
        left: 9999999999,
        behavior: 'smooth'
    })
    return newTab
}

function drawDividers() {
    const tabs = Array.from(Elements.tabsDiv().children)
    const tabsNeedToAddDividers = tabs.filter(item => {
        const index = tabs.indexOf(item)
        const prevTab = tabs[index - 1]
        const nextTab = tabs[index + 1]
        item.classList.remove('border-r')
        return item.id != 'addTabButton' && !item.classList.contains('activeTab') && !prevTab?.classList.contains('activeTab') && !nextTab?.classList.contains('activeTab')
    })
    tabsNeedToAddDividers.forEach(tab => {
        tab.classList.add('border-r')
    })
    const activeTab = tabs.find(item => item.classList.contains('activeTab'))
    if(activeTab) {
        const nextAfterActiveTabIndex = tabs.indexOf(activeTab) + 1
        if(tabs[nextAfterActiveTabIndex]?.id != 'addTabButton') {
            tabs[nextAfterActiveTabIndex].classList.add('border-r')
        }
    }

}


function createTabButton(html: string) {
    var t = document.createElement('template')
    t.innerHTML = html
    let but1 = t.content.children[0]
    but1.appendChild(t.content.children[1])
    return but1
}

function makeActive(evt: Event) {
    document.querySelectorAll('.activeTab').forEach(item => {
        item?.lastElementChild?.classList.replace('closeButtonActiveTab', 'closeButtonInactiveTab')
        item.classList.replace('activeTab', 'inactiveTab')
    })
    const target = evt.currentTarget as HTMLElement
    target.classList.replace('inactiveTab', 'activeTab')
    target.lastElementChild?.classList.replace('closeButtonInactiveTab', 'closeButtonActiveTab')
    let id = target.id
    ipcRenderer.send(Channel.MAKE_ACTIVE, id)
    evt.stopPropagation()
    drawDividers()
}

ipcRenderer.on(Channel.SERVER, (event, server) => {
    if(!server) {
        Elements.serverSwitcher().checked = true
        Elements.serverName().textContent = 'W2'
        ipcRenderer.send(Channel.LOAD_URL, 'w2')
    } else {
        ipcRenderer.send(Channel.LOAD_URL, server)
        Elements.serverName().textContent = (server as string).toUpperCase()
        if(server == 'w2') {
            Elements.serverSwitcher().checked = true
        }
    }
})

function closeTab(evt: Event) {
    const parentElement = (evt.currentTarget as HTMLElement).parentElement?.id
    ipcRenderer.send(Channel.CLOSE_TAB, parentElement)
    evt.stopPropagation()
}

ipcRenderer.on(Channel.URL, (event, url, id) => {
    Elements.urlInput().disabled = id == 'main'
    Elements.urlInput().value = url
})

ipcRenderer.on(Channel.FINISH_LOAD_URL, (event, id, title) => {
    let element = document.getElementById(id) as HTMLButtonElement
    if(element && element.firstElementChild) {
        element.firstElementChild.textContent = title
    }
})

ipcRenderer.on(Channel.NEW_TAB, (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send(Channel.NEW_TAB, tab.id, url)
})

ipcRenderer.on(Channel.CLOSE_TAB, (evt, id) => {
    let currentTabs = Array.from(Elements.tabsDiv().children)
    currentTabs.pop()
    let currentTab = currentTabs.filter(t => t.id == id)[0]
    if(currentTab) {
        Elements.tabsDiv().removeChild(currentTab);
        (currentTabs[0] as HTMLElement).click()
        ipcRenderer.send(Channel.REMOVE_VIEW, id)
    }
})

ipcRenderer.on(Channel.UPDATE_APPLICATION_AVAILABLE, () => {
    const updateApplicationStyle = Elements.updateApplicationButton().style
    updateApplicationStyle?.setProperty('display', 'block')
})

ipcRenderer.on(Channel.OPEN_WINDOW, (_evt, id, active) => {
    const element = document.getElementById(id)
    element!.style.backgroundColor = active ? '#999' : 'white'
})

ipcRenderer.on(Channel.TAKE_SCREENSHOT, () => {
    ipcRenderer.send(Channel.TAKE_SCREENSHOT)
})