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
        window.dressingAPI.state().currentStyle = null
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
        filterCurrentItems(window.dressingAPI.state())
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
        // article.id = set.id
        // article.draggable = true
        // let className = active ? this.#activeArticle : this.#article
        // article.className = className
        // var self = this
        // article.onclick = function(e) {
        //     self.selectSet(this)
        // }

        // if(article.id != 'addSetButton') {
        //     const self = this
        //     article.addEventListener('dragstart', function(e) {
        //         self.curDragSet = article
        //         article.style.opacity = '0.4'
        //     }, false)
        //     article.addEventListener('dragend', function() {
        //         self.curDragSet = null
        //         article.style.opacity = '1'
        //     }, false)
        //     article.addEventListener('dragover', function(e) {
        //         if(e.preventDefault) {
        //             e.preventDefault()
        //         }
        //         return false
        //     })
        // }

        // let img = document.createElement('img')
        // img.src = './images/magic/' + SetStyleHelper.getMagicIcon(set.magicSchool ?? '') + '.webp'
        // img.className = 'leaderboard__picture'
        // article.appendChild(img)

        // let span = document.createElement('span')
        // span.className = 'leaderboard__name'
        // span.textContent = set.title
        // article.appendChild(span)
        return article
    }

    selectSet(element: HTMLElement) {
        // if(element.className == this.#activeArticle) {
        //     return
        // }
        // this.deselectOtherArticles()
        // this.unequip()
        // element.className = this.#activeArticle
        // let selectedSet = this.sets.find(obj => obj.id == element.id)
        // this.currentSet = selectedSet
        // window.dressingAPI.state().currentStyle = selectedSet!.style
        // this.equipFromSet(selectedSet!.ids)
        // this.setTitleBox.value = selectedSet!.title
        // window.dressingAPI.state().getEquipedItems().map(i => i.style.display = 'inline-block')
        // filterCurrentItems(window.dressingAPI.state())
    }

    saveSet() {
        // let items = window.dressingAPI.state().getEquipedItems()
        // let title = this.setTitleBox.value
        // let ids = items.map(i => i.getAttribute('itemid'))

        // let setArticles = setManager.setsBox.children.toArray()
        // let activeSet = setArticles.filter(e => e.id != 'addSetButton' && e.className == this.#activeArticle).first()
        // let id = null
        // var isNew = true
        // if(activeSet && this.currentSet) {
        //     id = this.currentSet.id
        //     isNew = false
        //     activeSet.lastElementChild.textContent = title
        // } else {
        //     id = this.#generateSetId()
        // }
        // let newSet = {
        //     id: id,
        //     title: title,
        //     ids: ids.unique(),
        //     style: ids.isEmpty() ? null : window.dressingAPI.state().currentStyle,
        //     magicSchool: ids.isEmpty() ? null : SetStyleHelper.getSchool(window.dressingAPI.state().currentStyle!, window.dressingAPI.state().currentMagicSchool!)
        // }
        // window.dressingAPI.saveSet(newSet)
        // if(activeSet) {
        //     activeSet.firstElementChild.src = './images/magic/' + SetStyleHelper.getMagicIcon(newSet.magicSchool!) + '.webp'
        // }
        // this.pushSet(newSet)
        // this.currentSet = newSet
        // if(isNew) {
        //     let article = this.createSetArticleElement(newSet, true)
        //     this.setsBox?.insertBefore(article, this.setsBox?.firstElementChild!.nextSibling)
        // }
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
        // let items = window.dressingAPI.state().getEquipedItems()
        // for(var item of items) {
        //     itemsManager.putOffItem(item.parentElement)
        // }
    }

    equipFromSet(ids: string[]) {
        // for(var id of ids) {
        //     let item = this.allCurrentItems.filter(element => element.getAttribute('itemid') == id).first()
        //     if(item) {
        //         window.dressingAPI.state().currentElement = item
        //         itemsManager.putOnItem(item)
        //         window.dressingAPI.state().currentElement = null
        //     } else {
        //         console.log('SOMETHING WRONG', id)
        //         return
        //     }
        // }
    }

    #generateSetId() {
        return 'set_' + generateRandomId()
    }

    async equipSelectedSet() {
        // if(!this.currentSet) {
        //     return
        // }
        // let styleChanged = false
        // if(this.currentSet.magicSchool && window.dressingAPI.state().currentMagicSchool != this.currentSet.magicSchool) {
        //     let styleId = SetStyleHelper.getStyleId(this.currentSet.magicSchool)
        //     await changeStyle(state.zikkuratId, styleId)
        //     window.dressingAPI.state().currentMagicSchool = this.currentSet.magicSchool
        //     styleChanged = true
        // }
        // if(styleChanged) {
        //     const result = await window.dressingAPI.loadItemsData(['wearedItems'])
        //     const parsedWearedItems = parse(result.wearedItems)
        //     let arr = []
        //     for(const type of itemsManager.parsingItemTypes) {
        //         arr = arr.concat(parsedWearedItems[type])
        //     }
        //     this.equipedCurrentItemIds = arr.map(i => i.id)
        // }
        // const needToPutOn = difference(this.currentSet.ids, this.equipedCurrentItemIds)
        // const needToPutOff = difference(this.equipedCurrentItemIds, this.currentSet.ids)

        // for(var id of needToPutOff) {
        //     await unequipRequest('https://w2.dwar.ru', id)
        //     this.equipedCurrentItemIds.removeItem(id)
        // }
        // for(var id of needToPutOn) {
        //     await equipRequest('https://w2.dwar.ru', id)
        //     this.equipedCurrentItemIds.push(id)
        // }
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