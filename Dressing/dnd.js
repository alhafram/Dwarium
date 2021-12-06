document.addEventListener("AttachDND", event => {

    var armorTypeSelected = null

    var mainWeaponBox = document.querySelector("#main_weapon_box")
    var offHandWeaponBox = document.querySelector("#offhand_weapon_box")

    var state = {
      helmet: {
        box: document.querySelector("#helmet_box"),
        item: null,
        on: false
      },
      shoulders: {
        box: document.querySelector("#shouldersBox"),
        item: null,
        on: false
      },
      bracers: {
        box: document.querySelector("#bracers_box"),
        item: null,
        on: false
      },
      main_weapon: {
        box: document.querySelector("#main_weapon_box"),
        item: null,
        on: false
      },
      offhand_weapon: {
        box: document.querySelector("#offhand_weapon_box"),
        item: null,
        on: false
      },
      cuirass: {
        box: document.querySelector("#cuirass_box"),
        item: null,
        on: false
      },
      leggings: {
        box: document.querySelector("#leggings_box"),
        item: null,
        on: false
      },
      chain_mail: {
        box: document.querySelector("#chain_mail_box"),
        item: null,
        on: false
      },
      boots: {
        box: document.querySelector("#boots_box"),
        item: null,
        on: false
      },
      currentElement: null
    }

    console.log(state)

    function handleDragStartEquipableItem(e) {
        this.style.opacity = "0.4"
        state.currentElement = this
        e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function handleDragEndEquipableItem(e) {
        console.log('handleDragEndEquipableItem')
        this.style.opacity = "1"
    }

    function handleDragOverStaticItemBox(e) {
        if(e.preventDefault) {
            e.preventDefault()
        }
        return false;
    }

    function handleDropEquipableItemOnStaticItemBox(e) {
        console.log('handleDropEquipableItemOnStaticItemBox')
        if(e.stopPropagation) {
            e.stopPropagation()
        }
        if(state.currentElement != this &&
           this.childElementCount == 0 &&
           state.currentElement.attributes.equiped.value == "false" &&
           state.currentElement.attributes.type.value == this.attributes.type.value) {
            if(state.currentElement.attributes.weapon) {
                if(state.currentElement.attributes.weapon.value == "2h") {
                    putOffItem(offHandWeaponBox, true)
                    putOffItem(mainWeaponBox)

                    let mainWeaponCopy = state.currentElement.cloneNode(true)
                    setupEquipableItemEvents(mainWeaponCopy)
                    putOnItem(offHandWeaponBox, mainWeaponCopy)
                }
            }
            putOnItem(this, state.currentElement)
            if(armorTypeSelected) {
                document.getElementById(armorTypeSelected + "_box").style.border = ""
                armorTypeSelected = null
                filterCurrentItems()
            }
        }
        return false;
    }

    function handleDropEquipableItemIntoAllItems(e) {
        console.log('handleDropEquipableItemIntoAllItems')
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
        console.log('handleDragOverEquipableItemOverAllItems')
        if(e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleClickEquipableItem(e) {
        console.log('handleClickEquipableItem')
        if(e.detail == 1) {
            return
        }
        if(this.attributes.equiped.value != "true" && e.detail == 2) {
            let itemBox = document.querySelector(`#${this.attributes.type.value}_box`)

            if(this.attributes.weapon) {
                if(this.attributes.weapon.value == "2h") {
                    if(mainWeaponBox.children.length > 0 && mainWeaponBox.children[0].attributes.weapon.value == "2h") {
                        putOffItem(offHandWeaponBox, true)
                        putOffItem(mainWeaponBox)
                    }
                    if(mainWeaponBox.children.length > 0 && mainWeaponBox.children[0].attributes.weapon.value == "1h") {
                        putOffItem(offHandWeaponBox)
                        putOffItem(mainWeaponBox)
                    }

                    let mainWeaponCopy = this.cloneNode(true)
                    mainWeaponCopy.style.opacity = "0.4"
                    setupEquipableItemEvents(mainWeaponCopy)
                    putOnItem(offHandWeaponBox, mainWeaponCopy)
                }
                if(this.attributes.weapon.value == "1h" || this.attributes.weapon.value == "off") {
                    if(mainWeaponBox.childElementCount > 0) {
                        if(mainWeaponBox.children[0].attributes.weapon.value == "2h") {
                            putOffItem(offHandWeaponBox, true)
                            putOffItem(mainWeaponBox)
                        } else {
                            putOffItem(itemBox)
                        }
                    }
                }
            } else {
                putOffItem(itemBox)
            }
            putOnItem(itemBox, this)
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
            if(remove) {
                element.removeChild(item)
            } else {
                document.querySelectorAll(".current_items")[0].appendChild(item);
            }
        }
    }

    function putOnItem(element, item) {
        state[item.attributes.type.value].item = item
        element.append(item);
        element.style.visibility = "hidden";
        element.children[0].style.visibility = "visible";
        item.attributes.equiped.value = true;
    }

    function putOffWeapon(item) {
        if(item.attributes.weapon.value == "2h") {
            putOffItem(offHandWeaponBox, true)
            putOffItem(mainWeaponBox)
        }
        if(item.attributes.weapon.value == "1h") {
            putOffItem(mainWeaponBox)
        }
        if(item.attributes.weapon.value == "off") {
            putOffItem(offHandWeaponBox)
        }
    }
});
