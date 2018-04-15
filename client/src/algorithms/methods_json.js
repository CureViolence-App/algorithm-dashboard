const apiURL = 'http://localhost:8080'
const fk = require('./foreign_keys')

let JSONInTextForm = ''

function loadJSON(callback) {
    // If JSON already loaded
    if (JSONInTextForm) return callback(JSONInTextForm)

    let xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/json')
    xobj.open('GET', 'data/mediations.json', true)
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            JSONInTextForm = xobj.responseText
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}

function getJSONData(callback, done) {
    return loadJSON(JSONAsText => {
        let JSONData = JSON.parse(JSONAsText)
        for (let i = 0; i < JSONData.length; i++) {
            callback(JSONData[i])
        }
        done()
    })
}

function dataIsUpToDate() {

}

function ConflictExpert_json({ reason, weapons_at_scene, shots_fired }, callback) {
    const experts = []
    const cache = {}

    getJSONData(handleData, done)

    function handleData(obj) {
        if (obj === null) return

        let filtered = (
            obj &&
            (
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_as_long_as_certain_conditions_are_met'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_temporarily']
            ) &&
            obj.b4primaryReasonForConflict.value === fk[reason] &&
            obj.b6fWeaponIsThoughtToBe.value === fk[weapons_at_scene] &&
            obj.b9aShotsFired.value === fk[shots_fired]
        )

        if (filtered) {
            if (!cache[obj.users_id.value]) {
                cache[obj.users_id.value] = experts.length
                return experts.push({
                    id: obj.users_id.value,
                    count: 1,
                    full_name: obj.users_id.displayValue
                })
            }
            let pos = cache[obj.users_id.value]
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

function StrategyExpert_json({ strategy }, callback) {
    const experts = []
    const cache = {}

    const strat_convert = {
        buy_time: 'strat_buyTime',
        change_location: 'strat_changeLocation',
        constructive_shadowing: 'strat_constructiveShadowing',
        keep_credibility: 'strat_createdOpportunityToKeepCredibility',
        de_escalating: 'strat_deescalatingTheSituation',
        focus_on_consequences: 'strat_focusOnConsequences',
        information_gathering: 'strat_informationGathering',
        middle_man: 'strat_middleMan',
        reaching_agreement: 'strat_reachingAgreementSettlingConflict',
        reasoning: 'strat_reasoningProvidingNonviolentAlternativeSolutions',
        other_cv_staff: 'strat_usingCVStaffFromOtherSites',
        family_friends: 'strat_usingFamilyOrFriendsOfPartiesInvolved',
        cv_participants: 'strat_usingOtherCVParticipants'
    }

    getJSONData(handleData, done)

    function handleData(obj) {
        let filtered = (
            obj &&
            (
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_as_long_as_certain_conditions_are_met'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_temporarily']
            ) &&
            (
                obj[strat_convert[strategy]].value == fk['very_effective'] ||
                obj[strat_convert[strategy]].value == fk['somewhat_effective']
            )
        )
        if (filtered) {
            if (!cache[obj.users_id.value]) {
                cache[obj.users_id.value] = experts.length
                return experts.push({
                    id: obj.users_id.value,
                    count: 1,
                    full_name: obj.users_id.displayValue
                })
            }
            let pos = cache[obj.users_id.value]
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

function StrategyRecommendation_json({ reason, num_groups, num_persons, weapons_at_scene, shots_fired, no_num_persons, no_num_groups }, callback) {

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
            obj &&
            (
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_as_long_as_certain_conditions_are_met'] ||
                obj.b14OutcomeOfMediation.value === fk['conflict_resolved_temporarily']
            ) &&
            obj.b4primaryReasonForConflict.value === fk[reason] &&
            obj.b6fWeaponIsThoughtToBe.value === fk[weapons_at_scene] &&
            obj.b9aShotsFired.value === fk[shots_fired] &&
            obj.b3numberOfPeopleInvolvedInTheConflict !== '' &&
            obj.b3numberOfPeopleInvolvedInTheConflict.value >= numPersonsRange.start &&
            obj.b3numberOfPeopleInvolvedInTheConflict.value <= numPersonsRange.end &&
            obj.b3ifGroupCliqueGangCcrew.value !== '' &&
            obj.b3ifGroupCliqueGangCcrew.value >= numGroupsRange.start &&
            obj.b3ifGroupCliqueGangCcrew.value <= numGroupsRange.end
        )

        if (filtered) {

            count++

            if (obj.strat_buyTime.value == fk.very_effective) {
                strategies.strat_buyTime.true++
            } else if (obj.strat_buyTime.value == fk.somewhat_effective || obj.strat_buyTime.value == fk.not_effective) {
                strategies.strat_buyTime.false++
            }

            if (obj.strat_changeLocation.value == fk.very_effective) {
                strategies.strat_changeLocation.true++
            } else if (obj.strat_changeLocation.value == fk.somewhat_effective || obj.strat_changeLocation.value == fk.not_effective) {
                strategies.strat_changeLocation.false++
            }

            if (obj.strat_constructiveShadowing.value == fk.very_effective) {
                strategies.strat_constructiveShadowing.true++
            } else if (obj.strat_constructiveShadowing.value == fk.somewhat_effective || obj.strat_constructiveShadowing.value == fk.not_effective) {
                strategies.strat_constructiveShadowing.false++
            }

            if (obj.strat_createdOpportunityToKeepCredibility.value == fk.very_effective) {
                strategies.strat_createdOpportunityToKeepCredibility.true++
            } else if (obj.strat_createdOpportunityToKeepCredibility.value == fk.somewhat_effective || obj.strat_createdOpportunityToKeepCredibility.value == fk.not_effective) {
                strategies.strat_createdOpportunityToKeepCredibility.false++
            }

            if (obj.strat_deescalatingTheSituation.value == fk.very_effective) {
                strategies.strat_deescalatingTheSituation.true++
            } else if (obj.strat_deescalatingTheSituation.value == fk.somewhat_effective || obj.strat_deescalatingTheSituation.value == fk.not_effective) {
                strategies.strat_deescalatingTheSituation.false++
            }

            if (obj.strat_focusOnConsequences.value == fk.very_effective) {
                strategies.strat_focusOnConsequences.true++
            } else if (obj.strat_focusOnConsequences.value == fk.somewhat_effective || obj.strat_focusOnConsequences.value == fk.not_effective) {
                strategies.strat_focusOnConsequences.false++
            }

            if (obj.strat_informationGathering.value == fk.very_effective) {
                strategies.strat_informationGathering.true++
            } else if (obj.strat_informationGathering.value == fk.somewhat_effective || obj.strat_informationGathering.value == fk.not_effective) {
                strategies.strat_informationGathering.false++
            }

            if (obj.strat_middleMan.value == fk.very_effective) {
                strategies.strat_middleMan.true++
            } else if (obj.strat_middleMan.value == fk.somewhat_effective || obj.strat_middleMan.value == fk.not_effective) {
                strategies.strat_middleMan.false++
            }

            /*
            if (obj.strat_other.value == fk.very_effective) {
                strategies.strat_other.true++
            } else if (obj.strat_other.value == fk.somewhat_effective || obj.strat_other.value == fk.not_effective) {
                strategies.strat_other.false++
            }

            if (obj.strat_otherStrategy.value == fk.very_effective) {
                strategies.strat_otherStrategy.true++
            } else if (obj.strat_otherStrategy.value == fk.somewhat_effective || obj.strat_otherStrategy.value == fk.not_effective) {
                strategies.strat_otherStrategy.false++
            }
            */

            if (obj.strat_reachingAgreementSettlingConflict.value == fk.very_effective) {
                strategies.strat_reachingAgreementSettlingConflict.true++
            } else if (obj.strat_reachingAgreementSettlingConflict.value == fk.somewhat_effective || obj.strat_reachingAgreementSettlingConflict.value == fk.not_effective) {
                strategies.strat_reachingAgreementSettlingConflict.false++
            }

            if (obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == fk.very_effective) {
                strategies.strat_reasoningProvidingNonviolentAlternativeSolutions.true++
            } else if (obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == fk.somewhat_effective || obj.strat_reasoningProvidingNonviolentAlternativeSolutions.value == fk.not_effective) {
                strategies.strat_reasoningProvidingNonviolentAlternativeSolutions.false++
            }

            if (obj.strat_usingCVStaffFromOtherSites.value == fk.very_effective) {
                strategies.strat_usingCVStaffFromOtherSites.true++
            } else if (obj.strat_usingCVStaffFromOtherSites.value == fk.somewhat_effective || obj.strat_usingCVStaffFromOtherSites.value == fk.not_effective) {
                strategies.strat_usingCVStaffFromOtherSites.false++
            }

            if (obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == fk.very_effective) {
                strategies.strat_usingFamilyOrFriendsOfPartiesInvolved.true++
            } else if (obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == fk.somewhat_effective || obj.strat_usingFamilyOrFriendsOfPartiesInvolved.value == fk.not_effective) {
                strategies.strat_usingFamilyOrFriendsOfPartiesInvolved.false++
            }

            if (obj.strat_usingOtherCVParticipants.value == fk.very_effective) {
                strategies.strat_usingOtherCVParticipants.true++
            } else if (obj.strat_usingOtherCVParticipants.value == fk.somewhat_effective || obj.strat_usingOtherCVParticipants.value == fk.not_effective) {
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

export { ConflictExpert_json, StrategyExpert_json, StrategyRecommendation_json, test_json }