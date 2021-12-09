document.addEventListener("AttachDND", event => {
    let eventItems = event.detail.items
    let arr = []
    arr = arr.concat(convertItemIntoDiv(eventItems.helmets))
    arr = arr.concat(convertItemIntoDiv(eventItems.shoulders))
    arr = arr.concat(convertItemIntoDiv(eventItems.bracers))
    arr = arr.concat(convertItemIntoDiv(eventItems.main_weapons))
    arr = arr.concat(convertItemIntoDiv(eventItems.offhand_weapons))
    arr = arr.concat(convertItemIntoDiv(eventItems.cuirasses))
    arr = arr.concat(convertItemIntoDiv(eventItems.leggings))
    arr = arr.concat(convertItemIntoDiv(eventItems.chainmails))
    arr = arr.concat(convertItemIntoDiv(eventItems.boots))
    arr.flatMap(i => i).forEach(item => {
        let parent = document.querySelector('.current_items')
        parent.appendChild(item)
    });

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

    let armor_types = ['helmet', 'shoulders', 'bracers', 'main_weapon', 'offhand_weapon', 'cuirass', 'leggings', 'chain_mail', 'boots']
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
        currentElement: null,
        isOn(itemType) {
            return this[itemType].item != null
        }
    }
})

document.addEventListener("PutOnItems", event => {
    let items = event.detail.items
    let arr = []
    arr = arr.concat(convertItemIntoDiv(items.helmets))
    arr = arr.concat(convertItemIntoDiv(items.shoulders))
    arr = arr.concat(convertItemIntoDiv(items.bracers))
    arr = arr.concat(convertItemIntoDiv(items.main_weapons))
    arr = arr.concat(convertItemIntoDiv(items.offhand_weapons))
    arr = arr.concat(convertItemIntoDiv(items.cuirasses))
    arr = arr.concat(convertItemIntoDiv(items.leggings))
    arr = arr.concat(convertItemIntoDiv(items.chainmails))
    arr = arr.concat(convertItemIntoDiv(items.boots))

    arr.forEach(function(item) {
        setupEquipableItemEvents(item)
    })
    arr.forEach(item => {
        state.currentElement = item
        putOnItem(item, true)
        state.currentElement = null
    });
})

function convertItemIntoDiv(items) {
    return items.map(item => {
        let parent = document.querySelector('.current_items')
        let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = 'true'
        divItem.setAttribute('equiped', 'false')
        divItem.style = `background-image: url('http://w1.dwar.ru/${item.image}');background-repeat: no-repeat;background-size: cover;`
        divItem.setAttribute('type', getType(item.kind_id))
        divItem.setAttribute('quality', item.quality)
        divItem.setAttribute('itemId', item.id)
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
    });
}

function getType(kind_id) {
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
    return 'other'
}

var armorTypeSelected = null

var state = null

function handleDragStartEquipableItem(e) {
    this.style.opacity = "0.4"
    state.currentElement = this
}

function handleDragEndEquipableItem(e) {
    this.style.opacity = "1"
}

function handleDragOver(e) {
    if(e.preventDefault) {
        e.preventDefault()
    }
    return false
}

function handleDropEquipableItemOnStaticItemBox(e) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }
    if(state.currentElement != this &&
        this.childElementCount == 0 &&
        state.currentElement.attributes.type.value == this.attributes.type.value) {
        putOnItem(state.currentElement, false)
    }
    return false
}

function handleDropEquipableItemIntoAllItems(e) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }

    if(state.currentElement.attributes.weapon) {
        putOffWeapon(state.currentElement, false)
    } else {
        putOffItem(state.currentElement.parentElement, false, false)
    }
    filterWithResettingArmorType()
    return false
}

function handleClickEquipableItem(e) {
    if(e.detail == 1) {
        return
    }
    if(this.attributes.equiped.value != "true" && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.attributes.type.value}_box`)
        state.currentElement = this
        putOnItem(this, false)
        return
    }
    if(this.attributes.equiped.value == "true" && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.attributes.type.value}_box`)
        if(this.attributes.weapon) {
            putOffWeapon(this, false)
        } else {
            putOffItem(itemBox, false, false)
        }
        filterWithResettingArmorType()
        e.stopPropagation()
    }
}


