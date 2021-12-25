let state = null
let itemsManager = null

document.addEventListener('DOMContentLoaded', async () => {
    itemsManager = new ItemsManager()
    let items = await window.myAPI.loadItemsData(['allPotions'])
    let [slots, variantSlots] = await Promise.all([getSlots(), getVariantSlots()])

    let potions = Object.keys(items.allPotions).map(key => items.allPotions[key]).filter(item => item.type_id == 7 && item.kind_id != 65)
    let divs = convertItemIntoDiv(potions)

    divs.flatMap(i => i).forEach(item => {
        let parent = document.querySelector('.currentItems')
        parent.appendChild(item)
    })

    art_alt = items.allPotions

    setupState()
    setupFilters()
    renderSlots(slots.result, variantSlots.result)

    setupListeners()
})

function setupListeners() {
    document.querySelector('#unequip').addEventListener('click', () => {
        let equipedPotions = Array.from(document.querySelectorAll('.potion')).filter(a => a.firstElementChild != null)
        equipedPotions.forEach(p => itemsManager.putOffItem(p))
    })
    document.querySelector('#equip').addEventListener('click', async () => {
        console.log("START", new Date())
        while(true) {
            let [pots, variantPots] = await Promise.all([getCurrentPotions(), getCurrentVariantPotions()])
            let currentEquipedPotions = pots.result.filter(a => a)
            currentEquipedPotions = currentEquipedPotions.concat(variantPots.result.filter(a => a))
            if(currentEquipedPotions.length == 0) {
                break
            } else {
                let potion = currentEquipedPotions[0]
                await unequip(potion.id)
                await updateSlot(potion.slot, potion.variant ? 'variantItems' : 'items')
            }
        }
        console.log("DONE UNEQUIP", new Date())
        let potBoxes = Array.from(document.querySelectorAll('.potion')).filter(a => a.firstElementChild != null)
        for(let potion of potBoxes) {
            await equipRequest(potion)
            }
            console.log("DONE", new Date())
    })
    document.querySelector('#save').addEventListener('click', () => {
        console.log('SAVE')
    })
}

function setupState() {
    state = {
        currentElement: null,
        isOn(itemType) {
            return this[itemType].item != null
        },
        getEquipedItems() {
            let items = Object.keys(state).map(key => state[key]).filter(obj => obj != null && Object.keys(obj) != 0)
            return items.map(i => i.item).filter(i => i != null)
        },
        currentStyle: null,
        armorTypeSelected: null,
        armorTypeSlotSelected: null,
        currentMagicSchool: null,
        zikkuratId: null,
        arcatsCount: 0
    }
}

function convertItemIntoDiv(items) {
    return items.map(item => {
        let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = 'true'
        divItem.style = `background-image: url('${window.myAPI.baseUrl()}/${item.image}');background-repeat: no-repeat;background-size: cover;`
        divItem.setAttribute('quality', item.quality)
        divItem.setAttribute('itemId', item.id)
        setupEquipableItemEvents(divItem)
        return divItem
    })
}

function renderSlots(slotsCount, variantSlots) {
    var currentVariantSlot = 1
    for(let i = 0; i < slotsCount; i++) {
        let divBox = document.createElement('div')
        divBox.style.display = 'flex'
        let divPotion = document.createElement('div')
        divPotion.setAttribute('num', i + 1)
        divPotion.className = 'potion'
        setupPotionListeners(divPotion)
        divBox.appendChild(divPotion)
        for(var j = 0; j < 2; j++) {
            if(currentVariantSlot <= variantSlots) {
                let divPotion = document.createElement('div')
                divPotion.setAttribute('variant', true)
                divPotion.className = 'potion'
                divPotion.setAttribute('num', currentVariantSlot)
                setupPotionListeners(divPotion)
                divBox.appendChild(divPotion)
                currentVariantSlot += 1
            } else {
                break
            }
        }
        let parent = document.querySelector('.equippedItems')
        parent.appendChild(divBox)
    }
}

function setupPotionListeners(item) {
    item.addEventListener('dragover', handleDragOver, false)
    item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
}

async function updateSlot(num, type) {
    let req = `top[0].canvas.app.leftMenu.model.${type}[${num}] = null; top[0].canvas.app.leftMenu.model.main.view.update();`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getSlots() {
    let req = 'top[0].canvas.app.leftMenu.model.slotsCount'
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getVariantSlots() {
    let req = 'top[0].canvas.app.leftMenu.model.variantSlotsCount'
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getCurrentPotionsAlt() {
    let req = 'top[0].art_alt'
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getCurrentPotions() {
    let req = 'top[0].canvas.app.leftMenu.model.items'
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getCurrentVariantPotions() {
    let req = 'top[0].canvas.app.leftMenu.model.variantItems'
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function unequip(id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random());
    let req = `
    fetch('${window.myAPI.baseUrl()}/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&ajax=1&_=${rnd_url}', {
        'headers': {
            'accept': '*/*',
            'accept-language': 'en-GB',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin'
        },
        'referrer': '${window.myAPI.baseUrl()}/user_iframe.php?group=1',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
        });`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function equipRequest(box) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random());
    let id = box.firstElementChild.getAttribute('itemid')
    let slotNum = box.getAttribute('num')
    let variantNum = box.getAttribute('variant') ?? 0
    let req = `fetch('${window.myAPI.baseUrl()}/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&in[slot_num]=${slotNum}&in[variant_effect]=${variantNum}&ajax=1&_=${rnd_url}', {
        'headers': {
            'accept': '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
        },
        'referrer': '${window.myAPI.baseUrl()}/user_iframe.php?group=1',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': null,
        'method': 'GET',
        'mode': 'cors',
        'credentials': 'include'
        })`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function fetchItem(id) {
    let req = `fetch('${window.myAPI.baseUrl()}/artifact_info.php?artifact_id=${id}').then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}