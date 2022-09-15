import { ipcRenderer } from 'electron'
import { Channel } from '../../Models/Channel'
import { UserConfig } from '../../Models/UserConfig'
import UserConfigService from '../../Services/UserConfigService'

async function getUserId() {
    return (await ipcRenderer.invoke(Channel.GET_ID)) as number
}

function getUserConfig(id: number) {
    return UserConfigService.get(id)
}

function save(userConfig: UserConfig) {
    ipcRenderer.send(Channel.FOOD_CHANGED)
    UserConfigService.save(userConfig)
}

async function loadItemsData(types: string[]) {
    return await ipcRenderer.invoke('LoadSetItems', types)
}

Array.prototype.removeItem = function(element) {
    var index = this.indexOf(element)
    if(index != -1) {
        this.splice(index, 1)
    }
    return this
}

Array.prototype.removeItems = function(elements) {
    for(var element of elements) {
        var index = this.indexOf(element)
        if(index != -1) {
            this.splice(index, 1)
        }
    }
    return this
}

String.prototype.toDocument = function() {
    var parser = new DOMParser();
    return parser.parseFromString(this.toString(), 'text/html');
}

Document.prototype.createElementFromString = function(str: string): ChildNode {
    const element = new DOMParser().parseFromString(str, 'text/html')
    return element.body.firstChild!
}

declare global {
    export interface String {
        toDocument(): Document
    }
    export interface Document {
        createElementFromString(str: string): ChildNode
    }
    export interface Array<T> {
        removeItem(elem: T): T[]
        removeItems(arr: T[]): T[]
    }
}

export enum DressingFilterColor {
    GRAY = 'i_gray',
    GREEN = 'i_green',
    BLUE = 'i_blue',
    PURPLE = 'i_purple',
    RED = 'i_red'
}

function getQuality(filter: DressingFilterColor): string {
    switch (filter) {
        case DressingFilterColor.GRAY:
            return '0'
        case DressingFilterColor.GREEN:
            return '1'
        case DressingFilterColor.BLUE:
            return '2'
        case DressingFilterColor.PURPLE:
            return '3'
        case DressingFilterColor.RED:
            return '4'
    }
}

function getFilterColor(quality: string): DressingFilterColor {
    switch (quality) {
        case '0':
            return DressingFilterColor.GRAY
        case '1':
            return DressingFilterColor.GREEN
        case '2':
            return DressingFilterColor.BLUE
        case '3':
            return DressingFilterColor.PURPLE
        case '4':
            return DressingFilterColor.RED
        default:
            return DressingFilterColor.GRAY
    }
}

function generateRandomId() {
    return (Math.random() + 1).toString(36).substring(2)
}

function instapocketUseRequest(id: string) {
    return `top[0].instapocketUse(${id})`
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    getUserId,
    getUserConfig,
    save,
    loadItemsData,
    generateRandomId,
    getQuality,
    getFilterColor,
    instapocketUseRequest,
    delay
}