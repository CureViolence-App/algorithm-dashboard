import csv from 'csvtojson'

const apiURL = 'https://cureviolence.civicore.com/?api='
const apiOpts = '&version=2.0&json='

const apiCalls = {
    getAllUsers: {
        key: '58c97096a25244178ee8e20c9fe1ea51.5.9efe678bfe4b154d3fddc391b44ddf8b.1518627307', function: 'getAll',
        tableName: 'users',
        pageSize: 200,
        fieldList: [
            'userID', 'email', 'firstName', 'lastName', 'regions_sites_id', 'securityProfile_id'
        ],
        whereField: 'positionImport',
        whereFieldValue: 'OW'
    },
    getAllLastMediations: {
        key: '58c97096a25244178ee8e20c9fe1ea51.5.9efe678bfe4b154d3fddc391b44ddf8b.1518627307', function: 'getAll',
        tableName: 'conMediation',
        pageSize: 200,
        fieldList: [
            'id', 'created', 'updated', 'a2address', 'b14OutcomeOfMediation', 'b4primaryReasonForConflict', 'b6fWeaponIsThoughtToBe', 'b9aShotsFired', 'calc_primaryMediator', 'strat_buyTime', 'strat_changeLocation', 'strat_constructiveShadowing', 'strat_deescalatingTheSituation', 'strat_focusOnConsequences', 'strat_informationGathering', 'strat_createdOpportunityToKeepCredibility', 'strat_middleMan', 'strat_reachingAgreementSettlingConflict', 'strat_reasoningProvidingNonviolentAlternativeSolutions', 'strat_usingCVStaffFromOtherSites', 'strat_usingFamilyOrFriendsOfPartiesInvolved', 'strat_usingOtherCVParticipants', 'users_id'
        ]
    }
}

function getAPIData({ type }, callback) {
    fetch(apiURL + JSON.stringify(apiCalls[type]) + apiOpts, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers({
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        })
    })
    .then(res => res.text())
    .then(data => {
        console.log(data)
        callback(data)
    })
}

let csvInTextForm = ''

function loadCSV(callback) {
    // If csv already loaded
    if (csvInTextForm) return callback(csvInTextForm)

    let xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/css')
    xobj.open('GET', 'csv/mediations.csv', true)
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            csvInTextForm = xobj.responseText
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}

function getCSVData(callback, done) {
    return loadCSV(csvAsText => {
        csv().fromString(csvAsText)
            .on('json', callback)
            .on('done', done)
    })
}

export { getAPIData, getCSVData }