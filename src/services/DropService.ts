import { buildPath, ConfigPath } from '../Models/ConfigPathes'
import FileOperationsService from './FileOperationsService'

const path = buildPath(ConfigPath.DROP_INFO)

function loadDropInfo() {
    const dropInfo = FileOperationsService.parseData(path) as any
    return dropInfo
}

function saveDrop(dropMessages: any[]) {
    const dropInfo = loadDropInfo()
    const dateString = new Date().toDateString()
    const parsedDropInfo = parseDropMessages(dropMessages)
    const dropInfoByDate = dropInfo[dateString]
    if(dropInfoByDate) {
        dropInfoByDate.money = (parseFloat(dropInfoByDate.money) + parseFloat(parsedDropInfo.money)).toString()
        parsedDropInfo.dropItems.forEach((item) => {
            const savedDrop = dropInfoByDate.dropItems.find((element: { id: any }) => element.id == item.id)
            if(savedDrop) {
                const savedItem = dropInfoByDate.dropItems.find((element: { id: any }) => element.id == item.id)
                savedItem.num = (parseInt(savedItem.num) + parseInt(item.num)).toString()
            } else {
                dropInfoByDate.dropItems.push(item)
            }
        })
        dropInfo[dateString] = dropInfoByDate
    } else {
        dropInfo[dateString] = parsedDropInfo
    }
    FileOperationsService.writeData(path, JSON.stringify(dropInfo))
}

function parseDropMessages(dropMessages: any[]) {
    const moneyMessage = dropMessages.find((message) => message.macros_list[Object.keys(message.macros_list)[0]].name == 'MONEY')
    const money = moneyMessage.macros_list[Object.keys(moneyMessage.macros_list)[0]].data.money
    dropMessages.splice(dropMessages.indexOf(moneyMessage), 1)

    const dropItems: { id: any; num: any; title: any }[] = []
    dropMessages.forEach((message) => {
        const macrosListKey = Object.keys(message.macros_list)[0]
        const data = message.macros_list[macrosListKey].data
        const articulId = data.artikul_id
        const num = data.num
        const title = data.title
        dropItems.push({
            id: articulId,
            num,
            title
        })
    })
    return {
        money: money,
        dropItems
    }
}

export default {
    loadDropInfo,
    saveDrop
}
