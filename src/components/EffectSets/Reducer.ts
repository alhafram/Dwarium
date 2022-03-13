import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { EffectSet } from '../../Models/EffectSet'
import { InventoryItem } from '../../Models/InventoryItem'
import SimpleAlt from '../../Scripts/simple_alt'
import { SetElements } from '../Common/Set/Elements'
import Utils from '../Common/Utils'
import { EffectSetsWindowActions } from './Actions'
import { EffectSetsWindowState } from './EffectSetsWindowState'
import { Elements } from './Elements'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        case EffectSetsWindowActions.USE_EFFECTS:
            Elements.useEffectsButton().disabled = true
            for(const item of state.currentItems) {
                const request = Utils.instapocketUseRequest(item.id)
                await ipcRenderer.invoke(Channel.MAKE_WEB_REQUEST, request)
            }
            Elements.useEffectsButton().disabled = false
            return state
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
                set.ids = state.currentItems.map((item) => item.id)
                sets[sets.indexOf(set)] = set
            } else {
                set = {
                    id: generateSetId(),
                    title: SetElements.setTitleInput().value,
                    ids: state.currentItems.map((item) => item.id)
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
            const selectedSetItems = state.allItems.filter((item) => selectedSet.ids.includes(item.id))
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
    }
}

function generateSetId() {
    return 'effect_set_' + Utils.generateRandomId()
}

function createNewEffectSet(): EffectSet {
    const id = generateSetId()
    const newSet: EffectSet = {
        id: id,
        title: 'Default set',
        ids: []
    }
    return newSet
}
