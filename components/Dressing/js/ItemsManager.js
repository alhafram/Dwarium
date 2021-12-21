class ItemsManager {

    parsingItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers']

    setupWearedItems(wearedItems) {
        let arr = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(wearedItems[type]))
        }
        setManager.equipedCurrentItemIds = arr.map(i => i.attributes.itemid.value)

        arr.forEach(function(item) {
            setupEquipableItemEvents(item)
        })
        let self = this
        arr.forEach(item => {
            state.currentElement = item
            self.putOnItem(item, true)
            state.currentElement = null
        })
    }

    setupAllItems(allItems) {
        let arr = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(allItems[type]))
        }
        arr.flatMap(i => i).forEach(item => {
            let parent = document.querySelector('.current_items')
            parent.appendChild(item)
        })

        let items = document.querySelectorAll(".current_items .box")
        items.forEach(function(item) {
            setupEquipableItemEvents(item)
        })

        let equip_items = document.querySelectorAll(".equipped_items .box_static")
        equip_items.forEach(function(item) {
            item.addEventListener("dragover", handleDragOver, false)
            item.addEventListener("drop", handleDropEquipableItemOnStaticItemBox, false)
        })

        let all_items = document.querySelectorAll(".current_items")
        all_items.forEach(function(item) {
            item.addEventListener("drop", handleDropEquipableItemIntoAllItems, false)
            item.addEventListener("dragover", handleDragOver, false)
        })

        let armor_types = ['helmet', 'shoulders', 'bracers', 'main_weapon', 'offhand_weapon', 'cuirass', 'leggings', 'chain_mail', 'boots', 'bow', 'quiver']
        armor_types.forEach(t => {
            document.getElementById(t + "_box").addEventListener('click', (e) => {
                if(document.getElementById(t + "_box").childElementCount == 1) {
                    return
                }
                if(document.getElementById(t + "_box").style.border == "" && document.getElementById(t + "_box").childElementCount == 0) {
                    if(armorTypeSelected != null) {
                        filterWithResettingArmorType()
                    }
                    armorTypeSelected = t
                    document.getElementById(t + "_box").style.border = '3px dotted #666'
                    filterCurrentItems()
                } else {
                    filterWithResettingArmorType()
                }
            })
        })

        state = {
            helmet: {
                box: document.querySelector("#helmet_box"),
                item: null
            },
            shoulders: {
                box: document.querySelector("#shoulders_box"),
                item: null
            },
            bracers: {
                box: document.querySelector("#bracers_box"),
                item: null
            },
            main_weapon: {
                box: document.querySelector("#main_weapon_box"),
                item: null
            },
            offhand_weapon: {
                box: document.querySelector("#offhand_weapon_box"),
                item: null
            },
            cuirass: {
                box: document.querySelector("#cuirass_box"),
                item: null
            },
            leggings: {
                box: document.querySelector("#leggings_box"),
                item: null
            },
            chain_mail: {
                box: document.querySelector("#chain_mail_box"),
                item: null
            },
            boots: {
                box: document.querySelector("#boots_box"),
                item: null
            },
            bow: {
                box: document.querySelector("#bow_box"),
                item: null
            },
            quiver: {
                box: document.querySelector("#quiver_box"),
                item: null
            },
            currentElement: null,
            isOn(itemType) {
                return this[itemType].item != null
            },
            getEquipedItems() {
                let items = Object.keys(state).map(key => state[key]).filter(obj => obj != null && Object.keys(obj) != 0)
                return items.map(i => i.item).filter(i => i != null)
            }
        }
    }

    convertItemIntoDiv(items) {
        return items.map(item => {
            let parent = document.querySelector('.current_items')
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = 'true'
            divItem.setAttribute('equiped', 'false')
            divItem.style = `background-image: url('http://w1.dwar.ru/${item.image}');background-repeat: no-repeat;background-size: cover;`
            divItem.setAttribute('type', this.getType(item.kind_id))
            divItem.setAttribute('quality', item.quality)
            divItem.setAttribute('itemId', item.id)
            divItem.setAttribute('trend', item.trend)
            if(item.kind_id == 12) {
                divItem.setAttribute('weapon', "2h")
            }
            if(item.kind_id == 10) {
                divItem.setAttribute('weapon', "1h")
            }
            if(item.kind_id == 44 || item.kind_id == 17) {
                divItem.setAttribute('weapon', "off")
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
            return 'main_weapon'
        }
        if(kind_id == '44' || kind_id == '17') {
            return 'offhand_weapon'
        }
        if(kind_id == '20' || kind_id == '3') {
            return 'cuirass'
        }
        if(kind_id == '6') {
            return 'leggings'
        }
        if(kind_id == '21' || kind_id == '4') {
            return 'chain_mail'
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
        let parent = document.querySelector("#arcats")
        let arcatElement = document.createElement('div')
        arcatElement.id = "arcat"
        let slotElement = document.createElement('div')
        slotElement.type = "arcat"
        slotElement.id = "arcat_box"
        slotElement.className = "box_static small"
        arcatElement.appendChild(slotElement)
        parent.appendChild(arcatElement)
    }

    putOffItem(element, remove, fake) {
        if(element.childElementCount > 0) {
            let item = element.children[0]
            element.style.visibility = "visible"
            item.attributes.equiped.value = false
            state[item.attributes.type.value].item = null
            if(remove) {
                element.removeChild(item)
            } else {
                document.querySelectorAll(".current_items")[0].appendChild(item)
            }
            let equipedStyles = state.getEquipedItems().map(i => i.attributes.trend.value)
            let uniqueStyles = new Set(equipedStyles)
            if(equipedStyles.size == 0 || uniqueStyles.size == 0 || uniqueStyles.size == 1 && uniqueStyles.has('Универсал')) {
                currentStyle = null
                filterCurrentItems()
            }
        }
    }

    putOnItem(item, fake) {
        if(item.attributes.trend.value != 'Универсал') {
            currentStyle = item.attributes.trend.value
        }
        if(state.currentElement.attributes.weapon && !item.attributes.copy) {
            if(state.currentElement.attributes.weapon.value == "2h") {
                this.putOffWeapon(state.currentElement)
                let mainWeaponCopy = state.currentElement.cloneNode(true)
                mainWeaponCopy.attributes.type.value = 'offhand_weapon'
                mainWeaponCopy.setAttribute('copy', true)
                mainWeaponCopy.style.opacity = "0.4"
                setupEquipableItemEvents(mainWeaponCopy)
                this.putOnItem(mainWeaponCopy, true)
            } else {
                this.putOffWeapon(state.currentElement)
            }
        } else {
            let itemBox = document.querySelector(`#${state.currentElement.attributes.type.value}_box`)
            this.putOffItem(itemBox, false, true)
        }
        state[item.attributes.type.value].item = item
        state[item.attributes.type.value].box.appendChild(item)
        state[item.attributes.type.value].box.style.visibility = "hidden"
        state[item.attributes.type.value].box.children[0].style.visibility = "visible"
        item.attributes.equiped.value = true
        filterWithResettingArmorType()
        filterCurrentItems()
    }

    putOffWeapon(item, fake) {
        if(fake == undefined) {
            fake = true
        }
        if(item.attributes.weapon.value == "2h") {
            let isFakeWeapon = state.offhand_weapon.item && state.offhand_weapon.item.attributes.copy && state.offhand_weapon.item.attributes.copy.value == "true"
            this.putOffItem(state.offhand_weapon.box, isFakeWeapon, isFakeWeapon)
            this.putOffItem(state.main_weapon.box, false, fake)
        }
        if(item.attributes.weapon.value == "1h") {
            if(state.main_weapon.item) {
                if(state.main_weapon.item.attributes.weapon.value == "2h") {
                    this.putOffWeapon(state.main_weapon.item)
                } else {
                    this.putOffItem(state.main_weapon.box, false, fake)
                }
            }
        }
        if(item.attributes.weapon.value == "off") {
            if(state.offhand_weapon.item) {
                if(state.offhand_weapon.item.attributes.weapon.value == "2h") {
                    this.putOffWeapon(state.offhand_weapon.item)
                } else {
                    this.putOffItem(state.offhand_weapon.box, false, fake)
                }
            }
        }
    }
}
