let setManager = null
let itemsManager = null
let currentMagicSchool = null
let zikkuratId = null
var armorTypeSelected = null
var state = null
var currentStyle = null

document.addEventListener('DOMContentLoaded', async () => {
    setManager = new SetManager()
    itemsManager = new ItemsManager()
    setupState()
    const result = await window.myAPI.loadItemsData()
    const parsedAllItems = parse(result.allItems)
    itemsManager.setupAllItems(parsedAllItems)
    if(!parsedAllItems.zikkurat.isEmpty()) {
        zikkuratId = parsedAllItems.zikkurat.first().id
        const res = await getMagicSchools(zikkuratId)
        currentMagicSchool = parseMagicSchools(res.result)
    }
    const parsedWearedItems = parse(result.wearedItems)
    itemsManager.setupWearedItems(parsedWearedItems)
    setManager.setup()
    setupFilters()

    // TODO: - Find better solution
    const arcatsCount = parsedWearedItems.bracelets[0]?.skills.find(s => s.title === 'Слоты для аркатов').value.slice(4, 5)
    if(arcatsCount) {
        for(let i = 0; i < arcatsCount; i++) {
            itemsManager.createArcatSlot()
        }
    }
})

function setupState() {
    state = {
        helmet: {
            box: document.querySelector("#helmetBox"),
            item: null
        },
        shoulders: {
            box: document.querySelector("#shouldersBox"),
            item: null
        },
        bracers: {
            box: document.querySelector("#bracersBox"),
            item: null
        },
        mainWeapon: {
            box: document.querySelector("#mainWeaponBox"),
            item: null
        },
        offhandWeapon: {
            box: document.querySelector("#offhandWeaponBox"),
            item: null
        },
        cuirass: {
            box: document.querySelector("#cuirassBox"),
            item: null
        },
        leggings: {
            box: document.querySelector("#leggingsBox"),
            item: null
        },
        chainmail: {
            box: document.querySelector("#chainmailBox"),
            item: null
        },
        boots: {
            box: document.querySelector("#bootsBox"),
            item: null
        },
        bow: {
            box: document.querySelector("#bowBox"),
            item: null
        },
        quiver: {
            box: document.querySelector("#quiverBox"),
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