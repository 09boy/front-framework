import './style';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const HomeScreen = lazy(() => import('./pages/home'));
const AboutScreen = lazy(() => import('./pages/about'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path='/' element={<HomeScreen />} />
          <Route path='/about' element={<AboutScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}