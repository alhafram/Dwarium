let setManager = null
let itemsManager = null
var state = null

document.addEventListener('DOMContentLoaded', async () => {
    setManager = new SetManager()
    itemsManager = new ItemsManager()
    const result = await window.myAPI.loadItemsData(['allItems', 'wearedItems'])
    const parsedAllItems = parse(result.allItems)
    const parsedWearedItems = parse(result.wearedItems)
    setManager.setup()
    const arcatsCount = parsedWearedItems.bracelets.first()?.skills.find(s => s.title === 'Слоты для аркатов').value.slice(4, 5)
    if(arcatsCount) {
        for(let i = 0; i < arcatsCount; i++) {
            itemsManager.createArcatSlot(i)
            itemsManager.armorTypes.push(`arcat${i + 1}`)
        }
    }
    setupState()
    state.arcatsCount = arcatsCount ?? 0
    if(!parsedAllItems.zikkurat.isEmpty()) {
        state.zikkuratId = parsedAllItems.zikkurat.first().id
        const res = await getMagicSchools(state.zikkuratId)
        state.currentMagicSchool = parseMagicSchools(res.result)
    }
    const allArcats = Array.from(difference(parsedAllItems.arcats.map(a => a.type_id), parsedWearedItems.arcats.map(a => a.type_id)))
    parsedAllItems.arcats = parsedAllItems.arcats.filter(a => allArcats.includes(a.type_id))
    itemsManager.setupAllItems(parsedAllItems)
    itemsManager.setupWearedItems(parsedWearedItems)
    setupFilters()
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
        armorTypeSlotSelected: null,
        currentMagicSchool: null,
        zikkuratId: null,
        arcatsCount: 0
    }
    itemsManager.armorTypes.forEach(type => {
        state[type] = {
            box: document.querySelector(`#${type}Box`),
            item: null
        }
    })
}