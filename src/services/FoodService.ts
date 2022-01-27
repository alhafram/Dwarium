import { ipcRenderer } from "electron"
import { InventoryItem } from '../Models/InventoryItem'
import ConfigService from './ConfigService'
import { FoodSettings } from '../Models/FoodSettings'

export default async function eat() {
    // @ts-ignore
    if(top[0].canvas.app.avatar.model.ghost) {
        return
    }
    const result = await ipcRenderer.invoke('LoadSetItems', ['allItems', 'allPotions'])
    const allItems = Object.keys(result.allItems).map(key => result.allItems[key]) as InventoryItem[]
    const allPotions = Object.keys(result.allPotions).map(key => result.allPotions[key]) as InventoryItem[]
    const itemsWithFoodEnchant = allItems.filter(item => item.enchant_mod && item.enchant_mod.value.includes('сытости'))
    const foodItems = allPotions.filter(item => item.kind_id == '48')
    const allFoodItems = itemsWithFoodEnchant.concat(foodItems)

    const hpFood = ConfigService.hpFood()
    const mpFood = ConfigService.mpFood()
    let hpEatCounter = 0
    if(hpFood && hpFood.id) {
        if(!hpFood.actionId) {
            alert('Пересохраните настройки еды!')
            return
        }
        const hpFoodInInventory = allFoodItems.find(item => item.id == hpFood.id)
        if(hpFoodInInventory) {
            // @ts-ignore
            while((top[0].canvas.app.avatar.model.hpCur / top[0].canvas.app.avatar.model.hpMax) * 100 < hpFood.percentage) {
                // @ts-ignore
                if(top[0].canvas.app.avatar.model.ghost) {
                    return
                }
                if(hpEatCounter > 9) {
                    alert('Еда на хп съелась 10 раз!! Возможно что то пошло не так! Напишите в группу!!!')
                    return
                }
                await useItem(hpFood)
                hpEatCounter += 1
            }
        } else {
            ConfigService.writeData('hpFood', null)
            alert('Кончилась еда на ХП')
        }
    }
    let mpEatCounter = 0
    if(mpFood && mpFood.id) {
        if(!mpFood.actionId) {
            alert('Пересохраните настройки еды!')
            return
        }
        const mpFoodInInventory = allFoodItems.find(item => item.id == mpFood.id)
        if(mpFoodInInventory) {
            // @ts-ignore
            if((top[0].canvas.app.avatar.model.mpCur / top[0].canvas.app.avatar.model.mpMax) * 100 < mpFood.percentage) {
                // @ts-ignore
                if(top[0].canvas.app.avatar.model.ghost) {
                    return
                }
                if(mpEatCounter > 9) {
                    alert('Еда на хп съелась 10 раз!! Возможно что то пошло не так! Напишите в группу!!!')
                    return
                }
                await useItem(mpFood)
                mpEatCounter += 1
            }
        } else {
            ConfigService.writeData('mpFood', null)
            alert('Кончилась еда на МП')
        }
    }
}

async function useItem(item: FoodSettings): Promise<void> {
    await fetch(`${ConfigService.baseUrl()}/action_run.php`, {
        'headers': {
            'content-type': 'application/x-www-form-urlencoded',
        },
        'referrer': `${ConfigService.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${item.id}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D1%26update_swf%3D1`,
        'referrerPolicy': 'no-referrer-when-downgrade',
        'body': `object_class=ARTIFACT&object_id=${item.id}&action_id=${item.actionId}&url_success=action_form.php%3Fsuccess%3D1%26default%3DARTIFACT_${item.id}_${item.actionId}&url_error=action_form.php%3Ffailed%3D1%26default%3DARTIFACT_${item.id}_${item.actionId}&artifact_id=${item.id}&in%5Bobject_class%5D=ARTIFACT&in%5Bobject_id%5D=${item.id}&in%5Baction_id%5D=${item.actionId}&in%5Burl_success%5D=action_form.php%3Fsuccess%3D1&in%5Burl_error%5D=action_form.php%3Ffailed%3D1&in%5Bparam_success%5D%5Burl_close%5D=user.php%3Fmode%3Dpersonage%26amp%3Bgroup%3D1%26amp%3Bupdate_swf%3D1`,
        'method': 'POST',
        'mode': 'cors',
        'credentials': 'include'
    })
}