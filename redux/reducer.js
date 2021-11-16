import infoReducer from './infoRecuder.js'
import counterReducer from './counterReducer.js';

export default function combineReducers(reducers){
    const reducerKeys = Object.keys(reducers);
    return function combination(state = {},action){
        const nextState = {};
        for (let reducerKey of reducerKeys){
            const reducer = reducers[reducerKey];
            const previousStateForKey = state[reducerKey];
            nextState[reducerKey] = reducer(previousStateForKey,action);
        }
        return nextState;
    }
}


let reducer = combineReducers({infoReducer,counterReducer});
let store = new Store(reducer,{});
store.subscribe(()=>{
    console.log('afa')
})
store.dispatch({type:'INCREMENT'})
console.log(store.getState())
