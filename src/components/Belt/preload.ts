import {
    ipcRenderer,
    contextBridge
} from 'electron'
import configService from '../../services/ConfigService'
import '../BaseAPI'

contextBridge.exposeInMainWorld('beltPotionAPI', {
    baseUrl: () => {
        return configService.baseUrl()
    },
    loadItemsData: async (types: string[]) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    makeRequest: async (req: {
        id: string,
        req: string
    }) => {
        return await ipcRenderer.invoke('MakeWebRequest', req)
    },
    loadBeltSets: () => {
        return configService.beltSets()
    },
    saveSet: (set: any) => {
        configService.writeData(set.id, JSON.stringify(set))
    },
    removeSet: (id: string) => {
        configService.writeData(id, null)
    },
    fetchItem: (id: string) => {
        let reqUrl = `fetch('${configService.baseUrl()}/artifact_info.php?artifact_id=${id}').then(resp => resp.text())`
        let req = {
            id: generateRandomId(),
            req: reqUrl
        }
        return ipcRenderer.invoke('MakeWebRequest', req)
    },
    unequipRequest: async (id: string) => {
        var rnd_url = '&_=' + (new Date().getTime() + Math.random())
        let req =
            `fetch('${configService.baseUrl()}/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&ajax=1${rnd_url}', {
          'headers': {
            'accept': '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
          },
          'referrerPolicy': 'no-referrer-when-downgrade',
          'body': null,
          'method': 'GET',
          'mode': 'cors',
          'credentials': 'include'
         }).then(resp => resp.text())`
        return ipcRenderer.invoke('MakeWebRequest', {
            id: generateRandomId(),
            req: req
        })
    },
    equipPotionRequest: async (id: string, slotNum: string, variantNum: string) => {
        var rnd_url = '&_=' + (new Date().getTime() + Math.random())
        let req = `fetch('${configService.baseUrl()}/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&in[slot_num]=${slotNum}&in[variant_effect]=${variantNum}&ajax=1&_=${rnd_url}', {
          'headers': {
              'accept': '*/*',
              'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
              'cache-control': 'no-cache',
              'pragma': 'no-cache'
          },
          'referrerPolicy': 'no-referrer-when-downgrade',
          'body': null,
          'method': 'GET',
          'mode': 'cors',
          'credentials': 'include'
          }).then(resp => resp.text())`
          return ipcRenderer.invoke('MakeWebRequest', {
            id: generateRandomId(),
            req: req
        })
    }
})


export interface BeltPotionAPI {
    makeRequest: (req: {
            id: string,
            req: string
        }) => Promise < any > ,
        baseUrl: () => string,
        loadItemsData: (types: string[]) => any,
        loadBeltSets: () => any,
        saveSet: (set: {}) => void,
        removeSet: (id: string) => void,
        fetchItem: (id: string) => Promise<any>,
        unequipRequest: (id: string) => Promise < {
            result: any,
            req: any
        } > ,
        equipPotionRequest: (id: string, slotNum: string, variantNum: string) => Promise < {
            result: any,
            req: any
        } > ,
}

declare global {
    interface Window {
        beltPotionAPI: BeltPotionAPI
    }
}

function generateRandomId(): string {
    return (Math.random() + 1).toString(36).substring(2)
}