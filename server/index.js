const express = require('express')
const app = express()
const fetch = require('node-fetch')
global.Headers = global.Headers || require("fetch-headers");
const bodyParser = require('body-parser')
const cors = require('cors')
const FormData = require('form-data')

app.use(cors())
app.use(bodyParser.json())

app.post('/', (req, res) => {
    let query_metadata = req.body

    passToCivicore(query_metadata, (err, data) => {
        if (err) return res.status(500).json('Broke: ' + err)
        else return res.status(200).json(data)
    })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Listening on ' + port)
})

let key = ''

async function isLive() {
    const url = 'https://api.civicore.com/cure/api/v3/whoAmI?key='
    try {
        const res = await fetch(url + key)
        const data = await res.json()
        if (data.status === 'error') {
            return false
        }
        return true
    } catch(e) {
        throw new Error('Error on isLive check: ' + e)
    }
}

async function refresh(callback) {
    const url = 'https://cureviolence.civicore.com/?apiLoginAs=3&json=1'
    const form = new FormData()
    form.append('email', 'ryanwesterberg@gmail.com')
    form.append('password', 'tsgDP#847')
    const options = {
        method: 'POST',
        body: form
    }
    try {
        const res = await fetch(url, options)
        const data = await res.json()
        if (data.error) {
            throw new Error('Error on refresh key: ' + data)
        }
        return data.apiKey
    } catch(e) {
        throw new Error('Error on refresh key: ' + e)
    }
}

async function passToCivicore(query_metadata, callback) {
    let keyIsLive
    try {
        keyIsLive = await isLive()
    } catch (e) {
        callback(e)
    }
    if (!keyIsLive) {
        key = await refresh()
    }
    query_metadata.query.key = key
    
    try {
        const url = query_metadata.url +
        '?key=' + query_metadata.query.key +
        '&fields=' + JSON.stringify(query_metadata.query.fields) +
        '&where=' + JSON.stringify(query_metadata.query.where) +
        '&page=' + (query_metadata.query.page ? query_metadata.query.page : '')
        let response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            })
        })
        let data = await response.json()
        // All is good, pass data to client
        return callback(false, data)
    } catch(e) {
        // Return the error straight to the client
        return callback('Error on civicore api call: ' + e)
    }
}