import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Jadval from './components/jadval/jadval';
import Lesson from './router/lesson/lesson';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Jadval />} />
        <Route path="/lesson/:teacherName" element={<Lesson />} />
      </Routes>
    </div>
  );
}

export default App;
