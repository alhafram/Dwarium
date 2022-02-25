import { handleDragOver } from '../Common/EventBuilder'
import { DressingFilterColor, generateRandomId, getQuality } from '../Utils'
import { DressingWindowActions } from './Actions'
import { DressingWindowState } from './DressingWindowState'
import { Elements } from './Elements'
import { convertItemIntoDiv } from '../Common/ItemBuilder'
import SimpleAlt from '../../Scripts/simple_alt'
import dispatch from './preload'
import { DressingSet } from '../../Models/DressingSet'

function getAllStaticDivs(): HTMLDivElement[] {
    return [
        Elements.helmetDiv(),
        Elements.shouldersDiv(),
        Elements.bracersDiv(),
        Elements.mainWeaponDiv(),
        Elements.offhandWeaponDiv(),
        Elements.cuirassDiv(),
        Elements.leggingsDiv(),
        Elements.chainmailDiv(),
        Elements.bootsDiv(),
        Elements.bowDiv(),
        Elements.quiverDiv(),
        Elements.ring1Div(),
        Elements.ring2Div(),
        Elements.amulet1Div(),
        Elements.amulet2Div(),
        Elements.arcat1Div(),
        Elements.arcat2Div(),
        Elements.arcat3Div(),
        Elements.arcat4Div()
    ]
}

