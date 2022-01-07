import {
    ipcRenderer,
    contextBridge
} from 'electron'
import configService from '../../services/ConfigService'

contextBridge.exposeInMainWorld('dressingAPI', {
    makeRequest: async (req: {
        id: string,
        req: string
    }) => {
        return await ipcRenderer.invoke('MakeWebRequest', req)
    },
    getMagicSchools: async (zikkuratId ? : string) => {
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
    changeStyle: async (zikkuratId: string, styleId: number) => {
        let req = `fetch('${configService.baseUrl()}/action_run.php', {
            'headers': {
              'content-type': 'application/x-www-form-urlencoded',
              'upgrade-insecure-requests': '1'
            },
            'referrer': '${configService.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${zikkuratId}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1',
            'referrerPolicy': 'no-referrer-when-downgrade',
            'body': 'object_class=ARTIFACT&object_id=${zikkuratId}&action_id=3985&url_success=action_form.php%3Fsuccess%3D1%26default%3DARTIFACT_${zikkuratId}_3985&url_error=action_form.php%3Ffailed%3D1%26default%3DARTIFACT_${zikkuratId}_3985&artifact_id=${zikkuratId}&in%5Bobject_class%5D=ARTIFACT&in%5Bobject_id%5D=${zikkuratId}&in%5Baction_id%5D=3985&in%5Burl_success%5D=action_form.php%3Fsuccess%3D1&in%5Burl_error%5D=action_form.php%3Ffailed%3D1&in%5Bparam_success%5D%5Burl_close%5D=user.php%3Fmode%3Dpersonage%26amp%3Bgroup%3D2%26amp%3Bupdate_swf%3D1&in%5Bclass_id%5D=${styleId}',
            'method': 'POST',
            'mode': 'cors',
            'credentials': 'include'
          }).then(resp => resp.text())`
        return ipcRenderer.invoke('MakeWebRequest', {
            id: generateRandomId(),
            req: req
        })
    },
    equipRequest: async (id: string) => {
        var rnd_url = '&_=' + (new Date().getTime() + Math.random())
        let req =
            `fetch('${configService.baseUrl()}/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&artifact_id=${id}&in[slot_num]=0&in[variant_effect]=0&ajax=1${rnd_url}', {
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
    baseUrl: () => {
        return configService.baseUrl()
    },
    loadItemsData: async (types: string[]) => {
        return await ipcRenderer.invoke('LoadSetItems', types)
    },
    saveSet: (set: {
        id: string
    }) => {
        configService.writeData(set.id, JSON.stringify(set))
    },
    removeSet: (id: string) => {
        configService.writeData(id, null)
    },
    loadSets: () => {
        return configService.sets()
    }
})

export interface IMyAPIDressing {
    makeRequest: (req: {
            id: string,
            req: string
        }) => Promise < any > ,
        baseUrl: () => string,
        loadItemsData: (types: string[]) => any,
        saveSet: (set: {
            id: string
        }) => void,
        removeSet: (id: string) => void,
        loadSets: () => DressingItem[],
        getMagicSchools: (zikkuratId ? : string) => Promise < {
            result: any,
            req: any
        } > ,
        unequipRequest: (id: string) => Promise < {
            result: any,
            req: any
        } > ,
        equipRequest: (id: string) => Promise < {
            result: any,
            req: any
        } > ,
        changeStyle: (zikkuratId: string, styleId: number) => (id: string) => Promise < {
            result: any,
            req: any
        } >
}

declare global {
    interface Window {
        dressingAPI: IMyAPIDressing
    }
    export interface String {
        toDocument(): Document
    }
    export interface Array < T > {
        unique(): Array < T >
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

Array.prototype.unique = function() {
    return Array.from(new Set(this))
}