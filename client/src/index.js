<<<<<<< HEAD:client/src/index.js
import { ConflictExpert, StrategyExpert, StrategyRecommendation } from './algorithms/algorithms'

let submit = document.querySelector('input[type="submit"]')
submit.addEventListener('click', runAlgorithm)
let selects = document.querySelectorAll('select')

let algorithmOption = document.querySelector('select[name="algorithm"]')
algorithmOption.addEventListener('change', showInputs)
showInputs({srcElement:{value: 'Conflict Expert'}})

let csvLoading = document.querySelector('#loading-csv')
let apiSnapLoading = document.querySelector('#loading-api-snap')
let apiLiveLoading = document.querySelector('#loading-api-live')
let csvDisplay = document.querySelector('#data-csv')
let apiSnapDisplay = document.querySelector('#data-api-snap')
let apiLiveDisplay = document.querySelector('#data-api-live')

function searchNodeListByName(nodelist, name) {
    for (let i of nodelist) {
        if (i.name === name) return i
    }
    throw new Error('Not found in nodelist')
}

function showInputs(e) {
    switch(e.srcElement.value) {
        case 'Conflict Expert':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "none"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "none"
            break
        case 'Strategy Expert':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "none"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "none"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "none"
            break
        case 'Strategy Recommendation':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "none"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "flex"
            break
    }
}

function getAlgorithmInputs() {
    let inputs = {}
    for (let s of selects) {
        inputs[s.name] = s.value
    }
    return inputs
}

function runAlgorithm() {
    csvLoading.classList.add('loading')
    apiSnapLoading.classList.add('loading')
    apiLiveLoading.classList.add('loading')

    let inputs = getAlgorithmInputs()

    switch (inputs.algorithm) {
        case 'Conflict Expert':
            ConflictExpert({
                reason: inputs.reason,
                weapons_at_scene: inputs.weapons_at_scene,
                shots_fired: inputs.shots_fired
            }, csvData => {
                csvDisplay.innerHTML = ''
                for (let i of csvData) {
                    csvDisplay.innerHTML += `
                        <li>${i.first_name} ${i.last_name} <span class="data-count">${i.count}</span></li>
                    `
                }
                csvLoading.classList.remove('loading')
            }, apiSnapData => {
                apiSnapDisplay.innerHTML = ''
                for (let i of apiSnapData) {
                    apiSnapDisplay.innerHTML += `
                        <li>${i.full_name }<span class="data-count">${i.count}</span></li>
                    `
                }
                apiSnapLoading.classList.remove('loading')
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
        case 'Strategy Recommendation':
            StrategyRecommendation({
                reason: inputs.reason,
                weapons_at_scene: inputs.weapons_at_scene,
                shots_fired: inputs.shots_fired,
                num_persons: inputs.num_persons,
                num_groups: inputs.num_groups,
                no_num_persons: false,
                no_num_groups: false
            }, csvData => {
                
            }, apiSnapData => {
                apiSnapDisplay.innerHTML = ''
                for (let i in apiSnapData) {
                    apiSnapDisplay.innerHTML += `
                        <li><span class="overflow">${i}</span><span class="data-count">${Math.round((apiSnapData[i].true/(apiSnapData[i].true+apiSnapData[i].false))*100) + '%'}</span></li>
                    `
                }
                apiSnapLoading.classList.remove('loading')
            }, apiLiveData => {

            })
            break
        default:
            break
    }
=======
import { ConflictExpert, StrategyExpert, StrategyRecommendation } from './algorithms.js'
import { isLive, refresh } from './auth'

let submit = document.querySelector('input[type="submit"]')
submit.addEventListener('click', runAlgorithm)
let selects = document.querySelectorAll('select')

let algorithmOption = document.querySelector('select[name="algorithm"]')
algorithmOption.addEventListener('change', showInputs)
showInputs({srcElement:{value: 'Conflict Expert'}})

let loadingDisplay = document.querySelector('.loading-display')
let dataDisplay = document.querySelector('#data')

function searchNodeListByName(nodelist, name) {
    for (let i of nodelist) {
        if (i.name === name) return i
    }
    throw new Error('Not found in nodelist')
}

function showInputs(e) {
    switch(e.srcElement.value) {
        case 'Conflict Expert':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "none"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "none"
            break
        case 'Strategy Expert':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "none"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "none"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "none"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "none"
            break
        case 'Strategy Recommendation':
            searchNodeListByName(selects, 'strategy').parentElement.style.display = "none"
            searchNodeListByName(selects, 'reason').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'weapons_at_scene').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'shots_fired').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_persons').parentElement.style.display = "flex"
            searchNodeListByName(selects, 'num_groups').parentElement.style.display = "flex"
            break
    }
}

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
        case 'Strategy Recommendation':
            StrategyRecommendation({
                reason: inputs.reason,
                weapons_at_scene: inputs.weapons_at_scene,
                shots_fired: inputs.shots_fired,
                num_persons: inputs.num_persons,
                num_groups: inputs.num_groups
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
>>>>>>> 35ac0ec57b7292189ee6668c3891ebbdfa4ac67b:src/index.js
}