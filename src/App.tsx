import React from 'react';
import { Route, Routes } from 'react-router-dom'

import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Images from './pages/Image';
import Links from './pages/Links';
import Demos from './pages/Demos';
import AboutMe from './pages/AboutMe';
import Nav from './components/Nav';

function App() {
  return <>
    <Nav />

    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/blogs" element={<Blogs />}></Route>
      <Route path="/images" element={<Images />}></Route>
      <Route path="/links" element={<Links />}></Route>
      <Route path="/demos" element={<Demos />}></Route>
      <Route path="/about-me" element={<AboutMe />}></Route>
    </Routes>
  </>
}

export default App;
