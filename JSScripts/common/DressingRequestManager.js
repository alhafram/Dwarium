async function unequipRequest(baseUrl, id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random())
    let req =
        `fetch('${baseUrl}/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&ajax=1${rnd_url}', {
          'headers': {
            'accept': '*/*',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
            'cache-control': 'no-cache',
            'pragma': 'no-cache'
          },
          'referrerPolicy': 'no-referrer-when-downgrade',
          'body': null,
          'method': 'GET',
          'mode': 'cors',
          'credentials': 'include'
         }).then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function equipPotionRequest(baseUrl, id, slotNum, variantNum) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random())
    let req = `fetch('${window.myAPI.baseUrl()}/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&in[slot_num]=${slotNum}&in[variant_effect]=${variantNum}&ajax=1&_=${rnd_url}', {
      'headers': {
          'accept': '*/*',
          'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
          'cache-control': 'no-cache',
          'pragma': 'no-cache'
      },
      'referrerPolicy': 'no-referrer-when-downgrade',
      'body': null,
      'method': 'GET',
      'mode': 'cors',
      'credentials': 'include'
      }).then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function fetchItem(baseUrl, id) {
    let req = `fetch('${window.myAPI.baseUrl()}/artifact_info.php?artifact_id=${id}').then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}