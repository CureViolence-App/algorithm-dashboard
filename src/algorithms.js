import { getAPIData, getCSVData } from './get_data.js'

getAPIData({ type: 'getAllUsers' }, data => {
    console.log(data)
})

function ConflictExpert({ reason, weapons_at_scene, shots_fired }, callback) {
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

function StrategyExpert({ strategy }, callback) {
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

function StrategyRecommendation({ reason, weapons_at_scene, shots_fired, num_persons, num_groups }, callback) {
    const cache = {}
    const recommendations = []
    const strategies = [
        'buy_time',
        'change_location',
        'constructive_shadowing',
        'cv_participants',
        'de_escalating',
        'family_friends',
        'focus_on_consequences',
        'information_gathering',
        'keep_credibility',
        'middle_man',
        'other',
        'other_cv_staff',
        'reaching_agreement',
        'reasoning',
        'change_location'
    ]

    getCSVData(handleData, done)

    // Don't need this function, it should count instead
    function checkStrategies(obj) {
        let check = []
        for (let strategy of strategies) {
            if (obj[strategy] === 'Very Effective' || obj[strategy] === 'Somewhat Effective') {
                check.push(true)
            } else {
                check.push(false)
            }
        }
        if (check.includes(true)) {
            return true
        }
        return false
    }

    function handleData(obj) {
        let filtered = (
            obj.name === 'Chicago' &&
            obj.reason === reason &&
            obj.weapon === weapons_at_scene &&
            obj.shots === shots_fired &&
            //checkNumPersons(obj, num_persons) &&
            //checkNumGroups(obj, num_groups) &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            )
            //checkStrategies(obj) // 'Very Effective' or 'Somewhat Effective'
        )
        if (filtered) {
            console.log(obj)
            if (!cache[obj.strategy]) {
                cache[obj.strategy] = recommendations.length
                return recommendations.push({
                    strategy: obj.strategy,
                    count: 1
                })
            }
            let pos = cache[obj.strategy]
            recommendations[pos].count++
        }
    }

    function done(err) {
        if (err) return console.log(err)
        recommendations.sort((a, b) => {
            return b.count - a.count
        })
        return callback(recommendations)
    }
}

export { ConflictExpert, StrategyExpert, StrategyRecommendation }
