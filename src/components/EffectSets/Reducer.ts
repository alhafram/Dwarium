import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { EffectSet } from '../../Models/EffectSet'
import { InventoryItem } from '../../Models/InventoryItem'
import SimpleAlt from '../../Scripts/simple_alt'
import ConfigService from '../../services/ConfigService'
import { SetElements } from '../Common/Set/Elements'
import Utils from '../Common/Utils'
import { EffectSetsWindowActions } from './Actions'
import { EffectSetsWindowState } from './EffectSetsWindowState'
import { Elements } from './Elements'

export default async function reduce(state: EffectSetsWindowState, action: EffectSetsWindowActions, data?: any): Promise<EffectSetsWindowState> {
    switch (action) {
        case EffectSetsWindowActions.LOAD_CONTENT: {
            const result = await ipcRenderer.invoke('LoadSetItems', ['effectSetsItems'])
            const loadedItems = result.effectSetsItems
            let availableItems = Object.keys(loadedItems)
                .filter((key) => key.startsWith('AA_'))
                .map((key) => loadedItems[key]) as InventoryItem[]
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            availableItems = availableItems.sort((a, b) => a.quality - b.quality)
            SimpleAlt.setupArtAlt(loadedItems)

            const userId = (await Utils.getUserId()) as number
            if(!userId) {
                alert('Не найден user id пользователя, попробуйте авторизоваться и заново открыть автопоедалку!')
                return state
            }
            const userConfig = Utils.getUserConfig(userId)

            return {
                ...state,
                allItems: availableItems,
                sets: userConfig.effectSets ?? [],
                userConfig: userConfig
            }
        }
        case EffectSetsWindowActions.USE_EFFECTS: {
            const items = state.currentItems
            Elements.useEffectsButton().disabled = true
            for(const item of items) {
                const body = await parseBody(item)
                await useItem(item.id, body)
            }
            Elements.useEffectsButton().disabled = false
            return state
        }
        case EffectSetsWindowActions.ADD_EFFECT: {
            const itemid = data as string
            const item = state.allItems.find((item) => item.id == itemid)
            if(!item) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return state
            }
            if(state.currentItems.includes(item)) {
                alert('Такой предмет уже есть в наборе')
                return state
            }
            state.currentItems.push(item)
            return {
                ...state
            }
        }
        case EffectSetsWindowActions.REMOVE_EFFECT: {
            const itemid = data as string
            const item = state.allItems.find((item) => item.id == itemid)
            if(!item) {
                alert('ШО ТО НЕ ТАК!!! Напиши в группу')
                return state
            }
            const currentItems = state.currentItems.removeItem(item)
            return {
                ...state,
                currentItems: currentItems
            }
        }
        case EffectSetsWindowActions.CREATE_NEW_SET: {
            const newSet = createNewEffectSet()
            const sets = state.sets
            sets.push(newSet)
            state.userConfig!.effectSets = sets
            Utils.save(state.userConfig!)
            return {
                ...state,
                currentSet: newSet,
                sets: sets,
                currentItems: []
            }
        }
        case EffectSetsWindowActions.REMOVE_SET: {
            const deletedSetBox = data as HTMLDivElement | null
            let sets = state.sets
            const deletedSet = sets.find((set) => set.id == deletedSetBox?.id)
            if(deletedSet) {
                const isCurrentSet = deletedSet == state.currentSet
                sets = sets.removeItem(deletedSet)

                state.userConfig!.effectSets = sets
                Utils.save(state.userConfig!)

                const currentSet = isCurrentSet ? null : state.currentSet
                return {
                    ...state,
                    sets: sets,
                    currentSet: currentSet
                }
            } else {
                return {
                    ...state
                }
            }
        }
        case EffectSetsWindowActions.SAVE_SET: {
            let set = state.currentSet
            const sets = state.sets
            if(set) {
                set.title = SetElements.setTitleInput().value
                set.items = state.currentItems
                sets[sets.indexOf(set)] = set
            } else {
                set = {
                    id: generateSetId(),
                    title: SetElements.setTitleInput().value,
                    items: state.currentItems
                }
                sets.push(set)
            }
            state.userConfig!.effectSets = sets
            Utils.save(state.userConfig!)
            return {
                ...state,
                currentSet: set,
                sets: sets
            }
        }
        case EffectSetsWindowActions.SELECT_SET: {
            const selectedSet = data as EffectSet
            const selectedSetItems = selectedSet.items
                .filter((item) => {
                    if(state.allItems.map((item) => item.id).includes(item.id ?? '')) {
                        return item
                    } else {
                        const foundedItemByTitle = state.allItems.find((inventoryItem) => inventoryItem.title == item.title)
                        if(foundedItemByTitle) {
                            return foundedItemByTitle
                        }
                    }
                })
                .map((effectItem) => {
                    const foundedItem = state.allItems.find((item) => item.title == effectItem.title)
                    if(foundedItem) {
                        return foundedItem
                    }
                })
                .filter((item) => item) as InventoryItem[]
            return {
                ...state,
                currentSet: selectedSet,
                currentItems: selectedSetItems
            }
        }
        case EffectSetsWindowActions.ADD_FILTER: {
            const newFilters = state.activeFilters
            newFilters.push(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        }
        case EffectSetsWindowActions.REMOVE_FILTER: {
            let newFilters = state.activeFilters
            newFilters = newFilters.removeItem(data)
            return {
                ...state,
                activeFilters: newFilters
            }
        }
        case EffectSetsWindowActions.SEARCH_EFFECT: {
            const searchString = Elements.searchEffectInput().value
            return {
                ...state,
                searchEffect: searchString
            }
        }
        case EffectSetsWindowActions.CHANGE_ORDER: {
            const replacedItemId = data[0] as string | undefined
            const draggableItemId = data[1] as string | undefined
            if(replacedItemId && draggableItemId) {
                const replacedItem = state.currentItems.find(item => item.id == replacedItemId)
                const draggableItem = state.currentItems.find(item => item.id == draggableItemId)
                if(replacedItem && draggableItem) {
                    const replacedItemIndex = state.currentItems.indexOf(replacedItem)
                    const draggableItemIndex = state.currentItems.indexOf(draggableItem)
                    state.currentItems[replacedItemIndex] = draggableItem
                    state.currentItems[draggableItemIndex] = replacedItem
                }
            }
            return state
        }
    }
}

