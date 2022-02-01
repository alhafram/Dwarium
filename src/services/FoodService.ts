import ConfigService from './ConfigService'
import { ChatMessage } from './Notifications'
import UserConfigService from './UserConfigService'

type FoodItem = {
    id: string
    actionId: string
    addHp: number
    addMp: number
    cnt: number,
    picture: string
}

async function fetchFood(): Promise<FoodItem[]> {
    let req = await fetch(`${ConfigService.baseUrl()}/user_conf.php?mode=food`)
    let text = await req.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(text, "application/xml")
    const items = Array.from(doc.documentElement.children)
    return items.map(item => {
        const foodItem: FoodItem = {
            id: item.id,
            actionId: item.getAttribute('action_id')!,
            addHp: parseInt(item.getAttribute('add_hp')!),
            addMp: parseInt(item.getAttribute('add_mp')!),
            cnt: parseInt(item.getAttribute('cnt')!),
            picture: item.getAttribute('picture')!
        }
        return foodItem
    })
}

let hpFoodItem: FoodItem | undefined
let mpFoodItem: FoodItem | undefined

function reset() {
    hpFoodItem = undefined
    mpFoodItem = undefined
}

async function eat(message: ChatMessage) {
    if(!(message.channel == 2 && message.msg_text && message.msg_text.toLocaleLowerCase().includes('окончен бой') && !message.to_user_nicks)) {
        return
    }
    if(isGhost()) {
        return
    }

    // @ts-ignore
    const userId = top._top().myId as number;
    const config = UserConfigService.get(userId)
    const hpFood = config.hpFood
    const mpFood = config.mpFood
    if(hpFood || mpFood) {
        if(!hpFoodItem && !mpFoodItem) {
            const foodItems = await fetchFood()
            hpFoodItem = foodItems.find(foodItem => foodItem.id == hpFood?.id)
            mpFoodItem = foodItems.find(foodItem => foodItem.id == mpFood?.id)
        }
    }

    // @ts-ignore
    var hpCur = top[0].canvas.app.avatar.model.hpCur as number
    // @ts-ignore
    var hpMax = top[0].canvas.app.avatar.model.hpMax as number
    // @ts-ignore
    var mpCur = top[0].canvas.app.avatar.model.mpCur as number
    // @ts-ignore
    var mpMax = top[0].canvas.app.avatar.model.mpMax as number

    if(hpFoodItem && hpFood) {
        if(hpFoodItem.cnt <= 0) {
            ConfigService.writeData('hpFood', null)
            alert('Кончилась еда на хп')
            return
        }
        while((hpCur / hpMax) * 100 < parseInt(hpFood.percentage)) {
            if(isGhost()) {
                return
            }
            await useItem(hpFoodItem)
            hpCur += hpFoodItem.addHp
            mpCur += hpFoodItem.addMp
            if(!isBacon(hpFoodItem)) {
                hpFoodItem.cnt -= 1
            }
        }
    }

    if(mpFoodItem && mpFood) {
        if(mpFoodItem.cnt <= 0) {
            ConfigService.writeData('mpFood', null)
            alert('Кончилась еда на мп')
            return
        }
        while((mpCur / mpMax) * 100 < parseInt(mpFood.percentage)) {
            if(isGhost()) {
                return
            }
            await useItem(mpFoodItem)
            hpCur += mpFoodItem.addHp
            mpCur += mpFoodItem.addMp
            if(!isBacon(mpFoodItem)) {
                mpFoodItem.cnt -= 1
            }
        }
    }
}

function isGhost(): boolean {
    // @ts-ignore
    return top[0].canvas.app.avatar.model.ghost
}

function isBacon(item: FoodItem): boolean {
    return item.picture == 'food_bacon_n_eggs_violet.gif'
}

async function useItem(item: FoodItem): Promise<void> {
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

export default {
    eat,
    reset
}