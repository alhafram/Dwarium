function parse(art_alt) {
    let items = Array.from(Object.keys(art_alt).map(k => art_alt[k]))

    let zikkurat = items.filter(i => i.kind_id == '25' && i.type_id == '12')
    items = items.removeItems(zikkurat)


    let arcats = items.filter(i => i.kind_id == '161') // Arcats
    items = items.removeItems(arcats)

    let quivers = items.filter(i => i.kind_id == '131') // Quivers
    items = items.removeItems(quivers)

    let amulets = items.filter(i => i.kind_id == '25') // Amulets
    items = items.removeItems(amulets)

    let rings = items.filter(i => i.kind_id == '76' && i.type_id == '18') // Rings
    items = items.removeItems(rings)

    let bags = items.filter(i => i.kind_id == '30') // Bags
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
    },{
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

    let profWeapons = items.filter(i => i.kind_id == '42') // Profession weapons
    items = items.removeItems(profWeapons)

    let belts = items.filter(i => i.kind_id == '31') // Belts
    items = items.removeItems(belts)

    let bracelets = items.filter(i => i.kind_id == '137') // Bracelets
    items = items.removeItems(bracelets)

    let bows = items.filter(i => i.kind_id == '116') // Bows
    items = items.removeItems(bows)

    let helmets = items.filter(i => i.kind_id == '1') // Helmets
    items = items.removeItems(helmets)

    let shoulders = items.filter(i => i.kind_id == '7') // Shoulders
    items = items.removeItems(shoulders)

    let bracersIds = ['5', '77', '120']
    let bracers = items.filter(i => bracersIds.includes(i.kind_id)) // Bracers
    items = items.removeItems(bracers)

    let mainWeaponsKindIds = ['10', '12'] // 10 - 1h --- 12 - 2h
    let mainWeapons = items.filter(i => mainWeaponsKindIds.includes(i.kind_id)) // Main weapons
    items = items.removeItems(mainWeapons)

    let offhandWeaponsKindIds = ['44', '17'] // 44 - weapon --- 17 - shield
    let offhandWeapons = items.filter(i => offhandWeaponsKindIds.includes(i.kind_id)) // Offhand weapons
    items = items.removeItems(offhandWeapons)

    let cuirassesIds = ['20', '3']
    let cuirasses = items.filter(i => cuirassesIds.includes(i.kind_id)) // Cuirasses
    items = items.removeItems(cuirasses)

    let leggings = items.filter(i => i.kind_id == '6') // Leggingses
    items = items.removeItems(leggings)

    let chainmailsIds = ['21', '4']
    let chainmails = items.filter(i => chainmailsIds.includes(i.kind_id)) // Chainmails
    items = items.removeItems(chainmails)

    let boots = items.filter(i => i.kind_id == '2') // Boots
    items = items.removeItems(boots)

    let bannersIds = ['96']
    let banners = items.filter(i => bannersIds.includes(i.kind_id)) // Banners
    items = items.removeItems(banners)

    let summary = {
        arcats: arcats,
        quivers: quivers,
        amulets: amulets,
        rings: rings,
        bags: bags,
        decor: decorItems,
        profWeapons: profWeapons,
        belts: belts,
        bracelets: bracelets,
        bows: bows,
        helmets: helmets,
        shoulders: shoulders,
        bracers: bracers,
        mainWeapons: mainWeapons,
        offhandWeapons: offhandWeapons,
        cuirasses: cuirasses,
        leggings: leggings,
        chainmails: chainmails,
        boots: boots,
        banners: banners,
        other: items,
        zikkurat: zikkurat
    }
    return summary
}
