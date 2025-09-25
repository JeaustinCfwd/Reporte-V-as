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
import ReportCreate from '../pages/ReportCreate';
import MapView from '../pages/MapView';
import Dashboard from '../pages/Dashboard';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'reportCreate', element: <ReportCreate /> },
      { path: 'mapview', element: <MapView /> },
      { path: 'dashboard', element: <Dashboard /> },
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
