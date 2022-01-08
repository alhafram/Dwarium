let potionsManager: PotionsManager
let beltSetsManager: BeltSetsManager
var art_alt: { [key: string]: InventoryItem }

interface BeltPotionWindowState {
    currentElement: HTMLElement | null,
    getEquipedItems(): HTMLElement[]
}

let state: BeltPotionWindowState = {
    currentElement: null,
    getEquipedItems(): HTMLElement[] {
        let items = Array.from(document.querySelectorAll('.potion')).filter(a => a.firstElementChild != null)
        return items as HTMLElement[]
    }
}

interface Potion {
    id: string | undefined,
    item: string,
    slotNum: string,
    variant: boolean
}

interface EquipedPotion {
    id: string,
    count: number,
    slot: string,
    variant: boolean,
    item: string
}

interface InventoryItem {
    id: string
    title: string, desc: any, kind_id: string, type_id: string,
    quality: string,
    image: string,
    cnt: string | null,
    potions: Potion[]
}

// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI = {}
// @ts-ignore Temporary solution for hack in simple_alt.js
window.myAPI.baseUrl = function() {
    return window.beltPotionAPI.baseUrl()
}

document.addEventListener('DOMContentLoaded', async () => {
    potionsManager = new PotionsManager()
    beltSetsManager = new BeltSetsManager()

    await loadAllItems()

    let slots = await potionsManager.getSlots()
    slots = slots.result

    setupFilters()
    renderSlots(slots[0], slots[1])
    beltSetsManager.setup()

    potionsManager.setupWearedItems()
})

async function loadAllItems() {
    let items = await window.beltPotionAPI.loadItemsData(['allPotions'])
    art_alt = items.allPotions
    potionsManager.setupAllItems(items)
}

function renderSlots(slotsCount: number, variantSlots: number) {
    var currentVariantSlot = 1
    for(let i = 0; i < slotsCount; i++) {
        let divBox = document.createElement('div')
        divBox.style.display = 'flex'
        let divPotion = document.createElement('div')
        divPotion.setAttribute('num', `${i + 1}`)
        divPotion.className = 'potion'
        setupPotionListeners(divPotion)
        divBox.appendChild(divPotion)
        for(var j = 0; j < 2; j++) {
            if(currentVariantSlot <= variantSlots) {
                let divPotion = document.createElement('div')
                divPotion.setAttribute('variant', 'true')
                divPotion.className = 'potion'
                divPotion.setAttribute('num', `${currentVariantSlot}`)
                setupPotionListeners(divPotion)
                divBox.appendChild(divPotion)
                currentVariantSlot += 1
            } else {
                break
            }
        }
        let parent = document.querySelector('.equippedItems')
        parent?.appendChild(divBox)
    }
}

function setupPotionListeners(item: HTMLElement) {
    item.addEventListener('dragover', handleDragOver, false)
    item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
}

//////////////////////////////////////////////////////////////////////////////////////////

class PotionsManager {

    setupAllItems(items: { allPotions: InventoryItem[] }) {
        let currentItems = Array.from(document.querySelector('.currentItems')!.children) as [HTMLElement]
        for(let item of currentItems) {
            item.parentElement!.removeChild(item)
        }
        let potions = Object.values(items.allPotions).filter(item => item.type_id == '7' && item.kind_id != '65')
        let divs = this.convertItemIntoDiv(potions)

        divs.forEach(item => {
            let parent = document.querySelector('.currentItems')
            parent?.appendChild(item)
        })
    }

    convertItemIntoDiv(items: InventoryItem[]): HTMLDivElement[] {
        return items.map(item => {
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = true
            divItem.style.backgroundImage = `url('${window.beltPotionAPI.baseUrl()}/${item.image}')`
            divItem.style.backgroundRepeat = 'no-repeat'
            divItem.style.backgroundSize = 'cover'
            divItem.setAttribute('quality', item.quality)
            divItem.setAttribute('itemId', item.id)
            let span = document.createElement('div')
            span.textContent = item.cnt
            span.className = 'bpdig'
            divItem.appendChild(span)
            setupEquipableItemEvents(divItem)
            return divItem
        })
    }

