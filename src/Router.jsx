// Router.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "/src/assets/styles/Router.css";
import Loader from "./components/Loader";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Purchases from "./pages/Purchases";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoutes from "./pages/ProtectedRoutes";
import LogIn from "./pages/LogIn";
import Cart from "./components/Cart";
import Register from "./pages/Register";
import MyAccount from "./pages/MyAccount";
import ResetPassword from "./pages/ResetPassword";
import ResetPasswordForm from "./pages/ResetPasswordForm";
import ChangePassword from "./pages/ChangePassword";

function Router() {
  const isLoading = useSelector((state) => state.isLoading);
  const [launch, setLaunch] = useState(true);

  return (
    <BrowserRouter>
    <ErrorBoundary>
      <Navbar />
      {isLoading && <Loader />}
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/cart" element={<Cart sendLaunch={setLaunch} launch={true} />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>
      </Routes>
      <Footer /></ErrorBoundary>
    </BrowserRouter>
  );
}

export default Router;
