import React from 'react';
import Graph from './components/graph'
import Login from './components/login'
import {
  MemoryRouter,
  Routes,
  Route
} from 'react-router-dom';

const App = () => {
  return (
    <div>
      <MemoryRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/graph' element={<Graph/>} />
        </Routes>
      </MemoryRouter>
    </div>

  )
}

export default App;
