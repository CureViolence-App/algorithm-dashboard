import { ConflictExpert, StrategyExpert, MediationRecommendation } from './algorithms.js'

let submit = document.querySelector('input[type="submit"]')
submit.addEventListener('click', runAlgorithm)
let selects = document.querySelectorAll('select')

let loadingDisplay = document.querySelector('.loading-display')
let dataDisplay = document.querySelector('#data')

function getAlgorithmInputs() {
    let inputs = {}
    for (let s of selects) {
        inputs[s.name] = s.value
    }
    return inputs
}

function runAlgorithm() {
    loadingDisplay.classList.add('loading')
    let inputs = getAlgorithmInputs()

    switch (inputs.algorithm) {
        case 'Conflict Expert':
            ConflictExpert({
                reason: inputs.reason,
                weapons_at_scene: inputs.weapons_at_scene,
                shots_fired: inputs.shots_fired
            }, data => {
                dataDisplay.innerHTML = ''
                for (let i of data) {
                    dataDisplay.innerHTML += `
                        <li>${i.first_name} ${i.last_name} <span class="data-count">${i.count}</span></li>
                    `
                }
                loadingDisplay.classList.remove('loading')
            })
            break
        case 'Strategy Expert':
            StrategyExpert({
                strategy: inputs.strategy
            }, data => {
                dataDisplay.innerHTML = ''
                for (let i of data) {
                    dataDisplay.innerHTML += `
                        <li>${i.first_name} ${i.last_name} <span class="data-count">${i.count}</span></li>
                    `
                }
                loadingDisplay.classList.remove('loading')
            })
            break
        case 'Mediation Recommendation':
            MediationRecommendation({
                reason: inputs.reason,
                weapons_at_scene: inputs.weapons_at_scene,
                shots_fired: inputs.shots_fired
            }, data => {
                dataDisplay.innerHTML = ''
                for (let i of data) {
                    dataDisplay.innerHTML += `
                        <li>${i.strategy} <span class="data-count">${i.count}</span></li>
                    `
                }
                loadingDisplay.classList.remove('loading')
            })
            break
        default:
            break
    }
}