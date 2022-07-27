import { ipcRenderer, shell } from 'electron'
import ConfigService from '../../services/ConfigService'
import { Channel } from '../../Models/Channel'
import Utils from '../Common/Utils'
import { WindowType } from '../../Models/WindowModels'
import FavouriteLinkService from '../../services/FavouriteLinksService'
import sendNotification, { NotificationType } from '../../services/Notifications'
import { Elements } from './Elements'
import ua from 'universal-analytics'
import { app } from '@electron/remote'

enum PluginConfigKeys {
    foodButtonBadgeSpan = 'foodButtonBadgeSpan',
    notesButtonBadgeSpan = 'notesButtonBadgeSpan',
    dressingSetsButtonBadgeSpan = 'dressingSetsButtonBadgeSpan',
    beltSetsButtonButtonBadgeSpan = 'beltSetsButtonButtonBadgeSpan',
    chatLogButtonBadgeSpan = 'chatLogButtonBadgeSpan',
    chatSettingsButtonBadgeSpan = 'chatSettingsButtonBadgeSpan',
    notificationsButtonBadgeSpan = 'notificationsButtonBadgeSpan',
    effectSetsButtonBadgeSpan = 'effectSetsButtonBadgeSpan',
    expiringItemsSettingsButtonBadgeSpan = 'expiringItemsSettingsButtonBadgeSpan',
    gameSettingsButtonBadgeSpan = 'gameSettingsButtonBadgeSpan',
    settingsButtonBadgeSpan = 'settingsButtonBadgeSpan',
    statsButtonBadgeSpan = 'statsButtonBadgeSpan'
}

type PluginConfig = {
    foodButtonBadgeSpan: ''
    notesButtonBadgeSpan: ''
    dressingSetsButtonBadgeSpan: ''
    beltSetsButtonButtonBadgeSpan: ''
    chatLogButtonBadgeSpan: ''
    chatSettingsButtonBadgeSpan: ''
    notificationsButtonBadgeSpan: ''
    effectSetsButtonBadgeSpan: ''
    expiringItemsSettingsButtonBadgeSpan: ''
    gameSettingsButtonBadgeSpan: ''
    settingsButtonBadgeSpan: ''
    statsButtonBadgeSpan: ''
}

function addMinutes(numOfMinutes: number, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes)
    return date
}

function handleUserSession(visitor: ua.Visitor) {
    type Session = {
        sessionId: string
        finishDate: Date
    }
    const newSession: Session = {
        sessionId: window.crypto.randomUUID(),
        finishDate: addMinutes(3, new Date())
    }
    const session = JSON.parse(localStorage.session ?? JSON.stringify(newSession)) as Session

    let sessionId = ''
    if(new Date(session.finishDate) > new Date()) {
        sessionId = session.sessionId
    } else {
        sessionId = window.crypto.randomUUID()
    }
    session.sessionId = sessionId

    sendActivityEvent()
    setInterval(() => {
        sendActivityEvent()
    }, 1000 * 60 * 3)

    function sendActivityEvent() {
        visitor.event('Session', 'Start', `Activity_${sessionId}`, (callback) => {
            if(callback == null) {
                session.finishDate = addMinutes(3, new Date())
                localStorage.session = JSON.stringify(session)
            }
        })
    }
}

