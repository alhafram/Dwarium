/* eslint-disable @typescript-eslint/no-explicit-any */
export type InventoryItem = {
    id: string
    title: string
    desc: any
    kind_id: string
    type_id: string
    skills: [{ value: any; title: string }]
    quality: string
    image: string
    trend: string | undefined
    enchant_mod?: EnchantMode
    cnt: string
    foodType: FoodType
}

type EnchantMode = {
    title: string
    value: string
}

enum FoodType {
    HP = 'hp',
    MP = 'mp',
    BOTH = 'both'
}
