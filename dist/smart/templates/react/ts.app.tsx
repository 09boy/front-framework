import './style';
import { Suspense, lazy, ComponentType } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

type LazyType = { default: ComponentType };

const HomeScreen = lazy(() => import('./pages/home').then((module: LazyType) => module));
const AboutScreen = lazy(() => import('./pages/about').then((module: LazyType) => module));

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