export function userInfoAchieventFix(): string {
    return `
    const achInterval = setInterval(() => {
        var elem = document.querySelector("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td > div > div.bg-l > div > div > div > div > div > div > div > table:nth-child(2)")
        if(elem) {
            elem.style.width = '730px'
            clearInterval(achInterval)
        }
    }, 100)
    `
}

export function ergamFix(): string {
    return `
    const egramInterval = setInterval(() => {
        if(document && document.game && document.game.main && document.game.main.children && document.game.main.children[0] && document.game.main.children[0]?.location && document.game.main.children[0]?.location.children &&  document.game.main.children[0]?.location.children[1]) {
            const elem = document.game.main.children[0].location.children[1]
            var scale = 282 / document.game.main.children[0].location.children[1].width
            if(document.game.main.children[0].location.children[1].width > 300) {
                document.game.main.children[0].location.children[1].transform.scale.x = scale
                document.game.main.children[0].location.children[1].transform.scale.y = scale
                clearInterval(egramInterval)
            }
        }
    }, 100)
    `
}

export function eldivInfoFix(): string {
    return `
    const repInterval = setInterval(() => {
        let elem = document.querySelector("#user_skills_a8 > tr:nth-child(15) > td:nth-child(1)")?.firstElementChild ?? top[0][2].document.querySelector("#user_skills_a8 > tr:nth-child(15) > td:nth-child(1)")?.firstElementChild
        if(elem) {
            elem.target = '_blank'
            clearInterval(repInterval)
        }
        let elem2 = document.querySelector("#user_skills_a8 > tr:nth-child(17) > td:nth-child(1) > a") ?? top[0][2].document.querySelector("#user_skills_a8 > tr:nth-child(17) > td:nth-child(1) > a")
        if(elem2) {
            elem2.target = '_blank'
            clearInterval(repInterval)
        }
    }, 100)
    `
}