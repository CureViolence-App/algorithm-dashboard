import csv from 'csvtojson'

const apiURL = 'https://cureviolence.civicore.com/?api='
const apiOpts = '&version=2.0&json=true'

const apiCalls = {
    getAllUsers: {
        key: '9a878b36eb9131c2bae9cb682597ed2d.3.9c2c11d4a3f5fd195655c79cb5352e1e.1588186446', function: 'getAll',
        tableName: 'users',
        pageSize: 200,
        fieldList: [
            'userID', 'email', 'firstName', 'lastName', 'regions_sites_id', 'securityProfile_id'
        ],
        whereField: 'positionImport',
        whereFieldValue: 'OW'
    },
    getAllLastMediations: {
        key: '9a878b36eb9131c2bae9cb682597ed2d.3.9c2c11d4a3f5fd195655c79cb5352e1e.1588186446', function: 'getAll',
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
        headers:{
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin':'*'
        }
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
    xobj.open('GET', './mediations.csv', true)
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