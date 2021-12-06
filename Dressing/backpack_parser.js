function parse(art_alt) {
    let objects = Array.from(Object.keys(art_alt).map(k => art_alt[k]))

    let items = objects.filter(o => o.action == 'equip') // All items you can equip

    let arcats = items.filter(i => i.kind_id == '161') // Arcats
    items = items.filter(i => i.kind_id != '161')

    let quivers = items.filter(i => i.kind_id == '131') // Quivers
    items = items.filter(i => i.kind_id != '131')

    let amulets = items.filter(i => i.kind_id == '25') // Amulets
    items = items.filter(i => i.kind_id != '25')

    let rings = items.filter(i => i.kind_id == '76' && i.type_id == '18') // Rings
    items = items.filter(i => i.kind_id != '76' || i.type_id != '18')

    let bags = items.filter(i => i.kind_id == '30') // Bags
    items = items.filter(i => i.kind_id != '30')

    let decor_kind_ids = [{
        kind_id: '12',
        type_id: '2'
    }, {
        kind_id: '10',
        type_id: '2'
    }, {
        kind_id: '44',
        type_id: '2'
    },{
        kind_id: '17',
        type_id: '4'
    }, {
        kind_id: '76',
        type_id: '33'
    }]

    // Decor items
    let common_decor_items = items.filter(i => i.type_id == '111')
    items = items.filter(i => i.type_id != '111')
    let decor_items = items.filter(i => decor_kind_ids.some(d => d.kind_id == i.kind_id && d.type_id == i.type_id))
    decor_items = decor_items.concat(common_decor_items)
    items = items.filter(i => !decor_kind_ids.some(d => d.kind_id == i.kind_id && d.type_id == i.type_id))

    let prof_weapons = items.filter(i => i.kind_id == '42') // Profession weapons
    items = items.filter(i => i.kind_id != '42')

    let belts = items.filter(i => i.kind_id == '31') // Belts
    items = items.filter(i => i.kind_id != '31')

    let bracelets = items.filter(i => i.kind_id == '137') // Bracelets
    items = items.filter(i => i.kind_id != '137')

    let bows = items.filter(i => i.kind_id == '116') // Bows
    items = items.filter(i => i.kind_id != '116')

    let helmets = items.filter(i => i.kind_id == '1') // Helmets
    items = items.filter(i => i.kind_id != '1')

    let shoulders = items.filter(i => i.kind_id == '7') // Shoulders
    items = items.filter(i => i.kind_id != '7')

    let bracers_ids = ['5', '77', '120']
    let bracers = items.filter(i => bracers_ids.includes(i.kind_id)) // Bracers
    items = items.filter(i => !bracers_ids.includes(i.kind_id))

    let main_weapons_kind_ids = ['10', '12'] // 10 - 1h --- 12 - 2h
    let main_weapons = items.filter(i => main_weapons_kind_ids.includes(i.kind_id)) // Main weapons
    items = items.filter(i => !main_weapons_kind_ids.includes(i.kind_id))

    let offhand_weapons_kind_ids = ['44', '17'] // 44 - weapon --- 17 - shield
    let offhand_weapons = items.filter(i => offhand_weapons_kind_ids.includes(i.kind_id)) // Offhand weapons
    items = items.filter(i => !offhand_weapons_kind_ids.includes(i.kind_id))

    let cuirasses_ids = ['20', '3']
    let cuirasses = items.filter(i => cuirasses_ids.includes(i.kind_id)) // Cuirasses
    items = items.filter(i => !cuirasses_ids.includes(i.kind_id))

    let leggings = items.filter(i => i.kind_id == '6') // Leggingses
    items = items.filter(i => i.kind_id != '6')

    let chainmails_ids = ['21', '4']
    let chainmails = items.filter(i => chainmails_ids.includes(i.kind_id)) // Chainmails
    items = items.filter(i => !chainmails_ids.includes(i.kind_id))

    let boots = items.filter(i => i.kind_id == '2') // Boots
    items = items.filter(i => i.kind_id != '2')

    let banners_ids = ['96']
    let banners = items.filter(i => banners_ids.includes(i.kind_id)) // Banners
    items = items.filter(i => !banners_ids.includes(i.kind_id))

    let summary = {
        arcats: arcats,
        quivers: quivers,
        amulets: amulets,
        rings: rings,
        bags: bags,
        decor: decor_items,
        prof_weapons: prof_weapons,
        belts: belts,
        bracelets: bracelets,
        bows: bows,
        helmets: helmets,
        shoulders: shoulders,
        bracers: bracers,
        main_weapons: main_weapons,
        offhand_weapons: offhand_weapons,
        cuirasses: cuirasses,
        leggings: leggings,
        chainmails: chainmails,
        boots: boots,
        banners: banners,
        other: items
    }
    return summary
}

module.exports.parse = parse