    putOnItem(item: HTMLElement, box?: HTMLElement) {
        let potionBoxes = Array.from(document.querySelectorAll('.potion'))
        let currentBox = box ?? potionBoxes.find(b => b.childElementCount == 0) as HTMLElement
        if(!currentBox) {
            return
        }
        let itemCopy = item.cloneNode(true) as HTMLDivElement
        if(itemCopy.firstElementChild) {
            itemCopy.removeChild(itemCopy.firstElementChild)
        }
        itemCopy.setAttribute('equiped', 'true')
        setupEquipableItemEvents(itemCopy)
        currentBox.appendChild(itemCopy)
        itemCopy.style.borderRadius = '25px'
        itemCopy.style.opacity = '1'
        currentBox.style.border = 'none'
        currentBox.style.visibility = 'hidden'
        itemCopy.style.visibility = 'visible'
    }

    putOffItem(box: HTMLElement) {
        box.style.visibility = 'visible'
        box.removeChild(box.firstElementChild!)
        box.style.border = 'black 1px dotted'
    }

    async updateSlot(num: string, type: string) {
        let req = `top[0].canvas.app.leftMenu.model.${type}[${num}] = null; top[0].canvas.app.leftMenu.model.main.view.update();`
        let res = await window.beltPotionAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async getSlots() {
        let req = '[top[0].canvas.app.leftMenu.model.slotsCount, top[0].canvas.app.leftMenu.model.variantSlotsCount]'
        let res = await window.beltPotionAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async getCurrentPotions() {
        let req = '[top[0].canvas.app.leftMenu.model.items, top[0].canvas.app.leftMenu.model.variantItems]'
        let res = await window.beltPotionAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async getCurrentPotionsAlt() {
        let req = 'top[0].art_alt'
        let res = await window.beltPotionAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    async setupWearedItems() {
        let pots = await this.getCurrentPotions()
        let currentEquipedPotions = pots.result.flat().filter((a: any) => a)
        let currentPotionsAlt = await this.getCurrentPotionsAlt()
        // @ts-ignore
        _top().items_alt = currentPotionsAlt.result
        
        for(let potion of currentEquipedPotions) {
            // @ts-ignore
            let potionAlt = _top().items_alt[`AA_${potion.id}`]
            let id = Object.values(art_alt).find(o => o.title == potionAlt.title)?.id ?? potionAlt.id
            let divItem = document.createElement('div')
            divItem.className = 'box'
            divItem.draggable = true
            divItem.style.backgroundImage = `url('${window.beltPotionAPI.baseUrl()}/${potionAlt.image}')`
            divItem.style.backgroundRepeat = 'no-repeat'
            divItem.style.backgroundSize = 'cover'
            divItem.setAttribute('itemid', id)
            setupEquipableItemEvents(divItem)
            let potBox = Array.from(document.querySelectorAll('.potion')).filter(pot => pot.getAttribute('num') == potion.slot).filter(pot => {
                return potion.variant ? pot.getAttribute('variant') : pot.getAttribute('variant') == null
            })[0] as HTMLElement
            potionsManager.putOnItem(divItem, potBox)
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        this.childElementCount == 0) {
        potionsManager.putOnItem(state.currentElement, this)
    }
    return false
}

function handleClickEquipableItem(this: any, e: Event) {
    if(this.getAttribute('equiped') != 'true') {
        let itemBox = document.querySelector(`#${this.getAttribute('type')}Box`)
        state.currentElement = this
        potionsManager.putOnItem(this)
        return
    }
    if(this.getAttribute('equiped') == 'true') {
        potionsManager.putOffItem(this.parentElement)
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

////////////////////////////////////////////////////////////////////////

class BeltSetsManager {
    sets: InventoryItem[] = []
    currentSet: InventoryItem | null = null
    equipedCurrentItemIds = []
    curDragSet: HTMLElement | null = null

    #article = 'leaderboard__profile'
    #activeArticle = 'leaderboard__profile active'

    get setsBox() {
        return document.querySelector('.sets')
    }

    get setTitleBox(): HTMLInputElement | null {
        return document.getElementById('currentSetTitle') as HTMLInputElement
    }

    get allCurrentItems() {
        return Array.from(document.querySelector('.currentItems')!.children)
    }

    pushSet(newSet: InventoryItem) {
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
        document.getElementById('save')?.addEventListener('click', e => {
            self.saveSet()
        })
        document.getElementById('unequip')?.addEventListener('click', e => {
            self.unequip()
        })
        document.getElementById('equip')?.addEventListener('click', e => {
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
        this?.curDragSet?.parentElement?.removeChild(this.curDragSet)
        if(this.currentSet == removedItem) {
            this.unequip()
        }
        window.beltPotionAPI.removeSet(id)
    }

    addNewSet() {
        this.deselectOtherArticles()
        this.unequip()
        let id = this.#generateSetId()
        let newSet: InventoryItem = {
            id: id,
            title: 'Default set',
            potions: [],
            desc: undefined,
            kind_id: "",
            type_id: "",
            quality: "",
            image: "",
            cnt: null
        }
        let article = this.createSetArticleElement(newSet, true)
        this.setTitleBox!.value = 'Default set'
        this.setsBox!.insertBefore(article, this.setsBox!.firstElementChild!.nextElementSibling)
        this.currentSet = newSet
        this.pushSet(newSet)
        this.saveSet()
        filterCurrentItems()
    }

    loadBeltSets() {
        this.sets = window.beltPotionAPI.loadBeltSets()
    }

    fillSets() {
        if(this.sets.length != 0) {
            for(var set of this.sets) {
                let article = this.createSetArticleElement(set)
                this.setsBox!.appendChild(article)
            }
        }
    }

    createSetArticleElement(set: InventoryItem, active?: boolean): HTMLElement {
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
        let selectedSet = this.sets.find(obj => obj.id == element.id) ?? null
        this.currentSet = selectedSet
        this.equipFromSet(selectedSet!.potions)
        this.setTitleBox!.value = selectedSet!.title
        state.getEquipedItems().map(i => i.style.display = 'inline-block')
        filterCurrentItems()
    }

    saveSet() {
        let equippedPotionBoxes = state.getEquipedItems()
        let title = this.setTitleBox!.value

        let arr: Potion[] = []
        for(const equipedPotionBox of equippedPotionBoxes) {
            let allSets: { [key: string]: InventoryItem } = {}
            Object.keys(art_alt).forEach(key => {
                allSets[key] = art_alt[key]
            })
            // @ts-ignore
            Object.keys(_top().items_alt).forEach(key => {
                // @ts-ignore
                allSets[key] = _top().items_alt[key]
            })
            let title = Object.values(allSets).find(o => o.id == equipedPotionBox!.firstElementChild!.getAttribute('itemid'))!.title
            let obj: Potion = {
                item: title,
                slotNum: equipedPotionBox.getAttribute('num')!,
                variant: equipedPotionBox.getAttribute('variant') == 'true',
                id: undefined
            }
            arr.push(obj)
        }

        let setArticles = Array.from(this.setsBox!.children)
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
        let newSet: InventoryItem = {
            id: id,
            title: title,
            potions: arr,
            desc: undefined,
            kind_id: "",
            type_id: "",
            quality: "",
            image: "",
            cnt: null
        }
        window.beltPotionAPI.saveSet(newSet)
        this.pushSet(newSet)
        this.currentSet = newSet
        if(isNew) {
            let article = this.createSetArticleElement(newSet, true)
            this.setsBox!.insertBefore(article, this.setsBox!.firstElementChild!.nextSibling)
        }
    }

    deselectOtherArticles() {
        let self = this
        Array.from(this.setsBox!.children).forEach(e => {
            if(e.tagName == 'ARTICLE') {
                e.className = self.#article
            }
        })
    }

    unequip() {
        let items = state.getEquipedItems()
        for(var item of items) {
            potionsManager.putOffItem(item)
        }
    }

    equipFromSet(potions: Potion[]) {
        for(var potion of potions) {
            // @ts-ignore
            let item = Object.values(art_alt).find(o => o.title == potion.item) ?? Object.values(_top().items_alt).find(o => o.title == potion.item) as InventoryItem
            if(!item) {
                continue
            }
            let itemBox = this.allCurrentItems.find(a => a.getAttribute('itemid') == item.id) as HTMLElement
            if(!itemBox) {
                let divItem = document.createElement('div')
                divItem.className = 'box'
                divItem.draggable = true
                let image = item.image.includes('https://') ? item.image : `${window.beltPotionAPI.baseUrl()}/${item.image}`
                divItem.style.backgroundImage = `url('${window.beltPotionAPI.baseUrl()}/${image}')`
                divItem.style.backgroundRepeat = 'no-repeat'
                divItem.style.backgroundSize = 'cover'
                divItem.setAttribute('quality', item.quality)
                divItem.setAttribute('itemId', item.id)
                setupEquipableItemEvents(divItem)
                itemBox = divItem
            }
            let potBox = Array.from(document.querySelectorAll('.potion')).filter(pot => pot.getAttribute('num') == potion.slotNum).filter(pot => {
                return potion.variant ? pot.getAttribute('variant') : pot.getAttribute('variant') == null
            })[0] as HTMLElement
            if(item) {
                potionsManager.putOnItem(itemBox, potBox)
            } else {
                console.log('SOMETHING WRONG', item)
                return
            }
        }
    }

    async refreshLeftMenu() {
        let req = 'top[0].window.location.reload()'
        let res = await window.beltPotionAPI.makeRequest({
            id: generateRandomId(),
            req: req
        })
        return res
    }

    #generateSetId() {
        return 'belt_set_' + generateRandomId()
    }

    isDiff(p1: Potion, p2: Potion) {
        return p1.item != p2.item
    }

    async equipSelectedSet() {
        if(!this.currentSet) {
            return
        }
        let potions = await potionsManager.getCurrentPotions()
        let equipedPotions = potions.result.flat().filter((a: EquipedPotion) => a) as EquipedPotion[]
        console.log(equipedPotions)
        for(let item of equipedPotions) {
            let res = await window.beltPotionAPI.fetchItem(item.id!)
            let doc = res.result.toDocument()
            let title = doc.querySelector('body > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td.tbl-usi_bg > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td:nth-child(2) > h1 > b').textContent
            item.item = title
        }

        let needToUnequip: EquipedPotion[] = []
        let needToEquip: Potion[] = []
        this.currentSet.potions.forEach(p => {
            let a = equipedPotions.find(a => a.slot == p.slotNum && a.variant == p.variant)
            if(a && p.item != a.item) {
                needToUnequip.push(a)
                needToEquip.push(p)
            }
            if(!a) {
                needToEquip.push(p)
            }
            equipedPotions.removeItem(a!)
        })
        needToUnequip = needToUnequip.concat(equipedPotions)
        while(needToUnequip.length != 0) {
            let item = needToUnequip[0]
            await window.beltPotionAPI.unequipRequest(item.id)
            await potionsManager.updateSlot(item.slot, item.variant ? 'variantItems' : 'items')
            needToUnequip.removeItem(item)
        }
        while(needToEquip.length != 0) {
            let item = needToEquip[0]
            let id = Object.values(art_alt).find(o => o.title == item.item)?.id
            if(!id) {
                needToEquip.removeItem(item)
                continue
            }
            await window.beltPotionAPI.equipPotionRequest(id, item.slotNum, item.variant ? '1' : '0')
            await potionsManager.updateSlot(item.slotNum, item.variant ? 'variantItems' : 'items')
            needToEquip.removeItem(item)
        }
        await this.refreshLeftMenu()
        await loadAllItems()
    }

    setup() {
        this.loadBeltSets()
        this.fillSets()
        this.setupListeners()
    }
}

//////////////////////////////////////////////////////////////////////////////////////////

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

function filterCurrentItems() {
    let items = Array.from(document.querySelector('.currentItems')!.children)
    items.forEach(i => {
        for(var filter of dressingFilters) {
            let items = Array.from(document.querySelector('.currentItems')!.children).filter(e => e.getAttribute('quality') == filter.toString())
            items.forEach(item => {
                (item as HTMLElement).style.display = 'none'
            })
        }
    })
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

export {}; // Fix for overriding variables