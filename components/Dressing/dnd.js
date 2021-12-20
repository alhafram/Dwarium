let setManager = null

let currentMagicSchool = null
let zikkuratId = null

document.addEventListener("DOMContentLoaded", async () => {
    setManager = new SetManager()
    let result = await window.myAPI.loadItemsData()
    let parsedAllItems = parse(result.allItems)
    setupAllItems(parsedAllItems)
    if(!parsedAllItems.zikkurat.isEmpty()) {
        zikkuratId = parsedAllItems.zikkurat.first().id
        let res = await getMagicSchools(zikkuratId)
        currentMagicSchool = await parseMagicSchools(res.result)
    }
    let parsedWearedItems = parse(result.wearedItems)
    setupWearedItems(parsedWearedItems)
    setupSetManager()
    setupFilters()

    let arcatsCount = parsedWearedItems.bracelets[0]?.skills.find(s => s.title == "Слоты для аркатов").value.slice(4, 5) // TODO: - Find better solution
    if(arcatsCount) {
        for(var i = 0; i < arcatsCount; i++) {
            createArcatSlot()
        }
    }
    console.log(arcatsCount)
})

function createArcatSlot() {
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

function difference(setA, setB) {
    let _difference = new Set(setA)
    for(let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

async function parseMagicSchools(result) {
    let doc = result.toDocument()
    let schools = Array.from(doc.querySelector("body > table > tbody > tr:nth-child(2) > td.bgg > table > tbody > tr:nth-child(1) > td:nth-child(2) > select").children).map(e => e.textContent)
    let currentStyle = difference(SetStyleHelper.magmarSchools, schools)
    if(currentStyle == 0) {
        currentStyle = difference(SetStyleHelper.humanSchools, schools)
    }
    return Array.from(currentStyle)[0]
}


function setupSetManager() {
    setManager.loadSets()
    setManager.fillSets()
    setManager.setupListeners()
}

const parsingItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers']

function setupAllItems(allItems) {
    let arr = []
    for(const type of parsingItemTypes) {
        arr = arr.concat(convertItemIntoDiv(allItems[type]))
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

function setupWearedItems(wearedItems) {
    let arr = []
    for(const type of parsingItemTypes) {
        arr = arr.concat(convertItemIntoDiv(wearedItems[type]))
    }
    setManager.equipedCurrentItemIds = arr.map(i => i.attributes.itemid.value)

    arr.forEach(function(item) {
        setupEquipableItemEvents(item)
    })

    arr.forEach(item => {
        state.currentElement = item
        putOnItem(item, true)
        state.currentElement = null
    })
}

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
    if(kind_id == '131') {
        return 'quiver'
    }
    if(kind_id == '116') {
        return 'bow'
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
    if(!state.currentElement) {
        return
    }
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
        if(currentStyle) {
            if(i.attributes.trend.value == 'Универсал' && i.style.display == 'inline-block' || currentStyle == i.attributes.trend.value && i.style.display == 'inline-block') {
                i.style.display = 'inline-block'
            } else {
                i.style.display = 'none'
            }
        }
        for(var filter of filters) {
            let items = Array.from(document.querySelector(".current_items").children).filter(e => e.attributes.quality.value == filter)
            items.forEach(item => {
                item.style.display = 'none'
            })
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
        let equipedStyles = state.getEquipedItems().map(i => i.attributes.trend.value)
        let uniqueStyles = new Set(equipedStyles)
        if(equipedStyles.size == 0 || uniqueStyles.size == 1 && uniqueStyles.has('Универсал')) {
            currentStyle = null
            filterCurrentItems()
        }
    }
}

var currentStyle = null

function putOnItem(item, fake) {
    if(item.attributes.trend.value != 'Универсал') {
        currentStyle = item.attributes.trend.value
    }
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
        putOffItem(itemBox, false, true)
    }
    state[item.attributes.type.value].item = item
    state[item.attributes.type.value].box.appendChild(item)
    state[item.attributes.type.value].box.style.visibility = "hidden"
    state[item.attributes.type.value].box.children[0].style.visibility = "visible"
    item.attributes.equiped.value = true
    filterWithResettingArmorType()
    filterCurrentItems()
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
