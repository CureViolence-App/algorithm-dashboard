const fs = require('fs')
const fetch = require('node-fetch')

const apiURL = 'http://localhost:8080'

const apiCalls = {
    All: {
        url: 'https://api.civicore.com/cure/api/v3/data/conMediation',
        query: {
            key: '',
            fields: ["users_id", "b6fWeaponIsThoughtToBe", "b4primaryReasonForConflict", "b9aShotsFired", "regions_id", "lastName", "firstName", "b14OutcomeOfMediation", "b3numberOfPeopleInvolvedInTheConflict", "b3ifGroupCliqueGangCcrew", "strat_buyTime","strat_changeLocation","strat_constructiveShadowing","strat_createdOpportunityToKeepCredibility","strat_deescalatingTheSituation","strat_focusOnConsequences","strat_informationGathering","strat_middleMan","strat_other","strat_otherStrategy","strat_reachingAgreementSettlingConflict","strat_reasoningProvidingNonviolentAlternativeSolutions","strat_usingCVStaffFromOtherSites","strat_usingFamilyOrFriendsOfPartiesInvolved","strat_usingOtherCVParticipants"],
            page: 1,
            where: {
                "whereType": "AND",
                "clauses": [
                    {
                        "fieldName": "regions_id",
                        "operator": "=",
                        "operand": "1",
                        "type": "id"
                    }
                ]
            }
        }
    }
}

function getAPIData(type, { page }) {
    let body = apiCalls[type]
    body.query.page = page
    return fetch(apiURL, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        return data
    })
    .catch(err => console.log(err))
}

async function updateData() {
    let allRecords = []
    let checkPageSize
    try {
        checkPageSize = await getAPIData('All', { page: 1 })
    } catch(e) {
        console.log(e)
    }
    const numPages = Math.ceil(checkPageSize.totalRecordCount/100)*10
    
    for (let i=0; i<numPages; i++) {
        let data
        try {
            data = await getAPIData('All', { page: i+1 })
            console.log('Getting page: ' + (i+1))
        } catch(e) {
            console.log(e)
        }
        allRecords = allRecords.concat(data.records)
    }
    
    fs.writeFileSync('build/data/mediations.json', JSON.stringify(allRecords))
}

updateData()