let setManager: SetManager
let itemsManager: ItemsManager
var art_alt = null

// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI = {}
// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI.baseUrl = function() {
    return window.dressingAPI.baseUrl()
}

interface WindowState {
    [key: string]: any
    currentElement: HTMLElement | null,
    getEquipedItems(): HTMLElement[]
    currentStyle: string | any,
    armorTypeSelected: string | any,
    armorTypeSlotSelected: string | any,
    currentMagicSchool: string | any,
    zikkuratId: string | any,
    arcatsCount: 0,
    offhandWeapon: {
        item?: HTMLElement
        box?: HTMLElement
    }
    mainWeapon: {
        item?: HTMLElement
        box?: HTMLElement
    }
}

var state: WindowState = {
    currentElement: null,
    getEquipedItems(): any {
        let items = Object.values(state).filter(obj => obj != null)
        return items.map(i => i.item).filter(i => i != null)
    },
    currentStyle: '',
    armorTypeSelected: '',
    armorTypeSlotSelected: '',
    currentMagicSchool: '',
    zikkuratId: '',
    arcatsCount: 0,
    offhandWeapon: {
        item: undefined,
        box: undefined
    },
    mainWeapon: {
        item: undefined,
        box: undefined
    }
}

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
    state.arcatsCount = arcatsCount ?? 0
    if(parsedAllItems.zikkurat.length != 0) {
        state.zikkuratId = parsedAllItems.zikkurat[0].id!
        const res = await window.dressingAPI.getMagicSchools(state.zikkuratId!)
        state.currentMagicSchool = parseMagicSchools(res.result)
    }
    const allArcats = Array.from(difference(parsedAllItems.arcats.map(a => a.type_id), parsedWearedItems.arcats.map(a => a.type_id)))
    parsedAllItems.arcats = parsedAllItems.arcats.filter(a => allArcats.includes(a.type_id))
    itemsManager.setupAllItems(parsedAllItems)
    itemsManager.setupWearedItems(parsedWearedItems)
    setupFilters()

    let allItemsAlt = result.allItems
    for(const key of Object.keys(result.wearedItems)) {
        allItemsAlt[key] = result.wearedItems[key]
    }
    art_alt = allItemsAlt
})

