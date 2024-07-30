import React from 'react';
import Graph from './components/graph'
import Login from './components/login'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/graph' element={<Graph/>} />
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App;
