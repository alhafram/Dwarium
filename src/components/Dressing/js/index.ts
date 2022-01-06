import parse from "./parser"

let setManager = null
let itemsManager = null
var art_alt = null

document.addEventListener('DOMContentLoaded', async () => {
    setManager = new SetManager()
    itemsManager = new ItemsManager()
    const result = await window.dressingAPI.loadItemsData(['allItems', 'wearedItems'])
    const parsedAllItems = parse(result.allItems)
    const parsedWearedItems = parse(result.wearedItems)
    setManager.setup()
    const arcatsCount = parsedWearedItems.bracelets[0].skills.find(s => s.title === 'Слоты для аркатов')!.value.slice(4, 5)
    if(arcatsCount) {
        for(let i = 0; i < arcatsCount; i++) {
            itemsManager.createArcatSlot(i)
            itemsManager.armorTypes.push(`arcat${i + 1}`)
        }
    }
    setupState()
    window.dressingAPI.state().arcatsCount = arcatsCount ?? 0
    if(parsedAllItems.zikkurat.length != 0) {
        window.dressingAPI.state().zikkuratId = parsedAllItems.zikkurat[0].id
        const res = await window.dressingAPI.getMagicSchools(window.dressingAPI.state().zikkuratId!)
        window.dressingAPI.state().currentMagicSchool = parseMagicSchools(res.result)
    }
    const allArcats = Array.from(difference(parsedAllItems.arcats.map(a => a.type_id), parsedWearedItems.arcats.map(a => a.type_id)))
    parsedAllItems.arcats = parsedAllItems.arcats.filter(a => allArcats.includes(a.type_id))
    itemsManager.setupAllItems(parsedAllItems)
    itemsManager.setupWearedItems(parsedWearedItems)
    setupFilters(window.dressingAPI.state())

    let allItemsAlt = result.allItems
    for(const key of Object.keys(result.wearedItems)) {
        allItemsAlt[key] = result.wearedItems[key]
    }
    art_alt = allItemsAlt
})

function setupState() {
    // window.dressingAPI.state() = {
    //     currentElement: null,
    //     isOn(itemType) {
    //         return this[itemType].item != null
    //     },
    //     getEquipedItems() {
    //         let items = Object.values(state).filter(obj => obj != null && Object.keys(obj) != 0)
    //         return items.map(i => i.item).filter(i => i != null)
    //     },
    //     currentStyle: null,
    //     armorTypeSelected: null,
    //     armorTypeSlotSelected: null,
    //     currentMagicSchool: null,
    //     zikkuratId: null,
    //     arcatsCount: 0
    // }
    // itemsManager.armorTypes.forEach(type => {
    //     state[type] = {
    //         box: document.querySelector(`#${type}Box`),
    //         item: null
    //     }
    // })
}

function difference(setA: string[], setB: string[]): Set<string> {
    let _difference = new Set(setA)
    for(let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function parseMagicSchools(result: string): string {
    let doc = result.toDocument()
    let schools = Array.from(doc.querySelector('body > table > tbody > tr:nth-child(2) > td.bgg > table > tbody > tr:nth-child(1) > td:nth-child(2) > select')!.children).map(e => e.textContent!)
    let currentStyle = difference(SetStyleHelper.magmarSchools, schools)
    if(currentStyle.size  == SetStyleHelper.magmarSchools.length) {
        currentStyle = difference(SetStyleHelper.humanSchools, schools)
    }
    return Array.from(currentStyle)[0]
}