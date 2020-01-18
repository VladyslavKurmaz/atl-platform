import React from 'react';
import { /*BrowserRouter as Router,*/ Switch, Route/*, Link, Redirect*/ } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import Landing from './pages/Landing/Landing';
import Home from './pages/Home/Home';

document.body.classList.add('container-fluid', 'p-0', 'h-100');

function App() {
  return (
    <div className="App d-flex flex-column h-100">
      <Navbar hostUrl="." titleShort="atlas" titleLong="atlas"/>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route exact path='/home' component={Home} />
      </Switch>
      <Footer version="v20.1.0"/>
    </div>
  );
}

export default App;
