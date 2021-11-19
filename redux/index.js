import combineReducers from "./reducer/combineReducer.js";
import counterReducer from "./reducer/counter.js";
import infoReducer from "./reducer/info.js";
import Store from "./Store.js";
import {
  loggerMiddleWare,
  timeMiddleWare,
  exceptionMiddleWare,
} from "./middleWare/middleWare.js";
import applyMiddleWare from "./middleWare/applyMiddleWare.js";
let reducer = combineReducers({ infoReducer, counterReducer });
let newCreateStore = applyMiddleWare(
  loggerMiddleWare,
  timeMiddleWare,
  exceptionMiddleWare
)
const store = new Store(reducer,{},newCreateStore);
let subscription = store.subscribe(() => {
  console.log("afa");
});
store.dispatch({ type: "INCREMENT" });
subscription.unscribe();
console.log(store.getState());
