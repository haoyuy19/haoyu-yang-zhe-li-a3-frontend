import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MainPage from './MainPage';
import EditPage from './EditPage';

function App() {
  return (
    <div>
      <Router>
        <div className='container'>
          <Switch>
            <Route path='/' exact component={MainPage}></Route>
            <Route path='/:short/edit' component={EditPage}></Route>
            <Route path='/:short' component={MainPage}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
