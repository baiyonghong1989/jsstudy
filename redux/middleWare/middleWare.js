const loggerMiddleWare = (store) => (next) => (action) => {
  console.log("this.satte", store.getState());
  console.log("action", action);
  next(action);
};

const exceptionMiddleWare = (store) => (next) => (action) => {
  try {
    next(action);
  } catch (err) {
    console.log("err", err);
  } finally {
    console.log("catch exception end");
  }
};

const timeMiddleWare = (store) => (next) => (action) => {
  console.log("date begin", Date.now());
  next(action);
  console.log("date end", Date.now());
};

export { loggerMiddleWare, exceptionMiddleWare, timeMiddleWare };
