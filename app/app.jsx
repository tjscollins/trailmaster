import React from 'react';
import ReactDOM from 'react-dom';

/*----------Redux----------*/
import {Provider} from 'react-redux';

/*----------Components----------*/
import MainContainer from 'Main'

/*----------Configure Redux Store----------*/
// var store = configure();

ReactDOM.render(
  <MainContainer/>, document.getElementById('app'));