function loadItem(id: string) {
    const req = `fetch(
        '${ConfigService.getSettings().baseUrl}/action_form.php?${Math.random()}&artifact_id=${id}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1', {
            'headers': {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
                'cache-control': 'max-age=0',
                'upgrade-insecure-requests': '1'
            },
            'referrer': '${ConfigService.getSettings().baseUrl}/user_iframe.php?group=2',
            'referrerPolicy': 'no-referrer-when-downgrade',
            'body': null,
            'method': 'GET',
            'mode': 'cors',
            'credentials': 'include'
        }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

async function useItem(id: string, body: string) {
    const req = `fetch('${ConfigService.getSettings().baseUrl}/action_run.php', {
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        'referrer': '${ConfigService.getSettings().baseUrl}/action_form.php?${Math.random()}&artifact_id=${id}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D1%26update_swf%3D1',
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': '${body}',
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'include'
    }).then(resp => resp.text())`
    return ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, req)
}

function generateSetId() {
    return 'effect_set_' + Utils.generateRandomId()
}

function createNewEffectSet(): EffectSet {
    const id = generateSetId()
    const newSet: EffectSet = {
        id: id,
        title: 'Default set',
        items: []
    }
    return newSet
}

async function parseBody(inventoryItem: InventoryItem): Promise<string> {
    const res = (await loadItem(inventoryItem.id)) as string
    const doc = res.toDocument()
    const inputs = Array.from(doc.getElementsByTagName('input')).filter((input) => input.type == 'hidden')
    const parsedInputs = inputs.map((input) => {
        return {
            name: input.name,
            value: input.value
        }
    })
    const nickInput = Array.from(doc.getElementsByTagName('input')).find((item) => item.name == 'in[target_nick]')
    if(nickInput) {
        const nick = await ipcRenderer.invoke(Channel.GET_NICK)
        parsedInputs.push({
            name: nickInput.name,
            value: nick
        })
    }
    const body = parsedInputs.map((parsedInput) => `${parsedInput.name}=${parsedInput.value}`).join('&')
    return body
}