function render(initialState: DressingWindowState): void {
    getAllStaticDivs().forEach((box) => {
        if(box != null) {
            box.classList.replace('potionBoxSmallHighlighted', 'potionBoxSmall')
            box.classList.replace('potionBoxHighlighted', 'potionBox')
            box.style.borderWidth = '4px'
            const svg = box.firstElementChild as SVGElement | null
            if(svg) {
                svg.style.display = 'block'
                const pathes = Array.from(svg.children)
                pathes.forEach((path) => {
                    path.classList.replace('dressingBoxBgHighlighted', 'dressingBoxBg')
                })
            }
            if(box.childElementCount > 1) {
                const lastElementChild = box.lastElementChild
                if(lastElementChild) {
                    box.removeChild(lastElementChild)
                }
            }
        }
    })
    Array.from(Elements.allItemsDiv().children ?? []).forEach((item) => Elements.allItemsDiv().removeChild(item))
    const allItemDivs = initialState.allItems.map((item) => {
        const element = convertItemIntoDiv(item, undefined)
        element.style.display = 'block'
        const parent = Elements.allItemsDiv()
        setupEquipableItemEvents(element)
        parent?.appendChild(element)
        return element
    })
    Array.from(Elements.arcatsDiv().children ?? []).forEach((item) => Elements.arcatsDiv().removeChild(item))
    if(initialState.arcatsCount != 0) {
        for(let i = 0; i < initialState.arcatsCount; i++) {
            const arcatSlot = createArcatSlot(i)
            const parent = Elements.arcatsDiv()
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
    const equipedItemsIds = initialState.currentEquipedItems.map((item) => item.id)
    if(initialState.selectedStaticItemId) {
        const box = eval(`Elements_1.Elements.${initialState.selectedStaticItemId}()`) as HTMLDivElement
        box.classList.replace('potionBoxSmall', 'potionBoxSmallHighlighted')
        box.classList.replace('potionBox', 'potionBoxHighlighted')
        const svg = box.firstElementChild as SVGElement | null
        if(svg) {
            const pathes = Array.from(svg.children)
            pathes.forEach((path) => {
                path.classList.replace('dressingBoxBg', 'dressingBoxBgHighlighted')
            })
        }
        const visibleItems = allItemDivs.filter((item) => item.style.display != 'none' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
        visibleItems.forEach((item) => (item.style.display = item.getAttribute('type') == box.getAttribute('type') ? 'block' : 'none'))
    }
    let visibleItems = allItemDivs.filter((item) => item.style.display != 'none' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
    for(const filter of initialState.activeFilters) {
        const filterQuality = getQuality(filter)
        const items = visibleItems.filter((e) => e.getAttribute('quality') == filterQuality)
        items.forEach((item) => (item.style.display = 'none'))
    }
    if(initialState.currentStyle) {
        visibleItems = visibleItems.filter((item) => item.style.display == 'block' && !equipedItemsIds.includes(item.getAttribute('itemid') ?? ''))
        visibleItems.forEach((item) => (item.style.display = item.getAttribute('trend') == initialState.currentStyle || item.getAttribute('trend') == 'Универсал' ? 'block' : 'none'))
    }
    for(const equipedItem of initialState.currentEquipedItems) {
        const equipedDiv = Array.from(Elements.allItemsDiv().children ?? []).find((item) => item.getAttribute('itemid') == equipedItem.id) as HTMLElement | undefined
        if(!equipedDiv) {
            alert('ШО ТО НЕ ТАК!!! Напиши в группу')
            return
        }
        const type = equipedDiv.getAttribute('type')
        const itemBox = eval(`Elements_1.Elements.${type}Div()`) as HTMLDivElement

        const isWeapon = equipedDiv.getAttribute('weapon')
        itemBox.appendChild(equipedDiv)
        equipedDiv.setAttribute('equiped', 'true')
        if(type == 'ring' || type == 'amulet' || type == 'arcat') {
            equipedDiv.style.width = '40px'
            equipedDiv.style.height = '40px'
        } else {
            equipedDiv.style.width = '70px'
            equipedDiv.style.height = '70px'
        }
        if(itemBox.firstElementChild) {
            (itemBox.firstElementChild as HTMLElement).style.display = 'none'
        }
        itemBox.style.borderWidth = '0px'
        if(isWeapon) {
            if(isWeapon == '2h') {
                const copyWeapon = equipedDiv.cloneNode(true) as HTMLElement
                copyWeapon.setAttribute('copy', 'true')
                copyWeapon.setAttribute('equiped', 'true')
                setupEquipableItemEvents(copyWeapon)
                Elements.offhandWeaponDiv().appendChild(copyWeapon)

                copyWeapon.style.opacity = '0.6'
                copyWeapon.style.width = '70px'
                copyWeapon.style.height = '70px'
                Elements.offhandWeaponDiv().style.borderWidth = '0px'
                if(Elements.offhandWeaponDiv().firstElementChild) {
                    (Elements.offhandWeaponDiv().firstElementChild as HTMLElement).style.display = 'none'
                }
            }
        }
    }
    Elements.allItemsDiv().ondragover = handleDragOver
    Elements.allItemsDiv().ondrop = handleDropEquipableItemIntoAllItems

    Array.from(Elements.setsDiv().children)
        .filter((element) => element.id.startsWith('set_'))
        .forEach((element) => Elements.setsDiv().removeChild(element))
    for(const set of initialState.sets) {
        const isActive = initialState.currentSet == set
        const setDiv = createNoteElement(set, isActive)
        if(isActive) {
            Elements.setTitleInput().value = set.title
        }
        Elements.setsDiv().appendChild(setDiv)
    }
    setupInteractionEvents(initialState)
}

function setupInteractionEvents(initialState: DressingWindowState) {
    const armorTypes = ['helmet', 'shoulders', 'bracers', 'mainWeapon', 'offhandWeapon', 'cuirass', 'leggings', 'chainmail', 'boots', 'bow', 'quiver', 'ring1', 'ring2', 'amulet1', 'amulet2']
    armorTypes.forEach((t) => {
        const itemBox = eval(`Elements_1.Elements.${t}Div()`) as HTMLElement
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
}

let dragableItem: HTMLDivElement | null = null

function handleDragStartEquipableItem(this: any) {
    dragableItem = this
    SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, this)
    highlightDressingBox(this)
}

function handleDragEndEquipableItem(this: any) {
    dragableItem = null
    getAllStaticDivs().forEach((box) => {
        if(box) {
            box.classList.replace('potionBoxSmallHighlighted', 'potionBoxSmall')
            box.classList.replace('potionBoxHighlighted', 'potionBox')
            const svg = box.firstElementChild as SVGElement | null
            if(svg) {
                const pathes = Array.from(svg.children)
                pathes.forEach((path) => {
                    path.classList.replace('dressingBoxBgHighlighted', 'dressingBoxBg')
                })
            }
        }
    })
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

function highlightDressingBox(item: HTMLElement) {
    const type = item.getAttribute('type')
    if(type != 'ring' && type != 'amulet' && type != 'arcat') {
        const box = eval(`Elements_1.Elements.${type}Div()`) as HTMLDivElement
        box.classList.replace('potionBoxSmall', 'potionBoxSmallHighlighted')
        box.classList.replace('potionBox', 'potionBoxHighlighted')
        const svg = box.firstElementChild as SVGElement | null
        if(svg) {
            const pathes = Array.from(svg.children)
            pathes.forEach((path) => {
                path.classList.replace('dressingBoxBg', 'dressingBoxBgHighlighted')
            })
        }
    } else {
        let boxes: HTMLDivElement[] = []
        if(type == 'ring') {
            boxes = [Elements.ring1Div(), Elements.ring2Div()]
        }
        if(type == 'amulet') {
            boxes = [Elements.amulet1Div(), Elements.amulet2Div()]
        }
        if(type == 'arcat') {
            boxes = [Elements.arcat1Div(), Elements.arcat2Div(), Elements.arcat3Div(), Elements.arcat4Div()]
        }
        boxes.forEach((box) => {
            if(box) {
                box.classList.replace('potionBoxSmall', 'potionBoxSmallHighlighted')
                box.classList.replace('potionBox', 'potionBoxHighlighted')
                const svg = box.firstElementChild as SVGElement | null
                if(svg) {
                    const pathes = Array.from(svg.children)
                    pathes.forEach((path) => {
                        path.classList.replace('dressingBoxBg', 'dressingBoxBgHighlighted')
                    })
                }
            }
        })
    }
}

function setupEquipableItemEvents(item: HTMLElement) {
    item.addEventListener('dragstart', handleDragStartEquipableItem, false)
    item.ondragover = handleDragOver
    item.addEventListener('dragend', handleDragEndEquipableItem, false)
    item.onclick = handleClickEquipableItem
    item.addEventListener(
        'mouseover',
        function() {
            SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 2, this)
        },
        false
    )
    item.addEventListener(
        'mouseout',
        function() {
            SimpleAlt.artifactAltSimple(this.getAttribute('itemid'), 0, this)
        },
        false
    )
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
    const newArcatString = `
    <div id="arcat${id + 1}Div" type="arcat" class="potionBoxSmall ml-4">
        <svg class="m-auto" width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path class="dressingBoxBg" d="M14.4331 3.41333C14.3715 3.3518 14.288 3.31721 14.2009 3.31714H8.01758C7.93057 3.31718 7.84714 3.35178 7.78564 3.41333L3.41333 7.78545C3.3518 7.84704 3.31721 7.93052 3.31714 8.01758V14.2009C3.31721 14.288 3.3518 14.3715 3.41333 14.4331L7.78564 18.8052C7.84714 18.8667 7.93057 18.9013 8.01758 18.9014H14.2009C14.288 18.9013 14.3715 18.8667 14.4331 18.8052L18.8052 14.4331C18.8667 14.3715 18.9013 14.288 18.9014 14.2009V8.01758C18.9013 7.93052 18.8667 7.84704 18.8052 7.78545L14.4331 3.41333ZM15.2751 9.02801L13.1905 6.94339L14.3166 4.22464L17.9939 7.90301L15.2751 9.02801ZM12.6672 14.8701H9.55151L7.34839 12.6672V9.55133L9.55151 7.34839H12.6672L14.8701 9.55133V12.6672L12.6672 14.8701ZM12.5836 6.69214H9.63476L8.50864 3.97339H13.7099L12.5836 6.69214ZM9.02801 6.94339L6.94339 9.02801L4.22464 7.90301L7.90301 4.22464L9.02801 6.94339ZM6.69214 9.63495V12.5836L3.97339 13.7099V8.50864L6.69214 9.63495ZM6.94339 13.1905L9.02801 15.2751L7.90189 17.9939L4.22464 14.3155L6.94339 13.1905ZM9.63476 15.5268H12.5836L13.7099 18.2455H8.50864L9.63476 15.5268ZM14.3155 17.9939L13.1905 15.2751L15.2751 13.1905L17.9939 14.3166L14.3155 17.9939ZM15.5256 12.5836V9.63495L18.2444 8.50864V13.7099L15.5256 12.5836Z" />
            <path class="dressingBoxBg" d="M13.1918 8.53615C13.1299 8.4764 13.047 8.44334 12.9609 8.4441C12.8749 8.44487 12.7926 8.4794 12.7318 8.54024C12.671 8.60109 12.6365 8.6834 12.6358 8.76943C12.635 8.85546 12.6681 8.93834 12.7279 9.00022L13.4591 9.73147C13.4894 9.76285 13.5255 9.78789 13.5656 9.80514C13.6056 9.82239 13.6486 9.8315 13.6922 9.83194C13.7357 9.83238 13.7789 9.82414 13.8193 9.8077C13.8596 9.79126 13.8963 9.76694 13.9272 9.73618C13.958 9.70542 13.9824 9.66882 13.999 9.62852C14.0155 9.58822 14.0239 9.54502 14.0236 9.50146C14.0233 9.45789 14.0143 9.41482 13.9971 9.37477C13.98 9.33471 13.9551 9.29847 13.9238 9.26815L13.1918 8.53615Z" />
            <path class="dressingBoxBg" d="M11.1094 2.34375C11.1964 2.34375 11.2799 2.30918 11.3414 2.24764C11.4029 2.18611 11.4375 2.10265 11.4375 2.01562V0.328125C11.4375 0.241101 11.4029 0.157641 11.3414 0.0961056C11.2799 0.0345702 11.1964 0 11.1094 0C11.0224 0 10.9389 0.0345702 10.8774 0.0961056C10.8158 0.157641 10.7812 0.241101 10.7812 0.328125V2.01562C10.7812 2.10265 10.8158 2.18611 10.8774 2.24764C10.9389 2.30918 11.0224 2.34375 11.1094 2.34375Z" />
            <path class="dressingBoxBg" d="M12.6282 2.62006C12.7086 2.65318 12.7989 2.65307 12.8793 2.61975C12.9596 2.58644 13.0235 2.52264 13.057 2.44231L13.7027 0.883252C13.7192 0.843437 13.7277 0.800762 13.7277 0.757664C13.7277 0.714567 13.7192 0.67189 13.7027 0.632071C13.6863 0.592252 13.6621 0.556071 13.6316 0.525592C13.6011 0.495114 13.565 0.470936 13.5252 0.454439C13.4853 0.437942 13.4427 0.429448 13.3996 0.429443C13.3565 0.429438 13.3138 0.437922 13.274 0.45441C13.2342 0.470899 13.198 0.495068 13.1675 0.525539C13.137 0.556011 13.1128 0.592187 13.0963 0.632002L12.4504 2.19125C12.4172 2.27169 12.4172 2.36203 12.4506 2.44243C12.4839 2.52283 12.5478 2.58671 12.6282 2.62006Z" />
            <path class="dressingBoxBg" d="M9.16244 2.44231C9.18729 2.50227 9.22936 2.55351 9.28332 2.58955C9.33729 2.62559 9.40073 2.64483 9.46563 2.64481C9.51961 2.6449 9.57278 2.63166 9.62041 2.60626C9.66804 2.58086 9.70866 2.54408 9.73866 2.49921C9.76866 2.45433 9.78711 2.40274 9.79237 2.34901C9.79763 2.29529 9.78954 2.2411 9.76882 2.19125L9.12307 0.632002C9.08975 0.551591 9.02586 0.48771 8.94544 0.45441C8.86502 0.421111 8.77467 0.421121 8.69426 0.454439C8.61385 0.487757 8.54997 0.551653 8.51667 0.632071C8.48337 0.712489 8.48338 0.802841 8.51669 0.883252L9.16244 2.44231Z" />
            <path class="dressingBoxBg" d="M21.8906 10.7812H20.2031C20.1161 10.7812 20.0326 10.8158 19.9711 10.8774C19.9096 10.9389 19.875 11.0224 19.875 11.1094C19.875 11.1964 19.9096 11.2799 19.9711 11.3414C20.0326 11.4029 20.1161 11.4375 20.2031 11.4375H21.8906C21.9776 11.4375 22.0611 11.4029 22.1226 11.3414C22.1842 11.2799 22.2188 11.1964 22.2188 11.1094C22.2188 11.0224 22.1842 10.9389 22.1226 10.8774C22.0611 10.8158 21.9776 10.7812 21.8906 10.7812Z" />
            <path class="dressingBoxBg" d="M21.5866 13.0958L20.0274 12.4499C19.9873 12.4323 19.9442 12.4229 19.9005 12.4222C19.8568 12.4215 19.8134 12.4295 19.7728 12.4458C19.7322 12.4621 19.6953 12.4863 19.6643 12.5171C19.6332 12.5478 19.6086 12.5845 19.5919 12.6249C19.5751 12.6653 19.5666 12.7086 19.5669 12.7523C19.5672 12.796 19.5761 12.8393 19.5933 12.8795C19.6105 12.9197 19.6355 12.956 19.667 12.9864C19.6984 13.0168 19.7356 13.0406 19.7763 13.0565L21.3354 13.7022C21.3752 13.7187 21.4179 13.7272 21.461 13.7272C21.5041 13.7272 21.5467 13.7187 21.5865 13.7022C21.6264 13.6857 21.6625 13.6616 21.693 13.6311C21.7235 13.6006 21.7477 13.5645 21.7642 13.5246C21.7807 13.4848 21.7892 13.4422 21.7892 13.3991C21.7892 13.356 21.7807 13.3133 21.7642 13.2735C21.7477 13.2336 21.7236 13.1975 21.6931 13.167C21.6626 13.1365 21.6264 13.1123 21.5866 13.0958Z" />
            <path class="dressingBoxBg" d="M19.9032 9.79376C19.9461 9.79369 19.9887 9.78528 20.0284 9.76901L21.5877 9.12307C21.6275 9.10657 21.6637 9.0824 21.6941 9.05192C21.7246 9.02144 21.7488 8.98526 21.7653 8.94544C21.7818 8.90562 21.7902 8.86294 21.7902 8.81985C21.7902 8.77675 21.7817 8.73407 21.7652 8.69426C21.7487 8.65444 21.7246 8.61827 21.6941 8.5878C21.6636 8.55732 21.6274 8.53315 21.5876 8.51667C21.5478 8.50018 21.5051 8.49169 21.462 8.4917C21.4189 8.4917 21.3762 8.5002 21.3364 8.5167L19.7774 9.16245C19.7072 9.19149 19.6493 9.24398 19.6134 9.31096C19.5776 9.37795 19.5662 9.45528 19.581 9.52976C19.5959 9.60425 19.6361 9.67128 19.6948 9.71942C19.7536 9.76756 19.8272 9.79384 19.9032 9.79376Z" />
            <path class="dressingBoxBg" d="M11.1094 19.875C11.0224 19.875 10.9389 19.9096 10.8774 19.9711C10.8158 20.0326 10.7812 20.1161 10.7812 20.2031V21.8906C10.7812 21.9776 10.8158 22.0611 10.8774 22.1226C10.9389 22.1842 11.0224 22.2188 11.1094 22.2188C11.1964 22.2188 11.2799 22.1842 11.3414 22.1226C11.4029 22.0611 11.4375 21.9776 11.4375 21.8906V20.2031C11.4375 20.1161 11.4029 20.0326 11.3414 19.9711C11.2799 19.9096 11.1964 19.875 11.1094 19.875Z" />
            <path class="dressingBoxBg" d="M9.59058 19.5987C9.51015 19.5656 9.4199 19.5657 9.33958 19.5991C9.25925 19.6324 9.19539 19.6961 9.16196 19.7764L8.51621 21.3355C8.49971 21.3753 8.49122 21.418 8.49121 21.4611C8.49121 21.5042 8.49969 21.5468 8.51618 21.5867C8.53267 21.6265 8.55684 21.6627 8.58731 21.6931C8.61778 21.7236 8.65395 21.7478 8.69377 21.7643C8.73358 21.7808 8.77626 21.7893 8.81936 21.7893C8.86245 21.7893 8.90513 21.7808 8.94495 21.7643C8.98477 21.7478 9.02095 21.7237 9.05143 21.6932C9.08191 21.6627 9.10608 21.6265 9.12258 21.5867L9.76833 20.0275C9.8016 19.947 9.80157 19.8567 9.76824 19.7763C9.7349 19.6959 9.671 19.632 9.59058 19.5987Z" />
            <path class="dressingBoxBg" d="M13.0565 19.7763C13.0406 19.7356 13.0168 19.6984 12.9864 19.667C12.956 19.6355 12.9197 19.6105 12.8795 19.5933C12.8393 19.5761 12.796 19.5672 12.7523 19.5669C12.7086 19.5666 12.6653 19.5751 12.6249 19.5919C12.5845 19.6086 12.5478 19.6332 12.5171 19.6643C12.4863 19.6953 12.4621 19.7322 12.4458 19.7728C12.4295 19.8134 12.4215 19.8568 12.4222 19.9005C12.4229 19.9442 12.4323 19.9873 12.4499 20.0274L13.0958 21.5866C13.1123 21.6264 13.1365 21.6626 13.167 21.6931C13.1975 21.7236 13.2336 21.7477 13.2735 21.7642C13.3133 21.7807 13.356 21.7892 13.3991 21.7892C13.4422 21.7892 13.4848 21.7807 13.5246 21.7642C13.5645 21.7477 13.6006 21.7235 13.6311 21.693C13.6616 21.6625 13.6857 21.6264 13.7022 21.5865C13.7187 21.5467 13.7272 21.5041 13.7272 21.461C13.7272 21.4179 13.7187 21.3752 13.7022 21.3354L13.0565 19.7763Z" />
            <path class="dressingBoxBg" d="M2.34375 11.1094C2.34375 11.0224 2.30918 10.9389 2.24764 10.8774C2.18611 10.8158 2.10265 10.7812 2.01562 10.7812H0.328125C0.241101 10.7812 0.157641 10.8158 0.0961056 10.8774C0.0345702 10.9389 0 11.0224 0 11.1094C0 11.1964 0.0345702 11.2799 0.0961056 11.3414C0.157641 11.4029 0.241101 11.4375 0.328125 11.4375H2.01562C2.10265 11.4375 2.18611 11.4029 2.24764 11.3414C2.30918 11.2799 2.34375 11.1964 2.34375 11.1094Z" />
            <path class="dressingBoxBg" d="M2.44231 9.16245L0.883252 8.5167C0.843437 8.5002 0.800762 8.4917 0.757664 8.4917C0.714567 8.49169 0.67189 8.50018 0.632071 8.51667C0.592252 8.53315 0.556071 8.55732 0.525592 8.5878C0.495114 8.61827 0.470936 8.65444 0.454439 8.69426C0.437942 8.73407 0.429448 8.77675 0.429443 8.81985C0.429438 8.86294 0.437922 8.90562 0.45441 8.94544C0.470899 8.98526 0.495068 9.02144 0.525539 9.05192C0.556011 9.0824 0.592187 9.10657 0.632002 9.12307L2.19106 9.76901C2.23089 9.78528 2.27348 9.79369 2.3165 9.79376C2.39245 9.79384 2.46608 9.76756 2.52483 9.71942C2.58357 9.67128 2.62379 9.60425 2.63864 9.52976C2.65348 9.45528 2.64203 9.37795 2.60623 9.31096C2.57042 9.24398 2.51249 9.19149 2.44231 9.16245Z" />
            <path class="dressingBoxBg" d="M2.19107 12.4498L0.632002 13.0957C0.551591 13.129 0.48771 13.1929 0.45441 13.2733C0.421111 13.3538 0.421121 13.4441 0.454439 13.5245C0.487757 13.6049 0.551653 13.6688 0.632071 13.7021C0.712489 13.7354 0.802842 13.7354 0.883252 13.7021L2.44232 13.0563C2.52137 13.0221 2.5838 12.9581 2.61613 12.8783C2.64846 12.7984 2.6481 12.709 2.61513 12.6294C2.58216 12.5498 2.51921 12.4864 2.43988 12.4528C2.36055 12.4192 2.27119 12.4181 2.19107 12.4498Z" />
        </svg>
    </div>`
    const parser = new DOMParser()
    const newArcatDiv = parser.parseFromString(newArcatString, 'text/html').body.firstElementChild as HTMLDivElement
    newArcatDiv.setAttribute('type', 'arcat')
    newArcatDiv.ondragover = handleDragOver
    newArcatDiv.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
    return newArcatDiv
}

let dragableSet: any = null
function createNoteElement(note: DressingSet, isActive = false) {
    const newNoteString = `
        <div id="${note.id}" draggable="true" class="hover:bg-lightMediumGrey dark:hover:bg-secondaryDark mt-3 cursor-pointer w-40 h-14 ${
    isActive ? 'bg-lightMediumGrey dark:bg-secondaryDark border-4 border-dashed border-secondaryLightDark dark:border-secondaryLight' : 'bg-light dark:bg-secondaryBlack'
} rounded-3xl">
            <p class="pl-2 pt-2 text-secondaryLightDark dark:text-secondaryLight text-ellipsis whitespace-nowrap overflow-hidden font-montserrat font-extrabold text-xss">${note.title}</p>
        </div>`
    const parser = new DOMParser()
    const newNoteDiv = parser.parseFromString(newNoteString, 'text/html').body.firstElementChild as HTMLDivElement
    newNoteDiv.ondragstart = function() {
        newNoteDiv.style.opacity = '0.4'
        dragableSet = newNoteDiv
        Elements.removeSetDiv().classList.replace('basket', 'basketActive')
        Elements.basketIcon().classList.replace('basketIcon', 'basketIconActive')
    }
    newNoteDiv.ondragend = function() {
        newNoteDiv.style.opacity = '1'
        dragableSet = null
        Elements.removeSetDiv().classList.replace('basketActive', 'basket')
        Elements.basketIcon().classList.replace('basketIconActive', 'basketIcon')
    }
    newNoteDiv.ondragover = function(e) {
        e.preventDefault()
    }
    newNoteDiv.onclick = function() {
        dispatch(DressingWindowActions.SELECT_SET, note)
    }
    return newNoteDiv
}

function generateSetId() {
    return 'set_' + generateRandomId()
}

function addNewSet(): DressingSet {
    const id = generateSetId()
    const newSet: DressingSet = {
        id: id,
        title: 'Default set',
        ids: [],
        style: null,
        magicSchool: null
    }
    return newSet
}

function setupView() {
    getAllStaticDivs().forEach(function(item) {
        if(item) {
            item.ondragover = handleDragOver
            item.addEventListener('drop', handleDropEquipableItemOnStaticItemBox, false)
        }
    })
    setupFilters()

    Elements.newSetButton().onclick = function() {
        const newSet = addNewSet()
        dispatch(DressingWindowActions.CREATE_NEW_SET, newSet)
    }
    Elements.removeSetDiv().ondrop = function(e) {
        e.preventDefault()
        dispatch(DressingWindowActions.REMOVE_SET, dragableSet)
    }
    Elements.removeSetDiv().ondragover = function(e) {
        e.preventDefault()
    }
    Elements.unequipButton().onclick = function() {
        dispatch(DressingWindowActions.UNEQUIP_ALL)
    }
    Elements.equipSetButton().onclick = function() {
        dispatch(DressingWindowActions.EQUIP_FROM_SET)
    }
    Elements.saveSetButton().onclick = function() {
        dispatch(DressingWindowActions.SAVE_SET)
    }
}

export { setupView, render }
