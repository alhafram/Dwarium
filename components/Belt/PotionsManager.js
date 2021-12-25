class PotionsManager {

    setupAllItems(items) {
        let potions = Object.keys(items.allPotions).map(key => items.allPotions[key]).filter(item => item.type_id == 7 && item.kind_id != 65)
        let divs = this.convertItemIntoDiv(potions)

        divs.flatMap(i => i).forEach(item => {
            let parent = document.querySelector('.currentItems')
            parent.appendChild(item)
        })
    }

    convertItemIntoDiv(items) {
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

    putOnItem(item, box) {
        let potionBoxes = Array.from(document.querySelectorAll('.potion'))
        let currentBox = box ?? potionBoxes.find(b => b.childElementCount == 0)
        if(!currentBox) {
            return
        }
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

    async updateSlot(num, type) {
        let req = `top[0].canvas.app.leftMenu.model.${type}[${num}] = null; top[0].canvas.app.leftMenu.model.main.view.update();`
        let res = await window.myAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async getSlots() {
        let req = '[top[0].canvas.app.leftMenu.model.slotsCount, top[0].canvas.app.leftMenu.model.variantSlotsCount]'
        let res = await window.myAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async getCurrentPotions() {
        let req = '[top[0].canvas.app.leftMenu.model.items, top[0].canvas.app.leftMenu.model.variantItems]'
        let res = await window.myAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    // async setupWearedItems() {
    //     let [pots, variantPots] = await Promise.all([getCurrentPotions(), getCurrentVariantPotions()])
    //     let currentEquipedPotions = pots.result.filter(a => a)
    //     currentEquipedPotions = currentEquipedPotions.concat(variantPots.result.filter(a => a))
    //     for(let potion of currentEquipedPotions) {
    //         let divItem = document.createElement('div')
    //         divItem.className = 'box'
    //         divItem.draggable = 'true'
    //         divItem.style = `background-image: url('${window.myAPI.baseUrl()}/${obj.image}');background-repeat: no-repeat;background-size: cover;`
    //         divItem.setAttribute('itemId', potion.id)
    //         setupEquipableItemEvents(divItem)
    //         let potBox = Array.from(document.querySelectorAll('.potion')).filter(pot => pot.getAttribute('num') == potion.slot).filter(pot => {
    //             return potion.variant ? pot.getAttribute('variant') : pot.getAttribute('variant') == null
    //         })[0]
    //         itemsManager.putOnItem(divItem, potBox, true)
    //     }
    // }
}
