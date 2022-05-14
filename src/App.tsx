import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Aggregate, Blog, Codepen, Github, Image, Links, Run } from './icon';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo mr-10" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          <Aggregate width="30" stroke="#096" />
          <Blog width="30" stroke="#096" />
          <Codepen width="30" fill="#096" />
          <Github width="30" fill="#096" />
          <Image width="30" stroke="#096" />
          <Links width="30" stroke="#096" />
          <Run width="30" stroke="#096" />
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
