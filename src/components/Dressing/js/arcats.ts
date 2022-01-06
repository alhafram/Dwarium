export interface InventoryItem {
    id: string | undefined
    title: string, desc: any, kind_id: string, type_id: string, skills: [{ value: any, title: string }]
}

export default function filterArcats(arcats: InventoryItem[]) {
    let antiInfury = arcats.filter(a => a.title.includes('антитравматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    arcats = arcats.removeItems(arcats.filter(a => a.title.includes('антитравматизма')))
    let barrier = arcats.filter(a => a.title.includes('барьера')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let vampirism = arcats.filter(a => a.title.includes('вампиризма')).sort((a, b) => a.desc - b.desc)[0]
    let health = arcats.filter(a => a.title.includes('живучести')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let initiative = arcats.filter(a => a.title.includes('инициативы')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let concentration = arcats.filter(a => a.title.includes('концентрации')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let blood = arcats.filter(a => a.title.includes('крови')).sort((a, b) => a.desc - b.desc)[0]
    let power = arcats.filter(a => a.title.includes('мощи')).sort((a, b) => a.desc - b.desc)[0]
    let suppression = arcats.filter(a => a.title.includes('подавления')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let insight = arcats.filter(a => a.title.includes('проницания')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let speed = arcats.filter(a => a.title.includes('скорости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let resilience = arcats.filter(a => a.title.includes('стойкости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    let injury = arcats.filter(a => a.title.includes('травматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    return {
        antiInfury,
        barrier,
        vampirism,
        health,
        initiative,
        concentration,
        blood,
        power,
        suppression,
        insight,
        speed,
        resilience,
        injury
    }
}