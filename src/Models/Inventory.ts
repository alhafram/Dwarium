import { InventoryItem } from './InventoryItem'

export type Arcats = {
    antiInfury: InventoryItem
    barrier: InventoryItem
    vampirism: InventoryItem
    health: InventoryItem
    initiative: InventoryItem
    concentration: InventoryItem
    blood: InventoryItem
    power: InventoryItem
    suppression: InventoryItem
    insight: InventoryItem
    speed: InventoryItem
    resilience: InventoryItem
    injury: InventoryItem
    intelligence: InventoryItem
}

export type Inventory = {
    [key: string]: InventoryItem[]
    arcats: InventoryItem[]
    quivers: InventoryItem[]
    amulets: InventoryItem[]
    rings: InventoryItem[]
    bags: InventoryItem[]
    decorItems: InventoryItem[]
    profWeapons: InventoryItem[]
    belts: InventoryItem[]
    bracelets: InventoryItem[]
    bows: InventoryItem[]
    helmets: InventoryItem[]
    shoulders: InventoryItem[]
    bracers: InventoryItem[]
    mainWeapons: InventoryItem[]
    offhandWeapons: InventoryItem[]
    cuirasses: InventoryItem[]
    leggings: InventoryItem[]
    chainmails: InventoryItem[]
    boots: InventoryItem[]
    banners: InventoryItem[]
    items: InventoryItem[]
    zikkurat: InventoryItem[]
}
