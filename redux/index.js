import infoReducer from './infoRecuder.js'
import counterReducer from './counterReducer.js';
import combineReducers from './reducer.js'

let reducer = combineReducers({infoReducer,counterReducer});
let store = new Store(reducer);
store.subscribe(()=>{
    console.log('afa')
})
store.dispatch({type:'INCREMENT'})
console.log(store.getState())
