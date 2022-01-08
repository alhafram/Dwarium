var art_alt = null

// @ts-ignore Temporary solution for hack in simple_alt.js
// window.myAPI = {}
// @ts-ignore Temporary solution for hack in simple_alt.js
// window.myAPI.baseUrl = function() {
//     return window.dressingAPI.baseUrl()
// }

interface ArcatSpotState {
    number: number,
    enabled: boolean,
    arcat: HTMLDivElement | null
}

interface DressingSet {
    id: string,
    title: string,
    ids: string[],
    style: string,
    magicSchool: string | null
}

enum DressingFilterColor {
    GRAY = 'i_gray',
    GREEN = 'i_green',
    BLUE = 'i_blue',
    PURPLE = 'i_purple',
    RED = 'i_red'
}

function getQuality(filter: DressingFilterColor): string {
    switch(filter) {
        case DressingFilterColor.GRAY:
            return '0'
        case DressingFilterColor.GREEN:
            return '1'
            case DressingFilterColor.BLUE:
            return '2'
        case DressingFilterColor.PURPLE:
            return '3'
        case DressingFilterColor.RED:
            return '4'
    }
}

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
    title: string, 
    desc: any, 
    kind_id: string, 
    type_id: string,
    skills: [{ value: any, title: string }],
    quality: string,
    image: string,
    trend: string
}

interface Inventory {
    [key: string]: InventoryItem[]
    // arcats: InventoryItem[]
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


interface WearedItemState {
    box(): HTMLElement,
    item?: HTMLElement | null
}

export interface DressingWindowState {
    currentDraggableItem: HTMLDivElement | null,
    selectedStaticItemBox: {
        box: HTMLDivElement,
        type: string
    } | null,
    needToDeselect: HTMLDivElement | null,
    needToEquip: HTMLDivElement | null,
    needToPutOff: HTMLDivElement | null | undefined,

    arcats: ArcatSpotState[],

    activeFilters: DressingFilterColor[],
    sets: DressingSet[],
    currentSet?: DressingSet | null,
    currentStyle: string | null,
    currentMagicSchool: string | null,

