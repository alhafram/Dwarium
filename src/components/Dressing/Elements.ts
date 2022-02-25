export const Elements = {
    helmetDiv(): HTMLDivElement {
        return document.getElementById('helmetDiv') as HTMLDivElement
    },
    shouldersDiv(): HTMLDivElement {
        return document.getElementById('shouldersDiv') as HTMLDivElement
    },
    bracersDiv(): HTMLDivElement {
        return document.getElementById('bracersDiv') as HTMLDivElement
    },
    mainWeaponDiv(): HTMLDivElement {
        return document.getElementById('mainWeaponDiv') as HTMLDivElement
    },
    offhandWeaponDiv(): HTMLDivElement {
        return document.getElementById('offhandWeaponDiv') as HTMLDivElement
    },
    cuirassDiv(): HTMLDivElement {
        return document.getElementById('cuirassDiv') as HTMLDivElement
    },
    leggingsDiv(): HTMLDivElement {
        return document.getElementById('leggingsDiv') as HTMLDivElement
    },
    chainmailDiv(): HTMLDivElement {
        return document.getElementById('chainmailDiv') as HTMLDivElement
    },
    bootsDiv(): HTMLDivElement {
        return document.getElementById('bootsDiv') as HTMLDivElement
    },
    bowDiv(): HTMLDivElement {
        return document.getElementById('bowDiv') as HTMLDivElement
    },
    quiverDiv(): HTMLDivElement {
        return document.getElementById('quiverDiv') as HTMLDivElement
    },
    ringDiv(): HTMLDivElement {
        if(this.ring1Div().childElementCount == 1) {
            return this.ring1Div()
        } else {
            return this.ring2Div()
        }
    },
    ring1Div(): HTMLDivElement {
        return document.getElementById('ring1Div') as HTMLDivElement
    },
    ring2Div(): HTMLDivElement {
        return document.getElementById('ring2Div') as HTMLDivElement
    },
    amuletDiv(): HTMLDivElement {
        if(this.amulet1Div().childElementCount == 1) {
            return this.amulet1Div()
        } else {
            return this.amulet2Div()
        }
    },
    amulet1Div(): HTMLDivElement {
        return document.getElementById('amulet1Div') as HTMLDivElement
    },
    amulet2Div(): HTMLDivElement {
        return document.getElementById('amulet2Div') as HTMLDivElement
    },
    arcatDiv(): HTMLDivElement {
        if(this.arcat1Div().childElementCount == 1) {
            return this.arcat1Div()
        }
        if(!this.arcat2Div()) {
            return this.arcat1Div()
        }
        if(this.arcat2Div().childElementCount == 1) {
            return this.arcat2Div()
        }
        if(!this.arcat3Div()) {
            return this.arcat2Div()
        }
        if(this.arcat3Div().childElementCount == 1) {
            return this.arcat3Div()
        }
        if(!this.arcat4Div()) {
            return this.arcat3Div()
        }
        if(this.arcat4Div().childElementCount == 1) {
            return this.arcat4Div()
        } else {
            return this.arcat4Div()
        }
    },
    arcat1Div(): HTMLDivElement {
        return document.getElementById('arcat1Div') as HTMLDivElement
    },
    arcat2Div(): HTMLDivElement {
        return document.getElementById('arcat2Div') as HTMLDivElement
    },
    arcat3Div(): HTMLDivElement {
        return document.getElementById('arcat3Div') as HTMLDivElement
    },
    arcat4Div(): HTMLDivElement {
        return document.getElementById('arcat4Div') as HTMLDivElement
    },
    setsDiv(): HTMLDivElement {
        return document.getElementById('setsDiv') as HTMLDivElement
    },
    setTitleInput(): HTMLInputElement {
        return document.getElementById('setTitleInput') as HTMLInputElement
    },
    saveSetButton(): HTMLInputElement {
        return document.getElementById('saveSetButton') as HTMLInputElement
    },
    equipSetButton(): HTMLButtonElement {
        return document.getElementById('equipSetButton') as HTMLButtonElement
    },
    unequipButton(): HTMLButtonElement {
        return document.getElementById('unequipButton') as HTMLButtonElement
    },
    allItemsDiv(): HTMLDivElement {
        return document.getElementById('allItemsDiv') as HTMLDivElement
    },
    newSetButton(): HTMLInputElement {
        return document.getElementById('newSetButton') as HTMLInputElement
    },
    removeSetDiv(): HTMLButtonElement {
        return document.getElementById('removeSetDiv') as HTMLButtonElement
    },
    basketIcon(): HTMLElement {
        return document.getElementById('basketIcon') as HTMLElement
    },
    arcatsDiv(): HTMLDivElement {
        return document.getElementById('arcats') as HTMLDivElement
    }
}