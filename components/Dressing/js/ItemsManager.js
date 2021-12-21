class ItemsManager {

    parsingItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers']
    armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver']

    setupWearedItems(wearedItems) {
        let arr = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(wearedItems[type]))
        }
        setManager.equipedCurrentItemIds = arr.map(i => i.getAttribute('itemid'))

        arr.forEach(function(item) {
            setupEquipableItemEvents(item)
        })
        let self = this
        arr.forEach(item => {
            state.currentElement = item
            self.putOnItem(item)
            state.currentElement = null
        })
        let loadedSet = setManager.sets.filter(set => difference(setManager.equipedCurrentItemIds, set.ids).size == 0 && difference(set.ids, setManager.equipedCurrentItemIds).size == 0).first()
        if(loadedSet) {
            setManager.currentSet = loadedSet
            let article = setManager.setsBox.children.toArray().filter(box => box.id == loadedSet.id).first()
            article.click()
        }
    }

    setupAllItems(allItems) {
        let arr = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(allItems[type]))
        }
        arr.flatMap(i => i).forEach(item => {
            let parent = document.querySelector('.currentItems')
            parent.appendChild(item)
        })

        let items = document.querySelectorAll('.currentItems .box')
        items.forEach(function(item) {
            setupEquipableItemEvents(item)
        })

        let equip_items = document.querySelectorAll('.equippedItems .boxStatic')
        equip_items.forEach(function(item) {
            item.addEventListener('dragover', handleDragOver, false)
            item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
        })

        let all_items = document.querySelectorAll('.currentItems')
        all_items.forEach(function(item) {
            item.addEventListener('drop', handleDropEquipableItemIntoAllItems, false)
            item.addEventListener('dragover', handleDragOver, false)
        })

        this.armorTypes.forEach(t => {
            document.getElementById(t + 'Box').addEventListener('click', (e) => {
                if(document.getElementById(t + 'Box').childElementCount == 1) {
                    return
                }
                if(document.getElementById(t + 'Box').style.border == '' && document.getElementById(t + 'Box').childElementCount == 0) {
                    if(state.armorTypeSelected != null) {
                        filterWithResettingArmorType()
                    }
                    state.armorTypeSelected = t
                    document.getElementById(t + 'Box').style.border = '3px dotted #666'
                    filterCurrentItems()
                } else {
                    filterWithResettingArmorType()
                }
            })
        })
    }

    convertItemIntoDiv(items) {
        return items.map(item => {
            let parent = document.querySelector('.currentItems')
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = 'true'
            divItem.setAttribute('equiped', 'false')
            divItem.style = `background-image: url('http://${window.myAPI.server()}.dwar.ru/${item.image}');background-repeat: no-repeat;background-size: cover;`
            divItem.setAttribute('type', this.getType(item.kind_id))
            divItem.setAttribute('quality', item.quality)
            divItem.setAttribute('itemId', item.id)
            divItem.setAttribute('trend', item.trend)
            if(item.kind_id == 12) {
                divItem.setAttribute('weapon', '2h')
            }
            if(item.kind_id == 10) {
                divItem.setAttribute('weapon', '1h')
            }
            if(item.kind_id == 44 || item.kind_id == 17) {
                divItem.setAttribute('weapon', 'off')
            }
            return divItem
        })
    }

    getType(kind_id) {
        if(kind_id == 1) {
            return 'helmet'
        }
        if(kind_id == 7) {
            return 'shoulders'
        }
        if(kind_id == '5' || kind_id == '77' || kind_id == '120') {
            return 'bracers'
        }
        if(kind_id == '10' || kind_id == '12') {
            return 'mainWeapon'
        }
        if(kind_id == '44' || kind_id == '17') {
            return 'offhandWeapon'
        }
        if(kind_id == '20' || kind_id == '3') {
            return 'cuirass'
        }
        if(kind_id == '6') {
            return 'leggings'
        }
        if(kind_id == '21' || kind_id == '4') {
            return 'chainmail'
        }
        if(kind_id == '2') {
            return 'boots'
        }
        if(kind_id == '131') {
            return 'quiver'
        }
        if(kind_id == '116') {
            return 'bow'
        }
        return 'other'
    }

    createArcatSlot() {
        let parent = document.querySelector('#arcats')
        let arcatElement = document.createElement('div')
        arcatElement.id = 'arcat'
        let slotElement = document.createElement('div')
        slotElement.type = 'arcat'
        slotElement.id = 'arcatBox'
        slotElement.className = 'boxStatic small'
        arcatElement.appendChild(slotElement)
        parent.appendChild(arcatElement)
    }

    putOffItem(element) {
        if(element.childElementCount > 0) {
            let item = element.children[0]
            element.style.visibility = 'visible'
            item.setAttribute('equiped', false)
            state[item.getAttribute('type')].item = null
            if(item.getAttribute('copy')) {
                element.removeChild(item)
            } else {
                document.querySelectorAll('.currentItems')[0].appendChild(item)
            }
            let equipedStyles = state.getEquipedItems().map(i => i.getAttribute('trend'))
            let uniqueStyles = new Set(equipedStyles)
            if(equipedStyles.size == 0 || uniqueStyles.size == 0 || uniqueStyles.size == 1 && uniqueStyles.has('Универсал')) {
                state.currentStyle = null
                filterCurrentItems()
            }
        }
    }

    putOnItem(item) {
        if(item.getAttribute('trend') != 'Универсал') {
            state.currentStyle = item.getAttribute('trend')
        }
        if(state.currentElement.getAttribute('weapon') && !item.getAttribute('copy')) {
            if(state.currentElement.getAttribute('weapon') == '2h') {
                this.putOffWeapon(state.currentElement)
                let mainWeaponCopy = state.currentElement.cloneNode(true)
                mainWeaponCopy.setAttribute('type', 'offhandWeapon')
                mainWeaponCopy.setAttribute('copy', true)
                mainWeaponCopy.style.opacity = '0.4'
                setupEquipableItemEvents(mainWeaponCopy)
                this.putOnItem(mainWeaponCopy)
            } else {
                this.putOffWeapon(state.currentElement)
            }
        } else {
            let itemBox = document.querySelector(`#${state.currentElement.getAttribute('type')}Box`)
            this.putOffItem(itemBox)
        }
        state[item.getAttribute('type')].item = item
        state[item.getAttribute('type')].box.appendChild(item)
        state[item.getAttribute('type')].box.style.visibility = 'hidden'
        state[item.getAttribute('type')].box.children[0].style.visibility = 'visible'
        item.setAttribute('equiped', true)
        filterWithResettingArmorType()
        filterCurrentItems()
    }

    putOffWeapon(item) {
        if(item.getAttribute('weapon') == '2h') {
            this.putOffItem(state.offhandWeapon.box)
            this.putOffItem(state.mainWeapon.box)
        }
        if(item.getAttribute('weapon') == '1h') {
            if(state.mainWeapon.item) {
                if(state.mainWeapon.item.getAttribute('weapon') == '2h') {
                    this.putOffWeapon(state.mainWeapon.item)
                } else {
                    this.putOffItem(state.mainWeapon.box)
                }
            }
        }
        if(item.getAttribute('weapon') == 'off') {
            if(state.offhandWeapon.item) {
                if(state.offhandWeapon.item.getAttribute('weapon') == '2h') {
                    this.putOffWeapon(state.offhandWeapon.item)
                } else {
                    this.putOffItem(state.offhandWeapon.box)
                }
            }
        }
    }
}
