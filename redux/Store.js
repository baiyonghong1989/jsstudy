export default class Store{
    constructor(reducer,initState,rewriteCreateStoreFunc){
        if (rewriteCreateStoreFunc){
            let newCreateStore = rewriteCreateStoreFunc(Store);
            return newCreateStore(reducer,initState)
        } else {
            this.state = initState;
            this.listeners = [];
            this.reducer = reducer;
            this.dispatch({type:Symbol()})
        }
    }
    replaceReducer(nextReucer){
        this.reducer = nextReucer;
        this.dispatch({
            type: Symbol()
        })
    }
    subscribe(listerner){
        this.listeners.push(listerner);
        return {
            unscribe:()=>{
                console.log('this',this)
                this.listeners.pop();
            }
        };
    }
    dispatch(action){
        this.state = this.reducer(this.state,action);
        for (let listener of this.listeners){
            listener()
        }
    }
    getState(){
        return this.state;
    }
}

