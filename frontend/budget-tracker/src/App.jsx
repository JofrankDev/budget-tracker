import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from './pages/Auth/SignUp';
import Login from './pages/Auth/Login';
import Home from './pages/Dashboard/Home';
import Expense from './pages/Dashboard/Expense';
import Income from './pages/Dashboard/Income';
import UserProvider from './context/userContext';
import {Toaster} from "react-hot-toast"

const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
          <Route path = "/" element = {<Root />} />
          <Route path = "/login" exact element = {<Login />} />
          <Route path = "/signUp" exact element = {<SignUp />} />
          <Route path = "/dashboard" exact element = {<Home />} />
          <Route path = "/expense" exact element = {<Expense />} />
          <Route path = "/income" exact element = {<Income />} />
        </Routes>
      </Router>
    </div>
    <Toaster
      toastOptions={{
        className: "",
        style: {
          fontsize: '13px',
        },
      }}
    />
    </UserProvider>
  )
}

export default App

const Root = () => {
  // validar si el token brindado existe en el registro de la db
  const isAuthenticated = !!localStorage.getItem("token");

  // redirigir a la ventana del dashboard del usuario si el token es valido de otra manera pal login
  return isAuthenticated ? (
    <Navigate to={"/dashboard"}/>
  ) : (
    <Navigate to={"/login"}/>
  ); 
}