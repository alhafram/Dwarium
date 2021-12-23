class ItemsManager {

    parsingItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers', 'rings', 'amulets', 'arcats']
    armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver', 'ring1', 'ring2', 'amulet1', 'amulet2']

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
            document.getElementById(t + 'Box').addEventListener('click', () => {
                if(document.getElementById(t + 'Box').childElementCount == 1) {
                    return
                }
                if(document.getElementById(t + 'Box').style.border == '' && document.getElementById(t + 'Box').childElementCount == 0) {
                    if(state.armorTypeSelected != null) {
                        filterWithResettingArmorType()
                    }
                    document.getElementById(t + 'Box').style.border = '3px dotted #666'
                    if(t.includes('ring') || t.includes('amulet') || t.includes('arcat')) {
                        state.armorTypeSlotSelected = t.slice(t.length - 1, t.length)
                        t = t.slice(0, t.length - 1)
                    }
                    state.armorTypeSelected = t
                    filterCurrentItems()
                    if(state.armorTypeSlotSelected) {
                        t = t + state.armorTypeSlotSelected
                    }
                } else {
                    filterWithResettingArmorType()
                }
            })
        })
    }

    convertItemIntoDiv(items) {
        return items.map(item => {
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = 'true'
            divItem.setAttribute('equiped', 'false')
            divItem.style = `background-image: url('${window.myAPI.baseUrl()}/${item.image}');background-repeat: no-repeat;background-size: cover;`
            divItem.setAttribute('type', this.getType(item.kind_id))
            divItem.setAttribute('quality', item.quality)
            divItem.setAttribute('itemId', item.id)
            divItem.setAttribute('trend', item.trend ?? "Универсал")
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
        if(kind_id == '76' || kind_id == '18') {
            return 'ring'
        }
        if(kind_id == '25') {
            return 'amulet'
        }
        if(kind_id == '161') {
            return 'arcat'
        }
        return 'other'
    }

    createArcatSlot(id) {
        let parent = document.querySelector('#arcats')
        let arcatElement = document.createElement('div')
        let slotElement = document.createElement('div')
        slotElement.setAttribute('type', 'arcat')
        slotElement.id = `arcat${id + 1}Box`
        slotElement.className = 'boxStatic small'
        arcatElement.appendChild(slotElement)
        parent.appendChild(arcatElement)
    }

    putOffItem(element) {
        let item = element.firstElementChild
        if(item) {
            element.style.visibility = 'visible'
            item.setAttribute('equiped', false)
            if(item.getAttribute('type') == 'ring' || item.getAttribute('type') == 'amulet' || item.getAttribute('type') == 'arcat') {
                let number = item.parentElement.id.slice(item.getAttribute('type').length, item.getAttribute('type').length + 1)
                state[item.getAttribute('type') + number].item = null
            } else {
                state[item.getAttribute('type')].item = null
            }
            if(item.getAttribute('copy')) {
                element.removeChild(item)
            } else {
                if(item.getAttribute('type')) {
                    item.style.width = '70px'
                    item.style.height = '70px'
                }
                document.querySelector('.currentItems').appendChild(item)
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
        let type = item.getAttribute('type')
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
            if(item.getAttribute('type') == 'ring' || item.getAttribute('type') == 'amulet') {
                type = item.getAttribute('type') + 1
                if(document.querySelector(`#${type}Box`).childElementCount == 1) {
                    type = item.getAttribute('type') + 2
                }
                let itemBox = document.querySelector(`#${type}Box`)
                this.putOffItem(itemBox)
                item.style.height = '25px';
                item.style.width = '25px';
            } else if(item.getAttribute('type') == 'arcat') {
                const defType = type
                for(var i = 1; i <= state.arcatsCount; i++) {
                    type = defType + i
                    if(document.querySelector(`#${type}Box`).childElementCount == 1) {
                        continue
                    } else {
                        break
                    }
                }
                let itemBox = document.querySelector(`#${type}Box`)
                this.putOffItem(itemBox)
                item.style.height = '25px';
                item.style.width = '25px';
            } else {
                let itemBox = document.querySelector(`#${type}Box`)
                this.putOffItem(itemBox)
            }
        }
        state[type].item = item
        if(item.parentElement?.childElementCount == 1) {
            let par = item.parentElement
            par.style.visibility = 'visible'
        }
        state[type].box.appendChild(item)
        state[type].box.style.visibility = 'hidden'
        state[type].box.firstElementChild.style.visibility = 'visible'
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
