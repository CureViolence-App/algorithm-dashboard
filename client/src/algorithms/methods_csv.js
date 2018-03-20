import csv from 'csvtojson'

let csvInTextForm = ''

function loadCSV(callback) {
    // If csv already loaded
    if (csvInTextForm) return callback(csvInTextForm)

    let xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/css')
    xobj.open('GET', 'data/mediations.csv', true)
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

function ConflictExpert_csv({ reason, weapons_at_scene, shots_fired }, callback) {
    const experts = []
    const cache = {}

    getCSVData(handleData, done)

    function handleData(obj) {
        let filtered = (
            obj.name === 'Chicago' &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            ) &&
            obj.reason === reason &&
            obj.weapon === weapons_at_scene &&
            obj.shots === shots_fired
        )

        if (filtered) {
            if (!cache[obj.id]) {
                cache[obj.id] = experts.length
                return experts.push({
                    id: obj.id,
                    count: 1,
                    first_name: obj.first_name,
                    last_name: obj.last_name
                })
            }
            let pos = cache[obj.id]
            experts[pos].count++
        }
    }

    function done(err) {
        if (err) return console.log(err)
        experts.sort((a, b) => {
            return b.count - a.count
        })
        return callback(experts)
    }
}

function StrategyExpert_csv({ strategy }, callback) {
    const experts = []
    const cache = {}
    getCSVData(handleData, done)

    function handleData(obj) {
        let filtered = (
            obj.name === 'Chicago' &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            ) &&
            (
                obj[strategy] === 'Very Effective' ||
                obj[strategy] === 'Somewhat Effective'
            )
        )
        if (filtered) {
            if (!cache[obj.id]) {
                cache[obj.id] = experts.length
                return experts.push({
                    id: obj.id,
                    count: 1,
                    first_name: obj.first_name,
                    last_name: obj.last_name
                })
            }
            let pos = cache[obj.id]
            experts[pos].count++
        }
    }

    function done(err) {
        if (err) return console.log(err)
        experts.sort((a, b) => {
            return b.count - a.count
        })
        return callback(experts)
    }
}

