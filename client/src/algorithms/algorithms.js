import { ConflictExpert_api, StrategyExpert_api, StrategyRecommendation_api } from './methods_api'
import { ConflictExpert_csv, StrategyExpert_csv, StrategyRecommendation_csv } from './methods_csv'
import { ConflictExpert_json, StrategyExpert_json, StrategyRecommendation_json } from './methods_json'


function ConflictExpert({ reason, weapons_at_scene, shots_fired }, csvCallback, apiSnapCallback) {
    ConflictExpert_csv({ reason, weapons_at_scene, shots_fired}, (experts) => {
        return csvCallback(experts)
    })
    ConflictExpert_json({ reason, weapons_at_scene, shots_fired }, (experts) => {
        return apiSnapCallback(experts)
    })
}

function StrategyExpert({ strategy }, callback) {
}

function StrategyRecommendation({ reason, weapons_at_scene, shots_fired, num_persons, num_groups }, csvCallback, apiSnapCallback, apiCallback) {
    StrategyRecommendation_csv({ reason, weapons_at_scene, shots_fired, num_persons, num_groups }, experts => {
        csvCallback(experts)
    })
    StrategyRecommendation_json({ reason, weapons_at_scene, shots_fired, num_persons, num_groups }, experts => {
        apiSnapCallback(experts)
    })
}

export { ConflictExpert, StrategyExpert, StrategyRecommendation }