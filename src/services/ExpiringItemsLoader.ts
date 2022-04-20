import { ipcRenderer } from 'electron'
import { Channel } from '../Models/Channel'
import { InventoryItem } from '../Models/InventoryItem'
import UserConfigService from './UserConfigService'

export type ExpiringItemsContainer = {
    altItems: any
    allItems: InventoryItem[]
}

async function loadExpiringItems(): Promise<ExpiringItemsContainer> {
    const res = (await ipcRenderer.invoke('LoadSetItems', ['allPotions', 'allItems', 'otherItems', 'questItems', 'elementsItems', 'bankItems'])) as Record<string, any>
    const items = Object.values(res)
        .map((item) => Object.values(item))
        .flat() as InventoryItem[]
    const altItems = Object.assign({}, res.allPotions, res.allItems, res.otherItems, res.questItems, res.elementsItems, res.bankItems)
    const expiringItems = items.filter((item) => item.time_expire != '0' && item.storage_type != '2')
    return {
        allItems: expiringItems,
        altItems
    }
}

let checkingItemsInverval: NodeJS.Timeout
async function setupCheckingItemsService() {
    clearInterval(checkingItemsInverval)
    await handleExpiringItems()
    checkingItemsInverval = setInterval(async() => {
        console.log('start')
        await handleExpiringItems()
        console.log('end')
    }, 1000 * 20)
}

async function handleExpiringItems() {
    const result = await loadExpiringItems()
    const number = (await ipcRenderer.invoke(Channel.GET_ID)) as number | undefined
    if(number) {
        const config = UserConfigService.get(number)
        // 5 days burning items
        const burnItems = result.allItems.filter((item) => item.time_expire! < '432000' && config.expiringItemIds.includes(item.id))
        console.log(burnItems, config.expiringItemIds)
        ipcRenderer.send(Channel.EXPIRING_ITEMS_FOUND, burnItems.length != 0)
    }
}

export { loadExpiringItems, setupCheckingItemsService }