function StrategyRecommendation_csv({ reason, num_groups, num_persons, weapons_at_scene, shots_fired, no_num_persons, no_num_groups }, callback) {

    let numGroupsRange = {}
    if (no_num_groups) {
        numGroupsRange.start = 0
        numGroupsRange.end = Number.MAX_VALUE
    } else if (num_groups === '0') {
        numGroupsRange.start = 0
        numGroupsRange.end = 0
    } else if (num_groups === '1') {
        numGroupsRange.start = 1
        numGroupsRange.end = 1
    } else if (num_groups === '2+') {
        numGroupsRange.start = 2
        numGroupsRange.end = Number.MAX_VALUE
    }

    let numPersonsRange = {}
    if (no_num_persons) {
        numPersonsRange.start = 0,
        numPersonsRange.end = Number.MAX_VALUE
    }
    else if (num_persons === '1-2') {
        numPersonsRange.start = 1
        numPersonsRange.end = 2
    } else if (num_persons === '3-19') {
        numPersonsRange.start = 3
        numPersonsRange.end = 19
    } else if (num_persons === '20+') {
        numPersonsRange.start = 20
        numPersonsRange.end = Number.MAX_VALUE
    }

    let strategies = {
        strat_buyTime: {
            true: 0,
            false: 0
        },
        strat_changeLocation: {
            true: 0,
            false: 0
        },
        strat_constructiveShadowing: {
            true: 0,
            false: 0
        },
        strat_createdOpportunityToKeepCredibility: {
            true: 0,
            false: 0,
        },
        strat_deescalatingTheSituation: {
            true: 0,
            false: 0
        },
        strat_focusOnConsequences: {
            true: 0,
            false: 0
        },
        strat_informationGathering: {
            true: 0,
            false: 0
        },
        strat_middleMan: {
            true: 0,
            false: 0
        },
        /*
        strat_other: {
            true: 0,
            false: 0
        },
        strat_otherStrategy: {
            true: 0,
            false: 0
        },
        */
        strat_reachingAgreementSettlingConflict: {
            true: 0,
            false: 0
        },
        strat_reasoningProvidingNonviolentAlternativeSolutions: {
            true: 0,
            false: 0
        },
        strat_usingCVStaffFromOtherSites: {
            true: 0,
            false: 0
        },
        strat_usingFamilyOrFriendsOfPartiesInvolved: {
            true: 0,
            false: 0
        },
        strat_usingOtherCVParticipants: {
            true: 0,
            false: 0
        }
    }

    let count = 0;

    getJSONData(handleData, done)

    function handleData(obj) {

        let filtered = (
            obj.name === 'Chicago' &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            ) &&
            obj.reason === reason &&
            obj.weapon === weapons_at_scene &&
            obj.shots === shots_fired &&
            obj.num_people !== '' &&
            obj.num_people >= numPersonsRange.start &&
            obj.num_people <= numPersonsRange.end &&
            obj.num_groups !== '' &&
            obj.num_groups >= numGroupsRange.start &&
            obj.num_groups <= numGroupsRange.end
        )

        if (filtered) {

            count++

            if (obj.buy_time == 'Very Effective') {
                strategies.strat_buyTime.true++
            } else if (obj.buy_time.value == 'Somewhat Effective' || obj.buy_time == 'Not Effective') {
                strategies.strat_buyTime.false++
            }

            if (obj.change_location == 'Very Effective') {
                strategies.strat_changeLocation.true++
            } else if (obj.change_location == 'Somewhat Effective' || obj.change_location == 'Not Effective') {
                strategies.strat_changeLocation.false++
            }

            if (obj.constructive_shadowing == 'Very Effective') {
                strategies.strat_constructiveShadowing.true++
            } else if (obj.constructive_shadowing == 'Somewhat Effective' || obj.constructive_shadowing == 'Not Effective') {
                strategies.strat_constructiveShadowing.false++
            }

            if (obj.keep_credibility == 'Very Effective') {
                strategies.strat_createdOpportunityToKeepCredibility.true++
            } else if (obj.keep_credibility == 'Somewhat Effective' || obj.keep_credibility == 'Not Effective') {
                strategies.strat_createdOpportunityToKeepCredibility.false++
            }

            if (obj.de_escalating == 'Very Effective') {
                strategies.strat_deescalatingTheSituation.true++
            } else if (obj.de_escalating == 'Somewhat Effective' || obj.de_escalating == 'Not Effective') {
                strategies.strat_deescalatingTheSituation.false++
            }

            if (obj.strat_focusOnConsequences.value == 'Very Effective') {
                strategies.strat_focusOnConsequences.true++
            } else if (obj.strat_focusOnConsequences.value == 'Somewhat Effective' || obj.strat_focusOnConsequences.value == 'Not Effective') {
                strategies.strat_focusOnConsequences.false++
            }

            if (obj.strat_informationGathering.value == 'Very Effective') {
                strategies.strat_informationGathering.true++
            } else if (obj.strat_informationGathering.value == 'Somewhat Effective' || obj.strat_informationGathering.value == 'Not Effective') {
                strategies.strat_informationGathering.false++
            }

            if (obj.strat_middleMan.value == 'Very Effective') {
                strategies.strat_middleMan.true++
            } else if (obj.strat_middleMan.value == 'Somewhat Effective' || obj.strat_middleMan.value == 'Not Effective') {
                strategies.strat_middleMan.false++
            }

            /*
            if (obj.strat_other.value == 'Very Effective') {
                strategies.strat_other.true++
            } else if (obj.strat_other.value == 'Somewhat Effective' || obj.strat_other.value == 'Not Effective') {
                strategies.strat_other.false++
            }

            if (obj.strat_otherStrategy.value == 'Very Effective') {
                strategies.strat_otherStrategy.true++
            } else if (obj.strat_otherStrategy.value == 'Somewhat Effective' || obj.strat_otherStrategy.value == 'Not Effective') {
                strategies.strat_otherStrategy.false++
            }
            */

            if (obj.strat_reachingAgreementSettlingConflict.value == 'Very Effective') {
                strategies.strat_reachingAgreementSettlingConflict.true++
            } else if (obj.strat_reachingAgreementSettlingConflict.value == 'Somewhat Effective' || obj.strat_reachingAgreementSettlingConflict.value == 'Not Effective') {
                strategies.strat_reachingAgreementSettlingConflict.false++
            }

            if (obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == 'Very Effective') {
                strategies.strat_reasoningProvidingNonviolentAlternativeSolutions.true++
            } else if (obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == 'Somewhat Effective' || obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == 'Not Effective') {
                strategies.strat_reasoningProvidingNonviolentAlternativeSolutions.false++
            }

            if (obj.strat_usingCVStaffFromOtherSites.value == 'Very Effective') {
                strategies.strat_usingCVStaffFromOtherSites.true++
            } else if (obj.strat_usingCVStaffFromOtherSites.value == 'Somewhat Effective' || obj.strat_usingCVStaffFromOtherSites.value == 'Not Effective') {
                strategies.strat_usingCVStaffFromOtherSites.false++
            }

            if (obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == 'Very Effective') {
                strategies.strat_usingFamilyOrFriendsOfPartiesInvolved.true++
            } else if (obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == 'Somewhat Effective' || obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == 'Not Effective') {
                strategies.strat_usingFamilyOrFriendsOfPartiesInvolved.false++
            }

            if (obj.strat_usingOtherCVParticipants.value == 'Very Effective') {
                strategies.strat_usingOtherCVParticipants.true++
            } else if (obj.strat_usingOtherCVParticipants.value == 'Somewhat Effective' || obj.strat_usingOtherCVParticipants.value == 'Not Effective') {
                strategies.strat_usingOtherCVParticipants.false++
            }
        }
    }

    function done(err) {
        if (err) return console.log(err)

        if (count < 5 && no_num_persons && no_num_groups) {
            return callback({})
        } else if (count < 5 && no_num_persons) {
            let no_num_groups = true
            return StrategyRecommendation_json({ reason, num_groups, num_persons, weapons_at_scene, shots_fired, no_num_persons, no_num_groups }, callback)
        } else if (count < 5)  {
            let no_num_persons = true
            let no_num_groups = false
            return StrategyRecommendation_json({ reason, num_groups, num_persons, weapons_at_scene, shots_fired, no_num_persons, no_num_groups }, callback)
        }

        return callback(strategies)
    }
}

export { ConflictExpert_csv, StrategyExpert_csv, StrategyRecommendation_csv }
