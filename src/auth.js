export async function isLive(api) {
    const url = 'https://api.civicore.com/cure/api/v3/whoAmI?key='
    try {
        const res = await fetch(url + '{' + api.key + '}')
        const data = await res.json()
        if (data.status === 'error') {
            return false
        }
    } catch(e) {
        console.log('Error on fetch', e)
    }
}

export async function refresh(api) {
    const url = 'https://cureviolence.civicore.com/?apiLoginAs=5&json=1'
    const options = {
        method: 'POST',
        body: JSON.stringify({
            email: 'ryanwesterberg@gmail.com',
            password: 'tsgDP#847'
        }),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    }
    try {
        const res = await fetch(url, options)
        const data = await res.json()
        if (data.error === 'true') {
            throw new Error(data)
        }
        return {
            key: data.apiKey
        }
    } catch(e) {
        console.log('Error on auth', e)
    }
}