/*----------React----------*/
import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';
import {configure} from 'configureStore';

/*----------Components----------*/
import MainContainer from 'MainContainer';

/*----------Configure Redux Store----------*/
var store = configure();

ReactDOM.render(
  <Provider store={store}>
  <MainContainer/>
</Provider>, document.getElementById('app'));