function setupEquipableItemEvents(item) {
    item.addEventListener("dragstart", handleDragStartEquipableItem, false)
    item.addEventListener("dragend", handleDragEndEquipableItem, false)
    item.addEventListener("click", handleClickEquipableItem, false)
}

function filterWithResettingArmorType() {
    if(armorTypeSelected) {
        document.getElementById(armorTypeSelected + "_box").style.border = ""
        armorTypeSelected = null
        filterCurrentItems()
    }
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

function putOffItem(element, remove, fake) {
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
        if(!fake) {
            var rnd_url = '&_=' + (new Date().getTime() + Math.random());
            let req = `fetch("http://w1.dwar.ru/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${item.attributes.itemId.value}&ajax=1${rnd_url}", {
                  "headers": {
                    "accept": "*/*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
                    "cache-control": "no-cache",
                    "pragma": "no-cache"
                  },
                  "referrer": "http://w1.dwar.ru/user_iframe.php?group=2",
                  "referrerPolicy": "no-referrer-when-downgrade",
                  "body": null,
                  "method": "GET",
                  "mode": "cors",
                  "credentials": "include"
                })`
                document.dispatchEvent(new CustomEvent('MakeRequest', {
                    detail: req
                }))
        }
    }
}

function putOnItem(item, fake) {
    if(state.currentElement.attributes.weapon && !item.attributes.copy) {
        if(state.currentElement.attributes.weapon.value == "2h") {
            putOffWeapon(state.currentElement)
            let mainWeaponCopy = state.currentElement.cloneNode(true)
            mainWeaponCopy.attributes.type.value = 'offhand_weapon'
            mainWeaponCopy.setAttribute('copy', true)
            mainWeaponCopy.style.opacity = "0.4"
            setupEquipableItemEvents(mainWeaponCopy)
            putOnItem(mainWeaponCopy, true)
        } else {
            putOffWeapon(state.currentElement)
        }
    } else {
        let itemBox = document.querySelector(`#${state.currentElement.attributes.type.value}_box`)
        console.log("HERERERE", itemBox)
        putOffItem(itemBox, false, true)
    }
    state[item.attributes.type.value].item = item
    state[item.attributes.type.value].box.appendChild(item)
    state[item.attributes.type.value].box.style.visibility = "hidden"
    state[item.attributes.type.value].box.children[0].style.visibility = "visible"
    item.attributes.equiped.value = true
    filterWithResettingArmorType()

    if(!item.attributes.copy && !fake) {
        var rnd_url = '&_=' + (new Date().getTime() + Math.random());
        let req = `fetch("http://w1.dwar.ru/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&artifact_id=${item.attributes.itemId.value}&in[slot_num]=0&in[variant_effect]=0&ajax=1${rnd_url}", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache"
          },
          "referrer": "http://w1.dwar.ru/user_iframe.php?group=2",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        })`
        document.dispatchEvent(new CustomEvent('MakeRequest', {
            detail: req
        }))
    }
}

function putOffWeapon(item, fake) {
    if(fake == undefined) {
        fake = true
    }
    if(item.attributes.weapon.value == "2h") {
        let isFakeWeapon = state.offhand_weapon.item && state.offhand_weapon.item.attributes.copy && state.offhand_weapon.item.attributes.copy.value == "true"
        putOffItem(state.offhand_weapon.box, isFakeWeapon, isFakeWeapon)
        putOffItem(state.main_weapon.box, false, fake)
    }
    if(item.attributes.weapon.value == "1h") {
        if(state.main_weapon.item) {
            if(state.main_weapon.item.attributes.weapon.value == "2h") {
                putOffWeapon(state.main_weapon.item)
            } else {
                putOffItem(state.main_weapon.box, false, fake)
            }
        }
    }
    if(item.attributes.weapon.value == "off") {
        if(state.offhand_weapon.item) {
            if(state.offhand_weapon.item.attributes.weapon.value == "2h") {
                putOffWeapon(state.offhand_weapon.item)
            } else {
                putOffItem(state.offhand_weapon.box, false, fake)
            }
        }
    }
}