function setupState() {
    itemsManager.armorTypes.forEach(type => {
        state[type] = {
            box: document.querySelector(`#${type}Box`),
            item: null
        }
    })
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

//////////////////////////////////////////////////////////////////////////////////////////////////

interface Arcats {
    antiInfury: InventoryItem
    barrier: InventoryItem
    vampirism: InventoryItem
    health: InventoryItem
    initiative: InventoryItem
    concentration: InventoryItem
    blood: InventoryItem
    power: InventoryItem
    suppression: InventoryItem
    insight: InventoryItem
    speed: InventoryItem
    resilience: InventoryItem
    injury: InventoryItem
}

interface InventoryItem {
    id: string
    title: string, desc: any, kind_id: string, type_id: string, skills: [{ value: any, title: string }],
    quality: string,
    image: string,
    trend: string
}

interface InventoryItems {
    [key: string]: InventoryItem[]
    arcats: InventoryItem[]
    quivers: InventoryItem[]
    amulets: InventoryItem[]
    rings: InventoryItem[]
    bags: InventoryItem[]
    decorItems: InventoryItem[]
    profWeapons: InventoryItem[]
    belts: InventoryItem[]
    bracelets: InventoryItem[]
    bows: InventoryItem[]
    helmets: InventoryItem[]
    shoulders: InventoryItem[]
    bracers: InventoryItem[]
    mainWeapons: InventoryItem[]
    offhandWeapons: InventoryItem[]
    cuirasses: InventoryItem[]
    leggings: InventoryItem[]
    chainmails: InventoryItem[]
    boots: InventoryItem[]
    banners: InventoryItem[]
    items: InventoryItem[]
    zikkurat: InventoryItem[]
}

function filterArcats(arcats: InventoryItem[]): Arcats {
    let antiInfury = arcats.filter(a => a.title.includes('антитравматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    arcats = arcats.removeItems(arcats.filter(a => a.title.includes('антитравматизма')))
    let barrier = arcats.filter(a => a.title.includes('барьера')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let vampirism = arcats.filter(a => a.title.includes('вампиризма')).sort((a, b) => a.desc - b.desc)[0]
    let health = arcats.filter(a => a.title.includes('живучести')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let initiative = arcats.filter(a => a.title.includes('инициативы')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let concentration = arcats.filter(a => a.title.includes('концентрации')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let blood = arcats.filter(a => a.title.includes('крови')).sort((a, b) => a.desc - b.desc)[0]
    let power = arcats.filter(a => a.title.includes('мощи')).sort((a, b) => a.desc - b.desc)[0]
    let suppression = arcats.filter(a => a.title.includes('подавления')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let insight = arcats.filter(a => a.title.includes('проницания')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let speed = arcats.filter(a => a.title.includes('скорости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let resilience = arcats.filter(a => a.title.includes('стойкости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let injury = arcats.filter(a => a.title.includes('травматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    return {
        antiInfury,
        barrier,
        vampirism,
        health,
        initiative,
        concentration,
        blood,
        power,
        suppression,
        insight,
        speed,
        resilience,
        injury
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function parse(art_alt: InventoryItem[]): InventoryItems {
    let items = Object.values(art_alt)

    let delimiters = items.filter(item => item.title == 'Разделитель')
    items = items.removeItems(delimiters)

    let zikkurat = items.filter(i => i.kind_id == '25' && i.type_id == '12')
    items = items.removeItems(zikkurat)

    let arcats = items.filter(i => i.kind_id == '161') // Arcats
    items = items.removeItems(arcats)
    
    arcats = Object.values(filterArcats(arcats))
    arcats = arcats.filter(a => a)

    let quivers = items.filter(i => i.kind_id == '131') // Quivers
    items = items.removeItems(quivers)

    let rings = items.filter(i => i.kind_id == '76' && i.type_id == '18') // Rings
    items = items.removeItems(rings)

    let bags = items.filter(i => i.kind_id == '30') // Bags
    items = items.removeItems(bags)

    let decorKindIds = [{
        kind_id: '12',
        type_id: '2'
    }, {
        kind_id: '10',
        type_id: '2'
    }, {
        kind_id: '44',
        type_id: '2'
    }, {
        kind_id: '17',
        type_id: '4'
    }, {
        kind_id: '76',
        type_id: '33'
    }]

    // Decor items
    let commonDecorItems = items.filter(i => i.type_id == '111')
    let decorItems = items.filter(i => decorKindIds.some(d => d.kind_id == i.kind_id && d.type_id == i.type_id))
    decorItems = decorItems.concat(commonDecorItems)
    items = items.removeItems(decorItems)

    let amulets = items.filter(i => i.kind_id == '25') // Amulets
    items = items.removeItems(amulets)

    let profWeapons = items.filter(i => i.kind_id == '42') // Profession weapons
    items = items.removeItems(profWeapons)

    let belts = items.filter(i => i.kind_id == '31') // Belts
    items = items.removeItems(belts)

    let bracelets = items.filter(i => i.kind_id == '137') // Bracelets
    items = items.removeItems(bracelets)

    let bows = items.filter(i => i.kind_id == '116') // Bows
    items = items.removeItems(bows)

    let helmets = items.filter(i => i.kind_id == '1') // Helmets
    items = items.removeItems(helmets)

    let shoulders = items.filter(i => i.kind_id == '7') // Shoulders
    items = items.removeItems(shoulders)

    let bracersIds = ['5', '77', '120']
    let bracers = items.filter(i => bracersIds.includes(i.kind_id)) // Bracers
    items = items.removeItems(bracers)

    let mainWeaponsKindIds = ['10', '12'] // 10 - 1h --- 12 - 2h
    let mainWeapons = items.filter(i => mainWeaponsKindIds.includes(i.kind_id)) // Main weapons
    items = items.removeItems(mainWeapons)

    let offhandWeaponsKindIds = ['44', '17'] // 44 - weapon --- 17 - shield
    let offhandWeapons = items.filter(i => offhandWeaponsKindIds.includes(i.kind_id)) // Offhand weapons
    items = items.removeItems(offhandWeapons)

    let cuirassesIds = ['20', '3']
    let cuirasses = items.filter(i => cuirassesIds.includes(i.kind_id)) // Cuirasses
    items = items.removeItems(cuirasses)

    let leggings = items.filter(i => i.kind_id == '6') // Leggingses
    items = items.removeItems(leggings)

    let chainmailsIds = ['21', '4']
    let chainmails = items.filter(i => chainmailsIds.includes(i.kind_id)) // Chainmails
    items = items.removeItems(chainmails)

    let boots = items.filter(i => i.kind_id == '2') // Boots
    items = items.removeItems(boots)

    let bannersIds = ['96']
    let banners = items.filter(i => bannersIds.includes(i.kind_id)) // Banners
    items = items.removeItems(banners)

    let summary = {
        arcats,
        quivers,
        amulets,
        rings,
        bags,
        decorItems,
        profWeapons,
        belts,
        bracelets,
        bows,
        helmets,
        shoulders,
        bracers,
        mainWeapons,
        offhandWeapons,
        cuirasses,
        leggings,
        chainmails,
        boots,
        banners,
        items,
        zikkurat
    }
    return summary
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

let dressingFilters = new Set<number>()

function setupFilters() {

    interface Filter {
        [key: string]: number;
    }

    const filterTypes: Filter = {
        'i_gray': 0,
        'i_green': 1,
        'i_blue': 2,
        'i_purple': 3,
        'i_red': 4
    }
    for(const key in filterTypes) {
        const element = document.getElementById(key)! as HTMLInputElement
        element.onchange = function(e) {
            if(!element.checked) {
                const filter = filterTypes[key]
                dressingFilters.add(filter) //.add(filter as number)
            } else {
                dressingFilters.delete(filterTypes[key])
            }
            filterCurrentItems()
        }
    }
}

function filterWithResettingArmorType() {
    if(state.armorTypeSelected) {
        document.getElementById(`${state.armorTypeSelected}${state.armorTypeSlotSelected ?? ""}Box`)!.style.border = ''
        state.armorTypeSelected = null
        state.armorTypeSlotSelected = null
        filterCurrentItems()
    }
}

function filterCurrentItems() {
    let items = Array.from(document.querySelector('.currentItems')!.children)
    items.forEach(i => {
        if(state.armorTypeSelected) {
            if((i as HTMLElement).getAttribute('type') == state.armorTypeSelected) {
                (i as HTMLElement).style.display = 'inline-block'
            } else {
                (i as HTMLElement).style.display = 'none'
            }
        } else {
            (i as HTMLElement).style.display = 'inline-block'
        }
        if(state.currentStyle) {
            if(i.getAttribute('trend') == 'Универсал' && (i as HTMLElement).style.display == 'inline-block' || state.currentStyle == i.getAttribute('trend') && (i as HTMLElement).style.display == 'inline-block') {
                (i as HTMLElement).style.display = 'inline-block'
            } else {
                (i as HTMLElement).style.display = 'none'
            }
        }
        for(var filter of dressingFilters) {
            let items = Array.from(document.querySelector('.currentItems')!.children).filter(e => e.getAttribute('quality') == filter.toString())
            items.forEach(item => {
                (item as HTMLElement).style.display = 'none'
            })
        }
    })
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function handleDragStartEquipableItem(this: any) {
    // @ts-ignore
    artifactAltSimple(this.getAttribute('itemid'), 0)
    this.style.opacity = '0.4'
    state.currentElement = this
}

function handleDragEndEquipableItem(this: any) {
    this.style.opacity = '1'
}

function handleDragOver(e: Event) {
    if(e.preventDefault) {
        e.preventDefault()
    }
    return false
}

function handleDropEquipableItemOnStaticItemBox(this: any, e: Event) {
    if(!state.currentElement) {
        return
    }
    if(e.stopPropagation) {
        e.stopPropagation()
    }
    if(state.currentElement != this &&
        this.childElementCount == 0 &&
        state.currentElement?.getAttribute('type') == this.getAttribute('type')) {
        itemsManager.putOnItem(state.currentElement)
    }
    return false
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    if(e.stopPropagation) {
        e.stopPropagation()
    }

    if(state.currentElement?.getAttribute('weapon')) {
        itemsManager.putOffWeapon(state.currentElement)
    } else {
        itemsManager.putOffItem(state.currentElement!.parentElement!)
    }
    filterWithResettingArmorType()
    return false
}

function handleClickEquipableItem(this: any, e: MouseEvent) {
    if(e.detail == 1) {
        return
    }
    if(this.getAttribute('equiped') != 'true' && e.detail == 2) {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        state.currentElement = this
        itemsManager.putOnItem(this)
        return
    }
    if(this.getAttribute('equiped') == 'true' && e.detail == 2) {
        if(this.getAttribute('weapon')) {
            itemsManager.putOffWeapon(this)
        } else {
            itemsManager.putOffItem(this.parentElement)
        }
        filterWithResettingArmorType()
        e.stopPropagation()
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}

///////////////////////////////////////////////////////////////////////////////////////////////////

class ItemsManager {

    parsingItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers', 'rings', 'amulets', 'arcats']
    armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver', 'ring1', 'ring2', 'amulet1', 'amulet2']

    setupWearedItems(wearedItems: InventoryItems) {
        let arr: HTMLDivElement[] = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(wearedItems[type]))
        }
        setManager.equipedCurrentItemIds = arr.map(i => i.getAttribute('itemid') as string)

        arr.forEach(function(item) {
            setupEquipableItemEvents(item)
        })
        let self = this
        arr.forEach(item => {
            state.currentElement = item
            self.putOnItem(item)
            state.currentElement = null
        })
        let loadedSet = setManager.sets.filter(set => difference(setManager.equipedCurrentItemIds, set.ids).size == 0 && difference(set.ids, setManager.equipedCurrentItemIds).size == 0)[0]
        if(loadedSet) {
            setManager.currentSet = loadedSet
            let article = Array.from(setManager.setsBox!.children).filter(box => box.id == loadedSet.id)[0] as HTMLElement
            article.click()
        }
    }

    setupAllItems(allItems: InventoryItems) {
        let arr: HTMLDivElement[] = []
        for(const type of this.parsingItemTypes) {
            arr = arr.concat(this.convertItemIntoDiv(allItems[type]))
        }
        arr.forEach(item => {
            let parent = document.querySelector('.currentItems')
            parent?.appendChild(item)
        })

        let items = document.querySelectorAll('.currentItems .box')
        items.forEach(function(item) {
            setupEquipableItemEvents(item as HTMLElement)
        })

        let equip_items = document.querySelectorAll('.equippedItems .boxStatic')
        equip_items.forEach(function(item) {
            item.addEventListener('dragover', handleDragOver, false)
            item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
        })

        let all_items = document.querySelectorAll('.currentItems')
        all_items.forEach(function(item) {
            item.addEventListener('drop', handleDropEquipableItemIntoAllItems, false)
            item.addEventListener('dragover', handleDragOver, false)
        })

        this.armorTypes.forEach(t => {
            document.getElementById(t + 'Box')?.addEventListener('click', () => {
                if(document.getElementById(t + 'Box')?.childElementCount == 1) {
                    return
                }
                if(document.getElementById(t + 'Box')!.style.border == '' && document.getElementById(t + 'Box')?.childElementCount == 0) {
                    if(state.armorTypeSelected != null) {
                        filterWithResettingArmorType()
                    }
                    document.getElementById(t + 'Box')!.style.border = '3px dotted #666'
                    if(t.includes('ring') || t.includes('amulet') || t.includes('arcat')) {
                        state.armorTypeSlotSelected = t.slice(t.length - 1, t.length)
                        t = t.slice(0, t.length - 1)
                    }
                    state.armorTypeSelected = t
                    filterCurrentItems()
                    if(state.armorTypeSlotSelected) {
                        t = t + state.armorTypeSlotSelected
                    }
                } else {
                    filterWithResettingArmorType()
                }
            })
        })
    }

    convertItemIntoDiv(items: InventoryItem[]) {
        return items.map(item => {
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = true
            divItem.setAttribute('equiped', 'false')
            divItem.style.backgroundImage = `url('${window.dressingAPI.baseUrl()}/${item.image}')`
            divItem.style.backgroundRepeat = 'no-repeat'
            divItem.style.backgroundSize = 'cover'
            divItem.setAttribute('type', this.getType(item.kind_id.toString()))
            divItem.setAttribute('quality', item.quality)
            divItem.setAttribute('itemId', item.id)
            divItem.setAttribute('trend', item.trend ?? "Универсал")
            if(item.kind_id == '12') {
                divItem.setAttribute('weapon', '2h')
            }
            if(item.kind_id == '10') {
                divItem.setAttribute('weapon', '1h')
            }
            if(item.kind_id == '44' || item.kind_id == '17') {
                divItem.setAttribute('weapon', 'off')
            }
            return divItem
        })
    }

    getType(kind_id: string) {
        if(kind_id == '1') {
            return 'helmet'
        }
        if(kind_id == '7') {
            return 'shoulders'
        }
        if(kind_id == '5' || kind_id == '77' || kind_id == '120') {
            return 'bracers'
        }
        if(kind_id == '10' || kind_id == '12') {
            return 'mainWeapon'
        }
        if(kind_id == '44' || kind_id == '17') {
            return 'offhandWeapon'
        }
        if(kind_id == '20' || kind_id == '3') {
            return 'cuirass'
        }
        if(kind_id == '6') {
            return 'leggings'
        }
        if(kind_id == '21' || kind_id == '4') {
            return 'chainmail'
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
        if(kind_id == '76' || kind_id == '18') {
            return 'ring'
        }
        if(kind_id == '25') {
            return 'amulet'
        }
        if(kind_id == '161') {
            return 'arcat'
        }
        return 'other'
    }

    createArcatSlot(id: number) {
        let parent = document.querySelector('#arcats')
        let arcatElement = document.createElement('div')
        let slotElement = document.createElement('div')
        slotElement.setAttribute('type', 'arcat')
        slotElement.id = `arcat${id + 1}Box`
        slotElement.className = 'boxStatic small'
        arcatElement.appendChild(slotElement)
        parent?.appendChild(arcatElement)
    }

    putOffItem(element: HTMLElement) {
        let item = element.firstElementChild as HTMLElement
        if(item) {
            element.style.visibility = 'visible'
            item.setAttribute('equiped', 'false')
            if(item.getAttribute('type') == 'ring' || item.getAttribute('type') == 'amulet' || item.getAttribute('type') == 'arcat') {
                let number = item.parentElement!.id.slice(item.getAttribute('type')!.length, item.getAttribute('type')!.length + 1)
                state[item.getAttribute('type') + number]!.item = null
            } else {
                state[item.getAttribute('type')!].item = null
            }
            if(item.getAttribute('copy')) {
                element.removeChild(item)
            } else {
                if(item.getAttribute('type')) {
                    item.style.width = '70px'
                    item.style.height = '70px'
                }
                document.querySelector('.currentItems')?.appendChild(item)
            }
            let equipedStyles = state.getEquipedItems().map(i => i.getAttribute('trend'))
            let uniqueStyles = new Set(equipedStyles)
            if(uniqueStyles.size == 0 || uniqueStyles.size == 1 && uniqueStyles.has('Универсал')) {
                state.currentStyle = null
                filterCurrentItems()
            }
        }
    }

    putOnItem(item: HTMLElement) {
        if(item.getAttribute('trend') != 'Универсал') {
            state.currentStyle = item.getAttribute('trend')
        }
        let type = item.getAttribute('type') ?? ''
        if(state.currentElement?.getAttribute('weapon') && !item.getAttribute('copy')) {
            if(state.currentElement.getAttribute('weapon') == '2h') {
                this.putOffWeapon(state.currentElement)
                let mainWeaponCopy = state.currentElement.cloneNode(true) as HTMLElement
                mainWeaponCopy.setAttribute('type', 'offhandWeapon')
                mainWeaponCopy.setAttribute('copy', 'true')
                mainWeaponCopy.style.opacity = '0.4'
                setupEquipableItemEvents(mainWeaponCopy)
                this.putOnItem(mainWeaponCopy)
            } else {
                this.putOffWeapon(state.currentElement)
            }
        } else {
            if(item.getAttribute('type') == 'ring' || item.getAttribute('type') == 'amulet') {
                type = item.getAttribute('type')! + 1
                if(document.querySelector(`#${type}Box`)?.childElementCount == 1) {
                    type = item.getAttribute('type')! + 2
                }
                let itemBox = document.querySelector(`#${type}Box`) as HTMLElement
                this.putOffItem(itemBox)
                item.style.height = '25px';
                item.style.width = '25px';
            } else if(item.getAttribute('type') == 'arcat') {
                const defType = type
                for(var i = 1; i <= state.arcatsCount; i++) {
                    type = defType! + i
                    if(document.querySelector(`#${type}Box`)?.childElementCount == 1) {
                        continue
                    } else {
                        break
                    }
                }
                let itemBox = document.querySelector(`#${type}Box`) as HTMLElement
                this.putOffItem(itemBox)
                item.style.height = '25px';
                item.style.width = '25px';
            } else {
                let itemBox = document.querySelector(`#${type}Box`) as HTMLElement
                this.putOffItem(itemBox)
            }
        }
        state[type].item = item
        if(item.parentElement?.childElementCount == 1) {
            let par = item.parentElement
            par.style.visibility = 'visible'
        }
        state[type].box.appendChild(item)
        state[type].box.style.visibility = 'hidden'
        state[type].box.firstElementChild.style.visibility = 'visible'
        item.setAttribute('equiped', 'true')
        filterWithResettingArmorType()
        filterCurrentItems()
    }

    putOffWeapon(item: HTMLElement) {
        if(item.getAttribute('weapon') == '2h') {
            this.putOffItem(state.offhandWeapon.box!)
            this.putOffItem(state.mainWeapon.box!)
        }
        if(item.getAttribute('weapon') == '1h') {
            if(state.mainWeapon.item) {
                if(state.mainWeapon.item.getAttribute('weapon') == '2h') {
                    this.putOffWeapon(state.mainWeapon.item)
                } else {
                    this.putOffItem(state.mainWeapon.box!)
                }
            }
        }
        if(item.getAttribute('weapon') == 'off') {
            if(state.offhandWeapon.item) {
                if(state.offhandWeapon.item.getAttribute('weapon') == '2h') {
                    this.putOffWeapon(state.offhandWeapon.item)
                } else {
                    this.putOffItem(state.offhandWeapon.box!)
                }
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

interface DressingItem {
    id: string, title: string, ids: string[], style: string | null, magicSchool: string | null
}

class SetManager {
    sets: DressingItem[] = []
    currentSet: DressingItem | null | undefined
    equipedCurrentItemIds: string[] = []
    curDragSet: HTMLElement | null | undefined

    #article = 'leaderboard__profile'
    #activeArticle = 'leaderboard__profile active'

    get setsBox() {
        return document.querySelector('.sets')
    }

    get setTitleBox() {
        return document.querySelector('#currentSetTitle') as HTMLInputElement
    }

    get allCurrentItems() {
        return Array.from(document.querySelector('.currentItems')?.children ?? [])
    }

    pushSet(newSet: DressingItem) {
        let set = this.sets.find(e => e.id == newSet.id)
        if(!set) {
            this.sets.push(newSet)
        } else {
            this.sets[this.sets.indexOf(set)] = newSet
        }
    }

    setupListeners() {
        let self = this
        document.getElementById('addSetButton')?.addEventListener('click', e => {
            self.addNewSet()
        })
        document.getElementById('saveSet')?.addEventListener('click', e => {
            self.saveSet()
        })
        document.getElementById('unequip')?.addEventListener('click', e => {
            self.unequip()
        })
        document.getElementById('equipSet')?.addEventListener('click', e => {
            self.equipSelectedSet()
        })
        let dropSetButton = document.getElementById('dropSetButton')
        dropSetButton?.addEventListener('drop', function(e) {
            e.preventDefault()
            self.deleteSet()
        }, false)
        dropSetButton?.addEventListener('dragover', function(e) {
            e.preventDefault()
        }, false)
    }

    deleteSet() {
        let id = this.curDragSet!.id 
        let removedItem = this.sets.filter(set => set.id == id)[0]
        this.sets = this.sets.removeItem(removedItem)
        this.curDragSet!.parentElement!.removeChild(this.curDragSet as Node)
        if(this.currentSet == removedItem) {
            this.unequip()
        }
        window.dressingAPI.removeSet(id)
    }

    addNewSet() {
        state.currentStyle = null
        this.deselectOtherArticles()
        this.unequip()
        let id = this.#generateSetId()
        let newSet: DressingItem = {
            id: id,
            title: 'Default set',
            ids: [],
            style: null,
            magicSchool: null
        }
        let article = this.createSetArticleElement(newSet, true)
        this.setTitleBox.value = 'Default set'
        this.setsBox?.insertBefore(article, this.setsBox.firstElementChild!.nextElementSibling)
        this.currentSet = newSet
        this.pushSet(newSet)
        this.saveSet()
        filterCurrentItems()
    }

    loadSets() {
        this.sets = window.dressingAPI.loadSets()
    }

    fillSets() {
        if(this.sets.length != 0) {
            for(var set of this.sets) {
                let article = this.createSetArticleElement(set)
                this.setsBox?.appendChild(article)
            }
        }
    }

    createSetArticleElement(set: DressingItem, active: boolean = false): HTMLElement {
        let article = document.createElement('article')
        article.id = set.id
        article.draggable = true
        let className = active ? this.#activeArticle : this.#article
        article.className = className
        var self = this
        article.onclick = function(e) {
            self.selectSet(this as HTMLElement)
        }

        if(article.id != 'addSetButton') {
            const self = this
            article.addEventListener('dragstart', function(e) {
                self.curDragSet = article
                article.style.opacity = '0.4'
            }, false)
            article.addEventListener('dragend', function() {
                self.curDragSet = null
                article.style.opacity = '1'
            }, false)
            article.addEventListener('dragover', function(e) {
                if(e.preventDefault) {
                    e.preventDefault()
                }
                return false
            })
        }

        let img = document.createElement('img')
        img.src = './images/magic/' + SetStyleHelper.getMagicIcon(set.magicSchool ?? '') + '.webp'
        img.className = 'leaderboard__picture'
        article.appendChild(img)

        let span = document.createElement('span')
        span.className = 'leaderboard__name'
        span.textContent = set.title
        article.appendChild(span)
        return article
    }

    selectSet(element: HTMLElement) {
        if(element.className == this.#activeArticle) {
            return
        }
        this.deselectOtherArticles()
        this.unequip()
        element.className = this.#activeArticle
        let selectedSet = this.sets.find(obj => obj.id == element.id)
        this.currentSet = selectedSet
        state.currentStyle = selectedSet!.style
        this.equipFromSet(selectedSet!.ids)
        this.setTitleBox.value = selectedSet!.title
        state.getEquipedItems().map(i => i.style.display = 'inline-block')
        filterCurrentItems()
    }

    saveSet() {
        let items = state.getEquipedItems()
        let title = this.setTitleBox.value
        let ids = items.map(i => i.getAttribute('itemid'))

        let setArticles = Array.from(setManager.setsBox!.children)
        let activeSet = setArticles.filter(e => e.id != 'addSetButton' && e.className == this.#activeArticle)[0]
        let id = null
        var isNew = true
        if(activeSet && this.currentSet) {
            id = this.currentSet.id
            isNew = false
            activeSet.lastElementChild!.textContent = title
        } else {
            id = this.#generateSetId()
        }
        let newSet: DressingItem = {
            id: id,
            title: title,
            ids: ids.map(a => a!).unique(),
            style: ids.length == 0 ? null : state.currentStyle,
            magicSchool: ids.length == 0 ? null : SetStyleHelper.getSchool(state.currentStyle!, state.currentMagicSchool!)
        }
        window.dressingAPI.saveSet(newSet)
        if(activeSet) {
            (activeSet.firstElementChild as HTMLInputElement).src = './images/magic/' + SetStyleHelper.getMagicIcon(newSet.magicSchool!) + '.webp'
        }
        this.pushSet(newSet)
        this.currentSet = newSet
        if(isNew) {
            let article = this.createSetArticleElement(newSet, true)
            this.setsBox?.insertBefore(article, this.setsBox?.firstElementChild!.nextSibling)
        }
    }

    deselectOtherArticles() {
        let self = this
        Array.from(this.setsBox?.children ?? []).forEach(e => {
            if(e.tagName == 'ARTICLE') {
                e.className = self.#article
            }
        })
    }

    unequip() {
        let items = state.getEquipedItems()
        for(var item of items) {
            itemsManager.putOffItem(item.parentElement!)
        }
    }

    equipFromSet(ids: string[]) {
        for(var id of ids) {
            let item = this.allCurrentItems.filter(element => element.getAttribute('itemid') == id)[0]
            if(item) {
                state.currentElement = item as HTMLElement
                itemsManager.putOnItem(item as HTMLElement)
                state.currentElement = null
            } else {
                console.log('SOMETHING WRONG', id)
                return
            }
        }
    }

    #generateSetId() {
        return 'set_' + generateRandomId()
    }

    async equipSelectedSet() {
        if(!this.currentSet) {
            return
        }
        let styleChanged = false
        if(this.currentSet.magicSchool && state.currentMagicSchool != this.currentSet.magicSchool) {
            let styleId = SetStyleHelper.getStyleId(this.currentSet.magicSchool)
            await window.dressingAPI.changeStyle(state.zikkuratId, styleId)
            state.currentMagicSchool = this.currentSet.magicSchool
            styleChanged = true
        }
        if(styleChanged) {
            const result = await window.dressingAPI.loadItemsData(['wearedItems'])
            const parsedWearedItems = parse(result.wearedItems)
            let arr: InventoryItem[] = []
            for(const type of itemsManager.parsingItemTypes) {
                arr = arr.concat(parsedWearedItems[type])
            }
            this.equipedCurrentItemIds = arr.map(i => i.id!)
        }
        const needToPutOn = difference(this.currentSet.ids, this.equipedCurrentItemIds)
        const needToPutOff = difference(this.equipedCurrentItemIds, this.currentSet.ids)

        for(var id of needToPutOff) {
            await window.dressingAPI.unequipRequest(id)
            this.equipedCurrentItemIds.removeItem(id)
        }
        for(var id of needToPutOn) {
            await window.dressingAPI.equipRequest(id)
            this.equipedCurrentItemIds.push(id)
        }
    }

    setup() {
        this.loadSets()
        this.fillSets()
        this.setupListeners()
    }
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SetStyleHelper = {
    magmarSchools: ['Огонь', 'Земля', 'Тень'],
    humanSchools: ['Воздух', 'Свет', 'Вода'],
    getStyleId(name: string): number {
        if(name == 'Огонь') {
            return 8
        }
        if(name == 'Воздух') {
            return 1
        }
        if(name == 'Земля') {
            return 16
        }
        if(name == 'Вода') {
            return 2
        }
        if(name == 'Тень') {
            return 32
        }
        if(name == 'Свет') {
            return 4
        }
        return 0
    },
    getSchool(style: string, currentSchool: string): string | null {
        if(SetStyleHelper.magmarSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Огонь'
            }
            if(style == 'Тяжеловес') {
                return 'Земля'
            }
            if(style == 'Ловкач') {
                return 'Тень'
            }
        }
        if(SetStyleHelper.humanSchools.includes(currentSchool)) {
            if(style == 'Костолом') {
                return 'Воздух'
            }
            if(style == 'Тяжеловес') {
                return 'Вода'
            }
            if(style == 'Ловкач') {
                return 'Свет'
            }
        }
        return null
    },
    getMagicIcon(magic: string): string {
        if(magic == 'Огонь') {
            return 'Fire'
        }
        if(magic == 'Земля') {
            return 'Earth'
        }
        if(magic == 'Тень') {
            return 'Dark'
        }
        if(magic == 'Воздух') {
            return 'Wind'
        }
        if(magic == 'Вода') {
            return 'Water'
        }
        if(magic == 'Свет') {
            return 'Light'
        }
        return 'Default'
    }
}