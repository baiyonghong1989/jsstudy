export class Store{
    constructor(reducer,initState){
        this.state = initState;
        this.listeners = [];
        this.reducer = reducer;
        this.dispatch({type:Symbol()})
    }
    subscribe(listerner){
        this.listeners.push(listerner);
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