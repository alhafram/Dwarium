type BeltDressingSetPotion = {
    item: string
    slot: string
    variant: string | null
    image: string
}

export type BeltDressingSet = {
    id: string
    title: string
    potions: BeltDressingSetPotion[]
}
