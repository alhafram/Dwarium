class PotionsManager {

    setupAllItems(items) {
        let currentItems = document.querySelector('.currentItems').children.toArray()
        for(let item of currentItems) {
            item.parentElement.removeChild(item)
        }
        let potions = Object.values(items.allPotions).filter(item => item.type_id == 7 && item.kind_id != 65)
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
            let span = document.createElement('div')
            span.textContent = item.cnt
            span.className = 'bpdig'
            divItem.appendChild(span)
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
        if(itemCopy.firstElementChild) {
            itemCopy.removeChild(itemCopy.firstElementChild)
        }
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

    async getCurrentPotionsAlt() {
        let req = 'top[0].art_alt'
        let res = await window.myAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
        
    }

    async setupWearedItems() {
        let pots = await this.getCurrentPotions()
        let currentEquipedPotions = pots.result.flat().filter(a => a)
        let currentPotionsAlt = await this.getCurrentPotionsAlt()
        _top().items_alt = currentPotionsAlt.result
        
        for(let potion of currentEquipedPotions) {
            let potionAlt = _top().items_alt[`AA_${potion.id}`]
            let id = Object.values(art_alt).find(o => o.title == potionAlt.title)?.id ?? potionAlt.id
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = 'true'
            divItem.style = `background-image: url('${window.myAPI.baseUrl()}/${potionAlt.image}');background-repeat: no-repeat;background-size: cover;`
            divItem.setAttribute('itemid', id)
            setupEquipableItemEvents(divItem)
            let potBox = Array.from(document.querySelectorAll('.potion')).filter(pot => pot.getAttribute('num') == potion.slot).filter(pot => {
                return potion.variant ? pot.getAttribute('variant') : pot.getAttribute('variant') == null
            })[0]
            potionsManager.putOnItem(divItem, potBox, true)
        }
    }
}
