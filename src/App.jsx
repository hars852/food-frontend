import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Placeorder from './pages/PlaceOrder/Placeorder';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from './pages/Auth/AuthPages';
import ProfilePage from './pages/Profile/ProfilePage';
import Verify from './pages/Verify/Verify';
import MyOrder from './pages/MyOrder/MyOrder';
import Menu from './pages/Menu/MenuPage';
import FoodDetails from './pages/FoodDetails/FoodDetails';
import Reservation from './pages/Reservation/Reservation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {

  return (
    <>
      <ToastContainer position="top-right" />
      
      <div className='app'>
        <Navbar />
        
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeorder' element={<ProtectedRoute><Placeorder /></ProtectedRoute>} />
          <Route path='/verify' element={<Verify/>}/>
          <Route path='/myorder' element={<ProtectedRoute><MyOrder /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/menu/:foodId' element={<FoodDetails />} />
          <Route path='/book-table' element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
        </Routes>
      </div>
      
      <Footer />
    </>
  );
};

export default App;
