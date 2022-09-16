import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import ConfigService from '../../Services/ConfigService'
import { ShopLoaderWindowActions } from './Actions'
import { Elements } from './Elements'
import { EnergyItem, ShopLoaderState } from './preload'

export default async function reduce(state: ShopLoaderState, action: ShopLoaderWindowActions, data: any): Promise<ShopLoaderState> {
    switch (action) {
        case ShopLoaderWindowActions.LOAD_CONTENT: {
            let items: EnergyItem[] = []
            items = items.concat(await loadPage(0))
            if(items.length == 0) {
                alert('Кажется вы находитесь не в поместье!')
                return state
            }
            items = items.concat(await loadPage(1))
            items = items.flat()
            items = items.sort((a, b) => (a.color < b.color ? -1 : 1))
            return {
                ...state,
                energyItems: items
            }
        }
        case ShopLoaderWindowActions.BUY: {
            const energyItem = data as EnergyItem
            Elements.purchaseButtons().forEach((element) => (element.disabled = true))
            await drink()
            await buy(energyItem)
            Elements.purchaseButtons().forEach((element) => (element.disabled = false))
            return state
        }
    }
}

async function fetchEnergyItems(page: number) {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=${page}', {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function loadPage(page: number): Promise<EnergyItem[]> {
    const text = await fetchEnergyItems(page)
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')

    const itemsDoc = doc.querySelector(
        'body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td.bgg > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td'
    )?.children
    if(!itemsDoc) {
        return []
    }
    const pageItems = Array.prototype.slice.call(itemsDoc)
    const items = pageItems.map((item) => {
        const form = item.querySelector('#item_list > tbody > tr > td:nth-child(1) > div > table > tbody > tr > td')
        const item_name = item.querySelector('#item_list > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(1) > td > a')
        let item_energy = ''
        if(item.querySelector('#item_list > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td.b.red > span > span')) {
            item_energy = item_energy = item.querySelector('#item_list > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td.b.red > span > span').textContent.trim()
        } else if(item.querySelector('#item_list > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td.b.grnn > span > span')) {
            item_energy = item.querySelector('#item_list > tbody > tr > td:nth-child(2) > table > tbody > tr:nth-child(4) > td.b.grnn > span > span').textContent.trim()
        }
        if(item_energy == '') {
            return null
        }
        return {
            id: form.attributes.div_id.value,
            title: item_name.attributes.title.value,
            color: item_name.style.color,
            energy: parseInt(item_energy)
        }
    })
    return items.filter((item) => item != null).map((item) => item as EnergyItem)
}

class EnergyPotion {
    name
    value
    constructor(name: string, value: number) {
        (this.name = name), (this.value = value)
    }
}

async function fetchEnergyPotions() {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/user_iframe.php?group=1', {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/user.php?mode=personage&submode=backpack',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function getEnergyMax() {
    const req = 'top[0].canvas.app.avatar.model.energyMax'
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function getEnergy() {
    const req = 'top[0].canvas.app.avatar.model.energy'
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function drink() {
    const energyPotions = [
        new EnergyPotion('Малый энергетический настой', 20),
        new EnergyPotion('Энергетический настой', 40),
        new EnergyPotion('Большой энергетический настой', 60),
        new EnergyPotion('Великий энергетический настой', 80),
        new EnergyPotion('Абсолютный энергетический настой', 100)
    ]
    const text = await fetchEnergyPotions()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, 'text/html')
    const items = Array.prototype.slice.call(doc.getElementsByTagName('li')).map(function(elem) {
        return {
            id: elem.dataset.id,
            title: elem.dataset.title
        }
    })
    const energyMax = await getEnergyMax()
    const energy = await getEnergy()
    let energyDiff = energyMax - energy
    while(energyDiff > 20) {
        const maxPotion = energyPotions.sort((obj1, obj2) => (obj1.value < obj2.value ? 1 : -1))[0]
        if(!maxPotion) {
            return
        }
        const potionNeedToUse = parseInt((energyDiff / maxPotion.value).toString())
        const filteredItem = items.filter((item) => item.title == maxPotion.name)[0]
        if(filteredItem) {
            for(let i = 0; i < potionNeedToUse; i++) {
                await instapocketUseRequest(filteredItem.id)
            }
        }
        const energyMax = await getEnergyMax()
        const energy = await getEnergy()
        energyDiff = energyMax - energy
        energyPotions.splice(energyPotions.indexOf(maxPotion), 1)
    }
}

function instapocketUseRequest(id: string) {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/action_form.php?${Math.random()}&in[param_success][url_close]=1&artifact_id=${id}&in[external]=1&in[noconfirm]=1', {
        'headers': {
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/main_frame.php',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function addToCardRequest(body: string) {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=0&action=add_cart', {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': '${body}',
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function buy(energyItem: EnergyItem) {
    await cleanCard()
    const energyCost = energyItem.energy
    const energy = (await getEnergy()) as number
    const count = parseInt((energy / energyCost).toString())
    if(count == 0) {
        return
    }

    const body = `form%5Bitem_id%5D=${energyItem.id}&form%5Bamount%5D=${count}`
    const text = await addToCardRequest(body)
    const doc = text.toDocument()

    const recalculate = doc.querySelector('#action_form > table.coll.w100.p10h.p4v.brd2 > tbody > tr > td:nth-child(3) > div > div > input').name + '=' + count
    await buyRequest(recalculate)
}

async function buyRequest(body: string) {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=0&action=go', {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB',
            'cache-control': 'max-age=0',
            'content-type': 'application/x-www-form-urlencoded',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=0&action=add_cart',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': '${body}',
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function cleanCard() {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=0&action=clear_cart', {
        'headers': {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-GB',
            'sec-fetch-dest': 'iframe',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/area_store.php?&mode=store&category_id=180&page=0&action=add_cart',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}
