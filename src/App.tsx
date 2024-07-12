import React from 'react';
import './App.css';
import Body from './components/Body';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import FormComponent from './components/FormComponent';

function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Body></Body>}></Route>
        <Route path="/form" element={<FormComponent />} />
      </Routes>
        
    </Router>
  );
}

export default App;
