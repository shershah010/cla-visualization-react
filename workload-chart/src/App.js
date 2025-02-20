import React from "react";
import Graph from "./components/graph";
import Login from "./components/login";
import Search from "./components/search";
import Tutorial from "./components/tutorial";
import ConsentForm from "./components/consentForm";

import { MemoryRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Graph />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/consent-form" element={<ConsentForm />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
};

export default App;
