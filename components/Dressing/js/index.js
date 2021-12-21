let setManager = null
let itemsManager = null
var state = null

document.addEventListener('DOMContentLoaded', async () => {
    setManager = new SetManager()
    itemsManager = new ItemsManager()
    setupState()
    const result = await window.myAPI.loadItemsData(['allItems', 'wearedItems'])
    const parsedAllItems = parse(result.allItems)
    itemsManager.setupAllItems(parsedAllItems)
    if(!parsedAllItems.zikkurat.isEmpty()) {
        state.zikkuratId = parsedAllItems.zikkurat.first().id
        const res = await getMagicSchools(state.zikkuratId)
        state.currentMagicSchool = parseMagicSchools(res.result)
    }
    setManager.setup()
    const parsedWearedItems = parse(result.wearedItems)
    itemsManager.setupWearedItems(parsedWearedItems)
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
        currentElement: null,
        isOn(itemType) {
            return this[itemType].item != null
        },
        getEquipedItems() {
            let items = Object.keys(state).map(key => state[key]).filter(obj => obj != null && Object.keys(obj) != 0)
            return items.map(i => i.item).filter(i => i != null)
        },
        currentStyle: null,
        armorTypeSelected: null,
        currentMagicSchool: null,
        zikkuratId: null
    }
    itemsManager.armorTypes.forEach(type => {
        state[type] = {
            box: document.querySelector(`#${type}Box`),
            item: null
        }
    })
}