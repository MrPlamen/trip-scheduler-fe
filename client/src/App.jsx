import { Routes, Route, Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import { UserContext } from './contexts/UserContext';
import Header from './components/header/Header';
import Home from './components/home/Home';
import request from './utils/request';
import TripCreate from './components/trip-create/TripCreate';
import Register from './components/register/Register';
import Login from './components/login/Login';
import TripCatalog from './components/trip-catalog/TripCatalog';
import TripDetails from './components/trip-details/TripDetails';
import TripEdit from './components/trip-edit/TripEdit';
import Logout from './components/logout/Logout';
import VisitItemCatalog from './components/item-catalog/VisitItemCatalog';
import VisitItemDetails from './components/item-details/VisitItemDetails';
import Search from './components/search/Search';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './components/not-found/NotFound';
import './App.css';
import AdminPanel from './components/admin-panel/AdminPanel';
import ProfilePage from './components/profile/Profile';

function App() {
  const [authData, setAuthData] = useState(() => {
    const saved = localStorage.getItem("auth");
    return saved ? JSON.parse(saved) : {};
  });

  const userLoginHandler = (resultData) => {
    setAuthData(resultData);
    localStorage.setItem("auth", JSON.stringify(resultData));
  };

  const userLogoutHandler = () => {
    setAuthData({});
    localStorage.removeItem("auth");
  };

  useEffect(() => {
    request.get("http://localhost:8080/users/me")
      .then((user) => {
        if (user?.id) {
          setAuthData(user);
          localStorage.setItem("auth", JSON.stringify(user));
        }
      })
      .catch(() => {
        setAuthData({});
        localStorage.removeItem("auth");
      });
  }, []);

  return (
    <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler }}>
      <div id="hero-header">
        <Header />

        <main id="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/search' element={<Search />} />

            {/* Protected Routes */}
            <Route path='/trips/create' element={
              <PrivateRoute>
                <TripCreate />
              </PrivateRoute>
            } />
            <Route path='/trips/:tripId/edit' element={
              <PrivateRoute>
                <TripEdit />
              </PrivateRoute>
            } />
            <Route path='/trips' element={
              <PrivateRoute>
                <TripCatalog />
              </PrivateRoute>
            } />
            <Route path='/profile' element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
            <Route path='/trips/:tripId/details' element={
              <PrivateRoute>
                <TripDetails />
              </PrivateRoute>
            } />
            <Route path='/visits' element={
              <PrivateRoute>
                <VisitItemCatalog />
              </PrivateRoute>
            } />
            <Route path='/visits/:visitItemId/details' element={
              <PrivateRoute>
                <VisitItemDetails />
              </PrivateRoute>
            } />
            <Route path='/logout' element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />

            {/* Admin Route */}
            <Route path='/admin' element={
              <PrivateRoute requiredRole="ADMIN">
                <AdminPanel />
              </PrivateRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </UserContext.Provider>
  )
}

export default App;
