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
    cnt: string | null
    foodType: FoodType
    slot: string | undefined | null
    variant: string | undefined | null
    picture: string | undefined | null
    time_expire: string | undefined | null
    storage_type: string | undefined | null
}

type EnchantMode = {
    title: string
    value: string
}

export enum FoodType {
    HP = 'hp',
    MP = 'mp',
    BOTH = 'both'
}
