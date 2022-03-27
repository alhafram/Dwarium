import { ipcRenderer } from 'electron'
import ConfigService from '../../services/ConfigService'
import { Channel } from '../../Models/Channel'
import Utils from '../Common/Utils'
import { WindowType } from '../../Models/WindowModels'
import FavouriteLinkService from '../../services/FavouriteLinksService'

const Elements = {
    serverSwitcher(): HTMLInputElement {
        return document.getElementById('serverSwitcher') as HTMLInputElement
    },
    serverName(): HTMLSpanElement {
        return document.getElementById('serverName') as HTMLSpanElement
    },
    backButton(): HTMLButtonElement {
        return document.getElementById('backButton') as HTMLButtonElement
    },
    forwardButton(): HTMLButtonElement {
        return document.getElementById('forwardButton') as HTMLButtonElement
    },
    backButtonSvg(): HTMLButtonElement {
        return document.getElementById('backButtonSvg') as HTMLButtonElement
    },
    forwardButtonSvg(): HTMLButtonElement {
        return document.getElementById('forwardButtonSvg') as HTMLButtonElement
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
    chatSettingsButton(): HTMLButtonElement {
        return document.getElementById('chatSettingsButton') as HTMLButtonElement
    },
    notificationsButton(): HTMLButtonElement {
        return document.getElementById('notificationsButton') as HTMLButtonElement
    },
    effectSetsButton(): HTMLButtonElement {
        return document.getElementById('effectSetsButton') as HTMLButtonElement
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
    darkModeImage(): HTMLElement {
        return document.getElementById('dark') as HTMLElement
    },
    lightModeImage(): HTMLElement {
        return document.getElementById('light') as HTMLElement
    },
    favouriteListButton(): HTMLButtonElement {
        return document.getElementById('favouriteListButton') as HTMLButtonElement
    },
    favouriteButtonImage(): HTMLElement {
        return document.getElementById('favouriteButtonImage') as HTMLElement
    }
}

window.addEventListener('DOMContentLoaded', async() => {
    handleMode()
    await setupFavourite()

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
    Elements.chatSettingsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_CHAT_SETTINGS)
    })
    Elements.settingsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_SETTINGS)
    })
    Elements.notificationsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_NOTIFICATIONS)
    })
    Elements.effectSetsButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.OPEN_EFFECT_SETS)
    })
    Elements.urlInput().addEventListener('keyup', (e: KeyboardEvent) => {
        if(e.key == 'Enter') {
            ipcRenderer.send(Channel.GO_URL, Elements.urlInput().value)
        }
    })
    Elements.updateApplicationButton().addEventListener('click', () => {
        ipcRenderer.send(Channel.UPDATE_APPLICATION)
    })
    Elements.userInfoButton().addEventListener('click', async() => {
        const nick = Elements.nicknameInput().value
        if(nick.length != 0) {
            if(ConfigService.getSettings().windowOpenNewTab) {
                const tab = createNewTab()
                const baseMainUrl = await ipcRenderer.invoke(Channel.GET_MAIN_URL)
                const noredir = await getNoredir(nick)
                if(noredir) {
                    ipcRenderer.send(Channel.NEW_TAB, tab.id, `${baseMainUrl}/user_info.php?nick=${nick}&noredir=${noredir}`)
                    return
                }
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${baseMainUrl}/user_info.php?nick=${nick}`)
            } else {
                const noredir = await getNoredir(nick)
                ipcRenderer.send(Channel.FIND_CHARACTER, nick, noredir)
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
    Elements.findEffectsBox().onclick = async function() {
        const nick = Elements.nicknameInput().value
        if(nick.length > 0) {
            if(ConfigService.getSettings().windowOpenNewTab) {
                const tab = createNewTab()
                const baseMainUrl = await ipcRenderer.invoke(Channel.GET_MAIN_URL)
                ipcRenderer.send(Channel.NEW_TAB, tab.id, `${baseMainUrl}/effect_info.php?nick=${nick}`)
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
    Elements.modeSwitcherButton().onclick = function() {
        if(localStorage.darkMode == 'true') {
            localStorage.darkMode = false
        } else {
            localStorage.darkMode = true
        }
        handleMode()
        ipcRenderer.send(Channel.SWITCH_MODE)
    }
    Elements.addTabButton().onclick = function() {
        const tab = createNewTab()
        ipcRenderer.send(Channel.NEW_TAB, tab.id)
    }
    Elements.favouriteListButton().onclick = function() {
        ipcRenderer.send(Channel.FAVOURITE_LIST)
    }
    Elements.favouriteButton().onclick = async function() {
        const isFavourite = await isCurrentLinkFavourite()
        saveFavouriteLink(isFavourite)
    }

    document.addEventListener('make_active', (evt) => {
        makeActive(evt)
        ipcRenderer.send(Channel.MAKE_ACTIVE, (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('close_tab', (evt) => {
        ipcRenderer.send(Channel.CLOSE_TAB, (<CustomEvent>evt).detail.id)
    })
    document.addEventListener('goUrl', (evt) => {
        ipcRenderer.send(Channel.GO_URL, (<CustomEvent>evt).detail)
    })
})

async function isCurrentLinkFavourite(): Promise<boolean> {
    const urlString = (await ipcRenderer.invoke(Channel.GET_URL)) as string
    if(urlString.length == 0) {
        return false
    }
    const url = new URL(urlString).href
    return FavouriteLinkService.isFavouriteLink(url)
}

async function saveFavouriteLink(value: boolean | null) {
    const urlString = (await ipcRenderer.invoke(Channel.GET_URL)) as string
    if(urlString.length == 0) {
        return false
    }
    const url = new URL(urlString).href
    const title = (await ipcRenderer.invoke(Channel.GET_TITLE)) as string
    const isFavourite = FavouriteLinkService.isFavouriteLink(url)
    FavouriteLinkService.saveFavouriteLink(title, url, !isFavourite ? true : null)
    await setupFavourite()
}

async function setupFavourite() {
    const isFavourite = await isCurrentLinkFavourite()
    if(isFavourite) {
        Elements.favouriteButtonImage().classList.replace('favouriteButtonDefault', 'favouriteButtonSelected')
    } else {
        Elements.favouriteButtonImage().classList.replace('favouriteButtonSelected', 'favouriteButtonDefault')
    }
}

function handleMode() {
    if(localStorage.darkMode == 'true') {
        Elements.darkModeImage().classList.add('hidden')
        Elements.lightModeImage().classList.remove('hidden')
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
        Elements.lightModeImage().classList.add('hidden')
        Elements.darkModeImage().classList.remove('hidden')
    }
}

function createNewTab(id?: string) {
    const newTabString = `
        <button class="shrink-0 w-36 h-10 activeTab">
            <span>New tab</span>
            <button class="relative right-2 float-right bg-center closeButtonActiveTab">
                <svg class="buttonIcon" width="9" height="9" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 0.906428L8.09357 0L4.5 3.59357L0.906428 0L0 0.906428L3.59357 4.5L0 8.09357L0.906428 9L4.5 5.40643L8.09357 9L9 8.09357L5.40643 4.5L9 0.906428Z" />
                </svg>
            </button>
        </button>
    `
    const newTab = createTabButton(newTabString) as HTMLButtonElement
    if(!id) {
        id = Utils.generateRandomId()
    }
    newTab.id = id
    newTab.onclick = makeActive
    const closeButton = newTab.children[1] as HTMLButtonElement
    closeButton.onclick = closeTab

    document.querySelectorAll('.activeTab,.activeTabMain').forEach((item) => {
        item.classList.replace('activeTab', 'inactiveTab')
        item.classList.replace('activeTabMain', 'inactiveTab')
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
    const tabs = Array.from(Elements.tabsDiv().children) as HTMLElement[]
    const tabsNeedToAddDividers = tabs.filter((tab) => {
        const index = tabs.indexOf(tab)
        const prevTab = tabs[index - 1]
        const nextTab = tabs[index + 1]
        tab.style.borderRightWidth = '0px'
        return (
            tab.id != 'addTabButton' &&
            !tab.classList.contains('activeTab') &&
            !tab.classList.contains('activeTabMain') &&
            !prevTab?.classList.contains('activeTab') &&
            !nextTab?.classList.contains('activeTab')
        )
    })
    tabsNeedToAddDividers.forEach((tab) => {
        tab.style.borderRightWidth = '1px'
    })
    const activeTab = tabs.find((item) => item.classList.contains('activeTab'))
    if(activeTab) {
        const nextAfterActiveTabIndex = tabs.indexOf(activeTab) + 1
        const nextAfterActiveTab = tabs[nextAfterActiveTabIndex]
        if(nextAfterActiveTab.id != 'addTabButton') {
            nextAfterActiveTab.style.borderRightWidth = '1px'
        }
    }
}

function createTabButton(html: string) {
    const t = document.createElement('template')
    t.innerHTML = html
    const but1 = t.content.children[0]
    but1.appendChild(t.content.children[1])
    return but1
}

function makeActive(evt: Event) {
    resetTabClasses()
    const target = evt.currentTarget as HTMLElement
    target.lastElementChild?.classList.replace('closeButtonInactiveTab', 'closeButtonActiveTab')
    const id = target.id
    if(id == 'main') {
        target.classList.replace('inactiveTab', 'activeTabMain')
    } else {
        target.classList.replace('inactiveTab', 'activeTab')
    }
    ipcRenderer.send(Channel.MAKE_ACTIVE, id)
    evt.stopPropagation()
    drawDividers()
}

function makeActiveWith(id: string) {
    resetTabClasses()
    const target = document.getElementById(id)
    if(target) {
        target.lastElementChild?.classList.replace('closeButtonInactiveTab', 'closeButtonActiveTab')
        const id = target.id
        if(id == 'main') {
            target.classList.replace('inactiveTab', 'activeTabMain')
        } else {
            target.classList.replace('inactiveTab', 'activeTab')
        }
        ipcRenderer.send(Channel.MAKE_ACTIVE, id)
    }
    drawDividers()
}

function resetTabClasses() {
    document.querySelectorAll('.activeTab,.activeTabMain,.inactiveTab').forEach((item) => {
        item?.lastElementChild?.classList.replace('closeButtonActiveTab', 'closeButtonInactiveTab')
        item.classList.replace('activeTab', 'inactiveTab')
        item.classList.replace('activeTabMain', 'inactiveTab')
    })
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

ipcRenderer.on(Channel.URL, async(event, url, id) => {
    const isBackEnabled = (await ipcRenderer.invoke(Channel.IS_BACK_ENABLED)) as boolean
    const isForwardEnabled = (await ipcRenderer.invoke(Channel.IS_FORWARD_ENABLED)) as boolean
    Elements.backButton().disabled = !isBackEnabled
    if(!isBackEnabled) {
        Elements.backButtonSvg().classList.replace('buttonIcon', 'buttonIconDisabled')
    } else {
        Elements.backButtonSvg().classList.replace('buttonIconDisabled', 'buttonIcon')
    }
    Elements.forwardButton().disabled = !isForwardEnabled
    if(!isForwardEnabled) {
        Elements.forwardButtonSvg().classList.replace('buttonIcon', 'buttonIconDisabled')
    } else {
        Elements.forwardButtonSvg().classList.replace('buttonIconDisabled', 'buttonIcon')
    }
    Elements.urlInput().disabled = id == 'main'
    Elements.urlInput().value = url
    setupFavourite()
})

ipcRenderer.on(Channel.FINISH_LOAD_URL, (event, id, title) => {
    const element = document.getElementById(id) as HTMLButtonElement
    if(element && element.firstElementChild) {
        element.firstElementChild.textContent = title
    }
})

ipcRenderer.on(Channel.NEW_TAB, (event, url) => {
    const tab = createNewTab()
    ipcRenderer.send(Channel.NEW_TAB, tab.id, url)
})

ipcRenderer.on(Channel.CLOSE_TAB, (evt, id) => {
    const currentTabs = Array.from(Elements.tabsDiv().children)
    currentTabs.pop()
    const currentTab = currentTabs.filter((t) => t.id == id)[0]
    if(currentTab) {
        Elements.tabsDiv().removeChild(currentTab)
        ;(currentTabs[0] as HTMLElement).click()
        ipcRenderer.send(Channel.REMOVE_VIEW, id)
    }
})

ipcRenderer.on(Channel.UPDATE_APPLICATION_AVAILABLE, () => {
    Elements.updateApplicationButton().classList.remove('hidden')
})

ipcRenderer.on(Channel.OPEN_WINDOW, (_evt, id, active) => {
    const element = getElementIdBy(id)
    if(active) {
        element?.classList.add('selectedButton')
    } else {
        element?.classList.remove('selectedButton')
    }
})

ipcRenderer.on(Channel.TAKE_SCREENSHOT, () => {
    ipcRenderer.send(Channel.TAKE_SCREENSHOT)
})

ipcRenderer.on(Channel.FAVOURITE_UPDATED, () => {
    setupFavourite()
})

ipcRenderer.on(Channel.NEW_TAB_WITH_URL, (evt, url) => {
    const tab = createNewTab()
    ipcRenderer.send(Channel.NEW_TAB, tab.id, url)
})

ipcRenderer.on(Channel.RELOAD, () => {
    ipcRenderer.send(Channel.RELOAD)
})

ipcRenderer.on(Channel.SWITCH_NEXT_TAB, () => {
    ipcRenderer.send(Channel.SWITCH_NEXT_TAB)
})

ipcRenderer.on(Channel.SWITCH_PREV_TAB, () => {
    ipcRenderer.send(Channel.SWITCH_PREV_TAB)
})

ipcRenderer.on(Channel.MAKE_ACTIVE, (evt, id) => {
    makeActiveWith(id)
})

function getElementIdBy(type: WindowType): HTMLElement | undefined {
    switch (type) {
        case WindowType.FOOD:
            return Elements.foodButton()
        case WindowType.SCREENSHOT:
            return Elements.screenshotButton()
        case WindowType.NOTES:
            return Elements.notesButton()
        case WindowType.DRESSING_ROOM:
            return Elements.dressingSetsButton()
        case WindowType.BELT_POTION_ROOM:
            return Elements.beltSetsButton()
        case WindowType.CHAT_LOG:
            return Elements.chatLogButton()
        case WindowType.SETTINGS:
            return Elements.settingsButton()
        case WindowType.CHAT_SETTINGS:
            return Elements.chatSettingsButton()
        case WindowType.NOTIFICATIONS:
            return Elements.notificationsButton()
        case WindowType.EFFECT_SETS:
            return Elements.effectSetsButton()
    }
}

async function getNoredir(nick: string): Promise<string | null> {
    const baseMainUrl = await ipcRenderer.invoke(Channel.GET_MAIN_URL)
    const req = await fetch(`${baseMainUrl}/user_info.php?nick=${nick}`)
    const text = await req.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    const onclickValue = doc
        .querySelector('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > p > b > b > input[type=button]')
        ?.getAttribute('onclick')
    if(onclickValue) {
        const splittedValue = onclickValue.split('=')
        const noredir = splittedValue.slice(-1)[0].slice(0, -2)
        return noredir
    }
    return null
}

ipcRenderer.send
