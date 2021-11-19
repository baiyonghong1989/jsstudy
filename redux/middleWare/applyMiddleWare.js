const applyMiddleWare = (...middleWares) =>{
    return (oldStore) =>{
        return (reducer,initState)=>{
            let store = new oldStore(reducer,initState);
            let simpleStore = {getState:store.getState};
            let chain = middleWares.map(middleWare =>
                middleWare(simpleStore)
            )
            let dispatch = store.dispatch.bind(store);
            chain.map(middleWare => 
                dispatch = middleWare(dispatch)
            )
            store.dispatch = dispatch;
            return store;
        }

    }
}

export default applyMiddleWare;