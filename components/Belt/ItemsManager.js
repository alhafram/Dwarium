class ItemsManager {

    putOnItem(item, box, fake) {
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
