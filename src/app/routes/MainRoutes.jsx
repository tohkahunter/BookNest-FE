import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Log In";
import BookDetail from "../pages/BookDetails/BookDetail";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfilePage from "../pages/Profile/ProfilePage";

import LoginLayout from "../layout/AuthLayout";
import MainLayout from "../layout/MainLayout";
import GenresList from "../pages/Genres";
import Categories from "../pages/Categories/Categories";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <LoginLayout>
              <Login />
            </LoginLayout>
          }
        />
        <Route
          path="/book/:id"
          element={
            <MainLayout>
              <BookDetail />
            </MainLayout>
          }
        />

        <Route
          path="/categories"
          element={
            <MainLayout>
              <GenresList />
            </MainLayout>
          }
        />
        <Route
          path="/categories/:genre"
          element={
            <MainLayout>
              <Categories />
            </MainLayout>
          }
        />

        <Route
          path="/genres"
          element={
            <MainLayout>
              <GenresList />
            </MainLayout>
          }
        />

        <Route
          path="/browse/genres"
          element={
            <MainLayout>
              <GenresList />
            </MainLayout>
          }
        />

        <Route
          path="/genres/:genre"
          element={
            <MainLayout>
              <Categories />
            </MainLayout>
          }
        />

        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
