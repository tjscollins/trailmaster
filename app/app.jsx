import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import * as actions from 'actions';
import configure from 'configureStore';

/*----------Components----------*/
import Main from 'Main';

var store = configure();
store.dispatch(actions.generateDungeonLevel(100, 100, 0, true));

ReactDOM.render(
  <Provider store={store}>
  <Main/>
</Provider>, document.getElementById('app'));
