import {} from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/home'
import Prototype from './pages/prototype'
import Prototype2 from './pages/prototype2'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/prototype" element={ <Prototype /> } />
          <Route path="/prototype2" element={ <Prototype2 /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
