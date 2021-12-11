async function unequipRequest(id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random());
    let req =
        `fetch("http://${window.myAPI.server()}.dwar.ru/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&ajax=1${rnd_url}", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache"
          },
          "referrer": "http://${window.myAPI.server()}.dwar.ru/user_iframe.php?group=2",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
         })`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function equipRequest(id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random());
    let req =
        `fetch("http://${window.myAPI.server()}.dwar.ru/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&artifact_id=${id}&in[slot_num]=0&in[variant_effect]=0&ajax=1${rnd_url}", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache"
          },
          "referrer": "http://${window.myAPI.server()}.dwar.ru/user_iframe.php?group=2",
          "referrerPolicy": "no-referrer-when-downgrade",
          "body": null,
          "method": "GET",
          "mode": "cors",
          "credentials": "include"
        })`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}
