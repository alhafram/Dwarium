const fetch = require('electron-fetch').default

const configService = require('./ConfigService')
const current_server = configService.server

const Requests = {
    getMagicSchools: 'GetMagicSchools'
}

async function makeRequest(type, params) {
    if(type == Requests.getMagicSchools) {
        let req = await fetch(
            `http://${current_server}.dwar.ru/action_form.php?${Math.random()}&artifact_id=${params.id}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1`, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
                    "cache-control": "max-age=0",
                    "upgrade-insecure-requests": "1"
                },
                "referrer": `http://${current_server}.dwar.ru/user_iframe.php?group=2`,
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include",
                "useSessionCookies": true
            })
        let text = await req.text()
        return text
    }
}

module.exports = {
    Requests, makeRequest
}
