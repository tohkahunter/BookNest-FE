import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Log In'
import BookDetail from '../pages/BookDetails/BookDetail'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MainRoutes() {
  return (
    
    <BrowserRouter>
    <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book/:id" element={<BookDetail/>}/>
        </Routes>
    <Footer/>
    </BrowserRouter>
    
  )
}
