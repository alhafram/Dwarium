let state = null
let itemsManager = null

document.addEventListener('DOMContentLoaded', async () => {
    itemsManager = new ItemsManager()
    let [slots, variantSlots] = await Promise.all([getSlots(), getVariantSlots()])
    let items = await window.myAPI.loadItemsData(['allPotions'])

    art_alt = items.allPotions

    let potions = Object.keys(items.allPotions).map(key => items.allPotions[key]).filter(item => item.type_id == 7 && item.kind_id != 65)
    let divs = convertItemIntoDiv(potions)

    divs.flatMap(i => i).forEach(item => {
        let parent = document.querySelector('.currentItems')
        parent.appendChild(item)
    })
    setupState()
    setupFilters()
    renderSlots(slots.result, variantSlots.result)
})

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
                divPotion.setAttribute('variant', currentVariantSlot)
                divPotion.className = 'potion'
                divPotion.setAttribute('num', i + 1)
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

class ItemsManager {
    putOnItem(item, box) {
        let potionBoxes = Array.from(document.querySelectorAll('.potion'))
        let currentBox = box ?? potionBoxes.find(b => b.childElementCount == 0)
        let itemCopy = item.cloneNode(true)
        itemCopy.setAttribute('equiped', true)
        setupEquipableItemEvents(itemCopy)
        currentBox.appendChild(itemCopy)
        itemCopy.style.borderRadius = '25px'
        itemCopy.style.opacity = 1
        currentBox.style.border = 'none'
        currentBox.style.visibility = 'hidden'
        itemCopy.style.visibility = 'visible'
    }

    putOffItem(box) {
        box.style.visibility = 'visible'
        box.removeChild(box.firstElementChild)
        box.style.border = 'black 1px dotted'
    }
}
