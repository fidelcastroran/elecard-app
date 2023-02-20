import React, { Component } from 'react';
import './App.css';

import Content from './components/Content/Content';
import Footer from './components/Footer';
import Header from './components/Header';

class App extends Component {
  render() {
    return (
      <div>
      <Header/>
      <Content/>
      <Footer/>
    </div>
    );
  }
}

export default App;