    allItems: HTMLDivElement[],
    deafultWearedItems: HTMLDivElement[],
    arcatsCount: number,
    itemsRendered: boolean,
    needToRender: boolean,
    currentEquipedItems: HTMLDivElement[]
}

const Elements = {
    helmetBox(): HTMLDivElement {
        return document.getElementById('helmetBox') as HTMLDivElement
    },
    shouldersBox(): HTMLDivElement {
        return document.getElementById('shouldersBox') as HTMLDivElement
    },
    bracersBox(): HTMLDivElement {
        return document.getElementById('bracersBox') as HTMLDivElement
    },
    mainWeaponBox(): HTMLDivElement {
        return document.getElementById('mainWeaponBox') as HTMLDivElement
    },
    offhandWeaponBox(): HTMLDivElement {
        return document.getElementById('offhandWeaponBox') as HTMLDivElement
    },
    cuirassBox(): HTMLDivElement {
        return document.getElementById('cuirassBox') as HTMLDivElement
    },
    leggingsBox(): HTMLDivElement {
        return document.getElementById('leggingsBox') as HTMLDivElement
    },
    chainmailBox(): HTMLDivElement {
        return document.getElementById('chainmailBox') as HTMLDivElement
    },
    bootsBox(): HTMLDivElement {
        return document.getElementById('bootsBox') as HTMLDivElement
    },
    bowBox(): HTMLDivElement {
        return document.getElementById('bowBox') as HTMLDivElement
    },
    quiverBox(): HTMLDivElement {
        return document.getElementById('quiverBox') as HTMLDivElement
    },
    ringBox(): HTMLDivElement {
        if(this.ring1Box().childElementCount == 0) {
            return this.ring1Box()
        } else {
            return this.ring2Box()
        }
    },
    ring1Box(): HTMLDivElement {
        return document.getElementById('ring1Box') as HTMLDivElement
    },
    ring2Box(): HTMLDivElement {
        return document.getElementById('ring2Box') as HTMLDivElement
    },
    amuletBox(): HTMLDivElement {
        if(this.amulet1Box().childElementCount == 0) {
            return this.amulet1Box()
        } else {
            return this.amulet2Box()
        }
    },
    amulet1Box(): HTMLDivElement {
        return document.getElementById('amulet1Box') as HTMLDivElement
    },
    amulet2Box(): HTMLDivElement {
        return document.getElementById('amulet2Box') as HTMLDivElement
    },
    inventoryBox(): HTMLDivElement {
        return document.getElementsByClassName('currentItems')[0] as HTMLDivElement
    },
    arcatBox(): HTMLDivElement {
        if(this.arcat1Box().childElementCount == 0) {
            return this.arcat1Box()
        }
        if(!this.arcat2Box()) {
            return this.arcat1Box()
        }
        if(this.arcat2Box().childElementCount == 0) {
            return this.arcat2Box()
        }
        if(!this.arcat3Box()) {
            return this.arcat2Box()
        }
        if(this.arcat3Box().childElementCount == 0) {
            return this.arcat3Box()
        }
        if(!this.arcat4Box()) {
            return this.arcat3Box()
        }
        if(this.arcat4Box().childElementCount == 0) {
            return this.arcat4Box()
        } else {
            return this.arcat4Box()
        }
    },
    arcat1Box(): HTMLDivElement {
        return document.getElementById('arcat1Box') as HTMLDivElement
    },
    arcat2Box(): HTMLDivElement {
        return document.getElementById('arcat2Box') as HTMLDivElement
    },
    arcat3Box(): HTMLDivElement {
        return document.getElementById('arcat3Box') as HTMLDivElement
    },
    arcat4Box(): HTMLDivElement {
        return document.getElementById('arcat4Box') as HTMLDivElement
    }
}

var initialState: DressingWindowState = {
    currentDraggableItem: null,
    selectedStaticItemBox: null,
    needToDeselect: null,
    needToEquip: null,
    needToPutOff: null,
    arcats: [],
    activeFilters: [],
    sets: [],
    currentSet: null,
    allItems: [],
    currentStyle: null,
    currentMagicSchool: null,
    deafultWearedItems: [],
    arcatsCount: 0,
    itemsRendered: false,
    needToRender: false,
    currentEquipedItems: []
}

enum DressingWindowActions {
    LOAD_ITEMS,
    INVENTORY_RENDERED,

    // LOAD_SETS,
    // ADD_SET,
    // REMOVE_SET,
    // SELECT_SET,

    SELECT_PLACEHOLDER,
    DESELECT_PLACEHOLDER,

    START_DRAGGING_ITEM,
    END_DRAGGING_ITEM,

    UNEQUIP_ITEM,
    UNEQUIP_ITEM_DONE,
    EQUIP,
    EQUIP_DONE,

