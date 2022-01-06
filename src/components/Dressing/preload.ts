import { ipcRenderer, contextBridge } from 'electron'
import configService from '../../services/ConfigService'

interface DressingWindowState {
    currentElement: HTMLElement | null,
    // getEquipedItems(): HTMLElement[] {
    //     let items = Object.values(state).filter(obj => obj != null)
    //     return items.map(i => i.item).filter(i => i != null)
    // },
    currentStyle: string | null,
    armorTypeSelected: string | null,
    armorTypeSlotSelected: string | null,
    currentMagicSchool: string | null,
    zikkuratId: string | undefined | null,
    arcatsCount: 0
}

let state: DressingWindowState = {
    currentElement: null,
    // getEquipedItems(): HTMLElement[] {
    //     let items = Object.values(state).filter(obj => obj != null)
    //     return items.map(i => i.item).filter(i => i != null)
    // },
    currentStyle: null,
    armorTypeSelected: null,
    armorTypeSlotSelected: null,
    currentMagicSchool: null,
    zikkuratId: null,
    arcatsCount: 0
}

contextBridge.exposeInMainWorld('dressingAPI', {
    makeRequest: async (req: { id: string, req: string }) => {
        return await ipcRenderer.invoke('MakeWebRequest', req)
    },
    getMagicSchools: async (zikkuratId?: string) => {
        let req = `fetch(
            '${configService.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${zikkuratId}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1', {
                'headers': {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
                    'cache-control': 'max-age=0',
                    'upgrade-insecure-requests': '1'
                },
                'referrer': '${configService.baseUrl()}/user_iframe.php?group=2',
                'referrerPolicy': 'no-referrer-when-downgrade',
                'body': null,
                'method': 'GET',
                'mode': 'cors',
                'credentials': 'include'
            }).then(resp => resp.text())
      `
          return ipcRenderer.invoke('MakeWebRequest', {
                id: generateRandomId(),
                req: req
        })
    },
    baseUrl: () => {
        return configService.baseUrl()
    },
    loadItemsData: async (types: string[]) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    saveSet: (set: { id: string }) => {
        configService.writeData(set.id, JSON.stringify(set))
    },
    removeSet: (id: string) => {
        configService.writeData(id, null)
    },
    loadSets: () => {
        return configService.sets()
    },
    state: () => {
        return state
    }
})

export interface IMyAPIDressing {
    makeRequest: (req: { id: string, req: string }) => Promise<any>,
    baseUrl: () => string,
    loadItemsData: (types: string[]) => any,
    saveSet: (set: { id: string }) => void,
    removeSet: (id: string) => void,
    loadSets: () => DressingItem[],
    getMagicSchools: (zikkuratId?: string) => Promise<{ result: any, req: any }>,
    state: () => DressingWindowState
}

declare global {
    interface Window {
        dressingAPI: IMyAPIDressing
    }
    export interface String {
        toDocument(): Document
    }
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

String.prototype.toDocument = function() {
    var parser = new DOMParser();
    const str = this as string
    return parser.parseFromString(str, 'text/html');
}
