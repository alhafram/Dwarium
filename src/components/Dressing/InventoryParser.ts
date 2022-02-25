import { Arcats, Inventory } from '../../Models/Inventory'
import { InventoryItem } from '../../Models/InventoryItem'

export default function parse(art_alt: InventoryItem[]): Inventory {
    let items = Object.values(art_alt)

    const delimiters = items.filter((item) => item.title == 'Разделитель')
    items = items.removeItems(delimiters)

    const zikkurat = items.filter((i) => i.kind_id == '25' && i.type_id == '12')
    items = items.removeItems(zikkurat)

    let arcats = items.filter((i) => i.kind_id == '161')
    items = items.removeItems(arcats)

    arcats = Object.values(filterArcats(arcats))
    arcats = arcats.filter((a) => a)

    const quivers = items.filter((i) => i.kind_id == '131')
    items = items.removeItems(quivers)

    const rings = items.filter((i) => i.kind_id == '76' && i.type_id == '18')
    items = items.removeItems(rings)

    const bags = items.filter((i) => i.kind_id == '30')
    items = items.removeItems(bags)

    const decorKindIds = [
        {
            kind_id: '12',
            type_id: '2'
        },
        {
            kind_id: '10',
            type_id: '2'
        },
        {
            kind_id: '44',
            type_id: '2'
        },
        {
            kind_id: '17',
            type_id: '4'
        },
        {
            kind_id: '76',
            type_id: '33'
        }
    ]

    // Decor items
    const commonDecorItems = items.filter((i) => i.type_id == '111')
    let decorItems = items.filter((i) => decorKindIds.some((d) => d.kind_id == i.kind_id && d.type_id == i.type_id))
    decorItems = decorItems.concat(commonDecorItems)
    items = items.removeItems(decorItems)

    const amulets = items.filter((i) => i.kind_id == '25')
    items = items.removeItems(amulets)

    const profWeapons = items.filter((i) => i.kind_id == '42' || i.kind_id == '41' || i.kind_id == '51')
    items = items.removeItems(profWeapons)

    const belts = items.filter((i) => i.kind_id == '31')
    items = items.removeItems(belts)

    const bracelets = items.filter((i) => i.kind_id == '137')
    items = items.removeItems(bracelets)

    const bows = items.filter((i) => i.kind_id == '116')
    items = items.removeItems(bows)

    const helmets = items.filter((i) => i.kind_id == '1')
    items = items.removeItems(helmets)

    const shoulders = items.filter((i) => i.kind_id == '7')
    items = items.removeItems(shoulders)

    const bracersIds = ['5', '77', '120']
    const bracers = items.filter((i) => bracersIds.includes(i.kind_id))
    items = items.removeItems(bracers)

    const mainWeaponsKindIds = ['10', '12'] // 10 - 1h --- 12 - 2h
    const mainWeapons = items.filter((i) => mainWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(mainWeapons)

    const offhandWeaponsKindIds = ['44', '17'] // 44 - weapon --- 17 - shield
    const offhandWeapons = items.filter((i) => offhandWeaponsKindIds.includes(i.kind_id))
    items = items.removeItems(offhandWeapons)

    const cuirassesIds = ['20', '3']
    const cuirasses = items.filter((i) => cuirassesIds.includes(i.kind_id))
    items = items.removeItems(cuirasses)

    const leggings = items.filter((i) => i.kind_id == '6')
    items = items.removeItems(leggings)

    const chainmailsIds = ['21', '4']
    const chainmails = items.filter((i) => chainmailsIds.includes(i.kind_id))
    items = items.removeItems(chainmails)

    const boots = items.filter((i) => i.kind_id == '2')
    items = items.removeItems(boots)

    const bannersIds = ['96']
    const banners = items.filter((i) => bannersIds.includes(i.kind_id))
    items = items.removeItems(banners)

    const summary = {
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
    const antiInfury = arcats.filter((a) => a.title.includes('антитравматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    arcats = arcats.removeItems(arcats.filter((a) => a.title.includes('антитравматизма')))
    const barrier = arcats.filter((a) => a.title.includes('барьера')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const vampirism = arcats.filter((a) => a.title.includes('вампиризма')).sort((a, b) => a.desc - b.desc)[0]
    const health = arcats.filter((a) => a.title.includes('живучести')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const initiative = arcats.filter((a) => a.title.includes('инициативы')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const concentration = arcats.filter((a) => a.title.includes('концентрации')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const blood = arcats.filter((a) => a.title.includes('крови')).sort((a, b) => a.desc - b.desc)[0]
    const power = arcats.filter((a) => a.title.includes('мощи')).sort((a, b) => a.desc - b.desc)[0]
    const suppression = arcats.filter((a) => a.title.includes('подавления')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const insight = arcats.filter((a) => a.title.includes('проницания')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const speed = arcats.filter((a) => a.title.includes('скорости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const resilience = arcats.filter((a) => a.title.includes('стойкости')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const injury = arcats.filter((a) => a.title.includes('травматизма')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
    const intelligence = arcats.filter((a) => a.title.includes('интеллекта')).sort((a, b) => a.skills[0].value - b.skills[0].value)[0]
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
