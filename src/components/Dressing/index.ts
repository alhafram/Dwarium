let art_alt = null

type DressingSet = {
    id: string,
    title: string,
    ids: string[],
    style: string | null,
    magicSchool: string | null,
    isNew: boolean
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

type Arcats = {
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
    intelligence: InventoryItem
}

type InventoryItem = {
    id: string
    title: string, 
    desc: any, 
    kind_id: string, 
    type_id: string,
    skills: [{ value: any, title: string }],
    quality: string,
    image: string,
    trend: string | undefined
}

type Inventory = {
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

type DressingWindowState = {
    selectedStaticItemId: string | null,
    currentEquipedItems: InventoryItem[],
    allItems: InventoryItem[],
    arcats: InventoryItem[],
    rings: InventoryItem[],
    amulets: InventoryItem[],
    activeFilters: DressingFilterColor[],
    sets: DressingSet[],
    currentSet: DressingSet | null,
    currentStyle: string | null,
    currentMagicSchool: string | null,
    arcatsCount: number,
    zikkuratId: string | null
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
    },
    setsBox(): HTMLDivElement {
        return document.getElementsByClassName('sets')[0] as HTMLDivElement
    },
    setTitleBox(): HTMLInputElement {
        return document.getElementById('currentSetTitle') as HTMLInputElement
    },
    saveSetBox(): HTMLInputElement {
        return document.getElementById('saveSet') as HTMLInputElement
    },
    addSetBox(): HTMLInputElement {
        return document.getElementById('addSetButton') as HTMLInputElement
    },
    dropSetBox(): HTMLButtonElement {
        return document.getElementById('dropSetButton') as HTMLButtonElement
    },
    equipSetBox(): HTMLButtonElement {
        return document.getElementById('equipSet') as HTMLButtonElement
    },
    unequipBox(): HTMLButtonElement {
        return document.getElementById('unequip') as HTMLButtonElement
    },
    currentItemsBox(): HTMLDivElement {
        return document.getElementsByClassName('currentItems')[0] as HTMLDivElement
    },
    arcatsBox(): HTMLDivElement {
        return document.getElementById('arcats') as HTMLDivElement
    },
    staticBoxes(): HTMLCollection {
        return document.getElementsByClassName('boxStatic')
    }
}

var initialState: DressingWindowState = {
    selectedStaticItemId: null,
    currentEquipedItems: [],
    arcats: [],
    rings: [],
    amulets: [],
    activeFilters: [],
    sets: [],
    currentSet: null,
    allItems: [],
    currentStyle: null,
    currentMagicSchool: null,
    arcatsCount: 0,
    zikkuratId: null
}

enum DressingWindowActions {
    LOAD_CONTENT,
    CREATE_NEW_SET,
    SAVE_SET,
    REMOVE_SET,
    SELECT_SET,

    SELECT_PLACEHOLDER,
    DESELECT_PLACEHOLDER,

    UNEQUIP_ITEM,
    UNEQUIP_ALL,
    EQUIP,
    EQUIP_FROM_SET,

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

    let arcats = items.filter(i => i.kind_id == '161')
    items = items.removeItems(arcats)
    
    arcats = Object.values(filterArcats(arcats))
    arcats = arcats.filter(a => a)

    let quivers = items.filter(i => i.kind_id == '131')
    items = items.removeItems(quivers)

    let rings = items.filter(i => i.kind_id == '76' && i.type_id == '18')
    items = items.removeItems(rings)

    let bags = items.filter(i => i.kind_id == '30')
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

    let amulets = items.filter(i => i.kind_id == '25')
    items = items.removeItems(amulets)

    let profWeapons = items.filter(i => i.kind_id == '42')
    items = items.removeItems(profWeapons)

    let belts = items.filter(i => i.kind_id == '31')
    items = items.removeItems(belts)

    let bracelets = items.filter(i => i.kind_id == '137')
    items = items.removeItems(bracelets)

    let bows = items.filter(i => i.kind_id == '116')
    items = items.removeItems(bows)

    let helmets = items.filter(i => i.kind_id == '1')
    items = items.removeItems(helmets)

    let shoulders = items.filter(i => i.kind_id == '7')
    items = items.removeItems(shoulders)

    let bracersIds = ['5', '77', '120']
    let bracers = items.filter(i => bracersIds.includes(i.kind_id))
    items = items.removeItems(bracers)

    let mainWeaponsKindIds = ['10', '12'] // 10 - 1h --- 12 - 2h
    let mainWeapons = items.filter(i => mainWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(mainWeapons)

    let offhandWeaponsKindIds = ['44', '17'] // 44 - weapon --- 17 - shield
    let offhandWeapons = items.filter(i => offhandWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(offhandWeapons)

    let cuirassesIds = ['20', '3']
    let cuirasses = items.filter(i => cuirassesIds.includes(i.kind_id))
    items = items.removeItems(cuirasses)

    let leggings = items.filter(i => i.kind_id == '6')
    items = items.removeItems(leggings)

    let chainmailsIds = ['21', '4']
    let chainmails = items.filter(i => chainmailsIds.includes(i.kind_id))
    items = items.removeItems(chainmails)

    let boots = items.filter(i => i.kind_id == '2')
    items = items.removeItems(boots)

    let bannersIds = ['96']
    let banners = items.filter(i => bannersIds.includes(i.kind_id))
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
    if(item.image.includes(window.dressingAPI.baseUrl())) {
        divItem.style.backgroundImage = `url('${item.image}')`
    } else {
        const url = `${window.dressingAPI.baseUrl()}/${item.image}`
        item.image = url
        divItem.style.backgroundImage = `url('${url}')`
    }
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

function getStyle(items: InventoryItem[]): string | null {
    const styles = items.map(item => item.trend)
    const uniqueStyles = new Set(styles)
    uniqueStyles.delete('Универсал')
    uniqueStyles.delete(undefined)
    return uniqueStyles.size == 0 ? null : Array.from(uniqueStyles as Set<string>)[0]
}

let dragableItem: HTMLDivElement | null = null

function handleDragStartEquipableItem(this: any) {
    dragableItem = this
    // @ts-ignore
    artifactAltSimple(this.getAttribute('itemid'), 0)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
}

function handleDragOver(e: Event) {
    e.preventDefault()
}

function handleDropEquipableItemOnStaticItemBox(this: HTMLDivElement, e: Event) {
    e.stopPropagation()
    if(dragableItem?.getAttribute('equiped') == 'false' && this.getAttribute('type') == dragableItem?.getAttribute('type')) {
        dispatch(DressingWindowActions.EQUIP, dragableItem)
    }
}

function handleDropEquipableItemIntoAllItems(e: Event) {
    e.stopPropagation()
    dispatch(DressingWindowActions.UNEQUIP_ITEM, dragableItem)
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
    item.ondragover = handleDragOver
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.onclick = handleClickEquipableItem
    item.addEventListener('mouseover', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 2)
    }, false)
    item.addEventListener('mouseout', function() {
        // @ts-ignore
        artifactAltSimple(this.getAttribute('itemid'), 0)
    }, false)
}

function setupFilters() {
    for(const key of Object.values(DressingFilterColor)) {
        const element = document.getElementById(key) as HTMLInputElement
        element.onchange = function() {
            dispatch(element.checked ? DressingWindowActions.REMOVE_FILTER : DressingWindowActions.ADD_FILTER, key)
        }
    }
}

function createArcatSlot(id: number): HTMLDivElement {
    let slotElement = document.createElement('div')
    slotElement.setAttribute('type', 'arcat')
    slotElement.id = `arcat${id + 1}Box`
    slotElement.className = 'boxStatic small'
    return slotElement
}

function difference(setA: string[], setB: string[]): Set<string> {
    let _difference = new Set(setA)
    for(let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

function parseMagicSchools(result: any): string {
    let doc = result.toDocument() as Document
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
    let intelligence = arcats.filter(a => a.title.includes('интеллекта')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
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
        injury,
        intelligence
    }
}

let dragableSet: any = null
function createSetElement(set: DressingSet, active: boolean = false) {
    let article = document.createElement('article')
    article.id = set.id
    article.draggable = true
    let className = active ? 'leaderboard__profile active' : 'leaderboard__profile'
    article.className = className
    article.onclick = function(e) {
        dispatch(DressingWindowActions.SELECT_SET, set)
    }
    article.ondragstart = function() {
        article.style.opacity = '0.4'
        dragableSet = article
    }
    article.ondragend = function() {
        article.style.opacity = '1'
        dragableSet = null
    }
    article.ondragover = function(e) {
        e.preventDefault()
    }
    let img = document.createElement('img')
    img.src = './images/magic/' + SetStyleHelper.getMagicIcon(set.magicSchool) + '.webp'
    img.className = 'leaderboard__picture'
    article.appendChild(img)

    let span = document.createElement('span')
    span.className = 'leaderboard__name'
    span.textContent = set.title
    article.appendChild(span)
    return article
}

function generateSetId() {
    return 'set_' + window.utilsAPI.generateRandomId()
}

function addNewSet(): DressingSet {
    let id = generateSetId()
    let newSet: DressingSet = {
        id: id,
        title: 'Default set',
        ids: [],
        style: null,
        magicSchool: null,
        isNew: true
    }
    return newSet
}

const SetStyleHelper = {
    magmarSchools: ['Огонь', 'Земля', 'Тень'],
    humanSchools: ['Воздух', 'Свет', 'Вода'],
    getStyleId(name: string | null): number {
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
    getSchool(style: string | null, currentSchool: string | null): string | null {
        if(!style || !currentSchool) {
            return null
        }
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
    getMagicIcon(magic: string | null): string {
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

type RepeatableItems = {
    arcats: InventoryItem[],
    rings: InventoryItem[],
    amulets: InventoryItem[]
}

function countRepeatableItems(items: InventoryItem[]): RepeatableItems {
    let countedItems: RepeatableItems = {
        arcats: [],
        rings: [],
        amulets: []
    }
    items.forEach(item => {
        const type = getType(item.kind_id)
        switch(type) {
            case InventoryItemType.ARCAT:
                countedItems.arcats.push(item)
                break
            case InventoryItemType.RING:
                countedItems.rings.push(item)
                break
            case InventoryItemType.AMULET:
                countedItems.amulets.push(item)
                break
            default:
                break
        }
    })
    return countedItems
}

async function reduce(state: DressingWindowState = initialState, action: DressingWindowActions, data?: any): Promise<DressingWindowState> {
    let newFilters: DressingFilterColor[] = []
    let sets = state.sets
    let currentEquipedItems = state.currentEquipedItems
    let arcats = state.arcats
    let rings = state.rings
    let amulets = state.amulets
    const parsedItemTypes = ['helmets', 'shoulders', 'bracers', 'mainWeapons', 'offhandWeapons', 'cuirasses', 'leggings', 'chainmails', 'boots', 'bows', 'quivers', 'rings', 'amulets', 'arcats']
    switch(action) {
        case DressingWindowActions.LOAD_CONTENT:
            let result = await window.dressingAPI.loadItemsData(['allItems', 'wearedItems'])
            let parsedAllItems = parse(result.allItems)
            let parsedWearedItems = parse(result.wearedItems)
            let allItems = Object.keys(parsedAllItems).filter(key => parsedItemTypes.includes(key)).map(key => parsedAllItems[key]).flat() as InventoryItem[]
            currentEquipedItems = Object.keys(parsedWearedItems).filter(key => parsedItemTypes.includes(key)).map(key => parsedWearedItems[key]).flat() as InventoryItem[]
            let repeatableItems = countRepeatableItems(currentEquipedItems)
            // @ts-ignore
            allItems = allItems.concat(currentEquipedItems).sort((a, b) => a.kind_id - b.kind_id)
            let currentMagicSchool: string | null = null
            let zikkuratId = null
            if(parsedAllItems.zikkurat.length != 0) {
                zikkuratId = parsedAllItems.zikkurat[0].id
                const res = await window.dressingAPI.getMagicSchools(zikkuratId)
                currentMagicSchool = parseMagicSchools(res)
            }
            const bracelet = parsedWearedItems.bracelets[0]
            var arcatsCount = 0
            if(bracelet) {
                arcatsCount = bracelet.skills.find(s => s.title === 'Слоты для аркатов')!.value.slice(4, 5) as number
            }
            const loadedSets = window.dressingAPI.loadSets() as DressingSet[]
            let preselectSet = loadedSets.find(set => difference(currentEquipedItems.map(item => item.id), set.ids).size == 0 && difference(set.ids, currentEquipedItems.map(item => item.id)).size == 0) || null
            art_alt = Object.assign(result.allItems, result.wearedItems)
            return {
                ...state,
                allItems: allItems,
                currentEquipedItems: currentEquipedItems,
                currentMagicSchool: currentMagicSchool,
                arcatsCount: arcatsCount,
                sets: loadedSets,
                currentStyle: getStyle(currentEquipedItems),
                zikkuratId: zikkuratId,
                currentSet: preselectSet,
                arcats: repeatableItems.arcats,
                rings: repeatableItems.rings,
                amulets: repeatableItems.amulets
            }
        case DressingWindowActions.SELECT_PLACEHOLDER:
            let selectedBox = data as HTMLDivElement
            return {
                ...state,
                selectedStaticItemId: selectedBox.id
            }
        case DressingWindowActions.DESELECT_PLACEHOLDER:
            return {
                ...state,
                selectedStaticItemId: null
            }
        case DressingWindowActions.EQUIP:
            const equipedItemBox = data as HTMLDivElement
            const itemId = equipedItemBox.getAttribute('itemid')
            let equipedItem = state.allItems.find(item => item.id == itemId)
            if(!equipedItem) {
                alert("ШО ТО НЕ ТАК!!! Напиши в группу")
                return {
                    ...state
                }
            }
            const type = getType(equipedItem!.kind_id)
            switch(type) {
                case InventoryItemType.ARCAT:
                    if(arcats.length >= state.arcatsCount) {
                        currentEquipedItems = currentEquipedItems.removeItem(arcats.pop()!)
                    }
                    arcats.push(equipedItem!)
                    break
                case InventoryItemType.RING:
                    if(rings.length >= 2) {
                        currentEquipedItems = currentEquipedItems.removeItem(rings.pop()!) 
                    }
                    rings.push(equipedItem!)
                    break
                case InventoryItemType.AMULET:
                    if(amulets.length >= 2) {
                        currentEquipedItems = currentEquipedItems.removeItem(amulets.pop()!)
                    }
                    amulets.push(equipedItem!)
                    break
                default:
                    const alreadyEquipedItem = currentEquipedItems.find(item => getType(item.kind_id) == type)
                    if(alreadyEquipedItem) {
                        currentEquipedItems = currentEquipedItems.removeItem(alreadyEquipedItem)
                    }
                    const weapon = equipedItemBox.getAttribute('weapon')
                    if(weapon) {
                        if(weapon == '2h') {
                            const offhandWeaponBox = Elements.offhandWeaponBox().firstElementChild
                            const offhandWeaponId = offhandWeaponBox?.getAttribute('itemid')
                            const offhandWeaponItem = currentEquipedItems.find(item => item.id == offhandWeaponId)
                            if(offhandWeaponItem) {
                                currentEquipedItems = currentEquipedItems.removeItem(offhandWeaponItem)
                            }
                        }
                        const mainWeapon = Elements.mainWeaponBox().firstElementChild
                        if(weapon == 'off' && mainWeapon?.getAttribute('weapon') == '2h') {
                            const mainWeaponId = mainWeapon.getAttribute('itemid')
                            const mainWeaponItem = currentEquipedItems.find(item => item.id == mainWeaponId)
                            if(mainWeaponItem) {
                                currentEquipedItems = currentEquipedItems.removeItem(mainWeaponItem)
                            }
                        }
                    }
                    break
            }
            currentEquipedItems.push(equipedItem!)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems,
                currentStyle: getStyle(currentEquipedItems),
                selectedStaticItemId: null,
                arcats: arcats,
                rings: rings,
                amulets: amulets
            }
        case DressingWindowActions.UNEQUIP_ITEM:
            let unequipedElement = data as HTMLDivElement
            let unequipedItem = state.allItems.find(item => item.id == unequipedElement.getAttribute('itemid'))
            if(!unequipedItem) {
                alert("ШО ТО НЕ ТАК!!! Напиши в группу")
                return {
                    ...state
                }
            }
            const type1 = getType(unequipedItem!.kind_id)
            switch(type1) {
                case InventoryItemType.ARCAT:
                    arcats.removeItem(unequipedItem!)
                    break
                case InventoryItemType.RING:
                    rings.removeItem(unequipedItem!)
                    break
                case InventoryItemType.AMULET:
                    amulets.removeItem(unequipedItem!)
                    break
                default:
                    break
            }
            currentEquipedItems = currentEquipedItems.removeItem(unequipedItem!)
            return {
                ...state,
                currentEquipedItems: currentEquipedItems,
                currentStyle: getStyle(currentEquipedItems),
                selectedStaticItemId: null,
                arcats: arcats,
                rings: rings,
                amulets: amulets
            }
        case DressingWindowActions.ADD_FILTER:
            newFilters = state.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case DressingWindowActions.REMOVE_FILTER:
            newFilters = state.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        case DressingWindowActions.CREATE_NEW_SET:
            const newSet = data as DressingSet
            window.dressingAPI.saveSet(newSet)
            sets.push(newSet)
            return {
                ...state,
                currentSet: newSet,
                sets: sets,
                currentEquipedItems: [],
                currentStyle: null,
                arcats: [],
                rings: [],
                amulets: []
            }
        case DressingWindowActions.SAVE_SET:
            let set = state.currentSet
            const equipmentItemIds = state.currentEquipedItems.map(item => item.id)
            const setMagicSchool = SetStyleHelper.getSchool(state.currentStyle, state.currentMagicSchool)
            if(set) {
                set.title = Elements.setTitleBox().value
                set.ids = equipmentItemIds
                set.style = state.currentStyle
                set.magicSchool = setMagicSchool
                sets[sets.indexOf(set)] = set
                set.isNew = false
            } else {
                set = {
                    id: generateSetId(),
                    title: Elements.setTitleBox().value,
                    ids: equipmentItemIds,
                    style: state.currentStyle,
                    magicSchool: setMagicSchool,
                    isNew: true
                }
                sets.push(set)
            }
            window.dressingAPI.saveSet(set)
            return {
                ...state,
                currentSet: set,
                sets: sets
            }
        case DressingWindowActions.REMOVE_SET:
            let deletedSetBox = data as HTMLDivElement | null
            const deletedSet = sets.find(set => set.id == deletedSetBox?.id)
            if(deletedSet) {
                const isCurrentSet = deletedSet == state.currentSet
                const deletedSetId = deletedSet?.id
                sets = sets.removeItem(deletedSet)
                window.dressingAPI.removeSet(deletedSetId)
                currentEquipedItems = isCurrentSet ? [] : state.currentEquipedItems
                const currentSet = isCurrentSet ? null : state.currentSet
                return {
                    ...state,
                    sets: sets,
                    currentEquipedItems: currentEquipedItems,
                    currentStyle: getStyle(currentEquipedItems),
                    currentSet: currentSet
                }
            } else {
                return {
                    ...state
                }
            }
        case DressingWindowActions.SELECT_SET:
            const selectedSet = data as DressingSet
            let items = selectedSet.ids.map(id => state.allItems.find(item => item.id == id)).filter(item => item != undefined) as InventoryItem[]
            let repeatableItems1 = countRepeatableItems(items)
            return {
                ...state,
                currentSet: selectedSet,
                currentEquipedItems: items,
                currentStyle: getStyle(items),
                arcats: repeatableItems1.arcats,
                rings: repeatableItems1.rings,
                amulets: repeatableItems1.amulets
            }
        case DressingWindowActions.EQUIP_FROM_SET:
            if(!state.currentSet) {
                return state
            }
            Elements.saveSetBox().disabled = true
            Elements.equipSetBox().disabled = true
            Elements.unequipBox().disabled = true
            let currentSet = state.currentSet
            if(currentSet.magicSchool && state.currentMagicSchool && state.currentMagicSchool != currentSet.magicSchool) {
                let styleId = SetStyleHelper.getStyleId(currentSet.magicSchool)
                await window.dressingAPI.changeStyle(state.zikkuratId!, styleId)
                state.currentMagicSchool = currentSet.magicSchool
            }
            const res = await window.dressingAPI.loadItemsData(['wearedItems'])
            let parsedRes = parse(res.wearedItems)
            let arr: InventoryItem[] = []
            for(const type of parsedItemTypes) {
                arr = arr.concat(parsedRes[type])
            }
            const needToPutOn = difference(currentSet.ids, arr.map(item => item.id))
            const needToPutOff = difference(arr.map(item => item.id), currentSet.ids)

            for(var id of needToPutOff) {
                await window.dressingAPI.unequipRequest(id)
            }
            for(var id of needToPutOn) {
                await window.dressingAPI.equipRequest(id)
            }
            let repeatableItems2 = countRepeatableItems(currentEquipedItems)
            Elements.saveSetBox().disabled = false
            Elements.equipSetBox().disabled = false
            Elements.unequipBox().disabled = false
            return {
                ...state,
                arcats: repeatableItems2.arcats,
                rings: repeatableItems2.rings,
                amulets: repeatableItems2.amulets
            }
        case DressingWindowActions.UNEQUIP_ALL:
            return {
                ...state,
                currentStyle: null,
                currentEquipedItems: [],
                arcats: [],
                rings: [],
                amulets: []
            }
        default:
            return state
    }
}

async function dispatch(action: DressingWindowActions, data?: any) {
    initialState = await reduce(initialState, action, data)
    render()
}

function render(): void {
    [Elements.helmetBox(), Elements.shouldersBox(), Elements.bracersBox(), Elements.mainWeaponBox(),
     Elements.offhandWeaponBox(), Elements.cuirassBox(), Elements.leggingsBox(), Elements.chainmailBox(), 
     Elements.bootsBox(), Elements.bowBox(), Elements.quiverBox(), Elements.ring1Box(), Elements.ring2Box(), 
     Elements.amulet1Box(), Elements.amulet2Box(),Elements.arcat1Box(), Elements.arcat2Box(), Elements.arcat3Box(), Elements.arcat4Box()]
     .forEach(box => {
        if(box != null) {
            box.style.border = ''
            if(box.firstElementChild) {
                box.removeChild(box.firstElementChild)
            }
            box.style.visibility = 'visible'
        }
    })
    Array.from(Elements.currentItemsBox().children ?? []).forEach(item => Elements.currentItemsBox().removeChild(item))
    const allItemDivs = initialState.allItems.map(item => {
        const element = convertItemIntoDiv(item)
        element.style.display = 'block'
        let parent = Elements.currentItemsBox()
        setupEquipableItemEvents(element)
        parent?.appendChild(element)
        return element
    })
    Array.from(Elements.arcatsBox().children ?? []).forEach(item => Elements.arcatsBox().removeChild(item))
    if(initialState.arcatsCount != 0) {
        for(let i = 0; i < initialState.arcatsCount; i++) {
            const arcatSlot = createArcatSlot(i)
            const parent = Elements.arcatsBox()
            parent?.appendChild(arcatSlot)
            arcatSlot.onclick = function() {
                if(initialState.selectedStaticItemId && initialState.selectedStaticItemId == arcatSlot.id) {
                    dispatch(DressingWindowActions.DESELECT_PLACEHOLDER)
                } else {
                    dispatch(DressingWindowActions.SELECT_PLACEHOLDER, arcatSlot)
                }
            }
        }
    }
    const equipedItemsIds = initialState.currentEquipedItems.map(item => item.id)
    if(initialState.selectedStaticItemId) {
        const box = eval(`Elements.${initialState.selectedStaticItemId}()`) as HTMLDivElement
        box.style.border = '3px dotted #666'
        const visibleItems = allItemDivs.filter(item => item.style.display != 'none' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
        visibleItems.forEach(item => item.style.display = item.getAttribute('type') == box.getAttribute('type') ? 'block' : 'none')
    }
    let visibleItems = allItemDivs.filter(item => item.style.display != 'none' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
    for(const filter of initialState.activeFilters) {
        const filterQuality = getQuality(filter)
        let items = visibleItems.filter(e => e.getAttribute('quality') == filterQuality)
        items.forEach(item => item.style.display = 'none')
    }
    if(initialState.currentStyle) {
        visibleItems = visibleItems.filter(item => item.style.display == 'block' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
        visibleItems.forEach(item => item.style.display = (item.getAttribute('trend') == initialState.currentStyle || item.getAttribute('trend') == 'Универсал') ? 'block' : 'none')
    }
    for(const equipedItem of initialState.currentEquipedItems) {
        let equipedDiv = Array.from(Elements.currentItemsBox().children ?? []).find(item => item.getAttribute('itemid') == equipedItem.id)
        if(!equipedDiv) {
            alert("ШО ТО НЕ ТАК!!! Напиши в группу")
            return 
        }
        const element = equipedDiv
        const itemBox = eval(`Elements.${element.getAttribute('type')}Box()`) as HTMLDivElement
        
        const isWeapon = element.getAttribute('weapon')
        itemBox.appendChild(element)
        element.setAttribute('equiped', 'true')
        if(itemBox.getAttribute('type') == 'ring' || itemBox.getAttribute('type') == 'amulet' || itemBox.getAttribute('type') == 'arcat') {
            element.className = 'box small'
        }
        itemBox.style.visibility = 'hidden';
        (itemBox.firstElementChild as HTMLElement).style.visibility = 'visible'
        if(isWeapon) {
            if(isWeapon == "2h") {
                const copyWeapon = element.cloneNode(true) as HTMLElement
                copyWeapon.style.opacity = '0.6'
                copyWeapon.setAttribute('copy', 'true')
                copyWeapon.setAttribute('equiped', 'true')
                setupEquipableItemEvents(copyWeapon)
                Elements.offhandWeaponBox().style.visibility = 'hidden';
                Elements.offhandWeaponBox().appendChild(copyWeapon)
            }
        }
    }
    Elements.inventoryBox().ondragover = handleDragOver
    Elements.inventoryBox().ondrop = handleDropEquipableItemIntoAllItems

    Array.from(Elements.setsBox().children).filter(element => element.id.startsWith('set_')).forEach(element => Elements.setsBox().removeChild(element))
    for(const set of initialState.sets) {
        const isActive = initialState.currentSet == set
        let setDiv = createSetElement(set, isActive)
        if(isActive) {
            Elements.setTitleBox().value = set.title
        }
        if(set.isNew) {
            Elements.setsBox().insertBefore(setDiv, Elements.setsBox().firstElementChild?.nextElementSibling!)
        } else {
            Elements.setsBox().appendChild(setDiv)
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    dispatch(DressingWindowActions.LOAD_CONTENT)
    let itemsStaticBoxes = Array.from(Elements.staticBoxes()) as HTMLDivElement[]
    itemsStaticBoxes.forEach(function(item) {
        item.ondragover = handleDragOver
        item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    })
    const armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver', 'ring1', 'ring2', 'amulet1', 'amulet2']
    armorTypes.forEach(t => {
        let itemBox = eval(`Elements.${t}Box()`) as HTMLElement
        itemBox.onclick = function() {
            if(initialState.selectedStaticItemId && itemBox.id == initialState.selectedStaticItemId) {
                dispatch(DressingWindowActions.DESELECT_PLACEHOLDER, itemBox)
            } else {
                dispatch(DressingWindowActions.SELECT_PLACEHOLDER, itemBox)
            }
        }
        itemBox.ondragover = handleDragOver
        itemBox.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    })
    setupFilters()

    Elements.addSetBox().onclick = function() {
        const newSet = addNewSet()
        dispatch(DressingWindowActions.CREATE_NEW_SET, newSet)
    }
    Elements.dropSetBox().ondrop = function(e) {
        e.preventDefault()
        dispatch(DressingWindowActions.REMOVE_SET, dragableSet)
    }
    Elements.dropSetBox().ondragover = function(e) {
        e.preventDefault()
    }
    Elements.unequipBox().onclick = function() {
        dispatch(DressingWindowActions.UNEQUIP_ALL)
    }
    Elements.equipSetBox().onclick = function() {
        dispatch(DressingWindowActions.EQUIP_FROM_SET)
    }
    Elements.saveSetBox().onclick = function() {
        dispatch(DressingWindowActions.SAVE_SET)
    }
})

export {}