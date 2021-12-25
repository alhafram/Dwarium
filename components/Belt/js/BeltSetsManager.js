class BeltSetsManager {
    sets = []
    currentSet = null
    equipedCurrentItemIds = []
    curDragSet = null

    #article = 'leaderboard__profile'
    #activeArticle = 'leaderboard__profile active'

    get setsBox() {
        return document.querySelector('.sets')
    }

    get setTitleBox() {
        return document.querySelector('#currentSetTitle')
    }

    get allCurrentItems() {
        return document.querySelector('.currentItems').children.toArray()
    }

    pushSet(newSet) {
        let set = this.sets.find(e => e.id == newSet.id)
        if(!isExists(set)) {
            this.sets.push(newSet)
        } else {
            this.sets[this.sets.indexOf(set)] = newSet
        }
    }

    setupListeners() {
        let self = this
        document.querySelector('#addSetButton').addEventListener('click', e => {
            self.addNewSet()
        })
        document.querySelector('#save').addEventListener('click', e => {
            self.saveSet()
        })
        document.querySelector('#unequip').addEventListener('click', e => {
            self.unequip()
        })
        document.querySelector('#equip').addEventListener('click', e => {
            self.equipSelectedSet()
        })
        let dropSetButton = document.querySelector('#dropSetButton')
        dropSetButton.addEventListener('drop', function(e) {
            e.preventDefault()
            self.deleteSet()
        }, false)
        dropSetButton.addEventListener('dragover', function(e) {
            e.preventDefault()
        }, false)
    }

    deleteSet() {
        let id = this.curDragSet.id
        let removedItem = this.sets.filter(set => set.id == id).first()
        this.sets = this.sets.removeItem(removedItem)
        this.curDragSet.parentElement.removeChild(this.curDragSet)
        if(this.currentSet == removedItem) {
            this.unequip()
        }
        window.myAPI.removeSet(id)
    }

    addNewSet() {
        this.deselectOtherArticles()
        this.unequip()
        let id = this.#generateSetId()
        let newSet = {
            id: id,
            title: 'Default set',
            potions: []
        }
        let article = this.createSetArticleElement(newSet, true)
        this.setTitleBox.value = 'Default set'
        this.setsBox.insertBefore(article, this.setsBox.firstElementChild.nextElementSibling)
        this.currentSet = newSet
        this.pushSet(newSet)
        this.saveSet()
        filterCurrentItems()
    }

    loadBeltSets() {
        this.sets = window.myAPI.loadBeltSets()
    }

    fillSets() {
        if(!this.sets.isEmpty()) {
            for(var set of this.sets) {
                let article = this.createSetArticleElement(set)
                this.setsBox.appendChild(article)
            }
        }
    }

    createSetArticleElement(set, active) {
        let article = document.createElement('article')
        article.id = set.id
        article.draggable = true
        let className = active ? this.#activeArticle : this.#article
        article.className = className
        var self = this
        article.onclick = function(e) {
            self.selectSet(this)
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
        img.className = 'leaderboard__picture'
        article.appendChild(img)

        let span = document.createElement('span')
        span.className = 'leaderboard__name'
        span.textContent = set.title
        article.appendChild(span)
        return article
    }

    selectSet(element) {
        if(element.className == this.#activeArticle) {
            return
        }
        this.deselectOtherArticles()
        this.unequip()
        element.className = this.#activeArticle
        let selectedSet = this.sets.find(obj => obj.id == element.id)
        this.currentSet = selectedSet
        this.equipFromSet(selectedSet.potions)
        this.setTitleBox.value = selectedSet.title
        state.getEquipedItems().map(i => i.style.display = 'inline-block')
        filterCurrentItems()
    }

    saveSet() {
        let equippedPotionBoxes = state.getEquipedItems() //Array.from(document.querySelectorAll('.potion')).filter(a => a.firstElementChild != null)
        let title = this.setTitleBox.value
        // let ids = items.map(i => i.getAttribute('itemid'))

        let arr = []
        for(const equipedPotionBox of equippedPotionBoxes) {
            let title = Object.values(art_alt).find(o => o.id == equipedPotionBox.firstElementChild.getAttribute('itemid')).title
            let obj = {
                item: title,
                slotNum: equipedPotionBox.getAttribute('num'),
                variant: equipedPotionBox.getAttribute('variant') == 'true'
            }
            arr.push(obj)
        }

        let setArticles = this.setsBox.children.toArray()
        let activeSet = setArticles.filter(e => e.id != 'addSetButton' && e.className == this.#activeArticle).first()
        let id = null
        var isNew = true
        if(isExists(activeSet) && isExists(this.currentSet)) {
            id = this.currentSet.id
            isNew = false
            activeSet.lastElementChild.textContent = title
        } else {
            id = this.#generateSetId()
        }
        let newSet = {
            id: id,
            title: title,
            potions: arr
        }
        window.myAPI.saveSet(newSet)
        this.pushSet(newSet)
        this.currentSet = newSet
        if(isNew) {
            let article = this.createSetArticleElement(newSet, true)
            this.setsBox.insertBefore(article, this.setsBox.firstElementChild.nextSibling)
        }
    }

    deselectOtherArticles() {
        let self = this
        this.setsBox.children.toArray().forEach(e => {
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

    equipFromSet(potions) {
        for(var potion of potions) {
            let item = Object.values(art_alt).find(o => o.title == potion.item)
            let itemBox = Array.from(document.querySelector('.currentItems').children).find(a => a.getAttribute('itemid') == item.id)
            let potBox = Array.from(document.querySelectorAll('.potion')).filter(pot => pot.getAttribute('num') == potion.slotNum).filter(pot => {
                return potion.variant ? pot.getAttribute('variant') : pot.getAttribute('variant') == null
            })[0]
            if(item) {
                state.currentElement = item
                potionsManager.putOnItem(itemBox, potBox)
                state.currentElement = null
            } else {
                console.log('SOMETHING WRONG', id)
                return
            }
        }
    }

    #generateSetId() {
        return 'belt_set_' + generateRandomId()
    }

    isDiff(p1, p2) {
        return p1.item != p2.item
    }

    async equipSelectedSet() {
        if(!isExists(this.currentSet)) {
            return
        }
        let potions = await potionsManager.getCurrentPotions()
        let equipedPotions = potions.result.flat().filter(a => a)
        console.log(equipedPotions)
        for(let item of equipedPotions) {
            let res = await fetchItem(item.id)
            let doc = res.result.toDocument()
            let title = doc.querySelector('body > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(1) > tbody > tr:nth-child(2) > td.tbl-usi_bg > table > tbody > tr:nth-child(1) > td:nth-child(3) > table > tbody > tr > td:nth-child(2) > h1 > b').textContent
            item.item = title
        }

        let needToUnequip = []
        let needToEquip = []
        this.currentSet.potions.forEach(p => {
            let a = equipedPotions.find(a => a.slot == p.slotNum && a.variant == p.variant)
            if(a && p.item != a.item) {
                needToUnequip.push(a)
                needToEquip.push(p)
            }
            if(!a) {
                needToEquip.push(p)
            }
            equipedPotions.removeItem(a)
        })
        needToUnequip = needToUnequip.concat(equipedPotions)
        while(needToUnequip.length != 0) {
            let item = needToUnequip[0]
            await unequipRequest(item.id)
            await potionsManager.updateSlot(item.slot, item.variant ? 'variantItems' : 'items')
            needToUnequip.removeItem(item)
        }
        while(needToEquip.length != 0) {
            let item = needToEquip[0]
            let id = Object.values(art_alt).find(o => o.title == item.item).id
            await equipPotionRequest(id, item.slotNum, item.variant ? '1' : '0')
            await potionsManager.updateSlot(item.slotNum, item.variant ? 'variantItems' : 'items')
            needToEquip.removeItem(item)
        }
    }

    setup() {
        this.loadBeltSets()
        this.fillSets()
        this.setupListeners()
    }
}
