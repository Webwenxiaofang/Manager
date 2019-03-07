import React, { Component } from 'react';
import {
  HashRouter as Router,//   BrowserRouter
  Route,
  Redirect,
  Switch
} from 'react-router-dom';
import Login from '../Login';
import Main from '../Main';
import NoMatch from '../NoMatch';


class PmpRouter extends Component {
   render() { 
    return (
      <Router >
      <div>
      <Switch> 
      <Route  exact path="/" component={Login}/>
      <Route  exact path="/Login" component={Login}/>
      <Route  path="/Main" component={Main} />
       <Route component={NoMatch}/>
       <Redirect to="/" ></Redirect>
     </Switch>
     </div>
     </Router>
    );
  }
}

export default PmpRouter;
