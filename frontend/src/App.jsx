import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import LearningArea from './pages/LearningArea';
import Login from './pages/Login';
import Header from './components/Header';
import Explore from './pages/Explore';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/learning/:courseId/:lessonId" element={<LearningArea />} />
      </Routes>
    </Router>
  );
}

export default App;
