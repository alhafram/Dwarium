document.addEventListener('DOMContentLoaded', async () => {
    let [slots, variantSlots] = await Promise.all([getSlots(), getVariantSlots()])
    let items = await window.myAPI.loadItemsData(['allPotions'])
    
    let potions = Object.keys(items.allPotions).map(key => items.allPotions[key]).filter(item => item.type_id == 7 && item.kind_id != 65)
    let divs = convertItemIntoDiv(potions)
    
    divs.flatMap(i => i).forEach(item => {
        let parent = document.querySelector('.currentItems')
        parent.appendChild(item)
    })

    renderSlots(slots.result, variantSlots.result)
})

function convertItemIntoDiv(items) {
    return items.map(item => {
        let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = 'true'
        divItem.style = `background-image: url('${window.myAPI.baseUrl()}/${item.image}');background-repeat: no-repeat;background-size: cover;`
        divItem.setAttribute('quality', item.quality)
        divItem.setAttribute('itemId', item.id)
        return divItem
    })
}

function renderSlots(slotsCount, variantSlots) {
    for(let i = 0; i < slotsCount; i++) {
        let divBox = document.createElement('div')
        divBox.style.display = 'flex'
        let divPotion = document.createElement('div')
        divPotion.className = 'potion'
        divBox.appendChild(divPotion)
        for(var j = 0; j < 2; j++) {
            if(variantSlots > 0) {
                let divPotion = document.createElement('div')
                divPotion.className = 'potion'
                divBox.appendChild(divPotion)
                variantSlots--
            } else {
                break
            }  
        }
        let parent = document.querySelector('.equippedItems')
        parent.appendChild(divBox)
    }
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
