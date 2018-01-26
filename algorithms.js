import csv from 'csvtojson'

function loadCSV(callback) {
    let xobj = new XMLHttpRequest()
    xobj.overrideMimeType('application/css')
    xobj.open('GET', './mediations.csv', true)
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            callback(xobj.responseText)
        }
    }
    xobj.send(null)
}

function getData(callback, done) {
    return loadCSV( csvAsText => {
        csv()
            .fromString(csvAsText)
            .on('json', callback)
            .on('done', done)
    })
}

function ConflictExpert({ reason, weapons_at_scene, shots_fired }, callback) {
    const experts = []
    const cache = {}

    getData(handleData, done)

    function handleData(obj) {
        let filtered = (
            obj.name === 'Chicago' &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            ) &&
            obj.reason  === reason &&
            obj.weapon === weapons_at_scene &&
            obj.shots  === shots_fired
        )
        if (filtered) { //hello
            if (!cache[obj.id]){
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
    getData(handleData, done)

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
            if (!cache[obj.id]){
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

function MediationRecommendation({ reason, weapons_at_scene, shots_fired }, callback) {
    const cache = {}
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

    getData(handleData, done)

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
    /*
        return (
            (
                obj.buy_time === 'Very Effective' ||
                obj.buy_time === 'Somewhat Effective'
            ) ||
            (
                obj.change_location === 'Very Effective' ||
                obj.change_location === 'Somewhat Effective'
            ) ||
            (
                obj.constructive_shadowing === 'Very Effective' ||
                obj.constructive_shadowing === 'Somewhat Effective'
            ) ||
            (
                obj.cv_participants === 'Very Effective' ||
                obj.cv_participants === 'Somewhat Effective'
            ) ||
            (
                obj.de_escalating === 'Very Effective' ||
                obj.de_escalating === 'Somewhat Effective'
            ) ||
            (
                obj.family_friends === 'Very Effective' ||
                obj.family_friends === 'Somewhat Effective'
            ) ||
            (
                obj.focus_on_consequences === 'Very Effective' ||
                obj.focus_on_consequences === 'Somewhat Effective'
            ) ||
            (
                obj.information_gathering === 'Very Effective' ||
                obj.information_gathering === 'Somewhat Effective'
            ) ||
            (
                obj.keep_credibility === 'Very Effective' ||
                obj.keep_credibility=== 'Somewhat Effective'
            ) ||
            (
                obj.middle_man === 'Very Effective' ||
                obj.middle_man === 'Somewhat Effective'
            ) ||
            (
                obj.other === 'Very Effective' ||
                obj.other === 'Somewhat Effective'
            ) ||
            (
                obj.other_cv_staff === 'Very Effective' ||
                obj.other_cv_staff === 'Somewhat Effective'
            ) ||
            (
                obj.reaching_agreement === 'Very Effective' ||
                obj.reaching_agreement === 'Somewhat Effective'
            ) ||
            (
                obj.reasoning === 'Very Effective' ||
                obj.reasoning === 'Somewhat Effective'
            ) ||
            (
                obj.change_location === 'Very Effective' ||
                obj.change_location === 'Somewhat Effective'
            )
        )
        */
    }

    function handleData(obj) {
        let filtered = (
            obj.name === 'Chicago' &&
            (
                obj.outcome === 'Conflict resolved' ||
                obj.outcome === 'ConflictÂ resolvedÂ asÂ longÂ asÂ certainÂ conditionsÂ areÂ met' ||
                obj.outcome === 'Conflict resolved temporarily'
            ) &&
            (
                checkStrategies(obj) // if equals 'Very Effective' or 'Somewhat Effective'
            ) &&
            (
                obj.reason = reason,
                obj.weapon = weapons_at_scene,
                obj.shots = shots_fired
            )
        )
        if (filtered) {
            console.log(obj.id)
            /*
            cache = {

            }
            if (!cache[obj.strategy]){
                cache[obj.strategy] = experts.length
                return mediations.push({
                    strategy: obj.strategy,
                    count: 1
                })
            }
            let pos = cache[obj.strategy]
            mediations[pos].count++
            */
        }
    }

    function done(err) {
        if (err) return console.log(err)
        mediations.sort((a, b) => {
            return b.count - a.count
        })
        return callback(mediations)
    }
}

export { ConflictExpert, StrategyExpert, MediationRecommendation }
