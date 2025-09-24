import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

function Routing() {
  return <RouterProvider router={router} />;
}

export default Routing;
