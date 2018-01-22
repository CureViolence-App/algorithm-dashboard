import ConflictExpert from './algorithms.js'

let selects = document.querySelectorAll('select')
for (let s of selects) {
    s.addEventListener('change', runAlgorithm)
}

let dataDisplay = document.querySelector('#data')

runAlgorithm()

function getAlgorithmInputs() {
    let inputs = {}
    for (let s of selects) {
        inputs[s.name] = s.value
    }
    return inputs
}

function runAlgorithm() {
    dataDisplay.innerHTML = 'Loading...'
    let inputs = getAlgorithmInputs()
    let experts = ConflictExpert({
        reason: inputs.reason,
        weapons_at_scene: inputs.weapons_at_scene,
        shots_fired: inputs.shots_fired
    }, data => {
        dataDisplay.innerHTML = ''
        for (let i of data) {
            dataDisplay.innerHTML += `
                <li>${i.count} - ${i.first_name} ${i.last_name}</li>
            `
        }
    })
}