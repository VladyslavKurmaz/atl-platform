import React from 'react';
import { BrowserRouter as Router, Switch, Route/*, Link, Redirect*/ } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';

document.body.classList.add('container-fluid', 'p-0', 'h-100');

function App() {
  return (
    <div className="App d-flex flex-column h-100">
      <Navbar hostUrl="." titleShort="MVTs - React" titleLong="Minimum Viable Templates - React"/>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/home' component={Home} />
      </Switch>
      <Footer version="v19.12.0"/>
    </div>
  );
}

export default App;
