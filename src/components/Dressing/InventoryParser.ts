import { Arcats, Inventory } from "../../Models/Inventory"
import { InventoryItem } from "../../Models/InventoryItem"

export default function parse(art_alt: InventoryItem[]): Inventory {
    let items = Object.values(art_alt)

    let delimiters = items.filter(item => item.title == 'Разделитель')
    items = items.removeItems(delimiters)

    let zikkurat = items.filter(i => i.kind_id == '25' && i.type_id == '12')
    items = items.removeItems(zikkurat)

    let arcats = items.filter(i => i.kind_id == '161')
    items = items.removeItems(arcats)
    
    arcats = Object.values(filterArcats(arcats))
    arcats = arcats.filter(a => a)

    let quivers = items.filter(i => i.kind_id == '131')
    items = items.removeItems(quivers)

    let rings = items.filter(i => i.kind_id == '76' && i.type_id == '18')
    items = items.removeItems(rings)

    let bags = items.filter(i => i.kind_id == '30')
    items = items.removeItems(bags)

    let decorKindIds = [{
        kind_id: '12',
        type_id: '2'
    }, {
        kind_id: '10',
        type_id: '2'
    }, {
        kind_id: '44',
        type_id: '2'
    }, {
        kind_id: '17',
        type_id: '4'
    }, {
        kind_id: '76',
        type_id: '33'
    }]

    // Decor items
    let commonDecorItems = items.filter(i => i.type_id == '111')
    let decorItems = items.filter(i => decorKindIds.some(d => d.kind_id == i.kind_id && d.type_id == i.type_id))
    decorItems = decorItems.concat(commonDecorItems)
    items = items.removeItems(decorItems)

    let amulets = items.filter(i => i.kind_id == '25')
    items = items.removeItems(amulets)

    let profWeapons = items.filter(i => i.kind_id == '42' || i.kind_id == '41' || i.kind_id == '51')
    items = items.removeItems(profWeapons)

    let belts = items.filter(i => i.kind_id == '31')
    items = items.removeItems(belts)

    let bracelets = items.filter(i => i.kind_id == '137')
    items = items.removeItems(bracelets)

    let bows = items.filter(i => i.kind_id == '116')
    items = items.removeItems(bows)

    let helmets = items.filter(i => i.kind_id == '1')
    items = items.removeItems(helmets)

    let shoulders = items.filter(i => i.kind_id == '7')
    items = items.removeItems(shoulders)

    let bracersIds = ['5', '77', '120']
    let bracers = items.filter(i => bracersIds.includes(i.kind_id))
    items = items.removeItems(bracers)

    let mainWeaponsKindIds = ['10', '12'] // 10 - 1h --- 12 - 2h
    let mainWeapons = items.filter(i => mainWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(mainWeapons)

    let offhandWeaponsKindIds = ['44', '17'] // 44 - weapon --- 17 - shield
    let offhandWeapons = items.filter(i => offhandWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(offhandWeapons)

    let cuirassesIds = ['20', '3']
    let cuirasses = items.filter(i => cuirassesIds.includes(i.kind_id))
    items = items.removeItems(cuirasses)

    let leggings = items.filter(i => i.kind_id == '6')
    items = items.removeItems(leggings)

    let chainmailsIds = ['21', '4']
    let chainmails = items.filter(i => chainmailsIds.includes(i.kind_id))
    items = items.removeItems(chainmails)

    let boots = items.filter(i => i.kind_id == '2')
    items = items.removeItems(boots)

    let bannersIds = ['96']
    let banners = items.filter(i => bannersIds.includes(i.kind_id))
    items = items.removeItems(banners)

    let summary = {
        arcats,
        quivers,
        amulets,
        rings,
        bags,
        decorItems,
        profWeapons,
        belts,
        bracelets,
        bows,
        helmets,
        shoulders,
        bracers,
        mainWeapons,
        offhandWeapons,
        cuirasses,
        leggings,
        chainmails,
        boots,
        banners,
        items,
        zikkurat
    }
    return summary
}

function filterArcats(arcats: InventoryItem[]): Arcats {
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
    let intelligence = arcats.filter(a => a.title.includes('интеллекта')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
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
        injury,
        intelligence
    }
}