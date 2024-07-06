import './App.css'
import TodoList from './pages/TodoList'
import { useState } from 'react'
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom"
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import VerificatedAccount from './pages/VerificatedAccount'
import Error from './pages/Error'


function App() {


  return (

    <BrowserRouter>

      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/activate/:token' element={<VerificatedAccount />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/settings' element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path='/todos' element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>

        } />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App;
