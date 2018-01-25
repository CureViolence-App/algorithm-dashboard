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
            obj[strategy] === 'Very Effective'
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
    const mediations = []
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
                obj.strategy === 'Very Effective' ||
                obj.strategy === 'Somewhat Effective'
            )
        )
        if (filtered) {
            if (!cache[obj.strategy]){
                cache[obj.strategy] = experts.length
                return mediations.push({
                    strategy: obj.strategy,
                    count: 1
                })
            }
            let pos = cache[obj.strategy]
            mediations[pos].count++
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

export { ConflictExpert, StrategyExpert, MediationRecommendation }
