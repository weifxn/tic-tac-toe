import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from './containers/Home'
import Redirect from './containers/Redirect'
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import { Helmet } from 'react-helmet'

function App() {
  return (
    <div className="App">
      <Helmet>
        <title>tic tac toe</title>
        <meta name="description" content="This is a URL shortener website built with ReactJS & Firebase" />
      </Helmet>
      <Router >
        <Route path="/" exact component={Home} />
        <Route path="/:id" exact component={Redirect} />
      </Router>
    </div>
  );
}

export default App;
