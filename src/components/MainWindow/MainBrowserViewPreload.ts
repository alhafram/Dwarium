// @ts-nocheck
import { ipcRenderer } from "electron"
import ConfigService from "../../services/ConfigService"

const {
    checkLmtsProxyReady,
    setupChatTotalReconnect,
    setupChatInterval,
    setupReceiver,
    setupAutoResponder,
    setupShortcut
} = require('./Chat')

window.addEventListener('DOMContentLoaded', async () => {

    // TODO - TS migration
    let firstInterval = setInterval(async () => {
        if(!top[1] || !top[1].LMTS) {
            return
        }
        if(top[1].LMTS.isConnected() && top[1].LMTS.isAuthorized()) {
            setupReceiver()
            checkLmtsProxyReady()
            clearInterval(firstInterval)
            console.log(new Date(), "DONE 2")
            setupChatTotalReconnect()
            setupChatInterval()
            // setupAutoResponder() // TODO: - 1.1.0
            setupShortcut()
        }
    }, 100)

    console.log(new Date(), "DONE 1")
})

async function useItem(id) {
    await fetch(`${ConfigService.baseUrl()}/action_form.php?${Math.random()}&in[param_success][url_close]=1&artifact_id=${id}&in[external]=1&in[noconfirm]=1`, {
        "headers": {
            "upgrade-insecure-requests": "1"
        },
        "referrer": `${ConfigService.baseUrl()}/main_frame.php`,
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
}

document.addEventListener('eat', async () => {
    const result = await ipcRenderer.invoke('LoadSetItems', ['allItems', 'allPotions'])
    const allItems = Object.keys(result.allItems).map(key => result.allItems[key]) as InventoryItem[]
    const allPotions = Object.keys(result.allPotions).map(key => result.allPotions[key]) as InventoryItem[]
    const itemsWithFoodEnchant = allItems.filter(item => item.enchant_mod && item.enchant_mod.value.includes('сытости'))
    const foodItems = allPotions.filter(item => item.kind_id == '48')
    const allFoodItems = itemsWithFoodEnchant.concat(foodItems)

    const mpFood = ConfigService.mpFood()
    const hpFood = ConfigService.hpFood()
    let hpEatCounter = 0
    if(hpFood && hpFood.id) {
        const hpFoodInInventory = allFoodItems.find(item => item.id == hpFood.id)
        if(hpFoodInInventory) {
            while((top[0].canvas.app.avatar.model.hpCur / top[0].canvas.app.avatar.model.hpMax) * 100 < hpFood.percentage) {
                if(hpEatCounter > 9) {
                    alert("Еда на хп съелась 10 раз!! Возможно что то пошло не так! Напишите в группу!!!")
                    return
                }
                await useItem(hpFood.id)
                console.log("EAT HP")
                hpEatCounter += 1
            }
        } else {
            ConfigService.writeData('hpFood', null)
            alert("Кончилась еда на ХП")
        }
    }
    let mpEatCounter = 0
    if(mpFood && mpFood.id) {
        const mpFoodInInventory = allFoodItems.find(item => item.id == mpFood.id)
        if(mpFoodInInventory) {
            if((top[0].canvas.app.avatar.model.mpCur / top[0].canvas.app.avatar.model.mpMax) * 100 < mpFood.percentage) {
                if(mpEatCounter > 9) {
                    alert("Еда на хп съелась 10 раз!! Возможно что то пошло не так! Напишите в группу!!!")
                    return
                }
                await useItem(mpFood.id)
                mpEatCounter += 1
            }
        } else {
            ConfigService.writeData('mpFood', null)
            alert("Кончилась еда на МП")
        }
    }
})

ipcRenderer.on('userPrv', function(event, nick) {
    userPrvTag(nick)
})
