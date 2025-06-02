import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Log In'
import BookDetail from '../pages/BookDetails/BookDetail'

export default function MainRoutes() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book/:id" element={<BookDetail/>}/>
        </Routes>
    </BrowserRouter>
    
  )
}
