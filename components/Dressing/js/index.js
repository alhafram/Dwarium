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