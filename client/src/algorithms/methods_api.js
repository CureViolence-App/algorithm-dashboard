const apiURL = 'http://localhost:8080'

const apiCalls = {
    ConflictExpert: {
        url: 'https://api.civicore.com/cure/api/v3/data/conMediation',
        query: {
            key: '',
            fields: ["users_id", "b6fWeaponIsThoughtToBe", "b4primaryReasonForConflict", "b9aShotsFired", "regions_id", "lastName", "firstName", "b14OutcomeOfMediation"],
            where: {
                "whereType": "AND",
                "clauses": [
                    {
                        "whereType": "OR",
                        "clauses": [
                            {
                                "fieldName": "b14OutcomeOfMediation",
                                "operator": "=",
                                "operand": "730"
                            },
                            {
                                "fieldName": "b14OutcomeOfMediation",
                                "operator": "=",
                                "operand": "1038"
                            },
                            {
                                "fieldName": "b14OutcomeOfMediation",
                                "operator": "=",
                                "operand": "731"
                            }
                        ]
                    },
                    {
                        "fieldName": "regions_id",
                        "operator": "=",
                        "operand": "1",
                        "type": "id"
                    },
                    {
                        "fieldName": "b4primaryReasonForConflict",
                        "operator": "=",
                        "operand": "710"
                    },
                    {
                        "fieldName": "b6fWeaponIsThoughtToBe",
                        "operator": "=",
                        "operand": "426"
                    },
                    {
                        "fieldName": "b9aShotsFired",
                        "operator": "=",
                        "operand": "427"
                    }
                ]

            }
        }
    }
}

function getAPIData(type, callback) {
    fetch(apiURL, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }),
        body: JSON.stringify(apiCalls[type])
    })
    .then(res => {
        return res.json()
    })
    .then(data => {
        callback(data)
    })
}

function ConflictExpert_api() {

}

function StrategyExpert_api() {

}

function StrategyRecommendation_api() {

}

export { ConflictExpert_api, StrategyExpert_api, StrategyRecommendation_api, All_api }