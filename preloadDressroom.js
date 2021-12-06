const {
    ipcRenderer
} = require("electron")

ipcRenderer.on('getItems', (event, items) => {
    let arr = []
    console.log(items.helmets)
    arr = arr.concat(items.helmets)
    arr = arr.concat(items.shoulders)
    arr = arr.concat(items.bracers)
    arr = arr.concat(items.main_weapons)
    arr = arr.concat(items.offhand_weapons)
    arr = arr.concat(items.cuirasses)
    arr = arr.concat(items.leggings)
    arr = arr.concat(items.chainmails)
    arr = arr.concat(items.boots)
    console.log(arr)
    arr.flatMap(i => i).forEach(item => {
        let parent = document.querySelector('.current_items')
        let divItem = document.createElement('div')
        divItem.className = 'box'
        divItem.draggable = 'true'
        divItem.setAttribute('equiped', 'false')
        divItem.style = `background-image: url('http://w1.dwar.ru/${item.image}');background-repeat: no-repeat;background-size: cover;`
        divItem.setAttribute('type', getType(item.kind_id))
        parent.appendChild(divItem)
    });
    document.dispatchEvent(new Event('AttachDND'))
})

function getType(kind_id) {
    if(kind_id == 1) {
        return 'helmet'
    }
    if(kind_id == 7) {
        return 'shoulders'
    }
    if(kind_id == '5' || kind_id == '77' || kind_id == '120') {
        return 'bracers'
    }
    if(kind_id == '10' || kind_id == '12') {
        return 'main_weapon'
    }
    if(kind_id == '44' || kind_id == '17') {
        return 'offhand_weapon'
    }
    if(kind_id == '20' || kind_id == '3') {
        return 'cuirass'
    }
    if(kind_id == '6') {
        return 'leggings'
    }
    if(kind_id == '21' || kind_id == '4') {
        return 'chain_mail'
    }
    if(kind_id == '2') {
        return 'boots'
    }
    return 'other'
 }