let restoreContextMenuOpened = false
let currentContextMenuTarget: HTMLElement | null
window.addEventListener('DOMContentLoaded', async() => {
    handleMode()
    await setupFavourite()
    const pluginConfig = await setupBadges()

    Elements.shareTgButton().onclick = function() {
        shell.openExternal('https://t.me/share?url=https://alhafram.github.io/DwariumLibrary/')
    }

    Elements.shareVkButton().onclick = function() {
        shell.openExternal('https://vk.com/share.php?url=https://alhafram.github.io/DwariumLibrary/')
    }

    Elements.shareWAButton().onclick = function() {
        shell.openExternal('whatsapp://send?text=https://alhafram.github.io/DwariumLibrary/')
    }

    const pluginButtons = [
        Elements.foodButton(),
        Elements.notesButton(),
        Elements.dressingSetsButton(),
        Elements.beltSetsButton(),
        Elements.chatLogButton(),
        Elements.chatSettingsButton(),
        Elements.notificationsButton(),
        Elements.effectSetsButton(),
        Elements.expiringItemsSettingsButton(),
        Elements.gameSettingsButton(),
        Elements.statsButton()
    ]
    pluginButtons.forEach((pluginButton) => {
        setupContextMenuForHidePlugins(pluginButton, Elements.hideContextMenuDiv())
        const hiddenPluginIds = JSON.parse(localStorage.hiddenPlugins ?? '[]') as string[]
        if(hiddenPluginIds.includes(pluginButton.id)) {
            pluginButton.setAttribute('hiddenPlugin', 'true')
            pluginButton.style.display = 'none'
        }
    })
    setupContextMenuForHidePlugins(Elements.settingsButton(), Elements.restoreContextMenuDiv())

    Elements.hidePluginDiv().onclick = function() {
        hideContextMenu()
        if(currentContextMenuTarget) {
            const hiddenPluginIds = JSON.parse(localStorage.hiddenPlugins ?? '[]') as string[]
            hiddenPluginIds.push(currentContextMenuTarget.id)
            localStorage.hiddenPlugins = JSON.stringify(Array.from(new Set(hiddenPluginIds)))
            currentContextMenuTarget.style.display = 'none'
        }
    }

    Elements.restorePluginsDiv().onclick = function() {
        const hiddenPluginIds = JSON.parse(localStorage.hiddenPlugins ?? '[]') as string[]
        if(hiddenPluginIds.length == 0) {
            hideContextMenu()
            return
        }
        const hiddenPlugins = pluginButtons.filter((pluginButton) => hiddenPluginIds.includes(pluginButton.id))
        if(!restoreContextMenuOpened) {
            hiddenPlugins.forEach((plugin) => {
                plugin.style.display = ''
                plugin.style.border = '2px dashed red'
                plugin.setAttribute('hiddenPlugin', 'true')
            })
        } else {
            hiddenPlugins.forEach((plugin) => {
                plugin.style.display = 'none'
                plugin.style.border = ''
            })
        }
        hideContextMenu()
        restoreContextMenuOpened = !restoreContextMenuOpened
    }

    let userId = ''
    if(localStorage.userId) {
        userId = localStorage.userId
    } else {
        userId = window.crypto.randomUUID()
        localStorage.userId = userId
    }
    const visitor = ua('UA-217573092-2', userId, { cid: userId, uid: userId })
    visitor.screenview({ av: app.getVersion(), an: 'Dwarium', cd: 'OpenDwarium' }, (callback) => {
        console.log(callback)
    })
    visitor.event('Screen', 'Open', `Main_${app.getVersion()}`, (callback) => {
        console.log(callback)
    })
    handleUserSession(visitor)

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
    // Plugins
    Elements.foodButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.foodButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.foodButtonBadgeSpan, pluginConfig.foodButtonBadgeSpan)
        Elements.foodButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_FOOD)
    }
    Elements.notesButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.notesButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.notesButtonBadgeSpan, pluginConfig.notesButtonBadgeSpan)
        Elements.notesButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_NOTES)
    }
    Elements.dressingSetsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.dressingSetsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.dressingSetsButtonBadgeSpan, pluginConfig.dressingSetsButtonBadgeSpan)
        Elements.dressingSetsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_DRESSING_ROOM)
    }
    Elements.beltSetsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.beltSetsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.beltSetsButtonButtonBadgeSpan, pluginConfig.beltSetsButtonButtonBadgeSpan)
        Elements.beltSetsButtonButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_BELT_POTION_ROOM)
    }
    Elements.chatLogButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.chatLogButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.chatLogButtonBadgeSpan, pluginConfig.chatLogButtonBadgeSpan)
        Elements.chatLogButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_CHAT_LOG)
    }
    Elements.chatSettingsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.chatSettingsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.chatSettingsButtonBadgeSpan, pluginConfig.chatSettingsButtonBadgeSpan)
        Elements.chatSettingsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_CHAT_SETTINGS)
    }
    Elements.notificationsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.notificationsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.notificationsButtonBadgeSpan, pluginConfig.notificationsButtonBadgeSpan)
        Elements.notificationsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_NOTIFICATIONS)
    }
    Elements.effectSetsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.effectSetsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.effectSetsButtonBadgeSpan, pluginConfig.effectSetsButtonBadgeSpan)
        Elements.effectSetsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_EFFECT_SETS)
    }
    Elements.expiringItemsSettingsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.expiringItemsSettingsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.expiringItemsSettingsButtonBadgeSpan, pluginConfig.expiringItemsSettingsButtonBadgeSpan)
        Elements.expiringItemsSettingsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_EXPIRING_ITEMS_SETTINGS)
    }
    Elements.gameSettingsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.gameSettingsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.gameSettingsButtonBadgeSpan, pluginConfig.gameSettingsButtonBadgeSpan)
        Elements.gameSettingsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_GAME_SETTINGS)
    }
    Elements.settingsButton().addEventListener('click', () => {
        localStorage.setItem(PluginConfigKeys.settingsButtonBadgeSpan, pluginConfig.settingsButtonBadgeSpan)
        Elements.settingsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_SETTINGS)
    })
    Elements.statsButton().onclick = function() {
        const value = pluginRestorationHandler(Elements.statsButton())
        if(value) {
            return true
        }
        localStorage.setItem(PluginConfigKeys.statsButtonBadgeSpan, pluginConfig.statsButtonBadgeSpan)
        Elements.statsButtonBadgeSpan().style.display = 'none'
        ipcRenderer.send(Channel.OPEN_STATS)
    }
    ///
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
        saveFavouriteLink()
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

    document.body.onclick = function(e) {
        const target = e.target as HTMLElement
        if(target.offsetParent != Elements.hideContextMenuDiv() && target.offsetParent != Elements.restoreContextMenuDiv()) {
            currentContextMenuTarget = null
            hideContextMenu()
        }
    }
})

