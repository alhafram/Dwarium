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
        parent.appendChild(divItem)
    });
    document.dispatchEvent(new Event('AttachDND'))
})