    ADD_FILTER,
    REMOVE_FILTER
}

enum InventoryItemType {
    HELMET = 'helmet',
    SHOULDERS = 'shoulders',
    BRACERS = 'bracers',
    MAIN_WEAPON = 'mainWeapon',
    OFFHAND_WEAPON = 'offhandWeapon',
    CUIRASS = 'cuirass',
    LEGGINGS = 'leggings',
    CHAINMAIL = 'chainmail',
    BOOTS = 'boots',
    BOW = 'bow',
    QUIVER = 'quiver',
    RING = 'ring',
    AMULET = 'amulet',
    ARCAT = 'arcat',
    OTHER = 'other'
}

function parse(art_alt: InventoryItem[]): Inventory {
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

function convertItemIntoDiv(item: InventoryItem): HTMLDivElement {
    let divItem = document.createElement('div')
    divItem.className = 'box'
    divItem.draggable = true
    divItem.setAttribute('equiped', 'false')
    divItem.style.backgroundImage = `url('${window.dressingAPI.baseUrl()}/${item.image}')`
    divItem.style.backgroundRepeat = 'no-repeat'
    divItem.style.backgroundSize = 'cover'
    divItem.setAttribute('type', getType(item.kind_id))
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
}

function getType(kind_id: string): InventoryItemType {
    if(kind_id == '1') {
        return InventoryItemType.HELMET
    }
    if(kind_id == '7') {
        return InventoryItemType.SHOULDERS
    }
    if(kind_id == '5' || kind_id == '77' || kind_id == '120') {
        return InventoryItemType.BRACERS
    }
    if(kind_id == '10' || kind_id == '12') {
        return InventoryItemType.MAIN_WEAPON
    }
    if(kind_id == '44' || kind_id == '17') {
        return InventoryItemType.OFFHAND_WEAPON
    }
    if(kind_id == '20' || kind_id == '3') {
        return InventoryItemType.CUIRASS
    }
    if(kind_id == '6') {
        return InventoryItemType.LEGGINGS
    }
    if(kind_id == '21' || kind_id == '4') {
        return InventoryItemType.CHAINMAIL
    }
    if(kind_id == '2') {
        return InventoryItemType.BOOTS
    }
    if(kind_id == '131') {
        return InventoryItemType.QUIVER
    }
    if(kind_id == '116') {
        return InventoryItemType.BOW
    }
    if(kind_id == '76' || kind_id == '18') {
        return InventoryItemType.RING
    }
    if(kind_id == '25') {
        return InventoryItemType.AMULET
    }
    if(kind_id == '161') {
        return InventoryItemType.ARCAT
    }
    return InventoryItemType.OTHER
}

function getStyle(items: HTMLDivElement[]): string | null {
    const styles = items.map(item => item.getAttribute('trend') ?? '')
    const uniqueStyles = new Set(styles)
    uniqueStyles.delete('Универсал')
    return uniqueStyles.size == 0 ? null : Array.from(uniqueStyles)[0]
}

function handleDragStartEquipableItem(this: any) {
    dispatch(DressingWindowActions.START_DRAGGING_ITEM, this)
}

function handleDragEndEquipableItem() {
    dispatch(DressingWindowActions.END_DRAGGING_ITEM)
}

function handleDragOver(e: Event) {
    e.preventDefault()
}

function handleDropEquipableItemOnStaticItemBox(this: any, e: Event) {
    e.stopPropagation()
    dispatch(DressingWindowActions.END_DRAGGING_ITEM, this)
}

function handleDropEquipableItemIntoAllItems(this: any, e: Event) {
    e.stopPropagation()
    dispatch(DressingWindowActions.UNEQUIP_ITEM)
}

function handleClickEquipableItem(this: any, e: MouseEvent) {
    e.stopPropagation()
    if(e.detail == 1) {
        return
    }
    if(this.getAttribute('equiped') != 'true' && e.detail == 2) {
        dispatch(DressingWindowActions.EQUIP, this)
    }
    if(this.getAttribute('equiped') == 'true' && e.detail == 2) {
        dispatch(DressingWindowActions.UNEQUIP_ITEM, this)
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.addEventListener('click', handleClickEquipableItem, false)
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        // artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        // artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}

function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onchange = function(e) {
            dispatch(element.checked ? DressingWindowActions.REMOVE_FILTER : DressingWindowActions.ADD_FILTER, key)
        }
    }
}

function createArcatSlot(id: number) {
    let parent = document.getElementById('arcats')
    let slotElement = document.createElement('div')
    slotElement.setAttribute('type', 'arcat')
    slotElement.id = `arcat${id + 1}Box`
    slotElement.className = 'boxStatic small'
    setupPlaceholderForRepeatableItems(slotElement)
    parent?.appendChild(slotElement)
}

function setupPlaceholderForRepeatableItems(item: HTMLElement) {
    item.addEventListener('click', () => {
        if(initialState.selectedStaticItemBox && initialState.selectedStaticItemBox.box == item) {
            dispatch(DressingWindowActions.DESELECT_PLACEHOLDER, initialState.selectedStaticItemBox.box)
        } else {
            dispatch(DressingWindowActions.SELECT_PLACEHOLDER, item)
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

async function reduce(state: DressingWindowState = initialState, action: DressingWindowActions, data?: any): Promise<DressingWindowState> {
    let needToEquip = null
    let newFilters: DressingFilterColor[] = []
    let equipedItems = initialState.currentEquipedItems
    switch(action) {
        case DressingWindowActions.LOAD_ITEMS:
            let result = await window.dressingAPI.loadItemsData(['allItems', 'wearedItems'])
            let parsedAllItems = parse(result.allItems)
            let parsedWearedItems = parse(result.wearedItems)
            const parsedItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers', 'rings', 'amulets', 'arcats']
            let allItems = Object.keys(parsedAllItems).filter(key => parsedItemTypes.includes(key)).map(key => parsedAllItems[key]).flat() as InventoryItem[]
            let wearedItems = Object.keys(parsedWearedItems).filter(key => parsedItemTypes.includes(key)).map(key => parsedWearedItems[key]).flat() as InventoryItem[]
            const allItemDivs = allItems.map(item => convertItemIntoDiv(item))
            const wearedItemDivs = wearedItems.map(item => convertItemIntoDiv(item))
            let currentMagicSchool = null
            if(parsedAllItems.zikkurat.length != 0) {
                const zikkuratId = parsedAllItems.zikkurat[0].id
                const res = await window.dressingAPI.getMagicSchools(zikkuratId)
                currentMagicSchool = parseMagicSchools(res.result)
            }
            const bracelet = parsedWearedItems.bracelets[0]
            var arcatsCount = 0
            if(bracelet) {
                arcatsCount = bracelet.skills.find(s => s.title === 'Слоты для аркатов')!.value.slice(4, 5) as number
            }
            return {
                ...state,
                allItems: allItemDivs,
                deafultWearedItems: wearedItemDivs,
                needToRender: true,
                currentMagicSchool: currentMagicSchool,
                arcatsCount: arcatsCount
            }
        case DressingWindowActions.INVENTORY_RENDERED:
            return {
                ...state,
                itemsRendered: true,
                needToRender: true
            }
        case DressingWindowActions.SELECT_PLACEHOLDER:
            let selectedBox = data as HTMLDivElement
            return {
                ...state,
                needToDeselect: initialState.selectedStaticItemBox?.box ?? null,
                selectedStaticItemBox: {
                    box: selectedBox,
                    type: selectedBox.getAttribute('type') ?? ''
                },
                needToRender: true
            }
        case DressingWindowActions.DESELECT_PLACEHOLDER:
            let needToDeselect = data as HTMLDivElement
            return {
                ...state,
                needToDeselect: needToDeselect,
                selectedStaticItemBox: null,
                needToRender: true
            }
        case DressingWindowActions.START_DRAGGING_ITEM:
            return {
                ...state,
                currentDraggableItem: data as HTMLDivElement,
                needToRender: false
            }
        case DressingWindowActions.END_DRAGGING_ITEM:
            needToEquip = null
            let staticBox = data as HTMLDivElement | null
            if(state.currentDraggableItem?.getAttribute('equiped') != 'true' && staticBox?.childElementCount == 0 && state.currentDraggableItem?.getAttribute('type') == staticBox.getAttribute('type')) {
                needToEquip = state.currentDraggableItem
            }
            return {
                ...state,
                needToEquip: needToEquip,
                needToRender: true,
                needToDeselect: initialState.selectedStaticItemBox?.box ?? null,
                selectedStaticItemBox: null,
                currentDraggableItem: null
            }
        case DressingWindowActions.UNEQUIP_ITEM:
            return {
                ...state,
                needToPutOff: initialState.currentDraggableItem ?? data as HTMLDivElement,
                needToRender: true,
                currentDraggableItem: null
            }
        case DressingWindowActions.UNEQUIP_ITEM_DONE:
            const unequipedItem = data as HTMLDivElement
            equipedItems = equipedItems.removeItem(unequipedItem)
            return {
                ...state,
                needToPutOff: null,
                needToRender: true,
                currentEquipedItems: equipedItems,
                currentStyle: getStyle(equipedItems)
            }
        case DressingWindowActions.EQUIP:
            needToEquip = data as HTMLDivElement
            return {
                ...state,
                needToEquip: needToEquip,
                needToRender: true,
                selectedStaticItemBox: null,
                needToDeselect: state.selectedStaticItemBox?.box ?? null
            }
        case DressingWindowActions.EQUIP_DONE:
            const equipedItem = data as HTMLDivElement
            equipedItems.push(equipedItem)
            return {
                ...state,
                needToEquip: null,
                needToRender: true,
                currentEquipedItems: equipedItems,
                currentStyle: getStyle(equipedItems)
            }
        case DressingWindowActions.ADD_FILTER:
            newFilters = initialState.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters,
                needToRender: true
            }
        case DressingWindowActions.REMOVE_FILTER:
            newFilters = initialState.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters,
                needToRender: true
            }
        default:
            return state
    }
}

async function dispatch(action: DressingWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    if(initialState.needToRender) {
        render()
    }
}

function render(): void {
    if(initialState.selectedStaticItemBox) {
        initialState.selectedStaticItemBox.box!.style.border = '3px dotted #666'
    } 
    if(initialState.needToDeselect) {
        initialState.needToDeselect.style.border = ''
    }
    if(!initialState.itemsRendered) {
        const allItemDivs = initialState.allItems
        allItemDivs.forEach(item => {
            let parent = document.querySelector('.currentItems')
            setupEquipableItemEvents(item as HTMLElement)
            parent?.appendChild(item)
        })
        if(initialState.arcatsCount != 0) {
            for(let i = 0; i < initialState.arcatsCount; i++) {
                createArcatSlot(i)
            }
        }
        let equip_items = document.querySelectorAll('.equippedItems .boxStatic')
        equip_items.forEach(function(item) {
            item.addEventListener('dragover', handleDragOver, false)
            item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
        })
        const armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver', 'ring1', 'ring2', 'amulet1', 'amulet2']
        armorTypes.forEach(t => {
            let itemBox = document.getElementById(t + 'Box') as HTMLElement
            if(['ring1', 'ring2', 'amulet1', 'amulet2'].includes(t)) {
                setupPlaceholderForRepeatableItems(itemBox)
            } else {
                let itemBox = document.getElementById(t + 'Box') as HTMLElement
                itemBox.addEventListener('click', () => {
                    if(initialState.selectedStaticItemBox && itemBox.getAttribute('type') == initialState.selectedStaticItemBox.type) {
                        dispatch(DressingWindowActions.DESELECT_PLACEHOLDER, itemBox)
                    } else {
                        dispatch(DressingWindowActions.SELECT_PLACEHOLDER, itemBox)
                    }
                })
            }
            itemBox.addEventListener('dragover', handleDragOver, false)
            itemBox.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
        })
        Elements.inventoryBox().addEventListener('dragover', handleDragOver, false)
        Elements.inventoryBox().addEventListener('drop', handleDropEquipableItemIntoAllItems, false)
        dispatch(DressingWindowActions.INVENTORY_RENDERED)
        setupFilters()
        return
    }
    for(const item of initialState.deafultWearedItems) {
        const box = eval(`Elements.${item.getAttribute('type')}Box()`) as HTMLDivElement
        setupEquipableItemEvents(item)
        dispatch(DressingWindowActions.EQUIP, item)
        initialState.deafultWearedItems.removeItem(item)
    }
    let needToPutOff = initialState.needToPutOff
    if(needToPutOff) {
        const isCopy = needToPutOff.getAttribute('copy') ?? false
        if(isCopy) {
            Elements.offhandWeaponBox().removeChild(needToPutOff)
            Elements.offhandWeaponBox().style.visibility = 'visible'
            const mainWeapon = Elements.mainWeaponBox().firstElementChild as HTMLDivElement
            mainWeapon.setAttribute('equiped', 'false')
            Elements.inventoryBox().appendChild(mainWeapon)
            Elements.mainWeaponBox().style.visibility = 'visible'
            needToPutOff = mainWeapon
        } else {
            const weapon = needToPutOff.getAttribute('weapon')
            if(weapon) {
                if(weapon == '2h') {
                    const copyWeapon = Elements.offhandWeaponBox().firstElementChild as HTMLElement
                    Elements.offhandWeaponBox().removeChild(copyWeapon)
                    Elements.offhandWeaponBox().style.visibility = 'visible'
                }
            }
            const parent = initialState.needToPutOff!.parentElement!
            parent.style.visibility = 'visible'
            needToPutOff.setAttribute('equiped', 'false')
            needToPutOff.className = 'box'
            Elements.inventoryBox().appendChild(needToPutOff)
        }
        dispatch(DressingWindowActions.UNEQUIP_ITEM_DONE, needToPutOff)
        return
    }
    if(initialState.needToEquip) {
        const item = initialState.needToEquip
        const itemBox = eval(`Elements.${item.getAttribute('type')}Box()`) as HTMLDivElement
        const isWeapon = item.getAttribute('weapon')
        if(itemBox.firstElementChild == item) {
            // HACK: - Dont know where is error
            initialState.needToEquip = null
            return
        }
        if(itemBox.childElementCount != 0) {
            dispatch(DressingWindowActions.UNEQUIP_ITEM, itemBox.firstChild)
            if(item.getAttribute('weapon') && item.getAttribute('weapon') == '2h') {
                dispatch(DressingWindowActions.UNEQUIP_ITEM, Elements.offhandWeaponBox().firstElementChild)
            }
            return
        }
        if(isWeapon && isWeapon == '2h') {
            const equipedOffhandItem = Elements.offhandWeaponBox().firstElementChild
            if(equipedOffhandItem && !equipedOffhandItem.getAttribute('copy')) {
                dispatch(DressingWindowActions.UNEQUIP_ITEM, equipedOffhandItem)
                return
            }
        }
        itemBox.appendChild(item)
        if(itemBox.getAttribute('type') == 'ring' || itemBox.getAttribute('type') == 'amulet' || itemBox.getAttribute('type') == 'arcat') {
            item.className = 'box small'
        }
        itemBox.style.visibility = 'hidden';
        (itemBox.firstElementChild as HTMLElement).style.visibility = 'visible'
        if(isWeapon) {
            if(isWeapon == "2h") {
                const copyWeapon = item.cloneNode(true) as HTMLElement
                copyWeapon.style.opacity = '0.6'
                copyWeapon.setAttribute('copy', 'true')
                copyWeapon.setAttribute('equiped', 'true')
                setupEquipableItemEvents(copyWeapon)
                Elements.offhandWeaponBox().style.visibility = 'hidden';
                Elements.offhandWeaponBox().appendChild(copyWeapon)
            }
        }
        item.setAttribute('equiped', 'true')
        dispatch(DressingWindowActions.EQUIP_DONE, item)
        return
    }
    const allItems = Array.from(document.querySelector('.currentItems')!.children) as HTMLDivElement[]
    allItems.forEach(item => item.style.display = 'block')
    if(initialState.activeFilters.length != 0) {
        for(const filter of initialState.activeFilters) {
            const filterQuality = getQuality(filter)
            let items = allItems.filter(e => e.getAttribute('quality') == filterQuality)
            items.forEach(item => {
                (item as HTMLElement).style.display = 'none'
            })
        }
    }
    if(initialState.selectedStaticItemBox) {
        const visibleItems = allItems.filter(item => item.style.display == 'block')
        visibleItems.forEach(item => {
             item.style.display = item.getAttribute('type') == initialState.selectedStaticItemBox?.type ? 'block' : 'none'
        })
    }
    if(initialState.currentStyle) {
        const visibleItems = allItems.filter(item => item.style.display == 'block')
        visibleItems.forEach(item => {
            item.style.display = (item.getAttribute('trend') == initialState.currentStyle || item.getAttribute('trend') == 'Универсал') ? 'block' : 'none'
        })
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(DressingWindowActions.LOAD_ITEMS)
})