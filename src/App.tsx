import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const fs = window.require("fs")
  console.log(fs);
  const root = fs.readdirSync('/')
  console.log(root)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit Hello World 增加中文 你好世界！<code>src/App.tsx</code> and save to reload.
        </p>
        {
          root.map((item: any, index: number) => {
            return (
              <p key={index}>{item}</p>
            )
          })
        }
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