function pluginRestorationHandler(plugin: HTMLButtonElement) {
    const hiddenPluginIds = JSON.parse(localStorage.hiddenPlugins ?? '[]') as string[]
    if(plugin.getAttribute('hiddenPlugin') == 'true') {
        hiddenPluginIds.removeItem(plugin.id)
        localStorage.hiddenPlugins = JSON.stringify(hiddenPluginIds)
        plugin.removeAttribute('hiddenPlugin')
        plugin.style.display = ''
        plugin.style.border = ''
        if(hiddenPluginIds.length == 0) {
            restoreContextMenuOpened = false
        }
        return true
    }
    return false
}

async function isCurrentLinkFavourite(): Promise<boolean> {
    const urlString = (await ipcRenderer.invoke(Channel.GET_URL)) as string
    if(urlString.length == 0) {
        return false
    }
    const url = new URL(urlString).href
    return FavouriteLinkService.isFavouriteLink(url)
}

async function saveFavouriteLink() {
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

async function setupBadges(): Promise<PluginConfig> {
    const pluginConfig = (await fetch('https://raw.githubusercontent.com/alhafram/DwariumData/main/PluginHashes.json').then((data) => data.json())) as PluginConfig
    const keys = Object.keys(pluginConfig)
    for(const key of keys) {
        const element = eval(`Elements_1.Elements.${key}()`) as HTMLElement
        const value = localStorage.getItem(key)
        if(value == Object(pluginConfig)[key]) {
            element.style.display = 'none'
        }
    }
    return pluginConfig
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

ipcRenderer.on(Channel.EXPIRING_ITEMS_FOUND, (event, found: boolean) => {
    if(found) {
        sendNotification(null, NotificationType.EXPIRING_ITEMS)
    }
    Elements.expiringItemsSettingsSvg().style.fill = found ? '#FF0000' : ''
})

function getElementIdBy(type: WindowType): HTMLElement | undefined {
    switch (type) {
        case WindowType.FOOD:
            return Elements.foodButton()
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

const channels = [
    Channel.OPEN_FOOD,
    Channel.OPEN_NOTES,
    Channel.OPEN_DRESSING_ROOM,
    Channel.OPEN_BELT_POTION_ROOM,
    Channel.OPEN_CHAT_LOG,
    Channel.OPEN_CHAT_SETTINGS,
    Channel.OPEN_NOTIFICATIONS,
    Channel.OPEN_EFFECT_SETS,
    Channel.OPEN_EXPIRING_ITEMS_SETTINGS,
    Channel.MAKE_SCREENSHOT,
    Channel.OPEN_SETTINGS
]
channels.forEach((channel) => {
    ipcRenderer.on(channel, () => {
        ipcRenderer.send(channel)
    })
})

function setupContextMenuForHidePlugins(scope: HTMLElement, contextMenu: HTMLElement) {
    const normalizePozition = (mouseX: number, mouseY: number) => {
        let { left: scopeOffsetX, top: scopeOffsetY } = scope.getBoundingClientRect()

        scopeOffsetX = scopeOffsetX < 0 ? 0 : scopeOffsetX
        scopeOffsetY = scopeOffsetY < 0 ? 0 : scopeOffsetY

        const scopeX = mouseX - scopeOffsetX
        const scopeY = mouseY - scopeOffsetY
        const outOfBoundsOnX = scopeX + contextMenu.clientWidth > scope.clientWidth

        const outOfBoundsOnY = scopeY + contextMenu.clientHeight > scope.clientHeight

        let normalizedX = mouseX
        let normalizedY = mouseY

        if(outOfBoundsOnX) {
            normalizedX = scopeOffsetX + scope.clientWidth - contextMenu.clientWidth
        }

        if(outOfBoundsOnY) {
            normalizedY = scopeOffsetY + scope.clientHeight
        }

        return { normalizedX, normalizedY }
    }

    scope.addEventListener('contextmenu', (event) => {
        if(contextMenu == Elements.restoreContextMenuDiv()) {
            const hiddenPluginIds = JSON.parse(localStorage.hiddenPlugins ?? '[]') as string[]
            if(hiddenPluginIds.length == 0) {
                hideContextMenu()
                return
            }
            Elements.restorePluginsDiv().textContent = restoreContextMenuOpened ? 'Скрыть' : 'Восстановить'
        }
        if(scope.getAttribute('hiddenPlugin') == 'true') {
            return
        }
        currentContextMenuTarget = scope
        event.preventDefault()
        const { clientX: mouseX, clientY: mouseY } = event
        const { normalizedX, normalizedY } = normalizePozition(mouseX, mouseY)
        hideContextMenu()
        contextMenu.style.top = `${normalizedY}px`
        contextMenu.style.left = `${normalizedX}px`

        setTimeout(() => {
            contextMenu.classList.add('visible')
        })
    })
}

function hideContextMenu() {
    Elements.hideContextMenuDiv().classList.remove('visible')
    Elements.restoreContextMenuDiv().classList.remove('visible')
}
