let potionsManager = null
let beltSetsManager = null
let state = null

document.addEventListener('DOMContentLoaded', async () => {
    potionsManager = new PotionsManager()
    beltSetsManager = new BeltSetsManager()

    await loadAllItems()

    let slots = await potionsManager.getSlots()
    slots = slots.result

    setupFilters()
    renderSlots(slots[0], slots[1])
    beltSetsManager.setup()

    potionsManager.setupWearedItems()

    state = {
        currentElement: null,
        isOn(itemType) {
            return this[itemType].item != null
        },
        getEquipedItems() {
            let items = Array.from(document.querySelectorAll('.potion')).filter(a => a.firstElementChild != null)
            return items
        }
    }
})

async function loadAllItems() {
    let items = await window.myAPI.loadItemsData(['allPotions'])
    art_alt = items.allPotions
    potionsManager.setupAllItems(items)
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
