document.addEventListener("AttachDND", event => {

    var armorTypeSelected = null

    var state = {
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
        currentElement: null,
        isOn(itemType) {
            return this[itemType].item != null
        }
    }

    function handleDragStartEquipableItem(e) {
        this.style.opacity = "0.4"
        state.currentElement = this
        e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragEndEquipableItem(e) {
        this.style.opacity = "1"
    }

    function handleDragOverStaticItemBox(e) {
        if(e.preventDefault) {
            e.preventDefault()
        }
        return false;
    }

    function handleDropEquipableItemOnStaticItemBox(e) {
        if(e.stopPropagation) {
            e.stopPropagation()
        }
        if(state.currentElement != this &&
            this.childElementCount == 0 &&
            state.currentElement.attributes.equiped.value == "false" &&
            state.currentElement.attributes.type.value == this.attributes.type.value) {
            if(state.currentElement.attributes.weapon) {
                if(state.currentElement.attributes.weapon.value == "2h") {
                    putOffItem(state.offhand_weapon.box, true)
                    putOffItem(state.main_weapon.box)

                    let mainWeaponCopy = state.currentElement.cloneNode(true)
                    mainWeaponCopy.attributes.type.value = 'offhand_weapon'
                    setupEquipableItemEvents(mainWeaponCopy)
                    putOnItem(mainWeaponCopy)
                }
            }
            putOnItem(state.currentElement)
            if(armorTypeSelected) {
                document.getElementById(armorTypeSelected + "_box").style.border = ""
                armorTypeSelected = null
                filterCurrentItems()
            }
        }
        return false;
    }

    function handleDropEquipableItemIntoAllItems(e) {
        if(e.stopPropagation) {
            e.stopPropagation();
        }

        if(state.currentElement.attributes.weapon) {
            putOffWeapon(state.currentElement)
        } else {
            putOffItem(state.currentElement.parentElement)
        }
        armorTypeSelected = null
        filterCurrentItems()
        return false;
    }

    function handleDragOverEquipableItemOverAllItems(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleClickEquipableItem(e) {
        if(e.detail == 1) {
            return
        }
        if(this.attributes.equiped.value != "true" && e.detail == 2) {
            let itemBox = document.querySelector(`#${this.attributes.type.value}_box`)

            if(this.attributes.weapon) {
                if(this.attributes.weapon.value == "2h") {
                    if(state.main_weapon.box.children.length > 0 && state.main_weapon.box.children[0].attributes.weapon.value == "2h") {
                        putOffItem(state.offhand_weapon.box, true)
                        putOffItem(state.main_weapon.box)
                    }
                    if(state.main_weapon.box.children.length > 0 && state.main_weapon.box.children[0].attributes.weapon.value == "1h" ||
                        state.offhand_weapon.box.children.length > 0 && state.offhand_weapon.box.children[0].attributes.weapon.value == "off") {
                        putOffItem(state.offhand_weapon.box)
                        putOffItem(state.main_weapon.box)
                    }

                    let mainWeaponCopy = this.cloneNode(true)
                    mainWeaponCopy.attributes.type.value = 'offhand_weapon'
                    mainWeaponCopy.style.opacity = "0.4"
                    setupEquipableItemEvents(mainWeaponCopy)
                    putOnItem(mainWeaponCopy)
                }
                if(this.attributes.weapon.value == "1h" || this.attributes.weapon.value == "off") {
                    if(state.main_weapon.box.childElementCount > 0) {
                        if(state.main_weapon.box.children[0].attributes.weapon.value == "2h") {
                            putOffItem(state.offhand_weapon.box, true)
                            putOffItem(state.main_weapon.box)
                        } else {
                            putOffItem(itemBox)
                        }
                    }
                }
            } else {
                putOffItem(itemBox)
            }
            putOnItem(this)
            return
        }
        if(this.attributes.equiped.value == "true" && e.detail == 2) {
            let itemBox = document.querySelector(`#${this.attributes.type.value}_box`)
            if(this.attributes.weapon) {
                putOffWeapon(this)
            } else {
                putOffItem(itemBox)
            }
            if(armorTypeSelected) {
                filterCurrentItems()
            }
            e.stopPropagation()
        }
    }

    let items = document.querySelectorAll(".current_items .box");
    items.forEach(function(item) {
        setupEquipableItemEvents(item)
    });

    let equip_items = document.querySelectorAll(".equipped_items .box_static");
    equip_items.forEach(function(item) {
        item.addEventListener("dragover", handleDragOverStaticItemBox, false);
        item.addEventListener("drop", handleDropEquipableItemOnStaticItemBox, false);
    });

    let all_items = document.querySelectorAll(".current_items");
    all_items.forEach(function(item) {
        item.addEventListener("drop", handleDropEquipableItemIntoAllItems, false);
        item.addEventListener("dragover", handleDragOverEquipableItemOverAllItems, false);
    });

    let armor_types = ['helmet', 'shoulders', 'bracers', 'main_weapon', 'offhand_weapon', 'cuirass', 'leggings', 'chain_mail', 'boots']
    armor_types.forEach(t => {
        document.getElementById(t + "_box").addEventListener('click', (e) => {
            if(document.getElementById(t + "_box").childElementCount == 1) {
                return
            }
            if(document.getElementById(t + "_box").style.border == "" && document.getElementById(t + "_box").childElementCount == 0) {
                if(armorTypeSelected != null) {
                    document.getElementById(armorTypeSelected + "_box").style.border = ""
                    armorTypeSelected = null
                    filterCurrentItems()
                }
                armorTypeSelected = t
                document.getElementById(t + "_box").style.border = '3px dotted #666'
                filterCurrentItems()
            } else {
                document.getElementById(t + "_box").style.border = ""
                armorTypeSelected = null
                filterCurrentItems()
            }
        });
    })

    function setupEquipableItemEvents(item) {
        item.addEventListener("dragstart", handleDragStartEquipableItem, false);
        item.addEventListener("dragend", handleDragEndEquipableItem, false);
        item.addEventListener("click", handleClickEquipableItem, false);
    }

    function filterCurrentItems() {
        let items = Array.from(document.querySelector('.current_items').children)
        items.forEach(i => {
            if(armorTypeSelected) {
                if(i.attributes.type.value == armorTypeSelected) {
                    i.style.display = 'inline-block'
                } else {
                    i.style.display = 'none'
                }
            } else {
                i.style.display = 'inline-block'
            }
        })
    }

    function putOffItem(element, remove) {
        if(element.childElementCount > 0) {
            let item = element.children[0]
            element.style.visibility = "visible";
            item.attributes.equiped.value = false;
            state[item.attributes.type.value].item = null
            if(remove) {
                element.removeChild(item)
            } else {
                document.querySelectorAll(".current_items")[0].appendChild(item);
            }
        }
    }

    function putOnItem(item) {
        state[item.attributes.type.value].item = item
        state[item.attributes.type.value].box.appendChild(item)
        state[item.attributes.type.value].box.style.visibility = "hidden";
        state[item.attributes.type.value].box.children[0].style.visibility = "visible";
        item.attributes.equiped.value = true;
    }

    function putOffWeapon(item) {
        if(item.attributes.weapon.value == "2h") {
            putOffItem(state.offhand_weapon.box, true)
            putOffItem(state.main_weapon.box)
        }
        if(item.attributes.weapon.value == "1h") {
            putOffItem(state.main_weapon.box)
        }
        if(item.attributes.weapon.value == "off") {
            putOffItem(state.offhand_weapon.box)
        }
    }
});
