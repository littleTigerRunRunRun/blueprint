import {} from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Prototype from './pages/prototype'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/prototype" element={ <Prototype /> } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
