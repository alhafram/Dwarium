async function unequipRequest(id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random())
    let req =
        `fetch('${window.myAPI.baseUrl()}/action_run.php?code=PUT_OFF&url_success=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D1%26update_swf%3D1&artifact_id=${id}&ajax=1${rnd_url}', {
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

async function equipRequest(id) {
    var rnd_url = '&_=' + (new Date().getTime() + Math.random())
    let req =
        `fetch('${window.myAPI.baseUrl()}/action_run.php?code=PUT_ON&url_success=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&url_error=user_iframe.php%3Fgroup%3D2%26update_swf%3D1&artifact_id=${id}&in[slot_num]=0&in[variant_effect]=0&ajax=1${rnd_url}', {
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

async function changeStyle(zikkuratId, styleId) {
    let req = `fetch('${window.myAPI.baseUrl()}/action_run.php', {
      'headers': {
        'content-type': 'application/x-www-form-urlencoded',
        'upgrade-insecure-requests': '1'
      },
      'referrer': '${window.myAPI.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${zikkuratId}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1',
      'referrerPolicy': 'no-referrer-when-downgrade',
      'body': 'object_class=ARTIFACT&object_id=${zikkuratId}&action_id=3985&url_success=action_form.php%3Fsuccess%3D1%26default%3DARTIFACT_${zikkuratId}_3985&url_error=action_form.php%3Ffailed%3D1%26default%3DARTIFACT_${zikkuratId}_3985&artifact_id=${zikkuratId}&in%5Bobject_class%5D=ARTIFACT&in%5Bobject_id%5D=${zikkuratId}&in%5Baction_id%5D=3985&in%5Burl_success%5D=action_form.php%3Fsuccess%3D1&in%5Burl_error%5D=action_form.php%3Ffailed%3D1&in%5Bparam_success%5D%5Burl_close%5D=user.php%3Fmode%3Dpersonage%26amp%3Bgroup%3D2%26amp%3Bupdate_swf%3D1&in%5Bclass_id%5D=${styleId}',
      'method': 'POST',
      'mode': 'cors',
      'credentials': 'include'
    }).then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function getMagicSchools(zikkuratId) {
    let req = `fetch(
      '${window.myAPI.baseUrl()}/action_form.php?${Math.random()}&artifact_id=${zikkuratId}&in[param_success][url_close]=user.php%3Fmode%3Dpersonage%26group%3D2%26update_swf%3D1', {
          'headers': {
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7',
              'cache-control': 'max-age=0',
              'upgrade-insecure-requests': '1'
          },
          'referrer': '${window.myAPI.baseUrl()}/user_iframe.php?group=2',
          'referrerPolicy': 'no-referrer-when-downgrade',
          'body': null,
          'method': 'GET',
          'mode': 'cors',
          'credentials': 'include'
      }).then(resp => resp.text())
`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}

async function equipPotionRequest(id, slotNum, variantNum) {
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

async function fetchItem(id) {
    let req = `fetch('${window.myAPI.baseUrl()}/artifact_info.php?artifact_id=${id}').then(resp => resp.text())`
    let res = await window.myAPI.makeRequest({
        id: generateRandomId(),
        req: req
    })
    return res
}